import { gql } from "@apollo/client";

export const GET_ALL_PROPERTIES = gql`
  query GetAllProperties(
    $page: Int!
    $limit: Int!
    $filters: AdminPropertyFilters
  ) {
    getAllProperties(page: $page, limit: $limit, filters: $filters) {
      items {
        id
        title
        description
        price
        status
        isFeatured
        isActive
        createdAt
        updatedAt
        owner {
          id
          firstName
          lastName
          email
        }
        stats {
          views
          likes
          conversations
        }
        images
        location {
          address
          city
          state
        }
      }
      pagination {
        page
        limit
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PROPERTY_BY_ID = gql`
  query GetPropertyById($propertyId: String!) {
    getPropertyById(propertyId: $propertyId) {
      id
      title
      description
      price
      status
      isFeatured
      isActive
      createdAt
      updatedAt
      owner {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      stats {
        views
        likes
        conversations
      }
      images
      location {
        address
        city
        state
        country
        coordinates {
          latitude
          longitude
        }
      }
      amenities
      propertyType
      bedrooms
      bathrooms
      area
    }
  }
`;
