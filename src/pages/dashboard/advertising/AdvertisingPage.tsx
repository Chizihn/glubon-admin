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
import { MoreHorizontal, Eye, Play, Pause, Trash2, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { GET_ALL_ADS } from "@/graphql/queries/ads";
import { UPDATE_AD_STATUS, DELETE_AD } from "@/graphql/mutations/ads";
import type { Ad, AdFilters, AdStatus, AdType } from "@/types/ad";

export default function AdvertisingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AdFilters>({
    statuses: null,
    types: null,
    search: null,
    startDateAfter: null,
    startDateBefore: null,
    endDateAfter: null,
    endDateBefore: null,
    isActive: null,
    sort: null,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Clean filter object to only include non-null and non-empty values
  const cleanedFilters = {
    ...(filters.statuses?.length ? { statuses: filters.statuses } : {}),
    ...(filters.types?.length ? { types: filters.types } : {}),
    ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
    ...(filters.startDateAfter
      ? { startDateAfter: filters.startDateAfter }
      : {}),
    ...(filters.startDateBefore
      ? { startDateBefore: filters.startDateBefore }
      : {}),
    ...(filters.endDateAfter ? { endDateAfter: filters.endDateAfter } : {}),
    ...(filters.endDateBefore ? { endDateBefore: filters.endDateBefore } : {}),
    ...(filters.isActive !== null ? { isActive: filters.isActive } : {}),
    ...(filters.sort ? { sort: filters.sort } : {}),
  };

  const { data, loading, refetch } = useQuery(GET_ALL_ADS, {
    variables: {
      filter: {
        ...cleanedFilters,
        pagination: {
          page: currentPage,
          limit: 20,
        },
      },
    },
  });

  const [updateAdStatus] = useMutation(UPDATE_AD_STATUS);
  const [deleteAd] = useMutation(DELETE_AD);

  const handleStatusUpdate = async (adId: string, status: string) => {
    try {
      const result = await updateAdStatus({
        variables: { adId, status },
      });

      if (result.data?.updateAdStatus?.success) {
        toast.success("Ad status updated successfully");
        refetch();
      } else {
        toast.error("Failed to update ad status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("An error occurred while updating status");
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
      const result = await deleteAd({
        variables: { adId },
      });

      if (result.data?.deleteAd?.success) {
        toast.success("Ad deleted successfully");
        refetch();
      } else {
        toast.error("Failed to delete ad");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting ad");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "EXPIRED":
        return "bg-gray-200 text-gray-900";
      case "ARCHIVED":
        return "bg-gray-300 text-gray-900";
      case "PENDING":
        return "bg-yellow-200 text-yellow-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "STANDARD":
        return "bg-blue-100 text-blue-800";
      case "PREMIUM":
        return "bg-purple-100 text-purple-800";
      case "SPONSORED":
        return "bg-orange-100 text-orange-800";
      case "FEATURED":
        return "bg-indigo-100 text-indigo-800";
      case "BANNER":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const columns = [
    {
      key: "ad",
      label: "Ad",
      render: (_: string, ad: Ad) => (
        <div>
          <p className="font-medium text-gray-900 line-clamp-1">{ad.title}</p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {ad.description || "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (_: string, ad: Ad) => (
        <Badge className={getTypeColor(ad.type)}>{ad.type}</Badge>
      ),
    },
    {
      key: "budget",
      label: "Budget",
      render: (_: string, ad: Ad) => (
        <div>
          <p className="font-medium text-gray-900">
            {formatCurrency(ad.budget)}
          </p>
          {ad.costPerClick && (
            <p className="text-sm text-gray-500">
              {formatCurrency(ad.costPerClick)} per click
            </p>
          )}
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
      key: "dates",
      label: "Campaign Period",
      render: (_: string, ad: Ad) => (
        <div className="text-sm">
          <p>{new Date(ad.startDate).toLocaleDateString()}</p>
          <p className="text-gray-500">to</p>
          <p>{new Date(ad.endDate).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: string, ad: Ad) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/advertising/${ad.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            {ad.status === "ACTIVE" && (
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(ad.id, "PAUSED")}
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause Ad
              </DropdownMenuItem>
            )}
            {(ad.status === "PAUSED" || ad.status === "APPROVED") && (
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(ad.id, "ACTIVE")}
              >
                <Play className="mr-2 h-4 w-4" />
                Activate Ad
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => handleDeleteAd(ad.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Ad
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
          <h1 className="text-2xl font-bold text-gray-900">Advertising</h1>
          <p className="text-gray-600">Manage advertisements and campaigns</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/dashboard/advertising/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Ad
            </Link>
          </Button>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search ads..."
              className="w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Total Ads</p>
          <p className="text-2xl font-bold text-gray-900">
            {data?.getAds?.pagination?.totalItems || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
          <p className="text-2xl font-bold text-green-600">
            {data?.getAds?.data?.filter((ad: Ad) => ad.status === "ACTIVE")
              .length || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Total Budget</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(
              data?.getAds?.data?.reduce(
                (sum: number, ad: Ad) => sum + (ad.budget || 0),
                0
              ) || 0
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="flex space-x-4">
          <Select
            onValueChange={(value: string) =>
              setFilters({
                ...filters,
                statuses: value === "all" ? null : [value as AdStatus],
              })
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PAUSED">Paused</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value: string) =>
              setFilters({
                ...filters,
                types: value === "all" ? null : [value as AdType],
              })
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
              <SelectItem value="PREMIUM">Premium</SelectItem>
              <SelectItem value="SPONSORED">Sponsored</SelectItem>
              <SelectItem value="FEATURED">Featured</SelectItem>
              <SelectItem value="BANNER">Banner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-4">
          <div className="space-y-2">
            <Label htmlFor="startDateAfter">Start Date After</Label>
            <Input
              id="startDateAfter"
              type="date"
              value={filters.startDateAfter || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  startDateAfter: e.target.value || null,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDateBefore">Start Date Before</Label>
            <Input
              id="startDateBefore"
              type="date"
              value={filters.startDateBefore || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  startDateBefore: e.target.value || null,
                })
              }
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="space-y-2">
            <Label htmlFor="endDateAfter">End Date After</Label>
            <Input
              id="endDateAfter"
              type="date"
              value={filters.endDateAfter || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  endDateAfter: e.target.value || null,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDateBefore">End Date Before</Label>
            <Input
              id="endDateBefore"
              type="date"
              value={filters.endDateBefore || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  endDateBefore: e.target.value || null,
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={filters.isActive ?? false}
            onCheckedChange={(checked) =>
              setFilters({
                ...filters,
                isActive:
                  checked === true ? true : checked === false ? false : null,
              })
            }
          />
          <Label htmlFor="isActive">Active Only</Label>
        </div>
      </div>

      <DataTable
        data={data?.getAds?.data || []}
        columns={columns}
        loading={loading}
        pagination={{
          currentPage,
          totalPages: data?.getAds?.pagination?.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
