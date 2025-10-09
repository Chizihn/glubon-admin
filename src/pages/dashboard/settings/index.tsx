import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

const settingsNavigation = [
  {
    name: "Profile Settings",
    href: "/dashboard/settings",
    description: "Manage your personal account settings",
  },
  {
    name: "Platform Settings",
    href: "/dashboard/settings/platform",
    description: "Configure platform-wide settings",
  },
];

export default function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and platform settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsNavigation.map((item) => {
                  const isActive =
                    location.pathname === item.href ||
                    (item.href === "/dashboard/settings" &&
                      location.pathname === "/dashboard/settings/profile");

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "block px-4 py-3 text-sm font-medium border-b border-gray-100 last:border-b-0 hover:bg-gray-50",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-r-blue-500"
                          : "text-gray-700"
                      )}
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
