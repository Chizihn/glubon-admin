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
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  AlertCircle,
  XCircle,
  Calendar as CalendarIcon,
  Server,
  Database,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "../../../lib/utils";

interface SystemLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  service: string;
  message: string;
  details?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  duration?: number;
  statusCode?: number;
}

// Mock system logs data
const mockSystemLogs: SystemLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15T10:30:00Z",
    level: "ERROR",
    service: "auth-service",
    message: "Failed login attempt",
    details: "Invalid credentials provided for user john.doe@example.com",
    userId: "user123",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    requestId: "req_123456",
    statusCode: 401,
  },
  {
    id: "2",
    timestamp: "2024-01-15T10:25:00Z",
    level: "INFO",
    service: "property-service",
    message: "Property created successfully",
    details: "New property listing created with ID: prop_789",
    userId: "user456",
    ip: "192.168.1.101",
    requestId: "req_123457",
    duration: 250,
    statusCode: 201,
  },
  {
    id: "3",
    timestamp: "2024-01-15T10:20:00Z",
    level: "WARN",
    service: "payment-service",
    message: "Payment processing delayed",
    details: "Payment gateway response time exceeded 5 seconds",
    requestId: "req_123458",
    duration: 5200,
    statusCode: 200,
  },
  {
    id: "4",
    timestamp: "2024-01-15T10:15:00Z",
    level: "ERROR",
    service: "database",
    message: "Connection pool exhausted",
    details: "Maximum number of database connections reached (100/100)",
    requestId: "req_123459",
  },
  {
    id: "5",
    timestamp: "2024-01-15T10:10:00Z",
    level: "INFO",
    service: "notification-service",
    message: "Email sent successfully",
    details: "Welcome email sent to new user jane.smith@example.com",
    userId: "user789",
    requestId: "req_123460",
    duration: 150,
    statusCode: 200,
  },
  {
    id: "6",
    timestamp: "2024-01-15T10:05:00Z",
    level: "DEBUG",
    service: "search-service",
    message: "Search query executed",
    details: "Property search for location: 'New York' returned 45 results",
    requestId: "req_123461",
    duration: 89,
    statusCode: 200,
  },
  {
    id: "7",
    timestamp: "2024-01-15T10:00:00Z",
    level: "WARN",
    service: "file-service",
    message: "Large file upload detected",
    details: "File size 8.5MB exceeds recommended limit of 5MB",
    userId: "user321",
    ip: "192.168.1.102",
    requestId: "req_123462",
    statusCode: 200,
  },
  {
    id: "8",
    timestamp: "2024-01-15T09:55:00Z",
    level: "ERROR",
    service: "verification-service",
    message: "Document verification failed",
    details: "Unable to process document: invalid format or corrupted file",
    userId: "user654",
    requestId: "req_123463",
    statusCode: 400,
  },
];

const getLogLevelIcon = (level: string) => {
  switch (level) {
    case "ERROR":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "WARN":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "INFO":
      return <Info className="h-4 w-4 text-blue-500" />;
    case "DEBUG":
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const getLogLevelColor = (level: string) => {
  switch (level) {
    case "ERROR":
      return "bg-red-100 text-red-800";
    case "WARN":
      return "bg-yellow-100 text-yellow-800";
    case "INFO":
      return "bg-blue-100 text-blue-800";
    case "DEBUG":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getServiceIcon = (service: string) => {
  switch (service) {
    case "auth-service":
      return <Shield className="h-4 w-4" />;
    case "database":
      return <Database className="h-4 w-4" />;
    case "payment-service":
      return <Zap className="h-4 w-4" />;
    default:
      return <Server className="h-4 w-4" />;
  }
};

export default function SystemLogsPage() {
  const [logs] = useState<SystemLog[]>(mockSystemLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

  const services = useMemo(() => {
    const uniqueServices = Array.from(new Set(logs.map((log) => log.service)));
    return uniqueServices.sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.requestId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = levelFilter === "all" || log.level === levelFilter;
      const matchesService =
        serviceFilter === "all" || log.service === serviceFilter;

      const logDate = new Date(log.timestamp);
      const matchesDateRange =
        (!dateRange.from || logDate >= dateRange.from) &&
        (!dateRange.to || logDate <= dateRange.to);

      return (
        matchesSearch && matchesLevel && matchesService && matchesDateRange
      );
    });
  }, [logs, searchTerm, levelFilter, serviceFilter, dateRange]);

  const logStats = useMemo(() => {
    const stats = {
      total: logs.length,
      error: 0,
      warn: 0,
      info: 0,
      debug: 0,
    };

    logs.forEach((log) => {
      switch (log.level) {
        case "ERROR":
          stats.error++;
          break;
        case "WARN":
          stats.warn++;
          break;
        case "INFO":
          stats.info++;
          break;
        case "DEBUG":
          stats.debug++;
          break;
      }
    });

    return stats;
  }, [logs]);

  const handleExportLogs = () => {
    // Here you would implement log export functionality
    console.log("Exporting logs...");
  };

  const handleRefreshLogs = () => {
    // Here you would implement log refresh functionality
    console.log("Refreshing logs...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Monitor system events and troubleshoot issues
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {logStats.error}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {logStats.warn}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {logStats.info}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Debug</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {logStats.debug}
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
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Log Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="WARN">Warning</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="DEBUG">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
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

      {/* Logs Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>System Logs ({filteredLogs.length})</CardTitle>
              <CardDescription>
                Real-time system events and error logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                      selectedLog?.id === log.id && "bg-blue-50 border-blue-200"
                    )}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex items-center space-x-2 mt-0.5">
                          {getLogLevelIcon(log.level)}
                          {getServiceIcon(log.service)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={getLogLevelColor(log.level)}>
                              {log.level}
                            </Badge>
                            <Badge variant="outline">{log.service}</Badge>
                            {log.requestId && (
                              <span className="text-xs text-gray-500 font-mono">
                                {log.requestId}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {log.message}
                          </p>
                          {log.details && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {log.details}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 ml-4">
                        {format(new Date(log.timestamp), "HH:mm:ss")}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No logs found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Log Details</CardTitle>
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
                      Level
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getLogLevelIcon(selectedLog.level)}
                      <Badge className={getLogLevelColor(selectedLog.level)}>
                        {selectedLog.level}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Service
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getServiceIcon(selectedLog.service)}
                      <Badge variant="outline">{selectedLog.service}</Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Message
                    </Label>
                    <p className="text-sm mt-1">{selectedLog.message}</p>
                  </div>

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

                  {selectedLog.requestId && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Request ID
                      </Label>
                      <p className="text-sm font-mono mt-1">
                        {selectedLog.requestId}
                      </p>
                    </div>
                  )}

                  {selectedLog.userId && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        User ID
                      </Label>
                      <p className="text-sm font-mono mt-1">
                        {selectedLog.userId}
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

                  {selectedLog.statusCode && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Status Code
                      </Label>
                      <p className="text-sm font-mono mt-1">
                        {selectedLog.statusCode}
                      </p>
                    </div>
                  )}

                  {selectedLog.duration && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Duration
                      </Label>
                      <p className="text-sm font-mono mt-1">
                        {selectedLog.duration}ms
                      </p>
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
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select a log entry to view details
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
