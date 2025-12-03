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
        amount
        status
        listingType
        rentalPeriod
        featured
        createdAt
        updatedAt
        owner {
          id
          firstName
          lastName
          email
          phoneNumber
          profilePic
        }
        viewsCount
        likesCount
        images
        address
        city
        state
        country
        latitude
        longitude
        propertyType
        roomType
        bedrooms
        bathrooms
        sqft
        numberOfUnits
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
      amount
      status
      listingType
      rentalPeriod
      featured
      createdAt
      updatedAt
      owner {
        id
        firstName
        lastName
        email
        phoneNumber
        profilePic
      }
      viewsCount
      likesCount
      
      images
      sampleUnitImages
      livingRoomImages
      bedroomImages
      bathroomImages
      video
      
      address
      city
      state
      country
      latitude
      longitude
      
      amenities
      propertyType
      roomType
      bedrooms
      bathrooms
      sqft
      
      isFurnished
      isForStudents
      isStandalone
      totalUnits
      availableUnits
      rentedUnits
      numberOfUnits
      
      visitingDays
      visitingTimeStart
      visitingTimeEnd
      
      propertyOwnershipDocs
      propertyPlanDocs
      propertyDimensionDocs
      ownershipVerified
    }
  }
`;
