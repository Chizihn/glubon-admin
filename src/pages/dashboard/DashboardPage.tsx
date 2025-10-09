import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Shield,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  Eye,
  MessageCircle,
  Heart,
  type LucideIcon,
} from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  GET_ADMIN_DASHBOARD_ANALYTICS,
  GET_ADMIN_DASHBOARD_STATS,
} from "../../graphql/queries/dashboard";

// TypeScript Types
interface MonthlyGrowth {
  users?: number;
  properties?: number;
  revenue?: number;
}

interface RecentActivity {
  date: string;
  views: number;
  likes: number;
  messages: number;
  conversations: number;
}

interface RecentTransaction {
  id: string;
  amount: number;
  status: string;
  currency: string;
  reference: string;
  description: string;
  type: string;
  timestamp: string;
  userId: string;
  userName: string;
  userAvatar?: string;
}

interface PerformanceMetrics {
  conversionRate: number;
  likeRate: number;
  userRetentionRate: number;
  avgVerificationTime: number;
  avgPropertyApprovalTime: number;
  activeUsersLast7Days: number;
  activeUsersLast30Days: number;
  topPerformingProperties: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    conversations: number;
  }>;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProperties: number;
  activeProperties: number;
  pendingVerifications: number;
  totalRevenue: number;
  monthlyGrowth?: MonthlyGrowth;
}

interface UserGrowthData {
  date: string;
  count: number;
}

interface PropertyGrowthData {
  date: string;
  count: number;
}

interface ActivityData {
  date: string;
  count: number;
  type: string;
  views?: number;
  likes?: number;
  messages?: number;
  conversations?: number;
}

interface GeographicData {
  state: string;
  users: number;
  properties: number;
}

interface UserOverview {
  total: number;
  active: number;
  verified: number;
  suspended: number;
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
}

interface PropertyOverview {
  total: number;
  active: number;
  featured: number;
  pending: number;
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
}

interface VerificationOverview {
  pendingIdentity: number;
  pendingOwnership: number;
  approvedToday: number;
  rejectedToday: number;
}

interface ActivityOverview {
  totalConversations: number;
  activeConversationsToday: number;
  totalMessages: number;
  messagesToday: number;
  totalPropertyViews: number;
  propertyViewsToday: number;
  totalPropertyLikes: number;
  propertyLikesToday: number;
}

interface AdminOverview {
  totalAdmins: number;
  activeAdmins: number;
  actionsToday: number;
}

interface GrowthMetric {
  current: number;
  lastMonth: number;
  percentChange: number;
}

interface GrowthOverview {
  users: GrowthMetric;
  properties: GrowthMetric;
}

interface AnalyticsData {
  overview: {
    users: UserOverview;
    properties: PropertyOverview;
    verifications: VerificationOverview;
    activity: ActivityOverview;
    admin: AdminOverview;
    growth: GrowthOverview;
    totalRevenue: number;
  };
  charts: {
    userGrowth: UserGrowthData[];
    propertyGrowth: PropertyGrowthData[];
    activity: ActivityData[];
    geographic: GeographicData[];
  };
  performance: PerformanceMetrics;
  recentActivity: RecentActivity[];
  recentTransactions: RecentTransaction[];
}

interface DateRange {
  startDate?: string;
  endDate?: string;
  period?: string;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  error?: boolean;
  className?: string;
}

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

// Components
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  loading = false,
  error = false,
  className = "",
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">Failed to load</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {trend && (
          <div
            className={`flex items-center text-xs ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
  </div>
);

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
    <p className="text-sm text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);

// Helper function to calculate date ranges
const getDateRangeFromPeriod = (period: string): DateRange => {
  const now = new Date();
  const endDate = now.toISOString();
  let startDate: Date;

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { startDate: startDate.toISOString(), endDate, period: "day" };
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { startDate: startDate.toISOString(), endDate, period: "day" };
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return { startDate: startDate.toISOString(), endDate, period: "week" };
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      return { startDate: startDate.toISOString(), endDate, period: "month" };
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { startDate: startDate.toISOString(), endDate, period: "day" };
  }
};

// Custom hooks
const useDateRange = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("7d");

  const dateRange = useMemo(() => {
    return getDateRangeFromPeriod(selectedPeriod);
  }, [selectedPeriod]);

  const updatePeriod = useCallback((period: string) => {
    setSelectedPeriod(period);
  }, []);

  return { dateRange, selectedPeriod, updatePeriod };
};

// Main Dashboard Component
const DashboardPage: React.FC = () => {
  const { dateRange, selectedPeriod, updatePeriod } = useDateRange();

  // Query for dashboard stats
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<{ getAdminDashboardStats: DashboardStats }>(
    GET_ADMIN_DASHBOARD_STATS,
    {
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
    }
  );

  // Query for analytics data
  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery<{ getAdminAnalytics: AnalyticsData }>(
    GET_ADMIN_DASHBOARD_ANALYTICS,
    {
      variables: {
        dateRange: dateRange,
      },
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
    }
  );

  // Computed values
  const stats = useMemo(() => statsData?.getAdminDashboardStats, [statsData]);
  const analytics = useMemo(
    () => analyticsData?.getAdminAnalytics,
    [analyticsData]
  );

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Handlers
  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchStats(), refetchAnalytics()]);
  }, [refetchStats, refetchAnalytics]);

  const handleDateRangeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      updatePeriod(event.target.value);
    },
    [updatePeriod]
  );

  // Prepare chart data
  const userGrowthData = useMemo(() => {
    return (
      analytics?.charts?.userGrowth?.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })) || []
    );
  }, [analytics]);

  const propertyGrowthData = useMemo(() => {
    return (
      analytics?.charts?.propertyGrowth?.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })) || []
    );
  }, [analytics]);

  // Activity data from the API
  const activityData = useMemo(() => {
    return (
      analytics?.charts?.activity?.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })) || []
    );
  }, [analytics]);

  // Geographic data
  const geographicData = useMemo(() => {
    return (
      analytics?.charts?.geographic || [
        { state: "Lagos", users: 0, properties: 0 },
        { state: "Abuja", users: 0, properties: 0 },
        { state: "Port Harcourt", users: 0, properties: 0 },
      ]
    );
  }, [analytics]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (statsLoading && analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome to the Admin Dashboard</p>
            </div>
          </div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to Admin Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={handleDateRangeChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={statsLoading || analyticsLoading}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  statsLoading || analyticsLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Platform Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700">Total Users</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-xs text-blue-600">
                +{analytics?.overview?.users.newThisMonth || 0} this month
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-700">
                Active Properties
              </p>
              <p className="text-2xl font-bold text-green-900">
                {stats?.activeProperties || 0}
              </p>
              <p className="text-xs text-green-600">
                +{analytics?.overview?.properties.newThisMonth || 0} this month
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-700">
                Pending Verifications
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {stats?.pendingVerifications || 0}
              </p>
              <p className="text-xs text-purple-600">
                {analytics?.overview?.verifications.pendingIdentity || 0} ID,{" "}
                {analytics?.overview?.verifications.pendingOwnership || 0}{" "}
                Ownership
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm font-medium text-amber-700">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-amber-900">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
              <p className="text-xs text-amber-600">
                {stats?.monthlyGrowth?.revenue
                  ? `${stats.monthlyGrowth.revenue > 0 ? "+" : ""}${
                      stats.monthlyGrowth.revenue
                    }% from last month`
                  : "No change"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            trend={
              stats?.monthlyGrowth?.users
                ? {
                    value: stats.monthlyGrowth.users,
                    isPositive: stats.monthlyGrowth.users > 0,
                  }
                : undefined
            }
            loading={statsLoading}
            error={!!statsError}
          />
          <StatsCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            icon={Users}
            loading={statsLoading}
            error={!!statsError}
          />
          <StatsCard
            title="Total Properties"
            value={stats?.totalProperties || 0}
            icon={Building2}
            trend={
              stats?.monthlyGrowth?.properties
                ? {
                    value: stats.monthlyGrowth.properties,
                    isPositive: stats.monthlyGrowth.properties > 0,
                  }
                : undefined
            }
            loading={statsLoading}
            error={!!statsError}
          />
          <StatsCard
            title="Active Properties"
            value={stats?.activeProperties || 0}
            icon={Building2}
            loading={statsLoading}
            error={!!statsError}
          />
          <StatsCard
            title="Pending Verifications"
            value={stats?.pendingVerifications || 0}
            icon={Shield}
            loading={statsLoading}
            error={!!statsError}
          />
          <StatsCard
            title="Total Revenue"
            value={`₦${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            trend={
              stats?.monthlyGrowth?.revenue
                ? {
                    value: stats.monthlyGrowth.revenue,
                    isPositive: stats.monthlyGrowth.revenue > 0,
                  }
                : undefined
            }
            loading={statsLoading}
            error={!!statsError}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>User registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <LoadingSpinner />
              ) : analyticsError ? (
                <ErrorMessage
                  message="Failed to load user growth data"
                  onRetry={() => refetchAnalytics()}
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Property Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Property Growth</CardTitle>
              <CardDescription>Property listings over time</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <LoadingSpinner />
              ) : analyticsError ? (
                <ErrorMessage
                  message="Failed to load property growth data"
                  onRetry={() => refetchAnalytics()}
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={propertyGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#10b981"
                      radius={[2, 2, 0, 0]}
                      name="Properties"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
              <CardDescription>User engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <LoadingSpinner />
              ) : analyticsError ? (
                <ErrorMessage
                  message="Failed to load activity data"
                  onRetry={() => refetchAnalytics()}
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      name="Views"
                    />
                    <Line
                      type="monotone"
                      dataKey="likes"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      name="Likes"
                    />
                    <Line
                      type="monotone"
                      dataKey="messages"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      name="Messages"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Users by state</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <LoadingSpinner />
              ) : analyticsError ? (
                <ErrorMessage
                  message="Failed to load geographic data"
                  onRetry={() => refetchAnalytics()}
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={geographicData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ state, percent = 0 }) =>
                        `${state} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="users"
                      nameKey="state"
                    >
                      {geographicData.map(
                        (_entry: GeographicData, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Overview Stats */}
        {analytics?.overview && (
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>
                Detailed metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold text-blue-600">
                      {analytics.overview.users.newToday}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">New Users Today</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Building2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold text-green-600">
                      {analytics.overview.properties.newToday}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">New Properties Today</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-2xl font-bold text-yellow-600">
                      {analytics.overview.verifications.pendingIdentity +
                        analytics.overview.verifications.pendingOwnership}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Pending Verifications</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-2xl font-bold text-purple-600">
                      {analytics.overview.activity.activeConversationsToday}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Active Conversations</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-2xl font-bold text-indigo-600">
                      {analytics.overview.activity.propertyViewsToday}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Property Views Today</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-2xl font-bold text-red-600">
                      {analytics.overview.activity.propertyLikesToday}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Property Likes Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Performing Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>
              Properties with highest engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No property performance data available yet</p>
              <p className="text-sm mt-2">
                This section will show top performing properties based on
                engagement metrics
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Platform engagement metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsData?.getAdminAnalytics?.recentActivity &&
            analyticsData.getAdminAnalytics.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.getAdminAnalytics.recentActivity.map(
                  (activity: RecentActivity, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="col-span-1">
                        <p className="text-xs font-medium text-gray-500">
                          Date
                        </p>
                        <p className="text-sm">{activity.date}</p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-xs font-medium text-gray-500">
                          Views
                        </p>
                        <p className="text-sm font-medium">{activity.views}</p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-xs font-medium text-gray-500">
                          Likes
                        </p>
                        <p className="text-sm font-medium">{activity.likes}</p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-xs font-medium text-gray-500">
                          Messages
                        </p>
                        <p className="text-sm font-medium">
                          {activity.messages}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No recent activity data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest transactions on the platform
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/transactions">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsData?.getAdminAnalytics?.recentTransactions &&
            analyticsData.getAdminAnalytics.recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.getAdminAnalytics.recentTransactions
                  .slice(0, 5)
                  .map((tx: RecentTransaction) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {tx.userName || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tx.type} • {tx.reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            tx.status === "completed"
                              ? "text-green-600"
                              : tx.status === "pending"
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(tx.amount)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent transactions</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-gray-500">
                Conversion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.performance?.conversionRate?.toFixed(1) || "0.0"}%
              </p>
              <p className="text-xs text-gray-500">
                Property views to bookings
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-gray-500">Like Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.performance?.likeRate?.toFixed(1) || "0.0"}%
              </p>
              <p className="text-xs text-gray-500">Property views to likes</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-gray-500">
                User Retention (30d)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.performance?.userRetentionRate?.toFixed(1) || "0.0"}
                %
              </p>
              <p className="text-xs text-gray-500">
                Users returning after 30 days
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-gray-500">
                Active Users (7d)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.performance?.activeUsersLast7Days?.toLocaleString() ||
                  "0"}
              </p>
              <p className="text-xs text-gray-500">Active in the last 7 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
