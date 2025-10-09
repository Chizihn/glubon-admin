import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdPosition, AdType } from "@/types/ad";
import PageRouter from "@/components/layouts/PageRouter";

const CREATE_AD = gql`
  mutation CreateAd($input: CreateAdInput!) {
    createAd(input: $input) {
      id
      title
      description
      imageUrl
      targetUrl
      position
      type
      status
      startDate
      endDate
      budget
      costPerClick
      isActive
      createdBy
      createdAt
      updatedAt
    }
  }
`;

interface FormValues {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: AdPosition | "";
  type: AdType | "";
  startDate: string;
  endDate: string;
  budget: string;
  costPerClick: string;
}

export default function CreateAdPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormValues>({
    title: "",
    description: "",
    imageUrl: "",
    targetUrl: "",
    position: "",
    type: "",
    startDate: "",
    endDate: "",
    budget: "",
    costPerClick: "",
  });
  const [createAd, { loading }] = useMutation(CREATE_AD);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formValues.title ||
      !formValues.imageUrl ||
      !formValues.targetUrl ||
      !formValues.position ||
      !formValues.type ||
      !formValues.startDate ||
      !formValues.endDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const input = {
        title: formValues.title,
        description: formValues.description || null,
        imageUrl: formValues.imageUrl,
        targetUrl: formValues.targetUrl,
        position: formValues.position,
        type: formValues.type,
        startDate: new Date(formValues.startDate).toISOString(),
        endDate: new Date(formValues.endDate).toISOString(),
        budget: formValues.budget ? parseFloat(formValues.budget) : null,
        costPerClick: formValues.costPerClick
          ? parseFloat(formValues.costPerClick)
          : null,
      };

      const { data } = await createAd({ variables: { input } });

      if (data?.createAd?.id) {
        toast.success("Ad created successfully");
        navigate("/dashboard/advertising");
      } else {
        toast.error("Failed to create ad");
      }
    } catch (error) {
      console.error("Create ad error:", error);
      toast.error("An error occurred while creating the ad");
    }
  };

  return (
    <div className="space-y-6">
      <PageRouter
        parentPath="/dashboard/advertising"
        parentLabel="Advertising"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Ad</h1>
        <p className="text-gray-600">
          Fill in the details to create a new advertisement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            placeholder="Enter ad title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            placeholder="Enter ad description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL *</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formValues.imageUrl}
            onChange={handleInputChange}
            placeholder="Enter image URL"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetUrl">Target URL *</Label>
          <Input
            id="targetUrl"
            name="targetUrl"
            type="url"
            value={formValues.targetUrl}
            onChange={handleInputChange}
            placeholder="Enter target URL"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Ad Type *</Label>
          <Select
            value={formValues.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ad type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STANDARD">Standard</SelectItem>
              <SelectItem value="PREMIUM">Premium</SelectItem>
              <SelectItem value="SPONSORED">Sponsored</SelectItem>
              <SelectItem value="FEATURED">Featured</SelectItem>
              <SelectItem value="BANNER">Banner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Ad Position *</Label>
          <Select
            value={formValues.position}
            onValueChange={(value) => handleSelectChange("position", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ad position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="APP_HOME_FEED_TOP">
                App Home Feed Top
              </SelectItem>
              <SelectItem value="APP_HOME_FEED_MID">
                App Home Feed Mid
              </SelectItem>
              <SelectItem value="APP_HOME_FEED_BOTTOM">
                App Home Feed Bottom
              </SelectItem>
              <SelectItem value="APP_SEARCH_RESULTS_TOP">
                App Search Results Top
              </SelectItem>
              <SelectItem value="APP_PROPERTY_DETAIL">
                App Property Detail
              </SelectItem>
              <SelectItem value="APP_BOOKING_CONFIRM">
                App Booking Confirm
              </SelectItem>
              <SelectItem value="WEB_LANDING_HERO">Web Landing Hero</SelectItem>
              <SelectItem value="WEB_LANDING_FEATURED">
                Web Landing Featured
              </SelectItem>
              <SelectItem value="WEB_LANDING_BOTTOM">
                Web Landing Bottom
              </SelectItem>
              <SelectItem value="WEB_BLOG_SIDEBAR">Web Blog Sidebar</SelectItem>
              <SelectItem value="WEB_FOOTER">Web Footer</SelectItem>
              <SelectItem value="SEARCH_BAR">Search Bar</SelectItem>
              <SelectItem value="BETWEEN_LISTINGS">Between Listings</SelectItem>
              <SelectItem value="INTERSTITIAL">Interstitial</SelectItem>
              <SelectItem value="TOP_BANNER">Top Banner</SelectItem>
              <SelectItem value="SIDEBAR">Sidebar</SelectItem>
              <SelectItem value="INLINE">Inline</SelectItem>
              <SelectItem value="FOOTER">Footer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formValues.startDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formValues.endDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            value={formValues.budget}
            onChange={handleInputChange}
            placeholder="Enter budget amount"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPerClick">Cost Per Click</Label>
          <Input
            id="costPerClick"
            name="costPerClick"
            type="number"
            value={formValues.costPerClick}
            onChange={handleInputChange}
            placeholder="Enter cost per click"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex space-x-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Ad"}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/advertising">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
