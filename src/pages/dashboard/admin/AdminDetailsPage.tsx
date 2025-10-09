/* eslint-disable @typescript-eslint/no-explicit-any */

// Hooks
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import { GET_ADMIN_BY_ID } from "@/graphql/queries/admin";
import { UPDATE_ADMIN_USER } from "@/graphql/mutations/admin";
import { toast } from "sonner";

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

const AdminDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch admin user data
  const { loading, error, data } = useQuery(GET_ADMIN_BY_ID, {
    variables: { userId: id },
    skip: !id,
    onError: (error) => {
      toast.error("Failed to load admin user details");
      console.error("Error fetching admin user:", error);
    },
  });

  const admin = data?.getAdminUserById;

  const [updateAdminStatus] = useMutation(UPDATE_ADMIN_USER, {
    onCompleted: () => {
      toast.success("Admin status updated successfully");
      // Refetch the admin data to update the UI
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Failed to update admin status");
      console.error("Error updating admin status:", error);
    },
  });

  const handleStatusChange = async (adminId: string, isActive: boolean) => {
    try {
      setIsDeleting(true);
      await updateAdminStatus({
        variables: {
          adminId,
          input: { isActive },
        },
      });
    } catch (error) {
      console.error("Error updating admin status:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPermissionBadges = (permissions: string[]) => {
    return permissions.map((permission) => (
      <Badge key={permission} variant="secondary" className="text-xs">
        {PERMISSIONS.find((p) => p.id === permission)?.label || permission}
      </Badge>
    ));
  };

  if (!id) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admins
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Admin User Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The requested admin user could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)} disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admins
          </Button>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admins
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Error Loading Admin User</h2>
          <p className="text-muted-foreground mt-2">
            {error?.message || "Failed to load admin user details"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admins
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/dashboard/admins/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {admin.isActive ? "Deactivate" : "Activate"}
          </Button>

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {admin.isActive ? "Deactivate Admin?" : "Activate Admin?"}
                </DialogTitle>
                <DialogDescription>
                  {admin.isActive
                    ? "This will prevent this admin from accessing the dashboard. Are you sure you want to deactivate this admin?"
                    : "This will allow this admin to access the dashboard. Are you sure you want to activate this admin?"}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant={admin.isActive ? "destructive" : "default"}
                  disabled={isDeleting}
                  onClick={() => handleStatusChange(admin.id, !admin.isActive)}
                  className={
                    !admin.isActive ? "bg-green-600 hover:bg-green-700" : ""
                  }
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {admin.isActive ? "Deactivating..." : "Activating..."}
                    </>
                  ) : admin.isActive ? (
                    "Deactivate Admin"
                  ) : (
                    "Activate Admin"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={admin.profilePic || undefined}
                    alt={`${admin.firstName} ${admin.lastName}`}
                  />
                  <AvatarFallback>
                    {admin.firstName?.[0]}
                    {admin.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">
                    {admin.firstName} {admin.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                  <Badge
                    className="mt-2"
                    variant={admin.isActive ? "default" : "secondary"}
                  >
                    {admin.role}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        admin.isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    {admin.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Login
                  </p>
                  <p className="text-sm">
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleString()
                      : "Never logged in"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </p>
                  <p className="text-sm">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {admin.phoneNumber && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Phone
                    </p>
                    <p className="text-sm">{admin.phoneNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Assigned permissions for this admin user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {admin.permissions?.length > 0 ? (
                  getPermissionBadges(admin.permissions)
                ) : (
                  <p className="text-sm text-gray-600">
                    No permissions assigned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsPage;
