import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Film, Palette, Plus, Video, X } from "lucide-react";
import { useSection, useUpdateSectionData } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { EntityList } from "@/components/composite/EntityList";
import { EntityFormDialog } from "@/components/composite/EntityFormDialog";
import { ConfirmDialog } from "@/components/composite/ConfirmDialog";
import { EmptyState } from "@/components/composite/EmptyState";
import { FormField } from "@/components/composite/FormField";
import { ColorField } from "@/components/composite/ColorField";
import { RichTextEditor } from "@/components/composite/RichTextEditor";
import { VideoLibraryModal } from "@/components/composite/VideoLibraryModal";
import { SaveBar } from "@/components/composite/SaveBar";
import { Input, Button } from "shared-ui";
import type { HighlightVideo } from "@/features/highlights/types/highlights.types";
import type { ThemedSection } from "@/shared/types";

const BLANK: HighlightVideo = { id: "", videoUrl: "", title: "", subtitle: "" };

function extractYoutubeId(input: string): string | null {
  const value = input?.trim();
  if (!value) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const match = value.match(re);
    if (match) return match[1];
  }
  return null;
}

export function WeddingHighlightsPage() {
  const [searchParams] = useSearchParams();
  const sectionId = Number(searchParams.get("id"));

  const { data: section, isLoading } = useSection(sectionId);
  const { mutate: updateSection, isPending: isSaving } = useUpdateSectionData();

  const map = section?.data?.map ?? {};
  const rawConfig = map.config ?? {};
  const serverConfig = (typeof rawConfig === "string" ? JSON.parse(rawConfig) : rawConfig) as ThemedSection;
  const serverItems = (Array.isArray(map.items) ? map.items : []) as HighlightVideo[];

  // ── Config form (no own SaveBar) ────────────────────────────────
  const configForm = useForm<ThemedSection>({ defaultValues: serverConfig });
  const { register: regCfg, control: ctrlCfg, formState: { isDirty: isConfigDirty } } = configForm;

  useEffect(() => {
    if (section) configForm.reset(serverConfig);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  // ── Items local state ────────────────────────────────────────────
  // null = no unsaved changes; array = user has pending edits
  const [localItems, setLocalItems] = useState<HighlightVideo[] | null>(null);
  const displayItems = localItems ?? serverItems;
  const isDirty = localItems !== null || isConfigDirty;

  // ── Dialog / delete state ────────────────────────────────────────
  const [dialog, setDialog] = useState<{ mode: "add" | "edit"; initial: HighlightVideo } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<HighlightVideo | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const itemForm = useForm<HighlightVideo>({ defaultValues: BLANK });

  const openAdd = () => { itemForm.reset(BLANK); setDialog({ mode: "add", initial: BLANK }); };
  const openEdit = (item: HighlightVideo) => { itemForm.reset(item); setDialog({ mode: "edit", initial: item }); };

  const submitDialog = itemForm.handleSubmit((values) => {
    if (!dialog) return;
    setLocalItems(
      dialog.mode === "add"
        ? [...displayItems, values]
        : displayItems.map((i) => (i.id === dialog.initial.id ? values : i)),
    );
    setDialog(null);
  });

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setLocalItems(displayItems.filter((i) => i.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  // ── Main save (config + items together) ─────────────────────────
  const save = () => {
    const config = configForm.getValues();
    updateSection(
      { id: sectionId, data: { config, items: localItems ?? serverItems } as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          setLocalItems(null);
          configForm.reset(config);
        },
      },
    );
  };

  const reset = () => {
    setLocalItems(null);
    configForm.reset(serverConfig);
  };

  if (isLoading) {
    return (
      <PageContainer title="Highlight Đám Cưới" description="Đang tải...">
        <div className="p-8">Đang tải...</div>
      </PageContainer>
    );
  }

  const pageTitle = [serverConfig.titlePrefix, serverConfig.titleHighlight].filter(Boolean).join(" ") || "Highlight Đám Cưới";

  return (
    <PageContainer
      title={pageTitle}
      description="Video highlight nổi bật. Carousel dạng thẻ trên desktop, lưới trên mobile."
    >
      {/* Config fields — no own SaveBar */}
      <SectionCard
        icon={<Palette className="h-4 w-4" />}
        title="Tiêu đề phần"
        description="Kiểm soát cách phần này hiển thị trên trang công khai."
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Eyebrow" htmlFor="cfg-eyebrow">
              <div className="flex gap-2">
                <Input id="cfg-eyebrow" className="flex-1" placeholder="Featured Works" {...regCfg("eyebrow")} />
                <Controller control={ctrlCfg} name="eyebrowColor" render={({ field }) => (
                  <ColorField id="cfg-eyebrow-color" value={field.value ?? ""} onChange={field.onChange} />
                )} />
              </div>
            </FormField>
            <FormField label="Màu nền" htmlFor="cfg-bg">
              <Controller control={ctrlCfg} name="backgroundColor" render={({ field }) => (
                <ColorField id="cfg-bg" value={field.value} onChange={field.onChange} />
              )} />
            </FormField>
            <FormField label="Tiền tố tiêu đề" htmlFor="cfg-title">
              <div className="flex gap-2">
                <Input id="cfg-title" className="flex-1" placeholder="Wedding" {...regCfg("titlePrefix")} />
                <Controller control={ctrlCfg} name="titlePrefixColor" render={({ field }) => (
                  <ColorField id="cfg-title-color" value={field.value ?? ""} onChange={field.onChange} />
                )} />
              </div>
            </FormField>
            <FormField label="Từ in nghiêng nổi bật" htmlFor="cfg-highlight">
              <div className="flex gap-2">
                <Input id="cfg-highlight" className="flex-1" placeholder="Highlights" {...regCfg("titleHighlight")} />
                <Controller control={ctrlCfg} name="titleHighlightColor" render={({ field }) => (
                  <ColorField id="cfg-highlight-color" value={field.value ?? ""} onChange={field.onChange} />
                )} />
              </div>
            </FormField>
          </div>
          <FormField label="Mô tả">
            <Controller control={ctrlCfg} name="description" render={({ field }) => (
              <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Mô tả ngắn cho phần này" />
            )} />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Màu chữ</span>
              <Controller control={ctrlCfg} name="descriptionColor" render={({ field }) => (
                <ColorField id="cfg-desc-color" value={field.value ?? ""} onChange={field.onChange} />
              )} />
            </div>
          </FormField>
        </div>
      </SectionCard>

      {/* Video list */}
      <SectionCard
        icon={<Film className="h-4 w-4" />}
        title="Video"
        description={`${displayItems.length} video đang xoay vòng`}
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Thêm video
          </Button>
        }
      >
        <EntityList
          items={displayItems}
          getKey={(item) => item.id}
          onEdit={openEdit}
          onDelete={(item) => setPendingDelete(item)}
          emptyState={
            <EmptyState
              icon={<Film className="h-4 w-4" />}
              title="Chưa có highlight nào"
              description="Thêm video YouTube để điền vào carousel trang chủ."
              action={
                <Button size="sm" onClick={openAdd}>
                  <Plus className="h-4 w-4" />
                  Thêm video đầu tiên
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

      {/* Add / edit dialog */}
      <EntityFormDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.mode ?? "add"}
        entityLabel="Video"
        description="Chọn video từ thư viện, sau đó điền tiêu đề và phụ đề."
        onSubmit={submitDialog}
      >
        <Controller
          control={itemForm.control}
          name="id"
          render={({ field }) => {
            const ytId = field.value;
            return (
              <div className="space-y-2">
                <label className="text-sm font-medium">Video</label>
                {ytId ? (
                  <div className="relative overflow-hidden rounded-lg border border-border/60 bg-muted/30">
                    <div className="aspect-video">
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                        alt="Thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => { field.onChange(""); itemForm.setValue("videoUrl", ""); }}
                      className="absolute right-2 top-2 z-20 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
                      aria-label="Xóa video"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div
                      className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
                      onClick={() => setVideoModalOpen(true)}
                    >
                      <p className="font-medium text-white">Nhấp để thay đổi video</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setVideoModalOpen(true)}
                    className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 transition hover:border-muted-foreground/50 hover:bg-muted/30"
                  >
                    <Video className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm text-muted-foreground">Nhấp để chọn video từ thư viện</p>
                  </div>
                )}
                <VideoLibraryModal
                  open={videoModalOpen}
                  onOpenChange={setVideoModalOpen}
                  onSelect={(url) => {
                    const id = extractYoutubeId(url);
                    if (id) {
                      field.onChange(id);
                      itemForm.setValue("videoUrl", url);
                    }
                  }}
                />
              </div>
            );
          }}
        />
        <FormField label="Tiêu đề" htmlFor="hl-title">
          <Input id="hl-title" {...itemForm.register("title")} />
        </FormField>
        <FormField label="Phụ đề" htmlFor="hl-sub">
          <Input id="hl-sub" placeholder="Đà Lạt · Spring 2024" {...itemForm.register("subtitle")} />
        </FormField>
      </EntityFormDialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Xóa highlight này?"
        description={pendingDelete ? `"${pendingDelete.title}" sẽ bị xóa khỏi carousel trang chủ.` : undefined}
        confirmLabel="Xóa"
        destructive
        onConfirm={confirmDelete}
      />

      {/* Single SaveBar for everything */}
      <SaveBar
        isDirty={isDirty}
        isSubmitting={isSaving}
        onSave={save}
        onReset={reset}
        saveLabel="Lưu highlight"
      />
    </PageContainer>
  );
}
