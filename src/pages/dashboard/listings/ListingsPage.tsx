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
import { MoreHorizontal, Eye, Star, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/datatable";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

import {
  UPDATE_PROPERTY_STATUS,
  TOGGLE_PROPERTY_FEATURED,
} from "@/graphql/mutations/properties";
import type { Property, PropertyFilters } from "@/types/property";
import { GET_ALL_LISTINGS } from "@/graphql/queries/listings";

export default function ListingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PropertyFilters>({});
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, loading, refetch } = useQuery(GET_ALL_LISTINGS, {
    variables: {
      page: currentPage,
      limit: 20,
      filters: {
        ...filters,
        search: debouncedSearchTerm || undefined,
      },
    },
  });

  const [updatePropertyStatus] = useMutation(UPDATE_PROPERTY_STATUS);
  const [togglePropertyFeatured] = useMutation(TOGGLE_PROPERTY_FEATURED);

  const handleStatusUpdate = async (propertyId: string, status: string) => {
    try {
      const result = await updatePropertyStatus({
        variables: {
          input: { propertyId, status },
        },
      });

      if (result.data?.updatePropertyStatus?.success) {
        toast.success("Property status updated successfully");
        refetch();
      } else {
        toast.error("Failed to update property status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("An error occurred while updating status");
    }
  };

  const handleToggleFeatured = async (propertyId: string) => {
    try {
      const result = await togglePropertyFeatured({
        variables: { propertyId },
      });

      if (result.data?.togglePropertyFeatured?.success) {
        toast.success("Property featured status updated");
        refetch();
      } else {
        toast.error("Failed to update featured status");
      }
    } catch (error) {
      console.error("Featured toggle error:", error);
      toast.error("An error occurred while updating featured status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "SUSPENDED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "property",
      label: "Property",
      render: (_: string, property: Property) => (
        <div className="flex items-start space-x-3">
          {/* <img
            src={property.images?.[0] || "/placeholder.svg"}
            alt={property.title}
            className="w-12 h-12 rounded-lg object-cover"
          /> */}
          <div>
            <p className="font-medium text-gray-900 line-clamp-1">
              {property.title}
            </p>
            <p className="text-sm text-gray-500 line-clamp-1">
              {property.location?.address}
            </p>
            {/* <p className="text-sm font-medium text-blue-600">
                ₦{property.price?.toLocaleString()}
              </p> */}
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      render: (_: string, property: Property) => (
        <div>
          <p className="font-medium text-gray-900">
            {property.owner?.firstName} {property.owner?.lastName}
          </p>
          <p className="text-sm text-gray-500">{property.owner?.email}</p>
        </div>
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
      key: "isFeatured",
      label: "Featured",
      render: (isFeatured: boolean) => (
        <Badge
          className={
            isFeatured
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {isFeatured ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "stats",
      label: "Engagement",
      render: (_: string, property: Property) => (
        <div className="text-sm">
          <p>{property.stats?.views || 0} views</p>
          <p>{property.stats?.likes || 0} likes</p>
          <p>{property.stats?.conversations || 0} inquiries</p>
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
      render: (_: string, property: Property) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/listings/${property.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleFeatured(property.id)}>
              <Star className="mr-2 h-4 w-4" />
              {property.isFeatured ? "Remove Featured" : "Make Featured"}
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
            >
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(property.id, "SUSPENDED")}
              disabled={property.status === "SUSPENDED"}
              className="text-red-600"
            >
              <Ban className="mr-2 h-4 w-4" />
              Suspend
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
          <h1 className="text-2xl font-bold text-gray-900">
            Property Listings
          </h1>
          <p className="text-gray-600">
            Manage property listings on the platform
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select
          onValueChange={(value) =>
            setFilters({
              ...filters,
              status: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setFilters({
              ...filters,
              isFeatured: value === "all" ? undefined : value === "true",
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Not Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={data?.getAllProperties?.items || []}
        columns={columns}
        loading={loading}
        pagination={{
          currentPage,
          totalPages: data?.getAllProperties?.pagination?.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
