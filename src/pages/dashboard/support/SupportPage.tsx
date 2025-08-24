/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { DataTable } from "../../../components/ui/datatable";
import { Link } from "react-router-dom";

export default function SupportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  // Mock data
  const mockTickets = [
    {
      id: "TICK-001",
      subject: "Unable to upload property images",
      user: { firstName: "John", lastName: "Doe", email: "john@example.com" },
      priority: "HIGH",
      status: "OPEN",
      category: "TECHNICAL",
      createdAt: "2024-01-15T10:30:00Z",
      lastReply: "2024-01-15T14:20:00Z",
      assignedTo: { firstName: "Jane", lastName: "Support" },
    },
    {
      id: "TICK-002",
      subject: "Payment not processed",
      user: {
        firstName: "Sarah",
        lastName: "Smith",
        email: "sarah@example.com",
      },
      priority: "URGENT",
      status: "IN_PROGRESS",
      category: "BILLING",
      createdAt: "2024-01-14T09:15:00Z",
      lastReply: "2024-01-15T11:45:00Z",
      assignedTo: { firstName: "Mike", lastName: "Finance" },
    },
    {
      id: "TICK-003",
      subject: "Account verification issues",
      user: {
        firstName: "David",
        lastName: "Wilson",
        email: "david@example.com",
      },
      priority: "MEDIUM",
      status: "RESOLVED",
      category: "ACCOUNT",
      createdAt: "2024-01-13T16:20:00Z",
      lastReply: "2024-01-14T10:30:00Z",
      assignedTo: { firstName: "Lisa", lastName: "Verification" },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "id",
      label: "Ticket ID",
      render: (id: string) => (
        <Link
          to={`/dashboard/support/${id}`}
          className="font-mono text-blue-600 hover:underline"
        >
          {id}
        </Link>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (subject: string, ticket: any) => (
        <div>
          <p className="font-medium text-gray-900">{subject}</p>
          <p className="text-sm text-gray-500">
            {ticket.user.firstName} {ticket.user.lastName}
          </p>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (priority: string) => (
        <Badge className={getPriorityColor(priority)}>{priority}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <Badge className={getStatusColor(status)}>
          {status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (category: string) => <Badge variant="outline">{category}</Badge>,
    },
    {
      key: "assignedTo",
      label: "Assigned To",
      render: (assignedTo: any) =>
        assignedTo
          ? `${assignedTo.firstName} ${assignedTo.lastName}`
          : "Unassigned",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const stats = [
    {
      title: "Open Tickets",
      value: mockTickets.filter((t) => t.status === "OPEN").length,
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      title: "In Progress",
      value: mockTickets.filter((t) => t.status === "IN_PROGRESS").length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Resolved Today",
      value: mockTickets.filter((t) => t.status === "RESOLVED").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Urgent",
      value: mockTickets.filter((t) => t.priority === "URGENT").length,
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600">
            Manage customer support requests and inquiries
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/support/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setFilters({ ...filters, priority: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="URGENT">Urgent</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TECHNICAL">Technical</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
            <SelectItem value="ACCOUNT">Account</SelectItem>
            <SelectItem value="GENERAL">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={mockTickets}
        columns={columns}
        searchable
        searchPlaceholder="Search tickets..."
        loading={false}
        pagination={{
          currentPage,
          totalPages: 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
