import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  TrendingUp,
  Eye,
  MousePointer,
  Target,
  DollarSign,
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
} from "recharts";

import { GET_AD_ANALYTICS } from "@/graphql/queries/ads";

export default function AdAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const { data, loading, refetch } = useQuery(GET_AD_ANALYTICS, {
    variables: {
      dateRange: {
        period: dateRange,
      },
    },
  });

  const analytics = data?.getAdAnalytics;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ad Analytics</h1>
          <p className="text-gray-600">
            Monitor advertising performance and metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Impressions
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.overview?.totalImpressions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.overview?.totalClicks?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.overview?.totalConversions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics?.overview?.totalSpent || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatPercentage(analytics?.overview?.averageCTR || 0)}
            </div>
            <p className="text-sm text-gray-600 mt-2">Click-through rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average CPC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(analytics?.overview?.averageCPC || 0)}
            </div>
            <p className="text-sm text-gray-600 mt-2">Cost per click</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average CPM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(analytics?.overview?.averageCPM || 0)}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Cost per thousand impressions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>
              Impressions, clicks, and conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.charts?.impressionsOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="#3b82f6"
                  name="Impressions"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#10b981"
                  name="Clicks"
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#f59e0b"
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Ad Type</CardTitle>
            <CardDescription>
              Comparison across different ad types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.charts?.performanceByType || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="impressions" fill="#3b82f6" name="Impressions" />
                <Bar dataKey="clicks" fill="#10b981" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Ads */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Ads</CardTitle>
          <CardDescription>Ads with highest engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.charts?.topPerformingAds?.map(
              (ad: any, index: number) => (
                <div
                  key={ad.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ad.title}</p>
                      <p className="text-sm text-gray-500">
                        CTR: {formatPercentage(ad.ctr)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {ad.impressions?.toLocaleString()} impressions
                    </p>
                    <p className="text-sm text-gray-500">
                      {ad.clicks?.toLocaleString()} clicks
                    </p>
                  </div>
                </div>
              )
            ) || (
              <p className="text-center text-gray-500 py-8">
                No performance data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
