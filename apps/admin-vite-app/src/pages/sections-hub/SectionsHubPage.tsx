import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  Clapperboard,
  Eye,
  EyeOff,
  Film,
  Image as ImageIcon,
  LayoutTemplate,
  Lock,
  Mail,
  Sparkles,
  Video,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useCustomSections } from "@/features/custom-sections/hooks/use-custom-sections";
import { useHighlights } from "@/features/highlights";
import { useReels } from "@/features/reels";
import { useFilms } from "@/features/films";
import { useSections } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { cn } from "@/shared/lib/utils";

type IconComp = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

interface SectionCard {
  key: string;
  label: string;
  description: string;
  path: string;
  icon: IconComp;
  sectionName?: string;
  fixed?: boolean;
  isCustom?: boolean;
}

const SECTIONS: SectionCard[] = [
  {
    key: "banner",
    label: "Banner",
    description: "Video hero và logo hiển thị trên cùng trang chủ.",
    path: "/sections/banner",
    icon: ImageIcon,
    sectionName: "banner",
    fixed: true,
  },
  {
    key: "about",
    label: "Giới thiệu",
    description: "Giới thiệu studio, câu chuyện nguồn gốc và số liệu uy tín.",
    path: "/sections/about",
    icon: Sparkles,
    sectionName: "about",
  },
  {
    key: "highlights",
    label: "Highlight Đám Cưới",
    description: "Carousel highlight nổi bật.",
    path: "/sections/wedding-highlights",
    icon: Film,
    sectionName: "wedding-highlights",
  },
  {
    key: "reels",
    label: "Reels Đám Cưới",
    description: "Cuộn video ngắn dọc.",
    path: "/sections/wedding-reels",
    icon: Clapperboard,
    sectionName: "wedding-reels",
  },
  {
    key: "films",
    label: "Phim Truyền Thống",
    description: "Lưới phim dài di sản.",
    path: "/sections/traditional-films",
    icon: Video,
    sectionName: "traditional-films",
  },
  {
    key: "contact-cta",
    label: "CTA Liên Hệ",
    description: "Khối kêu gọi hành động cuối trang chủ.",
    path: "/sections/contact-cta",
    icon: Mail,
    sectionName: "contact-cta",
    fixed: true,
  },
  {
    key: "custom",
    label: "Phần tùy chỉnh",
    description: "Các phần canvas tự do bạn tạo từ đầu.",
    path: "/sections/custom-sections",
    icon: LayoutTemplate,
    isCustom: true,
  },
];

export function SectionsHubPage() {
  const navigate = useNavigate();
  const { data: sections = [] } = useSections();
  const { data: customSections = [] } = useCustomSections();
  const { data: highlights = [] } = useHighlights();
  const { data: reels = [] } = useReels();
  const { data: films = [] } = useFilms();

  const getVisibility = (sectionName?: string): boolean | null => {
    if (!sectionName) return null;
    const found = sections.find((s) => s.name === sectionName);
    if (!found) return null;
    return found.status === "ACTIVE";
  };

  const getSectionId = (sectionName?: string): number | undefined =>
    sectionName ? sections.find((s) => s.name === sectionName)?.id : undefined;

  const getMeta = (card: SectionCard): string | null => {
    if (card.isCustom) {
      const count = customSections.length;
      return count === 0 ? "Chưa có phần nào" : `${count} phần`;
    }
    if (card.sectionName === "wedding-highlights") return `${highlights.length} video`;
    if (card.sectionName === "wedding-reels") return `${reels.length} reels`;
    if (card.sectionName === "traditional-films") return `${films.length} phim`;
    return null;
  };

  return (
    <PageContainer
      title="Các phần trang web"
      description="Tất cả các phần có thể cấu hình của trang web. Nhấp vào thẻ để chỉnh sửa nội dung, bật tắt hiển thị hoặc sắp xếp lại."
      badge="Sections"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((card, i) => {
          const visible = getVisibility(card.sectionName);
          const meta = getMeta(card);
          const isHidden = visible === false;

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              onClick={() => {
                const id = getSectionId(card.sectionName);
                navigate(id ? `${card.path}?id=${id}` : card.path);
              }}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-4 rounded-2xl border bg-background p-5 shadow-sm transition-all duration-200",
                "hover:border-amber-500/50 hover:shadow-[0_8px_32px_-8px_rgba(217,119,6,0.18)]",
                isHidden
                  ? "border-border/40 opacity-60"
                  : "border-border/60",
              )}
            >
              {/* Visibility / fixed badge */}
              <div className="absolute right-4 top-4">
                {card.fixed ? (
                  <span className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <Lock className="h-2.5 w-2.5" />
                    Cố định
                  </span>
                ) : visible != null ? (
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      visible
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "border-border/60 bg-muted/60 text-muted-foreground",
                    )}
                  >
                    {visible ? (
                      <Eye className="h-2.5 w-2.5" />
                    ) : (
                      <EyeOff className="h-2.5 w-2.5" />
                    )}
                    {visible ? "Hiển thị" : "Ẩn"}
                  </span>
                ) : null}
              </div>

              {/* Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-50 text-amber-700 transition-colors group-hover:border-amber-500/40 group-hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:group-hover:bg-amber-500/20">
                <card.icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1 pr-14">
                <p className="text-sm font-semibold leading-snug">{card.label}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                {meta ? (
                  <span className="font-mono text-[11px] text-muted-foreground/70">
                    {meta}
                  </span>
                ) : (
                  <span />
                )}
                <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  Cấu hình
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageContainer>
  );
}
