import { useState } from "react";
import { useController, type Control, type Path } from "react-hook-form";
import { Plus, Video, X, GripVertical } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { VideoLibraryModal } from "./VideoLibraryModal";
import { Input, Textarea } from "shared-ui";

export interface VideoListItemData {
  videoUrl: string;
  title: string;
  description: string;
}

export interface FormVideoListPickerProps<TFieldValues extends Record<string, any>> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  hint?: string;
  className?: string;
}

export function FormVideoListPicker<TFieldValues extends Record<string, any>>({
  name,
  control,
  label,
  hint,
  className,
}: FormVideoListPickerProps<TFieldValues>) {
  const {
    field: { value, onChange: fieldOnChange },
    fieldState: { error },
  } = useController({ name, control });

  const [modalOpen, setModalOpen] = useState(false);
  
  // Ensure value is an array of objects
  const items: VideoListItemData[] = Array.isArray(value) 
    ? value.map((v: any) => typeof v === 'string' ? { videoUrl: v, title: "", description: "" } : v) 
    : [];

  const handleSelect = (url: string) => {
    fieldOnChange([...items, { videoUrl: url, title: "", description: "" }]);
    setModalOpen(false);
  };

  const handleRemove = (indexToRemove: number) => {
    const newItems = items.filter((_, i) => i !== indexToRemove);
    fieldOnChange(newItems);
  };

  const handleReorder = (newOrder: VideoListItemData[]) => {
    fieldOnChange(newOrder);
  };

  const handleUpdateItem = (index: number, updates: Partial<VideoListItemData>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    fieldOnChange(newItems);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      {items.length > 0 && (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="space-y-3"
        >
          {items.map((item, index) => (
            <VideoListItem
              key={`${item.videoUrl}-${index}`}
              item={item}
              index={index}
              onRemove={() => handleRemove(index)}
              onChange={(updates) => handleUpdateItem(index, updates)}
            />
          ))}
        </Reorder.Group>
      )}

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 py-4 transition hover:border-muted-foreground/50 hover:bg-muted/30"
      >
        <Plus className="h-5 w-5 text-muted-foreground/80" />
        <span className="text-sm font-medium text-muted-foreground">Add Video</span>
      </button>

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

function VideoListItem({
  item,
  index,
  onRemove,
  onChange,
}: {
  item: VideoListItemData;
  index: number;
  onRemove: () => void;
  onChange: (updates: Partial<VideoListItemData>) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="group flex flex-col gap-3 rounded-xl border bg-background p-3 shadow-sm transition-shadow focus-within:ring-1 focus-within:ring-amber-500/50 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="mt-1 flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-md border bg-muted/30">
          <iframe
            src={item.videoUrl.includes("watch?v=") ? item.videoUrl.replace("watch?v=", "embed/") : item.videoUrl}
            className="pointer-events-none absolute inset-0 h-full w-full border-0 object-cover"
            title={`Video ${index + 1}`}
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 min-w-0">
          <Input
            placeholder="Video Title..."
            value={item.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="h-8 text-sm font-medium"
          />
          <Textarea
            placeholder="Short description..."
            value={item.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="min-h-[40px] resize-none text-xs"
          />
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Remove"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Reorder.Item>
  );
}
