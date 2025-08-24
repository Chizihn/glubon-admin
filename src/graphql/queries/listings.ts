import { gql } from "@apollo/client";

export const GET_ALL_LISTINGS = gql`
  query GetAllProperties(
    $limit: Int!
    $page: Int!
    $filters: AdminPropertyFilters
  ) {
    getAllProperties(limit: $limit, page: $page, filters: $filters) {
      items {
        id
        title
        description
        status
        amount
        address
        city
        state
        bedrooms
        bathrooms
        featured
        ownershipVerified
        createdAt
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

export const GET_LISTING_BY_ID = gql`
  query GetProperty($getPropertyId: String!) {
    getProperty(id: $getPropertyId) {
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
      latitude
      longitude
      sqft
      bedrooms
      bathrooms
      propertyType
      roomType
      visitingDays
      visitingTimeStart
      visitingTimeEnd
      amenities
      isFurnished
      isForStudents
      featured
      ownershipVerified
      images
      livingRoomImages
      bedroomImages
      bathroomImages
      video
      propertyOwnershipDocs
      propertyPlanDocs
      propertyDimensionDocs
      ownerId
      owner {
        id
        firstName
        lastName
        email
        provider
        isActive
        phoneNumber
        profilePic
        isVerified
        role
        status
        address
        city
        state
        country
        createdAt
        updatedAt
        lastLogin
      }
      viewsCount
      likesCount
      isLiked
      isViewed
      createdAt
      updatedAt
      distance
      location
      priceUnit
      pricePer
      imageUrl
      type
    }
  }
`;
