import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Building2,
  CreditCard,
  Activity,
  Ban,
  CheckCircle,
} from "lucide-react";
import { GET_USER_BY_ID, UPDATE_USER_STATUS } from "@/graphql/queries/users";

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { userId: id },
    skip: !id,
  });

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  const user = data?.getUserById;

  const handleStatusUpdate = async (status: string) => {
    try {
      const result = await updateUserStatus({
        variables: {
          input: { userId: id, status },
        },
      });

      if (result.data?.updateUserStatus?.success) {
        toast.success("User status updated successfully");
        refetch();
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("An error occurred while updating status");
    }
  };

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "LISTER":
        return "bg-blue-100 text-blue-800";
      case "RENTER":
        return "bg-gray-100 text-gray-800";
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
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

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
        <p className="text-gray-600 mt-2">
          The user you're looking for doesn't exist.
        </p>
        <Link to="/dashboard/users">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
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
          <Link to="/dashboard/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.profilePic || "/placeholder.svg"} />
              <AvatarFallback>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
          {user.isVerified && (
            <Badge className="bg-green-100 text-green-800">Verified</Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          onClick={() => handleStatusUpdate("ACTIVE")}
          disabled={user.status === "ACTIVE"}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Activate
        </Button>
        <Button
          onClick={() => handleStatusUpdate("SUSPENDED")}
          disabled={user.status === "SUSPENDED"}
          variant="outline"
        >
          <Ban className="h-4 w-4 mr-2" />
          Suspend
        </Button>
        <Button
          onClick={() => handleStatusUpdate("BANNED")}
          disabled={user.status === "BANNED"}
          variant="destructive"
        >
          <Ban className="h-4 w-4 mr-2" />
          Ban
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    First Name
                  </p>
                  <p className="text-gray-900">{user.firstName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Name</p>
                  <p className="text-gray-900">{user.lastName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{user.phoneNumber || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{user.address || "N/A"}</p>
                    <p className="text-sm text-gray-600">
                      {user.city && user.state
                        ? `${user.city}, ${user.state}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account Type
                  </p>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Verified</p>
                  <Badge
                    className={
                      user.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {user.isVerified ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <Badge
                    className={
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {user.isActive ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Provider</p>
                <p className="text-gray-900">{user.provider || "EMAIL"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Activity Summary
              </CardTitle>
              <CardDescription>
                User engagement and activity metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-600">Properties Listed</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-600">Transactions</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Joined</p>
                <p className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Last Updated
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
              {user.lastLogin && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Login
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                Send Message
              </Button>
              <Button variant="outline" className="w-full" disabled>
                View Properties
              </Button>
              <Button variant="outline" className="w-full" disabled>
                View Transactions
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">No notes available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
