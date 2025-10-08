import { useState, useEffect } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { USER_PRESENCE_SUBSCRIPTION } from "../graphql/subscriptions/presence";
import { SEND_HEARTBEAT } from "../graphql/mutations/presence";

type UserPresenceData = {
  userId: string;
  isOnline: boolean;
  lastSeen: string;
};

type UseUserPresenceProps = {
  userIds: string[];
  heartbeatInterval?: number; // in milliseconds
};

export const useUserPresence = ({
  userIds,
  heartbeatInterval = 30000,
}: UseUserPresenceProps) => {
  const [userPresence, setUserPresence] = useState<
    Record<string, UserPresenceData>
  >({});

  // Subscribe to user presence changes
  useSubscription(USER_PRESENCE_SUBSCRIPTION, {
    variables: { userIds },
    skip: !userIds.length,
    onSubscriptionData: ({ subscriptionData }) => {
      const { presenceChanged } = subscriptionData.data;
      if (presenceChanged) {
        setUserPresence((prev) => ({
          ...prev,
          [presenceChanged.userId]: presenceChanged,
        }));
      }
    },
  });

  // Send heartbeat mutation
  const [sendHeartbeat] = useMutation(SEND_HEARTBEAT, {
    onError: (error) => {
      console.error("Error sending heartbeat:", error);
    },
  });

  // Send heartbeat at regular intervals
  useEffect(() => {
    const currentUserId = localStorage.getItem("userId"); // Adjust based on how you store the current user ID
    if (!currentUserId) return;

    const heartbeat = () => {
      sendHeartbeat();
    };

    // Send initial heartbeat
    heartbeat();

    // Set up interval for regular heartbeats
    const intervalId = setInterval(heartbeat, heartbeatInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [sendHeartbeat, heartbeatInterval]);

  // Helper functions
  const isUserOnline = (userId: string): boolean => {
    return userPresence[userId]?.isOnline || false;
  };

  const getUserLastSeen = (userId: string): string | null => {
    return userPresence[userId]?.lastSeen || null;
  };

  return {
    userPresence,
    isUserOnline,
    getUserLastSeen,
  };
};
