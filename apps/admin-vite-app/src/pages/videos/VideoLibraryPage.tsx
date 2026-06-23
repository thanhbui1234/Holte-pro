import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Film, Loader2, Plus, Upload as UploadIcon, Link as LinkIcon, CheckCircle2, Video, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Input, Textarea, Button, MediaUpload, HeroVideoDialog } from "shared-ui";
import { PageContainer } from "@/components/composite/PageContainer";
import { videoApi, getApiErrorMessage, extractApiError } from "@/shared/api";
import { triggerNextJsRevalidate } from "@/shared/api/revalidate";
import { useVideoUpload } from "@/shared/hooks/use-video-upload";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

type AddTabValue = "upload" | "url";

function AddVideoModal({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [activeTab, setActiveTab] = useState<AddTabValue>("upload");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isCreatingFromUrl, setIsCreatingFromUrl] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeDescription, setYoutubeDescription] = useState("");
  
  const [urlTitle, setUrlTitle] = useState("");
  const [urlDescription, setUrlDescription] = useState("");

  const { upload } = useVideoUpload({
    privacyStatus: "unlisted",
    onSuccess: () => {
      setSelectedFile(null);
      setYoutubeTitle("");
      setYoutubeDescription("");
      onSuccess();
      onOpenChange(false);
    },
    onError: () => {
      // Errors are handled by the background upload manager now
    }
  });

  const handleCreateFromUrl = async () => {
    try {
      const match = youtubeLink.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
      if (!match) {
        alert("URL YouTube không hợp lệ");
        return;
      }
      setIsCreatingFromUrl(true);
      await videoApi.create({
        youtubeVideoId: match[1],
        title: urlTitle || "Imported via URL",
        description: urlDescription,
        privacyStatus: "public",
        });
      triggerNextJsRevalidate("videos");
      onSuccess();
      onOpenChange(false);
      setYoutubeLink("");
      setUrlTitle("");
      setUrlDescription("");
    } catch (error) {
      console.error(error);
      alert("Nhập video thất bại. Vui lòng thử lại.");
    } finally {
      setIsCreatingFromUrl(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm video mới</DialogTitle>
          <DialogDescription>
            Tải lên file video lên YouTube hoặc nhập URL YouTube có sẵn.
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
            <UploadIcon className="h-4 w-4" /> Tải lên
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-sm font-medium transition-all",
              activeTab === "url" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LinkIcon className="h-4 w-4" /> Từ URL
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "upload" && (
            <div className="relative">
              {selectedFile ? (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500 mb-2">
                    <Video className="h-4 w-4" />
                    <span className="truncate" title={selectedFile.name}>Đã chọn: {selectedFile.name}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tiêu đề video</label>
                    <Input
                      placeholder="Nhập tiêu đề mô tả"
                      value={youtubeTitle}
                      onChange={(e) => setYoutubeTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mô tả (Tùy chọn)</label>
                    <Textarea
                      placeholder="Nhập mô tả video (tùy chọn)"
                      value={youtubeDescription}
                      onChange={(e) => setYoutubeDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null);
                        setYoutubeTitle("");
                        setYoutubeDescription("");
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() => upload(selectedFile, { youtubeTitle, youtubeDescription })}
                      disabled={!youtubeTitle}
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Tải video lên
                    </Button>
                  </div>
                </div>
              ) : (
                <MediaUpload
                  id="modal-video-upload"
                  value=""
                  accept=".mp4,.mov,.avi,.mkv,.wmv,.flv,.webm,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/x-ms-wmv,video/x-flv,video/webm"
                  placeholder="Kéo thả video hoặc nhấp để tải lên"
                  onChange={(_, file) => {
                    if (file) {
                      setSelectedFile(file);
                      setYoutubeTitle(file.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                  className="h-[250px]"
                />
              )}
            </div>
          )}

          {activeTab === "url" && (
            <div className="flex flex-col justify-center space-y-4 rounded-lg border p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">URL video YouTube</label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  disabled={isCreatingFromUrl}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tiêu đề video</label>
                <Input
                  placeholder="Nhập tiêu đề video"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  disabled={isCreatingFromUrl}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả (Tùy chọn)</label>
                <Textarea
                  placeholder="Nhập mô tả video"
                  value={urlDescription}
                  onChange={(e) => setUrlDescription(e.target.value)}
                  disabled={isCreatingFromUrl}
                  rows={3}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleCreateFromUrl}
                  disabled={!youtubeLink || !urlTitle || isCreatingFromUrl}
                  className="shrink-0"
                >
                  {isCreatingFromUrl ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                  {isCreatingFromUrl ? "Đang nhập..." : "Nhập video"}
                </Button>
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

  const queryClient = useQueryClient();
  const { data: videos, isLoading } = useQuery({
    queryKey: ["video-list"],
    queryFn: () => videoApi.getList().then((res) => res.data.data.videos),
  });

  const handleConfirmRemove = async () => {
    if (videoToRemove === null) return;
    setIsRemoving(true);
    try {
      const res = await videoApi.remove(videoToRemove);

      if (res.data?.error) {
        const { errorCode, errorMsg } = res.data.error;
        toast.error(getApiErrorMessage(errorCode, errorMsg));
        setVideoToRemove(null);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["video-list"] });
      triggerNextJsRevalidate("videos");
      setVideoToRemove(null);
    } catch (error) {
      console.error(error);
      const { errorCode, errorMsg } = extractApiError(error);
      toast.error(getApiErrorMessage(errorCode, errorMsg));
      setVideoToRemove(null);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <PageContainer
      title="Thư viện video"
      description="Quản lý tất cả video đã tải lên hoặc nhập vào CMS."
      actions={
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Thêm video
        </Button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Đang tải thư viện...</p>
          </div>
        ) : !videos || videos.length === 0 ? (
          <div className="col-span-full flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground bg-muted/20">
            <Film className="h-8 w-8 opacity-20" />
            <p className="text-sm font-medium">Không tìm thấy video</p>
            <p className="text-xs">Nhấp 'Thêm video' để tải lên hoặc nhập từ YouTube.</p>
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
                    {video.title || "Video không có tiêu đề"}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoToRemove(video.id);
                    }}
                    title="Xóa video"
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
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["video-list"] })} 
      />

      <Dialog open={videoToRemove !== null} onOpenChange={(open) => !open && setVideoToRemove(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">Xóa video</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa video này không? Thao tác này không thể hoàn tác.
              Video sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu và YouTube.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setVideoToRemove(null)}
              disabled={isRemoving}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={isRemoving}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRemoving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isRemoving ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
