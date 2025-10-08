import { gql } from "@apollo/client";

export const GET_VERIFICATIONS = gql`
  query GetVerifications($status: VerificationStatus, $page: Int, $limit: Int) {
    getVerifications(status: $status, page: $page, limit: $limit) {
      verifications {
        id
        type
        status
        submittedAt
        reviewedAt
        notes
        rejectionReason
        documents
        user {
          id
          firstName
          lastName
          email
          profilePic
          phoneNumber
        }
        reviewer {
          id
          firstName
          lastName
          email
        }
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_VERIFICATION_BY_ID = gql`
  query GetVerificationById($verificationId: ID!) {
    getVerificationById(verificationId: $verificationId) {
      id
      type
      status
      submittedAt
      reviewedAt
      notes
      rejectionReason
      documents
      user {
        id
        firstName
        lastName
        email
        profilePic
        phoneNumber
        dateOfBirth
        address
      }
      reviewer {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const APPROVE_VERIFICATION = gql`
  mutation ApproveVerification($verificationId: ID!, $notes: String) {
    approveVerification(verificationId: $verificationId, notes: $notes) {
      id
      status
      reviewedAt
      notes
    }
  }
`;

export const REJECT_VERIFICATION = gql`
  mutation RejectVerification($verificationId: ID!, $reason: String!) {
    rejectVerification(verificationId: $verificationId, reason: $reason) {
      id
      status
      reviewedAt
      rejectionReason
    }
  }
`;

export const GET_VERIFICATION_STATS = gql`
  query GetVerificationStats {
    getVerificationStats {
      totalVerifications
      pendingVerifications
      approvedVerifications
      rejectedVerifications
      averageProcessingTime
    }
  }
`;
