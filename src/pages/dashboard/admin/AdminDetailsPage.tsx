/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { toast } from "sonner";
import { GET_ADMIN_BY_ID } from "../../../graphql/queries/admin";
import { UPDATE_ADMIN_USER } from "../../../graphql/mutations/admin";

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  provider: string | null;
  isActive: boolean;
  phoneNumber: string | null;
  profilePic: string | null;
  isVerified: boolean;
  role: string;
  status: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  permissions: string[];
}

const PERMISSIONS = [
  {
    id: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full system access (overrides all other permissions)",
  },
  {
    id: "READ_USERS",
    label: "Read Users",
    description: "View user information and profiles",
  },
  {
    id: "WRITE_USERS",
    label: "Write Users",
    description: "Create and edit user accounts",
  },
  {
    id: "DELETE_USERS",
    label: "Delete Users",
    description: "Delete user accounts",
  },
  {
    id: "READ_PROPERTIES",
    label: "Read Properties",
    description: "View property listings",
  },
  {
    id: "WRITE_PROPERTIES",
    label: "Write Properties",
    description: "Create and edit properties",
  },
  {
    id: "DELETE_PROPERTIES",
    label: "Delete Properties",
    description: "Delete property listings",
  },
  {
    id: "MANAGE_VERIFICATIONS",
    label: "Manage Verifications",
    description: "Review and approve verifications",
  },
  {
    id: "VIEW_ANALYTICS",
    label: "View Analytics",
    description: "Access analytics and reports",
  },
];

export default function AdminDetailsPage() {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { data, loading, error } = useQuery<{ getAdminUser: AdminUser }>(
    GET_ADMIN_BY_ID,
    {
      variables: { adminId },
    }
  );

  const [updateAdminUser] = useMutation(UPDATE_ADMIN_USER);

  const handleDeleteUser = async () => {
    setLoadingDelete(true);
    try {
      await updateAdminUser({
        variables: {
          adminId,
          input: { status: "DELETED" },
        },
      });
      toast.success("Admin user deleted successfully");
      navigate("/dashboard/admin-users");
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting the user");
    } finally {
      setLoadingDelete(false);
    }
  };

  const getPermissionBadges = (permissions: string[]) => {
    return permissions.map((permission) => (
      <Badge key={permission} variant="secondary" className="text-xs">
        {PERMISSIONS.find((p) => p.id === permission)?.label || permission}
      </Badge>
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !data?.getAdminUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin-users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Users
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Error</h1>
            <p className="text-gray-600">Failed to load admin user details</p>
          </div>
        </div>
      </div>
    );
  }

  const admin = data.getAdminUser;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/admin-users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Users
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {admin.firstName} {admin.lastName}
          </h1>
          <p className="text-gray-600">Admin user details and permissions</p>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Admin Information</CardTitle>
              <CardDescription>
                Personal details and account status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={admin.profilePic || "/placeholder.svg"} />
                  <AvatarFallback>
                    {admin.firstName?.[0]}
                    {admin.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {admin.firstName} {admin.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <Badge
                    className={
                      admin.role === "SUPER_ADMIN"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {admin.role.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge
                    className={
                      admin.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {admin.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="text-sm font-medium">
                    {admin.phoneNumber || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Provider</p>
                  <p className="text-sm font-medium">
                    {admin.provider || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <Badge
                    className={
                      admin.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {admin.isVerified ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="text-sm font-medium">
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-sm font-medium">
                  {admin.address
                    ? `${admin.address}, ${admin.city}, ${admin.state}, ${admin.country}`
                    : "Not provided"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="text-sm font-medium">
                    {new Date(admin.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Updated At</p>
                  <p className="text-sm font-medium">
                    {new Date(admin.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Assigned permissions for this admin user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {admin.permissions.length > 0 ? (
                  getPermissionBadges(admin.permissions)
                ) : (
                  <p className="text-sm text-gray-600">
                    No permissions assigned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage this admin user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full">
                <Link to={`/dashboard/admin-users/${admin.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Link>
              </Button>
              {admin.role !== "SUPER_ADMIN" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={loadingDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Admin User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this admin user? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteUser}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={loadingDelete}
                      >
                        {loadingDelete ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
