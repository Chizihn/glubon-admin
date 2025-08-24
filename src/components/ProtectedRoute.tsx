import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  allowedPermissions?: string[];
  publicOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedPermissions = [],
  publicOnly = false,
}) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const userPermissions: string[] = user?.permissions || []; // adapt to match your API response

  // 1. Redirect logged-in user away from public-only pages (e.g. /login)
  if (publicOnly && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // 2. Redirect to login if protected and not authenticated
  if (!publicOnly && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3. Check required permissions (if any)
  const hasPermission =
    allowedPermissions.length === 0 ||
    allowedPermissions.some((perm) => userPermissions.includes(perm));

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
