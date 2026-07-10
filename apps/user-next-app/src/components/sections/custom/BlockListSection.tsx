import Image from "next/image";
import type { ContentBlock, CustomSection } from "shared-ui/canvas";
import { extractYtId, buildBgStyle } from "shared-ui/canvas";
import { getThemeFromBgColor } from "@/lib/theme";

const PADDING_CLS: Record<CustomSection["paddingY"], string> = {
  sm: "py-8",
  md: "py-16",
  lg: "py-24",
  xl: "py-32",
};

function TextBlockRenderer({ block }: { block: Extract<ContentBlock, { type: "text" }> }) {
  return (
    <div className="mx-auto max-w-3xl" style={{ textAlign: block.alignment }}>
      {block.eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500">
          {block.eyebrow}
        </p>
      )}
      {block.heading && (
        <h2 className="text-3xl font-bold leading-tight md:text-4xl">{block.heading}</h2>
      )}
      {block.subheading && (
        <p className="mt-3 text-lg font-medium opacity-70">{block.subheading}</p>
      )}
      {block.body && (
        <p className="mt-4 leading-relaxed opacity-60">{block.body}</p>
      )}
    </div>
  );
}

function ImageGalleryBlockRenderer({ block }: { block: Extract<ContentBlock, { type: "image_gallery" }> }) {
  const colCls =
    block.columns === 2
      ? "grid-cols-2"
      : block.columns === 4
        ? "grid-cols-2 md:grid-cols-4"
        : "grid-cols-2 md:grid-cols-3";
  return (
    <div className={`grid gap-3 ${colCls}`}>
      {block.images.map((img) => (
        <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={img.src}
            alt={img.alt || ""}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
          {img.caption && (
            <p className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5 text-xs text-white">
              {img.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function VideoBlockRenderer({ block }: { block: Extract<ContentBlock, { type: "video" }> }) {
  const ytId = extractYtId(block.url);
  return (
    <div className="overflow-hidden rounded-2xl">
      {ytId ? (
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={block.caption || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : block.url ? (
        <video src={block.url} poster={block.poster} controls className="w-full rounded-2xl" />
      ) : null}
      {block.caption && (
        <p className="mt-2 text-center text-sm opacity-50">{block.caption}</p>
      )}
    </div>
  );
}

function CtaButtonBlockRenderer({ block }: { block: Extract<ContentBlock, { type: "cta_button" }> }) {
  const alignCls =
    block.alignment === "center"
      ? "justify-center"
      : block.alignment === "right"
        ? "justify-end"
        : "justify-start";
  return (
    <div className={`flex ${alignCls}`}>
      <a
        href={block.href}
        className={`rounded-xl px-8 py-3 text-sm font-semibold shadow-md transition-opacity hover:opacity-90 ${
          block.variant === "primary"
            ? "bg-amber-500 text-stone-950"
            : block.variant === "outline"
              ? "border-2 border-amber-500 text-amber-500"
              : "text-amber-500"
        }`}
      >
        {block.label}
      </a>
    </div>
  );
}

export function BlockListSection({ section }: { section: CustomSection }) {
  return (
    <section
      className={`w-full ${PADDING_CLS[section.paddingY ?? "md"]}`}
      style={buildBgStyle(section)}
      data-header-theme={getThemeFromBgColor(section.backgroundColor, "light")}
    >
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-8">
        {section.blocks.map((block) => (
          <div key={block.id}>
            {block.type === "text" && <TextBlockRenderer block={block} />}
            {block.type === "image_gallery" && <ImageGalleryBlockRenderer block={block} />}
            {block.type === "video" && <VideoBlockRenderer block={block} />}
            {block.type === "cta_button" && <CtaButtonBlockRenderer block={block} />}
          </div>
        ))}
      </div>
    </section>
  );
}
