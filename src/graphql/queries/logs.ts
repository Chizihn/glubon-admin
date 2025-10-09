import { gql } from "@apollo/client";

export const GET_ADMIN_LOGS = gql`
  query GetAdminLogs($limit: Int, $offset: Int, $action: String, $search: String, $startDate: String, $endDate: String) {
    adminLogs(
      limit: $limit
      offset: $offset
      action: $action
      search: $search
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      action
      details
      ipAddress
      userAgent
      createdAt
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
    adminLogsCount(
      action: $action
      search: $search
      startDate: $startDate
      endDate: $endDate
    )
  }
`;

export const GET_SYSTEM_LOGS = gql`
query GetSystemLogs($limit: Int, $offset: Int, $level: String, $search: String, $startDate: String, $endDate: String) {
  systemLogs(
    limit: $limit
    offset: $offset
    level: $level
    search: $search
    startDate: $startDate
    endDate: $endDate
  ) {
    id
    level
    message
    timestamp
    service
    context
  }
  systemLogsCount(
    level: $level
    search: $search
    startDate: $startDate
    endDate: $endDate
  )
}
`;