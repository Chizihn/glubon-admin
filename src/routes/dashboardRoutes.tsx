import type { RouteObject } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { DashboardLayout } from "../components/layouts/DashboarLayout";

// Dashboard Pages
import DashboardPage from "../pages/dashboard/DashboardPage";

// Bulk Operations
import BulkOperationsPage from "../pages/dashboard/bulk/BulkOperationsPage";

// Listings
import ListingsPage from "../pages/dashboard/listings/ListingsPage";
import ListingDetailsPage from "../pages/dashboard/listings/ListingDetailPage";

// Transactions
import TransactionsPage from "../pages/dashboard/transactions/TransactionsPage";
import TransactionDetailsPage from "../pages/dashboard/transactions/TransactionDetailsPage";

// Users
import UsersPage from "../pages/dashboard/users/UsersPage";
import UserDetailsPage from "../pages/dashboard/users/UserDetailsPage";

// Advertising
import AdvertisingPage from "../pages/dashboard/advertising/AdvertisingPage";
import AdAnalyticsPage from "../pages/dashboard/advertising/AdAnalyticsPage";

// Analytics
import AnalyticsPage from "../pages/dashboard/analytics/AnalyticsPage";

// Verifications
import VerificationsPage from "../pages/dashboard/verifications/VerificationsPage";
import VerificationDetailPage from "../pages/dashboard/verifications/VerificationDetailPage";
import PendingVerificationsPage from "../pages/dashboard/verifications/PendingVerificationsPage";

// Communications
import CommunicationsPage from "../pages/dashboard/communications/CommunicationsPage";

// Reports
import ReportsPage from "../pages/dashboard/report/ReportsPage";

// Content
import ContentsPage from "../pages/dashboard/content/ContentsPage";
import ContentsManagementPage from "../pages/dashboard/content/ContentsManagementPage";

// Settings
import SettingsLayout from "../pages/dashboard/settings";
import UserSettingsPage from "../pages/dashboard/settings/UserSettingsPage";
import PlatformSettingsPage from "../pages/dashboard/settings/PlatformSettingsPage";

// Support
import SupportPage from "../pages/dashboard/support/SupportPage";

// Admin
import AdminsPage from "../pages/dashboard/admin/AdminsPage";
import AdminCreatePage from "../pages/dashboard/admin/AdminCreatePage";
import AdminDetailsPage from "../pages/dashboard/admin/AdminDetailsPage";
import AdminUserEditPage from "../pages/dashboard/admin/AdminUserEditPage";
import SystemLogsPage from "../pages/dashboard/admin/SystemLogsPage";
import AdminActivityLogsPage from "../pages/dashboard/admin/AdminActivityLogsPage";
import CreateAdPage from "@/pages/dashboard/advertising/CreateAdPage";
import AdDetailsPage from "@/pages/dashboard/advertising/AdDetailsPage";

// Tickets
import TicketsPage from "../pages/dashboard/tickets/TicketsPage";
import TicketDetailsPage from "../pages/dashboard/tickets/TicketDetailsPage";

// Create a type-safe route object
const createRoute = (path: string, element: React.ReactNode): RouteObject => ({
  path,
  element,
});

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      // Dashboard
      createRoute(ROUTES.DASHBOARD, <DashboardPage />),

      // Bulk Operations
      createRoute(ROUTES.BULK_OPERATIONS, <BulkOperationsPage />),

      // Listings
      createRoute(ROUTES.LISTINGS, <ListingsPage />),
      createRoute(ROUTES.LISTING_DETAILS(":id"), <ListingDetailsPage />),

      // Transactions
      createRoute(ROUTES.TRANSACTIONS, <TransactionsPage />),
      createRoute(
        ROUTES.TRANSACTION_DETAILS(":id"),
        <TransactionDetailsPage />
      ),

      // Users
      createRoute(ROUTES.USERS, <UsersPage />),
      createRoute(ROUTES.USER_DETAILS(":id"), <UserDetailsPage />),

      // Advertising
      createRoute(ROUTES.ADVERTISING, <AdvertisingPage />),
      createRoute(ROUTES.AD_DETAILS(":id"), <AdDetailsPage />),
      createRoute(ROUTES.CREATE_AD, <CreateAdPage />),
      createRoute(ROUTES.AD_ANALYTICS, <AdAnalyticsPage />),

      // Analytics
      createRoute(ROUTES.ANALYTICS, <AnalyticsPage defaultTab="overview" />),
      createRoute(ROUTES.ANALYTICS_USERS, <AnalyticsPage defaultTab="users" />),
      createRoute(
        ROUTES.ANALYTICS_LISTINGS,
        <AnalyticsPage defaultTab="listings" />
      ),
      createRoute(
        ROUTES.ANALYTICS_TRANSACTIONS,
        <AnalyticsPage defaultTab="transactions" />
      ),

      // Verifications
      createRoute(ROUTES.VERIFICATIONS, <VerificationsPage />),
      createRoute(ROUTES.VERIFICATIONS_PENDING, <PendingVerificationsPage />),
      createRoute(
        ROUTES.VERIFICATION_DETAILS(":id"),
        <VerificationDetailPage />
      ),

      // Communications
      createRoute(ROUTES.COMMUNICATIONS, <CommunicationsPage />),

      // Reports
      createRoute(ROUTES.REPORTS, <ReportsPage />),

      // Content
      createRoute(ROUTES.CONTENT, <ContentsPage />),
      createRoute(ROUTES.CONTENT_MANAGEMENT, <ContentsManagementPage />),

      // Settings
      {
        path: ROUTES.SETTINGS,
        element: <SettingsLayout />,
        children: [
          { index: true, element: <UserSettingsPage /> },
          { path: "profile", element: <UserSettingsPage /> },
          { path: "platform", element: <PlatformSettingsPage /> },
        ],
      },

      // Support
      createRoute(ROUTES.SUPPORT, <SupportPage />),

      // Admin
      createRoute(ROUTES.ADMINS, <AdminsPage />),
      createRoute(ROUTES.ADMIN_CREATE, <AdminCreatePage />),
      createRoute(ROUTES.ADMIN_DETAILS(":id"), <AdminDetailsPage />),
      createRoute(ROUTES.ADMIN_EDIT(":id"), <AdminUserEditPage />),

      // Tickets
      createRoute(ROUTES.TICKETS, <TicketsPage />),
      createRoute(ROUTES.TICKET_DETAILS(":id"), <TicketDetailsPage />),

      // System
      createRoute(ROUTES.SYSTEM_LOGS, <SystemLogsPage />),
      createRoute(ROUTES.ACTIVITY_LOGS, <AdminActivityLogsPage />),
    ],
  },
];
