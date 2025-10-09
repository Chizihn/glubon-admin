import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Eye,
  Search,
} from "lucide-react";
import {
  GET_VERIFICATIONS,
  APPROVE_VERIFICATION,
  REJECT_VERIFICATION,
} from "../../../graphql/queries/verification";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";

interface Verification {
  id: string;
  documentType: string;
  documentNumber: string;
  documentImages: string[];
  status: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: string;
  };
}

export default function PendingVerificationsPage() {
  const [selectedVerification, setSelectedVerification] =
    useState<Verification | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_VERIFICATIONS, {
    variables: {
      page: 1,
      limit: 50,
      status: "PENDING",
      search: searchTerm,
    },
    errorPolicy: "all",
  });

  const [approveVerification] = useMutation(APPROVE_VERIFICATION, {
    onCompleted: () => {
      toast.success("Verification approved successfully");
      refetch();
      setSelectedVerification(null);
    },
    onError: (error) => {
      toast.error(`Failed to approve verification: ${error.message}`);
    },
  });

  const [rejectVerification] = useMutation(REJECT_VERIFICATION, {
    onCompleted: () => {
      toast.success("Verification rejected successfully");
      refetch();
      setSelectedVerification(null);
    },
    onError: (error) => {
      toast.error(`Failed to reject verification: ${error.message}`);
    },
  });

  const handleApprove = async (verificationId: string) => {
    try {
      await approveVerification({
        variables: {
          verificationId,
          notes: "Approved by admin",
        },
      });
    } catch (error) {
      console.error("Error approving verification:", error);
    }
  };

  const handleReject = async (verificationId: string, reason: string) => {
    try {
      await rejectVerification({
        variables: {
          verificationId,
          reason,
        },
      });
    } catch (error) {
      console.error("Error rejecting verification:", error);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, refetch]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pending Verifications
          </h1>
          <p className="text-gray-600">Review and approve user verifications</p>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pending Verifications
          </h1>
          <p className="text-gray-600">Review and approve user verifications</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">
            Error loading verifications
          </h3>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  const verifications = data?.getVerifications?.items || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Pending Verifications
        </h1>
        <p className="text-gray-600">Review and approve user verifications</p>
      </div>

      <div className="relative w-full md:w-64 mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search verifications..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>

      <div className="grid gap-4">
        {verifications.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Pending Verifications
                </h3>
                <p className="text-gray-500">
                  All verifications have been processed.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          verifications.map((verification: Verification) => (
            <Card
              key={verification.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {verification.user.firstName[0]}
                        {verification.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {verification.user.firstName}{" "}
                        {verification.user.lastName}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {verification.user.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {verification.documentType} Verification
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Submitted{" "}
                      {new Date(verification.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVerification(verification)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Documents
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleReject(verification.id, "Documents not clear")
                        }
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(verification.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Document Review Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Review Documents</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVerification(null)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {selectedVerification.user.firstName[0]}
                    {selectedVerification.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {selectedVerification.user.firstName}{" "}
                    {selectedVerification.user.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {selectedVerification.user.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {selectedVerification.documentImages.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <img
                      src={doc}
                      alt={`Document ${index + 1}`}
                      className="w-full h-auto rounded"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleReject(selectedVerification.id, "Documents not clear")
                  }
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedVerification.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
