import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Star,
  Ban,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  UPDATE_PROPERTY_STATUS,
  TOGGLE_PROPERTY_FEATURED,
} from "@/graphql/mutations/properties";
import { GET_LISTING_BY_ID } from "@/graphql/queries/listings";

// Define PropertyStatus enum
enum PropertyStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

// Define the Property type based on the provided data
import type { Property } from "@/types/property";

// Define the valid transitions type using Record
type ValidTransitions = Record<PropertyStatus, PropertyStatus[]>;

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, refetch } = useQuery<{ getProperty: Property }>(
    GET_LISTING_BY_ID,
    {
      variables: { getPropertyId: id },
      skip: !id,
      fetchPolicy: "network-only",
    }
  );

  const [updatePropertyStatus] = useMutation(UPDATE_PROPERTY_STATUS);
  const [togglePropertyFeatured] = useMutation(TOGGLE_PROPERTY_FEATURED);

  const property = data?.getProperty;

  // Define valid state transitions
  const validTransitions: ValidTransitions = {
    [PropertyStatus.PENDING]: [PropertyStatus.ACTIVE, PropertyStatus.REJECTED],
    [PropertyStatus.ACTIVE]: [
      PropertyStatus.SUSPENDED,
      PropertyStatus.REJECTED,
    ],
    [PropertyStatus.SUSPENDED]: [
      PropertyStatus.ACTIVE,
      PropertyStatus.REJECTED,
    ],
    [PropertyStatus.REJECTED]: [PropertyStatus.PENDING],
  };

  const handleStatusUpdate = async (status: PropertyStatus) => {
    try {
      const result = await updatePropertyStatus({
        variables: {
          input: { propertyId: id, status },
        },
      });

      if (result.data?.updatePropertyStatus?.success) {
        toast.success(`Property status updated to ${status}`);
        refetch();
      } else {
        toast.error("Failed to update property status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("An error occurred while updating status");
    }
  };

  const handleToggleFeatured = async () => {
    try {
      const result = await togglePropertyFeatured({
        variables: { propertyId: id },
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

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case PropertyStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case PropertyStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case PropertyStatus.SUSPENDED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Property not found
        </h2>
        <p className="text-gray-600 mt-2">
          The property you're looking for doesn't exist.
        </p>
        <Link to="/dashboard/listings">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  // Map data fields to match component expectations
  const isFeatured = property.featured;
  const price = property.amount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/listings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {property.title}
            </h1>
            <p className="text-gray-600">Property Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(property.status)}>
            {property.status}
          </Badge>
          {isFeatured && (
            <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        {validTransitions[property.status]?.includes(PropertyStatus.ACTIVE) && (
          <Button
            onClick={() => handleStatusUpdate(PropertyStatus.ACTIVE)}
            className="bg-green-600 hover:bg-green-700"
            disabled={property.status === PropertyStatus.ACTIVE}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        )}
        {validTransitions[property.status]?.includes(
          PropertyStatus.REJECTED
        ) && (
          <Button
            onClick={() => handleStatusUpdate(PropertyStatus.REJECTED)}
            variant="destructive"
            disabled={property.status === PropertyStatus.REJECTED}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        )}
        {validTransitions[property.status]?.includes(
          PropertyStatus.SUSPENDED
        ) && (
          <Button
            onClick={() => handleStatusUpdate(PropertyStatus.SUSPENDED)}
            variant="outline"
            disabled={property.status === PropertyStatus.SUSPENDED}
          >
            <Ban className="h-4 w-4 mr-2" />
            Suspend
          </Button>
        )}
        <Button onClick={handleToggleFeatured} variant="outline">
          <Star className="h-4 w-4 mr-2" />
          {isFeatured ? "Remove Featured" : "Make Featured"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.images?.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {property.address}, {property.city}, {property.state},{" "}
                {property.country}
              </p>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              {property.amenities.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700">
                  {property.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No amenities listed</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Property Info */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="text-2xl font-bold text-blue-600">
                  {property.priceUnit} {price?.toLocaleString()} /{" "}
                  {property.pricePer}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Listing Type
                </p>
                <p className="text-gray-900">{property.listingType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Rental Period
                </p>
                <p className="text-gray-900">{property.rentalPeriod}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Room Type</p>
                <p className="text-gray-900">{property.roomType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Property Type
                </p>
                <p className="text-gray-900">{property.propertyType}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Bedrooms</p>
                  <p className="text-gray-900">{property.bedrooms || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bathrooms</p>
                  <p className="text-gray-900">{property.bathrooms || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Area</p>
                <p className="text-gray-900">
                  {property.sqft ? `${property.sqft} sqft` : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Property Features */}
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  For Students
                </p>
                <p className="text-gray-900">
                  {property.isForStudents ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">Furnished</p>
                <p className="text-gray-900">
                  {property.isFurnished ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Ownership Verified
                </p>
                <p className="text-gray-900">
                  {property.ownershipVerified ? "Yes" : "No"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visiting Information */}
          <Card>
            <CardHeader>
              <CardTitle>Visiting Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Visiting Days
                </p>
                <p className="text-gray-900">
                  {property.visitingDays.length > 0
                    ? property.visitingDays.join(", ")
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Visiting Hours
                </p>
                <p className="text-gray-900">
                  {property.visitingTimeStart && property.visitingTimeEnd
                    ? `${property.visitingTimeStart} - ${property.visitingTimeEnd}`
                    : "Not specified"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle>Property Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium text-gray-900">
                {property.owner?.firstName} {property.owner?.lastName}
              </p>
              <p className="text-sm text-gray-600">{property.owner?.email}</p>
              <p className="text-sm text-gray-600">
                {property.owner?.phoneNumber}
              </p>
              <Link to={`/dashboard/users/${property.owner?.id}`}>
                <Button variant="outline" size="sm" className="mt-2">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Engagement Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Views</span>
                </div>
                <span className="font-medium">{property.viewsCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Likes</span>
                </div>
                <span className="font-medium">{property.likesCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Inquiries</span>
                </div>
                <span className="font-medium">0</span>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-sm text-gray-900">
                  {new Date(property.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Last Updated
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(property.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
