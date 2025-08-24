import { gql } from "@apollo/client";

export const GET_ADMIN_DASHBOARD_STATS = gql`
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

export const GET_ADMIN_DASHBOARD_ANALYTICS = gql`
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
      activity {
        date
        count
        type
      }
      geographicData {
        location
        count
      }
      overview {
        users {
          total
          active
          verified
          suspended
          newToday
          newThisWeek
          newThisMonth
        }
        properties {
          total
          active
          featured
          pending
          newToday
          newThisWeek
          newThisMonth
        }
        verifications {
          pendingIdentity
          pendingOwnership
          approvedToday
          rejectedToday
        }
        activity {
          totalConversations
          activeConversationsToday
          totalMessages
          messagesToday
          totalPropertyViews
          propertyViewsToday
          totalPropertyLikes
          propertyLikesToday
        }
        admin {
          totalAdmins
          activeAdmins
          actionsToday
        }
        growth {
          users {
            current
            lastMonth
            percentChange
          }
          properties {
            current
            lastMonth
            percentChange
          }
        }
        totalRevenue
      }
      performance {
        topPerformingProperties {
          id
          title
          views
          likes
          conversations
        }
      }
    }
  }
`;
