import type { User } from "./auth";
import { BookingStatus } from "./enums";
import type { Property } from "./property";

export interface Booking {
  id: string;
  renterId: string;
  propertyId: string;
  startDate: Date;
  endDate?: Date | null;
  amount: number;
  status: BookingStatus;
  // transactions: Transaction[];
  // disputes: Dispute[];
  escrowTransactionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  renter: User;
  property: Property;
}
