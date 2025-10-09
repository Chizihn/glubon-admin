import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_BROADCAST_MESSAGES } from '@/graphql/queries/conversation';

const DELETE_BROADCAST_MESSAGE = gql`
  mutation DeleteBroadcastMessage($broadcastId: ID!) {
    deleteBroadcastMessage(broadcastId: $broadcastId) {
      success
      message
    }
  }
`;

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Users, MessageSquare, Paperclip } from 'lucide-react';
import BroadcastMessageInput from './BroadcastMessageInput';
import { toast } from 'sonner';

const ROLE_COLORS = {
  ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  USER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  SUPERADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  MODERATOR: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export const BroadcastList: React.FC = () => {
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_BROADCAST_MESSAGES, {
    variables: { page: 1, limit: 10 },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteBroadcast] = useMutation(DELETE_BROADCAST_MESSAGE, {
    onCompleted: () => {
      refetch();
      toast.success('Broadcast message deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting broadcast:', error);
      toast.error('Failed to delete broadcast message');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this broadcast message?')) {
      deleteBroadcast({ variables: { broadcastId: id } });
    }
  };

  const handleNewMessage = () => {
    setShowNewMessageForm(true);
  };

  const handleMessageSent = () => {
    setShowNewMessageForm(false);
    refetch();
  };

  if (loading && !data) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Error loading broadcast messages: {error.message}</p>
      </div>
    );
  }

  const broadcasts = data?.getBroadcastMessages?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Broadcast Messages</h2>
        <Button onClick={handleNewMessage} disabled={showNewMessageForm}>
          New Broadcast
        </Button>
      </div>

      {showNewMessageForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Broadcast Message</CardTitle>
          </CardHeader>
          <CardContent>
            <BroadcastMessageInput onSuccess={handleMessageSent} onCancel={() => setShowNewMessageForm(false)} />
          </CardContent>
        </Card>
      )}

      {broadcasts.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No broadcast messages yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new broadcast message.
          </p>
          <div className="mt-6">
            <Button onClick={handleNewMessage}>
              <MessageSquare className="-ml-1 mr-2 h-5 w-5" />
              New Broadcast
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {broadcasts.map((broadcast: any) => (
            <Card key={broadcast.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {broadcast.sender?.profilePic ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={broadcast.sender.profilePic}
                          alt={broadcast.sender.firstName}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-600 dark:text-gray-300 font-medium">
                            {broadcast.sender?.firstName?.[0]}
                            {broadcast.sender?.lastName?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {broadcast.sender?.firstName} {broadcast.sender?.lastName}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(broadcast.createdAt), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {broadcast.content}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {broadcast.recipientRoles.map((role: string) => (
                          <Badge
                            key={role}
                            variant="outline"
                            className={`text-xs ${
                              ROLE_COLORS[role as keyof typeof ROLE_COLORS] ||
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {role.toLowerCase()}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="ml-1 text-xs">
                          <Users className="mr-1 h-3 w-3" />
                          {broadcast.totalRecipients} recipients
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(broadcast.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                {broadcast.attachments?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Attachments</h4>
                    <div className="flex flex-wrap gap-2">
                      {broadcast.attachments.map((attachment: string, index: number) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Paperclip className="mr-1 h-3 w-3" />
                          Attachment {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BroadcastList;
