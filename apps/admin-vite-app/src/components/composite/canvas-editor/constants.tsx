import { ImageIcon, MousePointerClick, Text, Video } from "lucide-react";
import type { BlockType, CanvasElement } from "@/shared/types";

export const CANVAS_W = 1200;
export const SNAP = 8;
export const ZOOM_STEP = 0.1;
export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 2.5;

export const BLOCK_META: Record<
  BlockType,
  { label: string; Icon: React.FC<{ className?: string }> }
> = {
  text:          { label: "Text",   Icon: Text             },
  image_gallery: { label: "Image",  Icon: ImageIcon        },
  video:         { label: "Video",  Icon: Video            },
  cta_button:    { label: "Button", Icon: MousePointerClick },
};

const BASE_APPEARANCE: Pick<
  CanvasElement,
  | "opacity"
  | "borderRadius"
  | "shadowEnabled"
  | "shadowX"
  | "shadowY"
  | "shadowBlur"
  | "shadowColor"
> = {
  opacity: 100,
  borderRadius: 0,
  shadowEnabled: false,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 12,
  shadowColor: "rgba(0,0,0,0.20)",
};

export const BLOCK_DEFAULTS: Record<
  BlockType,
  Omit<CanvasElement, "id" | "x" | "y" | "zIndex">
> = {
  text: {
    ...BASE_APPEARANCE,
    type: "text",
    w: 500,
    h: 180,
    heading: "New heading",
    body: "Click to edit this text block.",
    eyebrow: "",
    subheading: "",
    textAlign: "left",
    textColor: "#0c0a09",
    fontSize: 32,
    fontWeight: "bold",
    fontStyle: "normal",
    fontFamily: "inherit",
  },
  image_gallery: {
    ...BASE_APPEARANCE,
    type: "image_gallery",
    w: 400,
    h: 300,
    src: "",
    imgAlt: "",
    imgCaption: "",
    imgFit: "cover",
  },
  video: {
    ...BASE_APPEARANCE,
    type: "video",
    w: 560,
    h: 315,
    videoUrl: "",
    videoPoster: "",
    videoCaption: "",
  },
  cta_button: {
    ...BASE_APPEARANCE,
    type: "cta_button",
    w: 200,
    h: 56,
    btnLabel: "Click here",
    btnHref: "/",
    btnVariant: "primary",
    btnAlign: "center",
    btnBg: "#f59e0b",
    btnFg: "#0c0a09",
  },
};

export const inputCls =
  "w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30";
