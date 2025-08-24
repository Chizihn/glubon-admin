/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
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
import { GET_ADMIN_BY_ID } from "../../../graphql/queries/admin";
import { UPDATE_ADMIN_USER } from "../../../graphql/mutations/admin";

interface UpdateAdminUserInput {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  password: string | null;
  permissions: string[] | null;
  phoneNumber: string | null;
  role: string | null;
  status: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  permissions: string[];
  status: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
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

const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Abuja",
];

export default function AminUserEditPage() {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    UpdateAdminUserInput & { confirmPassword: string }
  >({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: "",
    role: null,
    permissions: null,
    phoneNumber: null,
    status: null,
    address: null,
    city: null,
    state: null,
    country: null,
  });

  const { data, loading: queryLoading } = useQuery<{ getAdminUser: AdminUser }>(
    GET_ADMIN_BY_ID,
    {
      variables: { adminId },
    }
  );

  const [updateAdminUser] = useMutation(UPDATE_ADMIN_USER);

  useEffect(() => {
    if (data?.getAdminUser) {
      const admin = data.getAdminUser;
      setFormData({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: null,
        confirmPassword: "",
        role: admin.role,
        permissions: admin.permissions,
        phoneNumber: admin.phoneNumber,
        status: admin.status,
        address: admin.address,
        city: admin.city,
        state: admin.state,
        country: admin.country,
      });
    }
  }, [data]);

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
              ...prev.permissions!.filter((p) => p !== "SUPER_ADMIN"),
              permissionId,
            ]
          : prev.permissions!.filter((p) => p !== permissionId),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.permissions!.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    setLoading(true);

    try {
      await updateAdminUser({
        variables: {
          adminId,
          input: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            permissions: formData.permissions,
            phoneNumber: formData.phoneNumber,
            role: formData.role,
            status: formData.status,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
          },
        },
      });

      toast.success("Admin user updated successfully");
      navigate(`/dashboard/admin-users/${adminId}`);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = formData.permissions?.includes("SUPER_ADMIN");

  if (queryLoading) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/dashboard/admin-users/${adminId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Details
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Admin User</h1>
          <p className="text-gray-600">Update admin user details</p>
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
                  Update the admin user&apos;s personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value || null,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value || null,
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
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value || null,
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
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value || null,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
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
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role || ""}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, role: value || null }))
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

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status || ""}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value || null,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value || null,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value || null,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={formData.state || ""}
                      onValueChange={(value: string) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: value || null,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigeriaStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          country: e.target.value || null,
                        }))
                      }
                    />
                  </div>
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
                      checked={formData.permissions?.includes(permission.id)}
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
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link to={`/dashboard/admin-users/${adminId}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Updating..." : "Update Admin User"}
          </Button>
        </div>
      </form>
    </div>
  );
}
