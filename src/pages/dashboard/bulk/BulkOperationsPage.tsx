import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import { Users, Building2, Mail, AlertTriangle } from "lucide-react";

import { BULK_UPDATE_USER_STATUS } from "@/graphql/mutations/bulk";

export default function BulkOperationsPage() {
  const [selectedOperation, setSelectedOperation] = useState("");
  const [userIds, setUserIds] = useState("");
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [bulkUpdateUserStatus] = useMutation(BULK_UPDATE_USER_STATUS);

  const handleBulkUserStatusUpdate = async () => {
    if (!userIds.trim() || !status) {
      toast.error("Please provide user IDs and select a status");
      return;
    }

    const userIdArray = userIds
      .split("\n")
      .map((id) => id.trim())
      .filter((id) => id);

    if (userIdArray.length === 0) {
      toast.error("Please provide valid user IDs");
      return;
    }

    setIsLoading(true);
    try {
      const result = await bulkUpdateUserStatus({
        variables: {
          userIds: userIdArray,
          status,
          reason: reason.trim() || undefined,
        },
      });

      if (result.data?.bulkUpdateUserStatus?.success) {
        const { updatedCount, failedCount } = result.data.bulkUpdateUserStatus;
        toast.success(
          `Successfully updated ${updatedCount} users. ${
            failedCount > 0 ? `${failedCount} failed.` : ""
          }`
        );
        setUserIds("");
        setReason("");
      } else {
        toast.error(
          result.data?.bulkUpdateUserStatus?.message || "Bulk operation failed"
        );
      }
    } catch (error) {
      console.error("Bulk operation error:", error);
      toast.error("An error occurred during bulk operation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Operations</h1>
        <p className="text-gray-600">
          Perform bulk operations on users and properties
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedOperation("users")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Operations
            </CardTitle>
            <CardDescription>
              Bulk update user statuses and properties
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Property Operations
            </CardTitle>
            <CardDescription>
              Bulk update property statuses (Coming Soon)
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Communication
            </CardTitle>
            <CardDescription>
              Send bulk notifications (Coming Soon)
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {selectedOperation === "users" && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk User Status Update</CardTitle>
            <CardDescription>
              Update the status of multiple users at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Warning
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This operation will affect multiple users. Please ensure you
                    have the correct user IDs and reason for the status change.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="userIds">User IDs (one per line)</Label>
              <Textarea
                id="userIds"
                placeholder="Enter user IDs, one per line..."
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                rows={6}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                placeholder="Reason for status change..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleBulkUserStatusUpdate}
              disabled={isLoading || !userIds.trim() || !status}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Update User Status"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
