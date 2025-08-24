import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client";
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
}

interface GeographicData {
  location: string;
  count: number;
}

interface TopPerformingProperty {
  id: string;
  title: string;
  views: number;
  likes: number;
  conversations: number;
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

interface Overview {
  users: UserOverview;
  properties: PropertyOverview;
  verifications: VerificationOverview;
  activity: ActivityOverview;
  admin: AdminOverview;
  growth: GrowthOverview;
  totalRevenue: number;
}

// Removed unused interfaces

interface AnalyticsData {
  userGrowth: UserGrowthData[];
  propertyGrowth: PropertyGrowthData[];
  activity: ActivityData[];
  geographicData: GeographicData[];
  overview: Overview;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
  period: string;
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

// Custom hooks
const useDateRange = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
    period: "",
  });

  const updateDateRange = useCallback((newRange: Partial<DateRange>) => {
    setDateRange((prev) => ({ ...prev, ...newRange }));
  }, []);

  return { dateRange, updateDateRange };
};

// Main Dashboard Component
const DashboardPage: React.FC = () => {
  const { dateRange, updateDateRange } = useDateRange();

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
      variables: { dateRange },
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

  // Handlers
  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchStats(), refetchAnalytics()]);
  }, [refetchStats, refetchAnalytics]);

  const handleDateRangeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      updateDateRange({ period: event.target.value });
    },
    [updateDateRange]
  );

  // Prepare chart data
  const userGrowthData = useMemo(() => {
    return (
      analytics?.userGrowth?.map((item: UserGrowthData) => ({
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
      analytics?.propertyGrowth?.map((item: PropertyGrowthData) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })) || []
    );
  }, [analytics]);

  const activityData = useMemo(() => {
    return (
      analytics?.activity?.map((item: ActivityData) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })) || []
    );
  }, [analytics]);

  const geographicData = useMemo(() => {
    return (
      analytics?.geographicData?.map((entry: GeographicData, index: number) => ({
        id: index,
        ...entry,
        value: entry.count,
        state: entry.location, // Map location to state for the chart
      })) || []
    );
  }, [analytics]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (statsLoading && analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
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
              value={dateRange.period}
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
                    {Array.from(
                      new Set(activityData.map((item) => item.type))
                    ).map((type, index) => (
                      <Line
                        key={type}
                        type="monotone"
                        dataKey="count"
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                        name={type}
                        data={activityData.filter((item) => item.type === type)}
                      />
                    ))}
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
                      label={(props) => {
                        const { percent, payload } = props;
                        const percentValue = percent ?? 0;
                        return `${payload.location} ${(percentValue * 100).toFixed(0)}%`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {geographicData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
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

        {/* Top Performing Properties - Placeholder for now */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>Properties with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No property performance data available yet</p>
              <p className="text-sm mt-2">This section will show top performing properties based on engagement metrics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
