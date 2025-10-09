import { gql } from '@apollo/client';

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      success
      message
      notification {
        id
        isRead
      }
    }
  }
`;
