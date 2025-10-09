/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { toast } from "sonner";
import { DataTable } from "../../../components/ui/datatable";
import {
  GET_ALL_USERS,
  UPDATE_USER_STATUS,
} from "../../../graphql/queries/users";
import type { User } from "../../../types/auth";
import { Link } from "react-router-dom";
import { formatGraphQLError } from "../../../util/formatGraphQlError";
import type { RoleEnum, UserStatus } from "@/types/enums";

export class AdminUserFilters {
  role?: RoleEnum;
  status?: UserStatus;
  isVerified?: boolean;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  search?: string;
}

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Clean filters to remove null or undefined values
  const cleanFilters = (filters: any) => {
    const cleaned: any = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined) {
        cleaned[key] = filters[key];
      }
    });
    return cleaned;
  };

  const { data, loading, refetch } = useQuery(GET_ALL_USERS, {
    variables: {
      page: currentPage,
      limit: 20,
      filters: {
        ...cleanFilters(filters),
        search: debouncedSearchTerm || undefined,
      },
    },
  });

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      const result = await updateUserStatus({
        variables: {
          input: {
            userId,
            status,
          },
        },
      });

      if (result.data?.updateUserStatus?.success) {
        toast.success(
          result.data.updateUserStatus.message ||
            "User status updated successfully"
        );
        refetch();
      } else {
        toast.error(
          result.data?.updateUserStatus?.errors?.[0] ||
            "Failed to update user status"
        );
      }
    } catch (error) {
      const errMsg = formatGraphQLError(error);
      toast.error(errMsg || "An error occurred!");
      console.error("Status update error:", errMsg);
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
      case "LISTER":
        return "bg-blue-100 text-blue-800";
      case "RENTER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "user",
      label: "User",
      render: (_: any, user: User) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePic || "/placeholder.svg"} />
            <AvatarFallback>
              {user.firstName?.[0] || ""}
              {user.lastName?.[0] || ""}
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
      label: "Account type",
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
      key: "createdAt",
      label: "Joined",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/users/${user.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
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
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage platform users</p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select
          onValueChange={(value) =>
            setFilters({
              ...filters,
              role: value === "all" ? undefined : value, // Use undefined instead of null
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="LISTER">Lister</SelectItem>
            <SelectItem value="RENTER">Renter</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setFilters({
              ...filters,
              status: value === "all" ? undefined : value, // Use undefined instead of null
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="BANNED">Banned</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setFilters({
              ...filters,
              isVerified: value === "all" ? undefined : value === "true", // Use undefined instead of null
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={data?.getAllUsers?.items || []}
        columns={columns}
        searchable
        searchPlaceholder="Search users..."
        loading={loading}
        result={searchTerm ? "No user found with the search" : "No user found"}
        pagination={{
          currentPage,
          totalPages: data?.getAllUsers?.pagination?.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
