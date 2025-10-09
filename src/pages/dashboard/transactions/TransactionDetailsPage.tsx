import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Building2,
  Calendar,
  CreditCard,
  FileText,
} from "lucide-react";

import { GET_TRANSACTION_BY_ID } from "@/graphql/queries/transactions";

export default function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, loading } = useQuery(GET_TRANSACTION_BY_ID, {
    variables: { transactionId: id },
    skip: !id,
  });

  const transaction = data?.transaction;

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return "bg-blue-100 text-blue-800";
      case "REFUND":
        return "bg-purple-100 text-purple-800";
      case "COMMISSION":
        return "bg-orange-100 text-orange-800";
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

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Transaction not found
        </h2>
        <p className="text-gray-600 mt-2">
          The transaction you're looking for doesn't exist.
        </p>
        <Link to="/dashboard/transactions">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/transactions">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transaction Details
            </h1>
            <p className="text-gray-600">{transaction.reference}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(transaction.status)}>
            {transaction.status}
          </Badge>
          <Badge className={getTypeColor(transaction.type)}>
            {transaction.type}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Transaction Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reference</p>
                  <p className="text-lg font-medium text-gray-900">
                    {transaction.reference}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-900">
                  {transaction.description || "N/A"}
                </p>
              </div>
              {/* <div>
                <p className="text-sm font-medium text-gray-500">
                  Payment Method
                </p>
                <p className="text-gray-900">
                  {transaction.paymentMethod || "N/A"}
                </p>
              </div> */}
              {transaction.gateway && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Payment Gateway
                  </p>
                  <p className="text-gray-900">{transaction.gateway}</p>
                </div>
              )}
              {transaction.gatewayRef && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Gateway Reference
                  </p>
                  <p className="text-gray-900">{transaction.gatewayRef}</p>
                </div>
              )}
              {transaction.failureReason && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Failure Reason
                  </p>
                  <p className="text-gray-900">{transaction.failureReason}</p>
                </div>
              )}
              {transaction.processedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Processed At
                  </p>
                  <p className="text-gray-900">
                    {new Date(transaction.processedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.user?.firstName && transaction.user?.lastName
                      ? `${transaction.user.firstName} ${transaction.user.lastName}`
                      : "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.user?.email || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.user?.phoneNumber || "N/A"}
                  </p>
                </div>
                {transaction.user?.id && (
                  <Link to={`/dashboard/users/${transaction.user.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Information */}
          {transaction.property && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.property.title}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      {formatCurrency(transaction.property.amount)}
                    </p>
                    {transaction.property.rentalPeriod && (
                      <p className="text-sm text-gray-600">
                        Rental Period: {transaction.property.rentalPeriod}
                      </p>
                    )}
                  </div>
                  <Link to={`/dashboard/listings/${transaction.property.id}`}>
                    <Button variant="outline" size="sm">
                      View Property
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Information */}
          {transaction.booking && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Booking ID
                  </p>
                  <p className="text-gray-900">{transaction.booking.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(transaction.booking.status)}>
                    {transaction.booking.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-gray-900">
                    {formatCurrency(
                      transaction.booking.amount,
                      transaction.currency
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Transaction Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-sm text-gray-900">
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Last Updated
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(transaction.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          {transaction.metadata && (
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(JSON.parse(transaction.metadata), null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                Refund Transaction
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Download Receipt
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
