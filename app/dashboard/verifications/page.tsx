"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GET_PENDING_VERIFICATIONS,
  REVIEW_VERIFICATION,
} from "@/lib/graphql/queries";
import { Check, X, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/DataTable";
import Image from "next/image";

export default function VerificationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [reviewReason, setReviewReason] = useState("");

  const { data, loading, refetch } = useQuery(GET_PENDING_VERIFICATIONS, {
    variables: {
      page: currentPage,
      limit: 20,
    },
  });

  const [reviewVerification] = useMutation(REVIEW_VERIFICATION);

  const handleReview = async (verificationId: string, approved: boolean) => {
    try {
      await reviewVerification({
        variables: {
          input: {
            verificationId,
            approved,
            reason: reviewReason || undefined,
          },
        },
      });

      toast.success(
        `Verification ${approved ? "approved" : "rejected"} successfully`
      );

      setSelectedVerification(null);
      setReviewReason("");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "An error occured!");
      console.log(error.message || "An error occured!");
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "NIN":
        return "National ID";
      case "DRIVERS_LICENSE":
        return "Driver's License";
      case "INTERNATIONAL_PASSPORT":
        return "International Passport";
      default:
        return type;
    }
  };

  const columns = [
    {
      key: "user",
      label: "User",
      render: (_: any, verification: any) => (
        <div>
          <p className="font-medium text-gray-900">
            {verification.user.firstName} {verification.user.lastName}
          </p>
          <p className="text-sm text-gray-500">{verification.user.email}</p>
        </div>
      ),
    },
    {
      key: "documentType",
      label: "Document Type",
      render: (type: string) => getDocumentTypeLabel(type),
    },
    {
      key: "documentNumber",
      label: "Document Number",
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <Badge
          className={
            status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Submitted",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, verification: any) => (
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVerification(verification)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Review Verification</DialogTitle>
                <DialogDescription>
                  Review the submitted documents and approve or reject the
                  verification.
                </DialogDescription>
              </DialogHeader>

              {selectedVerification && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">User Information</h4>
                    <p>
                      {selectedVerification.user.firstName}{" "}
                      {selectedVerification.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedVerification.user.email}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Document Details</h4>
                    <p>
                      Type:{" "}
                      {getDocumentTypeLabel(selectedVerification.documentType)}
                    </p>
                    <p>Number: {selectedVerification.documentNumber}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Document Images</h4>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {selectedVerification.documentImages.map(
                        (image: string, index: number) => (
                          <div key={index} className="w-full h-32 relative">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Document ${index + 1}`}
                              fill
                              className="object-cover rounded border"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Review Reason (Optional)</Label>
                    <Textarea
                      id="reason"
                      value={reviewReason}
                      onChange={(e) => setReviewReason(e.target.value)}
                      placeholder="Add a reason for your decision..."
                      className="mt-1"
                    />
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={() =>
                        handleReview(selectedVerification.id, true)
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() =>
                        handleReview(selectedVerification.id, false)
                      }
                      variant="destructive"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verifications</h1>
          <p className="text-gray-600">Review pending identity verifications</p>
        </div>
      </div>

      <DataTable
        data={data?.getPendingVerifications?.items || []}
        columns={columns}
        searchable
        searchPlaceholder="Search verifications..."
        loading={loading}
        pagination={{
          currentPage,
          totalPages: data?.getPendingVerifications?.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
