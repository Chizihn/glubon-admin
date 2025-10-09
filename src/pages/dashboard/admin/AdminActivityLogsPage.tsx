import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Search,
  Download,
  RefreshCw,
  User,
  Settings,
  Shield,
  Building2,
  Calendar as CalendarIcon,
  Activity,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX,
} from "lucide-react";
import { cn } from "../../../lib/utils";

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actionType:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "VIEW"
    | "LOGIN"
    | "LOGOUT"
    | "APPROVE"
    | "REJECT";
  resource: string;
  resourceId?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic?: string;
    role: string;
  };
  details?: string;
  ip?: string;
  userAgent?: string;
  changes?: Record<string, { from: any; to: any }>;
}

// Mock activity logs data
const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15T10:30:00Z",
    action: "User account suspended",
    actionType: "UPDATE",
    resource: "user",
    resourceId: "user_123",
    user: {
      id: "admin1",
      firstName: "John",
      lastName: "Admin",
      email: "john.admin@glubon.com",
      role: "ADMIN",
    },
    details: "Suspended user account due to policy violation",
    ip: "192.168.1.100",
    changes: {
      status: { from: "ACTIVE", to: "SUSPENDED" },
    },
  },
  {
    id: "2",
    timestamp: "2024-01-15T10:25:00Z",
    action: "Property listing approved",
    actionType: "APPROVE",
    resource: "property",
    resourceId: "prop_456",
    user: {
      id: "admin2",
      firstName: "Sarah",
      lastName: "Manager",
      email: "sarah.manager@glubon.com",
      role: "ADMIN",
    },
    details: "Approved property listing after verification",
    ip: "192.168.1.101",
  },
  {
    id: "3",
    timestamp: "2024-01-15T10:20:00Z",
    action: "Admin user created",
    actionType: "CREATE",
    resource: "admin",
    resourceId: "admin_789",
    user: {
      id: "superadmin1",
      firstName: "Mike",
      lastName: "SuperAdmin",
      email: "mike.super@glubon.com",
      role: "SUPER_ADMIN",
    },
    details: "Created new admin user with limited permissions",
    ip: "192.168.1.102",
  },
  {
    id: "4",
    timestamp: "2024-01-15T10:15:00Z",
    action: "Platform settings updated",
    actionType: "UPDATE",
    resource: "settings",
    resourceId: "platform_config",
    user: {
      id: "admin1",
      firstName: "John",
      lastName: "Admin",
      email: "john.admin@glubon.com",
      role: "ADMIN",
    },
    details: "Updated maintenance mode settings",
    ip: "192.168.1.100",
    changes: {
      maintenanceMode: { from: false, to: true },
    },
  },
  {
    id: "5",
    timestamp: "2024-01-15T10:10:00Z",
    action: "Verification document rejected",
    actionType: "REJECT",
    resource: "verification",
    resourceId: "verify_321",
    user: {
      id: "admin3",
      firstName: "Lisa",
      lastName: "Verifier",
      email: "lisa.verifier@glubon.com",
      role: "ADMIN",
    },
    details: "Rejected verification document due to poor quality",
    ip: "192.168.1.103",
  },
  {
    id: "6",
    timestamp: "2024-01-15T10:05:00Z",
    action: "User profile viewed",
    actionType: "VIEW",
    resource: "user",
    resourceId: "user_654",
    user: {
      id: "admin2",
      firstName: "Sarah",
      lastName: "Manager",
      email: "sarah.manager@glubon.com",
      role: "ADMIN",
    },
    details: "Viewed user profile for support inquiry",
    ip: "192.168.1.101",
  },
  {
    id: "7",
    timestamp: "2024-01-15T10:00:00Z",
    action: "Admin logged in",
    actionType: "LOGIN",
    resource: "auth",
    user: {
      id: "admin1",
      firstName: "John",
      lastName: "Admin",
      email: "john.admin@glubon.com",
      role: "ADMIN",
    },
    details: "Successful admin login",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "8",
    timestamp: "2024-01-15T09:55:00Z",
    action: "Property listing deleted",
    actionType: "DELETE",
    resource: "property",
    resourceId: "prop_987",
    user: {
      id: "admin2",
      firstName: "Sarah",
      lastName: "Manager",
      email: "sarah.manager@glubon.com",
      role: "ADMIN",
    },
    details: "Deleted property listing due to policy violation",
    ip: "192.168.1.101",
  },
];

const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case "CREATE":
      return <Plus className="h-4 w-4 text-green-500" />;
    case "UPDATE":
      return <Edit className="h-4 w-4 text-blue-500" />;
    case "DELETE":
      return <Trash2 className="h-4 w-4 text-red-500" />;
    case "VIEW":
      return <Eye className="h-4 w-4 text-gray-500" />;
    case "LOGIN":
      return <UserCheck className="h-4 w-4 text-green-500" />;
    case "LOGOUT":
      return <UserX className="h-4 w-4 text-gray-500" />;
    case "APPROVE":
      return <UserCheck className="h-4 w-4 text-green-500" />;
    case "REJECT":
      return <UserX className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

const getActionColor = (actionType: string) => {
  switch (actionType) {
    case "CREATE":
      return "bg-green-100 text-green-800";
    case "UPDATE":
      return "bg-blue-100 text-blue-800";
    case "DELETE":
      return "bg-red-100 text-red-800";
    case "VIEW":
      return "bg-gray-100 text-gray-800";
    case "LOGIN":
      return "bg-green-100 text-green-800";
    case "LOGOUT":
      return "bg-gray-100 text-gray-800";
    case "APPROVE":
      return "bg-green-100 text-green-800";
    case "REJECT":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getResourceIcon = (resource: string) => {
  switch (resource) {
    case "user":
      return <User className="h-4 w-4" />;
    case "property":
      return <Building2 className="h-4 w-4" />;
    case "admin":
      return <Shield className="h-4 w-4" />;
    case "settings":
      return <Settings className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export default function AdminActivityLogsPage() {
  const [logs] = useState<ActivityLog[]>(mockActivityLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const users = useMemo(() => {
    const uniqueUsers = Array.from(
      new Map(logs.map((log) => [log.user.id, log.user])).values()
    );
    return uniqueUsers.sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`
      )
    );
  }, [logs]);

  const resources = useMemo(() => {
    const uniqueResources = Array.from(
      new Set(logs.map((log) => log.resource))
    );
    return uniqueResources.sort();
  }, [logs]);

  const actionTypes = useMemo(() => {
    const uniqueActions = Array.from(
      new Set(logs.map((log) => log.actionType))
    );
    return uniqueActions.sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction =
        actionFilter === "all" || log.actionType === actionFilter;
      const matchesResource =
        resourceFilter === "all" || log.resource === resourceFilter;
      const matchesUser = userFilter === "all" || log.user.id === userFilter;

      const logDate = new Date(log.timestamp);
      const matchesDateRange =
        (!dateRange.from || logDate >= dateRange.from) &&
        (!dateRange.to || logDate <= dateRange.to);

      return (
        matchesSearch &&
        matchesAction &&
        matchesResource &&
        matchesUser &&
        matchesDateRange
      );
    });
  }, [logs, searchTerm, actionFilter, resourceFilter, userFilter, dateRange]);

  const activityStats = useMemo(() => {
    const stats = {
      total: logs.length,
      create: 0,
      update: 0,
      delete: 0,
      view: 0,
      auth: 0,
    };

    logs.forEach((log) => {
      switch (log.actionType) {
        case "CREATE":
          stats.create++;
          break;
        case "UPDATE":
          stats.update++;
          break;
        case "DELETE":
          stats.delete++;
          break;
        case "VIEW":
          stats.view++;
          break;
        case "LOGIN":
        case "LOGOUT":
          stats.auth++;
          break;
      }
    });

    return stats;
  }, [logs]);

  const handleExportLogs = () => {
    console.log("Exporting activity logs...");
  };

  const handleRefreshLogs = () => {
    console.log("Refreshing activity logs...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">
            Track admin actions and system activities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefreshLogs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Activities
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Plus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activityStats.create}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updated</CardTitle>
            <Edit className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {activityStats.update}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deleted</CardTitle>
            <Trash2 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {activityStats.delete}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewed</CardTitle>
            <Eye className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {activityStats.view}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auth Events</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activityStats.auth}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionTypes.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                {resources.map((resource) => (
                  <SelectItem key={resource} value={resource}>
                    {resource}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} -{" "}
                        {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || {})}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs ({filteredLogs.length})</CardTitle>
              <CardDescription>
                Admin actions and system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                      selectedLog?.id === log.id && "bg-blue-50 border-blue-200"
                    )}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={log.user.profilePic} />
                        <AvatarFallback className="text-xs">
                          {log.user.firstName[0]}
                          {log.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {getActionIcon(log.actionType)}
                          <Badge className={getActionColor(log.actionType)}>
                            {log.actionType}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            {getResourceIcon(log.resource)}
                            <span>{log.resource}</span>
                          </Badge>
                          {log.resourceId && (
                            <span className="text-xs text-gray-500 font-mono">
                              {log.resourceId}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {log.action}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>
                              {log.user.firstName} {log.user.lastName}
                            </span>
                            <span>•</span>
                            <span>{log.user.role}</span>
                            {log.ip && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{log.ip}</span>
                              </>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(new Date(log.timestamp), "MMM dd, HH:mm")}
                          </span>
                        </div>

                        {log.details && (
                          <p className="text-xs text-gray-600 mt-2 truncate">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No activity logs found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Activity Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLog ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Timestamp
                    </Label>
                    <p className="text-sm font-mono">
                      {format(
                        new Date(selectedLog.timestamp),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Action
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getActionIcon(selectedLog.actionType)}
                      <Badge className={getActionColor(selectedLog.actionType)}>
                        {selectedLog.actionType}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Resource
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getResourceIcon(selectedLog.resource)}
                      <Badge variant="outline">{selectedLog.resource}</Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Description
                    </Label>
                    <p className="text-sm mt-1">{selectedLog.action}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Performed By
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedLog.user.profilePic} />
                        <AvatarFallback className="text-xs">
                          {selectedLog.user.firstName[0]}
                          {selectedLog.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {selectedLog.user.firstName}{" "}
                          {selectedLog.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedLog.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedLog.resourceId && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Resource ID
                      </Label>
                      <p className="text-sm font-mono mt-1">
                        {selectedLog.resourceId}
                      </p>
                    </div>
                  )}

                  {selectedLog.details && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Details
                      </Label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 rounded text-gray-700">
                        {selectedLog.details}
                      </p>
                    </div>
                  )}

                  {selectedLog.ip && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        IP Address
                      </Label>
                      <p className="text-sm font-mono mt-1">{selectedLog.ip}</p>
                    </div>
                  )}

                  {selectedLog.userAgent && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        User Agent
                      </Label>
                      <p className="text-xs mt-1 p-2 bg-gray-50 rounded text-gray-600 break-all">
                        {selectedLog.userAgent}
                      </p>
                    </div>
                  )}

                  {selectedLog.changes &&
                    Object.keys(selectedLog.changes).length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Changes
                        </Label>
                        <div className="mt-1 space-y-2">
                          {Object.entries(selectedLog.changes).map(
                            ([field, change]) => (
                              <div
                                key={field}
                                className="p-2 bg-gray-50 rounded text-xs"
                              >
                                <div className="font-medium text-gray-700">
                                  {field}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-red-600">
                                    From: {JSON.stringify(change.from)}
                                  </span>
                                  <span className="text-gray-400">→</span>
                                  <span className="text-green-600">
                                    To: {JSON.stringify(change.to)}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select an activity to view details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("text-sm font-medium", className)} {...props}>
      {children}
    </label>
  );
}
