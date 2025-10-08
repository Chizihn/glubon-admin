import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query GetConversations($filters: ConversationFiltersInput) {
    conversations(filters: $filters) {
      id
      propertyId
      isActive
      unreadCount
      lastMessage {
        id
        content
        messageType
        isRead
        createdAt
        sender {
          id
          firstName
          lastName
          email
        }
      }
      participants {
        user {
          id
          firstName
          lastName
          email
          avatar
        }
      }
      property {
        id
        title
        images
      }
    }
  }
`;

export const GET_CONVERSATION = gql`
  query GetConversation($id: ID!) {
    conversation(id: $id) {
      id
      propertyId
      isActive
      unreadCount
      messages {
        id
        content
        messageType
        isRead
        attachments
        createdAt
        sender {
          id
          firstName
          lastName
          email
          avatar
        }
      }
      participants {
        user {
          id
          firstName
          lastName
          email
          avatar
        }
      }
      property {
        id
        title
        images
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      messageType
      isRead
      createdAt
      sender {
        id
        firstName
        lastName
      }
    }
  }
`;

export const BROADCAST_MESSAGE = gql`
  mutation BroadcastMessage($input: BroadcastMessageInput!) {
    broadcastMessage(input: $input) {
      id
      content
      messageType
      isRead
      createdAt
      recipients
    }
  }
`;

export const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription MessageSent($conversationId: ID) {
    messageSent(conversationId: $conversationId) {
      id
      content
      messageType
      isRead
      createdAt
      sender {
        id
        firstName
        lastName
        email
        avatar
      }
      conversationId
    }
  }
`;

export const CONVERSATION_UPDATED_SUBSCRIPTION = gql`
  subscription ConversationUpdated {
    conversationUpdated {
      id
      lastMessage {
        id
        content
        messageType
        isRead
        createdAt
        sender {
          id
          firstName
          lastName
        }
      }
      unreadCount
      updatedAt
    }
  }
`;
