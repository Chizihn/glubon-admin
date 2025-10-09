import { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  GET_CONVERSATIONS,
  CONVERSATION_UPDATED_SUBSCRIPTION,
  MESSAGE_SENT_SUBSCRIPTION,
} from "../../../graphql/communications";
import { Send, Plus, Search, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUserPresence } from "../../../hooks/useUserPresence";
import { Badge } from "../../../components/ui/badge";

const CommunicationsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  // Commented out unused state
  // const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);

  // Subscribe to conversation updates
  useSubscription(CONVERSATION_UPDATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (data?.conversationUpdated) {
        toast.info("New message received");
        refetch(); // Refresh the conversations list
      }
    },
    onError: (error) => {
      console.error("Subscription error:", error);
    },
  });

  // Subscribe to new messages
  useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (data?.messageSent) {
        refetch(); // Refresh the conversations list when a new message is received
      }
    },
    onError: (error) => {
      console.error("Message subscription error:", error);
    },
  });

  const { data, loading, error, refetch } = useQuery<{
    conversations: Array<{
      id: string;
      participants: Array<{
        user: {
          id: string;
          firstName: string;
          lastName: string;
        };
      }>;
      lastMessage?: {
        content: string;
        createdAt: string;
      };
      property?: {
        title: string;
      };
      updatedAt: string;
      unreadCount?: number;
      isActive?: boolean;
      propertyId?: string;
    }>;
  }>(GET_CONVERSATIONS, {
    variables: {
      filters: {
        isArchived: activeTab === "archived" ? true : undefined,
        isStarred: activeTab === "starred" ? true : undefined,
      },
    },
    onError: (error) => {
      toast.error(`Error loading conversations: ${error.message}`);
    },
  });

  // Define the Conversation type
  type ConversationData = {
    id: string;
    participants: Array<{
      user: {
        id: string;
        firstName: string;
        lastName: string;
      };
    }>;
    lastMessage?: {
      content: string;
      createdAt?: string;
    };
    property?: {
      title: string;
    };
    updatedAt: string;
    unreadCount?: number;
    isActive?: boolean;
    propertyId?: string;
  };

  const conversations: ConversationData[] = data?.conversations || [];

  // Extract all participant IDs for presence subscription
  useEffect(() => {
    if (conversations.length > 0) {
      const ids = conversations
        .flatMap((conv) => conv.participants.map((p) => p.user.id))
        .filter(Boolean);
      setParticipantIds([...new Set(ids)]); // Remove duplicates
    }
  }, [conversations]);

  // Subscribe to user presence
  const { isUserOnline, getUserLastSeen } = useUserPresence({
    userIds: participantIds,
  });

  const handleConversationClick = (conversationId: string) => {
    navigate(`/dashboard/communications/${conversationId}`);
  };

  const getUnreadCount = (conversation: ConversationData): number => {
    return conversation.unreadCount || 0;
  };

  const getLastMessageTime = (conversation: ConversationData): string => {
    return conversation.lastMessage?.createdAt
      ? formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
          addSuffix: true,
        })
      : "";
  };

  const filteredConversations = conversations.filter(
    (conversation: ConversationData) => {
      if (!searchQuery) return true;

      const searchLower = searchQuery.toLowerCase();
      const participantNames =
        conversation.participants
          ?.map((p: { user: { firstName?: string; lastName?: string } }) =>
            `${p.user?.firstName || ""} ${p.user?.lastName || ""}`
              .toLowerCase()
              .trim()
          )
          .join(" ") || "";
      const lastMessage =
        conversation.lastMessage?.content?.toLowerCase() || "";
      const propertyTitle = conversation.property?.title?.toLowerCase() || "";

      return (
        participantNames.includes(searchLower) ||
        lastMessage.includes(searchLower) ||
        propertyTitle.includes(searchLower)
      );
    }
  );

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading conversations: {error.message}
      </div>
    );
  }

  const renderOnlineStatus = (userId: string) => {
    if (isUserOnline(userId)) {
      return (
        <Badge
          variant="outline"
          className="bg-green-500 border-green-500 h-2 w-2 rounded-full p-0"
        />
      );
    }
    return null;
  };

  const getLastSeenText = (userId: string) => {
    const lastSeen = getUserLastSeen(userId);
    if (!lastSeen) return "";
    if (isUserOnline(userId)) return "Online";
    return `Last seen ${formatDistanceToNow(new Date(lastSeen), {
      addSuffix: true,
    })}`;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Communications</h1>
          <p className="text-gray-500">
            {loading
              ? "Loading conversations..."
              : `Showing ${filteredConversations.length} conversations`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="default"
            className="flex items-center gap-2"
            // TODO: Implement broadcast modal
            onClick={() => {}}
          >
            <Send className="w-4 h-4 mr-2" />
            Broadcast
          </Button>
          <Button
            className="flex-1 sm:flex-none"
            onClick={() => navigate("/dashboard/communications/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search conversations..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {["all", "unread", "starred", "archived"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-16" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                getUnreadCount(conversation) > 0
                  ? "border-l-4 border-l-blue-500"
                  : ""
              }`}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium relative">
                        {conversation.participants[0]?.user?.firstName &&
                          conversation.participants[0]?.user?.firstName[0]}
                        {conversation.participants[0]?.user?.lastName &&
                          conversation.participants[0]?.user?.lastName[0]}
                        {conversation.participants[0]?.user?.id && (
                          <div className="absolute -bottom-1 -right-1">
                            {renderOnlineStatus(
                              conversation.participants[0].user.id
                            )}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium truncate">
                            {conversation.participants[0]?.user?.firstName}{" "}
                            {conversation.participants[0]?.user?.lastName}
                          </h3>
                          {conversation.property && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                              {conversation.property.title}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {conversation.lastMessage?.content ||
                            "No messages yet"}
                        </p>
                        <div className="flex justify-between items-center">
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-400 mt-1">
                              {getLastMessageTime(conversation)}
                            </p>
                          )}
                          {conversation.participants[0]?.user?.id && (
                            <p className="text-xs text-gray-400 mt-1">
                              {getLastSeenText(
                                conversation.participants[0].user.id
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getUnreadCount(conversation) > 0 && (
                      <span className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                        {getUnreadCount(conversation)}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(conversation.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchQuery
                ? "No matching conversations"
                : "No conversations yet"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "No conversations match your search."
                : "Start a new conversation to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationsPage;

// Removed unused User interface

// Removed unused interfaces

//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Active Conversations</p>
//                 <p className="text-2xl font-bold">1,234</p>
//               </div>
//               <MessageSquare className="h-8 w-8 text-blue-500" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Support Tickets</p>
//                 <p className="text-2xl font-bold">45</p>
//                 <p className="text-xs text-yellow-600">12 pending</p>
//               </div>
//               <AlertTriangle className="h-8 w-8 text-yellow-500" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Messages Today</p>
//                 <p className="text-2xl font-bold">2,456</p>
//               </div>
//               <Send className="h-8 w-8 text-green-500" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Flagged Content</p>
//                 <p className="text-2xl font-bold">8</p>
//               </div>
//               <AlertTriangle className="h-8 w-8 text-red-500" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="text-center py-12">
//         <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
//         <h3 className="mt-2 text-sm font-medium text-gray-900">
//           Communications Dashboard
//         </h3>
//         <p className="mt-1 text-sm text-gray-500">
//           Detailed communication tools will be implemented here
//         </p>
//       </div>
//     </div>
//   );
// }
