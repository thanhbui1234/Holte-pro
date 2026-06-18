import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "shared-ui";
import { cn } from "@/shared/lib/utils";

interface SaveBarProps {
  isDirty: boolean;
  isSubmitting?: boolean;
  onSave: () => void;
  onReset?: () => void;
  className?: string;
  saveLabel?: string;
}

export function SaveBar({
  isDirty,
  isSubmitting,
  onSave,
  onReset,
  className,
  saveLabel = "Save changes",
}: SaveBarProps) {
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (justSaved) {
      const timer = setTimeout(() => setJustSaved(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [justSaved]);

  const handleSave = () => {
    onSave();
    setJustSaved(true);
  };

  const status = isDirty
    ? "dirty"
    : justSaved
      ? "saved"
      : "clean";

  return (
    <div
      className={cn(
        "sticky bottom-6 z-20 mt-10 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-[0_18px_50px_-20px_oklch(0_0_0/0.25)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 dark:shadow-[0_18px_50px_-20px_oklch(0_0_0/0.6)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                "relative flex h-2 w-2 rounded-full",
                status === "dirty" && "bg-amber-500",
                status === "saved" && "bg-emerald-500",
                status === "clean" && "bg-muted-foreground/40",
              )}
            >
              {status === "dirty" && (
                <span className="absolute inset-0 animate-ping rounded-full bg-amber-500/60" />
              )}
            </span>
            <span className="text-muted-foreground">
              {status === "dirty" && "Unsaved changes"}
              {status === "saved" && "All changes saved"}
              {status === "clean" && "Up to date"}
            </span>
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        {onReset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={!isDirty || isSubmitting}
            className="text-muted-foreground"
          >
            Discard
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : justSaved && !isDirty ? (
            <Check className="h-4 w-4" />
          ) : null}
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
