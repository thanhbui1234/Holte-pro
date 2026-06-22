import { useEffect, useRef, useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, ChevronDown, Library } from "lucide-react";
import type { CanvasElement } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { BLOCK_META } from "./constants";
import { CATEGORY_LABELS, FONT_OPTIONS, ensureGoogleFontsLoaded } from "./fonts";
import { VideoLibraryModal } from "@/components/composite/VideoLibraryModal";

/* ─── Shared toolbar primitives ─────────────────────────────────────────── */

export function Sep() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-border/60" />;
}

export function TbInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-7 rounded-md border border-input bg-background px-2 text-xs outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-amber-500",
        className,
      )}
      {...props}
    />
  );
}

export function ColorSwatch({
  value,
  onChange,
  title,
}: {
  value: string;
  onChange: (v: string) => void;
  title?: string;
}) {
  return (
    <label
      title={title}
      className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-input bg-background transition-colors hover:border-amber-500/50"
    >
      <span
        className="h-4 w-4 rounded-sm border border-black/10"
        style={{ backgroundColor: value }}
      />
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </label>
  );
}

export function CompactFontPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = FONT_OPTIONS.find((f) => f.value === value) ?? FONT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    ensureGoogleFontsLoaded();
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-36 items-center justify-between rounded-md border border-input bg-background px-2 text-xs transition-colors hover:border-amber-500/50"
        style={{ fontFamily: current.value !== "inherit" ? current.value : undefined }}
      >
        <span className="truncate">{current.label}</span>
        <ChevronDown
          className={cn(
            "ml-1 h-3 w-3 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-[100] mt-1 max-h-60 w-48 overflow-y-auto rounded-xl border border-border bg-background shadow-xl">
          {Array.from(new Set(FONT_OPTIONS.map((f) => f.category))).map((cat) => (
            <div key={cat}>
              <p className="sticky top-0 bg-muted/90 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                {CATEGORY_LABELS[cat]}
              </p>
              {FONT_OPTIONS.filter((f) => f.category === cat).map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onMouseEnter={() => ensureGoogleFontsLoaded()}
                  onClick={() => { onChange(font.value); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-amber-50/60 dark:hover:bg-amber-500/8",
                    value === font.value &&
                      "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200",
                  )}
                  style={{ fontFamily: font.value !== "inherit" ? font.value : undefined }}
                >
                  <span>{font.label}</span>
                  {value === font.value && (
                    <span className="text-[10px] text-amber-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Type-specific context bars ────────────────────────────────────────── */

function TextContextBar({
  el,
  onChange,
}: {
  el: CanvasElement;
  onChange: (u: Partial<CanvasElement>) => void;
}) {
  return (
    <>
      <CompactFontPicker
        value={el.fontFamily ?? "inherit"}
        onChange={(v) => onChange({ fontFamily: v })}
      />

      <div className="flex h-7 items-center gap-1 rounded-md border border-input bg-background px-2">
        <input
          type="number"
          min={8}
          max={200}
          value={el.fontSize ?? 32}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className="w-10 bg-transparent font-mono text-xs outline-none"
        />
        <span className="text-[10px] text-muted-foreground">px</span>
      </div>

      <Sep />

      <div className="flex gap-0.5">
        {(
          [
            ["normal",  "N" ],
            ["semibold","SB"],
            ["bold",    "B" ],
          ] as const
        ).map(([w, lbl]) => (
          <button
            key={w}
            type="button"
            onClick={() => onChange({ fontWeight: w })}
            className={cn(
              "flex h-7 items-center rounded-md border px-2 text-xs font-bold transition-colors",
              (el.fontWeight ?? "bold") === w
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                : "border-border/50 bg-background text-muted-foreground hover:bg-accent",
            )}
          >
            {lbl}
          </button>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({ fontStyle: el.fontStyle === "italic" ? "normal" : "italic" })
          }
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md border text-xs italic font-bold transition-colors",
            el.fontStyle === "italic"
              ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
              : "border-border/50 bg-background text-muted-foreground hover:bg-accent",
          )}
        >
          I
        </button>
      </div>

      <Sep />

      <div className="flex gap-0.5">
        {(
          [
            ["left",   AlignLeft  ],
            ["center", AlignCenter],
            ["right",  AlignRight ],
          ] as const
        ).map(([a, Ic]) => (
          <button
            key={a}
            type="button"
            onClick={() => onChange({ textAlign: a })}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md border transition-colors",
              (el.textAlign ?? "left") === a
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                : "border-border/50 bg-background text-muted-foreground hover:bg-accent",
            )}
          >
            <Ic className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>

      <ColorSwatch
        value={el.textColor ?? "#0c0a09"}
        onChange={(v) => onChange({ textColor: v })}
        title="Text color"
      />

      <Sep />

      <TbInput
        className="w-28"
        placeholder="Eyebrow…"
        value={el.eyebrow ?? ""}
        onChange={(e) => onChange({ eyebrow: e.target.value })}
      />
      <TbInput
        className="w-44"
        placeholder="Heading…"
        value={el.heading ?? ""}
        onChange={(e) => onChange({ heading: e.target.value })}
      />
      <TbInput
        className="w-36"
        placeholder="Subheading…"
        value={el.subheading ?? ""}
        onChange={(e) => onChange({ subheading: e.target.value })}
      />
      <TbInput
        className="w-48"
        placeholder="Body text…"
        value={el.body ?? ""}
        onChange={(e) => onChange({ body: e.target.value })}
      />
    </>
  );
}

function ImageContextBar({
  el,
  onChange,
}: {
  el: CanvasElement;
  onChange: (u: Partial<CanvasElement>) => void;
}) {
  return (
    <>
      <TbInput
        className="w-64"
        placeholder="Image URL…"
        value={el.src ?? ""}
        onChange={(e) => onChange({ src: e.target.value })}
      />
      <Sep />
      <div className="flex gap-0.5">
        {(["cover", "contain", "fill"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onChange({ imgFit: f })}
            className={cn(
              "flex h-7 items-center rounded-md border px-2 text-[11px] font-medium capitalize transition-colors",
              (el.imgFit ?? "cover") === f
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                : "border-border/50 bg-background text-muted-foreground hover:bg-accent",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <Sep />
      <TbInput
        className="w-36"
        placeholder="Alt text…"
        value={el.imgAlt ?? ""}
        onChange={(e) => onChange({ imgAlt: e.target.value })}
      />
      <TbInput
        className="w-36"
        placeholder="Caption…"
        value={el.imgCaption ?? ""}
        onChange={(e) => onChange({ imgCaption: e.target.value })}
      />
    </>
  );
}

function VideoContextBar({
  el,
  onChange,
}: {
  el: CanvasElement;
  onChange: (u: Partial<CanvasElement>) => void;
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setLibraryOpen(true)}
        className="flex h-7 items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-50 px-2.5 text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
      >
        <Library className="h-3.5 w-3.5" />
        Thư viện video
      </button>
      <Sep />
      <TbInput
        className="w-72"
        placeholder="YouTube URL or .mp4…"
        value={el.videoUrl ?? ""}
        onChange={(e) => onChange({ videoUrl: e.target.value })}
      />
      <Sep />
      <TbInput
        className="w-52"
        placeholder="Poster image URL…"
        value={el.videoPoster ?? ""}
        onChange={(e) => onChange({ videoPoster: e.target.value })}
      />
      <TbInput
        className="w-36"
        placeholder="Caption…"
        value={el.videoCaption ?? ""}
        onChange={(e) => onChange({ videoCaption: e.target.value })}
      />
      <VideoLibraryModal
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={(url) => onChange({ videoUrl: url })}
      />
    </>
  );
}

function ButtonContextBar({
  el,
  onChange,
}: {
  el: CanvasElement;
  onChange: (u: Partial<CanvasElement>) => void;
}) {
  return (
    <>
      <TbInput
        className="w-32"
        placeholder="Button label…"
        value={el.btnLabel ?? ""}
        onChange={(e) => onChange({ btnLabel: e.target.value })}
      />
      <TbInput
        className="w-44"
        placeholder="Link (href)…"
        value={el.btnHref ?? ""}
        onChange={(e) => onChange({ btnHref: e.target.value })}
      />
      <Sep />
      <div className="flex gap-0.5">
        {(["primary", "outline", "ghost"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange({ btnVariant: v })}
            className={cn(
              "flex h-7 items-center rounded-md border px-2 text-[11px] font-medium capitalize transition-colors",
              (el.btnVariant ?? "primary") === v
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                : "border-border/50 bg-background text-muted-foreground hover:bg-accent",
            )}
          >
            {v}
          </button>
        ))}
      </div>
      <Sep />
      <div className="flex gap-0.5">
        {(
          [
            ["left",   AlignLeft  ],
            ["center", AlignCenter],
            ["right",  AlignRight ],
          ] as const
        ).map(([a, Ic]) => (
          <button
            key={a}
            type="button"
            onClick={() => onChange({ btnAlign: a })}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md border transition-colors",
              (el.btnAlign ?? "center") === a
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                : "border-border/50 bg-background text-muted-foreground hover:bg-accent",
            )}
          >
            <Ic className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
      <Sep />
      <ColorSwatch
        value={el.btnBg ?? "#f59e0b"}
        onChange={(v) => onChange({ btnBg: v })}
        title="Button color"
      />
      <ColorSwatch
        value={el.btnFg ?? "#0c0a09"}
        onChange={(v) => onChange({ btnFg: v })}
        title="Text color"
      />
    </>
  );
}

/* ─── Main context toolbar ───────────────────────────────────────────────── */

export function ContextToolbar({
  element,
  onChange,
}: {
  element: CanvasElement | null;
  onChange: (u: Partial<CanvasElement>) => void;
}) {
  return (
    <div className="flex min-h-[40px] flex-wrap items-center gap-1.5 rounded-xl border border-border/50 bg-background px-3 py-2">
      {!element ? (
        <span className="select-none text-[11px] text-muted-foreground/40">
          Click an element to edit its properties
        </span>
      ) : (
        <>
          {(() => {
            const { label, Icon } = BLOCK_META[element.type];
            return (
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md border border-amber-500/30 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                  <Icon className="h-3 w-3" />
                </div>
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                  {label}
                </span>
              </div>
            );
          })()}
          <Sep />
          {element.type === "text"          && <TextContextBar   el={element} onChange={onChange} />}
          {element.type === "image_gallery" && <ImageContextBar  el={element} onChange={onChange} />}
          {element.type === "video"         && <VideoContextBar  el={element} onChange={onChange} />}
          {element.type === "cta_button"    && <ButtonContextBar el={element} onChange={onChange} />}
        </>
      )}
    </div>
  );
}
