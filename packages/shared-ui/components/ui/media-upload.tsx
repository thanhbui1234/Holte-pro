import * as React from "react";
import { Upload, X, Maximize2 } from "lucide-react";
import { useFileUpload } from "../../hooks/use-file-upload";
import { cn } from "../../lib/utils";

export interface MediaUploadProps {
  value: string;
  onChange: (url: string, file?: File) => void;
  accept?: string;
  maxSize?: number;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

function inferMediaType(url: string, accept: string): "image" | "video" | "youtube" {
  if (!url) return "image";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  const lower = url.toLowerCase();
  if (lower.match(/\.(mp4|webm|mov|avi|mkv)(\?|$)/)) return "video";
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/)) return "image";
  if (accept.includes("video") && !accept.includes("image")) return "video";
  return "image";
}

export function MediaUpload({
  value,
  onChange,
  accept = "image/*,video/*",
  maxSize = 50 * 1024 * 1024,
  placeholder,
  id,
  className,
  disabled = false,
}: MediaUploadProps) {
  const blobRef = React.useRef<string | null>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const handleFilesAdded = React.useCallback((added: { preview?: string; file: any }[]) => {
    const entry = added[0];
    if (!entry) return;
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    const preview = entry.preview ?? "";
    blobRef.current = preview.startsWith("blob:") ? preview : null;
    const isFile = typeof File !== "undefined" && entry.file instanceof File;
    onChangeRef.current(preview, isFile ? entry.file : undefined);
  }, []);

  const { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps } =
    useFileUpload({
      accept,
      maxSize,
      maxFiles: 1,
      multiple: false,
      onFilesAdded: handleFilesAdded,
    });

  React.useEffect(() => {
    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  const handleRemove = () => {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }
    onChange("");
  };

  const mediaType = React.useMemo(() => inferMediaType(value, accept), [value, accept]);
  const hasValue = Boolean(value);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    setLoadError(false);
  }, [value]);

  const [lightbox, setLightbox] = React.useState(false);

  if (hasValue && !loadError) {
    return (
      <>
        <div className={cn("relative overflow-hidden rounded-lg border bg-muted/30", className)}>
          <div className="aspect-video cursor-pointer" onClick={() => setLightbox(true)}>
            {mediaType === "youtube" ? (
              <iframe
                src={value.includes("watch?v=") ? value.replace("watch?v=", "embed/") : value}
                className="pointer-events-none h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="YouTube preview"
              />
            ) : mediaType === "video" ? (
              <video
                key={value}
                src={value}
                muted
                loop
                autoPlay
                playsInline
                className="h-full w-full object-cover"
                onError={() => setLoadError(true)}
              />
            ) : (
              <img
                src={value}
                alt="Upload preview"
                className="h-full w-full object-cover"
                onError={() => setLoadError(true)}
              />
            )}
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-2 right-2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
            aria-label="View fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {lightbox && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label="Close preview"
            >
              <X className="h-6 w-6" />
            </button>
            <div
              className="max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {mediaType === "youtube" ? (
                <iframe
                  src={value.includes("watch?v=") ? value.replace("watch?v=", "embed/") : value}
                  className="h-[80vh] w-[80vw] rounded-lg border-0 bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube full preview"
                />
              ) : mediaType === "video" ? (
                <video
                  src={value}
                  controls
                  autoPlay
                  className="max-h-[90vh] max-w-[90vw] rounded-lg"
                />
              ) : (
                <img
                  src={value}
                  alt="Full preview"
                  className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      onDragEnter={disabled ? undefined : handleDragEnter}
      onDragLeave={disabled ? undefined : handleDragLeave}
      onDragOver={disabled ? undefined : handleDragOver}
      onDrop={disabled ? undefined : handleDrop}
      onClick={disabled ? undefined : openFileDialog}
      className={cn(
        "flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input {...getInputProps({ id })} />
      <Upload className="h-8 w-8 text-muted-foreground/60" />
      <p className="text-sm text-muted-foreground">
        {placeholder ?? "Drag & drop or click to select"}
      </p>
      <p className="text-xs text-muted-foreground/60">
        {accept.includes("video") && accept.includes("image")
          ? "Images or videos"
          : accept.includes("video")
            ? "Videos only"
            : "Images only"}
      </p>
    </div>
  );
}


