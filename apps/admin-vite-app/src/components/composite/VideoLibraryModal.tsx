import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Video, CheckCircle2, PlayCircle, Plus } from "lucide-react";
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

  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-5xl p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-md border-muted/50 shadow-2xl"
        onInteractOutside={(e) => {
          if (isPlayingVideo) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isPlayingVideo) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="px-6 py-5 border-b border-muted/30 bg-muted/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-500" />
            Chọn video từ thư viện
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Duyệt và chọn video để thêm vào section. Cần video mới? Tải lên trong Thư viện video.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 bg-muted/5">
          <div className="max-h-[65vh] overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-muted bg-card/30">
                <div className="p-4 rounded-full bg-muted/50 animate-pulse">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Đang tải thư viện...</p>
              </div>
            ) : !videos || videos.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted bg-card/30">
                <div className="p-4 rounded-full bg-muted/50">
                  <Video className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-foreground">Không tìm thấy video</p>
                  <p className="text-sm text-muted-foreground mt-1">Tải lên video đầu tiên trong Thư viện video.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/40 hover:-translate-y-1"
                  >
                    <div className="aspect-video relative overflow-hidden bg-black/5 dark:bg-white/5">
                      {video.youtubeHighThumbnailUrl || video.youtubeMediumThumbnailUrl || video.youtubeThumbnailUrl ? (
                        <div className="w-full h-full">
                          <HeroVideoDialog
                            videoSrc={`${video.youtubeEmbedUrl || video.youtubeUrl}?autoplay=1`}
                            thumbnailSrc={video.youtubeHighThumbnailUrl || video.youtubeMediumThumbnailUrl || video.youtubeThumbnailUrl}
                            thumbnailAlt={video.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            animationStyle="from-center"
                            onOpenChange={(isOpen) => setIsPlayingVideo(isOpen)}
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted/30">
                          <Video className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-1 p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" title={video.title}>
                        {video.title || "Video không có tiêu đề"}
                      </h3>
                      
                      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground mb-4 font-medium">
                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {video.status}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider opacity-70">
                          {new Date(video.createdTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(video.youtubeEmbedUrl || video.youtubeUrl);
                          onOpenChange(false);
                        }}
                        className="relative w-full overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800 px-4 py-2.5 text-sm font-semibold text-stone-900 dark:text-stone-100 transition-all duration-300 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-stone-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Plus className="h-4 w-4" />
                          Chọn để thêm
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

