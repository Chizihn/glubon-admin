import { gql } from "@apollo/client";

export const GET_ALL_TRANSACTIONS = gql`
  query Transactions(
    $pagination: PaginationInput
    $sort: TransactionSortInput
    $filter: TransactionFilterInput
  ) {
    transactions(pagination: $pagination, sort: $sort, filter: $filter) {
      transactions {
        id
        type
        amount
        currency
        status
        reference
        description
        paymentMethod
        gateway
        gatewayRef
        failureReason
        processedAt
        createdAt
        updatedAt
        user {
          id
          firstName
          email
          lastName
        }
        property {
          title
          id
          owner {
            id
            firstName
            lastName
          }
        }
        booking {
          id
          renterId
          propertyId
          startDate
          endDate
          amount
          status
          escrowTransactionId
          createdAt
          updatedAt
        }
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_TRANSACTION_BY_ID = gql`
  query Transaction($transactionId: String!) {
    transaction(id: $transactionId) {
      id
      type
      amount
      currency
      status
      reference
      description
      paymentMethod
      gateway
      gatewayRef
      failureReason
      processedAt
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      property {
        id
        title
        description
        status
        listingType
        amount
        rentalPeriod
        address
        city
        state
        country
        ownershipVerified
        images
        owner {
          id
          firstName
          lastLogin
          email
          phoneNumber
        }
      }
      booking {
        id
        renterId
        propertyId
        startDate
        endDate
        amount
        status
        escrowTransactionId
        createdAt
        updatedAt

        disputes {
          id
          bookingId
          initiatorId
          reason
          description
          status
          resolution
          resolvedAt
          resolvedBy
          parentDispute
          createdAt
          updatedAt

          initiator {
            id
            firstName
            lastLogin
            email
          }
        }
      }
    }
  }
`;

export const GET_USER_TRANSACTIONS = gql`
  query TransactionsByUser(
    $userId: String!
    $status: String
    $pagination: PaginationInput
  ) {
    transactionsByUser(
      userId: $userId
      status: $status
      pagination: $pagination
    ) {
      transactions {
        id
        type
        amount
        currency
        status
        reference
        description
        paymentMethod
        gateway
        gatewayRef
        failureReason
        processedAt
        createdAt
        updatedAt
        property {
          id
          title
          description
        }
      }
      totalCount
      hasMore
    }
  }
`;
