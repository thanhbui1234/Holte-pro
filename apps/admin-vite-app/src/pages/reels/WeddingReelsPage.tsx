import { useState } from "react";
import { useForm } from "react-hook-form";
import { Clapperboard, Clock, Link2, MapPin, Plus, Youtube } from "lucide-react";
import { useReels, useReelsConfig, useUpdateReelsConfig, useCreateReel, useUpdateReel, useRemoveReel } from "@/features/reels/hooks/use-reels";
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
import { Textarea } from "shared-ui";
import { Button } from "shared-ui";
import type { ReelItem } from "@/features/reels/types/reels.types";

const blankReel = (): ReelItem => ({
  id: `reel-${Date.now().toString(36)}`,
  youtubeUrl: "",
  videoUrl: "",
  title: "",
  description: "",
  duration: "",
  location: "",
});

/** Extract a YouTube video id from a watch / shorts / youtu.be / embed URL, or return the bare id. */
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

export function WeddingReelsPage() {
  const { data: items = [], isLoading: loadingItems } = useReels();
  const { data: config, isLoading: loadingConfig } = useReelsConfig();
  const { mutate: saveConfig } = useUpdateReelsConfig();
  const { mutate: add } = useCreateReel();
  const { mutate: update } = useUpdateReel();
  const { mutate: remove } = useRemoveReel();

  const [dialog, setDialog] = useState<{ mode: "add" | "edit" } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ReelItem | null>(null);
  const [videoSourceType, setVideoSourceType] = useState<"upload" | "youtube">("upload");

  const form = useForm<ReelItem>({ defaultValues: blankReel() });
  const watchedYoutubeUrl = form.watch("youtubeUrl");

  const openAdd = () => {
    form.reset(blankReel());
    setVideoSourceType("upload");
    setDialog({ mode: "add" });
  };

  const openEdit = (item: ReelItem) => {
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
    return <PageContainer title="Wedding Reels" description="Loading..."><div className="p-8">Loading...</div></PageContainer>;
  }

  return (
    <PageContainer
      title="Wedding Reels"
      description="Short-form vertical reels rendered as a horizontal scroller."
    >
      {config && <SectionConfigForm value={config} onSave={saveConfig} />}

      <SectionCard
        icon={<Clapperboard className="h-4 w-4" />}
        title="Reels"
        description={`${items.length} reels in rotation`}
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add reel
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
              icon={<Clapperboard className="h-4 w-4" />}
              title="No reels yet"
              description="Add a short reel to start the rotation."
              action={
                <Button size="sm" onClick={openAdd}>
                  <Plus className="h-4 w-4" />
                  Add first reel
                </Button>
              }
            />
          }
          renderRow={(item) => {
            const ytId = extractYoutubeId(item.youtubeUrl);
            return (
              <div className="flex items-center gap-3">
                <div className="relative flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
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
                  ) : (
                    <Clapperboard className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.description && (
                    <p className="truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </span>
                    {item.youtubeUrl && (
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
                      >
                        <Youtube className="h-3 w-3" />
                        YouTube
                      </a>
                    )}
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
        entityLabel="Reel"
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
            <FormField label="Upload Video" htmlFor="reel-video">
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
              htmlFor="reel-youtube"
              hint="Paste a full YouTube URL (watch, shorts, or youtu.be) or the bare 11-character video ID."
            >
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reel-youtube"
                  className="pl-9"
                  placeholder="https://www.youtube.com/shorts/..."
                  {...form.register("youtubeUrl")}
                />
              </div>
              <YoutubePreview url={watchedYoutubeUrl} />
            </FormField>
          )}
        </div>
        <FormField label="Title" htmlFor="reel-title">
          <Input id="reel-title" {...form.register("title")} />
        </FormField>
        <FormField label="Description" htmlFor="reel-desc">
          <Textarea
            id="reel-desc"
            rows={3}
            placeholder="One or two lines about this reel."
            {...form.register("description")}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Duration" htmlFor="reel-duration">
            <Input id="reel-duration" placeholder="0:45" {...form.register("duration")} />
          </FormField>
          <FormField label="Location" htmlFor="reel-location">
            <Input id="reel-location" placeholder="Đà Lạt" {...form.register("location")} />
          </FormField>
        </div>
      </EntityFormDialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this reel?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the reels scroller.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => pendingDelete && remove(pendingDelete.id)}
      />
    </PageContainer>
  );
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
