import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  Megaphone,
  MessageSquare,
  FileText,
  Edit,
  ChevronDown,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Users",
    icon: Users,
    subItems: [
      { name: "Customers", href: "/dashboard/users" },
      { name: "Admins", href: "/dashboard/admins" },
    ],
  },
  { name: "Listings", href: "/dashboard/listings", icon: Building2 },
  { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
  { name: "Advertising", href: "/dashboard/advertising", icon: Megaphone },
  {
    name: "Analytics",
    icon: BarChart3,
    subItems: [
      { name: "Users Analytics", href: "/dashboard/analytics/users" },
      { name: "Listings Analytics", href: "/dashboard/analytics/listings" },
      { name: "Ads Analytics", href: "/dashboard/ad-analytics" },
      { name: "Transactions Analytics", href: "/dashboard/analytics/transactions" },
    ],
  },
  { name: "Verifications", href: "/dashboard/verifications", icon: Shield },
  { name: "Communications", href: "/dashboard/communications", icon: MessageSquare },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Content", href: "/dashboard/content", icon: Edit },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:inset-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Glubon Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = item.subItems
                ? item.subItems.some((subItem) => location.pathname === subItem.href)
                : location.pathname === item.href;

              return item.subItems ? (
                <div key={item.name}>
                  <button
                    className={`
                      flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                    `}
                    onClick={() =>
                      item.name === "Users"
                        ? setIsUsersOpen(!isUsersOpen)
                        : setIsAnalyticsOpen(!isAnalyticsOpen)
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    <ChevronDown
                      className={`ml-auto h-4 w-4 transition-transform ${
                        (item.name === "Users" && isUsersOpen) ||
                        (item.name === "Analytics" && isAnalyticsOpen)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  {(item.name === "Users" && isUsersOpen) ||
                  (item.name === "Analytics" && isAnalyticsOpen) ? (
                    <div className="pl-8 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={`
                            flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                            ${
                              location.pathname === subItem.href
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }
                          `}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 wafers">
                <AvatarImage src={user?.profilePic || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}