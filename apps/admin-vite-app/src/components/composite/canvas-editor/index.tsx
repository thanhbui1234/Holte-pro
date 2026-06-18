import { useCallback, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import {
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  ArrowUpDown,
  Copy,
  Grid3X3,
  Minus,
  MoveDown,
  MoveUp,
  Plus,
  Trash2,
  ZoomIn,
} from "lucide-react";
import type { BlockType, CanvasElement, CustomSection } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { BLOCK_DEFAULTS, BLOCK_META, CANVAS_W, SNAP, ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from "./constants";
import { buildBgStyle, buildElementStyle, makeId } from "./helpers";
import { BackgroundPanel } from "./BackgroundPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { ElementPreview } from "./ElementPreview";
import { ContextToolbar } from "./ContextToolbar";

interface CanvasEditorProps {
  elements: CanvasElement[];
  canvasHeight: number;
  section: CustomSection;
  onElementsChange: (elements: CanvasElement[]) => void;
  onHeightChange: (h: number) => void;
  onSectionChange: (updates: Partial<CustomSection>) => void;
}

export function CanvasEditor({
  elements,
  canvasHeight,
  section,
  onElementsChange,
  onHeightChange,
  onSectionChange,
}: CanvasEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snap, setSnap] = useState(true);
  const [userZoom, setUserZoom] = useState(1.0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);

  /* Auto-fit scale from container width */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setBaseScale(entry.contentRect.width / CANVAS_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const effectiveScale = baseScale * userZoom;

  /* Keyboard shortcuts */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = document.activeElement?.tagName;
      const isEditing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (e.key === "Escape") { setSelectedId(null); return; }
      if (isEditing) return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) removeElement(selectedId);
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedId) {
        e.preventDefault();
        duplicateElement(selectedId);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, elements]);

  const selectedEl = elements.find((e) => e.id === selectedId) ?? null;

  /* ── Element operations ── */

  function addElement(type: BlockType) {
    const def = BLOCK_DEFAULTS[type];
    const maxY = elements.length > 0 ? Math.max(...elements.map((e) => e.y + e.h)) : 80;
    const el: CanvasElement = {
      id: makeId(),
      ...def,
      x: Math.round((CANVAS_W / 2 - def.w / 2) / SNAP) * SNAP,
      y: Math.round(maxY / SNAP) * SNAP + 24,
      zIndex: (elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex)) : 0) + 1,
    };
    onElementsChange([...elements, el]);
    setSelectedId(el.id);
  }

  function updateElement(id: string, updates: Partial<CanvasElement>) {
    onElementsChange(elements.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }

  function removeElement(id: string) {
    onElementsChange(elements.filter((e) => e.id !== id));
    setSelectedId(null);
  }

  function duplicateElement(id: string) {
    const src = elements.find((e) => e.id === id);
    if (!src) return;
    const clone: CanvasElement = {
      ...src,
      id: makeId(),
      x: src.x + 24,
      y: src.y + 24,
      zIndex: Math.max(...elements.map((e) => e.zIndex)) + 1,
    };
    onElementsChange([...elements, clone]);
    setSelectedId(clone.id);
  }

  function bringToFront(id: string) {
    updateElement(id, { zIndex: Math.max(...elements.map((e) => e.zIndex)) + 1 });
  }

  function sendToBack(id: string) {
    updateElement(id, { zIndex: Math.min(...elements.map((e) => e.zIndex)) - 1 });
  }

  function alignElement(
    id: string,
    dir: "left" | "centerH" | "right" | "top" | "centerV" | "bottom",
  ) {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    const updates: Partial<CanvasElement> = {};
    if      (dir === "left")    updates.x = 0;
    else if (dir === "centerH") updates.x = Math.round((CANVAS_W - el.w) / 2);
    else if (dir === "right")   updates.x = CANVAS_W - el.w;
    else if (dir === "top")     updates.y = 0;
    else if (dir === "centerV") updates.y = Math.round((canvasHeight - el.h) / 2);
    else if (dir === "bottom")  updates.y = canvasHeight - el.h;
    updateElement(id, updates);
  }

  const zoom = useCallback((delta: number) => {
    setUserZoom((v) => Math.round(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, v + delta)) * 100) / 100);
  }, []);

  const snapGrid: [number, number] = snap ? [SNAP, SNAP] : [1, 1];

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main toolbar ── */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border/60 bg-background px-3 py-2">
        {/* Add elements */}
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Add
        </span>
        {(["text", "image_gallery", "video", "cta_button"] as BlockType[]).map((type) => {
          const { label, Icon } = BLOCK_META[type];
          return (
            <button
              key={type}
              type="button"
              onClick={() => addElement(type)}
              className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-amber-500/40 hover:bg-amber-50/50 hover:text-amber-700 dark:hover:bg-amber-500/5 dark:hover:text-amber-300"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}

        <span className="mx-1 h-4 w-px bg-border/60" />

        {/* Snap */}
        <button
          type="button"
          onClick={() => setSnap((v) => !v)}
          title="Snap to grid"
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
            snap
              ? "border-amber-500/40 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
              : "border-border/50 text-muted-foreground hover:bg-accent",
          )}
        >
          <Grid3X3 className="h-3.5 w-3.5" />
          Snap
        </button>

        <span className="mx-1 h-4 w-px bg-border/60" />

        {/* Zoom */}
        <div className="flex items-center gap-0.5 rounded-lg border border-border/50 bg-muted/20 px-1 py-0.5">
          <button
            type="button"
            onClick={() => zoom(-ZOOM_STEP)}
            disabled={userZoom <= ZOOM_MIN}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-12 text-center font-mono text-[11px] text-muted-foreground">
            {Math.round(effectiveScale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => zoom(ZOOM_STEP)}
            disabled={userZoom >= ZOOM_MAX}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30"
          >
            <Plus className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setUserZoom(1)}
            title="Fit to container"
            className="ml-0.5 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ZoomIn className="h-3 w-3" />
          </button>
        </div>

        <span className="mx-1 h-4 w-px bg-border/60" />

        {/* Canvas height */}
        <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-50/60 px-2.5 py-1 dark:bg-amber-500/10">
          <ArrowUpDown className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-200">
            Height
          </span>
          <input
            type="number"
            min={200}
            max={5000}
            step={SNAP}
            value={canvasHeight}
            onChange={(e) => onHeightChange(Number(e.target.value))}
            className="w-16 rounded-md border border-amber-300/60 bg-white px-2 py-0.5 font-mono text-xs font-semibold text-amber-900 outline-none focus:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100"
          />
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">px</span>
        </div>

        {/* Selected element actions */}
        {selectedId && (
          <>
            <span className="mx-1 h-4 w-px bg-border/60" />

            <button
              type="button"
              onClick={() => duplicateElement(selectedId)}
              title="Duplicate (⌘D)"
              className="flex items-center gap-1.5 rounded-lg border border-border/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>

            <div className="flex items-center gap-0.5 rounded-lg border border-border/50 bg-muted/20 px-1 py-0.5">
              <button
                type="button"
                onClick={() => bringToFront(selectedId)}
                title="Bring to front"
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <MoveUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => sendToBack(selectedId)}
                title="Send to back"
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <MoveDown className="h-3 w-3" />
              </button>
            </div>

            {/* Align */}
            <div className="flex items-center gap-0.5 rounded-lg border border-border/50 bg-muted/20 px-1 py-0.5">
              {(
                [
                  ["left",    AlignStartHorizontal,           "Align left"      ],
                  ["centerH", AlignHorizontalDistributeCenter, "Center horizontal"],
                  ["right",   AlignEndHorizontal,             "Align right"     ],
                ] as const
              ).map(([dir, Icon, title]) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => alignElement(selectedId, dir)}
                  title={title}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-3 w-3" />
                </button>
              ))}
              <span className="h-3 w-px bg-border/60" />
              {(
                [
                  ["top",     AlignStartVertical,           "Align top"      ],
                  ["centerV", AlignVerticalDistributeCenter, "Center vertical"],
                  ["bottom",  AlignEndVertical,             "Align bottom"   ],
                ] as const
              ).map(([dir, Icon, title]) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => alignElement(selectedId, dir)}
                  title={title}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-3 w-3" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => removeElement(selectedId)}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </>
        )}
      </div>

      {/* ── Context toolbar (always rendered — prevents layout shift) ── */}
      <ContextToolbar
        element={selectedEl}
        onChange={selectedEl ? (u) => updateElement(selectedEl.id, u) : () => {}}
      />

      {/* ── Canvas + side panel ── */}
      <div className="flex gap-3" style={{ minHeight: "calc(100vh - 320px)" }}>
        {/* Canvas scroll area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto rounded-xl border border-border/60 bg-muted/20"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedId(null); }}
        >
          <div
            style={{
              width: Math.max(CANVAS_W * effectiveScale, 1),
              height: Math.max(canvasHeight * effectiveScale, 1),
              position: "relative",
            }}
          >
            <div
              style={{
                width: CANVAS_W,
                height: canvasHeight,
                transform: `scale(${effectiveScale})`,
                transformOrigin: "top left",
                position: "absolute",
                inset: 0,
                backgroundImage: snap
                  ? "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)"
                  : undefined,
                backgroundSize: snap ? `${SNAP * 4}px ${SNAP * 4}px` : undefined,
                ...buildBgStyle(section),
              }}
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedId(null); }}
            >
              {elements.map((el) => (
                <Rnd
                  key={el.id}
                  scale={effectiveScale}
                  position={{ x: el.x, y: el.y }}
                  size={{ width: el.w, height: el.h }}
                  dragGrid={snapGrid}
                  resizeGrid={snapGrid}
                  bounds="parent"
                  style={{ zIndex: el.zIndex }}
                  onMouseDown={() => setSelectedId(el.id)}
                  onDragStop={(_, d) => updateElement(el.id, { x: d.x, y: d.y })}
                  onResizeStop={(_, __, ref, ___, pos) =>
                    updateElement(el.id, {
                      w: parseInt(ref.style.width),
                      h: parseInt(ref.style.height),
                      x: pos.x,
                      y: pos.y,
                    })
                  }
                  enableResizing
                  handleClasses={{
                    topRight:    "!h-3 !w-3 !rounded-full !bg-amber-500 !border-2 !border-white",
                    bottomRight: "!h-3 !w-3 !rounded-full !bg-amber-500 !border-2 !border-white",
                    bottomLeft:  "!h-3 !w-3 !rounded-full !bg-amber-500 !border-2 !border-white",
                    topLeft:     "!h-3 !w-3 !rounded-full !bg-amber-500 !border-2 !border-white",
                  }}
                >
                  <div
                    className={cn(
                      "h-full w-full overflow-hidden",
                      selectedId === el.id
                        ? "ring-2 ring-amber-500 ring-offset-0"
                        : "ring-1 ring-transparent ring-offset-0 hover:ring-border",
                    )}
                    style={{
                      cursor: "move",
                      borderRadius: el.borderRadius ?? 0,
                      ...buildElementStyle(el),
                    }}
                  >
                    <ElementPreview element={el} />
                  </div>
                </Rnd>
              ))}

              {elements.length === 0 && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-white/30 bg-black/10 px-5 py-3 backdrop-blur-sm">
                    <Plus className="h-4 w-4 text-current opacity-50" />
                    <span className="text-sm opacity-50">Click an element above to add</span>
                  </div>
                </div>
              )}

              {/* Height boundary indicator */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0"
                style={{ zIndex: 9999 }}
              >
                <div className="border-b-2 border-dashed border-amber-500/60" />
                <div className="flex items-center justify-end gap-1 bg-amber-500/10 px-3 py-1 backdrop-blur-sm">
                  <ArrowUpDown className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    {canvasHeight}px
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-80 shrink-0 overflow-y-auto rounded-xl border border-border/60 bg-background">
          {selectedEl ? (
            <PropertiesPanel
              element={selectedEl}
              onChange={(u) => updateElement(selectedEl.id, u)}
              onDelete={() => removeElement(selectedEl.id)}
              onDuplicate={() => duplicateElement(selectedEl.id)}
            />
          ) : (
            <BackgroundPanel section={section} onChange={onSectionChange} />
          )}
        </div>
      </div>
    </div>
  );
}
