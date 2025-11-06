import { useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Send, Plus, Search, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUserPresence } from "../../../hooks/useUserPresence";
import { Badge } from "../../../components/ui/badge";
import { gql } from "@apollo/client";
import useDebounce from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/authStore";

// GraphQL Queries and Subscriptions
const GET_CONVERSATIONS = gql`
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
          id
          firstName
          lastName
          profilePic
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

// Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
}

interface LastMessage {
  content: string;
  isRead: boolean;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface ConversationItem {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  participants: User[];
  lastMessage?: LastMessage;
  unreadCount: number;
}

interface ConversationsData {
  getConversations: {
    items: ConversationItem[];
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

const CommunicationsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounce the search query with a 300ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const currentUserId = useAuthStore((state) => state.user?.id);

  // Build filters object using debounced search query
  const filters = debouncedSearchQuery ? { search: debouncedSearchQuery } : {};

  // Main query
  const { data, loading, error, refetch } = useQuery<ConversationsData>(
    GET_CONVERSATIONS,
    {
      variables: { filters, limit, page },
      fetchPolicy: "cache-and-network",
      onError: (err) => {
        toast.error(`Error loading conversations: ${err.message}`);
      },
    }
  );

  // Subscribe to new messages
  useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
    onData: () => {
      refetch();
    },
    onError: (err) => {
      console.error("Message subscription error:", err);
    },
  });

  const conversations = data?.getConversations?.items || [];

  // Extract participant IDs for presence
  const participantIds = (() => {
    if (conversations.length === 0) return [];
    const ids = conversations
      .flatMap((conv) => conv.participants.map((p) => p.id))
      .filter((id) => id !== currentUserId);
    return Array.from(new Set(ids));
  })();

  // Subscribe to user presence
  const { isUserOnline, getUserLastSeen } = useUserPresence({
    userIds: participantIds,
  });

  // Helper: Get other participant
  const getOtherParticipant = (conversation: ConversationItem): User | null => {
    return (
      conversation.participants.find((p) => p.id !== currentUserId) || null
    );
  };

  // Client-side filtering
  const filteredConversations = (() => {
    let result = [...conversations];

    // Filter by tab
    if (activeTab === "unread") {
      result = result.filter((conv) => (conv.unreadCount || 0) > 0);
    }

    // Filter by search (using debounced search query)
    if (debouncedSearchQuery) {
      const searchLower = debouncedSearchQuery.toLowerCase();
      result = result.filter((conv) => {
        const otherParticipant = getOtherParticipant(conv);
        const participantName = otherParticipant
          ? `${otherParticipant.firstName} ${otherParticipant.lastName}`.toLowerCase()
          : "";
        const lastMessage = conv.lastMessage?.content?.toLowerCase() || "";
        return (
          participantName.includes(searchLower) ||
          lastMessage.includes(searchLower)
        );
      });
    }

    return result;
  })();

  const handleConversationClick = (conversationId: string) => {
    navigate(`/dashboard/communications/${conversationId}`);
  };

  const getLastSeenText = (userId: string) => {
    if (isUserOnline(userId)) return "Online";
    const lastSeen = getUserLastSeen(userId);
    if (!lastSeen) return "";
    return `Last seen ${formatDistanceToNow(new Date(lastSeen), {
      addSuffix: true,
    })}`;
  };

  const renderOnlineStatus = (userId: string) => {
    if (!isUserOnline(userId)) return null;
    return (
      <Badge
        variant="outline"
        className="bg-green-500 border-green-500 h-2 w-2 rounded-full p-0"
      />
    );
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading conversations: {error.message}
      </div>
    );
  }

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
            onClick={() => navigate("/dashboard/communications/broadcast")}
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
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {["all", "unread"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
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
          <>
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              if (!otherParticipant) return null;

              const unreadCount = conversation.unreadCount || 0;

              return (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    unreadCount > 0 ? "border-l-4 border-l-blue-500" : ""
                  }`}
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium relative">
                            {otherParticipant.profilePic ? (
                              <img
                                src={otherParticipant.profilePic}
                                alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <>
                                {otherParticipant.firstName[0]}
                                {otherParticipant.lastName[0]}
                              </>
                            )}
                            <div className="absolute -bottom-1 -right-1">
                              {renderOnlineStatus(otherParticipant.id)}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-medium truncate">
                                {otherParticipant.firstName}{" "}
                                {otherParticipant.lastName}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {conversation.lastMessage?.content ||
                                "No messages yet"}
                            </p>
                            <div className="flex justify-between items-center">
                              {conversation.lastMessage && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDistanceToNow(
                                    new Date(conversation.updatedAt),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {getLastSeenText(otherParticipant.id)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <span className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                            {unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDistanceToNow(
                            new Date(conversation.updatedAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {data?.getConversations?.pagination && (
              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  disabled={!data.getConversations.pagination.hasPreviousPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {data.getConversations.pagination.page} of{" "}
                  {data.getConversations.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!data.getConversations.pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {debouncedSearchQuery
                ? "No matching conversations"
                : "No conversations yet"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {debouncedSearchQuery
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
