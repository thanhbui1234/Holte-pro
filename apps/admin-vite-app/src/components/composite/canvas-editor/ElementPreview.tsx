import { ImageIcon, Video } from "lucide-react";
import type { CanvasElement } from "@/shared/types";
import { extractYtId } from "./helpers";

export function ElementPreview({ element }: { element: CanvasElement }) {
  const fw =
    element.fontWeight === "medium"
      ? "500"
      : element.fontWeight === "semibold"
        ? "600"
        : element.fontWeight === "bold"
          ? "700"
          : "400";

  switch (element.type) {
    case "text":
      return (
        <div
          className="flex h-full flex-col justify-center gap-1 overflow-hidden px-4 py-3"
          style={{
            textAlign: element.textAlign ?? "left",
            color: element.textColor ?? "inherit",
            fontStyle: element.fontStyle ?? "normal",
            fontFamily:
              element.fontFamily && element.fontFamily !== "inherit"
                ? element.fontFamily
                : undefined,
          }}
        >
          {element.eyebrow && (
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-60">
              {element.eyebrow}
            </p>
          )}
          {element.heading && (
            <p style={{ fontSize: element.fontSize ?? 32, fontWeight: fw, lineHeight: 1.2 }}>
              {element.heading}
            </p>
          )}
          {element.subheading && (
            <p className="text-sm font-medium opacity-70">{element.subheading}</p>
          )}
          {element.body && (
            <p className="line-clamp-3 text-xs opacity-60">{element.body}</p>
          )}
        </div>
      );

    case "image_gallery":
      return element.src ? (
        <img
          src={element.src}
          alt={element.imgAlt ?? ""}
          className="h-full w-full"
          style={{ objectFit: element.imgFit ?? "cover" }}
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/40">
          <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
          <span className="text-[11px] text-muted-foreground/50">No image URL</span>
        </div>
      );

    case "video": {
      const ytId = extractYtId(element.videoUrl ?? "");
      return ytId ? (
        <div className="relative h-full w-full overflow-hidden bg-black">
          <img
            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
            alt="thumbnail"
            className="h-full w-full object-cover opacity-80"
            draggable={false}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-10 w-14 items-center justify-center rounded-xl bg-red-600/90">
              <svg
                className="h-4 w-4 translate-x-0.5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/40">
          <Video className="h-8 w-8 text-muted-foreground/30" />
          <span className="text-[11px] text-muted-foreground/50">No video URL</span>
        </div>
      );
    }

    case "cta_button":
      return (
        <div
          className="flex h-full w-full items-center overflow-hidden"
          style={{
            justifyContent:
              element.btnAlign === "center"
                ? "center"
                : element.btnAlign === "right"
                  ? "flex-end"
                  : "flex-start",
            padding: "0 16px",
          }}
        >
          <span
            className="truncate rounded-lg px-5 py-2.5 text-sm font-semibold shadow"
            style={{
              backgroundColor:
                element.btnVariant === "primary" ? (element.btnBg ?? "#f59e0b") : "transparent",
              color:
                element.btnVariant === "primary"
                  ? (element.btnFg ?? "#0c0a09")
                  : (element.btnBg ?? "#f59e0b"),
              border:
                element.btnVariant === "outline"
                  ? `2px solid ${element.btnBg ?? "#f59e0b"}`
                  : undefined,
            }}
          >
            {element.btnLabel || "Button"}
          </span>
        </div>
      );
  }
}
