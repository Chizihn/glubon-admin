import { gql } from "@apollo/client";

export const CREATE_CONTENT = gql`
  mutation CreateContent($input: CreateContentInput!) {
    createContent(input: $input) {
      data {
        id
        title
        slug
        status
      }
      success
      message
    }
  }
`;

export const UPDATE_CONTENT = gql`
  mutation UpdateContent($id: ID!, $input: UpdateContentInput!) {
    updateContent(id: $id, input: $input) {
      data {
        id
        title
        slug
        status
        updatedAt
      }
      success
      message
    }
  }
`;

export const DELETE_CONTENT = gql`
  mutation DeleteContent($id: ID!) {
    deleteContent(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_FAQ = gql`
  mutation CreateFAQ($input: CreateFAQInput!) {
    createFAQ(input: $input) {
      id
      question
      category
      isActive
    }
  }
`;

export const UPDATE_FAQ = gql`
  mutation UpdateFAQ($id: String!, $input: UpdateFAQInput!) {
    updateFAQ(id: $id, input: $input) {
      id
      question
      answer
      category
      isActive
      updatedAt
    }
  }
`;

export const DELETE_FAQ = gql`
  mutation DeleteFAQ($id: String!) {
    deleteFAQ(id: $id)
  }
`;
