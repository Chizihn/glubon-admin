import { gql } from "@apollo/client";

export const GET_VERIFICATIONS = gql`
  query GetVerifications(
    $limit: Int!
    $page: Int!
    $status: VerificationStatus
    $search: String
  ) {
    getVerifications(
      limit: $limit
      page: $page
      status: $status
      search: $search
    ) {
      pagination {
        page
        limit
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        documentType
        documentNumber
        documentImages
        status
        reviewedAt
        reviewedBy
        rejectionReason
        createdAt
        user {
          id
          firstName
          lastName
          email
          phoneNumber
          role
        }
      }
    }
  }
`;

export const GET_VERIFICATION_BY_ID = gql`
  query GetVerificationById($id: ID!) {
    getVerificationById(id: $id) {
      id
      documentType
      documentNumber
      documentImages
      status
      reviewedAt
      reviewedBy
      rejectionReason
      createdAt
      user {
        id
        firstName
        lastName
        email
        phoneNumber
        role
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
