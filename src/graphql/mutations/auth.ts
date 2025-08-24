import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      accessToken
      refreshToken
      expiresAt
      user {
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
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
      timestamp
      errors
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token) {
      success
      message
      timestamp
      errors
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      expiresAt
    }
  }
`;
