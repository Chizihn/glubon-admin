import { gql } from "@apollo/client";

export const GET_ACTIVITY_ANALYTICS = gql`
  query GetActivityAnalytics($dateRange: AnalyticsDateRangeInput) {
    getActivityAnalytics(dateRange: $dateRange) {
      date
      views
      likes
      messages
      conversations
    }
  }
`;
