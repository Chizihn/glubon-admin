import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Eye, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/datatable";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

import { GET_ALL_TRANSACTIONS } from "@/graphql/queries/transactions";
import type { Transaction, TransactionFilters } from "@/types/transaction";

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>({});
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, loading } = useQuery(GET_ALL_TRANSACTIONS, {
    variables: {
      pagination: {
        page: currentPage,
        limit: 20,
      },
      filter: {
        ...filters,
        search: debouncedSearchTerm || undefined,
      },
    },
  });

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return "bg-blue-100 text-blue-800";
      case "REFUND":
        return "bg-purple-100 text-purple-800";
      case "COMMISSION":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "reference",
      label: "Reference",
      render: (reference: string, transaction: Transaction) => (
        <div>
          <p className="font-medium text-gray-900">{reference}</p>
          <p className="text-sm text-gray-500">
            {transaction.description || "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (_: string, transaction: Transaction) => (
        <div>
          <p className="font-medium text-gray-900">
            {transaction.user?.firstName && transaction.user?.lastName
              ? `${transaction.user.firstName} ${transaction.user.lastName}`
              : "Unknown User"}
          </p>
          <p className="text-sm text-gray-500">
            {transaction.user?.email || "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (amount: number, transaction: Transaction) => (
        <p className="font-medium text-gray-900">
          {formatCurrency(amount, transaction.currency || "NGN")}
        </p>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (type: string) => (
        <Badge className={getTypeColor(type)}>{type}</Badge>
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
      key: "property",
      label: "Property",
      render: (_: string, transaction: Transaction) => (
        <div>
          {transaction.property ? (
            <Link
              to={`/dashboard/listings/${transaction.property.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {transaction.property.title}
            </Link>
          ) : (
            <span className="text-gray-500 text-sm">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (date: string) => (
        <div>
          <p className="text-sm text-gray-900">
            {new Date(date).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(date).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: string, transaction: Transaction) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/transactions/${transaction.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const totalPages = data?.transactions?.hasMore
    ? Math.ceil((data?.transactions?.totalCount || 0) / 20)
    : currentPage;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Monitor all platform transactions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">
            Total Transactions
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {data?.transactions?.totalCount || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {data?.transactions?.transactions?.filter(
              (t: Transaction) => t.status === "COMPLETED"
            ).length || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {data?.transactions?.transactions?.filter(
              (t: Transaction) => t.status === "PENDING"
            ).length || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Failed</p>
          <p className="text-2xl font-bold text-red-600">
            {data?.transactions?.transactions?.filter(
              (t: Transaction) => t.status === "FAILED"
            ).length || 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select
          onValueChange={(value) =>
            setFilters({
              ...filters,
              status: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setFilters({
              ...filters,
              type: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="PAYMENT">Payment</SelectItem>
            <SelectItem value="REFUND">Refund</SelectItem>
            <SelectItem value="COMMISSION">Commission</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={data?.transactions?.transactions || []}
        columns={columns}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
