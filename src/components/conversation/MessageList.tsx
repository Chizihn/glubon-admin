import React, { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CONVERSATION_MESSAGES } from '@/graphql/queries/conversation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { MESSAGE_SENT } from '@/graphql/subscriptions/conversation';
import { useAuthStore } from '@/store/authStore';

interface MessageListProps {
  conversationId: string;
  onMessageRead?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({ conversationId, onMessageRead }) => {
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { loading, error, data, subscribeToMore } = useQuery(GET_CONVERSATION_MESSAGES, {
    variables: { conversationId, page: 1, limit: 50 },
    fetchPolicy: 'cache-and-network',
    skip: !conversationId,
  });

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = subscribeToMore({
      document: MESSAGE_SENT,
      variables: { conversationId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageSent;
        
        // Don't add the message if it's already in the list
        if (prev.getConversationMessages.items.some((msg: any) => msg.id === newMessage.id)) {
          return prev;
        }

        return {
          ...prev,
          getConversationMessages: {
            ...prev.getConversationMessages,
            items: [...prev.getConversationMessages.items, newMessage],
          },
        };
      },
    });

    return () => unsubscribe();
  }, [conversationId, subscribeToMore]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Mark messages as read when component mounts or conversation changes
    if (conversationId && onMessageRead) {
      onMessageRead();
    }
  }, [conversationId, data, onMessageRead]);

  if (loading && !data) {
    return (
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-red-500">
        Error loading messages: {error.message}
      </div>
    );
  }

  const messages = data?.getConversationMessages?.items || [];

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-gray-500">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {messages.map((message: any) => {
        const isCurrentUser = message.sender.id === user?.id;
        const messageDate = new Date(message.createdAt);
        const formattedTime = format(messageDate, 'h:mm a');

        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-3/4 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isCurrentUser && (
                <div className="flex-shrink-0 mr-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.profilePic} alt={message.sender.firstName} />
                    <AvatarFallback>
                      {message.sender.firstName?.[0]}
                      {message.sender.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div>
                {!isCurrentUser && (
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {message.sender.firstName} {message.sender.lastName}
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                  }`}
                >
                  {message.content}
                  <div
                    className={`text-xs mt-1 text-right ${
                      isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formattedTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
