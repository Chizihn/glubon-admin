import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Tag,
} from "lucide-react";
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
import { Separator } from "../../../components/ui/separator";
import type {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketMessage,
} from "@/types/ticket";

// Mock ticket data
const mockTicket: Ticket = {
  id: "1",
  title: "Unable to upload property images",
  description:
    "User is experiencing issues when trying to upload images for their property listing. The upload process starts but fails after a few seconds with an error message.",
  status: "OPEN" as TicketStatus,
  priority: "HIGH" as TicketPriority,
  category: "TECHNICAL" as any,
  createdBy: {
    id: "user1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profilePic: "/placeholder.svg",
    role: "USER",
  },
  assignedTo: {
    id: "admin1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@glubon.com",
    profilePic: "/placeholder.svg",
  },
  tags: ["upload", "images", "property"],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  messages: [
    {
      id: "msg1",
      content:
        "I'm having trouble uploading images for my property listing. Every time I try to upload, it fails after a few seconds.",
      author: {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        role: "USER",
      },
      isInternal: false,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "msg2",
      content:
        "Thank you for reporting this issue. I'm looking into the image upload problem. Can you tell me what file format and size you're trying to upload?",
      author: {
        id: "admin1",
        firstName: "Admin",
        lastName: "User",
        email: "admin@glubon.com",
        role: "ADMIN",
      },
      isInternal: false,
      createdAt: "2024-01-15T11:15:00Z",
    },
    {
      id: "msg3",
      content:
        "Internal note: Checking server logs for upload errors around this time.",
      author: {
        id: "admin1",
        firstName: "Admin",
        lastName: "User",
        email: "admin@glubon.com",
        role: "ADMIN",
      },
      isInternal: true,
      createdAt: "2024-01-15T11:20:00Z",
    },
  ],
};

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case "OPEN":
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case "IN_PROGRESS":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "PENDING":
      return <Clock className="h-4 w-4 text-orange-500" />;
    case "RESOLVED":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "CLOSED":
      return <XCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-800";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800";
    case "PENDING":
      return "bg-orange-100 text-orange-800";
    case "RESOLVED":
      return "bg-green-100 text-green-800";
    case "CLOSED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: TicketPriority) => {
  switch (priority) {
    case "LOW":
      return "bg-gray-100 text-gray-800";
    case "MEDIUM":
      return "bg-blue-100 text-blue-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "URGENT":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket] = useState<Ticket>(mockTicket);
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [newStatus, setNewStatus] = useState(ticket.status);
  const [newPriority, setNewPriority] = useState(ticket.priority);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Here you would typically send the message to your API
    console.log("Sending message:", {
      content: newMessage,
      isInternal,
      ticketId: id,
    });

    setNewMessage("");
  };

  const handleUpdateTicket = () => {
    // Here you would typically update the ticket via API
    console.log("Updating ticket:", {
      id,
      status: newStatus,
      priority: newPriority,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/tickets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tickets
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Ticket #{ticket.id}
            </h1>
            <p className="text-muted-foreground">{ticket.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(ticket.status)}
          <Badge className={getStatusColor(ticket.status)}>
            {ticket.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                  <p className="text-gray-600 mt-1">{ticket.description}</p>
                </div>

                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <div className="flex flex-wrap gap-1">
                      {ticket.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                Messages and updates for this ticket
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticket.messages?.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={message.author.profilePic} />
                          <AvatarFallback className="text-xs">
                            {message.author.firstName[0]}
                            {message.author.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {message.author.firstName} {message.author.lastName}
                        </span>
                        <Badge
                          variant={
                            message.author.role === "ADMIN"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {message.author.role}
                        </Badge>
                        {message.isInternal && (
                          <Badge
                            variant="outline"
                            className="text-xs text-orange-600"
                          >
                            Internal
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(
                          new Date(message.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.isInternal
                          ? "bg-orange-50 border border-orange-200"
                          : message.author.role === "ADMIN"
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>

              {/* New Message Form */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="internal"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="internal" className="text-sm text-gray-600">
                    Internal note (not visible to customer)
                  </label>
                </div>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach File
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={newStatus}
                  onValueChange={(value: TicketStatus) => setNewStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newPriority}
                  onValueChange={(value: TicketPriority) =>
                    setNewPriority(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleUpdateTicket} className="w-full">
                Update Ticket
              </Button>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={ticket.createdBy.profilePic} />
                  <AvatarFallback>
                    {ticket.createdBy.firstName[0]}
                    {ticket.createdBy.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {ticket.createdBy.firstName} {ticket.createdBy.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {ticket.createdBy.email}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Role:</span>
                  <Badge variant="outline">{ticket.createdBy.role}</Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Created:</span>
                  <span>
                    {format(new Date(ticket.createdAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          {ticket.assignedTo && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={ticket.assignedTo.profilePic} />
                    <AvatarFallback>
                      {ticket.assignedTo.firstName[0]}
                      {ticket.assignedTo.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.assignedTo.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
