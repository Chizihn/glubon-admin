import type { User } from "./auth";
import { MessageType } from "./enums";
import type { Property } from "./property";

export interface Conversation {
  id: string;
  propertyId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  property?: Property | null;
  participants: UserConversation[];
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message | null;
}

export interface UserConversation {
  userId: string;
  conversationId: string;
  joinedAt: Date;
  user: User;
  conversation: Conversation;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  attachments: string[];
  isRead: boolean;
  createdAt: Date;
  conversation: Conversation;
  sender: User;
}

export interface CreateConversationInput {
  participantIds: string[];
  propertyId?: string;
}

export interface SendMessageInput {
  attachments?: string[] | null;
  content: string;
  conversationId?: string | null;
  messageType: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "LOCATION" | "SYSTEM";
  propertyId?: string | null;
  recipientIds: string[];
}
