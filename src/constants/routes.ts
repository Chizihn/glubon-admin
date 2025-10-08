export const ROUTES = {
  // Auth routes
  LOGIN: "/login",
  AUTH_LOGIN: "/auth/login",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  BULK_OPERATIONS: "/dashboard/bulk-operations",

  // Listings
  LISTINGS: "/dashboard/listings",
  LISTING_DETAILS: (id: string) => `/dashboard/listings/${id}`,

  // Transactions
  TRANSACTIONS: "/dashboard/transactions",
  TRANSACTION_DETAILS: (id: string) => `/dashboard/transactions/${id}`,

  // Users
  USERS: "/dashboard/users",
  USER_DETAILS: (id: string) => `/dashboard/users/${id}`,

  // Advertising
  ADVERTISING: "/dashboard/advertising",
  AD_DETAILS: (id: string) => `/dashboard/advertising/${id}`,
  CREATE_AD: "/dashboard/advertising/create",
  AD_ANALYTICS: "/dashboard/advertising/analytics",

  // Analytics
  ANALYTICS: "/dashboard/analytics",
  ANALYTICS_USERS: "/dashboard/analytics/users",
  ANALYTICS_LISTINGS: "/dashboard/analytics/listings",
  ANALYTICS_TRANSACTIONS: "/dashboard/analytics/transactions",

  // Verifications
  VERIFICATIONS: "/dashboard/verifications",
  VERIFICATIONS_PENDING: "/dashboard/verifications/pending",
  VERIFICATION_DETAILS: (id: string) => `/dashboard/verifications/${id}`,

  // Communications
  COMMUNICATIONS: "/dashboard/communications",

  // Reports
  REPORTS: "/dashboard/reports",

  // Content
  CONTENT: "/dashboard/content",
  CONTENT_MANAGEMENT: "/dashboard/content/manage",

  // Settings
  SETTINGS: "/dashboard/settings",

  // Support
  SUPPORT: "/dashboard/support",

  // Admin
  ADMINS: "/dashboard/admins",
  ADMIN_CREATE: "/dashboard/admins/create",
  ADMIN_DETAILS: (id: string) => `/dashboard/admins/${id}`,
  ADMIN_EDIT: (id: string) => `/dashboard/admins/${id}/edit`,

  // System
  SYSTEM_LOGS: "/admin/system-logs",
  ACTIVITY_LOGS: "/admin/activity-logs",
} as const;
