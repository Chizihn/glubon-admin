/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GET_ADMIN_BY_ID } from "@/graphql/queries/admin";
import { UPDATE_ADMIN_USER } from "@/graphql/mutations/admin";

interface UpdateAdminUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  permissions: string[];
  isActive: boolean;
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
    id: "MANAGE_USERS",
    label: "Manage Users",
    description: "Create, edit, and delete users",
  },
  {
    id: "MANAGE_CONTENT",
    label: "Manage Content",
    description: "Create, edit, and delete content",
  },
  {
    id: "MANAGE_SETTINGS",
    label: "Manage Settings",
    description: "Update system settings and configurations",
  },
  {
    id: "VIEW_ANALYTICS",
    label: "View Analytics",
    description: "Access analytics and reports",
  },
];

export default function AdminUserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch admin user data
  const { loading, error, data } = useQuery(GET_ADMIN_BY_ID, {
    variables: { userId: id },
    skip: !id,
  });

  const [formData, setFormData] = useState<UpdateAdminUserInput>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: null,
    role: "",
    permissions: [],
    isActive: true,
  });

  // Update form data when data is loaded
  useEffect(() => {
    if (data?.getAdminUserById) {
      const user = data.getAdminUserById;
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        permissions: user.permissions || [],
        isActive: user.isActive,
      });
    }
  }, [data]);

  const [updateAdminUser] = useMutation(UPDATE_ADMIN_USER);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (permissionId === "SUPER_ADMIN") {
      if (checked) {
        setFormData((prev) => ({ ...prev, permissions: ["SUPER_ADMIN"] }));
      } else {
        setFormData((prev) => ({ ...prev, permissions: [] }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: checked
          ? [
              ...prev.permissions.filter((p) => p !== "SUPER_ADMIN"),
              permissionId,
            ]
          : prev.permissions.filter((p) => p !== permissionId),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.permissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    setIsSaving(true);

    try {
      await updateAdminUser({
        variables: {
          adminId: id,
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            role: formData.role,
            permissions: formData.permissions,
            isActive: formData.isActive,
          },
        },
      });

      toast.success("Admin user updated successfully");
      navigate("/dashboard/admin-users");
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating the admin user");
    } finally {
      setIsSaving(false);
    }
  };

  const isSuperAdmin = formData.permissions.includes("SUPER_ADMIN");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading admin user: {error.message}
      </div>
    );
  }

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
            Edit Admin User
          </h1>
          <p className="text-gray-600">Update admin user information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the admin user's personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value || null,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Permissions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  Update the permissions for this admin user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {PERMISSIONS.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permission.id, checked as boolean)
                      }
                      disabled={isSuperAdmin && permission.id !== "SUPER_ADMIN"}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/dashboard/admin-users">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
