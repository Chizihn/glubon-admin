/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { CREATE_ADMIN_USER } from "../../../graphql/mutations/admin";

interface CreateAdminUserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  permissions: string[];
  phoneNumber: string | null;
  role: string;
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

export default function AdminUserCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    CreateAdminUserInput & {
      confirmPassword: string;
      sendWelcomeEmail: boolean;
    }
  >({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    permissions: [],
    phoneNumber: null,
    sendWelcomeEmail: true,
  });

  const [createAdminUser] = useMutation(CREATE_ADMIN_USER);

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.permissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    setLoading(true);

    try {
      await createAdminUser({
        variables: {
          input: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            permissions: formData.permissions,
            phoneNumber: formData.phoneNumber,
            role: formData.role,
          },
        },
      });

      toast.success("Admin user created successfully");
      navigate("/dashboard/admin-users");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = formData.permissions.includes("SUPER_ADMIN");

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
            Create Admin User
          </h1>
          <p className="text-gray-600">Add a new admin user to the system</p>
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
                  Enter the admin user&apos;s personal details
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
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
              </CardContent>
            </Card>
          </div>

          {/* Permissions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  Select the permissions for this admin user
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
                        handlePermissionChange(
                          permission.id,
                          checked as boolean
                        )
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

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendWelcomeEmail"
                    checked={formData.sendWelcomeEmail}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        sendWelcomeEmail: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="sendWelcomeEmail">
                    Send welcome email with login credentials
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/dashboard/admin-users">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create Admin User"}
          </Button>
        </div>
      </form>
    </div>
  );
}
