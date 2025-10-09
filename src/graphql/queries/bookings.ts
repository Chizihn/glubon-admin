import { gql } from "@apollo/client";

export const GET_USER_BOOKINGS = gql`
  query GetUserBookings($userId: String) {
    getUserBookings(userId: $userId) {
      id
      renterId
      propertyId
      startDate
      endDate
      amount
      status
      createdAt
      updatedAt

      property {
        id
        title
        description
        city
        country
        state
      }
    }
  }
`;
