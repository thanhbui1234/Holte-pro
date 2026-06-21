import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Palette, Plus, Trash2, Video, Youtube, X } from "lucide-react";
import { useSection, useUpdateSectionData } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { EntityList } from "@/components/composite/EntityList";
import { EntityFormDialog } from "@/components/composite/EntityFormDialog";
import { ConfirmDialog } from "@/components/composite/ConfirmDialog";
import { EmptyState } from "@/components/composite/EmptyState";
import { FormField } from "@/components/composite/FormField";
import { FormMediaField } from "@/components/composite/FormMediaField";
import { ColorField } from "@/components/composite/ColorField";
import { VideoLibraryModal } from "@/components/composite/VideoLibraryModal";
import { SaveBar } from "@/components/composite/SaveBar";
import { TagInput } from "@/components/composite/TagInput";
import { Badge, Input, Textarea, Button } from "shared-ui";
import type { FilmItem, FilmPreviewImage } from "@/features/films/types/films.types";
import type { ThemedSection } from "@/shared/types";

const blankPreviewImage = (): FilmPreviewImage => ({
  src: "",
  title: "",
  topic: "",
  description: "",
  attribute: "",
});

const blankFilm = (): FilmItem => ({
  id: `film-${Date.now().toString(36)}`,
  youtubeUrl: "",
  videoUrl: "",
  title: "",
  subtitle: "",
  description: "",
  tags: [],
  image: "",
  previewImages: [],
});

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

export function TraditionalFilmsPage() {
  const [searchParams] = useSearchParams();
  const sectionId = Number(searchParams.get("id"));

  const { data: section, isLoading } = useSection(sectionId);
  const { mutate: updateSection, isPending: isSaving } = useUpdateSectionData();

  const map = section?.data?.map ?? {};
  const rawConfig = map.config ?? {};
  const serverConfig = (typeof rawConfig === "string" ? JSON.parse(rawConfig) : rawConfig) as ThemedSection;
  const serverItems = (Array.isArray(map.items) ? map.items : []) as FilmItem[];

  // ── Config form (no own SaveBar) ─────────────────────────────────
  const configForm = useForm<ThemedSection>({ defaultValues: serverConfig });
  const { register: regCfg, control: ctrlCfg, formState: { isDirty: isConfigDirty } } = configForm;

  useEffect(() => {
    if (section) configForm.reset(serverConfig);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  // ── Items local state ────────────────────────────────────────────
  const [localItems, setLocalItems] = useState<FilmItem[] | null>(null);
  const displayItems = localItems ?? serverItems;
  const isDirty = localItems !== null || isConfigDirty;

  // ── Dialog / delete / video modal ────────────────────────────────
  const [dialog, setDialog] = useState<{ mode: "add" | "edit"; initial: FilmItem } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FilmItem | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const itemForm = useForm<FilmItem>({ defaultValues: blankFilm() });
  const previewImages = useFieldArray({ control: itemForm.control, name: "previewImages" });
  const watchedYoutubeUrl = itemForm.watch("youtubeUrl");
  const ytIdPreview = extractYoutubeId(watchedYoutubeUrl);

  const openAdd = () => { itemForm.reset(blankFilm()); setDialog({ mode: "add", initial: blankFilm() }); };
  const openEdit = (item: FilmItem) => { itemForm.reset(item); setDialog({ mode: "edit", initial: item }); };

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

  // ── Main save ────────────────────────────────────────────────────
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

  const resetAll = () => {
    setLocalItems(null);
    configForm.reset(serverConfig);
  };

  if (isLoading) {
    return (
      <PageContainer title="Phim Truyền Thống" description="Đang tải...">
        <div className="p-8">Đang tải...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Phim Truyền Thống"
      description="Phim dài nổi bật trong phần di sản."
    >
      {/* Config fields */}
      <SectionCard
        icon={<Palette className="h-4 w-4" />}
        title="Tiêu đề phần"
        description="Kiểm soát cách phần này hiển thị trên trang công khai."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Eyebrow" htmlFor="cfg-eyebrow">
            <Input id="cfg-eyebrow" placeholder="Featured Works" {...regCfg("eyebrow")} />
          </FormField>
          <FormField label="Màu nền" htmlFor="cfg-bg">
            <Controller
              control={ctrlCfg}
              name="backgroundColor"
              render={({ field }) => (
                <ColorField id="cfg-bg" value={field.value} onChange={field.onChange} />
              )}
            />
          </FormField>
          <FormField label="Tiền tố tiêu đề" htmlFor="cfg-title">
            <Input id="cfg-title" placeholder="Traditional" {...regCfg("titlePrefix")} />
          </FormField>
          <FormField label="Từ in nghiêng nổi bật" htmlFor="cfg-highlight">
            <Input id="cfg-highlight" placeholder="Films" {...regCfg("titleHighlight")} />
          </FormField>
          <FormField label="Mô tả" htmlFor="cfg-desc" className="md:col-span-2">
            <Textarea id="cfg-desc" rows={3} placeholder="Mô tả ngắn cho phần này" {...regCfg("description")} />
          </FormField>
        </div>
      </SectionCard>

      {/* Film list */}
      <SectionCard
        icon={<Video className="h-4 w-4" />}
        title="Phim"
        description={`${displayItems.length} phim đã đăng`}
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Thêm phim
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
              icon={<Video className="h-4 w-4" />}
              title="Chưa có phim nào"
              description="Đăng phim truyền thống đầu tiên để điền vào hàng trang chủ."
              action={
                <Button size="sm" onClick={openAdd}>
                  <Plus className="h-4 w-4" />
                  Thêm phim đầu tiên
                </Button>
              }
            />
          }
          renderRow={(item) => {
            const ytId = extractYoutubeId(item.youtubeUrl);
            return (
              <div className="flex items-center gap-3">
                <div className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                  {ytId ? (
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : item.videoUrl ? (
                    <video src={item.videoUrl} className="h-full w-full object-cover" />
                  ) : item.image ? (
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      Không có phương tiện
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {item.youtubeUrl && (
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
                      >
                        <Youtube className="h-3 w-3" />
                        YouTube
                      </a>
                    )}
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="border-transparent bg-muted text-[10px] font-medium text-foreground/70"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </SectionCard>

      {/* Add / edit dialog */}
      <EntityFormDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.mode ?? "add"}
        entityLabel="Phim"
        onSubmit={submitDialog}
      >
        {/* Video picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Video</label>
          {ytIdPreview ? (
            <div className="relative overflow-hidden rounded-lg border border-border/60 bg-muted/30">
              <div className="aspect-video">
                <img
                  src={`https://img.youtube.com/vi/${ytIdPreview}/mqdefault.jpg`}
                  alt="Thumbnail"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => { itemForm.setValue("youtubeUrl", ""); itemForm.setValue("videoUrl", ""); }}
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
              itemForm.setValue("youtubeUrl", url, { shouldDirty: true });
              itemForm.setValue("videoUrl", "");
            }}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Tiêu đề" htmlFor="film-title">
            <Input id="film-title" {...itemForm.register("title")} />
          </FormField>
          <FormField label="Phụ đề" htmlFor="film-sub">
            <Input id="film-sub" placeholder="Hà Nội · 2024" {...itemForm.register("subtitle")} />
          </FormField>
        </div>
        <FormField label="Mô tả" htmlFor="film-desc">
          <Textarea id="film-desc" rows={3} {...itemForm.register("description")} />
        </FormField>
        <FormMediaField control={itemForm.control} name="image" label="Nguồn ảnh" accept="image/*" urlOnly />
        <FormField label="Thẻ">
          <Controller
            control={itemForm.control}
            name="tags"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>

        {/* Preview images */}
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Ảnh xem trước</p>
              <p className="text-xs text-muted-foreground">
                Mỗi ảnh có tiêu đề, chủ đề, mô tả và thuộc tính riêng.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => previewImages.append(blankPreviewImage())}
            >
              <Plus className="h-4 w-4" />
              Thêm ảnh
            </Button>
          </div>

          {previewImages.fields.length === 0 ? (
            <p className="rounded-md border border-dashed bg-background px-3 py-6 text-center text-xs text-muted-foreground">
              Chưa có ảnh xem trước.
            </p>
          ) : (
            <div className="space-y-3">
              {previewImages.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-3 rounded-md border border-border/60 bg-background p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Ảnh {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => previewImages.remove(index)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Xóa ảnh"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <FormMediaField
                    control={itemForm.control}
                    name={`previewImages.${index}.src` as const}
                    label="Nguồn ảnh"
                    accept="image/*"
                    urlOnly
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Tiêu đề ảnh">
                      <Input {...itemForm.register(`previewImages.${index}.title` as const)} />
                    </FormField>
                    <FormField label="Chủ đề ảnh">
                      <Input {...itemForm.register(`previewImages.${index}.topic` as const)} />
                    </FormField>
                  </div>
                  <FormField label="Mô tả ảnh">
                    <Textarea rows={2} {...itemForm.register(`previewImages.${index}.description` as const)} />
                  </FormField>
                  <FormField label="Thuộc tính ảnh">
                    <Input
                      placeholder="Địa điểm, năm, v.v."
                      {...itemForm.register(`previewImages.${index}.attribute` as const)}
                    />
                  </FormField>
                </div>
              ))}
            </div>
          )}
        </div>
      </EntityFormDialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Xóa phim này?"
        description={pendingDelete ? `"${pendingDelete.title}" sẽ bị xóa khỏi lưới di sản.` : undefined}
        confirmLabel="Xóa"
        destructive
        onConfirm={confirmDelete}
      />

      {/* Single SaveBar for config + items */}
      <SaveBar
        isDirty={isDirty}
        isSubmitting={isSaving}
        onSave={save}
        onReset={resetAll}
        saveLabel="Lưu phim"
      />
    </PageContainer>
  );
}
