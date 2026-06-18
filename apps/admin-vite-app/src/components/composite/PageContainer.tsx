import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface PageContainerProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  description,
  badge,
  actions,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl space-y-8", className)}>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {badge}
            </span>
          )}
          <h2 className="text-[28px] font-semibold leading-tight tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </header>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
