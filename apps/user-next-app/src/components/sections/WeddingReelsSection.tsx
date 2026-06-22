"use client";

import { useRef } from "react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BlurFade, Highlighter, Skeleton, HeroVideoDialog } from "shared-ui";
import type { ReelItem } from "@/types/content";

const DEFAULT_REELS: ReelItem[] = [
  { title: "First Look", duration: "0:45", location: "Đà Lạt" },
  { title: "The Kiss", duration: "0:30", location: "Hội An" },
  { title: "Golden Hour Portraits", duration: "1:02", location: "Phú Quốc" },
  { title: "Reception Dance", duration: "0:58", location: "TP.HCM" },
  { title: "Flower Girl Moments", duration: "0:37", location: "Hà Nội" },
  { title: "Candid Tears", duration: "0:50", location: "Đà Nẵng" },
  { title: "Ring Exchange", duration: "0:28", location: "Huế" },
  { title: "Late Night Magic", duration: "1:15", location: "Nha Trang" },
];

interface WeddingReelsSectionProps {
  reels?: ReelItem[];
}

export function WeddingReelsSection({ reels = DEFAULT_REELS }: WeddingReelsSectionProps) {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="wedding-reels"
      data-header-theme="dark"
      className="min-h-screen overflow-hidden bg-stone-950 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-12 flex items-end justify-between"
          style={{
            transform: headerVisible ? "translateY(0)" : "translateY(-40px)",
            opacity: headerVisible ? 1 : 0,
            transition: "transform 700ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 700ms ease",
          }}
        >
          <div>
            <BlurFade delay={0.05} inView>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                Short Films
              </p>
            </BlurFade>
            <BlurFade delay={0.15} inView>
              <Link href="/wedding-reels">
                <h2 className="font-title text-5xl font-light tracking-wide text-white md:text-7xl">
                  Wedding{" "}
                  <Highlighter action="underline" color="#ffb900" strokeWidth={2} animationDuration={800} isView>
                    <em className="not-italic font-normal italic">Reels</em>
                  </Highlighter>
                </h2>
              </Link>
            </BlurFade>
            <BlurFade delay={0.25} inView>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-400">
                Short-form wedding content crafted for effortless sharing across social media
              </p>
            </BlurFade>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 text-stone-400 transition-all duration-200 hover:border-amber-400 hover:text-amber-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 text-stone-400 transition-all duration-200 hover:border-amber-400 hover:text-amber-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reels.map((reel, index) => (
            <ReelCard key={`${reel.title}-${index}`} reel={reel} index={index} />
          ))}
        </div>

        <div
          className="mt-6 flex justify-center gap-1.5"
          style={{ opacity: headerVisible ? 1 : 0, transition: "opacity 700ms ease 300ms" }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-0.5 rounded-full transition-all duration-300 ${i === 0 ? "w-8 bg-amber-400" : "w-3 bg-stone-700"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ReelCardProps {
  reel: ReelItem;
  index: number;
}

function ReelCard({ reel, index }: ReelCardProps) {
  const [ref, visible] = useScrollAnimation({ threshold: 0.05 });

  const embedUrl = reel.youtubeUrl
    ? reel.youtubeUrl.includes("embed")
      ? `${reel.youtubeUrl}${reel.youtubeUrl.includes("?") ? "&" : "?"}autoplay=1`
      : `https://www.youtube.com/embed/${reel.youtubeUrl.split("v=")[1]?.split("&")[0] ?? ""}?autoplay=1`
    : "";

  const youtubeId = reel.youtubeUrl
    ? (reel.youtubeUrl.match(/embed\/([^?&/]+)/) ??
       reel.youtubeUrl.match(/[?&]v=([^&]+)/) ??
       [])[1] ?? ""
    : "";
  const thumbnailSrc = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : "";

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl text-stone-700"
      style={{
        width: "220px",
        aspectRatio: "9/16",
        transform: visible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.95)",
        opacity: visible ? 1 : 0,
        transition: `transform 700ms cubic-bezier(0.25,0.46,0.45,0.94) ${index * 60}ms, opacity 700ms ease ${index * 60}ms`,
      }}
    >
      {embedUrl && thumbnailSrc ? (
        <div className="absolute inset-0">
          <HeroVideoDialog
            videoSrc={embedUrl}
            thumbnailSrc={thumbnailSrc}
            thumbnailAlt={reel.title}
            animationStyle="from-center"
            className="h-full [&>button]:w-full [&>button]:h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:object-center [&_img]:rounded-2xl [&_img]:border-0 [&_img]:shadow-none [&>button>div]:scale-75 [&>button>div_div:first-child]:size-14 [&>button>div_div:first-child_div]:size-9 [&>button>div_div:first-child_div_svg]:size-5"
          />
        </div>
      ) : (
        <>
          <Skeleton className="absolute inset-0 rounded-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-10 w-10 text-stone-600/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M4 8h11a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
            </svg>
          </div>
        </>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <BlurFade delay={0.05 + index * 0.04} inView>
          <p className="text-xs uppercase tracking-widest text-stone-400">{reel.location}</p>
          <p className="mt-1 text-sm font-light text-white">{reel.title}</p>
        </BlurFade>
      </div>

      <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-stone-300 backdrop-blur-sm">
        {reel.duration}
      </div>
    </div>
  );
}
