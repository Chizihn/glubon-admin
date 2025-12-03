import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Plus,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import {
  TicketCategory,
  TicketPriority,
  TicketStatus,
  type Ticket,
} from "@/types/ticket";
import { useQuery } from "@apollo/client";
import { GET_TICKETS, GET_TICKET_STATS } from "@/graphql/queries/tickets";
import { useDebounce } from "@/hooks/useDebounce";
import { ErrorState } from "@/components/ui/ErrorState";

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.OPEN:
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case TicketStatus.IN_PROGRESS:
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case TicketStatus.PENDING:
      return <Clock className="h-4 w-4 text-orange-500" />;
    case TicketStatus.RESOLVED:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case TicketStatus.CLOSED:
      return <XCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.OPEN:
      return "bg-blue-100 text-blue-800";
    case TicketStatus.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800";
    case TicketStatus.PENDING:
      return "bg-orange-100 text-orange-800";
    case TicketStatus.RESOLVED:
      return "bg-green-100 text-green-800";
    case TicketStatus.CLOSED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: TicketPriority) => {
  switch (priority) {
    case TicketPriority.LOW:
      return "bg-gray-100 text-gray-800";
    case TicketPriority.MEDIUM:
      return "bg-blue-100 text-blue-800";
    case TicketPriority.HIGH:
      return "bg-orange-100 text-orange-800";
    case TicketPriority.URGENT:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filters = useMemo(() => {
    return {
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(statusFilter !== "all" && { status: [statusFilter as TicketStatus] }),
      ...(priorityFilter !== "all" && {
        priority: [priorityFilter as TicketPriority],
      }),
      ...(categoryFilter !== "all" && {
        category: [categoryFilter as TicketCategory],
      }),
      pagination: {
        page,
        limit,
      },
    };
  }, [debouncedSearchTerm, statusFilter, priorityFilter, categoryFilter, page]);

  const {
    data: ticketsData,
    loading: ticketsLoading,
    error: ticketsError,
    refetch: refetchTickets,
  } = useQuery(GET_TICKETS, {
    variables: { filter: filters },
    fetchPolicy: "cache-and-network",
  });

  const { data: statsData, loading: statsLoading } = useQuery(GET_TICKET_STATS, {
    fetchPolicy: "cache-and-network",
  });

  const tickets = (ticketsData?.getTickets?.data || []) as Ticket[];
  const pagination = ticketsData?.getTickets?.pagination;
  const stats = statsData?.getTicketStats || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    reopened: 0,
  };

  if (ticketsError) {
    return (
      <ErrorState
        title="Failed to load tickets"
        message={ticketsError.message}
        onRetry={refetchTickets}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage and track customer support requests
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.total}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.open}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.inProgress}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reopened</CardTitle>
            <RotateCcw className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.reopened}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.resolved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.closed}
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
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={TicketStatus.OPEN}>Open</SelectItem>
                <SelectItem value={TicketStatus.IN_PROGRESS}>
                  In Progress
                </SelectItem>
                <SelectItem value={TicketStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={TicketStatus.RESOLVED}>Resolved</SelectItem>
                <SelectItem value={TicketStatus.CLOSED}>Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value={TicketPriority.LOW}>Low</SelectItem>
                <SelectItem value={TicketPriority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={TicketPriority.HIGH}>High</SelectItem>
                <SelectItem value={TicketPriority.URGENT}>Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={TicketCategory.TECHNICAL}>
                  Technical
                </SelectItem>
                <SelectItem value={TicketCategory.BILLING}>Billing</SelectItem>
                <SelectItem value={TicketCategory.ACCOUNT}>Account</SelectItem>
                <SelectItem value={TicketCategory.PROPERTY}>
                  Property
                </SelectItem>
                <SelectItem value={TicketCategory.VERIFICATION}>
                  Verification
                </SelectItem>
                <SelectItem value={TicketCategory.GENERAL}>General</SelectItem>
                <SelectItem value={TicketCategory.BUG_REPORT}>
                  Bug Report
                </SelectItem>
                <SelectItem value={TicketCategory.FEATURE_REQUEST}>
                  Feature Request
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({pagination?.totalItems || 0})</CardTitle>
          <CardDescription>
            Manage customer support tickets and requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticketsLoading ? (
               <div className="flex justify-center py-8">
                 <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
               </div>
            ) : (
              <>
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(ticket.status)}
                        <span className="font-medium">#{ticket.id.substring(0, 8)}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {ticket.subject}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {ticket.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace("_", " ")}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline">
                            {ticket.category.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={ticket.createdBy.profilePic} />
                            <AvatarFallback className="text-xs">
                              {ticket.createdBy.firstName[0]}
                              {ticket.createdBy.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">
                            {ticket.createdBy.firstName} {ticket.createdBy.lastName}
                          </span>
                        </div>

                        <div className="text-sm text-gray-500">
                          {format(new Date(ticket.createdAt), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/tickets/${ticket.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                {tickets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No tickets found matching your criteria.
                    </p>
                  </div>
                )}
                
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center text-sm text-gray-600">
                      Page {page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
