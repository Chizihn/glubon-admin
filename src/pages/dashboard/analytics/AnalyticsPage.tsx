"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Users, Building2, MessageSquare, Shield } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { StatsCard } from "../../../components/ui/datacard";
import { GET_ADMIN_ANALYTICS } from "../../../graphql/queries/admin/getDashboardStats";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    period: "month",
  });

  const { data, loading } = useQuery(GET_ADMIN_ANALYTICS, {
    variables: {
      dateRange,
    },
  });

  const analytics = data?.getAdminAnalytics;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Platform insights and metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Platform insights and metrics</p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={dateRange.period === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange({ period: "week" })}
          >
            Week
          </Button>
          <Button
            variant={dateRange.period === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange({ period: "month" })}
          >
            Month
          </Button>
          <Button
            variant={dateRange.period === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange({ period: "year" })}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {analytics?.overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={analytics.overview.totalUsers}
            icon={Users}
            trend={{
              value: Math.round(
                (analytics.overview.newUsers / analytics.overview.totalUsers) *
                  100
              ),
              isPositive: true,
            }}
          />
          <StatsCard
            title="Total Properties"
            value={analytics.overview.totalProperties}
            icon={Building2}
            trend={{
              value: Math.round(
                (analytics.overview.newProperties /
                  analytics.overview.totalProperties) *
                  100
              ),
              isPositive: true,
            }}
          />
          <StatsCard
            title="Total Conversations"
            value={analytics.overview.totalConversations}
            icon={MessageSquare}
          />
          <StatsCard
            title="Pending Verifications"
            value={analytics.overview.pendingVerifications}
            icon={Shield}
          />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.charts?.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Property Growth</CardTitle>
            <CardDescription>New property listings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.charts?.propertyGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Property Status</CardTitle>
            <CardDescription>Distribution of property statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {analytics?.overview?.activeProperties || 0}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {analytics?.overview?.pendingProperties || 0}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {analytics?.overview?.newProperties || 0}
                </p>
                <p className="text-sm text-gray-600">New This Period</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {analytics?.overview?.totalProperties || 0}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Identity verification statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {analytics?.overview?.pendingVerifications || 0}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {analytics?.overview?.approvedVerifications || 0}
                </p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Activity</CardTitle>
          <CardDescription>
            Communication and engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {analytics?.overview?.totalConversations || 0}
              </p>
              <p className="text-sm text-gray-600">Total Conversations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {analytics?.overview?.totalMessages || 0}
              </p>
              <p className="text-sm text-gray-600">Total Messages</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {analytics?.overview?.newUsers || 0}
              </p>
              <p className="text-sm text-gray-600">New Users This Period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
