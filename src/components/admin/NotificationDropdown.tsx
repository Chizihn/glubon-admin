import React from 'react';
import { Bell, Check, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ScrollArea  from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'success':
      return <Check className="h-4 w-4 text-green-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

export const NotificationDropdown = () => {
  const { notifications, markAsRead, unreadCount, refetch } = useNotifications(10);
  const [open, setOpen] = React.useState(false);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    await Promise.all(unreadNotifications.map((n) => markAsRead(n.id)));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-sm font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 p-4 hover:bg-muted/50',
                    !notification.isRead && 'bg-muted/30'
                  )}
                >
                  <div className="mt-0.5">
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                      >
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2 text-center">
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
