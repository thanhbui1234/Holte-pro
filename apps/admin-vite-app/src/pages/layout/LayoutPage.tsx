import { useState, useMemo } from "react";
import { Reorder, useDragControls } from "motion/react";
import {
  Clapperboard,
  Eye,
  EyeOff,
  Film,
  GripVertical,
  Loader2,
  Lock,
  Mail,
  PanelsTopLeft,
  Save,
  Settings2,
  Sparkles,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useSections, useUpdateSection, useUpdateSectionOrder } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { Button, Switch, useBeforeUnload } from "shared-ui";
import type { SectionRecord } from "@/features/layout/types/layout.types";
import { cn } from "@/shared/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

interface SectionMeta {
  label: string;
  description: string;
  icon: IconComponent;
}

// ─── Section registry ─────────────────────────────────────────────────────────

const SECTION_META: Record<string, SectionMeta> = {
  banner: {
    label: "Hero Banner",
    icon: ImageIcon,
    description: "Fullscreen video and logo overlay.",
  },
  about: {
    label: "About JOW Film",
    icon: Sparkles,
    description: "Studio intro, story copy and credibility stats.",
  },
  "wedding-highlights": {
    label: "Wedding Highlights",
    icon: Film,
    description: "Featured highlight reel carousel.",
  },
  "wedding-reels": {
    label: "Wedding Reels",
    icon: Clapperboard,
    description: "Short-form vertical reels scroller.",
  },
  "traditional-films": {
    label: "Traditional Films",
    icon: Video,
    description: "Long-form heritage film grid.",
  },
  "contact-cta": {
    label: "Contact CTA",
    icon: Mail,
    description: "Closing call-to-action block.",
  },
};

const FALLBACK_META: SectionMeta = {
  label: "Custom section",
  icon: Settings2,
  description: "User-defined section.",
};

const FIXED_SECTIONS: { label: string; description: string; icon: IconComponent }[] = [
  { label: "Header", description: "Floating navigation chrome.", icon: PanelsTopLeft },
  { label: "Footer", description: "Always last. Contact info and credits.", icon: Settings2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveMeta(name: string): SectionMeta {
  return SECTION_META[name] ?? FALLBACK_META;
}

function getSectionPreview(section: SectionRecord): string {
  const map = section.data?.map ?? {};

  switch (section.name) {
    case "banner":
      return (map.logoAlt as string) || (map.videoSrc as string) || "—";

    case "about": {
      const prefix = map.titlePrefix as string | undefined;
      const highlight = map.titleHighlight as string | undefined;
      return [prefix, highlight].filter(Boolean).join(" ") || (map.eyebrow as string) || "—";
    }

    case "wedding-highlights":
    case "wedding-reels":
    case "traditional-films": {
      const cfg = map.config as Record<string, string> | undefined;
      const items = map.items as unknown[] | undefined;
      const title = cfg
        ? [cfg.titlePrefix, cfg.titleHighlight].filter(Boolean).join(" ")
        : "";
      const count = items?.length ? `${items.length} items` : "";
      return [title, count].filter(Boolean).join(" · ") || "—";
    }

    case "contact-cta":
      return (map.ctaLabel as string) || (map.eyebrow as string) || "—";

    default:
      return section.description || "—";
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function LayoutPage() {
  const { data: sections = [], isLoading } = useSections();
  const { mutate: updateSection, isPending: isToggling } = useUpdateSection();
  const { mutate: saveOrder, isPending: isSaving } = useUpdateSectionOrder();

  const [localOrder, setLocalOrder] = useState<SectionRecord[]>([]);

  useBeforeUnload(isSaving);

  const orderedSections = localOrder.length > 0 ? localOrder : sections;

  const isOrderDirty = useMemo(() => {
    if (localOrder.length === 0) return false;
    return localOrder.some((s, i) => s.id !== sections[i]?.id);
  }, [localOrder, sections]);

  const visibleCount = orderedSections.filter((s) => s.status === "ACTIVE").length;

  function handleReorder(next: SectionRecord[]) {
    setLocalOrder(next);
  }

  function handleToggle(section: SectionRecord) {
    const nextStatus = section.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateSection({ id: section.id, status: nextStatus });
  }

  function handleSaveOrder() {
    // Clear local state synchronously before calling saveOrder so that React 18
    // batches this setState together with the cache update from onMutate into a
    // single re-render — the list never flashes back to the old order.
    setLocalOrder([]);
    saveOrder(localOrder);
  }

  if (isLoading) {
    return (
      <PageContainer title="Homepage Layout" description="Loading...">
        <div className="p-8">Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Homepage Layout"
      description="Manage the order and visibility of homepage sections."
      badge="Structure"
    >
      {isSaving && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          <div className="min-w-0">
            <p className="font-medium">Saving section order…</p>
            <p className="text-xs opacity-70">
              Please don't close or navigate away until this completes.
            </p>
          </div>
        </div>
      )}

      <SectionCard
        icon={<GripVertical className="h-4 w-4" />}
        title="Sections"
        description={`${visibleCount} of ${orderedSections.length} sections currently visible.`}
        actions={
          isOrderDirty ? (
            <Button size="sm" onClick={handleSaveOrder} disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "Saving…" : "Save order"}
            </Button>
          ) : null
        }
      >
        <Reorder.Group
          axis="y"
          values={orderedSections}
          onReorder={handleReorder}
          className="space-y-2"
        >
          {orderedSections.map((section, index) => (
            <SectionRow
              key={section.id}
              section={section}
              index={index}
              meta={resolveMeta(section.name)}
              preview={getSectionPreview(section)}
              isDragDisabled={isSaving}
              isToggling={isToggling}
              onToggle={() => handleToggle(section)}
            />
          ))}
        </Reorder.Group>
      </SectionCard>

      <SectionCard
        icon={<Lock className="h-4 w-4" />}
        title="Fixed sections"
        description="These always stay in place and can't be reordered or hidden."
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {FIXED_SECTIONS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-lg border border-dashed border-border/70 bg-muted/30 px-3 py-2.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground">
                <item.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.label}</p>
                <p className="truncate text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
            </li>
          ))}
        </ul>
      </SectionCard>
    </PageContainer>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

interface SectionRowProps {
  section: SectionRecord;
  index: number;
  meta: SectionMeta;
  preview: string;
  isDragDisabled: boolean;
  isToggling: boolean;
  onToggle: () => void;
}

function SectionRow({ section, index, meta, preview, isDragDisabled, isToggling, onToggle }: SectionRowProps) {
  const controls = useDragControls();
  const isActive = section.status === "ACTIVE";
  const switchId = `layout-${section.id}`;

  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "group/row flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm transition-colors",
        !isActive && "bg-muted/40 opacity-70",
        isDragDisabled && "pointer-events-none opacity-60",
      )}
      whileDrag={{
        scale: 1.01,
        boxShadow: "0 24px 48px -20px oklch(0 0 0 / 0.25)",
      }}
    >
      <button
        type="button"
        onPointerDown={(e) => !isDragDisabled && controls.start(e)}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          isDragDisabled ? "cursor-not-allowed opacity-40" : "cursor-grab active:cursor-grabbing",
        )}
        aria-label="Drag to reorder"
        disabled={isDragDisabled}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background font-mono text-xs text-muted-foreground sm:flex">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
        <meta.icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{meta.label}</p>
          {isActive ? (
            <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{meta.description}</p>
        <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground/70">
          {preview}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor={switchId}
          className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline"
        >
          {isActive ? "Visible" : "Hidden"}
        </label>
        <Switch
          id={switchId}
          checked={isActive}
          onCheckedChange={onToggle}
          disabled={isToggling}
          aria-label={`Toggle ${meta.label}`}
        />
      </div>
    </Reorder.Item>
  );
}
