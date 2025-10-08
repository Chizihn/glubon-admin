import { gql } from "@apollo/client";

export const SEND_TYPING_STATUS = gql`
  mutation SendTypingStatus($conversationId: ID!, $isTyping: Boolean!) {
    sendTypingStatus(conversationId: $conversationId, isTyping: $isTyping) {
      success
      message
    }
  }
`;

export const SEND_HEARTBEAT = gql`
  mutation SendHeartbeat {
    sendHeartbeat {
      success
      message
      timestamp
    }
  }
`;
