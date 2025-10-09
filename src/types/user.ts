// import { UserConversation } from "./conversation";
// import { ProviderEnum, RoleEnum, TokenType, UserStatus, VerificationStatus } from "./enums";
// import { Property, PropertyLike, PropertyOwnershipProof, PropertyView } from "./property";
// import { Wallet } from "./wallet";

// export interface User {
//   readonly id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   password?: string | null;
//   phoneNumber?: string | null;
//   profilePic?: string | null;
//   address?: string | null;
//   city?: string | null;
//   state?: string | null;
//   country?: string | null;
//   role: RoleEnum;
//   provider: ProviderEnum;
//   providerAccounts: ProviderAccount[];
//   isVerified: boolean;
//   isActive: boolean;
//   status: UserStatus;
//   refreshToken?: string | null;
//   readonly createdAt: Date;
//   updatedAt: Date;
//   wallet?: Wallet | null;
//   properties: Property[];
//   propertyLikes: PropertyLike[];
//   propertyViews: PropertyView[];
//   identityVerifications: IdentityVerification[];
//   propertyOwnershipProofs: PropertyOwnershipProof[];
//   notifications: Notification[];
//   conversations: UserConversation[];
//   // sentMessages: Message[];
//   // adminActionLogs: AdminActionLog[];
//   // transactions: Transaction[];
//   // processedRefunds: Refund[];
//   // renterBookings: Booking[];
//   // initiatedDisputes: Dispute[];
//   // createdAds: Ad[];
//   // auditLogs: AuditLog[];
//   // settingUpdates: PlatformSetting[];
//   // contentUpdates: ContentPage[];
//   // faqUpdates: FAQ[];
//   // templateUpdates: EmailTemplate[];
// }

// export interface ProviderAccount {
//   id: string;
//   userId: string;
//   provider: ProviderEnum;
//   providerId: string;
//   accessToken: string;
//   user: User;
// }

// export interface IdentityVerification {
//   id: string;
//   userId: string;
//   documentType: DocumentType;
//   documentNumber: string;
//   documentImages: string[];
//   status: VerificationStatus;
//   reviewedAt?: Date | null;
//   reviewedBy?: string | null;
//   rejectionReason?: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   user: User;
// }

// // export interface VerificationToken {
// //   id: string;
// //   token: string;
// //   type: TokenType;
// //   userId: string;
// //   email: string;
// //   used: boolean;
// //   expiresAt: Date;
// //   createdAt: Date;
// //   user: User;
// // }
