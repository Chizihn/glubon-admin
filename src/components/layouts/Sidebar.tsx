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
  FileSearch,
  Activity,
  Headphones,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface NavLinkItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavDropdownItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems: NavLinkItem[];
  exact?: boolean;
}

type NavItem = NavLinkItem | NavDropdownItem;

// Type guard to check if an item is a dropdown
const isDropdownItem = (item: NavItem): item is NavDropdownItem => {
  return "subItems" in item && Array.isArray(item.subItems);
};

const navigation: (NavLinkItem | NavDropdownItem)[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    icon: Users,
    subItems: [
      {
        name: "Customers",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        name: "Admins",
        href: "/dashboard/admins",
        icon: Shield,
      },
    ],
  },
  {
    name: "Listings",
    href: "/dashboard/listings",
    icon: Building2,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: CreditCard,
  },
  {
    name: "Advertising",
    href: "/dashboard/advertising",
    icon: Megaphone,
  },
  {
    name: "Analytics",
    icon: BarChart3,
    subItems: [
      {
        name: "Users Analytics",
        href: "/dashboard/analytics/users",
        icon: Users,
      },
      {
        name: "Listings Analytics",
        href: "/dashboard/analytics/listings",
        icon: Building2,
      },
      {
        name: "Ads Analytics",
        href: "/dashboard/ad-analytics",
        icon: Megaphone,
      },
      {
        name: "Transactions Analytics",
        href: "/dashboard/analytics/transactions",
        icon: CreditCard,
      },
    ],
  },
  {
    name: "Verifications",
    icon: Shield,
    subItems: [
      {
        name: "All",
        href: "/dashboard/verifications",
        icon: Shield,
      },
      {
        name: "Pending",
        href: "/dashboard/verifications/pending",
        icon: Shield,
      },
    ],
  },
  {
    name: "Chat",
    href: "/dashboard/communications",
    icon: MessageSquare,
  },
  {
    name: "Tickets",
    href: "/dashboard/tickets",
    icon: Headphones,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    name: "Content",
    href: "/dashboard/content",
    icon: Edit,
  },
  {
    name: "Admin",
    icon: Shield,
    subItems: [
      {
        name: "System Logs",
        href: "/admin/system-logs",
        icon: FileSearch,
      },
      {
        name: "Activity Logs",
        href: "/admin/activity-logs",
        icon: Activity,
      },
    ],
  },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVerificationsOpen, setIsVerificationsOpen] = useState(false);
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
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
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
        <div className="flex flex-col h-screen">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">Glubon Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0">
            {navigation.map((item) => {
              const isActive =
                !isDropdownItem(item) && location.pathname === item.href;
              const isSubItemActive = isDropdownItem(item)
                ? item.subItems.some(
                    (subItem) => subItem.href === location.pathname
                  )
                : false;

              if (isDropdownItem(item)) {
                const isOpen =
                  (item.name === "Users" && isUsersOpen) ||
                  (item.name === "Analytics" && isAnalyticsOpen) ||
                  (item.name === "Admin" && isAdminOpen) ||
                  (item.name === "Verifications" && isVerificationsOpen);

                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => {
                        if (item.name === "Users") {
                          setIsUsersOpen(!isUsersOpen);
                        } else if (item.name === "Analytics") {
                          setIsAnalyticsOpen(!isAnalyticsOpen);
                        } else if (item.name === "Admin") {
                          setIsAdminOpen(!isAdminOpen);
                        } else if (item.name === "Verifications") {
                          setIsVerificationsOpen(!isVerificationsOpen);
                        }
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                        isSubItemActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                      <ChevronDown
                        className={`ml-auto w-4 h-4 transition-transform ${
                          isOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pl-4 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`flex items-center px-4 py-2 text-sm rounded-md ${
                              location.pathname === subItem.href
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <subItem.icon className="w-4 h-4 mr-3" />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              }
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8">
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
