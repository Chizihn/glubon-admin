/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

import { toast } from "sonner";

import { useNavigate, useParams } from "react-router-dom";
import { GET_LISTING_BY_ID } from "../../../graphql/queries/listings";
import { UPDATE_PROPERTY_STATUS } from "../../../graphql/mutations/listings";

const editListingSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  propertyType: z.string(),
  status: z.string(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  sqft: z.number().optional(),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  isFurnished: z.boolean(),
  featured: z.boolean(),
  amenities: z.array(z.string()).optional(),
});

type EditListingForm = z.infer<typeof editListingSchema>;

export default function ListingEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const listingId = params.id as string;

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const { data, loading } = useQuery(GET_LISTING_BY_ID, {
    variables: { getPropertyId: listingId },
  });

  const [updateListing] = useMutation(UPDATE_PROPERTY_STATUS);

  const listing = data?.getProperty;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<EditListingForm>({
    resolver: zodResolver(editListingSchema),
    defaultValues: listing
      ? {
          title: listing.title,
          description: listing.description,
          propertyType: listing.propertyType,
          status: listing.status,
          amount: listing.amount,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          sqft: listing.sqft,
          address: listing.address,
          city: listing.city,
          state: listing.state,
          isFurnished: listing.isFurnished,
          featured: listing.featured,
          amenities: listing.amenities || [],
        }
      : undefined,
  });

  const availableAmenities = [
    "Swimming Pool",
    "Gym",
    "Security",
    "Parking",
    "Generator",
    "Air Conditioning",
    "Balcony",
    "Garden",
    "Elevator",
    "CCTV",
    "Water Supply",
    "Internet",
    "Laundry",
    "Playground",
    "Shopping Mall",
  ];

  const onSubmit = async (data: EditListingForm) => {
    try {
      // Only status and featured updates are supported by the backend for now
      if (data.status !== listing.status) {
        await updateListing({
          variables: {
            input: {
              propertyId: listingId,
              status: data.status,
            },
          },
        });
      }

      // TODO: Handle other field updates when backend supports it
      if (
        data.title !== listing.title ||
        data.description !== listing.description ||
        data.amount !== listing.amount
      ) {
        toast.info(
          "Note: Only status and featured updates are currently supported. Other changes were not saved."
        );
      } else {
        toast.success("Listing updated successfully");
      }

      navigate(`/dashboard/listings/${listingId}`);
    } catch (error: any) {
      toast.error(error.message || "An error occured");
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-96 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Listing not found</h2>
        <p className="text-gray-600 mt-2">
          The listing you&apos;re trying to edit doesn&apos;t exist.
        </p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
            <p className="text-gray-600">
              Update listing information and settings
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the listing&apos;s basic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    className={errors.title ? "border-red-500" : ""}
                    placeholder="Modern 3-bedroom apartment in Victoria Island"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    className={errors.description ? "border-red-500" : ""}
                    placeholder="Describe the property in detail..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      onValueChange={(value) => setValue("propertyType", value)}
                      defaultValue={listing.propertyType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APARTMENT">Apartment</SelectItem>
                        <SelectItem value="HOUSE">House</SelectItem>
                        <SelectItem value="DUPLEX">Duplex</SelectItem>
                        <SelectItem value="FLAT">Flat</SelectItem>
                        <SelectItem value="SELF_CON">Self Con</SelectItem>
                        <SelectItem value="ROOM">Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value) => setValue("status", value)}
                      defaultValue={listing.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="PENDING_REVIEW">
                          Pending Review
                        </SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        <SelectItem value="RENTED">Rented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount">Amount (₦) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    {...register("amount", { valueAsNumber: true })}
                    className={errors.amount ? "border-red-500" : ""}
                    placeholder="2500000"
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>
                  Specify the property&apos;s physical characteristics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      {...register("bedrooms", { valueAsNumber: true })}
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      {...register("bathrooms", { valueAsNumber: true })}
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sqft">Area (sqft)</Label>
                    <Input
                      id="sqft"
                      type="number"
                      {...register("sqft", { valueAsNumber: true })}
                      placeholder="1200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isFurnished">Furnished</Label>
                    <p className="text-sm text-gray-600">
                      Is this property furnished?
                    </p>
                  </div>
                  <Switch
                    id="isFurnished"
                    checked={watch("isFurnished")}
                    onCheckedChange={(checked) =>
                      setValue("isFurnished", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Property location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    className={errors.address ? "border-red-500" : ""}
                    placeholder="123 Main Street, Victoria Island"
                    rows={2}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      className={errors.city ? "border-red-500" : ""}
                      placeholder="Lagos"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      className={errors.state ? "border-red-500" : ""}
                      placeholder="Lagos State"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Select available amenities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableAmenities.map((amenity) => (
                    <div
                      key={amenity}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Upload property images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="relative ">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload Image</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured">Featured Listing</Label>
                    <p className="text-sm text-gray-600">
                      Highlight this listing
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={watch("featured")}
                    onCheckedChange={(checked) => setValue("featured", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">
                    {new Date(listing.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="text-sm font-medium">
                    {listing.viewsCount || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Likes</span>
                  <span className="text-sm font-medium">
                    {listing.likesCount || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
