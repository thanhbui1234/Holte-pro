import { useMemo } from "react";
import { Reorder, useDragControls } from "motion/react";
import {
  Clapperboard,
  Eye,
  EyeOff,
  Film,
  GripVertical,
  Lock,
  Mail,
  PanelsTopLeft,
  Settings2,
  Sparkles,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useLayout, useUpdateLayout } from "@/features/layout/hooks/use-layout";
import { useAbout } from "@/features/about";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { Switch } from "shared-ui";
import type { LayoutSection, LayoutSectionKey } from "@/features/layout/types/layout.types";
import { cn } from "@/shared/lib/utils";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

interface SectionMeta {
  label: string;
  description: string;
  icon: IconComponent;
}

const ORDERABLE_META: Record<LayoutSectionKey, SectionMeta> = {
  about: {
    label: "About JOW Film",
    description: "Studio intro, story copy and credibility stats.",
    icon: Sparkles,
  },
  highlights: {
    label: "Wedding Highlights",
    description: "Featured highlight reel carousel.",
    icon: Film,
  },
  reels: {
    label: "Wedding Reels",
    description: "Short-form vertical reels scroller.",
    icon: Clapperboard,
  },
  films: {
    label: "Traditional Films",
    description: "Long-form heritage film grid.",
    icon: Video,
  },
};

const FIXED_SECTIONS: { label: string; description: string; icon: IconComponent }[] = [
  {
    label: "Banner",
    description: "Always first. Hero video and logo.",
    icon: ImageIcon,
  },
  {
    label: "Header",
    description: "Floating navigation chrome.",
    icon: PanelsTopLeft,
  },
  {
    label: "Contact CTA",
    description: "Always closes the homepage.",
    icon: Mail,
  },
  {
    label: "Footer",
    description: "Always last. Contact info and credits.",
    icon: Settings2,
  },
];

export function LayoutPage() {
  const { data: layout = [], isLoading } = useLayout();
  const { data: about } = useAbout();
  const { mutate: updateLayout } = useUpdateLayout();

  const visibleCount = useMemo(
    () => layout.filter((s: LayoutSection) => s.visible).length,
    [layout],
  );

  const previewName = (key: LayoutSectionKey) => {
    if (key === "about") {
      return `${about?.titlePrefix ?? ""} ${about?.titleHighlight ?? ""}`;
    }
    return `Content for ${ORDERABLE_META[key]?.label}`;
  };

  function handleToggle(key: string) {
    updateLayout(
      layout.map((s: LayoutSection) =>
        s.key === key ? { ...s, visible: !s.visible } : s
      )
    );
  }

  function handleReorder(newOrder: LayoutSection[]) {
    updateLayout(newOrder);
  }

  if (isLoading) {
    return <PageContainer title="Homepage Layout" description="Loading..."><div className="p-8">Loading...</div></PageContainer>;
  }

  return (
    <PageContainer
      title="Homepage Layout"
      description="Manage the order and visibility of sections on the main page."
      badge="Structure"
    >
      <SectionCard
        icon={<GripVertical className="h-4 w-4" />}
        title="Active Sections"
        description={`${visibleCount} of ${layout.length} sections currently visible.`}
      >
        <Reorder.Group
          axis="y"
          values={layout}
          onReorder={handleReorder}
          className="space-y-2"
        >
          {layout.map((section: LayoutSection, index: number) => (
            <LayoutRow
              key={section.key}
              section={section}
              index={index}
              meta={ORDERABLE_META[section.key]}
              preview={previewName(section.key)}
              onToggle={() => handleToggle(section.key)}
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
                <p className="truncate text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
            </li>
          ))}
        </ul>
      </SectionCard>
    </PageContainer>
  );
}

interface LayoutRowProps {
  section: LayoutSection;
  index: number;
  meta: SectionMeta;
  preview: string;
  onToggle: () => void;
}

function LayoutRow({ section, index, meta, preview, onToggle }: LayoutRowProps) {
  const controls = useDragControls();
  const switchId = `layout-${section.key}`;

  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "group/row flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm transition-colors",
        !section.visible && "bg-muted/40 opacity-70",
      )}
      whileDrag={{
        scale: 1.01,
        boxShadow: "0 24px 48px -20px oklch(0 0 0 / 0.25)",
      }}
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
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
          {section.visible ? (
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
          {section.visible ? "Visible" : "Hidden"}
        </label>
        <Switch
          id={switchId}
          checked={section.visible}
          onCheckedChange={onToggle}
          aria-label={`Toggle ${meta.label}`}
        />
      </div>
    </Reorder.Item>
  );
}
