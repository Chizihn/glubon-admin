import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useDebounce } from "@/hooks/useDebounce";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { CustomDataTable } from "@/components/ui/custom-data-table";
import { toast } from "sonner";
import { GET_ADMIN_USERS } from "../../../graphql/queries/admin";
import { UPDATE_ADMIN_USER } from "../../../graphql/mutations/admin";
import { ErrorState } from "@/components/ui/ErrorState";

// Define the Skeleton component since it's not available in the UI library
const Skeleton = ({
  className = "",
  ...props
}: {
  className?: string;
  [key: string]: any;
}) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-md ${className}`}
    {...props}
  />
);

interface AdminListFilters {
  createdAfter?: string | null;
  createdBefore?: string | null;
  isActive?: boolean | null;
  permissions?: string[] | null;
  search?: string | null;
}

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  profilePic: string | null;
  permissions: string[];
  lastLogin: string | null;
  createdAt: string;
  isActive: boolean;
  status: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  createdBy?: {
    firstName: string;
    lastName: string;
  } | null;
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
] as const;

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<AdminListFilters>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Update filters when search or status changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearchTerm || undefined,
      ...(statusFilter && statusFilter !== "all"
        ? { status: statusFilter }
        : {}),
    }));
  }, [debouncedSearchTerm, statusFilter]);

  // Fetch admins with pagination and filters
  const { data, loading, error, refetch } = useQuery(GET_ADMIN_USERS, {
    variables: {
      limit,
      page,
      filters: filters,
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      toast.error("Failed to load admin users");
      console.error("Error fetching admin users:", error);
    },
  });

  const [updateAdminStatus] = useMutation(UPDATE_ADMIN_USER, {
    onCompleted: () => {
      toast.success("Admin status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to update admin status");
      console.error("Error updating admin status:", error);
    },
  });

  const admins = (data?.getAdminUsers?.items || []) as AdminUser[];
  const totalAdmins = data?.getAdminUsers?.pagination?.totalItems || 0;

  const handleStatusChange = async (adminId: string, isActive: boolean) => {
    try {
      await updateAdminStatus({
        variables: {
          adminId,
          input: {
            isActive,
          },
        },
      });
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        cell: (admin: AdminUser) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={admin.profilePic || ""} alt={admin.firstName} />
              <AvatarFallback>
                {admin.firstName?.[0]}
                {admin.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {admin.firstName} {admin.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{admin.email}</p>
            </div>
          </div>
        ),
      },

      {
        key: "status",
        header: "Status",
        cell: (admin: AdminUser) => {
          const isActive = admin.status === "ACTIVE";
          return (
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        key: "lastLogin",
        header: "Last Login",
        cell: (admin: AdminUser) => (
          <div className="text-sm text-muted-foreground">
            {admin.lastLogin
              ? format(new Date(admin.lastLogin), "PPpp")
              : "Never"}
          </div>
        ),
      },
      {
        key: "createdAt",
        header: "Created At",
        cell: (admin: AdminUser) => (
          <div className="text-sm text-muted-foreground">
            {format(new Date(admin.createdAt), "PP")}
          </div>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        cell: (admin: AdminUser) => {
          const isActive = admin.status === "ACTIVE";

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    to={`/dashboard/admins/${admin.id}`}
                    className="flex items-center"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`/dashboard/admins/${admin.id}/edit`}
                    className="flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`flex items-center ${
                    isActive ? "text-red-600" : "text-green-600"
                  }`}
                  onClick={() => handleStatusChange(admin.id, !isActive)}
                >
                  {isActive ? (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✓</span>
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleStatusChange]
  );

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center ">
        <ErrorState
          title="Failed to load admin users"
          message="An error occurred while fetching the admin users. Please try again."
          onRetry={() => {
            console.log("clicke refetch");
            refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
          <p className="text-muted-foreground">
            Manage your admin users and their permissions
          </p>
        </div>
        <Link to="/dashboard/admins/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-1 flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search admins..."
                className="pl-8 sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.trim())}
              />
            </div>

            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <span>Refresh</span>
              )}
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

        <CustomDataTable
          columns={columns}
          data={admins}
          pageCount={Math.ceil(totalAdmins / limit)}
          pageIndex={page - 1}
          pageSize={limit}
          totalItems={totalAdmins}
          loading={loading}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={(newPageSize) => {
            setLimit(newPageSize);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
