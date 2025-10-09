// src/App.tsx
import { useEffect, useState } from "react";
import AppRoutes from "./routes";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { initializeAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeAuth();
      } finally {
        setIsInitialized(true);
      }
    };
    
    initAuth();
  }, [initializeAuth]);

  // Show loading state only if we're not yet initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <AppRoutes />;
}
