import { gql } from "@apollo/client";

export const GET_AD_ANALYTICS = gql`
  query GetAdAnalytics($filter: AdAnalyticsFilter!) {
    getAdAnalytics(filter: $filter) {
      totalImpressions
      totalClicks
      totalConversions
      totalRevenue
      clickThroughRate
      conversionRate
      dailyData {
        date
        impressions
        clicks
        conversions
        revenue
      }
      adBreakdown {
        adId
        title
        impressions
        clicks
        conversions
        revenue
        clickThroughRate
        conversionRate
      }
    }
  }
`;

export const RECORD_AD_INTERACTION = gql`
  mutation RecordAdInteraction($input: RecordAdInteractionInput!, $userId: String) {
    recordAdInteraction(input: $input, userId: $userId)
  }
`;
