import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar, NAV_GROUPS } from "./AppSidebar";
import { PageHeader } from "./PageHeader";
import { useTheme } from "@/shared/hooks/use-theme";
import { cn } from "@/shared/lib/utils";

function findRoute(pathname: string) {
  for (const group of NAV_GROUPS) {
    const match = group.items.find((item) => item.path === pathname);
    if (match) return { group: group.label, label: match.label };
  }
  return { group: "Admin", label: "Admin" };
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const route = findRoute(location.pathname);

  // Initialise theme on first paint
  useTheme();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <AppSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Main */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <PageHeader
          breadcrumb={route.group}
          title={route.label}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="relative flex-1 bg-canvas px-4 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
