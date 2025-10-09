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

export const UPDATE_ADMIN_PROFILE = gql`
  mutation UpdateAdminProfile($input: UpdateAdminProfileInput!) {
    updateAdminProfile(input: $input) {
      id
      firstName
      lastName
      email
      phoneNumber
      profilePic
      bio
      updatedAt
    }
  }
`;

export const CHANGE_ADMIN_PASSWORD = gql`
  mutation ChangeAdminPassword($input: ChangePasswordInput!) {
    changeAdminPassword(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_NOTIFICATION_PREFERENCES = gql`
  mutation UpdateNotificationPreferences($input: NotificationPreferencesInput!) {
    updateNotificationPreferences(input: $input) {
      id
      emailNotifications
      newUserRegistrations
      propertySubmissions
      verificationRequests
      systemAlerts
      updatedAt
    }
  }
`;

export const UPDATE_PLATFORM_SETTINGS = gql`
  mutation UpdatePlatformSettings($input: PlatformSettingsInput!) {
    updatePlatformSettings(input: $input) {
      id
      maintenanceMode
      userRegistration
      propertySubmissions
      autoApproveProperties
      maxFileSize
      supportEmail
      updatedAt
    }
  }
`;

export const TOGGLE_TWO_FACTOR_AUTH = gql`
  mutation ToggleTwoFactorAuth($enabled: Boolean!) {
    toggleTwoFactorAuth(enabled: $enabled) {
      success
      message
      qrCode
    }
  }
`;
