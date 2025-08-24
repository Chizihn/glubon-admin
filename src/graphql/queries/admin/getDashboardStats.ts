import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  query GetAdminDashboardStats {
    getAdminDashboardStats {
      totalUsers
      activeUsers
      totalProperties
      activeProperties
      pendingVerifications
      totalRevenue
      monthlyGrowth {
        users
        properties
      }
    }
  }
`;

export const GET_ADMIN_ANALYTICS = gql`
  query GetAdminAnalytics($dateRange: AnalyticsDateRangeInput) {
    getAdminAnalytics(dateRange: $dateRange) {
      userGrowth {
        date
        count
      }
      propertyGrowth {
        date
        count
      }
      revenue {
        date
        amount
      }
      activity {
        date
        count
        type
      }
      geographicData {
        location
        count
      }
    }
  }
`;
