import { gql } from "@apollo/client";

export const REVIEW_VERIFICATION = gql`
  mutation ReviewVerification($input: ReviewVerificationInput!) {
    reviewVerification(input: $input) {
      success
      message
    }
  }
`;

export const BULK_VERIFY_USERS = gql`
  mutation BulkVerifyUsers($userIds: [ID!]!) {
    bulkVerifyUsers(userIds: $userIds) {
      success
      message
      count
    }
  }
`;

export const REQUEST_VERIFICATION = gql`
  mutation RequestVerification($input: RequestVerificationInput!) {
    requestVerification(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_VERIFICATION = gql`
  mutation UpdateVerification($input: UpdateVerificationInput!) {
    updateVerification(input: $input) {
      id
      status
      reviewedAt
      reviewedBy
      rejectionReason
    }
  }
`;
