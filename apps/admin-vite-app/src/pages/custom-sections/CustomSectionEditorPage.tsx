import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LayoutTemplate, MousePointerClick } from "lucide-react";
import { useSection, useUpdateSectionData } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { ColorField } from "@/components/composite/ColorField";
import { SaveBar } from "@/components/composite/SaveBar";
import { CanvasEditor } from "@/components/composite/CanvasEditor";
import type { CanvasElement, CustomSection } from "shared-ui";
import type { SectionRecord } from "@/shared/api/section.api";

function recordToDraft(r: SectionRecord): CustomSection {
  const map = (r.data?.map ?? {}) as Record<string, any>;
  return {
    id: String(r.id),
    name: r.name,
    slug: map.slug ?? r.name,
    visible: r.status === "ACTIVE",
    paddingY: map.paddingY ?? "lg",
    blocks: map.blocks ?? [],
    layoutMode: "canvas",
    canvasElements: map.canvasElements ?? [],
    canvasHeight: map.canvasHeight ?? 900,
    backgroundColor: map.backgroundColor ?? "#ffffff",
    backgroundType: map.backgroundType ?? "solid",
    bgGradientAngle: map.bgGradientAngle ?? 135,
    bgGradientFrom: map.bgGradientFrom ?? "#ffffff",
    bgGradientTo: map.bgGradientTo ?? "#f5f5f4",
    bgImage: map.bgImage ?? "",
    bgImageOverlay: map.bgImageOverlay ?? "#000000",
    bgImageOverlayOpacity: map.bgImageOverlayOpacity ?? 30,
    createdAt: r.createdTime,
    updatedAt: r.updatedTime,
  };
}

export function CustomSectionEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sectionId = Number(id);

  const { data: record, isLoading } = useSection(sectionId);
  const { mutate: saveSection, isPending: isSaving } = useUpdateSectionData();

  const [draft, setDraft] = useState<CustomSection | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!record) return;
    setDraft((prev) => (prev ? prev : recordToDraft(record)));
  }, [record]);

  if (isLoading || !draft) {
    return <PageContainer title="Loading..." badge="Custom"><div className="p-8">Loading...</div></PageContainer>;
  }

  const section = draft;

  function handleUpdateSection(updatedSection: CustomSection) {
    setDraft(updatedSection);
    setIsDirty(true);
  }

  function handleMetaChange(updates: Partial<CustomSection>) {
    handleUpdateSection({ ...section, ...updates, updatedAt: Date.now() });
  }

  function handleSave() {
    const { id: _sid, slug, visible, createdAt, updatedAt, ...canvasData } = section;
    saveSection(
      {
        id: sectionId,
        name: section.name,
        data: canvasData as unknown as Record<string, unknown>,
      },
      { onSuccess: () => setIsDirty(false) },
    );
  }

  function handleSetCanvasElements(elements: CanvasElement[]) {
    handleUpdateSection({ ...section, canvasElements: elements });
  }

  function handleSetCanvasHeight(height: number) {
    handleUpdateSection({ ...section, canvasHeight: height });
  }

  return (
    <PageContainer
      title={section.name}
      description="Kéo thả element tự do trên canvas. Chọn element để chỉnh thuộc tính."
      badge="Custom section"
      className="max-w-full"
    >
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/sections/custom-sections")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All custom sections
      </button>

      {/* Section settings */}
      <SectionCard icon={<LayoutTemplate className="h-4 w-4" />} title="Section settings">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <input
              value={section.name}
              onChange={(e) => handleMetaChange({ name: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Padding dọc</label>
            <div className="relative">
              <select
                value={section.paddingY}
                onChange={(e) =>
                  handleMetaChange({ paddingY: e.target.value as CustomSection["paddingY"] })
                }
                className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm shadow-sm outline-none focus:border-amber-500"
              >
                <option value="sm">Small (py-8)</option>
                <option value="md">Medium (py-16)</option>
                <option value="lg">Large (py-24)</option>
                <option value="xl">Extra large (py-32)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium">Background color</label>
            <ColorField
              value={section.backgroundColor}
              onChange={(v) => handleMetaChange({ backgroundColor: v })}
            />
          </div>
        </div>
      </SectionCard>

      {/* Canvas editor */}
      <SectionCard
        icon={<MousePointerClick className="h-4 w-4" />}
        title="Canvas editor"
        description="Click để chọn element. Kéo để di chuyển. Kéo góc để resize."
      >
        <CanvasEditor
          elements={section.canvasElements}
          canvasHeight={section.canvasHeight}
          section={section}
          onElementsChange={handleSetCanvasElements}
          onHeightChange={handleSetCanvasHeight}
          onSectionChange={handleMetaChange}
        />
      </SectionCard>

      <SaveBar
        isDirty={isDirty}
        isSubmitting={isSaving}
        onSave={handleSave}
        saveLabel="Lưu section"
      />
    </PageContainer>
  );
}
