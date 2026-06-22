"use client";

import { PageTitleBar } from "@/components/ui/PageTitleBar";
import { REELS } from "@/data/videos";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BlurFade, Skeleton } from "shared-ui";
import type { ReelItem } from "@/types/content";

interface WeddingReelsPageProps {
  reels?: ReelItem[];
}

export function WeddingReelsPage({ reels }: WeddingReelsPageProps) {
  const displayReels = reels ?? REELS;
  return (
    <main>
      <PageTitleBar
        label="Short Films"
        title="Wedding"
        highlightWord="Reels"
      />

      <section
        data-header-theme="light"
        className="bg-white px-5 py-10 md:px-12 md:py-14 lg:px-24 dark:bg-stone-900"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {displayReels.map((reel, index) => (
              <ReelCard key={`${reel.title}-${index}`} reel={reel} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

interface ReelCardProps {
  reel: ReelItem;
  index: number;
}

function ReelCard({ reel, index }: ReelCardProps) {
  const [ref, visible] = useScrollAnimation({ threshold: 0.05 });

  return (
    <BlurFade delay={0.05 + index * 0.04} inView>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="group relative cursor-pointer overflow-hidden rounded-2xl text-stone-700"
        style={{
          aspectRatio: "9/16",
          transform: visible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.95)",
          opacity: visible ? 1 : 0,
          transition: `transform 700ms cubic-bezier(0.25,0.46,0.45,0.94) ${index * 40}ms, opacity 700ms ease ${index * 40}ms`,
        }}
      >
        <Skeleton className="absolute inset-0 rounded-2xl" />

        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-10 w-10 text-stone-600/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.8}
              d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M4 8h11a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"
            />
          </svg>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <p className="text-xs uppercase tracking-widest text-stone-400">
            {reel.location}
          </p>
          <p className="mt-1 text-sm font-light text-white">{reel.title}</p>
        </div>

        <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-stone-300 backdrop-blur-sm">
          {reel.duration}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              className="h-6 w-6 translate-x-0.5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </BlurFade>
  );
}
