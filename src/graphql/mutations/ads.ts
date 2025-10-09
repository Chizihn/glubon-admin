import { gql } from "@apollo/client";

export const UPDATE_AD_STATUS = gql`
  mutation UpdateAdStatus($adId: String!, $status: String!) {
    updateAdStatus(adId: $adId, status: $status) {
      success
      message
    }
  }
`;

export const DELETE_AD = gql`
  mutation DeleteAd($adId: String!) {
    deleteAd(adId: $adId) {
      success
      message
    }
  }
`;

export const CREATE_AD = gql`
  mutation CreateAd($input: CreateAdInput!) {
    createAd(input: $input) {
      id
      title
      description
      imageUrl
      targetUrl
      position
      type
      status
      startDate
      endDate
      budget
      costPerClick
      isActive
      createdBy
      createdAt
      updatedAt
    }
  }
`;
