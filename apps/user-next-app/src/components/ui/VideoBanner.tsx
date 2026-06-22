"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { BannerConfig } from "@/types/content";

const DEFAULT_LOGO_SRC = "/images/logo-white-slogan.png";
const DEFAULT_VIDEO_SRC = "/images/demo/1301_REELS_JOW.mov";

const DEFAULTS: BannerConfig = {
  videoSrc: DEFAULT_VIDEO_SRC,
  logoSrc: DEFAULT_LOGO_SRC,
  scrollTargetId: "about",
};

/** Returns true when the URL is a YouTube embed / watch link */
function isYouTubeUrl(src: string): boolean {
  return /youtube\.com|youtu\.be/.test(src);
}

/** Returns true when the URL is a blob: URL (only valid in the originating browser tab) */
function isBlobUrl(src: string): boolean {
  return src.startsWith("blob:");
}

/** Converts any YouTube URL to an embed URL with autoplay + mute for background use */
function toYouTubeBackgroundEmbed(url: string): string {
  // Already an embed URL — just append params
  if (url.includes("youtube.com/embed/")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}autoplay=1&mute=1&loop=1&controls=0&playsinline=1&modestbranding=1&rel=0`;
  }
  // watch?v= URL
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&modestbranding=1&rel=0&playlist=${watchMatch[1]}`;
  }
  // youtu.be/<id>
  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&modestbranding=1&rel=0&playlist=${shortMatch[1]}`;
  }
  return url;
}

export function VideoBanner(props: Partial<BannerConfig>) {
  const { videoSrc, logoSrc, scrollTargetId } = { ...DEFAULTS, ...props };

  // Blob URLs are session-local to the admin app — fall back to the default logo
  const resolvedLogoSrc =
    !logoSrc || isBlobUrl(logoSrc) ? DEFAULT_LOGO_SRC : logoSrc;

  const isYouTube = isYouTubeUrl(videoSrc);
  const embedUrl = isYouTube ? toYouTubeBackgroundEmbed(videoSrc) : null;

  // Overlay that hides YouTube's initial title/channel flash.
  // Fades out after YouTube has had time to hide its own UI (~2.5s).
  const [overlayVisible, setOverlayVisible] = useState(isYouTube);
  useEffect(() => {
    if (!isYouTube) return;
    const timer = setTimeout(() => setOverlayVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [isYouTube]);

  return (
    <section
      id="home"
      data-header-theme="dark"
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* Logo overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
        <Image
          src={resolvedLogoSrc}
          alt="JOW Film"
          width={400}
          height={200}
          className="w-[80vw] max-w-[360px] object-contain sm:max-w-[420px] md:max-w-[500px] lg:max-w-[1000px]"
          priority
        />
      </div>

      {/* Scroll hint */}
      <button
        onClick={() =>
          document
            .querySelector(`#${scrollTargetId}`)
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce"
        aria-label="Scroll to about section"
      >
        <ChevronDown className="h-7 w-7 text-white/60 sm:h-8 sm:w-8" />
      </button>

      {/* Dark scrim so the logo stays readable */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/40" />

      {/* YouTube initial-flash overlay — covers title/channel on first load */}
      {isYouTube && (
        <div
          className="pointer-events-none absolute inset-0 z-[15] bg-black transition-opacity duration-1000"
          style={{ opacity: overlayVisible ? 1 : 0 }}
        />
      )}

      {/* Background media — YouTube iframe or local video file */}
      {isYouTube && embedUrl ? (
        <iframe
          src={embedUrl}
          title="Banner background video"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          className="pointer-events-none absolute inset-0 h-full w-full"
          /**
           * YouTube iframes don't fill 16:9 containers at all viewport ratios.
           * We scale up the iframe so the video covers the full screen (similar
           * to object-fit: cover).
           */
          style={{
            border: "none",
            width: "177.78vh", // 16/9 * 100vh
            height: "56.25vw", // 9/16 * 100vw
            minWidth: "100%",
            minHeight: "100%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
          }}
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </section>
  );
}
