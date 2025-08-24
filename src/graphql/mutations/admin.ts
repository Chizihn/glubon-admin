import { gql } from "@apollo/client";

export const CREATE_ADMIN_USER = gql`
  mutation CreateAdminUser($input: CreateAdminUserInput!) {
    createAdminUser(input: $input) {
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

export const UPDATE_ADMIN_USER = gql`
  mutation UpdateAdminUser($input: UpdateAdminUserInput!, $adminId: String!) {
    updateAdminUser(input: $input, adminId: $adminId) {
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
