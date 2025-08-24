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
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Building2,
  MessageSquare,
  CreditCard,
  Shield,
  Edit,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_USER_BY_ID,
  UPDATE_USER_STATUS,
} from "../../../graphql/queries/users";
import { toast } from "sonner";
import { formatGraphQLError } from "../../../util/formatGraphQlError";
import { DataTable } from "../../../components/ui/datatable";
import type { Property } from "../../../types/property";
import PageRouter from "../../../components/layouts/PageRouter";

export default function UserDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.id as string;

  const { data, loading, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
  });

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  const user = data?.getUserById;

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateUserStatus({
        variables: {
          input: {
            userId,
            status,
          },
        },
      });

      toast.success("User status updated successfully");

      refetch();
    } catch (error) {
      const errMsg = formatGraphQLError(error);
      toast.error(errMsg || "Failed to update user status");
      console.error("Update user status error:", errMsg);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <PageRouter parentPath="/dashboard/users" parentLabel="Back to users" />
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
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 spac-y-6">
        <PageRouter parentPath="/dashboard/users" parentLabel="Back to users" />
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        <p className="text-gray-600 mt-2">
          The user you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "SUSPENDED":
        return "bg-yellow-100 text-yellow-800";
      case "BANNED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const listingColumns = [
    {
      key: "title",
      label: "Title",
      render: (title: string, listing: Property) => (
        <div className="flex items-center space-x-3">
          <img
            src={listing.images?.[0] || "/placeholder.svg"}
            alt={title}
            className="w-10 h-10 rounded object-cover"
          />
          <span className="font-medium">{title}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <Badge className={getStatusColor(status)}>{status}</Badge>
      ),
    },
    {
      key: "views",
      label: "Views",
    },
    {
      key: "inquiries",
      label: "Inquiries",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const transactionColumns = [
    {
      key: "type",
      label: "Type",
      render: (type: string) => type.replace("_", " "),
    },
    {
      key: "amount",
      label: "Amount",
      render: (amount: number) => `₦${amount.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <Badge className={getStatusColor(status)}>{status}</Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-8">
      <PageRouter parentPath="/dashboard/users" parentLabel="Back to users" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profilePic || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
                {user.isVerified && (
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
              onClick={() => navigate(`/dashboard/users/${userId}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>

            {user.status === "ACTIVE" ? (
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate("SUSPENDED")}
              >
                <Ban className="h-4 w-4 mr-2" />
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
                <TabsTrigger value="listings">Listings</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="conversations">Conversations</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">
                            {user.phoneNumber || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium">
                            {user.city && user.state
                              ? `${user.city}, ${user.state}`
                              : "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Joined</p>
                          <p className="font-medium">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Last Login</p>
                          <p className="font-medium">
                            {user.lastLogin
                              ? new Date(user.lastLogin).toLocaleDateString()
                              : "Never"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Total Listings
                          </p>
                          <p className="text-2xl font-bold">
                            {user.stats?.totalListings || 0}
                          </p>
                        </div>
                        <Building2 className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Views</p>
                          <p className="text-2xl font-bold">
                            {user.stats?.totalViews || 0}
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Conversations</p>
                          <p className="text-2xl font-bold">
                            {user.stats?.totalInquiries || 0}
                          </p>
                        </div>
                        <MessageSquare className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Spent</p>
                          <p className="text-2xl font-bold">
                            ₦{(user.totalSpent || 0).toLocaleString()}
                          </p>
                        </div>
                        <CreditCard className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="listings">
                <Card>
                  <CardHeader>
                    <CardTitle>User Listings</CardTitle>
                    <CardDescription>
                      All listings created by this user
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={user.listings || []}
                      columns={listingColumns}
                      searchable
                      searchPlaceholder="Search listings..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      All transactions made by this user
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={user.transactions || []}
                      columns={transactionColumns}
                      searchable
                      searchPlaceholder="Search transactions..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* <TabsContent value="conversations">
              <Card>
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                  <CardDescription>
                    All conversations involving this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.conversations?.map((conversation: Conversation) => (
                      <div
                        key={conversation.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {conversation.listingTitle}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {conversation.participantCount} participants
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {conversation.lastMessage}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(
                              conversation.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )) || (
                      <p className="text-center text-gray-500 py-8">
                        No conversations found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>
                      Recent user activities and system events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.activityLogs?.map((log: any) => (
                        <div
                          key={log.id}
                          className="flex items-start space-x-3 border-b pb-3"
                        >
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-sm text-gray-600">
                              {log.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(log.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-center text-gray-500 py-8">
                          No activity logs found
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
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  View Login History
                </Button>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.verificationHistory?.map((verification: any) => (
                  <div
                    key={verification.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {verification.type.replace("_", " ")}
                    </span>
                    <Badge
                      className={
                        verification.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : verification.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {verification.status}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">
                    No verification records
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            {user.financialSummary && (
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Spent</span>
                    <span className="font-medium">
                      ₦{user.financialSummary.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Earned</span>
                    <span className="font-medium">
                      ₦{user.financialSummary.totalEarned.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Pending Payments
                    </span>
                    <span className="font-medium">
                      ₦{user.financialSummary.pendingPayments.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
