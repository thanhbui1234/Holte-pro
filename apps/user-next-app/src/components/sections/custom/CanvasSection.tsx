"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomSection } from "shared-ui/canvas";
import { buildBgStyle, buildElementStyle, buildGoogleFontsUrl } from "shared-ui/canvas";
import { CanvasElementRenderer } from "./CanvasElementRenderer";
import { getThemeFromBgColor } from "@/lib/theme";

const CANVAS_W = 1200;

export function CanvasSection({ section }: { section: CustomSection }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / CANVAS_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Inject Google Fonts for any custom font families used in this section
  useEffect(() => {
    const families = [
      ...new Set(
        section.canvasElements
          .map((e) => e.fontFamily)
          .filter((f): f is string => !!f && f !== "inherit"),
      ),
    ];
    if (families.length === 0) return;
    const id = `canvas-fonts-${section.id}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = buildGoogleFontsUrl(families);
    document.head.appendChild(link);
  }, [section.id, section.canvasElements]);

  const sorted = [...section.canvasElements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden"
      data-header-theme={getThemeFromBgColor(section.backgroundColor, "light")}
    >
      {/* Spacer: gives container correct height so layout flow works */}
      <div style={{ height: section.canvasHeight * scale }} />

      {/* Canvas: always 1200px wide, scaled down via CSS transform */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: CANVAS_W,
          height: section.canvasHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          ...buildBgStyle(section),
        }}
      >
        {sorted.map((el) => (
          <div
            key={el.id}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              width: el.w,
              height: el.h,
              zIndex: el.zIndex,
              overflow: "hidden",
              ...buildElementStyle(el),
            }}
          >
            <CanvasElementRenderer element={el} />
          </div>
        ))}
      </div>
    </div>
  );
}
