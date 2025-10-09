import { gql } from "@apollo/client";

export const UPDATE_PROPERTY_STATUS = gql`
  mutation UpdatePropertyStatus($input: UpdatePropertyStatusInput!) {
    updatePropertyStatus(input: $input) {
      success
      message
    }
  }
`;

export const TOGGLE_PROPERTY_FEATURED = gql`
  mutation TogglePropertyFeatured($propertyId: String!) {
    togglePropertyFeatured(propertyId: $propertyId) {
      success
      message
    }
  }
`;
