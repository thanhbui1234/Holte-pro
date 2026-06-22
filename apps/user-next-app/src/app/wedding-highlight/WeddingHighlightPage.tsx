"use client";

import { PageTitleBar } from "@/components/ui/PageTitleBar";
import {
  HIGHLIGHT_VIDEOS,
  getYouTubeThumbnail,
  getYouTubeEmbedUrl,
} from "@/data/videos";
import { BlurFade, HeroVideoDialog } from "shared-ui";
import type { HighlightVideo } from "@/types/content";

interface WeddingHighlightPageProps {
  videos?: HighlightVideo[];
}

export function WeddingHighlightPage({ videos }: WeddingHighlightPageProps) {
  const displayVideos = videos ?? HIGHLIGHT_VIDEOS;
  return (
    <main>
      <PageTitleBar
        label="Featured Works"
        title="Wedding"
        highlightWord="Highlights"
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
                    videoSrc={getYouTubeEmbedUrl(video.id)}
                    thumbnailSrc={getYouTubeThumbnail(video.id)}
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
