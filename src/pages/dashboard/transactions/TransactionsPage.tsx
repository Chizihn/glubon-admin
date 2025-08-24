/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
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
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Download,
} from "lucide-react";
import { DataTable } from "../../../components/ui/datatable";
import { useNavigate } from "react-router-dom";
import { GET_ALL_TRANSACTIONS } from "../../../graphql/queries/transaction";
import type { TransactionStatus, TransactionType } from "../../../types/enums";

export interface TransactionFilterInput {
  startDate: Date | null;
  endDate: Date | null;
  maxAmount: number | null;
  minAmount: number | null;
  statuses: TransactionStatus[] | null;
  types: TransactionType[] | null;
  paymentMethod: string | null;
}

interface Transaction {
  id: string;
  reference: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TransactionFilterInput>({
    statuses: null,
    types: null,
    minAmount: null,
    maxAmount: null,
    startDate: null,
    endDate: null,
    paymentMethod: null,
  });

  const { data, loading, refetch } = useQuery(GET_ALL_TRANSACTIONS, {
    variables: {
      pagination: { page: currentPage, limit: 10 },
      sort: { field: "createdAt", order: "DESC" },
      filter: filters,
    },
  });

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case "PREMIUM_LISTING":
      case "FEATURED_LISTING":
        return "bg-purple-100 text-purple-800";
      case "BASIC_LISTING":
        return "bg-blue-100 text-blue-800";
      case "AD_PLACEMENT":
        return "bg-orange-100 text-orange-800";
      case "API_ACCESS":
      case "SUBSCRIPTION":
        return "bg-green-100 text-green-800";
      case "DEPOSIT":
      case "WITHDRAWAL":
      case "ESCROW_RELEASE":
      case "ESCROW_HOLD":
      case "ESCROW_REFUND":
      case "REFUND":
        return "bg-red-100 text-red-800";
      case "RENT_PAYMENT":
      case "PLATFORM_FEE":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "reference",
      label: "Reference",
      render: (reference: string) => (
        <span className="font-mono text-sm">{reference}</span>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (_: any, transaction: Transaction) => (
        <div>
          <p className="font-medium text-gray-900">{`${transaction.user.firstName} ${transaction.user.lastName}`}</p>
          <p className="text-sm text-gray-500">{transaction.user.email}</p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (type: TransactionType) => (
        <Badge className={getTypeColor(type)}>{type.replace("_", " ")}</Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (amount: number, transaction: Transaction) => (
        <span className="font-semibold">
          {transaction.currency} {amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: TransactionStatus) => (
        <Badge className={getStatusColor(status)}>{status}</Badge>
      ),
    },
    {
      key: "paymentMethod",
      label: "Method",
      render: (method: string) => method.replace("_", " "),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, transaction: Transaction) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/transactions/${transaction.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transactions Management
          </h1>
          <p className="text-gray-600">Monitor transaction flows and history</p>
        </div>
        <Button onClick={() => refetch()}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">
                  {data?.transactions?.totalCount || 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {data?.transactions?.transactions?.filter(
                    (t: Transaction) => t.status === "COMPLETED"
                  ).length || 0}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {data?.transactions?.transactions?.filter(
                    (t: Transaction) => t.status === "PENDING"
                  ).length || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold">
                  {data?.transactions?.transactions?.filter(
                    (t: Transaction) => t.status === "FAILED"
                  ).length || 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          onValueChange={(value: TransactionStatus) =>
            setFilters({ ...filters, statuses: value ? [value] : null })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: TransactionType) =>
            setFilters({ ...filters, types: value ? [value] : null })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PREMIUM_LISTING">Premium Listing</SelectItem>
            <SelectItem value="BASIC_LISTING">Basic Listing</SelectItem>
            <SelectItem value="FEATURED_LISTING">Featured Listing</SelectItem>
            <SelectItem value="AD_PLACEMENT">Ad Placement</SelectItem>
            <SelectItem value="API_ACCESS">API Access</SelectItem>
            <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
            <SelectItem value="DEPOSIT">Deposit</SelectItem>
            <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
            <SelectItem value="ESCROW_RELEASE">Escrow Release</SelectItem>
            <SelectItem value="ESCROW_HOLD">Escrow Hold</SelectItem>
            <SelectItem value="ESCROW_REFUND">Escrow Refund</SelectItem>
            <SelectItem value="REFUND">Refund</SelectItem>
            <SelectItem value="RENT_PAYMENT">Rent Payment</SelectItem>
            <SelectItem value="PLATFORM_FEE">Platform Fee</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: string) =>
            setFilters({ ...filters, paymentMethod: value || null })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CARD">Card</SelectItem>
            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
            <SelectItem value="WALLET">Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={data?.transactions?.transactions || []}
        columns={columns}
        searchable
        searchPlaceholder="Search transactions..."
        loading={loading}
        pagination={{
          currentPage,
          totalPages: data?.transactions?.hasMore
            ? currentPage + 1
            : currentPage,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
