import { gql } from '@apollo/client';

export const MESSAGE_SENT = gql`
  subscription MessageSent($conversationId: ID) {
    messageSent(conversationId: $conversationId) {
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

export const BROADCAST_MESSAGE_SENT = gql`
  subscription BroadcastMessageSent {
    broadcastMessageSent {
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
