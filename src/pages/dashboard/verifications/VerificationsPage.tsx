import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Search, Loader2, Check, X, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  AlertDialog,
  AlertDialogDescription,
} from "../../../components/ui/alert-dialog";
import { GET_VERIFICATIONS } from "../../../graphql/queries/verification";
import { REVIEW_VERIFICATION } from "../../../graphql/mutations/verification";

type Verification = {
  id: string;
  documentType: string;
  documentNumber: string;
  documentImages: string[];
  status: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
};

type VerificationsResponse = {
  getVerifications: {
    items: Verification[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
    };
  };
};

const ITEMS_PER_PAGE = 10;

export default function VerificationsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVerification, setSelectedVerification] =
    useState<Verification | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  const { data, loading, error, refetch } = useQuery<VerificationsResponse>(
    GET_VERIFICATIONS,
    {
      variables: { page, limit: ITEMS_PER_PAGE, search: searchTerm },
      fetchPolicy: "network-only",
    }
  );

  const [reviewVerification] = useMutation(REVIEW_VERIFICATION, {
    onCompleted: () => {
      toast.success("Verification processed successfully");
      refetch();
      setSelectedVerification(null);
      setIsRejecting(false);
      setIsApproving(false);
      setRejectionReason("");
    },
    onError: (error) => {
      toast.error(error.message);
      setIsRejecting(false);
      setIsApproving(false);
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleApprove = (verificationId: string) => {
    setIsApproving(true);
    reviewVerification({
      variables: {
        input: {
          verificationId,
          approved: true,
          reason: "",
        },
      },
    });
  };

  const handleReject = (verificationId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsRejecting(true);
    reviewVerification({
      variables: {
        input: {
          verificationId,
          approved: false,
          reason,
        },
      },
    });
  };

  const verifications = data?.getVerifications?.items || [];
  const pagination = data?.getVerifications?.pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timerId);
  }, [refetch, searchTerm]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <AlertDialog>
        <AlertCircle className="h-4 w-4" />
        <AlertDialogDescription>
          Error loading verifications: {error.message}
        </AlertDialogDescription>
      </AlertDialog>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Verification Requests</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage user verification requests
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search verifications..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Document Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications.map((verification) => (
              <TableRow key={verification.id}>
                <TableCell className="font-medium">
                  {verification.user?.firstName} {verification.user?.lastName}
                  <p className="text-sm text-muted-foreground">
                    {verification.user?.email}
                  </p>
                </TableCell>
                <TableCell className="capitalize">
                  {verification.documentType?.toLowerCase().replace(/_/g, " ")}
                </TableCell>
                <TableCell>{verification.documentNumber}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      verification.status === "APPROVED"
                        ? "default"
                        : verification.status === "REJECTED"
                        ? "destructive"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {verification.status?.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(verification.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVerification(verification);
                        setIsRejecting(false);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:bg-green-50"
                      onClick={() => handleApprove(verification.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setSelectedVerification(verification);
                        setIsRejecting(true);
                        setRejectionReason(verification.rejectionReason || "");
                      }}
                      disabled={isRejecting}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {verifications.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">
            No pending verification requests found
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}

      {/* View/Reject Dialog */}
      <Dialog
        open={!!selectedVerification}
        onOpenChange={(open) => !open && setSelectedVerification(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedVerification && (
            <>
              <DialogHeader>
                <DialogTitle>Verification Details</DialogTitle>
                <DialogDescription>
                  Review the submitted documents and take action
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">User Information</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {selectedVerification.user.firstName}{" "}
                          {selectedVerification.user.lastName}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {selectedVerification.user.email}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {selectedVerification.user.phoneNumber || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Role:</span>{" "}
                          <Badge variant="outline" className="capitalize">
                            {selectedVerification.user.role.toLowerCase()}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Document Information</h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="font-medium">Document Type:</span>{" "}
                        <span className="capitalize">
                          {selectedVerification.documentType
                            ?.toLowerCase()
                            .replace(/_/g, " ")}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Document Number:</span>{" "}
                        {selectedVerification.documentNumber}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <Badge
                          variant={
                            selectedVerification.status === "APPROVED"
                              ? "default"
                              : selectedVerification.status === "REJECTED"
                              ? "destructive"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {selectedVerification.status?.toLowerCase()}
                        </Badge>
                      </p>
                      <p>
                        <span className="font-medium">Submitted:</span>{" "}
                        {new Date(
                          selectedVerification.createdAt
                        ).toLocaleString()}
                      </p>
                      {selectedVerification.rejectionReason && (
                        <p>
                          <span className="font-medium">Rejection Reason:</span>{" "}
                          <span className="text-destructive">
                            {selectedVerification.rejectionReason}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Document Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedVerification.documentImages?.map(
                      (image, index) => (
                        <div
                          key={index}
                          className="border rounded-md overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`Document ${index + 1}`}
                            className="w-full h-48 object-contain bg-muted"
                          />
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            {`Document ${index + 1}`}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {isRejecting ? (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Rejection Reason</h3>
                    <div className="space-y-4">
                      <Input
                        placeholder="Enter reason for rejection"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        disabled={isRejecting}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsRejecting(false);
                            setRejectionReason("");
                          }}
                          disabled={isRejecting}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleReject(
                              selectedVerification.id,
                              rejectionReason
                            )
                          }
                          disabled={!rejectionReason.trim() || isRejecting}
                        >
                          {isRejecting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Confirm Reject"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVerification(null)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsRejecting(true);
                        setRejectionReason(
                          selectedVerification.rejectionReason || ""
                        );
                      }}
                    >
                      Reject Verification
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedVerification.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Approve Verification"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
