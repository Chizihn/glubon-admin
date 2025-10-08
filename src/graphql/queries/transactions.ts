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
        userId
        propertyId
        adId
        bookingId
        metadata
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
          amount
        }
        booking {
          id
          amount
          status
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
      userId
      propertyId
      adId
      bookingId
      metadata
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
        amount
        rentalPeriod
      }
      booking {
        id
        status
        amount
      }
    }
  }
`;
