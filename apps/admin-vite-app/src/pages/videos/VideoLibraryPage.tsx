import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Film, Loader2, Plus, Upload as UploadIcon, Link as LinkIcon, CheckCircle2, Video, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Input, Button, MediaUpload, HeroVideoDialog } from "shared-ui";
import { PageContainer } from "@/components/composite/PageContainer";
import { videoApi } from "@/shared/api";
import { useVideoUpload } from "@/shared/hooks/use-video-upload";
import { cn } from "@/shared/lib/utils";

type AddTabValue = "upload" | "url";

function AddVideoModal({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [activeTab, setActiveTab] = useState<AddTabValue>("upload");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isCreatingFromUrl, setIsCreatingFromUrl] = useState(false);

  const { upload, isUploading } = useVideoUpload({
    youtubeTitle: "Uploaded via Library",
    privacyStatus: "unlisted",
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    },
    onError: () => {
      alert("Upload failed. Please try again.");
    }
  });

  const handleCreateFromUrl = async () => {
    try {
      const match = youtubeLink.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
      if (!match) {
        alert("Invalid YouTube URL");
        return;
      }
      setIsCreatingFromUrl(true);
      await videoApi.create({
        youtubeVideoId: match[1],
        title: "Imported via URL",
        privacyStatus: "public",
        visible: true,
      });
      onSuccess();
      onOpenChange(false);
      setYoutubeLink("");
    } catch (error) {
      console.error(error);
      alert("Failed to import video. Please try again.");
    } finally {
      setIsCreatingFromUrl(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
          <DialogDescription>
            Upload a video file to YouTube or import an existing YouTube URL.
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full items-center gap-2 rounded-lg bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-sm font-medium transition-all",
              activeTab === "upload" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UploadIcon className="h-4 w-4" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-sm font-medium transition-all",
              activeTab === "url" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LinkIcon className="h-4 w-4" /> From URL
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "upload" && (
            <div className="relative">
              <MediaUpload
                id="modal-video-upload"
                value=""
                accept="video/*"
                placeholder="Drag & drop a video or click to upload"
                onChange={(_, file) => {
                  if (file) upload(file);
                }}
                disabled={isUploading}
                className="h-[250px]"
              />
              {isUploading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-amber-500" />
                  <p className="text-sm font-medium text-amber-600">Uploading to YouTube...</p>
                  <p className="mt-1 text-xs text-muted-foreground text-center px-4">
                    Please keep this window open until the upload completes.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "url" && (
            <div className="flex h-[250px] flex-col justify-center space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">YouTube Video URL</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    disabled={isCreatingFromUrl}
                  />
                  <Button 
                    onClick={handleCreateFromUrl}
                    disabled={!youtubeLink || isCreatingFromUrl}
                    className="shrink-0"
                  >
                    {isCreatingFromUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : "Import"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste any public or unlisted YouTube video link.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function VideoLibraryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [videoToRemove, setVideoToRemove] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const { data: videos, isLoading, refetch } = useQuery({
    queryKey: ["video-list"],
    queryFn: () => videoApi.getList().then((res) => res.data.data.videos),
  });

  const handleConfirmRemove = async () => {
    if (videoToRemove === null) return;
    setIsRemoving(true);
    try {
      await videoApi.remove(videoToRemove);
      refetch();
      setVideoToRemove(null);
    } catch (error) {
      console.error(error);
      alert("Failed to remove video.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <PageContainer
      title="Video Library"
      description="Manage all videos uploaded or imported into your CMS."
      actions={
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Video
        </Button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Loading library...</p>
          </div>
        ) : !videos || videos.length === 0 ? (
          <div className="col-span-full flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground bg-muted/20">
            <Film className="h-8 w-8 opacity-20" />
            <p className="text-sm font-medium">No videos found</p>
            <p className="text-xs">Click 'Add Video' to upload or import from YouTube.</p>
          </div>
        ) : (
          videos.map((video) => (
            <div
              key={video.id}
              className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                {video.youtubeHighThumbnailUrl || video.youtubeMediumThumbnailUrl || video.youtubeThumbnailUrl ? (
                  <HeroVideoDialog
                    videoSrc={`${video.youtubeEmbedUrl || video.youtubeUrl}?autoplay=1`}
                    thumbnailSrc={video.youtubeHighThumbnailUrl || video.youtubeMediumThumbnailUrl || video.youtubeThumbnailUrl}
                    thumbnailAlt={video.title}
                    className="h-full w-full"
                    animationStyle="from-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted/50">
                    <Video className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 text-sm font-medium" title={video.title}>
                    {video.title || "Untitled Video"}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoToRemove(video.id);
                    }}
                    title="Remove Video"
                    className="shrink-0 rounded text-muted-foreground hover:bg-red-500/10 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {video.status}
                  </span>
                  <span>{new Date(video.createdTime).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddVideoModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
        onSuccess={() => refetch()} 
      />

      <Dialog open={videoToRemove !== null} onOpenChange={(open) => !open && setVideoToRemove(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">Remove Video</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this video? This action cannot be undone. 
              The video will be permanently deleted from the database and YouTube.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setVideoToRemove(null)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={isRemoving}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRemoving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isRemoving ? "Removing..." : "Remove"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
