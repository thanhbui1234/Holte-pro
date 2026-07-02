import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Clapperboard,
  Film,
  Heart,
  Image as ImageIcon,
  LayoutTemplate,
  Mail,
  Settings2,
  Sparkles,
  Video,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useHighlights } from "@/features/highlights";
import { useReels } from "@/features/reels";
import { useFilms } from "@/features/films";
import { useFooter } from "@/features/footer";
import { useSections } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { cn } from "@/shared/lib/utils";
import type { SectionRecord } from "@/features/layout/types/layout.types";

type IconComp = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

// ─── Section registry (mirrors SectionsHubPage) ───────────────────────────────

const SECTION_META: Record<string, { label: string; icon: IconComp; path: string }> = {
  banner: { label: "Banner Chính", icon: ImageIcon, path: "/sections/banner" },
  about: { label: "Giới thiệu", icon: Sparkles, path: "/sections/about" },
  "wedding-highlights": { label: "Highlight Đám Cưới", icon: Film, path: "/sections/wedding-highlights" },
  "wedding-reels": { label: "Reels Đám Cưới", icon: Clapperboard, path: "/sections/wedding-reels" },
  "traditional-films": { label: "Phim Truyền Thống", icon: Video, path: "/sections/traditional-films" },
  "contact-cta": { label: "CTA Liên Hệ", icon: Mail, path: "/sections/contact-cta" },
};

const SHORTCUTS: { label: string; sectionName: string; icon: IconComp }[] = [
  { label: "Cập nhật banner chính", sectionName: "banner", icon: ImageIcon },
  { label: "Chỉnh sửa Giới thiệu", sectionName: "about", icon: Sparkles },
  { label: "Điều chỉnh CTA liên hệ", sectionName: "contact-cta", icon: Mail },
  { label: "Highlight đám cưới", sectionName: "wedding-highlights", icon: Film },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildSectionPath(section: SectionRecord): string {
  if (section.type === "CUSTOM") return `/sections/custom-sections/${section.id}`;
  const meta = SECTION_META[section.name];
  if (!meta) return "/sections";
  return `${meta.path}?id=${section.id}`;
}

function buildShortcutPath(sectionName: string, sections: SectionRecord[]): string {
  const record = sections.find((s) => s.name === sectionName);
  const meta = SECTION_META[sectionName];
  if (!meta) return "/sections";
  return record ? `${meta.path}?id=${record.id}` : meta.path;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const navigate = useNavigate();

  const { data: sections = [], isLoading: loadingSections } = useSections();
  const { data: highlights, isLoading: loadingHighlights } = useHighlights();
  const { data: reels, isLoading: loadingReels } = useReels();
  const { data: films, isLoading: loadingFilms } = useFilms();
  const { data: footer, isLoading: loadingFooter } = useFooter();

  const isLoading =
    loadingSections ||
    loadingHighlights ||
    loadingReels ||
    loadingFilms ||
    loadingFooter;

  if (isLoading) {
    return (
      <PageContainer title="Chào mừng trở lại" description="Đang tải số liệu...">
        <div className="flex h-64 items-center justify-center">Đang tải...</div>
      </PageContainer>
    );
  }

  const bannerMap = sections.find((s) => s.name === "banner")?.data?.map ?? {};
  const aboutMap = sections.find((s) => s.name === "about")?.data?.map ?? {};
  const aboutStats = (aboutMap.stats as { label: string; value: string }[] | undefined) ?? [];
  const happyCouples = aboutStats.find((s) => s.label === "Happy Couples")?.value ?? "0";

  const metrics = [
    {
      label: "Highlight Đám Cưới",
      value: highlights?.length ?? 0,
      hint: "Highlight điện ảnh đang xoay vòng",
      icon: Film,
      tone: "from-amber-400/30 to-amber-500/0",
    },
    {
      label: "Reels Đám Cưới",
      value: reels?.length ?? 0,
      hint: "Reels ngắn cho mạng xã hội",
      icon: Clapperboard,
      tone: "from-rose-400/25 to-rose-500/0",
    },
    {
      label: "Phim Truyền Thống",
      value: films?.length ?? 0,
      hint: "Phim dài di sản",
      icon: Video,
      tone: "from-emerald-400/25 to-emerald-500/0",
    },
    {
      label: "Cặp đôi hạnh phúc",
      value: happyCouples,
      hint: "Lấy từ Giới thiệu → Số liệu",
      icon: Heart,
      tone: "from-sky-400/25 to-sky-500/0",
    },
  ];

  // Preview values per section name
  const previewMap: Record<string, string> = {
    banner: (bannerMap.videoSrc as string | undefined) ?? "—",
    about: `${(aboutMap.titlePrefix as string | undefined) ?? ""} ${(aboutMap.titleHighlight as string | undefined) ?? ""}`.trim() || "—",
    "wedding-highlights": highlights?.length ? `${highlights.length} video` : "—",
    "wedding-reels": reels?.length ? `${reels.length} reels` : "—",
    "traditional-films": films?.length ? `${films.length} phim` : "—",
    "contact-cta": footer?.phone ?? "—",
  };

  // Recent: all sections sorted by updatedTime desc, top 6
  const recentSections = [...sections]
    .sort((a, b) => (b.updatedTime ?? 0) - (a.updatedTime ?? 0))
    .slice(0, 6);

  return (
    <PageContainer
      title="Chào mừng trở lại"
      description="Tổng quan những gì đang được đăng trên jowfilm.vn."
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
              <p className="text-[15px] font-semibold tracking-tight">Đã chỉnh sửa gần đây</p>
              <p className="text-xs text-muted-foreground">Các giá trị mới nhất theo từng phần.</p>
            </div>
            <span className="rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {recentSections.length} phần
            </span>
          </header>
          <ul className="divide-y divide-border/40">
            {recentSections.map((section) => {
              const meta = section.type === "CUSTOM"
                ? { label: section.name, icon: LayoutTemplate }
                : SECTION_META[section.name] ?? { label: section.name, icon: Settings2 };
              const preview = section.type === "CUSTOM"
                ? (section.description || "Phần tùy chỉnh")
                : (previewMap[section.name] ?? "—");
              const path = buildSectionPath(section);

              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => navigate(path)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-amber-500/5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-amber-700 dark:text-amber-300">
                      <meta.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{meta.label}</p>
                      <p className="truncate font-mono text-[11px] text-muted-foreground">
                        {preview}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick actions */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_0_oklch(1_0_0/0.5)_inset,0_8px_24px_-16px_oklch(0_0_0/0.1)] dark:shadow-[0_1px_0_oklch(1_0_0/0.04)_inset]">
          <header className="flex items-center justify-between border-b border-border/40 px-5 py-4">
            <div>
              <p className="text-[15px] font-semibold tracking-tight">Thao tác nhanh</p>
              <p className="text-xs text-muted-foreground">Chỉnh sửa thường gặp, chỉ một cú nhấp.</p>
            </div>
          </header>
          <div className="grid grid-cols-2 gap-2 p-3">
            {SHORTCUTS.map((shortcut) => {
              const path = buildShortcutPath(shortcut.sectionName, sections);
              return (
                <button
                  key={shortcut.sectionName}
                  type="button"
                  onClick={() => navigate(path)}
                  className={cn(
                    "group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border/50",
                    "bg-background p-4 text-left transition-all hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-md",
                  )}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 transition-colors group-hover:bg-amber-500 group-hover:text-stone-950 dark:bg-amber-500/10 dark:text-amber-300 dark:group-hover:bg-amber-400 dark:group-hover:text-stone-950">
                    <shortcut.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium leading-snug">{shortcut.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}