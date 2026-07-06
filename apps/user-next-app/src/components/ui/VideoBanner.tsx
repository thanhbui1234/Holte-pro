"use client";

import { useEffect, useState, useCallback } from "react";
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

// ---------------------------------------------------------------------------
// Cinematic Loading Overlay
// ---------------------------------------------------------------------------

function CinematicLoader({ visible }: { visible: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[18] flex items-center justify-center overflow-hidden bg-stone-950 transition-opacity duration-[1500ms] ease-in-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Ambient gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.06)_0%,_transparent_70%)]" />

      {/* Pulsing concentric rings */}
      <div className="absolute flex items-center justify-center">
        {[120, 180, 260].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full border border-amber-400/10"
            style={{
              width: size,
              height: size,
              animation: `cinematic-pulse ${2.5 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Horizontal shimmer line */}
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 overflow-hidden">
        <div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
          style={{ animation: "cinematic-shimmer 2.5s ease-in-out infinite" }}
        />
      </div>

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-amber-400/20"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 20}%`,
            animation: `cinematic-float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* Corner accents */}
      <div className="absolute left-8 top-8 h-12 w-12 border-l border-t border-amber-400/15" />
      <div className="absolute right-8 top-8 h-12 w-12 border-r border-t border-amber-400/15" />
      <div className="absolute bottom-8 left-8 h-12 w-12 border-b border-l border-amber-400/15" />
      <div className="absolute bottom-8 right-8 h-12 w-12 border-b border-r border-amber-400/15" />

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes cinematic-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.08; }
        }
        @keyframes cinematic-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes cinematic-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Banner Component
// ---------------------------------------------------------------------------

export function VideoBanner(props: Partial<BannerConfig>) {
  const { videoSrc, mobileVideo, logoSrc, scrollTargetId } = { ...DEFAULTS, ...props };

  const [activeVideoSrc, setActiveVideoSrc] = useState(videoSrc);

  useEffect(() => {
    if (!mobileVideo) return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setActiveVideoSrc(e.matches ? mobileVideo : videoSrc);
    };

    handleChange(mediaQuery);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [videoSrc, mobileVideo]);

  // Blob URLs are session-local to the admin app — fall back to the default logo
  const resolvedLogoSrc =
    !logoSrc || isBlobUrl(logoSrc) ? DEFAULT_LOGO_SRC : logoSrc;

  const isYouTube = isYouTubeUrl(activeVideoSrc);
  const embedUrl = isYouTube ? toYouTubeBackgroundEmbed(activeVideoSrc) : null;

  // ---------------------------------------------------------------------------
  // Loading states
  // ---------------------------------------------------------------------------

  // True while the video/iframe is still loading
  const [isLoading, setIsLoading] = useState(true);

  // Overlay that hides YouTube's initial title/channel flash.
  const [overlayVisible, setOverlayVisible] = useState(isYouTube);

  // Logo fade-in animation after 3 seconds
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    if (!isYouTube) return;
    const timer = setTimeout(() => setOverlayVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [isYouTube]);

  useEffect(() => {
    const timer = setTimeout(() => setLogoVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // For YouTube: dismiss the loader after a safe timeout (iframe has no reliable "loaded" event for video playback)
  useEffect(() => {
    if (!isYouTube) return;
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, [isYouTube]);

  // For native <video>: dismiss loader when the video starts playing
  const handleVideoCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <section
      id="home"
      data-header-theme="dark"
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* ── Cinematic loading overlay ────────────────────────────────────── */}
      <CinematicLoader visible={isLoading} />

      {/* ── Logo overlay ─────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center px-6 transition-opacity duration-[2000ms] ease-in-out"
        style={{ opacity: logoVisible ? 1 : 0 }}
      >
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

      {/* ── Background media ──────────────────────────────────────────── */}
      {isYouTube && embedUrl ? (
        <iframe
          src={embedUrl}
          title="Banner background video"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{
            border: "none",
            width: "177.78vh",
            height: "56.25vw",
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
          key={activeVideoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={handleVideoCanPlay}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        >
          <source src={activeVideoSrc} type="video/mp4" />
        </video>
      )}
    </section>
  );
}
