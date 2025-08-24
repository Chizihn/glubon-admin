//src/routes/index.tsx
import { Routes, Route } from "react-router-dom";
import BulkOperationsPage from "../pages/dashboard/bulk/BulkOperationsPage";
import { LoginPage } from "../pages/auth/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { DashboardLayout } from "../components/layouts/DashboarLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsersPage from "../pages/dashboard/users/UsersPage";
import TransactionsPage from "../pages/dashboard/transactions/TransactionsPage";
import TransactionDetailsPage from "../pages/dashboard/transactions/TransactionDetailsPage";
import ListingsPage from "../pages/dashboard/listings/ListingsPage";
import ListingDetailsPage from "../pages/dashboard/listings/ListingDetailPage";
import UserDetailsPage from "../pages/dashboard/users/UserDetailsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="auth/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          {/* <Route path="dashboard/admin" element={<Admin />} />
          <Route path="dashboard/admin/create" element={<Create />} />
          <Route path="dashboard/advertising" element={<Advertising />} />
          <Route path="dashboard/analytics" element={<Analytics />} /> */}
          <Route
            path="dashboard/bulk-operations"
            element={<BulkOperationsPage />}
          />
          {/* <Route path="dashboard/communications" element={<Communications />} />
          <Route path="dashboard/content" element={<Content />} /> */}
          {/* <Route
            path="dashboard/content-management"
            element={<ContentManagement />}
          /> */}
          <Route path="dashboard/listings" element={<ListingsPage />} />
          <Route
            path="dashboard/listings/:id"
            element={<ListingDetailsPage />}
          />
          {/* <Route
            path="dashboard/listings/:id/edit"
            element={<ListingEditPage />}
          /> */}
          <Route path="dashboard/transactions" element={<TransactionsPage />} />
          <Route
            path="dashboard/transactions/:id"
            element={<TransactionDetailsPage />}
          />
          {/* <Route path="dashboard/properties" element={<Properties />} />
          <Route path="dashboard/reports" element={<Reports />} />
          <Route path="dashboard/settings" element={<Settings />} />
          <Route path="dashboard/support" element={<Support />} /> */}
          <Route path="dashboard/users" element={<UsersPage />} />
          <Route path="dashboard/users/:id" element={<UserDetailsPage />} />
          {/* <Route path="dashboard/users/:id/edit" element={<UserEdit />} /> */}
          {/* <Route path="dashboard/verifications" element={<Verifications />} /> */}
          {/* <Route
            path="dashboard/verifications/:id"
            element={<VerificationDetail />}
          /> */}
        </Route>
      </Route>
    </Routes>
  );
}
