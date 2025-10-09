/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationType } from "./enums";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any | null;
  isRead: boolean;
  createdAt: Date;
}
