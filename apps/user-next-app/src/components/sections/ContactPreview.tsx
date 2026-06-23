"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BlurFade, Highlighter } from "shared-ui";
import { ArrowRight } from "lucide-react";
export interface ContactPreviewProps {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundColor?: string;
}

const DEFAULTS = {
  eyebrow: "Let's Create Together",
  titlePrefix: "Begin your",
  titleHighlight: "legacy",
  description: "Tell us about your special day and we'll craft a cinematic story that lasts forever.",
  ctaLabel: "Get in Touch",
  ctaHref: "/contact",
  backgroundColor: "#0a0a0a",
};

export function ContactPreview(props: ContactPreviewProps) {
  const config = { ...DEFAULTS, ...props };
  const [ref, visible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="contact"
      data-header-theme="dark"
      className="relative overflow-hidden px-6 py-24 md:py-32"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative mx-auto max-w-3xl text-center"
        style={{
          transform: visible ? "translateY(0)" : "translateY(40px)",
          opacity: visible ? 1 : 0,
          transition: "transform 800ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 800ms ease",
        }}
      >
        <BlurFade delay={0.05} inView>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            {config.eyebrow}
          </p>
        </BlurFade>

        <BlurFade delay={0.15} inView>
          <h2 className="font-title text-5xl font-light tracking-wide text-white md:text-6xl lg:text-7xl">
            {config.titlePrefix}{" "}
            <Highlighter action="underline" color="#fbbf24" strokeWidth={2} animationDuration={800} isView>
              <em className="not-italic font-normal italic">{config.titleHighlight}</em>
            </Highlighter>
          </h2>
        </BlurFade>

        <BlurFade delay={0.25} inView>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-stone-400 md:text-base">
            {config.description}
          </p>
        </BlurFade>

        <BlurFade delay={0.35} inView>
          <div className="mt-10">
            <Link
              href={config.ctaHref}
              className="group inline-flex items-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-sm font-medium uppercase tracking-widest text-stone-900 transition-all duration-300 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20"
            >
              {config.ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
