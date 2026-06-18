import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/70 bg-background px-6 py-14 text-center",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, oklch(0.769 0.188 70.08 / 0.12), transparent 60%)",
        }}
      />
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-50 text-amber-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:bg-amber-500/10 dark:text-amber-300">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
