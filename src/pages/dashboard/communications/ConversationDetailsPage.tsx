import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import {
  GET_CONVERSATION,
  SEND_MESSAGE,
  MESSAGE_SENT_SUBSCRIPTION,
} from "../../../graphql/communications";
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
import { TYPING_STATUS_SUBSCRIPTION } from "../../../graphql/subscriptions/presence";
import {
  SEND_TYPING_STATUS,
  SEND_HEARTBEAT,
} from "../../../graphql/mutations/presence";
import { Badge } from "../../../components/ui/badge";
import { formatDistanceToNow } from "date-fns";

// Define types for the conversation data
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

interface Message {
  id: string;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  sender: User;
}

interface Participant {
  user: User;
}

interface Conversation {
  id: string;
  messages: Message[];
  participants: Participant[];
}

interface CacheData {
  conversation: Conversation;
}

export function ConversationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [otherUserId, setOtherUserId] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { loading, error, data, subscribeToMore } = useQuery(GET_CONVERSATION, {
    variables: { id },
    onError: (error) => {
      toast.error(`Error loading conversation: ${error.message}`);
    },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (error) => {
      toast.error(error.message);
    },
    update: (cache, { data: { sendMessage: newMessage } }) => {
      // Update the cache to include the new message
      const existingData = cache.readQuery({
        query: GET_CONVERSATION,
        variables: { id },
      }) as CacheData | null;

      if (existingData) {
        cache.writeQuery({
          query: GET_CONVERSATION,
          variables: { id },
          data: {
            conversation: {
              ...existingData.conversation,
              messages: [...existingData.conversation.messages, newMessage],
            },
          },
        });
      }
    },
  });

  // Subscribe to new messages
  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeToMore({
      document: MESSAGE_SENT_SUBSCRIPTION,
      variables: { conversationId: id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageSent;

        // Don't add the message if it's already in the list
        if (
          prev.conversation.messages.some(
            (msg: Message) => msg.id === newMessage.id
          )
        ) {
          return prev;
        }

        return {
          ...prev,
          conversation: {
            ...prev.conversation,
            messages: [...prev.conversation.messages, newMessage],
          },
        };
      },
    });

    return () => {
      unsubscribe();
      // Clear typing timeout on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [id, subscribeToMore]);

  // Extract other user ID for presence subscription
  useEffect(() => {
    if (data?.conversation?.participants) {
      // Get current user ID from auth store or localStorage
      const currentUserId = localStorage.getItem("userId") || "current-user-id";
      const otherParticipant = data.conversation.participants.find(
        (p: Participant) => p.user.id !== currentUserId
      );
      if (otherParticipant) {
        setOtherUserId(otherParticipant.user.id);
      }
    }
  }, [data?.conversation?.participants]);

  // Subscribe to user presence
  const { isUserOnline, getUserLastSeen } = useUserPresence({
    userIds: otherUserId ? [otherUserId] : [],
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.conversation?.messages]);

  // Send typing status and heartbeat
  const [sendTypingStatus] = useMutation(SEND_TYPING_STATUS);
  const [sendHeartbeat] = useMutation(SEND_HEARTBEAT);

  // Send heartbeat every minute to maintain online status
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      sendHeartbeat().catch((err) =>
        console.error("Failed to send heartbeat:", err)
      );
    }, 60000); // Every minute

    // Send initial heartbeat
    sendHeartbeat().catch((err) =>
      console.error("Failed to send initial heartbeat:", err)
    );

    return () => clearInterval(heartbeatInterval);
  }, [sendHeartbeat]);

  // Subscribe to typing status
  useSubscription(TYPING_STATUS_SUBSCRIPTION, {
    variables: { conversationId: id || "", userId: otherUserId },
    skip: !id || !otherUserId,
    onSubscriptionData: ({ subscriptionData }) => {
      const { typingStatus } = subscriptionData.data;
      if (typingStatus) {
        setIsTyping(typingStatus.isTyping);
      }
    },
  });

  // Handle typing status
  const handleTyping = () => {
    if (!id) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing status
    sendTypingStatus({
      variables: {
        conversationId: id,
        isTyping: true,
      },
    });

    // Set timeout to stop typing after 2 seconds of inactivity
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

      // Send typing status false after sending message
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

  const handleBroadcast = () => {
    // This will open the broadcast modal
    // The modal will handle the broadcast message mutation
    // We'll implement this in the next step
  };

  if (loading) return <div>Loading conversation...</div>;
  if (error) return <div>Error loading conversation: {error.message}</div>;
  if (!data?.conversation) return <div>Conversation not found</div>;

  const { conversation } = data;
  const currentUserId = localStorage.getItem("userId") || "current-user-id";
  const otherParticipant = conversation.participants.find(
    (p: Participant) => p.user.id !== currentUserId
  )?.user;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={otherParticipant?.avatar}
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
          <Button variant="outline" onClick={handleBroadcast}>
            Send Broadcast
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender.id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender.id === currentUserId
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
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConversationDetailsPage;
