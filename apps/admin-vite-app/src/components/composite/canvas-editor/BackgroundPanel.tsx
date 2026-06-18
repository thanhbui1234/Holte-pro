import { Layers } from "lucide-react";
import type { CanvasBgType, CustomSection } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { ColorField } from "../ColorField";
import { inputCls } from "./constants";
import { buildBgStyle } from "./helpers";

const BG_TABS: { key: CanvasBgType; label: string }[] = [
  { key: "solid",  label: "Solid"  },
  { key: "linear", label: "Linear" },
  { key: "radial", label: "Radial" },
  { key: "image",  label: "Image"  },
];

const PRESET_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function BgField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </label>
      {children}
    </div>
  );
}

export function BackgroundPanel({
  section,
  onChange,
}: {
  section: CustomSection;
  onChange: (u: Partial<CustomSection>) => void;
}) {
  const type = section.backgroundType ?? "solid";

  return (
    <div className="flex flex-col divide-y divide-border/50">
      <div className="flex items-center gap-2 px-4 py-3">
        <Layers className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-semibold">Background</span>
      </div>

      {/* Type tabs */}
      <div className="grid grid-cols-4 gap-1 p-3">
        {BG_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange({ backgroundType: tab.key })}
            className={cn(
              "rounded-lg py-1.5 text-[11px] font-semibold transition-colors",
              type === tab.key
                ? "bg-amber-500 text-stone-950"
                : "bg-muted/50 text-muted-foreground hover:bg-accent",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Type-specific controls */}
      <div className="space-y-3 p-4">
        {type === "solid" && (
          <BgField label="Color">
            <ColorField
              value={section.backgroundColor}
              onChange={(v) => onChange({ backgroundColor: v })}
            />
          </BgField>
        )}

        {(type === "linear" || type === "radial") && (
          <>
            <BgField label="From">
              <ColorField
                value={section.bgGradientFrom ?? "#ffffff"}
                onChange={(v) => onChange({ bgGradientFrom: v })}
              />
            </BgField>
            <BgField label="To">
              <ColorField
                value={section.bgGradientTo ?? "#cccccc"}
                onChange={(v) => onChange({ bgGradientTo: v })}
              />
            </BgField>
            {type === "linear" && (
              <>
                <BgField label={`Angle: ${section.bgGradientAngle ?? 135}°`}>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={section.bgGradientAngle ?? 135}
                    onChange={(e) => onChange({ bgGradientAngle: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </BgField>
                <div className="grid grid-cols-4 gap-1">
                  {PRESET_ANGLES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => onChange({ bgGradientAngle: a })}
                      className={cn(
                        "rounded-md py-1 text-[10px] font-mono font-semibold transition-colors",
                        (section.bgGradientAngle ?? 135) === a
                          ? "bg-amber-500 text-stone-950"
                          : "bg-muted/50 text-muted-foreground hover:bg-accent",
                      )}
                    >
                      {a}°
                    </button>
                  ))}
                </div>
              </>
            )}
            <div
              className="h-16 w-full rounded-xl border border-border/50"
              style={buildBgStyle(section)}
            />
          </>
        )}

        {type === "image" && (
          <>
            <BgField label="Image URL">
              <input
                className={inputCls}
                value={section.bgImage ?? ""}
                onChange={(e) => onChange({ bgImage: e.target.value })}
                placeholder="https://... or /images/..."
              />
            </BgField>
            {section.bgImage && (
              <div
                className="h-24 w-full rounded-xl border border-border/50"
                style={buildBgStyle(section)}
              />
            )}
            <BgField label="Overlay color">
              <ColorField
                value={section.bgImageOverlay ?? "#000000"}
                onChange={(v) => onChange({ bgImageOverlay: v })}
              />
            </BgField>
            <BgField label={`Overlay opacity: ${section.bgImageOverlayOpacity ?? 30}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={section.bgImageOverlayOpacity ?? 30}
                onChange={(e) => onChange({ bgImageOverlayOpacity: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </BgField>
          </>
        )}
      </div>

      <div className="p-4 text-center">
        <p className="text-[11px] text-muted-foreground/60">
          Select an element to edit its properties
        </p>
      </div>
    </div>
  );
}
