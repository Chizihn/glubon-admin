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
  const [dateRange] = useState({
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
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      console.error("Analytics query error:", error);
    },
  });

  const analytics = data?.getAdminAnalytics;

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Users"
                value={analytics?.overview?.users?.total || 0}
                icon={Users}
                trend={{
                  value: analytics?.overview?.growth?.users?.percentChange || 0,
                  isPositive:
                    (analytics?.overview?.growth?.users?.percentChange || 0) >
                    0,
                }}
              />
              <StatsCard
                title="Active Users"
                value={analytics?.overview?.users?.active || 0}
                icon={Users}
              />
              <StatsCard
                title="Verified Users"
                value={analytics?.overview?.users?.verified || 0}
                icon={Shield}
              />
              <StatsCard
                title="New This Month"
                value={analytics?.overview?.users?.newThisMonth || 0}
                icon={Users}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Growth Over Time</CardTitle>
                <CardDescription>User registration trends</CardDescription>
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
                      dataKey="renters"
                      stroke="#3b82f6"
                      name="Renters"
                    />
                    <Line
                      type="monotone"
                      dataKey="listers"
                      stroke="#10b981"
                      name="Listers"
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8b5cf6"
                      name="Total"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );
      case "listings":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Properties"
                value={analytics?.overview?.properties?.total || 0}
                icon={Building2}
                trend={{
                  value:
                    analytics?.overview?.growth?.properties?.percentChange || 0,
                  isPositive:
                    (analytics?.overview?.growth?.properties?.percentChange ||
                      0) > 0,
                }}
              />
              <StatsCard
                title="Active Properties"
                value={analytics?.overview?.properties?.active || 0}
                icon={Building2}
              />
              <StatsCard
                title="Featured Properties"
                value={analytics?.overview?.properties?.featured || 0}
                icon={Building2}
              />
              <StatsCard
                title="New This Month"
                value={analytics?.overview?.properties?.newThisMonth || 0}
                icon={Building2}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Property Growth Over Time</CardTitle>
                <CardDescription>Property listing trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.charts?.propertyGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="active" fill="#10b981" name="Active" />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );
      case "transactions":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Revenue"
                value={analytics?.overview?.totalRevenue || 0}
                icon={MessageSquare}
              />
              <StatsCard
                title="Recent Transactions"
                value={analytics?.recentTransactions?.length || 0}
                icon={MessageSquare}
              />
              <StatsCard
                title="Property Views Today"
                value={analytics?.overview?.activity?.propertyViewsToday || 0}
                icon={Building2}
              />
              <StatsCard
                title="Messages Today"
                value={analytics?.overview?.activity?.messagesToday || 0}
                icon={MessageSquare}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.recentTransactions
                    ?.slice(0, 5)
                    .map(
                      (transaction: {
                        id: string;
                        userName?: string;
                        description: string;
                        currency: string;
                        amount: number;
                        status: string;
                      }) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {transaction.userName?.[0] || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.userName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {transaction.currency} {transaction.amount}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.status}
                            </p>
                          </div>
                        </div>
                      )
                    ) || (
                    <p className="text-center text-gray-500 py-8">
                      No recent transactions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
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
                trend={{
                  value: analytics?.overview?.growth?.users?.percentChange || 0,
                  isPositive:
                    (analytics?.overview?.growth?.users?.percentChange || 0) >
                    0,
                }}
              />
              <StatsCard
                title="Total Properties"
                value={analytics?.overview?.properties?.total || 0}
                icon={Building2}
                trend={{
                  value:
                    analytics?.overview?.growth?.properties?.percentChange || 0,
                  isPositive:
                    (analytics?.overview?.growth?.properties?.percentChange ||
                      0) > 0,
                }}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>Daily activity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.charts?.activity || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3b82f6"
                        name="Views"
                      />
                      <Line
                        type="monotone"
                        dataKey="messages"
                        stroke="#10b981"
                        name="Messages"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>
                    Users and properties by location
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.charts?.geographic
                      ?.slice(0, 5)
                      .map(
                        (location: {
                          state: string;
                          users: number;
                          properties: number;
                        }) => (
                          <div
                            key={location.state}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium">
                              {location.state}
                            </span>
                            <div className="flex space-x-4 text-sm text-gray-500">
                              <span>{location.users} users</span>
                              <span>{location.properties} properties</span>
                            </div>
                          </div>
                        )
                      ) || (
                      <p className="text-center text-gray-500 py-8">
                        No geographic data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
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
    </div>
  );
}
