import { gql } from "@apollo/client";

export const GET_ALL_ADS = gql`
  query GetAds($filter: GetAdsFilter) {
    getAds(filter: $filter) {
      data {
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

export const GET_AD = gql`
  query GetAd($id: String!) {
    getAd(id: $id) {
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

export const GET_AD_ANALYTICS = gql`
  query GetAdAnalytics($dateRange: AnalyticsDateRangeInput) {
    getAdAnalytics(dateRange: $dateRange) {
      overview {
        totalImpressions
        totalClicks
        totalConversions
        totalSpent
        averageCTR
        averageCPC
        averageCPM
        activeAds
      }
      charts {
        impressionsOverTime {
          date
          impressions
          clicks
          conversions
        }
        performanceByType {
          type
          impressions
          clicks
          spent
          conversions
        }
        topPerformingAds {
          id
          title
          impressions
          clicks
          conversions
          ctr
        }
      }
    }
  }
`;
