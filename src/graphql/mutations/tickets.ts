import { gql } from "@apollo/client";

export const CREATE_TICKET = gql`
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      id
      subject
      description
      status
      priority
      category
      createdAt
      createdBy {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($input: UpdateTicketInput!) {
    updateTicket(input: $input) {
      id
      subject
      description
      status
      priority
      category
      updatedAt
      assignedTo {
        id
        firstName
        lastName
      }
    }
  }
`;

export const CLOSE_TICKET = gql`
  mutation CloseTicket($id: String!) {
    closeTicket(id: $id) {
      id
      status
      closedAt
    }
  }
`;

export const REOPEN_TICKET = gql`
  mutation ReopenTicket($id: String!) {
    reopenTicket(id: $id) {
      id
      status
      updatedAt
    }
  }
`;
