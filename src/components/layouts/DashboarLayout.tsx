import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 w-64  bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main content area with proper spacing for fixed sidebar */}
      <div className="flex-1 flex flex-col pl-64 h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
