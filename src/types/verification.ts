export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type DocumentType = 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID' | 'VOTERS_CARD' | 'OTHER';

export interface VerificationUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
}

export interface Verification {
  id: string;
  documentType: string;
  documentNumber: string;
  documentImages: string[];
  status: VerificationStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  user: VerificationUser;
}

export interface VerificationsResponse {
  getPendingVerifications: {
    items: Verification[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
    };
  };
}

export interface ReviewVerificationInput {
  verificationId: string;
  approved: boolean;
  reason?: string;
}

export interface ReviewVerificationResponse {
  success: boolean;
  message: string;
}
