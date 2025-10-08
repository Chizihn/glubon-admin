import { gql } from "@apollo/client";

export const TYPING_STATUS_SUBSCRIPTION = gql`
  subscription TypingStatus($conversationId: ID!, $userId: ID!) {
    typingStatus(conversationId: $conversationId, userId: $userId) {
      userId
      conversationId
      isTyping
      timestamp
    }
  }
`;

export const USER_PRESENCE_SUBSCRIPTION = gql`
  subscription UserPresence($userIds: [ID!]!) {
    userPresence(userIds: $userIds) {
      userId
      isOnline
      lastSeen
    }
  }
`;
