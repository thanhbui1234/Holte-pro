"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BlurFade, HeroVideoDialog, Highlighter } from "shared-ui";
import type { HighlightVideo } from "@/types/content";

const DEFAULT_VIDEOS: HighlightVideo[] = [
  { id: "SlQR9iu09bQ", title: "Eternal Vows", subtitle: "Đà Lạt · Spring 2024" },
  { id: "abPmZCZZrFA", title: "Golden Hour", subtitle: "Hội An · Summer 2024" },
  { id: "zoEtcR5EW08", title: "Garden of Love", subtitle: "Hà Nội · Autumn 2023" },
  { id: "LggaymnzDjc", title: "Into the Wild", subtitle: "Phú Quốc · Winter 2024" },
  { id: "psZ1g9fMfeo", title: "Blossom", subtitle: "Đà Nẵng · Spring 2023" },
  { id: "32sYGCOYJUM", title: "Midnight Blue", subtitle: "TP.HCM · Summer 2023" },
];

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

interface WeddingHighlightSectionProps {
  videos?: HighlightVideo[];
  backgroundColor?: string;
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
}

export function WeddingHighlightSection({
  videos = DEFAULT_VIDEOS,
  backgroundColor,
  eyebrow = "Featured Works",
  titlePrefix = "Wedding",
  titleHighlight = "Highlights",
  description = "Your love story, distilled into a cinematic masterpiece",
}: WeddingHighlightSectionProps) {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const totalSlides = videos.length;

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setActiveIndex((prev) => (prev + 1) % totalSlides);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const goTo = (index: number) => {
    setActiveIndex(((index % totalSlides) + totalSlides) % totalSlides);
  };

  const getDiff = (index: number) => {
    let diff = index - activeIndex;
    if (diff > totalSlides / 2) diff -= totalSlides;
    if (diff < -totalSlides / 2) diff += totalSlides;
    return diff;
  };

  return (
    <section
      id="wedding-highlight"
      data-header-theme="light"
      className="min-h-screen bg-stone-50 px-5 py-20 dark:bg-stone-900"
      style={{ backgroundColor: backgroundColor || undefined }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-12 px-5 md:mb-16 md:px-12 lg:px-24"
          style={{
            transform: headerVisible ? "translateY(0)" : "translateY(-30px)",
            opacity: headerVisible ? 1 : 0,
            transition: "transform 700ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 700ms ease",
          }}
        >
          <BlurFade delay={0.05} inView>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400 dark:text-amber-400">
              {eyebrow}
            </p>
          </BlurFade>
          <BlurFade delay={0.15} inView>
            <Link href="/wedding-highlight">
              <h2 className="font-title text-5xl font-light tracking-wide text-stone-900 md:text-7xl dark:text-stone-100">
                {titlePrefix}{" "}
                <Highlighter action="underline" color="#ffb900" strokeWidth={2} animationDuration={800} isView>
                  <em className="not-italic font-normal italic">{titleHighlight}</em>
                </Highlighter>
              </h2>
            </Link>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-500 dark:text-stone-400">
              {description}
            </p>
          </BlurFade>
        </div>

        <div className="hidden md:block">
          <div className="relative mx-auto" style={{ maxWidth: "900px", height: "560px" }}>
            {videos.map((video, index) => {
              const diff = getDiff(index);
              const absDiff = Math.abs(diff);
              const scale = 1 - absDiff * 0.05;
              const translateX = diff * 140;
              const zIndex = 20 - Math.round(absDiff * 5);
              const rotate = diff * -1.5;

              return (
                <div
                  key={video.id}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex, pointerEvents: absDiff < 0.5 ? "auto" : "none" }}
                >
                  <div
                    className="group relative w-full overflow-hidden rounded-2xl shadow-2xl"
                    style={{
                      transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
                      opacity: absDiff > 2.5 ? 0 : 1,
                      transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
                    }}
                  >
                    <HeroVideoDialog
                      videoSrc={getYouTubeEmbedUrl(video.id)}
                      thumbnailSrc={getYouTubeThumbnail(video.id)}
                      thumbnailAlt={video.title}
                      animationStyle="from-center"
                      onOpenChange={setIsPaused}
                      className="[&>button]:w-full [&_img]:aspect-[16/10] [&_img]:w-full [&_img]:object-cover [&_img]:rounded-2xl [&_img]:border-0 [&_img]:shadow-none"
                    />
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 md:p-8"
                      style={{ opacity: absDiff < 0.5 ? 1 : 0, transition: "opacity 0.4s ease" }}
                    >
                      <h3 className="text-lg font-medium text-white lg:text-2xl">{video.title}</h3>
                      <p className="text-sm text-white/70">{video.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-4 top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 dark:bg-stone-800/80"
              aria-label="Previous slide"
            >
              <svg className="h-5 w-5 text-stone-700 dark:text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-4 top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 dark:bg-stone-800/80"
              aria-label="Next slide"
            >
              <svg className="h-5 w-5 text-stone-700 dark:text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {videos.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${index === activeIndex ? "w-8 bg-amber-500" : "w-1.5 bg-stone-300 dark:bg-stone-600"}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:hidden">
          {videos.map((video) => (
            <div key={video.id} className="group relative overflow-hidden rounded-xl">
              <HeroVideoDialog
                videoSrc={getYouTubeEmbedUrl(video.id)}
                thumbnailSrc={getYouTubeThumbnail(video.id)}
                thumbnailAlt={video.title}
                animationStyle="from-center"
                className="[&>button]:w-full [&_img]:aspect-[4/5] [&_img]:w-full [&_img]:object-cover [&_img]:rounded-xl [&_img]:border-0 [&_img]:shadow-none [&>button>div]:scale-75 [&>button>div_div:first-child]:size-16 [&>button>div_div:first-child_div]:size-10 [&>button>div_div:first-child_div_svg]:size-5"
              />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <h3 className="text-sm font-medium text-white">{video.title}</h3>
                <p className="text-xs text-white/60">{video.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
