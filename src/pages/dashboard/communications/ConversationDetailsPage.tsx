import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUserPresence } from "../../../hooks/useUserPresence";
import { Badge } from "../../../components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { gql } from "@apollo/client";

// GraphQL Queries, Mutations, and Subscriptions
const GET_CONVERSATION = gql`
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

const GET_MESSAGES = gql`
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

const SEND_MESSAGE = gql`
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

const MARK_AS_READ = gql`
  mutation MarkAsRead($conversationId: ID!) {
    markAsRead(conversationId: $conversationId) {
      success
      unreadCount
    }
  }
`;

const MESSAGE_SENT_SUBSCRIPTION = gql`
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

const TYPING_STATUS_SUBSCRIPTION = gql`
  subscription TypingStatus($conversationId: String!, $userId: String!) {
    typingStatus(conversationId: $conversationId, userId: $userId) {
      userId
      conversationId
      isTyping
    }
  }
`;

const SEND_TYPING_STATUS = gql`
  mutation SendTypingStatus($conversationId: String!, $isTyping: Boolean!) {
    sendTypingStatus(conversationId: $conversationId, isTyping: $isTyping)
  }
`;

const SEND_HEARTBEAT = gql`
  mutation SendHeartbeat {
    sendHeartbeat
  }
`;

const SEND_BROADCAST_MESSAGE = gql`
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

// Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified?: boolean;
  profilePic?: string;
  role?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  attachments?: string[];
  sender: User;
}

interface Conversation {
  id: string;
  participants: User[];
  unreadCount: number;
}

interface MessagesData {
  getMessages: {
    items: Message[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

interface ConversationData {
  getConversation: Conversation;
}

export function ConversationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [page] = useState(1);
  const [limit] = useState(50);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [otherUserId, setOtherUserId] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Get current user ID
  const currentUserId = localStorage.getItem("userId") || "";

  // Get conversation details
  const { data: conversationData, loading: conversationLoading } =
    useQuery<ConversationData>(GET_CONVERSATION, {
      variables: { conversationId: id },
      skip: !id,
      onError: (error) => {
        toast.error(`Error loading conversation: ${error.message}`);
      },
    });

  // Get messages
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
    subscribeToMore,
  } = useQuery<MessagesData>(GET_MESSAGES, {
    variables: {
      conversationId: id,
      filters: {},
      page,
      limit,
    },
    skip: !id,
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      toast.error(`Error loading messages: ${error.message}`);
    },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: () => {
      refetchMessages();
    },
  });

  const [markAsRead] = useMutation(MARK_AS_READ, {
    onError: (error) => {
      console.error("Error marking as read:", error);
    },
  });

  const [sendBroadcastMessage] = useMutation(SEND_BROADCAST_MESSAGE, {
    onError: (error) => {
      toast.error(`Broadcast failed: ${error.message}`);
    },
    onCompleted: (data) => {
      toast.success(
        `Broadcast sent to ${data.sendBroadcastMessage.totalRecipients} recipients`
      );
      setShowBroadcastModal(false);
      setBroadcastMessage("");
      setSelectedRoles([]);
    },
  });

  // Subscribe to new messages
  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeToMore({
      document: MESSAGE_SENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.getMessages.items[0];

        // Only add message if it belongs to this conversation
        if (newMessage.conversationId !== id) return prev;

        // Don't add the message if it's already in the list
        if (
          prev.getMessages.items.some(
            (msg: Message) => msg.id === newMessage.id
          )
        ) {
          return prev;
        }

        return {
          ...prev,
          getMessages: {
            ...prev.getMessages,
            items: [...prev.getMessages.items, newMessage],
          },
        };
      },
    });

    return () => {
      unsubscribe();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [id, subscribeToMore]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (id && (conversationData?.getConversation?.unreadCount ?? 0) > 0) {
      markAsRead({ variables: { conversationId: id } });
    }
  }, [id, conversationData, markAsRead]);

  // Extract other user ID for presence subscription
  useEffect(() => {
    if (conversationData?.getConversation?.participants) {
      const otherParticipant =
        conversationData.getConversation.participants.find(
          (p: User) => p.id !== currentUserId
        );
      if (otherParticipant) {
        setOtherUserId(otherParticipant.id);
      }
    }
  }, [conversationData, currentUserId]);

  // Subscribe to user presence
  const { isUserOnline, getUserLastSeen } = useUserPresence({
    userIds: otherUserId ? [otherUserId] : [],
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.getMessages?.items]);

  // Send typing status and heartbeat
  const [sendTypingStatus] = useMutation(SEND_TYPING_STATUS);
  const [sendHeartbeat] = useMutation(SEND_HEARTBEAT);

  // Send heartbeat every minute to maintain online status
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      sendHeartbeat().catch((err) =>
        console.error("Failed to send heartbeat:", err)
      );
    }, 60000);

    sendHeartbeat().catch((err) =>
      console.error("Failed to send initial heartbeat:", err)
    );

    return () => clearInterval(heartbeatInterval);
  }, [sendHeartbeat]);

  // Subscribe to typing status
  useSubscription(TYPING_STATUS_SUBSCRIPTION, {
    variables: { conversationId: id || "", userId: otherUserId },
    skip: !id || !otherUserId,
    onData: ({ data }) => {
      const typingStatus = data?.data?.typingStatus;
      if (typingStatus) {
        setIsTyping(typingStatus.isTyping);
      }
    },
  });

  // Handle typing status
  const handleTyping = () => {
    if (!id) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendTypingStatus({
      variables: {
        conversationId: id,
        isTyping: true,
      },
    });

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus({
        variables: {
          conversationId: id,
          isTyping: false,
        },
      });
    }, 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !id) return;

    try {
      await sendMessage({
        variables: {
          input: {
            conversationId: id,
            content: message,
            messageType: "TEXT",
          },
        },
      });
      setMessage("");

      sendTypingStatus({
        variables: {
          conversationId: id,
          isTyping: false,
        },
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error("Please select at least one recipient role");
      return;
    }

    try {
      await sendBroadcastMessage({
        variables: {
          input: {
            content: broadcastMessage,
            messageType: "TEXT",
            recipientRoles: selectedRoles,
          },
        },
      });
    } catch (error) {
      console.error("Error sending broadcast:", error);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  if (conversationLoading || messagesLoading) {
    return <div className="p-4">Loading conversation...</div>;
  }

  if (!conversationData?.getConversation) {
    return <div className="p-4">Conversation not found</div>;
  }

  const { getConversation: conversation } = conversationData;
  const messages = messagesData?.getMessages?.items || [];
  const otherParticipant = conversation.participants.find(
    (p: User) => p.id !== currentUserId
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-3 flex-1">
          <Avatar>
            <AvatarImage
              src={otherParticipant?.profilePic}
              alt={`${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
            />
            <AvatarFallback>
              {otherParticipant?.firstName?.[0]}
              {otherParticipant?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">
                {otherParticipant?.firstName} {otherParticipant?.lastName}
              </h2>
              {otherParticipant && isUserOnline(otherParticipant.id) && (
                <Badge
                  variant="outline"
                  className="bg-green-500 border-green-500 h-2 w-2 rounded-full p-0"
                />
              )}
            </div>
            <p className="text-sm text-gray-500">{otherParticipant?.email}</p>
            {otherParticipant && (
              <p className="text-xs text-gray-400">
                {isUserOnline(otherParticipant.id)
                  ? "Online"
                  : getUserLastSeen(otherParticipant.id)
                  ? `Last seen ${formatDistanceToNow(
                      new Date(getUserLastSeen(otherParticipant.id) || ""),
                      { addSuffix: true }
                    )}`
                  : ""}
              </p>
            )}
            {isTyping && (
              <p className="text-xs text-blue-500 animate-pulse">typing...</p>
            )}
          </div>
        </div>
        <div className="ml-auto">
          <Button variant="outline" onClick={() => setShowBroadcastModal(true)}>
            Send Broadcast
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.senderId === currentUserId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Send Broadcast Message</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Recipients
              </label>
              <div className="space-y-2">
                {["RENTER", "LISTER", "ADMIN"].map((role) => (
                  <label key={role} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="rounded"
                    />
                    <span className="text-sm">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter your broadcast message..."
                className="w-full border rounded-lg p-2 min-h-[100px]"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBroadcastModal(false);
                  setBroadcastMessage("");
                  setSelectedRoles([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleBroadcast}>Send Broadcast</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversationDetailsPage;
