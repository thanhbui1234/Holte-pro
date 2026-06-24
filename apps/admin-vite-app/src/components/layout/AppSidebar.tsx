import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import {
  ChevronsLeft,
  Film,
  Inbox,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  PanelsTopLeft,
  Settings2,
  Sparkles,
  LogOut,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/shared/lib/utils";
import { ThemeToggle } from "@/components/composite/ThemeToggle";
import { useContactSubmissions } from "@/features/contact";
import { useAuth } from "@/features/auth";

type NavItem = {
  label: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
  badge?: number;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      { label: "Dashboard", path: "/", icon: LayoutDashboard },
      { label: "Bố cục & thứ tự", path: "/layout", icon: LayoutGrid },
    ],
  },
  {
    label: "Các phần trang web",
    items: [
      { label: "Trung tâm phần", path: "/sections", icon: Layers },
    ],
  },
  {
    label: "CRM",
    items: [
      { label: "Hộp thư liên hệ", path: "/contact-inbox", icon: Inbox },
    ],
  },
  {
    label: "Phương tiện",
    items: [
      { label: "Thư viện video", path: "/video-library", icon: Film },
    ],
  },
  {
    label: "Chrome",
    items: [
      { label: "Header", path: "/header", icon: PanelsTopLeft },
      { label: "Footer", path: "/footer", icon: Settings2 },
    ],
  },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const { data: submissions = [] } = useContactSubmissions();
  const unreadCount = submissions.filter((s: any) => s.status === "unread").length;

  // Inject unread badge count into nav
  const navGroupsWithBadges = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.path === "/contact-inbox" ? { ...item, badge: unreadCount } : item,
    ),
  }));

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      {/* Brand block */}
      <div className="flex h-[68px] items-center gap-3 px-4">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 text-stone-950 shadow-[0_6px_20px_-6px_rgba(217,119,6,0.45)]">
          <Sparkles
            className="absolute inset-0 m-auto h-3 w-3 text-white/40 mix-blend-overlay"
            aria-hidden="true"
          />
          <Film className="relative h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight tracking-tight">
              JOW Film
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Quản trị studio · v1.0
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {navGroupsWithBadges.map((group) => (
          <div key={group.label}>
            <div
              className={cn(
                "mb-1.5 flex items-center gap-2 px-2.5",
                collapsed && "justify-center px-0",
              )}
            >
              {!collapsed && (
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {group.label}
                </p>
              )}
              {!collapsed && <span className="h-px flex-1 bg-sidebar-border/60" />}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        "group/nav relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                        collapsed && "justify-center px-0",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/40 hover:text-foreground",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active"
                            className="absolute inset-0 rounded-lg bg-sidebar-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-amber-500 dark:bg-amber-400" />
                        )}
                        <item.icon
                          className={cn(
                            "relative h-4 w-4 shrink-0 transition-colors",
                            isActive && "text-amber-700 dark:text-amber-300",
                          )}
                        />
                        {!collapsed && (
                          <span className="relative flex flex-1 items-center justify-between truncate">
                            <span className="truncate">{item.label}</span>
                            {item.badge != null && item.badge > 0 && (
                              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-stone-950">
                                {item.badge > 99 ? "99+" : item.badge}
                              </span>
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-background/60 p-2 shadow-sm",
            collapsed && "justify-center bg-transparent shadow-none",
          )}
        >
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-stone-950">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold" title={user?.name}>
                {user?.name || "Admin"}
              </p>
              <p className="truncate text-[10px] text-muted-foreground" title={user?.email}>
                {user?.email || "jowfilm.vn"}
              </p>
            </div>
          )}
          {!collapsed && <ThemeToggle variant="icon" />}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            className={cn(
              "flex flex-1 items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/40 hover:text-foreground",
              collapsed && "justify-center",
            )}
          >
            <ChevronsLeft
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                collapsed && "rotate-180",
              )}
            />
            {!collapsed && <span>Thu gọn</span>}
          </button>
          
          <button
            type="button"
            onClick={logout}
            aria-label="Đăng xuất"
            className={cn(
              "flex flex-1 items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300",
              collapsed && "justify-center",
            )}
          >
            <LogOut className="h-3.5 w-3.5" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

export { NAV_GROUPS };
