import { useQuery, useMutation } from '@apollo/client';
import GET_NOTIFICATIONS from '@/graphql/queries/notifications/getNotifications';
import MARK_NOTIFICATION_AS_READ from '@/graphql/mutations/notifications/markAsRead';
import type { Notification } from '@/types/notification';
import { useCallback } from 'react';

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: Error | undefined;
  markAsRead: (id: string) => Promise<void>;
  refetch: () => void;
  unreadCount: number;
}

export const useNotifications = (limit: number = 10): UseNotificationsReturn => {
  const { data, loading, error, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: { limit },
    fetchPolicy: 'cache-and-network',
  });

  const [markAsReadMutation] = useMutation(MARK_NOTIFICATION_AS_READ);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await markAsReadMutation({
          variables: { id },
          update: (cache) => {
            const existingNotifications = cache.readQuery<{ notifications: Notification[] }>({
              query: GET_NOTIFICATIONS,
              variables: { limit },
            });

            if (existingNotifications) {
              cache.writeQuery({
                query: GET_NOTIFICATIONS,
                variables: { limit },
                data: {
                  notifications: existingNotifications.notifications.map((notification) =>
                    notification.id === id ? { ...notification, isRead: true } : notification
                  ),
                },
              });
            }
          },
        });
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    },
    [limit, markAsReadMutation]
  );

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  return {
    notifications,
    loading,
    error,
    markAsRead,
    refetch,
    unreadCount,
  };
};
