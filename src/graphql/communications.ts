import { gql } from "@apollo/client";
export const GET_CONVERSATIONS = gql`
  query GetConversations(
    $filters: ConversationFilters!
    $limit: Float!
    $page: Float!
  ) {
    getConversations(filters: $filters, limit: $limit, page: $page) {
      items {
        id
        isActive
        createdAt
        updatedAt
        participants {
          profilePic
          lastName
          id
          firstName
        }
        lastMessage {
          content
          isRead
          sender {
            id
            firstName
            lastName
          }
        }
        unreadCount
      }
      pagination {
        page
        limit
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_CONVERSATION = gql`
  query GetConversation($conversationId: String!) {
    getConversation(conversationId: $conversationId) {
      id
      participants {
        id
        firstName
        lastName
        email
        isVerified
        profilePic
      }
      unreadCount
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages(
    $conversationId: ID!
    $filters: MessageFilters!
    $page: Int
    $limit: Int
  ) {
    getMessages(
      conversationId: $conversationId
      filters: $filters
      page: $page
      limit: $limit
    ) {
      items {
        id
        conversationId
        senderId
        content
        messageType
        attachments
        isRead
        createdAt
        sender {
          id
          firstName
          lastName
          profilePic
        }
      }
      pagination {
        page
        limit
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
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

export const SEND_BROADCAST_MESSAGE = gql`
  mutation SendBroadcastMessage($input: BroadcastMessageInput!) {
    sendBroadcastMessage(input: $input) {
      id
      content
      messageType
      recipientRoles
      sentToUserIds
      totalRecipients
      attachments
      createdAt
    }
  }
`;

export const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription MessageSent {
    messageSent {
      id
      conversationId
      senderId
      content
      messageType
      attachments
      isRead
      createdAt
    }
  }
`;
