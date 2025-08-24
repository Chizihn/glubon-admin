import { useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
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
  CreditCard,
  DollarSign,
  Calendar,
  User,
  Building2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_TRANSACTION_BY_ID } from "../../../graphql/queries/transaction";

export default function TransactionDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const transactionId = params.id as string;

  const { data, loading } = useQuery(GET_TRANSACTION_BY_ID, {
    variables: { transactionId },
  });

  //   const [processRefund] = useMutation(PROCESS_REFUND);

  const transaction = data?.transaction;

  //   const handleRefund = async (amount: number) => {
  //     try {
  //       await processRefund({
  //         variables: {
  //           input: {
  //             transactionId,
  //             amount,
  //             reason: "Admin initiated refund",
  //           },
  //         },
  //       });
  //       toast.success("Refund processed successfully");
  //       refetch();
  //     } catch (error: any) {
  //       toast.error(error.message || "An error occurred");
  //     }
  //   };

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

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Transaction not found
        </h2>
        <p className="text-gray-600 mt-2">
          The transaction you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          onClick={() => navigate("/dashboard/transactions")}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/transactions")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transaction Details
            </h1>
            <p className="text-gray-600">Reference: {transaction.reference}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* <div className="flex space-x-2">
          {transaction.status === "COMPLETED" && (
            <Button
              variant="outline"
              onClick={() => handleRefund(transaction.amount)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Process Refund
            </Button>
          )}

          {transaction.status === "FAILED" && (
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Payment
            </Button>
          )}
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="booking">Booking Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Transaction Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-medium text-lg">
                            {transaction.currency}{" "}
                            {transaction.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Payment Method
                          </p>
                          <p className="font-medium">
                            {transaction.paymentMethod.replace("_", " ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium">
                          {transaction.type.replace("_", " ")}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Gateway</p>
                        <p className="font-medium">{transaction.gateway}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">
                          Gateway Reference
                        </p>
                        <p className="font-medium font-mono text-sm">
                          {transaction.gatewayRef}
                        </p>
                      </div>
                    </div>
                  </div>

                  {transaction.description && (
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium">{transaction.description}</p>
                    </div>
                  )}

                  {transaction.failureReason && (
                    <div>
                      <p className="text-sm text-gray-600">Failure Reason</p>
                      <p className="font-medium text-red-600">
                        {transaction.failureReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{`${transaction.user.firstName} ${transaction.user.lastName}`}</h4>
                      <p className="text-sm text-gray-600">
                        {transaction.user.email}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/users/${transaction.user.id}`)
                      }
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related Property */}
              {transaction.property && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Property</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {transaction.property.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          by {transaction.property.owner.firstName}{" "}
                          {transaction.property.owner.lastName}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/dashboard/listings/${transaction.property.id}`
                          )
                        }
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        View Property
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="booking">
              {transaction.booking ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Booking ID</p>
                        <p className="font-medium font-mono text-sm">
                          {transaction.booking.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge
                          className={getStatusColor(transaction.booking.status)}
                        >
                          {transaction.booking.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-medium">
                          {new Date(
                            transaction.booking.startDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-medium">
                          {new Date(
                            transaction.booking.endDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-medium">
                          {transaction.currency}{" "}
                          {transaction.booking.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Escrow Transaction ID
                        </p>
                        <p className="font-medium font-mono text-sm">
                          {transaction.booking.escrowTransactionId || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8 text-gray-500">
                    No booking details available
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* {transaction.status === "COMPLETED" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleRefund(transaction.amount)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Process Refund
                </Button>
              )}

              {transaction.status === "FAILED" && (
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Payment
                </Button>
              )} */}

              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Flag Transaction
              </Button>
            </CardContent>
          </Card>

          {/* Transaction Info */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reference</span>
                <span className="font-mono text-sm">
                  {transaction.reference}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </span>
              </div>

              {transaction.processedAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processed</span>
                  <span className="text-sm">
                    {new Date(transaction.processedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
