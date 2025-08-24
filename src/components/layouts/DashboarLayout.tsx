import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar takes a fixed width on desktop, hidden on mobile unless toggled */}
      <Sidebar />
      {/* Main content takes remaining space and handles overflow */}
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}