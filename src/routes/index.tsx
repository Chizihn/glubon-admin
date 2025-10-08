//src/routes/index.tsx
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { dashboardRoutes } from "./dashboardRoutes";
import { ROUTES } from "../constants/routes";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";

// Helper to render all routes including nested ones
const renderRoutes = (routes: any[]) => {
  return routes.flatMap((route) => {
    if (route.children) {
      return [
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        >
          {route.children.map((child: any) => (
            <Route
              key={child.path}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>,
        // Also include the parent route itself if it has an element
        ...(route.element ? [
          <Route
            key={`${route.path}-self`}
            path={route.path}
            element={route.element}
          />
        ] : [])
      ];
    }
    // Handle routes without children
    return [
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    ];
  });
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route index element={<LoginPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.AUTH_LOGIN} element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {renderRoutes(dashboardRoutes)}
      </Route>

      {/* Fallback route - 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
