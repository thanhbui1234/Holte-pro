import { useState } from "react";
import { useController, type Control, type Path } from "react-hook-form";
import { Video, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { VideoLibraryModal } from "./VideoLibraryModal";

export interface FormVideoPickerProps<TFieldValues extends Record<string, any>> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  hint?: string;
  className?: string;
  onChange?: (youtubeUrl: string) => void;
}

export function FormVideoPicker<TFieldValues extends Record<string, any>>({
  name,
  control,
  label,
  hint,
  className,
  onChange,
}: FormVideoPickerProps<TFieldValues>) {
  const {
    field: { value, onChange: fieldOnChange },
    fieldState: { error },
  } = useController({ name, control });

  const [modalOpen, setModalOpen] = useState(false);

  const handleSelect = (url: string) => {
    fieldOnChange(url);
    if (onChange) {
      onChange(url);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    fieldOnChange("");
    if (onChange) {
      onChange("");
    }
  };

  const hasValue = Boolean(value);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="relative">
        {hasValue ? (
          <div className="relative overflow-hidden rounded-lg border bg-muted/30">
            <div className="aspect-video cursor-pointer" onClick={() => setModalOpen(true)}>
              <iframe
                src={value.includes("watch?v=") ? value.replace("watch?v=", "embed/") : value}
                className="pointer-events-none h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Selected video"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 z-20 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
              aria-label="Xóa video"
            >
              <X className="h-4 w-4" />
            </button>
            <div
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
              onClick={() => setModalOpen(true)}
            >
              <p className="font-medium text-white">Nhấp để thay đổi video</p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setModalOpen(true)}
            className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 transition hover:border-muted-foreground/50 hover:bg-muted/30"
          >
            <Video className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">Nhấp để chọn hoặc tải lên video</p>
          </div>
        )}
      </div>

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs font-medium text-destructive">{error.message}</p>}

      <VideoLibraryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={handleSelect}
      />
    </div>
  );
}
