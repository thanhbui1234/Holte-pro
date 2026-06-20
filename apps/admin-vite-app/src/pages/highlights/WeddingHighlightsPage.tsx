import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Film, Plus } from "lucide-react";
import { useSection, useUpdateSectionData } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { SectionConfigForm } from "@/components/composite/SectionConfigForm";
import { EntityList } from "@/components/composite/EntityList";
import { EntityFormDialog } from "@/components/composite/EntityFormDialog";
import { ConfirmDialog } from "@/components/composite/ConfirmDialog";
import { EmptyState } from "@/components/composite/EmptyState";
import { FormField } from "@/components/composite/FormField";
import { FormMediaField } from "@/components/composite/FormMediaField";
import { Input } from "shared-ui";
import { Button } from "shared-ui";
import type { HighlightVideo } from "@/features/highlights/types/highlights.types";
import type { ThemedSection } from "@/shared/types";

const BLANK: HighlightVideo = { id: "", videoUrl: "", title: "", subtitle: "" };

export function WeddingHighlightsPage() {
  const [searchParams] = useSearchParams();
  const sectionId = Number(searchParams.get("id"));

  const { data: section, isLoading } = useSection(sectionId);
  const { mutate: updateSection } = useUpdateSectionData();

  const map = section?.data?.map ?? {};
  const config = (map.config ?? {}) as ThemedSection;
  const items = (map.items ?? []) as HighlightVideo[];

  const [dialog, setDialog] = useState<{ mode: "add" | "edit"; initial: HighlightVideo } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<HighlightVideo | null>(null);
  const [videoSourceType, setVideoSourceType] = useState<"upload" | "youtube">("upload");

  const form = useForm<HighlightVideo>({ defaultValues: BLANK });

  const openAdd = () => {
    form.reset(BLANK);
    setVideoSourceType("upload");
    setDialog({ mode: "add", initial: BLANK });
  };

  const openEdit = (item: HighlightVideo) => {
    form.reset(item);
    setVideoSourceType(item.id ? "youtube" : "upload");
    setDialog({ mode: "edit", initial: item });
  };

  const submit = form.handleSubmit((values) => {
    if (!dialog) return;
    const next =
      dialog.mode === "add"
        ? [...items, values]
        : items.map((i) => (i.id === dialog.initial.id ? values : i));
    updateSection({ id: sectionId, data: { config, items: next } as unknown as Record<string, unknown> });
    setDialog(null);
  });

  const saveConfig = (newConfig: ThemedSection) => {
    updateSection({ id: sectionId, data: { config: newConfig, items } as unknown as Record<string, unknown> });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    updateSection({ id: sectionId, data: { config, items: items.filter((i) => i.id !== pendingDelete.id) } as unknown as Record<string, unknown> });
    setPendingDelete(null);
  };

  if (isLoading) {
    return (
      <PageContainer title="Wedding Highlights" description="Loading...">
        <div className="p-8">Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Wedding Highlights"
      description="Featured highlight videos. Card-stack carousel on desktop, grid on mobile."
    >
      <SectionConfigForm value={config} onSave={saveConfig} />

      <SectionCard
        icon={<Film className="h-4 w-4" />}
        title="Videos"
        description={`${items.length} videos in rotation`}
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add video
          </Button>
        }
      >
        <EntityList
          items={items}
          getKey={(item) => item.id}
          onEdit={openEdit}
          onDelete={(item) => setPendingDelete(item)}
          emptyState={
            <EmptyState
              icon={<Film className="h-4 w-4" />}
              title="No highlights yet"
              description="Add a YouTube video to populate the homepage carousel."
              action={
                <Button size="sm" onClick={openAdd}>
                  <Plus className="h-4 w-4" />
                  Add first video
                </Button>
              }
            />
          }
          renderRow={(item) => (
            <div className="flex items-center gap-3">
              <div className="relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                {item.id ? (
                  <img
                    src={`https://img.youtube.com/vi/${item.id}/mqdefault.jpg`}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : item.videoUrl ? (
                  <video src={item.videoUrl} className="h-full w-full object-cover" />
                ) : (
                  <Film className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
            </div>
          )}
        />
      </SectionCard>

      <EntityFormDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.mode ?? "add"}
        entityLabel="Video"
        description="YouTube ID, caption shown on the card."
        onSubmit={submit}
      >
        <div className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Video Source</p>
            <div className="flex items-center rounded-md border border-border/60 bg-background p-1">
              <button
                type="button"
                className={`rounded-sm px-3 py-1 text-xs font-medium transition-colors ${videoSourceType === "upload" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setVideoSourceType("upload")}
              >
                Upload File
              </button>
              <button
                type="button"
                className={`rounded-sm px-3 py-1 text-xs font-medium transition-colors ${videoSourceType === "youtube" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setVideoSourceType("youtube")}
              >
                YouTube Link
              </button>
            </div>
          </div>

          {videoSourceType === "upload" ? (
            <FormField label="Upload Video" htmlFor="hl-video">
              <FormMediaField
                control={form.control}
                name="videoUrl"
                label=""
                accept=".mp4,.mov,.avi,.mkv,.wmv,.flv,.webm,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/x-ms-wmv,video/x-flv,video/webm"
                placeholder="Drag & drop or click to upload video file"
              />
            </FormField>
          ) : (
            <FormField label="YouTube video ID" htmlFor="hl-id" hint="Only video ID (e.g. SlQR9iu09bQ)">
              <Input id="hl-id" placeholder="SlQR9iu09bQ" {...form.register("id")} />
            </FormField>
          )}
        </div>
        <FormField label="Title" htmlFor="hl-title">
          <Input id="hl-title" {...form.register("title")} />
        </FormField>
        <FormField label="Subtitle" htmlFor="hl-sub">
          <Input id="hl-sub" placeholder="Đà Lạt · Spring 2024" {...form.register("subtitle")} />
        </FormField>
      </EntityFormDialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this highlight?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the homepage carousel.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}
