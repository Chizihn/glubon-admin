import { gql } from "@apollo/client";

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers($limit: Int!, $page: Int!, $filters: AdminListFilters) {
    getAdminUsers(limit: $limit, page: $page, filters: $filters) {
      items {
        id
        firstName
        lastName
        email
        provider
        isActive
        phoneNumber
        profilePic
        isVerified
        role
        status
        address
        city
        state
        country
        createdAt
        updatedAt
        lastLogin
      }
      pagination {
        page
        limit
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_ADMIN_BY_ID = gql`
  query GetAdminUserById($userId: String!) {
    getAdminUserById(userId: $userId) {
      id
      firstName
      lastName
      email
      provider
      isActive
      phoneNumber
      profilePic
      isVerified
      role
      status
      address
      city
      state
      country
      createdAt
      updatedAt
      lastLogin
    }
  }
`;
