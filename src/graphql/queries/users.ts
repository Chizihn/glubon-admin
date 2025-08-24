import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers($limit: Int!, $page: Int!, $filters: AdminUserFilters) {
    getAllUsers(limit: $limit, page: $page, filters: $filters) {
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

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($input: UpdateUserStatusInput!) {
    updateUserStatus(input: $input) {
      success
      message
      timestamp
      errors
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
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

export const GET_CURRENT_USER = gql`
  query Me {
    me {
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
