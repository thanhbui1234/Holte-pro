import { useQuery } from "@tanstack/react-query";
import { Loader2, Video, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, HeroVideoDialog } from "shared-ui";
import { videoApi } from "@/shared/api";
import { cn } from "@/shared/lib/utils";

interface VideoLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (youtubeUrl: string) => void;
}

export function VideoLibraryModal({ open, onOpenChange, onSelect }: VideoLibraryModalProps) {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["video-list"],
    queryFn: () => videoApi.getList().then((res) => res.data.data.videos),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Select Video</DialogTitle>
          <DialogDescription>
            Choose a video from your library. To add new videos, go to the Video Library section.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="text-sm">Loading library...</p>
              </div>
            ) : !videos || videos.length === 0 ? (
              <div className="col-span-full flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground bg-muted/20">
                <Video className="h-8 w-8 opacity-20" />
                <p className="text-sm font-medium">No videos found</p>
                <p className="text-xs">Go to the Video Library to upload or import videos.</p>
              </div>
            ) : (
              videos.map((video) => (
                <div
                  key={video.id}
                  className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:border-amber-500 hover:ring-1 hover:ring-amber-500"
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
                  <div className="p-2 space-y-2">
                    <p className="line-clamp-1 text-[13px] font-medium leading-tight" title={video.title}>
                      {video.title || "Untitled Video"}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {video.status}
                      </span>
                      <span>{new Date(video.createdTime).toLocaleDateString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(video.youtubeEmbedUrl || video.youtubeUrl);
                        onOpenChange(false);
                      }}
                      className="w-full rounded-md bg-amber-500/10 py-1.5 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-500 hover:text-stone-950 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-stone-950"
                    >
                      Select Video
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
