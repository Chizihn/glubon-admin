"use client";

import { useQuery } from "@apollo/client";
import {
  Users,
  Building2,
  Shield,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GET_ADMIN_DASHBOARD_STATS,
  GET_ADMIN_ANALYTICS,
} from "@/lib/graphql/queries";
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
import { StatsCard } from "@/components/ui/DataCard";

export default function DashboardPage() {
  const { data: statsData, loading: statsLoading } = useQuery(
    GET_ADMIN_DASHBOARD_STATS
  );
  const { data: analyticsData, loading: analyticsLoading } =
    useQuery(GET_ADMIN_ANALYTICS);

  const stats = statsData?.getAdminDashboardStats;
  const analytics = analyticsData?.getAdminAnalytics;

  if (statsLoading || analyticsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Glubon Admin Dashboard</p>
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
          {[...Array(2)].map((_, i) => (
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Glubon Admin Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend={{
            value: stats?.monthlyGrowth?.users || 0,
            isPositive: (stats?.monthlyGrowth?.users || 0) > 0,
          }}
        />
        <StatsCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon={Users}
        />
        <StatsCard
          title="Total Properties"
          value={stats?.totalProperties || 0}
          icon={Building2}
          trend={{
            value: stats?.monthlyGrowth?.properties || 0,
            isPositive: (stats?.monthlyGrowth?.properties || 0) > 0,
          }}
        />
        <StatsCard
          title="Active Properties"
          value={stats?.activeProperties || 0}
          icon={Building2}
        />
        <StatsCard
          title="Pending Verifications"
          value={stats?.pendingVerifications || 0}
          icon={Shield}
        />
        <StatsCard
          title="Total Revenue"
          value={`₦${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>

      {/* Overview Stats */}
      {analytics?.overview && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Key metrics and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.overview.newUsers}
                </p>
                <p className="text-sm text-gray-600">New Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {analytics.overview.newProperties}
                </p>
                <p className="text-sm text-gray-600">New Properties</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {analytics.overview.pendingProperties}
                </p>
                <p className="text-sm text-gray-600">Pending Properties</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.overview.totalConversations}
                </p>
                <p className="text-sm text-gray-600">Total Conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
