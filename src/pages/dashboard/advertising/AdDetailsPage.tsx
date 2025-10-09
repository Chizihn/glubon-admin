import { useQuery, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Play, Pause, Trash2 } from "lucide-react";
import PageRouter from "@/components/layouts/PageRouter";
import type { Ad } from "@/types/ad";
import { UPDATE_AD_STATUS, DELETE_AD } from "@/graphql/mutations/ads";
import { GET_AD } from "@/graphql/queries/ads";
import { useState } from "react";

export default function AdDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, loading, error } = useQuery<{ getAd: Ad }>(GET_AD, {
    variables: { id },
  });

  const [updateAdStatus, { loading: updateLoading }] =
    useMutation(UPDATE_AD_STATUS);
  const [deleteAd, { loading: deleteLoading }] = useMutation(DELETE_AD);

  const handleStatusUpdate = async (status: string) => {
    try {
      const result = await updateAdStatus({
        variables: { adId: id, status },
      });

      if (result.data?.updateAdStatus?.success) {
        toast.success("Ad status updated successfully");
      } else {
        toast.error(
          result.data?.updateAdStatus?.message || "Failed to update ad status"
        );
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("An error occurred while updating status");
    }
  };

  const handleDeleteAd = async () => {
    try {
      const result = await deleteAd({
        variables: { adId: id },
      });

      if (result.data?.deleteAd?.success) {
        toast.success("Ad deleted successfully");
        navigate("/dashboard/advertising");
      } else {
        toast.error(result.data?.deleteAd?.message || "Failed to delete ad");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting ad");
    } finally {
      setIsDeleteDialogOpen(false);
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

  const formatCurrency = (amount: number | null) => {
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !data?.getAd) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error?.message || "Ad not found"}
      </div>
    );
  }

  const ad = data.getAd;

  return (
    <div className="space-y-6">
      <PageRouter
        parentPath="/dashboard/advertising"
        parentLabel="Advertising"
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
        <div className="flex space-x-2">
          {ad.status === "ACTIVE" && (
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate("PAUSED")}
              disabled={updateLoading || deleteLoading}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause Ad
            </Button>
          )}
          {(ad.status === "PAUSED" || ad.status === "APPROVED") && (
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate("ACTIVE")}
              disabled={updateLoading || deleteLoading}
            >
              <Play className="h-4 w-4 mr-2" />
              Activate Ad
            </Button>
          )}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={updateLoading || deleteLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Ad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Ad</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the ad "{ad.title}"? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAd}
                  disabled={deleteLoading}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ad Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Title</p>
              <p className="text-gray-900">{ad.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-gray-900">{ad.description || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge className={getStatusColor(ad.status)}>{ad.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <Badge className={getTypeColor(ad.type)}>{ad.type}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Position</p>
              <Badge className="bg-gray-100 text-gray-800">{ad.position}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p className="text-gray-900">
                {new Date(ad.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p className="text-gray-900">
                {new Date(ad.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p className="text-gray-900">{formatCurrency(ad.budget)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Cost Per Click
              </p>
              <p className="text-gray-900">{formatCurrency(ad.costPerClick)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-gray-900">{ad.isActive ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Image URL</p>
              <a
                href={ad.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {ad.imageUrl}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Target URL</p>
              <a
                href={ad.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {ad.targetUrl}
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Created By</p>
              <p className="text-gray-900">{ad.createdBy || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-gray-900">
                {new Date(ad.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Updated At</p>
              <p className="text-gray-900">
                {new Date(ad.updatedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
