// src/App.tsx
import { useEffect } from "react";
import AppRoutes from "./routes";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading</p>
      </div>
    );

  return <AppRoutes />;
}
