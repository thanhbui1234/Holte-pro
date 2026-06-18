import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shared-ui";
import { Button } from "shared-ui";
import { cn } from "@/shared/lib/utils";

interface EntityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  entityLabel: string;
  description?: string;
  onSubmit: () => void;
  contentClassName?: string;
  children: ReactNode;
}

export function EntityFormDialog({
  open,
  onOpenChange,
  mode,
  entityLabel,
  description,
  onSubmit,
  contentClassName,
  children,
}: EntityFormDialogProps) {
  const heading = `${mode === "add" ? "Add" : "Edit"} ${entityLabel}`;
  const action = mode === "add" ? `Add ${entityLabel.toLowerCase()}` : "Save";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-h-[90vh] overflow-y-auto sm:max-w-xl", contentClassName)}
      >
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          {children}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{action}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
