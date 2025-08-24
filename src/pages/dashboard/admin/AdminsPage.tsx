/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { MoreHorizontal, Eye, Edit, Trash2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Link } from "react-router-dom";
import { DataTable } from "../../../components/ui/datatable";
import { toast } from "sonner";
import { GET_ADMIN_USERS } from "../../../graphql/queries/admin";
import { UPDATE_ADMIN_USER } from "../../../graphql/mutations/admin";

interface AdminListFilters {
  createdAfter: Date | null;
  createdBefore: Date | null;
  isActive: boolean | null;
  permissions: string[] | null;
  search: string | null;
  role: string | null;
  state: string | null;
}

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string | null;
  role: string;
  permissions: string[];
  lastLogin: string | null;
  createdBy: {
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
  state: string | null;
}

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

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AdminListFilters>({
    createdAfter: null,
    createdBefore: null,
    isActive: null,
    permissions: null,
    search: null,
    role: null,
    state: null,
  });

  const { data, loading, refetch } = useQuery<{
    getAdminUsers: { items: AdminUser[]; pagination: { totalPages: number } };
  }>(GET_ADMIN_USERS, {
    variables: {
      limit: 10,
      page: currentPage,
      filters,
    },
  });

  const [updateAdminUser] = useMutation(UPDATE_ADMIN_USER);

  const handleDeleteUser = async (userId: string) => {
    try {
      await updateAdminUser({
        variables: {
          adminId: userId,
          input: { status: "DELETED" },
        },
      });
      toast.success(`Admin user with id ${userId} deleted successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "An unknown error occurred");
    }
  };

  const getPermissionBadges = (permissions: string[]) => {
    const permissionLabels: Record<string, string> = {
      SUPER_ADMIN: "Super Admin",
      READ_USERS: "Read Users",
      WRITE_USERS: "Write Users",
      DELETE_USERS: "Delete Users",
      READ_PROPERTIES: "Read Properties",
      WRITE_PROPERTIES: "Write Properties",
      DELETE_PROPERTIES: "Delete Properties",
      MANAGE_VERIFICATIONS: "Manage Verifications",
      VIEW_ANALYTICS: "View Analytics",
    };

    return permissions.map((permission) => (
      <Badge key={permission} variant="secondary" className="text-xs">
        {permissionLabels[permission] || permission}
      </Badge>
    ));
  };

  const columns = [
    {
      key: "user",
      label: "Admin User",
      render: (_: any, user: AdminUser) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePic || "/placeholder.svg"} />
            <AvatarFallback>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (role: string) => (
        <Badge
          className={
            role === "SUPER_ADMIN"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }
        >
          {role.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "permissions",
      label: "Permissions",
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {getPermissionBadges(permissions.slice(0, 2))}
          {permissions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{permissions.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : "Never",
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (createdBy: AdminUser["createdBy"]) =>
        `${createdBy.firstName} ${createdBy.lastName}`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, user: AdminUser) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/admin-users/${user.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/admin-users/${user.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </DropdownMenuItem>
            {user.role !== "SUPER_ADMIN" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </DropdownMenuItem>
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
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-600">
            Manage admin users and their permissions
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/admin-users/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Admin User
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          onValueChange={(value: string) =>
            setFilters({ ...filters, role: value || null })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: string) =>
            setFilters({
              ...filters,
              isActive:
                value === "true" ? true : value === "false" ? false : null,
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: string) =>
            setFilters({ ...filters, state: value || null })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by state" />
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

      <DataTable
        data={data?.getAdminUsers?.items || []}
        columns={columns}
        searchable
        searchPlaceholder="Search admin users..."
        loading={loading}
        pagination={{
          currentPage,
          totalPages: data?.getAdminUsers?.pagination.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
