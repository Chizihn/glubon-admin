import { gql } from '@apollo/client';

export const GET_USER_SETTINGS = gql`
  query GetUserSettings {
    getUserSettings {
      id
      userId
      notificationPreferences
      theme
      language
      receivePromotions
      pushNotifications
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER_SETTINGS = gql`
  mutation UpdateUserSettings($input: UserSettingInput!) {
    updateUserSettings(input: $input) {
      id
      userId
      theme
      language
      receivePromotions
      pushNotifications
      notificationPreferences
      updatedAt
    }
  }
`;

export const GET_PLATFORM_SETTINGS = gql`
  query GetPlatformSettings($filters: PlatformSettingFilter, $page: Int, $limit: Int) {
    getPlatformSettings(filters: $filters, page: $page, limit: $limit) {
      items {
        id
        key
        value
        description
        updatedBy
        updater {
          id
          email
        }
        createdAt
        updatedAt
      }
      pagination {
        totalItems
        totalPages
        currentPage
        itemsPerPage
      }
    }
  }
`;

export const UPDATE_PLATFORM_SETTING = gql`
  mutation UpdatePlatformSetting($input: PlatformSettingInput!) {
    updatePlatformSetting(input: $input) {
      id
      key
      value
      description
      updatedBy
      updatedAt
    }
  }
`;
