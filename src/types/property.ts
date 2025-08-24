import type { User } from "./auth";
import type { Booking } from "./booking";
import type { Conversation } from "./conversation";
import {
  PropertyListingType,
  PropertyStatus,
  PropertyType,
  RentalPeriod,
  RoomType,
  VerificationStatus,
} from "./enums";

export interface Property {
  id: string;
  title: string;
  description: string;
  status: PropertyStatus;
  listingType: PropertyListingType;
  amount: number;
  rentalPeriod: RentalPeriod;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  sqft?: number | null;
  bedrooms: number;
  bathrooms: number;
  propertyType: PropertyType;
  roomType: RoomType;
  visitingDays: Array<
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY"
  >;
  visitingTimeStart?: string | null;
  visitingTimeEnd?: string | null;
  amenities: string[];
  isFurnished: boolean;
  isForStudents: boolean;
  images: string[];
  livingRoomImages: string[];
  bedroomImages: string[];
  bathroomImages: string[];
  video?: string | null;
  propertyOwnershipDocs: string[];
  propertyPlanDocs: string[];
  propertyDimensionDocs: string[];
  ownershipVerified: boolean;
  featured: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  bookings: Booking[];
  likes: PropertyLike[];
  views: PropertyView[];
  ownershipProofs: PropertyOwnershipProof[];
  conversations: Conversation[];
  stats: {
    views: number;
    conversations: number;
    likes: number;
    conversionRate: number;
    viewsThisWeek: number;
    inquiriesThisWeek: number;
  };
}

export interface PropertyLike {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
  user: User;
  property: Property;
}

export interface PropertyView {
  id: string;
  userId: string;
  propertyId: string;
  viewedAt: Date;
  user: User;
  property: Property;
}

export interface PropertyOwnershipProof {
  id: string;
  propertyId: string;
  userId: string;
  documentType: string;
  documentImages: string[];
  status: VerificationStatus;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
  property: Property;
  user: User;
}

// src/types/index.ts
export interface CreatePropertyInput {
  listingType: PropertyListingType | null;
  address: string | null;
  amenities: string[] | null;
  amount: number | null;
  bathrooms: number | null;
  bedrooms: number | null;
  city: string | null;
  description: string | null;
  isForStudents: boolean | null;
  isFurnished: boolean | null;
  propertyType: PropertyType | null;
  visitingTimeStart: string | null;
  visitingTimeEnd: string | null;
  visitingDays: string[] | null;
  title: string | null;
  state: string | null;
  sqft: number | null;
  roomType: RoomType | null;
  rentalPeriod: RentalPeriod | null;
}
