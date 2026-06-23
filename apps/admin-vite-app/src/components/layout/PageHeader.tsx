import { ChevronRight, ExternalLink, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/composite/ThemeToggle";

interface PageHeaderProps {
  title: string;
  breadcrumb: string;
  onMenuClick: () => void;
}

import { useAuth } from "@/features/auth";

export function PageHeader({ title, breadcrumb, onMenuClick }: PageHeaderProps) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 surface-frosted">
      <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            {breadcrumb}
          </span>
          <ChevronRight className="hidden h-3 w-3 text-muted-foreground/60 sm:inline" />
          <h1 className="min-w-0 truncate text-[15px] font-semibold tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={import.meta.env.VITE_SITE_USER_URL || "http://localhost:3000"}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm transition-all hover:-translate-y-px hover:border-amber-500/60 hover:text-amber-700 dark:hover:text-amber-300 sm:inline-flex"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            View live site
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>

          <ThemeToggle className="hidden sm:inline-flex" />

          <div className="hidden h-9 items-center gap-2 rounded-full border bg-background pl-1 pr-3 text-xs shadow-sm md:flex">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="flex h-7 w-7 items-center justify-center rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 font-semibold text-stone-950">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            )}
            <div className="leading-tight">
              <p className="text-[11px] font-semibold">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-muted-foreground">{user?.email || "Studio owner"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
