"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GET_ADMIN_USERS, UPDATE_USER_STATUS } from "@/lib/graphql/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/DataTable";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data, loading, refetch } = useQuery(GET_ADMIN_USERS, {
    variables: {
      page: currentPage,
      limit: 20,
      filters,
    },
  });

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      await updateUserStatus({
        variables: {
          input: {
            userId,
            status,
          },
        },
      });

      toast.success("User status updated successfully");

      refetch();
    } catch (error: any) {
      toast.error(error.message || "An error occured!");
      console.log(error.message || "An error occured!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "SUSPENDED":
        return "bg-yellow-100 text-yellow-800";
      case "BANNED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "PROPERTY_OWNER":
        return "bg-blue-100 text-blue-800";
      case "TENANT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "user",
      label: "User",
      render: (_: any, user: any) => (
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
        <Badge className={getRoleColor(role)}>{role.replace("_", " ")}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <Badge className={getStatusColor(status)}>{status}</Badge>
      ),
    },
    {
      key: "isVerified",
      label: "Verified",
      render: (isVerified: boolean) => (
        <Badge
          className={
            isVerified
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {isVerified ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "stats",
      label: "Properties",
      render: (_: any, user: any) => user.stats?.properties || 0,
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, user: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(user.id, "SUSPENDED")}
              disabled={user.status === "SUSPENDED"}
            >
              Suspend User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(user.id, "ACTIVE")}
              disabled={user.status === "ACTIVE"}
            >
              Activate User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(user.id, "BANNED")}
              disabled={user.status === "BANNED"}
              className="text-red-600"
            >
              Ban User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage platform users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select
          onValueChange={(value) => setFilters({ ...filters, role: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="PROPERTY_OWNER">Property Owner</SelectItem>
            <SelectItem value="TENANT">Tenant</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="BANNED">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={data?.getAdminUsers?.items || []}
        columns={columns}
        searchable
        searchPlaceholder="Search users..."
        loading={loading}
        pagination={{
          currentPage,
          totalPages: data?.getAdminUsers?.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
