import { gql } from "@apollo/client";

export const BULK_UPDATE_USER_STATUS = gql`
  mutation BulkUpdateUserStatus(
    $userIds: [String!]!
    $status: UserStatus!
    $reason: String
  ) {
    bulkUpdateUserStatus(userIds: $userIds, status: $status, reason: $reason) {
      success
      message
      updatedCount
      failedCount
      errors
    }
  }
`;

export const BULK_UPDATE_PROPERTY_STATUS = gql`
  mutation BulkUpdatePropertyStatus(
    $propertyIds: [String!]!
    $status: PropertyStatus!
    $reason: String
  ) {
    bulkUpdatePropertyStatus(
      propertyIds: $propertyIds
      status: $status
      reason: $reason
    ) {
      success
      message
      updatedCount
      failedCount
      errors
    }
  }
`;

export const BULK_SEND_NOTIFICATION = gql`
  mutation BulkSendNotification(
    $userIds: [String!]!
    $title: String!
    $message: String!
    $type: NotificationType
  ) {
    bulkSendNotification(
      userIds: $userIds
      title: $title
      message: $message
      type: $type
    ) {
      success
      message
      sentCount
      failedCount
      errors
    }
  }
`;
