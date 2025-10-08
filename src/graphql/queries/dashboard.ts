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
          properties {
            current
            lastMonth
            percentChange
          }
          users {
            current
            lastMonth
            percentChange
          }
        }
        totalRevenue
      }
      charts {
        userGrowth {
          date
          renters
          listers
          total
        }
        propertyGrowth {
          date
          active
          pending
          total
        }
        activity {
          date
          views
          likes
          messages
          conversations
        }
        geographic {
          state
          users
          properties
        }
      }
      performance {
        conversionRate
        likeRate
        userRetentionRate
        avgVerificationTime
        avgPropertyApprovalTime
        activeUsersLast7Days
        activeUsersLast30Days
        topPerformingProperties {
          id
          title
          views
          likes
          conversations
        }
      }
      recentActivity {
        date
        views
        likes
        messages
        conversations
      }
      recentTransactions {
        id
        amount
        status
        currency
        reference
        description
        type
        timestamp
        userId
        userName
        userAvatar
      }
    }
  }
`;
