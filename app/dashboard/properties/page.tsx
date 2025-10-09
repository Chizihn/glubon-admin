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
import {
  GET_ADMIN_PROPERTIES,
  UPDATE_PROPERTY_STATUS,
  TOGGLE_PROPERTY_FEATURED,
} from "@/lib/graphql/queries";
import { MoreHorizontal, Eye, Star, StarOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/DataTable";

export default function PropertiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data, loading, refetch } = useQuery(GET_ADMIN_PROPERTIES, {
    variables: {
      page: currentPage,
      limit: 20,
      filters,
    },
  });

  const [updatePropertyStatus] = useMutation(UPDATE_PROPERTY_STATUS);
  const [toggleFeatured] = useMutation(TOGGLE_PROPERTY_FEATURED);

  const handleStatusUpdate = async (propertyId: string, status: string) => {
    try {
      await updatePropertyStatus({
        variables: {
          input: {
            propertyId,
            status,
          },
        },
      });

      toast.success("Property status updated successfully");

      refetch();
    } catch (error: any) {
      toast.error(error.message || "An error occured!");
      console.log(error.message || "An error occured!");
    }
  };

  const handleToggleFeatured = async (propertyId: string) => {
    try {
      await toggleFeatured({
        variables: { propertyId },
      });

      toast.success("Property featured status updated");

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
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "SUSPENDED":
        return "bg-orange-100 text-orange-800";
      case "RENTED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "property",
      label: "Property",
      render: (_: any, property: any) => (
        <div>
          <p className="font-medium text-gray-900">{property.title}</p>
          <p className="text-sm text-gray-500">
            {property.address}, {property.city}, {property.state}
          </p>
        </div>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      render: (_: any, property: any) => (
        <div>
          <p className="font-medium text-gray-900">
            {property.owner.firstName} {property.owner.lastName}
          </p>
          <p className="text-sm text-gray-500">{property.owner.email}</p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Price",
      render: (amount: number) => `₦${amount.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <Badge className={getStatusColor(status)}>
          {status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "featured",
      label: "Featured",
      render: (featured: boolean) => (
        <Badge
          className={
            featured
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {featured ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "ownershipVerified",
      label: "Verified",
      render: (verified: boolean) => (
        <Badge
          className={
            verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }
        >
          {verified ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "stats",
      label: "Views/Likes",
      render: (_: any, property: any) => (
        <div className="text-sm">
          <p>{property.stats?.views || 0} views</p>
          <p>{property.stats?.likes || 0} likes</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, property: any) => (
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
            <DropdownMenuItem onClick={() => handleToggleFeatured(property.id)}>
              {property.featured ? (
                <>
                  <StarOff className="mr-2 h-4 w-4" />
                  Remove Featured
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Make Featured
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(property.id, "ACTIVE")}
              disabled={property.status === "ACTIVE"}
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(property.id, "REJECTED")}
              disabled={property.status === "REJECTED"}
              className="text-red-600"
            >
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(property.id, "SUSPENDED")}
              disabled={property.status === "SUSPENDED"}
              className="text-orange-600"
            >
              Suspend
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
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage property listings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="RENTED">Rented</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setFilters({ ...filters, featured: value === "true" })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Not Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={data?.getAdminProperties?.items || []}
        columns={columns}
        searchable
        searchPlaceholder="Search properties..."
        loading={loading}
        pagination={{
          currentPage,
          totalPages: data?.getAdminProperties?.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
