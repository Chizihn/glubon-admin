import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      messageType
      conversationId
      sender {
        id
        firstName
        lastName
        email
        profilePic
        role
      }
      isRead
      isBroadcast
      broadcastId
      attachments
      createdAt
      updatedAt
    }
  }
`;

export const MARK_AS_READ = gql`
  mutation MarkAsRead($conversationId: ID!) {
    markAsRead(conversationId: $conversationId) {
      success
      unreadCount
    }
  }
`;

export const SEND_BROADCAST_MESSAGE = gql`
  mutation SendBroadcastMessage($input: BroadcastMessageInput!) {
    sendBroadcastMessage(input: $input) {
      id
      content
      messageType
      sender {
        id
        firstName
        lastName
        email
        profilePic
        role
      }
      recipientRoles
      sentToUserIds
      totalRecipients
      attachments
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_BROADCAST_MESSAGE = gql`
  mutation DeleteBroadcastMessage($broadcastId: ID!) {
    deleteBroadcastMessage(broadcastId: $broadcastId)
  }
`;
