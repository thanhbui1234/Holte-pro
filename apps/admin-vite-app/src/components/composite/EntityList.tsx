import type { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface EntityListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderRow: (item: T) => ReactNode;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  emptyState?: ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  getKey,
  renderRow,
  onEdit,
  onDelete,
  emptyState,
  className,
}: EntityListProps<T>) {
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <ul
      className={cn(
        "divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60 bg-background",
        className,
      )}
    >
      {safeItems.map((item) => (
          <li
              key={getKey(item)}
              className="group/row flex items-center gap-4 px-3 py-3 transition-colors hover:bg-amber-500/5"
          >
            <div className="min-w-0 flex-1">{renderRow(item)}</div>
            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
              <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-amber-700 dark:hover:text-amber-300"
                  aria-label="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
      ))}
    </ul>
  );
}
