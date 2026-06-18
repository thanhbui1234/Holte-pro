import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/shared/hooks/use-theme";
import { cn } from "@/shared/lib/utils";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

interface ThemeToggleProps {
  className?: string;
  variant?: "segmented" | "icon";
}

export function ThemeToggle({ className, variant = "segmented" }: ThemeToggleProps) {
  const { theme, setTheme, cycle } = useTheme();

  if (variant === "icon") {
    const Active = OPTIONS.find((o) => o.value === theme)?.icon ?? Monitor;
    return (
      <button
        type="button"
        onClick={cycle}
        title={`Theme: ${theme}`}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          className,
        )}
        aria-label="Cycle theme"
      >
        <Active className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border bg-background p-0.5 shadow-sm",
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(opt.value)}
            title={opt.label}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-full transition-all",
              active
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <opt.icon className="h-3.5 w-3.5" />
            <span className="sr-only">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
