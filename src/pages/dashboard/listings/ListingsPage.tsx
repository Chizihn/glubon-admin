/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
  MoreHorizontal,
  Eye,
  Star,
  StarOff,
  MapPin,
  Bed,
  Bath,
  TrendingUp,
  MessageSquare,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { toast } from "sonner";
import { DataTable } from "../../../components/ui/datatable";
import { GET_ALL_LISTINGS } from "../../../graphql/queries/listings";
import {
  TOGGLE_PROPERTY_FEATURED,
  UPDATE_PROPERTY_STATUS,
} from "../../../graphql/mutations/listings";
import { PropertyStatus } from "../../../types/enums";
import type { Property } from "../../../types/property";

export interface AdminPropertyFilters {
  createdAfter: Date | null;
  createdBefore: Date | null;
  featured: boolean | null;
  maxAmount: number | null;
  minAmount: number | null;
  ownershipVerified: boolean | null;
  state: string | null;
  status: PropertyStatus | null;
  propertyType: string | null;
}

export default function ListingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AdminPropertyFilters>({
    ownershipVerified: null,
    featured: null,
    createdAfter: null,
    createdBefore: null,
    state: null,
    status: null,
    propertyType: null,
    maxAmount: null,
    minAmount: null,
  });
  const [selectedListing, setSelectedListing] = useState<Property | null>(null);

  const { data, loading, refetch } = useQuery(GET_ALL_LISTINGS, {
    variables: {
      limit: 10,
      page: currentPage,
      filters,
    },
  });

  const [updatePropertyStatus] = useMutation(UPDATE_PROPERTY_STATUS);
  const [toggleFeatured] = useMutation(TOGGLE_PROPERTY_FEATURED);

  const handleStatusUpdate = async (
    listingId: string,
    status: PropertyStatus
  ) => {
    try {
      await updatePropertyStatus({
        variables: {
          input: {
            propertyId: listingId,
            status,
          },
        },
      });

      toast.success("Listing status updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleToggleFeatured = async (listingId: string) => {
    try {
      await toggleFeatured({
        variables: { propertyId: listingId },
      });

      toast.success("Listing featured status updated");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case PropertyStatus.PENDING_REVIEW:
        return "bg-yellow-100 text-yellow-800";
      case PropertyStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case PropertyStatus.SUSPENDED:
        return "bg-orange-100 text-orange-800";
      case PropertyStatus.RENTED:
        return "bg-blue-100 text-blue-800";
      case PropertyStatus.PENDING_BOOKING:
        return "bg-purple-100 text-purple-800";
      case PropertyStatus.INACTIVE:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "APARTMENT":
        return "bg-purple-100 text-purple-800";
      case "DUPLEX":
        return "bg-indigo-100 text-indigo-800";
      case "BUNGALOW":
        return "bg-cyan-100 text-cyan-800";
      case "SELF_CONTAIN":
        return "bg-pink-100 text-pink-800";
      case "MANSION":
        return "bg-teal-100 text-teal-800";
      case "TWO_STORY":
      case "THREE_STORY":
      case "FOUR_STORY":
      case "SIX_PLUS_STORY":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const columns = [
    {
      key: "listing",
      label: "Listing",
      render: (_: any, listing: Property) => (
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={listing.images[0] || "/placeholder.svg"}
              alt={listing.title}
              className="w-12 h-12 rounded object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900 truncate max-w-xs">
              {listing.title}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {listing.address}, {listing.city}, {listing.state}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (type: string) => (
        <Badge className={getTypeColor(type)}>{type.replace("_", " ")}</Badge>
      ),
    },
    {
      key: "lister",
      label: "Lister",
      render: (_: any, listing: Property) => (
        <div>
          <p className="font-medium text-gray-900">
            {listing.owner.firstName} {listing.owner.lastName}
          </p>
          <p className="text-sm text-gray-500">{listing.owner.email}</p>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (price: number) => `₦${price.toLocaleString()}`,
    },
    {
      key: "details",
      label: "Details",
      render: (_: any, listing: Property) => (
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-3 w-3 mr-1" />
            {listing.bedrooms}
          </div>
          <div className="flex items-center">
            <Bath className="h-3 w-3 mr-1" />
            {listing.bathrooms}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: PropertyStatus) => (
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
      key: "analytics",
      label: "Performance",
      render: (_: any, listing: Property) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-600">
            <Eye className="h-3 w-3 mr-1" />
            {listing.stats.views}
          </div>
          <div className="flex items-center text-gray-600">
            <MessageSquare className="h-3 w-3 mr-1" />
            {listing.stats.conversations}
          </div>
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
      render: (_: any, listing: Property) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedListing(listing)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleFeatured(listing.id)}>
              {listing.featured ? (
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
              onClick={() =>
                handleStatusUpdate(listing.id, PropertyStatus.ACTIVE)
              }
              disabled={listing.status === "ACTIVE"}
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleStatusUpdate(listing.id, PropertyStatus.REJECTED)
              }
              disabled={listing.status === "REJECTED"}
              className="text-red-600"
            >
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleStatusUpdate(listing.id, PropertyStatus.SUSPENDED)
              }
              disabled={listing.status === "SUSPENDED"}
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
          <h1 className="text-2xl font-bold text-gray-900">
            Listings Management
          </h1>
          <p className="text-gray-600">
            Manage property listings and performance
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold">
                  {data?.getAllProperties?.pagination.totalItems || 0}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold">
                  {data?.getAllProperties?.items?.filter(
                    (item: Property) => item.status === "ACTIVE"
                  ).length || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">
                  {data?.getAllProperties?.items?.filter(
                    (item: Property) => item.status === "PENDING_REVIEW"
                  ).length || 0}
                </p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">
                  {data?.getAllProperties?.items?.filter(
                    (item: Property) => item.featured
                  ).length || 0}
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          onValueChange={(value: PropertyStatus) =>
            setFilters({ ...filters, status: value })
          }
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
            <SelectItem value="PENDING_BOOKING">Pending Booking</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: string) =>
            setFilters({ ...filters, propertyType: value })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="APARTMENT">Apartment</SelectItem>
            <SelectItem value="DUPLEX">Duplex</SelectItem>
            <SelectItem value="BUNGALOW">Bungalow</SelectItem>
            <SelectItem value="SELF_CONTAIN">Self Contain</SelectItem>
            <SelectItem value="MANSION">Mansion</SelectItem>
            <SelectItem value="TWO_STORY">Two Story</SelectItem>
            <SelectItem value="THREE_STORY">Three Story</SelectItem>
            <SelectItem value="FOUR_STORY">Four Story</SelectItem>
            <SelectItem value="SIX_PLUS_STORY">Six Plus Story</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: string) =>
            setFilters({
              ...filters,
              featured: value === "true" ? true : false,
            })
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

        <Select
          onValueChange={(value: string) =>
            setFilters({ ...filters, state: value })
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
        data={data?.getAllProperties?.items || []}
        columns={columns}
        searchable
        searchPlaceholder="Search listings..."
        loading={loading}
        pagination={{
          currentPage,
          totalPages: data?.getAllProperties?.pagination.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />

      {/* Listing Details Modal */}
      {selectedListing && (
        <Dialog
          open={!!selectedListing}
          onOpenChange={() => setSelectedListing(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedListing.title}</DialogTitle>
              <DialogDescription>
                Detailed view and analytics for this listing
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="lister">Lister Info</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <img
                      src={selectedListing.images[0] || "/placeholder.svg"}
                      alt={selectedListing.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Property Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p>
                          <span className="font-medium">Type:</span>{" "}
                          {selectedListing.propertyType.replace("_", " ")}
                        </p>
                        <p>
                          <span className="font-medium">Price:</span> ₦
                          {selectedListing.amount.toLocaleString()}
                        </p>
                        <p>
                          <span className="font-medium">Bedrooms:</span>{" "}
                          {selectedListing.bedrooms}
                        </p>
                        <p>
                          <span className="font-medium">Bathrooms:</span>{" "}
                          {selectedListing.bathrooms}
                        </p>
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {selectedListing.address}, {selectedListing.city},{" "}
                          {selectedListing.state}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>
                          <Badge
                            className={`ml-2 ${getStatusColor(
                              selectedListing.status
                            )}`}
                          >
                            {selectedListing.status.replace("_", " ")}
                          </Badge>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold">Amenities</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedListing.amenities.map(
                          (amenity: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {amenity}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedListing.stats.views}
                      </p>
                      <p className="text-sm text-gray-600">Total Views</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedListing.stats.conversations}
                      </p>
                      <p className="text-sm text-gray-600">Inquiries</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedListing.stats.likes}
                      </p>
                      <p className="text-sm text-gray-600">Likes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {selectedListing.stats.conversionRate || 0}%
                      </p>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span className="font-semibold">
                            {selectedListing.stats.viewsThisWeek || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inquiries:</span>
                          <span className="font-semibold">
                            {selectedListing.stats.inquiriesThisWeek || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Featured:</span>
                          <Badge
                            className={
                              selectedListing.featured
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {selectedListing.featured ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified:</span>
                          <Badge
                            className={
                              selectedListing.ownershipVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {selectedListing.ownershipVerified ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="lister" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lister Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {selectedListing.owner.firstName}{" "}
                          {selectedListing.owner.lastName}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {selectedListing.owner.email}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {selectedListing.owner.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Verified:</span>
                          <Badge
                            className={`ml-2 ${
                              selectedListing.owner.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedListing.owner.isVerified ? "Yes" : "No"}
                          </Badge>
                        </p>
                        <p>
                          <span className="font-medium">User ID:</span>{" "}
                          {selectedListing.owner.id}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Status Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleStatusUpdate(
                            selectedListing.id,
                            PropertyStatus.ACTIVE
                          )
                        }
                        disabled={selectedListing.status === "ACTIVE"}
                      >
                        Approve Listing
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() =>
                          handleStatusUpdate(
                            selectedListing.id,
                            PropertyStatus.REJECTED
                          )
                        }
                        disabled={selectedListing.status === "REJECTED"}
                      >
                        Reject Listing
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          handleStatusUpdate(
                            selectedListing.id,
                            PropertyStatus.SUSPENDED
                          )
                        }
                        disabled={selectedListing.status === "SUSPENDED"}
                      >
                        Suspend Listing
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Feature Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleToggleFeatured(selectedListing.id)}
                      >
                        {selectedListing.featured ? (
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
                      </Button>
                      <Button variant="outline" className="w-full">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Boost Listing
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View Public Page
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
