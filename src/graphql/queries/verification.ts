import { gql } from "@apollo/client";

export const GET_PENDING_VERIFICATIONS = gql`
  query GetPendingVerifications($page: Int, $limit: Int) {
    getPendingVerifications(page: $page, limit: $limit) {
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
      pagination {
        totalItems
        totalPages
        currentPage
        hasNextPage
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
