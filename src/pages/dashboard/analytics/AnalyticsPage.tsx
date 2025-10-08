import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { GET_ADMIN_DASHBOARD_ANALYTICS } from "../../../graphql/queries/dashboard";

interface AnalyticsPageProps {
  defaultTab?: "overview" | "users" | "listings" | "transactions";
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      {trend && (
        <p
          className={`text-xs ${
            trend.isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend.isPositive ? "+" : ""}
          {trend.value}% from last month
        </p>
      )}
    </CardContent>
  </Card>
);

export default function AnalyticsPage({
  defaultTab = "overview",
}: AnalyticsPageProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "listings" | "transactions"
  >(defaultTab);
  const [dateRange, setDateRange] = useState({
    period: "month",
  });

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const { data, loading, error } = useQuery(GET_ADMIN_DASHBOARD_ANALYTICS, {
    variables: {
      dateRange,
    },
    errorPolicy: "all",
    onError: (error) => {
      console.error("Analytics query error:", error);
    },
  });

  const analytics = data?.getAdminAnalytics;

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">User Analytics</h2>
            <p>User analytics content will be displayed here.</p>
          </div>
        );
      case "listings":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Listings Analytics</h2>
            <p>Listings analytics content will be displayed here.</p>
          </div>
        );
      case "transactions":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Transactions Analytics</h2>
            <p>Transactions analytics content will be displayed here.</p>
          </div>
        );
      case "overview":
      default:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Users"
                value={analytics?.overview?.users?.total || 0}
                icon={Users}
              />
              <StatsCard
                title="Total Properties"
                value={analytics?.overview?.properties?.total || 0}
                icon={Building2}
              />
              <StatsCard
                title="Active Conversations"
                value={analytics?.overview?.activity?.totalConversations || 0}
                icon={MessageSquare}
              />
              <StatsCard
                title="Pending Verifications"
                value={
                  (analytics?.overview?.verifications?.pendingIdentity || 0) +
                  (analytics?.overview?.verifications?.pendingOwnership || 0)
                }
                icon={Shield}
              />
            </div>
          </div>
        );
    }
  };

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

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Platform insights and metrics</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading analytics</h3>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {["overview", "users", "listings", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(
                  tab as "overview" | "users" | "listings" | "transactions"
                )
              }
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6">{renderTabContent()}</div>

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
            value={analytics.overview.users.total}
            icon={Users}
            trend={{
              value: Math.round(
                (analytics.overview.users.newThisMonth /
                  analytics.overview.users.total) *
                  100
              ),
              isPositive: true,
            }}
          />
          <StatsCard
            title="Total Properties"
            value={analytics.overview.properties.total}
            icon={Building2}
            trend={{
              value: Math.round(
                (analytics.overview.properties.newThisMonth /
                  analytics.overview.properties.total) *
                  100
              ),
              isPositive: true,
            }}
          />
          <StatsCard
            title="Total Conversations"
            value={analytics.overview.activity.totalConversations}
            icon={MessageSquare}
          />
          <StatsCard
            title="Pending Verifications"
            value={
              (analytics.overview.verifications.pendingIdentity || 0) +
              (analytics.overview.verifications.pendingOwnership || 0)
            }
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
                  dataKey="total"
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
                <Bar dataKey="total" fill="#10b981" />
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
                  {analytics?.performance?.propertyStatus?.active || 0}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {analytics?.performance?.propertyStatus?.pending || 0}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {analytics?.performance?.propertyStatus?.inactive || 0}
                </p>
                <p className="text-sm text-gray-600">Inactive</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {analytics?.overview?.properties?.total || 0}
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
                  {analytics?.performance?.verificationStatus?.pending || 0}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {analytics?.performance?.verificationStatus?.verified || 0}
                </p>
                <p className="text-sm text-gray-600">Verified</p>
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
                {analytics?.overview?.conversations?.total || 0}
              </p>
              <p className="text-sm text-gray-600">Total Conversations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {analytics?.performance?.activityMetrics?.totalMessages || 0}
              </p>
              <p className="text-sm text-gray-600">Total Messages</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {analytics?.overview?.users?.new || 0}
              </p>
              <p className="text-sm text-gray-600">New Users This Period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
