"use client";

import { useEffect } from "react";
import { PageTitleBar } from "@/components/ui/PageTitleBar";
import { FILMS, getYouTubeEmbedUrl } from "@/data/videos";
import { BlurFade } from "shared-ui";
import { ChevronDown } from "lucide-react";
import type { FilmItem } from "@/types/content";

interface TraditionalFilmPageProps {
  films?: FilmItem[];
}

export function TraditionalFilmPage({ films }: TraditionalFilmPageProps) {
  const displayFilms = films ?? FILMS;
  // Scroll to anchor on mount (e.g. /traditional-film#film-1)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to let the page render
      setTimeout(() => {
        if (hash === "#film-0") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 300);
    }
  }, []);

  const handleScrollDown = () => {
    const nextEl = document.querySelector("#film-1");
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="bg-white dark:bg-stone-950 pb-16 md:pb-24">
      <PageTitleBar
        label="Heritage & Culture"
        title="Traditional"
        highlightWord="Films"
      />

      <section
        data-header-theme="light"
        className="px-5 md:px-12 lg:px-20"
      >
        <div className="mx-auto max-w-5xl">
          {/* Film 1 (First Video) */}
          <div id="film-0" className="scroll-mt-24">
            <BlurFade delay={0.05} inView>
              <FilmCard film={displayFilms[0]} />
            </BlurFade>

            {/* Scroll Down button placed inside film 1's flow */}
            {displayFilms.length > 1 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleScrollDown}
                  className="cursor-pointer text-stone-300 transition-colors hover:text-amber-600 dark:text-stone-700 dark:hover:text-amber-400"
                  aria-label="Scroll to next film"
                >
                  <ChevronDown className="h-6 w-6 animate-bounce" />
                </button>
              </div>
            )}
          </div>

          {/* Remaining content: other films */}
          {displayFilms.length > 1 && (
            <div className="flex flex-col gap-16 md:gap-24 mt-16 md:mt-24">
              {displayFilms.slice(1).map((film, index) => (
                <div key={film.id + (index + 1)} id={`film-${index + 1}`} className="scroll-mt-24">
                  {/* Divider */}
                  <div className="mb-12 flex items-center gap-4 md:mb-16">
                    <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                    <span className="text-[10px] uppercase tracking-widest text-stone-300 dark:text-stone-700">
                      {String(index + 2).padStart(2, "0")} /{" "}
                      {String(displayFilms.length).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                  </div>

                  <BlurFade delay={0.05} inView>
                    <FilmCard film={film} />
                  </BlurFade>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

interface FilmCardProps {
  film: FilmItem;
}

function FilmCard({ film }: FilmCardProps) {
  return (
    <article>
      <div className="relative w-full overflow-hidden rounded-xl shadow-lg md:rounded-2xl">
        <div className="relative aspect-video">
          <iframe
            src={getYouTubeEmbedUrl(film.id).replace("?autoplay=1", "")}
            title={film.title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>

      <FilmDetails film={film} />
    </article>
  );
}

function FilmDetails({ film }: { film: FilmItem }) {
  return (
    <div className="mt-4 md:mt-5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 dark:text-amber-400">
        {film.subtitle}
      </p>
      <h3
        className="mt-1.5 text-xl font-medium tracking-wide text-stone-900 md:text-2xl dark:text-stone-100"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {film.title}
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
        {film.description}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {film.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-stone-200 px-3 py-1 text-[10px] uppercase tracking-wider text-stone-500 dark:border-stone-700 dark:text-stone-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
