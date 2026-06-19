import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Link2, Plus, Trash2, Video, Youtube } from "lucide-react";
import { useFilms, useFilmsConfig, useUpdateFilmsConfig, useCreateFilm, useUpdateFilm, useRemoveFilm } from "@/features/films/hooks/use-films";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { SectionConfigForm } from "@/components/composite/SectionConfigForm";
import { EntityList } from "@/components/composite/EntityList";
import { EntityFormDialog } from "@/components/composite/EntityFormDialog";
import { ConfirmDialog } from "@/components/composite/ConfirmDialog";
import { EmptyState } from "@/components/composite/EmptyState";
import { FormField } from "@/components/composite/FormField";
import { FormMediaField } from "@/components/composite/FormMediaField";
import { TagInput } from "@/components/composite/TagInput";
import { Badge } from "shared-ui";
import { Input } from "shared-ui";
import { Textarea } from "shared-ui";
import { Button } from "shared-ui";
import type { FilmItem, FilmPreviewImage } from "@/features/films/types/films.types";

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

export function TraditionalFilmsPage() {
  const { data: items = [], isLoading: loadingItems } = useFilms();
  const { data: config, isLoading: loadingConfig } = useFilmsConfig();
  const { mutate: saveConfig } = useUpdateFilmsConfig();
  const { mutate: add } = useCreateFilm();
  const { mutate: update } = useUpdateFilm();
  const { mutate: remove } = useRemoveFilm();

  const [dialog, setDialog] = useState<{ mode: "add" | "edit" } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FilmItem | null>(null);
  const [videoSourceType, setVideoSourceType] = useState<"upload" | "youtube">("upload");

  const form = useForm<FilmItem>({ defaultValues: blankFilm() });
  const previewImages = useFieldArray({ control: form.control, name: "previewImages" });
  const watchedYoutubeUrl = form.watch("youtubeUrl");

  const openAdd = () => {
    form.reset(blankFilm());
    setVideoSourceType("upload");
    setDialog({ mode: "add" });
  };

  const openEdit = (item: FilmItem) => {
    form.reset(item);
    setVideoSourceType(item.youtubeUrl ? "youtube" : "upload");
    setDialog({ mode: "edit" });
  };

  const submit = form.handleSubmit((values) => {
    if (!dialog) return;
    if (dialog.mode === "add") add(values);
    else update(values);
    setDialog(null);
  });

  if (loadingItems || loadingConfig) {
    return <PageContainer title="Traditional Films" description="Loading..."><div className="p-8">Loading...</div></PageContainer>;
  }

  return (
    <PageContainer
      title="Traditional Films"
      description="Long-form films featured in the heritage section."
    >
      {config && <SectionConfigForm value={config} onSave={saveConfig} />}

      <SectionCard
        icon={<Video className="h-4 w-4" />}
        title="Films"
        description={`${items.length} films published`}
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add film
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
              icon={<Video className="h-4 w-4" />}
              title="No films yet"
              description="Publish your first traditional film to populate the homepage row."
              action={
                <Button size="sm" onClick={openAdd}>
                  <Plus className="h-4 w-4" />
                  Add first film
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
                    <video
                      src={item.videoUrl}
                      className="h-full w-full object-cover"
                    />
                  ) : item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No media
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

      <EntityFormDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.mode ?? "add"}
        entityLabel="Film"
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
            <FormField label="Upload Video" htmlFor="film-video">
              <FormMediaField
                control={form.control}
                name="videoUrl"
                label=""
                accept=".mp4,.mov,.avi,.mkv,.wmv,.flv,.webm,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/x-ms-wmv,video/x-flv,video/webm"
                placeholder="Drag & drop or click to upload video file"
              />
            </FormField>
          ) : (
            <FormField
              label="YouTube link"
              htmlFor="film-youtube"
              hint="Paste a full YouTube URL or the bare 11-character video ID."
            >
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="film-youtube"
                  className="pl-9"
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...form.register("youtubeUrl")}
                />
              </div>
              <YoutubePreview url={watchedYoutubeUrl} />
            </FormField>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="film-title">
            <Input id="film-title" {...form.register("title")} />
          </FormField>
          <FormField label="Subtitle" htmlFor="film-sub">
            <Input
              id="film-sub"
              placeholder="Hà Nội · 2024"
              {...form.register("subtitle")}
            />
          </FormField>
        </div>
        <FormField label="Description" htmlFor="film-desc">
          <Textarea id="film-desc" rows={3} {...form.register("description")} />
        </FormField>
        <FormMediaField
          control={form.control}
          name="image"
          label="Image source"
          accept="image/*"
        />
        <FormField label="Tags">
          <Controller
            control={form.control}
            name="tags"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>

        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Preview images</p>
              <p className="text-xs text-muted-foreground">
                Each image carries its own title, topic, description and attribute.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => previewImages.append(blankPreviewImage())}
            >
              <Plus className="h-4 w-4" />
              Add image
            </Button>
          </div>

          {previewImages.fields.length === 0 ? (
            <p className="rounded-md border border-dashed bg-background px-3 py-6 text-center text-xs text-muted-foreground">
              No preview images yet.
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
                      Image {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => previewImages.remove(index)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <FormMediaField
                    control={form.control}
                    name={`previewImages.${index}.src` as const}
                    label="Image source"
                    accept="image/*"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Image title">
                      <Input
                        {...form.register(`previewImages.${index}.title` as const)}
                      />
                    </FormField>
                    <FormField label="Image topic">
                      <Input
                        {...form.register(`previewImages.${index}.topic` as const)}
                      />
                    </FormField>
                  </div>
                  <FormField label="Image description">
                    <Textarea
                      rows={2}
                      {...form.register(`previewImages.${index}.description` as const)}
                    />
                  </FormField>
                  <FormField label="Image attribute">
                    <Input
                      placeholder="Location, year, etc."
                      {...form.register(`previewImages.${index}.attribute` as const)}
                    />
                  </FormField>
                </div>
              ))}
            </div>
          )}
        </div>
      </EntityFormDialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this film?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the heritage grid.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => pendingDelete && remove(pendingDelete.id)}
      />
    </PageContainer>
  );
}

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

function YoutubePreview({ url }: { url: string }) {
  if (!url?.trim()) return null;
  const id = extractYoutubeId(url);
  if (!id) {
    return (
      <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-destructive">
        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
        Couldn't read a video ID from that link.
      </p>
    );
  }
  return (
    <div className="mt-2 flex items-center gap-3 rounded-md border border-border/60 bg-muted/40 p-2">
      <img
        src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
        alt="YouTube thumbnail preview"
        className="h-12 w-20 shrink-0 rounded object-cover"
      />
      <div className="min-w-0">
        <p className="text-xs font-medium">Detected video</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground">
          {id}
        </p>
      </div>
    </div>
  );
}
