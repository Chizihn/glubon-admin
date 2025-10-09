import type { User } from "./auth";
import type { Booking } from "./booking";
import { DisputeStatus } from "./enums";

export interface Dispute {
  id: string;
  bookingId: string;
  initiatorId: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  resolution?: string | null;
  resolvedAt?: Date | null;
  resolvedBy?: string | null;
  parentDispute?: string | null;
  createdAt: Date;
  updatedAt: Date;
  booking: Booking;
  initiator: User;
  // refunds: Refund[];
  parent?: Dispute | null;
  children: Dispute[];
}
