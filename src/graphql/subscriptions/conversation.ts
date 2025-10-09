import { gql } from "@apollo/client";

export const MESSAGE_SENT = gql`
  subscription MessageSent($conversationId: ID!) {
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
      attachments {
        id
        filename
        url
        size
        mimeType
      }
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
      attachments {
        id
        filename
        url
        size
        mimeType
      }
      createdAt
      updatedAt
    }
  }
`;

export const CONVERSATION_UPDATED = gql`
  subscription ConversationUpdated($userId: ID!) {
    conversationUpdated(userId: $userId) {
      id
      participants {
        id
        firstName
        lastName
        email
        profilePic
        role
      }
      lastMessage {
        id
        content
        messageType
        sender {
          id
          firstName
          lastName
        }
        createdAt
      }
      unreadCount
      updatedAt
    }
  }
`;
