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
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  TicketCategory,
  TicketPriority,
  TicketStatus,
  type Ticket,
} from "@/types/ticket";

// Mock data - replace with actual API calls
const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Unable to upload property images",
    description:
      "User is experiencing issues when trying to upload images for their property listing.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    category: TicketCategory.TECHNICAL,
    createdBy: {
      id: "user1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "USER",
    },
    assignedTo: {
      id: "admin1",
      firstName: "Admin",
      lastName: "User",
      email: "admin@glubon.com",
    },
    tags: ["upload", "images", "property"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Payment processing error",
    description: "Transaction failed during property listing payment.",
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.URGENT,
    category: TicketCategory.BILLING,
    createdBy: {
      id: "user2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      role: "USER",
    },
    assignedTo: {
      id: "admin2",
      firstName: "Support",
      lastName: "Admin",
      email: "support@glubon.com",
    },
    tags: ["payment", "billing", "urgent"],
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    title: "Account verification stuck",
    description:
      "User submitted documents for verification but status hasn't updated in 3 days.",
    status: TicketStatus.PENDING,
    priority: TicketPriority.MEDIUM,
    category: TicketCategory.VERIFICATION,
    createdBy: {
      id: "user3",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@example.com",
      role: "USER",
    },
    tags: ["verification", "documents"],
    createdAt: "2024-01-13T11:45:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
  },
  {
    id: "4",
    title: "Feature request: Dark mode",
    description:
      "Multiple users have requested a dark mode option for the dashboard.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.LOW,
    category: TicketCategory.FEATURE_REQUEST,
    createdBy: {
      id: "user4",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@example.com",
      role: "USER",
    },
    tags: ["feature", "ui", "dark-mode"],
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
  {
    id: "5",
    title: "Bug: Search filters not working",
    description:
      "Property search filters are not applying correctly on the main search page.",
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.HIGH,
    category: TicketCategory.BUG_REPORT,
    createdBy: {
      id: "user5",
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@example.com",
      role: "USER",
    },
    assignedTo: {
      id: "admin3",
      firstName: "Tech",
      lastName: "Lead",
      email: "tech@glubon.com",
    },
    tags: ["bug", "search", "filters"],
    resolvedAt: "2024-01-14T18:00:00Z",
    createdAt: "2024-01-11T13:20:00Z",
    updatedAt: "2024-01-14T18:00:00Z",
  },
];
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
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.createdBy.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        ticket.createdBy.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "all" || ticket.category === categoryFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const ticketStats = useMemo(() => {
    const stats = {
      total: tickets.length,
      open: 0,
      inProgress: 0,
      pending: 0,
      resolved: 0,
      closed: 0,
    };

    tickets.forEach((ticket) => {
      switch (ticket.status) {
        case TicketStatus.OPEN:
          stats.open++;
          break;
        case TicketStatus.IN_PROGRESS:
          stats.inProgress++;
          break;
        case TicketStatus.PENDING:
          stats.pending++;
          break;
        case TicketStatus.RESOLVED:
          stats.resolved++;
          break;
        case TicketStatus.CLOSED:
          stats.closed++;
          break;
      }
    });

    return stats;
  }, [tickets]);

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
            <div className="text-2xl font-bold">{ticketStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.closed}</div>
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
          <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
          <CardDescription>
            Manage customer support tickets and requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(ticket.status)}
                    <span className="font-medium">#{ticket.id}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {ticket.title}
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

            {filteredTickets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No tickets found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
