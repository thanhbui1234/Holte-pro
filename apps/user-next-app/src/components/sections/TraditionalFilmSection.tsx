"use client";

import Link from "next/link";
import Image from "next/image";
import { FILMS } from "@/data/videos";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BlurFade, Highlighter } from "shared-ui";
import type { FilmItem } from "@/types/content";

export interface TraditionalFilmSectionProps {
  films?: FilmItem[];
  backgroundColor?: string;
  eyebrow?: string;
  eyebrowColor?: string;
  titlePrefix?: string;
  titlePrefixColor?: string;
  titleHighlight?: string;
  titleHighlightColor?: string;
  description?: string;
  descriptionColor?: string;
}

export function TraditionalFilmSection({
  films = FILMS,
  backgroundColor,
  eyebrow = "Heritage & Culture",
  eyebrowColor,
  titlePrefix = "Traditional",
  titlePrefixColor,
  titleHighlight = "Films",
  titleHighlightColor,
  description = "A long-form wedding film that follows the complete timeline of your wedding day.",
  descriptionColor,
}: TraditionalFilmSectionProps) {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="traditional-film"
      data-header-theme="dark"
      className="px-6 py-20 md:px-16 md:py-24 lg:px-24"
      style={{ backgroundColor: backgroundColor || "#293629" }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-14 text-center md:mb-16"
          style={{
            transform: headerVisible ? "translateY(0)" : "translateY(-40px)",
            opacity: headerVisible ? 1 : 0,
            transition:
              "transform 700ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 700ms ease",
          }}
        >
          <BlurFade delay={0.05} inView>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400"
              style={eyebrowColor ? { color: eyebrowColor } : undefined}
            >
              {eyebrow}
            </p>
          </BlurFade>
          <BlurFade delay={0.15} inView>
            <Link href="/traditional-film">
              <h2 className="font-title text-5xl font-light tracking-wide text-amber-50 md:text-7xl">
                <Highlighter
                  action="underline"
                  color="#fbbf24"
                  strokeWidth={2}
                  animationDuration={800}
                  isView
                >
                  <span style={titlePrefixColor ? { color: titlePrefixColor } : undefined}>
                    {titlePrefix}
                  </span>{" "}
                  <em
                    className="not-italic font-normal italic"
                    style={titleHighlightColor ? { color: titleHighlightColor } : undefined}
                  >
                    {titleHighlight}
                  </em>
                </Highlighter>
              </h2>
            </Link>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <div
              className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-amber-200/60 [&_p]:mb-2 last:[&_p]:mb-0"
              style={descriptionColor ? { color: descriptionColor } : undefined}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </BlurFade>
        </div>

        {/* Mobile: horizontal scroll | Desktop: 3-column grid */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-x-visible sm:pb-0 lg:grid-cols-3">
          {films.map((film, index) => (
            <BlurFade key={film.title + index} delay={0.1 + index * 0.1} inView>
              <Link
                href={`/traditional-film#film-${index}`}
                className="group relative block w-[75vw] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-auto"
              >
                <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
                  <Image
                    src={film.image}
                    alt={film.title}
                    fill
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 sm:p-6">
                  <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-amber-400/80">
                    {film.subtitle}
                  </p>
                  <h3
                    className="mb-2 text-xl font-light text-amber-50 sm:text-2xl"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 500,
                    }}
                  >
                    {film.title}
                  </h3>
                  <p className="mb-3 text-xs leading-relaxed text-amber-100/50 line-clamp-2">
                    {film.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {film.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-amber-600/30 bg-amber-900/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-amber-400 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
