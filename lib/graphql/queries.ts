import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      expiresAt
      user {
        id
        email
        firstName
        lastName
        role
        profilePic
        isVerified
        isActive
        status
      }
    }
  }
`;

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

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers($filters: AdminUserFilters, $page: Int, $limit: Int) {
    getAdminUsers(filters: $filters, page: $page, limit: $limit) {
      items {
        id
        email
        firstName
        lastName
        role
        status
        isVerified
        isActive
        createdAt
        stats {
          properties
          propertyLikes
          conversations
          propertyViews
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_ADMIN_PROPERTIES = gql`
  query GetAdminProperties(
    $filters: AdminPropertyFilters
    $page: Int
    $limit: Int
  ) {
    getAdminProperties(filters: $filters, page: $page, limit: $limit) {
      items {
        id
        title
        status
        amount
        address
        city
        state
        bedrooms
        bathrooms
        featured
        ownershipVerified
        createdAt
        owner {
          id
          firstName
          lastName
          email
          isVerified
        }
        stats {
          likes
          views
          conversations
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_PENDING_VERIFICATIONS = gql`
  query GetPendingVerifications($page: Int, $limit: Int) {
    getPendingVerifications(page: $page, limit: $limit) {
      items {
        id
        documentType
        documentNumber
        documentImages
        status
        createdAt
        user {
          id
          firstName
          lastName
          email
          role
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_ADMIN_ANALYTICS = gql`
  query GetAdminAnalytics($dateRange: AnalyticsDateRangeInput) {
    getAdminAnalytics(dateRange: $dateRange) {
      overview {
        totalUsers
        newUsers
        totalProperties
        newProperties
        pendingProperties
        activeProperties
        totalConversations
        totalMessages
        pendingVerifications
        approvedVerifications
      }
      charts {
        userGrowth {
          date
          count
        }
        propertyGrowth {
          date
          count
        }
      }
    }
  }
`;

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($input: UpdateUserStatusInput!) {
    updateUserStatus(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_PROPERTY_STATUS = gql`
  mutation UpdatePropertyStatus($input: UpdatePropertyStatusInput!) {
    updatePropertyStatus(input: $input) {
      success
      message
    }
  }
`;

export const REVIEW_VERIFICATION = gql`
  mutation ReviewVerification($input: ReviewVerificationInput!) {
    reviewVerification(input: $input) {
      success
      message
    }
  }
`;

export const TOGGLE_PROPERTY_FEATURED = gql`
  mutation TogglePropertyFeatured($propertyId: String!) {
    togglePropertyFeatured(propertyId: $propertyId) {
      success
      message
    }
  }
`;
