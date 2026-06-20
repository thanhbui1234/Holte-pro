import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Clapperboard,
  Film,
  Heart,
  Image as ImageIcon,
  Mail,
  Palette,
  Sparkles,
  Video,
} from "lucide-react";
import { useHighlights } from "@/features/highlights";
import { useReels } from "@/features/reels";
import { useFilms } from "@/features/films";
import { useAbout } from "@/features/about";
import { useBanner } from "@/features/banner";
import { useFooter } from "@/features/footer";
import { PageContainer } from "@/components/composite/PageContainer";
import { cn } from "@/shared/lib/utils";

export function DashboardPage() {
  const { data: highlights, isLoading: loadingHighlights } = useHighlights();
  const { data: reels, isLoading: loadingReels } = useReels();
  const { data: films, isLoading: loadingFilms } = useFilms();
  const { data: about, isLoading: loadingAbout } = useAbout();
  const { data: banner, isLoading: loadingBanner } = useBanner();
  const { data: footer, isLoading: loadingFooter } = useFooter();

  const isLoading =
    loadingHighlights ||
    loadingReels ||
    loadingFilms ||
    loadingAbout ||
    loadingBanner ||
    loadingFooter;

  if (isLoading) {
    return (
      <PageContainer title="Welcome back" description="Loading dashboard metrics...">
        <div className="flex h-64 items-center justify-center">Loading...</div>
      </PageContainer>
    );
  }

  const happyCouples = about?.stats?.find((s) => s.label === "Happy Couples")?.value ?? "0";

  const metrics = [
    {
      label: "Wedding Highlights",
      value: highlights?.length ?? 0,
      hint: "Cinematic highlight reels in rotation",
      icon: Film,
      tone: "from-amber-400/30 to-amber-500/0",
    },
    {
      label: "Wedding Reels",
      value: reels?.length ?? 0,
      hint: "Short-form reels for social",
      icon: Clapperboard,
      tone: "from-rose-400/25 to-rose-500/0",
    },
    {
      label: "Traditional Films",
      value: films?.length ?? 0,
      hint: "Long-form heritage films",
      icon: Video,
      tone: "from-emerald-400/25 to-emerald-500/0",
    },
    {
      label: "Happy Couples",
      value: happyCouples,
      hint: "Sourced from About → Stats",
      icon: Heart,
      tone: "from-sky-400/25 to-sky-500/0",
    },
  ];

  const recent = [
    {
      label: "Banner video updated",
      to: "/sections/banner",
      preview: banner?.videoSrc ?? "No video",
      icon: ImageIcon,
    },
    {
      label: "About story",
      to: "/sections/about",
      preview: `${about?.titlePrefix ?? ""} ${about?.titleHighlight ?? ""}`.trim(),
      icon: Sparkles,
    },
    {
      label: "Footer contact",
      to: "/footer",
      preview: footer?.phone ?? "No phone",
      icon: Mail,
    },
  ];

  const shortcuts = [
    { label: "Update hero banner", to: "/sections/banner", icon: ImageIcon },
    { label: "Edit About story", to: "/sections/about", icon: Sparkles },
    { label: "Adjust contact CTA", to: "/sections/contact-cta", icon: Mail },
    { label: "Recolour a section", to: "/sections/wedding-highlights", icon: Palette },
  ];

  return (
    <PageContainer
      title="Welcome back"
      description="A snapshot of what's currently published across jowfilm.vn."
      badge="Studio admin"
    >
      {/* Metric strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-[0_1px_0_oklch(1_0_0/0.5)_inset,0_8px_24px_-16px_oklch(0_0_0/0.12)] transition-all hover:-translate-y-0.5 hover:border-amber-500/40 dark:shadow-[0_1px_0_oklch(1_0_0/0.04)_inset]"
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity group-hover:opacity-100",
                metric.tone,
              )}
            />
            <div className="relative flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {metric.label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <metric.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-[34px] font-semibold leading-none tracking-tight">
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground">{metric.hint}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two-column: Recent + Quick actions */}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent activity */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_0_oklch(1_0_0/0.5)_inset,0_8px_24px_-16px_oklch(0_0_0/0.1)] dark:shadow-[0_1px_0_oklch(1_0_0/0.04)_inset]">
          <header className="flex items-center justify-between border-b border-border/40 px-5 py-4">
            <div>
              <p className="text-[15px] font-semibold tracking-tight">
                Recently edited
              </p>
              <p className="text-xs text-muted-foreground">
                The latest values per section.
              </p>
            </div>
            <span className="rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {recent.length} sections
            </span>
          </header>
          <ul className="divide-y divide-border/40">
            {recent.map((row) => (
              <li key={row.to}>
                <NavLink
                  to={row.to}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-amber-500/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-amber-700 dark:text-amber-300">
                    <row.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{row.label}</p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      {row.preview}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick actions */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_0_oklch(1_0_0/0.5)_inset,0_8px_24px_-16px_oklch(0_0_0/0.1)] dark:shadow-[0_1px_0_oklch(1_0_0/0.04)_inset]">
          <header className="flex items-center justify-between border-b border-border/40 px-5 py-4">
            <div>
              <p className="text-[15px] font-semibold tracking-tight">
                Quick actions
              </p>
              <p className="text-xs text-muted-foreground">
                Common edits, one click away.
              </p>
            </div>
          </header>
          <div className="grid grid-cols-2 gap-2 p-3">
            {shortcuts.map((shortcut) => (
              <NavLink
                key={shortcut.to + shortcut.label}
                to={shortcut.to}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border/50 bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 transition-colors group-hover:bg-amber-500 group-hover:text-stone-950 dark:bg-amber-500/10 dark:text-amber-300 dark:group-hover:bg-amber-400 dark:group-hover:text-stone-950">
                  <shortcut.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium leading-snug">
                  {shortcut.label}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
