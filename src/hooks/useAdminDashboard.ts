import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS, GET_ADMIN_ANALYTICS } from '../graphql/queries/admin/getDashboardStats';
import { AnalyticsDateRangeInput } from '../__generated__/graphql';

export const useAdminDashboard = (dateRange?: AnalyticsDateRangeInput) => {
  const statsQuery = useQuery(GET_DASHBOARD_STATS);
  const analyticsQuery = useQuery(GET_ADMIN_ANALYTICS, {
    variables: { dateRange },
    skip: !dateRange,
  });

  return {
    stats: statsQuery.data?.getAdminDashboardStats,
    analytics: analyticsQuery.data?.getAdminAnalytics,
    loading: statsQuery.loading || analyticsQuery.loading,
    error: statsQuery.error || analyticsQuery.error,
    refetch: () => {
      statsQuery.refetch();
      if (dateRange) {
        analyticsQuery.refetch({ dateRange });
      }
    },
  };
};
