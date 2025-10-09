import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query GetConversations($filters: ConversationFilters, $page: Int, $limit: Int) {
    getConversations(filters: $filters, page: $page, limit: $limit) {
      items {
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
          senderId
          isRead
          createdAt
        }
        unreadCount
        createdAt
        updatedAt
      }
      pagination {
        totalItems
        totalPages
        currentPage
        itemsPerPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_CONVERSATION_MESSAGES = gql`
  query GetConversationMessages($conversationId: ID!, $page: Int, $limit: Int) {
    getConversationMessages(conversationId: $conversationId, page: $page, limit: $limit) {
      items {
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
        isRead
        isBroadcast
        broadcastId
        attachments
        createdAt
        updatedAt
      }
      pagination {
        totalItems
        totalPages
        currentPage
        itemsPerPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadCount {
    getUnreadCount {
      totalUnread
      unreadByConversation {
        conversationId
        count
      }
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

export const GET_BROADCAST_MESSAGES = gql`
  query GetBroadcastMessages($filters: BroadcastMessageFilter, $page: Int, $limit: Int) {
    getBroadcastMessages(filters: $filters, page: $page, limit: $limit) {
      items {
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
      pagination {
        totalItems
        totalPages
        currentPage
        itemsPerPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_BROADCAST_MESSAGE = gql`
  query GetBroadcastMessage($broadcastId: ID!) {
    getBroadcastMessage(broadcastId: $broadcastId) {
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
