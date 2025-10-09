import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CONVERSATIONS, GET_UNREAD_COUNT } from '@/graphql/queries/conversation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationListProps {
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  filters?: any;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversationId,
  onSelectConversation,
  filters = {},
}) => {
  const { loading, error, data } = useQuery(GET_CONVERSATIONS, {
    variables: { filters, page: 1, limit: 20 },
    fetchPolicy: 'cache-and-network',
  });

  const { data: unreadData } = useQuery(GET_UNREAD_COUNT, {
    pollInterval: 30000, // Refresh every 30 seconds
  });

  const unreadCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    unreadData?.getUnreadCount?.unreadByConversation?.forEach((item: any) => {
      counts[item.conversationId] = item.count;
    });
    return counts;
  }, [unreadData]);

  if (loading && !data) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading conversations: {error.message}
      </div>
    );
  }

  const conversations = data?.getConversations?.items || [];

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
        <p>No conversations found</p>
        <p className="text-sm">Start a new conversation to get started</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {conversations.map((conversation: any) => {
        const unreadCount = unreadCounts[conversation.id] || 0;
        const lastMessage = conversation.lastMessage;
        const otherParticipant = conversation.participants?.find(
          (p: any) => p.id !== lastMessage?.senderId
        );

        return (
          <div
            key={conversation.id}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
              selectedConversationId === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherParticipant?.profilePic} alt={otherParticipant?.firstName} />
                <AvatarFallback>
                  {otherParticipant?.firstName?.[0]}
                  {otherParticipant?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {otherParticipant
                      ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                      : 'Unknown User'}
                  </h3>
                  {lastMessage?.createdAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                  {lastMessage?.content || 'No messages yet'}
                </p>
              </div>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
