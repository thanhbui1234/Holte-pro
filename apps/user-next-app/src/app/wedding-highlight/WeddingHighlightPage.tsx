"use client";

import { PageTitleBar } from "@/components/ui/PageTitleBar";
import { HIGHLIGHT_VIDEOS } from "@/data/videos";
import { BlurFade, HeroVideoDialog } from "shared-ui";
import type { HighlightVideo } from "@/types/content";

/** Build YouTube embed URL from a bare ID or any YouTube URL */
function toEmbedUrl(idOrUrl: string): string {
  if (!idOrUrl) return "";
  if (idOrUrl.includes("youtube.com/embed/")) {
    return idOrUrl.includes("autoplay")
      ? idOrUrl
      : `${idOrUrl}${idOrUrl.includes("?") ? "&" : "?"}autoplay=1`;
  }
  const watchMatch = idOrUrl.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
  }
  // Assume bare YouTube ID
  return `https://www.youtube.com/embed/${idOrUrl}?autoplay=1`;
}

function toThumbnailUrl(idOrUrl: string): string {
  if (!idOrUrl) return "";
  const embedMatch = idOrUrl.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch) return `https://img.youtube.com/vi/${embedMatch[1]}/hqdefault.jpg`;
  const watchMatch = idOrUrl.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://img.youtube.com/vi/${watchMatch[1]}/hqdefault.jpg`;
  // Bare ID
  return `https://img.youtube.com/vi/${idOrUrl}/hqdefault.jpg`;
}

import type { HighlightVideo } from "@/types/content";
import type { SectionConfig } from "@/types/video.types";

interface WeddingHighlightPageProps {
  videos?: HighlightVideo[];
  config?: SectionConfig;
}

export function WeddingHighlightPage({ videos, config }: WeddingHighlightPageProps) {
  const displayVideos = videos ?? HIGHLIGHT_VIDEOS;
  return (
    <main>
      <PageTitleBar
        label={config?.eyebrow ?? "Featured Works"}
        title={config?.titlePrefix ?? "Wedding"}
        highlightWord={config?.titleHighlight ?? "Highlights"}
      />

      <section
        data-header-theme="light"
        className="bg-stone-50 px-5 py-10 md:px-12 md:py-14 lg:px-24 dark:bg-stone-900"
      >
        <div className="mx-auto max-w-7xl">
          {/* Grid — 2 cols mobile, 3 cols desktop */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {displayVideos.map((video, index) => (
              <BlurFade key={video.id} delay={0.05 + index * 0.06} inView>
                <div className="group relative overflow-hidden rounded-xl md:rounded-2xl">
                  <HeroVideoDialog
                    videoSrc={toEmbedUrl(video.id)}
                    thumbnailSrc={toThumbnailUrl(video.id)}
                    thumbnailAlt={video.title}
                    animationStyle="from-center"
                    className="[&>button]:w-full [&_img]:aspect-[4/5] md:[&_img]:aspect-[16/10] [&_img]:w-full [&_img]:object-cover [&_img]:rounded-xl md:[&_img]:rounded-2xl [&_img]:border-0 [&_img]:shadow-none [&>button>div]:scale-75 md:[&>button>div]:scale-100 [&>button>div_div:first-child]:size-16 [&>button>div_div:first-child_div]:size-10 [&>button>div_div:first-child_div_svg]:size-5"
                  />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-6">
                    <h3 className="text-sm font-medium text-white md:text-lg lg:text-xl">
                      {video.title}
                    </h3>
                    <p className="text-xs text-white/60 md:text-sm">
                      {video.subtitle}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
