import { Copy, Trash2 } from "lucide-react";
import type { CanvasElement } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { BLOCK_META } from "./constants";

function PropField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </label>
      {children}
    </div>
  );
}

export function PropertiesPanel({
  element,
  onChange,
  onDelete,
  onDuplicate,
}: {
  element: CanvasElement;
  onChange: (u: Partial<CanvasElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { label, Icon } = BLOCK_META[element.type];

  return (
    <div className="flex flex-col divide-y divide-border/50">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="flex-1 text-sm font-semibold">{label}</span>
        <button
          type="button"
          onClick={onDuplicate}
          title="Duplicate"
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Position & Size */}
      <div className="px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Position & Size
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(["x", "y", "w", "h"] as const).map((k) => (
            <div key={k} className="space-y-0.5">
              <label className="text-[10px] font-semibold uppercase text-muted-foreground/60">
                {k.toUpperCase()}
              </label>
              <input
                type="number"
                value={Math.round(element[k] as number)}
                onChange={(e) => onChange({ [k]: Number(e.target.value) })}
                className="w-full rounded-md border border-input bg-background px-2 py-1 font-mono text-xs outline-none focus:border-amber-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="px-4 py-3">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Appearance
        </p>
        <div className="space-y-3">
          <PropField label={`Opacity: ${element.opacity ?? 100}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={element.opacity ?? 100}
              onChange={(e) => onChange({ opacity: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </PropField>
          <PropField label={`Corner radius: ${element.borderRadius ?? 0}px`}>
            <input
              type="range"
              min={0}
              max={100}
              value={element.borderRadius ?? 0}
              onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </PropField>
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground/60">
              Layer (Z)
            </label>
            <input
              type="number"
              value={element.zIndex}
              onChange={(e) => onChange({ zIndex: Number(e.target.value) })}
              className="w-16 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Shadow */}
      <div className="px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Shadow
          </p>
          <button
            type="button"
            onClick={() => onChange({ shadowEnabled: !element.shadowEnabled })}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              element.shadowEnabled ? "bg-amber-500" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                element.shadowEnabled ? "translate-x-4" : "translate-x-0.5",
              )}
            />
          </button>
        </div>
        {element.shadowEnabled && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["X", "shadowX"],
                  ["Y", "shadowY"],
                  ["Blur", "shadowBlur"],
                ] as const
              ).map(([lbl, key]) => (
                <div key={key} className="space-y-0.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground/60">
                    {lbl}
                  </label>
                  <input
                    type="number"
                    value={element[key] ?? 0}
                    onChange={(e) => onChange({ [key]: Number(e.target.value) })}
                    className="w-full rounded-md border border-input bg-background px-2 py-1 font-mono text-xs outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>
            <PropField label="Shadow color">
              <input
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs shadow-sm outline-none transition-colors focus:border-amber-500"
                value={element.shadowColor ?? "rgba(0,0,0,0.2)"}
                onChange={(e) => onChange({ shadowColor: e.target.value })}
                placeholder="rgba(0,0,0,0.2)"
              />
            </PropField>
          </div>
        )}
      </div>

      {/* Delete */}
      <div className="p-4">
        <button
          type="button"
          onClick={onDelete}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete element
        </button>
      </div>
    </div>
  );
}
