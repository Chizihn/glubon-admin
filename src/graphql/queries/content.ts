import { gql } from "@apollo/client";

export const GET_CONTENTS = gql`
  query GetContents($filters: ContentFilterInput) {
    contents(filters: $filters) {
      items {
        id
        title
        slug
        type
        status
        author {
          id
          firstName
          lastName
        }
        updatedAt
        viewCount
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_CONTENT_STATS = gql`
  query GetContentStats {
    contentStats {
      data {
        total
        published
        draft
        archived
        scheduled
        trash
      }
    }
  }
`;

export const GET_FAQS = gql`
  query GetFAQs($filter: FAQFilter) {
    getFAQs(filter: $filter) {
      id
      question
      answer
      category
      isActive
      updatedBy
      updatedAt
    }
  }
`;

export const GET_FAQ_CATEGORIES = gql`
  query GetFAQCategories {
    getFAQCategories {
      name
      count
    }
  }
`;
