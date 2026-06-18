import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  description,
  icon,
  actions,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "group/card relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_0_oklch(1_0_0/0.6)_inset,0_8px_24px_-12px_oklch(0_0_0/0.08)] transition-shadow",
        "hover:shadow-[0_1px_0_oklch(1_0_0/0.6)_inset,0_14px_32px_-16px_oklch(0_0_0/0.12)]",
        "dark:shadow-[0_1px_0_oklch(1_0_0/0.04)_inset,0_8px_24px_-12px_oklch(0_0_0/0.4)]",
        className,
      )}
    >
      <header className="flex flex-row items-start justify-between gap-4 border-b border-border/40 px-5 py-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-50 text-amber-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold leading-tight tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </header>
      <div className={cn("px-5 py-5", contentClassName)}>{children}</div>
    </section>
  );
}
