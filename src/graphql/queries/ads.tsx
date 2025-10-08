import { gql } from "@apollo/client";

export const GET_ALL_ADS = gql`
  query GetAllAds($filter: AdFilterInput, $page: Int!, $limit: Int!) {
    getAllAds(filter: $filter, page: $page, limit: $limit) {
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
      pagination {
        totalPages
      }
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

export const UPDATE_AD_STATUS = gql`
  mutation UpdateAdStatus($input: UpdateAdStatusInput!) {
    updateAdStatus(input: $input) {
      success
      message
      errors
      data {
        id
        status
      }
    }
  }
`;

export const GET_AD_ANALYTICS = gql`
  query GetAdAnalytics($filter: AdAnalyticsFilter!) {
    getAdAnalytics(filter: $filter) {
      totalImpressions
      totalClicks
      totalConversions
      totalRevenue
      clickThroughRate
      conversionRate
      dailyStats {
        id
        adId
        date
        impressions
        clicks
        conversions
        revenue
        createdAt
      }
    }
  }
`;