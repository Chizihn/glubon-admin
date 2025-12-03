import { gql } from "@apollo/client";

export const GET_TICKETS = gql`
  query GetTickets($filter: TicketFilterInput) {
    getTickets(filter: $filter) {
      data {
        id
        subject
        description
        status
        priority
        category
        createdAt
        updatedAt
        resolvedAt
        closedAt
        assignedAt
        createdBy {
          id
          firstName
          lastName
          email
          profilePic
        }
        assignedTo {
          id
          firstName
          lastName
          email
          profilePic
        }
      }
      pagination {
        page
        limit
        totalItems
        totalPages
      }
    }
  }
`;

export const GET_TICKET_BY_ID = gql`
  query GetTicket($id: String!) {
    getTicket(id: $id) {
      id
      subject
      description
      status
      priority
      category
      createdAt
      updatedAt
      resolvedAt
      closedAt
      assignedAt
      createdBy {
        id
        firstName
        lastName
        email
        profilePic
      }
      assignedTo {
        id
        firstName
        lastName
        email
        profilePic
      }
    }
  }
`;

export const GET_TICKET_STATS = gql`
  query GetTicketStats {
    getTicketStats {
      open
      inProgress
      resolved
      closed
      reopened
      total
      byPriority {
        LOW
        MEDIUM
        HIGH
        URGENT
      }
      byCategory {
        ACCOUNT
        PAYMENT
        TECHNICAL
        GENERAL
        FEEDBACK
        OTHER
      }
    }
  }
`;
