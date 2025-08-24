/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
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
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import {
  Users,
  Building2,
  Mail,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "../../../components/ui/datatable";

export default function BulkOperationsPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  // const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  // Mock data for bulk operations history
  const operationHistory = [
    {
      id: "1",
      type: "USER_BULK_UPDATE",
      action: "Status Update",
      itemsCount: 150,
      status: "COMPLETED",
      createdAt: "2024-01-15T10:30:00Z",
      completedAt: "2024-01-15T10:35:00Z",
      createdBy: "John Admin",
    },
    {
      id: "2",
      type: "PROPERTY_BULK_DELETE",
      action: "Delete Properties",
      itemsCount: 25,
      status: "IN_PROGRESS",
      createdAt: "2024-01-15T09:15:00Z",
      completedAt: null,
      createdBy: "Jane Admin",
    },
    {
      id: "3",
      type: "EMAIL_BULK_SEND",
      action: "Send Newsletter",
      itemsCount: 5000,
      status: "FAILED",
      createdAt: "2024-01-14T14:20:00Z",
      completedAt: "2024-01-14T14:25:00Z",
      createdBy: "Mike Marketing",
    },
  ];

  // Mock users for bulk operations
  const mockUsers = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      status: "ACTIVE",
      role: "TENANT",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      status: "SUSPENDED",
      role: "PROPERTY_OWNER",
    },
  ];

  // const mockProperties = [
  //   {
  //     id: "1",
  //     title: "Modern Apartment in Downtown",
  //     status: "ACTIVE",
  //     amount: 2500,
  //     city: "Lagos",
  //   },
  //   {
  //     id: "2",
  //     title: "Cozy Studio Near University",
  //     status: "PENDING",
  //     amount: 1800,
  //     city: "Abuja",
  //   },
  // ];

  const handleBulkUserAction = async () => {
    if (selectedUsers.length === 0 || !bulkAction) {
      toast.error("Please select users and an action");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Bulk action applied to ${selectedUsers.length} users`);

      setSelectedUsers([]);
      setBulkAction("");
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return CheckCircle;
      case "IN_PROGRESS":
        return Clock;
      case "FAILED":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const userColumns = [
    {
      key: "select",
      label: "",
      render: (_: any, user: any) => (
        <Checkbox
          checked={selectedUsers.includes(user.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedUsers([...selectedUsers, user.id]);
            } else {
              setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
            }
          }}
        />
      ),
    },
    {
      key: "name",
      label: "User",
      render: (_: any, user: any) => (
        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (role: string) => (
        <Badge variant="outline">{role.replace("_", " ")}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <Badge
          className={
            status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {status}
        </Badge>
      ),
    },
  ];

  const historyColumns = [
    {
      key: "type",
      label: "Operation",
      render: (type: string, operation: any) => (
        <div className="flex items-center space-x-2">
          {type.includes("USER") && <Users className="h-4 w-4 text-blue-500" />}
          {type.includes("PROPERTY") && (
            <Building2 className="h-4 w-4 text-green-500" />
          )}
          {type.includes("EMAIL") && (
            <Mail className="h-4 w-4 text-purple-500" />
          )}
          <span className="font-medium">{operation.action}</span>
        </div>
      ),
    },
    {
      key: "itemsCount",
      label: "Items",
      render: (count: number) => count.toLocaleString(),
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => {
        const Icon = getStatusIcon(status);
        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <Badge className={getStatusColor(status)}>
              {status.replace("_", " ")}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "createdBy",
      label: "Created By",
    },
    {
      key: "createdAt",
      label: "Started",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      key: "completedAt",
      label: "Completed",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleString() : "In Progress",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Operations</h1>
        <p className="text-gray-600">
          Perform bulk actions on users, properties, and other data
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Operations</TabsTrigger>
          <TabsTrigger value="properties">Property Operations</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="history">Operation History</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Bulk User Operations
              </CardTitle>
              <CardDescription>
                Select users and perform bulk actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activate">Activate Users</SelectItem>
                    <SelectItem value="suspend">Suspend Users</SelectItem>
                    <SelectItem value="delete">Delete Users</SelectItem>
                    <SelectItem value="send-email">Send Email</SelectItem>
                    <SelectItem value="export">Export Data</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleBulkUserAction}
                  disabled={selectedUsers.length === 0 || !bulkAction}
                >
                  Apply to {selectedUsers.length} users
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setSelectedUsers([])}
                  disabled={selectedUsers.length === 0}
                >
                  Clear Selection
                </Button>
              </div>

              <DataTable
                data={mockUsers}
                columns={userColumns}
                searchable
                searchPlaceholder="Search users..."
                loading={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Bulk Property Operations
              </CardTitle>
              <CardDescription>
                Select properties and perform bulk actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Property Bulk Operations
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Property bulk operations interface will be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import-export">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Import Data
                </CardTitle>
                <CardDescription>
                  Import users, properties, or other data from CSV files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Button variant="outline" className="mt-2">
                    Choose File
                  </Button>
                </div>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="properties">Properties</SelectItem>
                    <SelectItem value="transactions">Transactions</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full">Start Import</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Export Data
                </CardTitle>
                <CardDescription>
                  Export platform data to CSV or Excel files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">All Users</SelectItem>
                    <SelectItem value="properties">All Properties</SelectItem>
                    <SelectItem value="transactions">
                      All Transactions
                    </SelectItem>
                    <SelectItem value="analytics">Analytics Data</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Operation History</CardTitle>
              <CardDescription>
                View the history of all bulk operations performed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={operationHistory}
                columns={historyColumns}
                searchable
                searchPlaceholder="Search operations..."
                loading={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
