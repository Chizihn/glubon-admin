/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  MessageSquare,
  Heart,
  Star,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { GET_LISTING_BY_ID } from "../../../graphql/queries/listings";
import {
  TOGGLE_PROPERTY_FEATURED,
  UPDATE_PROPERTY_STATUS,
} from "../../../graphql/mutations/listings";

export default function ListingDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const listingId = params.id as string;

  const { data, loading, refetch } = useQuery(GET_LISTING_BY_ID, {
    variables: { listingId },
  });

  const [updateListingStatus] = useMutation(UPDATE_PROPERTY_STATUS);
  const [toggleFeatured] = useMutation(TOGGLE_PROPERTY_FEATURED);

  const listing = data?.getProperty;

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateListingStatus({
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

  const handleToggleFeatured = async () => {
    try {
      await toggleFeatured({
        variables: { id: listingId },
      });
      toast.success("Listing featured status updated");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-96 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Listing not found</h2>
        <p className="text-gray-600 mt-2">
          The listing you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          onClick={() => navigate("/dashboard/listings")}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

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
      case "PENDING_BOOKING":
        return "bg-purple-100 text-purple-800";
      case "DRAFT":
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {listing.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {listing.address}, {listing.city}, {listing.state}
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(listing.status)}>
                {listing.status.replace("_", " ")}
              </Badge>
              {listing.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {listing.ownershipVerified && (
                <Badge className="bg-blue-100 text-blue-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/listings/${listingId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Listing
          </Button>

          <Button variant="outline" onClick={handleToggleFeatured}>
            <Star className="h-4 w-4 mr-2" />
            {listing.featured ? "Remove Featured" : "Make Featured"}
          </Button>

          {listing.status === "PENDING_REVIEW" ? (
            <div className="flex space-x-2">
              <Button onClick={() => handleStatusUpdate("ACTIVE")}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate("REJECTED")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          ) : listing.status === "ACTIVE" ? (
            <Button
              variant="destructive"
              onClick={() => handleStatusUpdate("SUSPENDED")}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Suspend
            </Button>
          ) : (
            <Button onClick={() => handleStatusUpdate("ACTIVE")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Activate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Images */}
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                    <div className="relative md:col-span-2">
                      <img
                        src={listing.images?.[0] || "/placeholder.svg"}
                        alt={listing.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    {listing.images
                      ?.slice(1, 5)
                      .map((image: string, index: number) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${listing.title} ${index + 2}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Bed className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                        <p className="font-medium">{listing.bedrooms}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Bath className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                        <p className="font-medium">{listing.bathrooms}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Square className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Area</p>
                        <p className="font-medium">
                          {listing.sqft || "N/A"} sqft
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-medium">
                          ₦{listing.amount.toLocaleString()} /{" "}
                          {listing.rentalPeriod.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-600">{listing.description}</p>
                  </div>

                  {listing.amenities && listing.amenities.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {listing.amenities.map(
                          (amenity: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {amenity}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Visiting Information</h4>
                    <p className="text-gray-600">
                      Days: {listing.visitingDays.join(", ")}
                    </p>
                    <p className="text-gray-600">
                      Time: {listing.visitingTimeStart} -{" "}
                      {listing.visitingTimeEnd}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Lister Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Lister Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={listing.owner.profilePic || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {listing.owner.firstName?.[0]}
                        {listing.owner.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {listing.owner.firstName} {listing.owner.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {listing.owner.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {listing.owner.phoneNumber}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {listing.owner.isVerified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/users/${listing.owner.id}`)
                      }
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold">
                          {listing.stats?.views || 0}
                        </p>
                      </div>
                      <Eye className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Inquiries</p>
                        <p className="text-2xl font-bold">
                          {listing.stats?.conversations || 0}
                        </p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Likes</p>
                        <p className="text-2xl font-bold">
                          {listing.stats?.likes || 0}
                        </p>
                      </div>
                      <Heart className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold">
                          {listing.stats?.conversionRate || 0}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Views Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={listing.detailedStats?.dailyViews || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="uniqueViews"
                          stroke="#10b981"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Inquiries Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={listing.detailedStats?.dailyInquiries || []}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="inquiries" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listing.detailedStats?.trafficSources?.map(
                      (source: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium">{source.source}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {source.visits} visits
                            </span>
                            <span className="text-sm text-gray-500">
                              ({source.percentage}%)
                            </span>
                          </div>
                        </div>
                      )
                    ) || (
                      <p className="text-center text-gray-500 py-4">
                        No traffic data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inquiries">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Inquiries</CardTitle>
                  <CardDescription>
                    Messages and inquiries about this listing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listing.conversations?.map((conversation: any) => (
                      <div
                        key={conversation.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {conversation.user.firstName?.[0]}
                                {conversation.user.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">
                                {conversation.user.firstName}{" "}
                                {conversation.user.lastName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {conversation.user.email}
                              </p>
                              <p className="text-sm text-gray-700 mt-2">
                                {conversation.latestMessage}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.updatedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p>No inquiries yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Listing History</CardTitle>
                  <CardDescription>
                    Timeline of changes and activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listing.moderationHistory?.map((history: any) => (
                      <div
                        key={history.id}
                        className="flex items-start space-x-3 border-b pb-3"
                      >
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {history.action}
                          </p>
                          <p className="text-sm text-gray-600">
                            {history.reason}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              by {history.moderator?.name || "System"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(history.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-center text-gray-500 py-8">
                        No history available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Views Today</span>
                <span className="font-medium">
                  {listing.stats?.viewsToday || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Views This Week</span>
                <span className="font-medium">
                  {listing.stats?.viewsThisWeek || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Inquiries Today</span>
                <span className="font-medium">
                  {listing.stats?.inquiriesToday || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Inquiries This Week
                </span>
                <span className="font-medium">
                  {listing.stats?.inquiriesThisWeek || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Performance Comparison */}
          {listing.performanceComparison && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Avg Views in Area
                  </span>
                  <span className="font-medium">
                    {listing.performanceComparison.averageViewsInArea}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Avg Price in Area
                  </span>
                  <span className="font-medium">
                    ₦
                    {listing.performanceComparison.averagePriceInArea.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Market Position</span>
                  <Badge variant="outline">
                    {listing.performanceComparison.marketPosition}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Similar Listings */}
          {listing.similarListings && listing.similarListings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Similar Listings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {listing.similarListings.map((similar: any) => (
                  <div key={similar.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={similar.images?.[0] || "/placeholder.svg"}
                        alt={similar.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">
                        {similar.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {similar.address}, {similar.city}, {similar.state}
                      </p>
                      <p className="text-xs font-medium">
                        ₦{similar.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                View Public Page
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Boost Listing
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Lister
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
