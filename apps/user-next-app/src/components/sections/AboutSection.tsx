"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BlurFade, Highlighter, HyperText } from "shared-ui";
import type { StatItem, AboutImage } from "@/types/content";

const DEFAULT_STATS: StatItem[] = [
  { value: "200+", label: "Wedding Films" },
  { value: "5+", label: "Years Experience" },
  { value: "98%", label: "Happy Couples" },
];

const DEFAULT_HERO_IMAGE: AboutImage = { src: "/images/demo/a1.jpg", label: "Behind the lens" };

const DEFAULT_IMAGES: AboutImage[] = [
  { src: "/images/demo/a2.jpg", label: "Studio life" },
  { src: "/images/demo/a3.jpg", label: "On location" },
];

interface AboutSectionProps {
  eyebrow?: string;
  eyebrowColor?: string;
  titlePrefix?: string;
  titlePrefixColor?: string;
  titleHighlight?: string;
  titleHighlightColor?: string;
  /** HTML string from API (EN) */
  descriptionEn?: string;
  descriptionEnColor?: string;
  /** HTML string from API (VI) */
  descriptionVi?: string;
  descriptionViColor?: string;
  pillars?: string[];
  legacyLabel?: string;
  backgroundColor?: string;
  stats?: StatItem[];
  /** All images from API — first becomes heroImage, rest become grid images */
  images?: AboutImage[];
}

export function AboutSection({
  eyebrow,
  eyebrowColor,
  titlePrefix,
  titlePrefixColor,
  titleHighlight,
  titleHighlightColor,
  descriptionEn,
  descriptionEnColor,
  descriptionVi,
  descriptionViColor,
  pillars,
  legacyLabel,
  backgroundColor,
  stats = DEFAULT_STATS,
  images,
}: AboutSectionProps) {
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.1 });
  const [imageRef, imageVisible] = useScrollAnimation({ threshold: 0.1 });

  // Split API images: first → hero, rest → grid (max 2)
  const heroImage: AboutImage = images?.[0] ?? DEFAULT_HERO_IMAGE;
  const gridImages: AboutImage[] =
    images && images.length > 1 ? images.slice(1, 3) : DEFAULT_IMAGES;

  // Heading pieces
  const displayEyebrow = eyebrow ?? "About JOW Film";
  const displayPrefix = titlePrefix ?? "At JOW Film, we go beyond";
  const displayHighlight = titleHighlight ?? "filming.";

  // Pillars for EN description (fallback to static)
  const pillar1 = pillars?.[0] ?? "Dedication";
  const pillar2 = pillars?.[1] ?? "Creativity";
  const pillar3 = pillars?.[2] ?? "Authenticity";
  const legacy = legacyLabel ?? "Legacy of Love.";

  return (
    <section
      id="about"
      data-header-theme="dark"
      className="relative min-h-screen overflow-hidden bg-stone-950 px-6 py-24 md:px-16 lg:px-24"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* ── Left: Text column ── */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          style={{
            transform: titleVisible ? "translateX(0)" : "translateX(-60px)",
            opacity: titleVisible ? 1 : 0,
            transition: "transform 800ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 800ms ease",
          }}
        >
          <BlurFade delay={0.1} inView>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400"
              style={eyebrowColor ? { color: eyebrowColor } : undefined}
            >
              {displayEyebrow}
            </p>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <h2 className="font-title mb-8 text-5xl font-light leading-snug tracking-wide text-white md:text-6xl">
              <span style={titlePrefixColor ? { color: titlePrefixColor } : undefined}>
                {displayPrefix}
              </span>{" "}
              <Highlighter action="underline" color="#ffb900" strokeWidth={2} animationDuration={800} isView>
                <em
                  className="not-italic font-normal italic text-amber-400"
                  style={titleHighlightColor ? { color: titleHighlightColor } : undefined}
                >
                  {displayHighlight}
                </em>
              </Highlighter>
            </h2>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            {/* EN description — use API HTML if provided, else static */}
            {descriptionEn ? (
              <div
                className="mb-4 text-base leading-relaxed text-stone-200 [&_strong]:font-medium [&_strong]:text-stone-100 [&_em]:italic [&_em]:text-amber-400"
                style={descriptionEnColor ? { color: descriptionEnColor } : undefined}
                dangerouslySetInnerHTML={{ __html: descriptionEn }}
              />
            ) : (
              <p className="mb-4 text-base leading-relaxed text-stone-200">
                We translate your love story into a cinematic masterpiece. Driven by
                our three core pillars:{" "}
                <span className="font-medium text-stone-100">{pillar1}</span>,{" "}
                <span className="font-medium text-stone-100">{pillar2}</span>, and{" "}
                <span className="font-medium text-stone-100">{pillar3}</span>
                , we strive to preserve your most precious moments as a timeless{" "}
                <span className="italic text-amber-400">&ldquo;{legacy}&rdquo;</span>
              </p>
            )}

            {/* VI description — use API HTML if provided */}
            {descriptionVi ? (
              <div
                className="mb-6 text-sm italic leading-relaxed text-stone-500 border-l border-stone-800 pl-4 [&_strong]:not-italic [&_strong]:font-medium [&_strong]:text-stone-400"
                style={descriptionViColor ? { color: descriptionViColor } : undefined}
                dangerouslySetInnerHTML={{ __html: descriptionVi }}
              />
            ) : (
              <p className="mb-6 text-sm italic leading-relaxed text-stone-500 border-l border-stone-800 pl-4">
                Chúng mình kể lại câu chuyện tình yêu của bạn bằng ngôn ngữ điện ảnh. Với ba giá trị
                cốt lõi Tận tâm, Sáng tạo và Chân thực, mỗi thước phim được tạo nên không chỉ để lưu
                giữ khoảnh khắc, mà còn để trở thành một &ldquo;Di sản tình yêu&rdquo; trường tồn theo năm tháng.
              </p>
            )}
          </BlurFade>

          <div className="grid grid-cols-3 gap-6 border-t border-stone-800 pt-10">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  transform: titleVisible ? "translateY(0)" : "translateY(30px)",
                  opacity: titleVisible ? 1 : 0,
                  transition: `transform 700ms cubic-bezier(0.25,0.46,0.45,0.94) ${200 + i * 100}ms, opacity 700ms ease ${200 + i * 100}ms`,
                }}
              >
                <HyperText className="text-3xl font-light text-amber-400" countUp startOnView duration={1200}>
                  {stat.value}
                </HyperText>
                <BlurFade delay={0.6 + i * 0.1} inView>
                  <p className="mt-1 text-xs uppercase tracking-widest text-stone-500">{stat.label}</p>
                </BlurFade>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Image grid ── */}
        <div
          ref={imageRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-2 gap-3"
          style={{
            transform: imageVisible ? "translateX(0)" : "translateX(60px)",
            opacity: imageVisible ? 1 : 0,
            transition: "transform 800ms cubic-bezier(0.25,0.46,0.45,0.94) 150ms, opacity 800ms ease 150ms",
          }}
        >
          {/* Hero image — spans full width */}
          <div className="relative col-span-2 h-64 overflow-hidden rounded-xl">
            <Image
              src={heroImage.src}
              alt={heroImage.label}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-3 left-3 text-xs uppercase tracking-widest text-white/80">
              {heroImage.label}
            </span>
          </div>

          {/* Grid images */}
          {gridImages.map((item) => (
            <div key={item.label} className="relative h-36 overflow-hidden rounded-xl">
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs uppercase tracking-wider text-white/80">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
