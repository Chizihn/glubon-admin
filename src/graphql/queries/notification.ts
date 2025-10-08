import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int, $offset: Int, $isRead: Boolean) {
    notifications(limit: $limit, offset: $offset, isRead: $isRead) {
      id
      title
      message
      type
      isRead
      data
      createdAt
    }
  }
`;

