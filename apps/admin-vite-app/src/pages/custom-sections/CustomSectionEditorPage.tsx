import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Reorder, useDragControls } from "motion/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  ChevronDown,
  GripVertical,
  ImageIcon,
  Layers,
  LayoutTemplate,
  MousePointerClick,
  Plus,
  Text,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useCustomSections, useUpdateCustomSections } from "@/features/custom-sections/hooks/use-custom-sections";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { ColorField } from "@/components/composite/ColorField";
import { ConfirmDialog } from "@/components/composite/ConfirmDialog";
import { EmptyState } from "@/components/composite/EmptyState";
import { CanvasEditor } from "@/components/composite/CanvasEditor";
import { Button } from "shared-ui";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "shared-ui";
import type {
  BlockType,
  CanvasElement,
  ContentBlock,
  CtaButtonBlock,
  CustomSection,
  ImageGalleryBlock,
  ImageItem,
  TextBlock,
  VideoBlock,
} from "shared-ui";
import { cn } from "@/shared/lib/utils";

/* ─── Block helpers ──────────────────────────────────────────────────────── */

const BLOCK_META: Record<
  BlockType,
  { label: string; icon: React.FC<{ className?: string }>; description: string }
> = {
  text: { label: "Text", icon: Text, description: "Heading, body copy, eyebrow label" },
  image_gallery: { label: "Image gallery", icon: ImageIcon, description: "Grid of images" },
  video: { label: "Video", icon: Video, description: "YouTube or direct video URL" },
  cta_button: { label: "CTA Button", icon: MousePointerClick, description: "Call-to-action link" },
};

const BLOCK_TYPES: BlockType[] = ["text", "image_gallery", "video", "cta_button"];

function makeId() {
  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeBlock(type: BlockType): ContentBlock {
  const id = makeId();
  switch (type) {
    case "text":
      return { id, type, eyebrow: "", heading: "New heading", subheading: "", body: "", alignment: "left" };
    case "image_gallery":
      return { id, type, images: [], layout: "grid", columns: 3 };
    case "video":
      return { id, type, url: "", poster: "", caption: "" };
    case "cta_button":
      return { id, type, label: "Click here", href: "/", variant: "primary", alignment: "center" };
  }
}

function blockPreview(block: ContentBlock): string {
  switch (block.type) {
    case "text": return block.heading || "(no heading)";
    case "image_gallery": return `${block.images.length} image${block.images.length !== 1 ? "s" : ""} · ${block.columns} cols`;
    case "video": return block.url || "(no URL)";
    case "cta_button": return `"${block.label}" → ${block.href}`;
  }
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

export function CustomSectionEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: sections = [], isLoading } = useCustomSections();
  const { mutate: updateSections } = useUpdateCustomSections();

  const section = sections.find((s: CustomSection) => s.id === id);

  const [addOpen, setAddOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [deleteBlockId, setDeleteBlockId] = useState<string | null>(null);

  if (isLoading) {
    return <PageContainer title="Loading..." badge="Custom"><div className="p-8">Loading...</div></PageContainer>;
  }

  if (!section) {
    return (
      <PageContainer title="Section not found" badge="Custom">
        <EmptyState
          icon={<LayoutTemplate className="h-6 w-6" />}
          title="Section not found"
          description="This section may have been deleted."
          action={
            <Button variant="outline" onClick={() => navigate("/custom-sections")}>
              Back to sections
            </Button>
          }
        />
      </PageContainer>
    );
  }

  function handleUpdateSection(updatedSection: CustomSection) {
    updateSections(sections.map((s: CustomSection) => s.id === updatedSection.id ? updatedSection : s));
  }

  function handleMetaChange(updates: Partial<CustomSection>) {
    if (!section) return;
    handleUpdateSection({ ...section, ...updates, updatedAt: Date.now() });
  }

  function handleAddBlock(type: BlockType) {
    if (!section) return;
    const block = makeBlock(type);
    handleUpdateSection({ ...section, blocks: [...section.blocks, block] });
    setAddOpen(false);
    setEditingBlock(block);
  }

  function handleSaveBlock(block: ContentBlock) {
    if (!section) return;
    handleUpdateSection({ ...section, blocks: section.blocks.map(b => b.id === block.id ? block : b) });
    setEditingBlock(null);
  }

  function handleDeleteBlock() {
    if (!section || !deleteBlockId) return;
    handleUpdateSection({ ...section, blocks: section.blocks.filter(b => b.id !== deleteBlockId) });
    setDeleteBlockId(null);
  }

  function handleReorderBlocks(blocks: ContentBlock[]) {
    if (!section) return;
    handleUpdateSection({ ...section, blocks });
  }

  function handleSetCanvasElements(elements: CanvasElement[]) {
    if (!section) return;
    handleUpdateSection({ ...section, canvasElements: elements });
  }

  function handleSetCanvasHeight(height: number) {
    if (!section) return;
    handleUpdateSection({ ...section, canvasHeight: height });
  }

  const isCanvas = section.layoutMode === "canvas";

  return (
    <PageContainer
      title={section.name}
      description={
        isCanvas
          ? "Kéo thả element tự do trên canvas. Chọn element để chỉnh thuộc tính."
          : "Thêm và sắp xếp blocks để xây dựng nội dung section."
      }
      badge="Custom section"
      className="max-w-full"
    >
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/custom-sections")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All custom sections
      </button>

      {/* Section settings */}
      <SectionCard icon={<LayoutTemplate className="h-4 w-4" />} title="Section settings">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <input
              value={section.name}
              onChange={(e) => handleMetaChange({ name: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Padding dọc</label>
            <div className="relative">
              <select
                value={section.paddingY}
                onChange={(e) =>
                  handleMetaChange({ paddingY: e.target.value as CustomSection["paddingY"] })
                }
                className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm shadow-sm outline-none focus:border-amber-500"
              >
                <option value="sm">Small (py-8)</option>
                <option value="md">Medium (py-16)</option>
                <option value="lg">Large (py-24)</option>
                <option value="xl">Extra large (py-32)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium">Background color</label>
            <ColorField
              value={section.backgroundColor}
              onChange={(v) => handleMetaChange({ backgroundColor: v })}
            />
          </div>
        </div>
      </SectionCard>

      {/* Mode toggle */}
      <SectionCard icon={<Layers className="h-4 w-4" />} title="Layout mode">
        <div className="flex gap-2">
          <ModeButton
            active={!isCanvas}
            onClick={() => handleMetaChange({ layoutMode: "blocks" })}
            icon={<GripVertical className="h-4 w-4" />}
            label="Block list"
            description="Thêm blocks theo danh sách, kéo thả thứ tự"
          />
          <ModeButton
            active={isCanvas}
            onClick={() => handleMetaChange({ layoutMode: "canvas" })}
            icon={<MousePointerClick className="h-4 w-4" />}
            label="Free canvas"
            description="Kéo thả element tự do bất kỳ vị trí"
          />
        </div>
      </SectionCard>

      {/* ── Canvas mode ── */}
      {isCanvas && (
        <SectionCard
          icon={<MousePointerClick className="h-4 w-4" />}
          title="Canvas editor"
          description="Click để chọn element. Kéo để di chuyển. Kéo góc để resize."
        >
          <CanvasEditor
            elements={section.canvasElements}
            canvasHeight={section.canvasHeight}
            section={section}
            onElementsChange={handleSetCanvasElements}
            onHeightChange={handleSetCanvasHeight}
            onSectionChange={handleMetaChange}
          />
        </SectionCard>
      )}

      {/* ── Blocks list mode ── */}
      {!isCanvas && (
        <SectionCard
          icon={<LayoutTemplate className="h-4 w-4" />}
          title="Blocks"
          description="Kéo để đổi thứ tự. Click icon bút để chỉnh sửa từng block."
        >
          {section.blocks.length === 0 ? (
            <EmptyState
              icon={<Plus className="h-5 w-5" />}
              title="Chưa có block nào"
              description="Thêm block đầu tiên để bắt đầu xây dựng section."
              action={
                <Button variant="outline" onClick={() => setAddOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add block
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              <Reorder.Group
                axis="y"
                values={section.blocks}
                onReorder={handleReorderBlocks}
                className="space-y-2"
              >
                {section.blocks.map((block: ContentBlock) => (
                  <BlockRow
                    key={block.id}
                    block={block}
                    onEdit={() => setEditingBlock(block)}
                    onDelete={() => setDeleteBlockId(block.id)}
                  />
                ))}
              </Reorder.Group>
              <Button
                variant="outline"
                onClick={() => setAddOpen(true)}
                className="w-full gap-2 border-dashed"
              >
                <Plus className="h-4 w-4" />
                Add block
              </Button>
            </div>
          )}
        </SectionCard>
      )}

      {/* Dialogs */}
      <AddBlockDialog open={addOpen} onOpenChange={setAddOpen} onSelect={handleAddBlock} />

      {editingBlock && (
        <BlockEditorDialog
          block={editingBlock}
          onSave={handleSaveBlock}
          onClose={() => setEditingBlock(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteBlockId}
        onOpenChange={(o) => !o && setDeleteBlockId(null)}
        title="Xóa block này?"
        description="Block sẽ bị xóa vĩnh viễn khỏi section."
        confirmLabel="Xóa block"
        onConfirm={handleDeleteBlock}
      />
    </PageContainer>
  );
}

/* ─── Mode button ────────────────────────────────────────────────────────── */

function ModeButton({
  active,
  onClick,
  icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-start gap-3 rounded-xl border p-4 text-left transition-all",
        active
          ? "border-amber-500/50 bg-amber-50/60 shadow-sm dark:bg-amber-500/8"
          : "border-border/60 hover:border-amber-500/30 hover:bg-amber-50/30",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
          active
            ? "border-amber-500/30 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
            : "border-border/60 text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <div>
        <p className={cn("text-sm font-semibold", active && "text-amber-800 dark:text-amber-200")}>
          {label}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

/* ─── Block row (list mode) ──────────────────────────────────────────────── */

function BlockRow({
  block,
  onEdit,
  onDelete,
}: {
  block: ContentBlock;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const controls = useDragControls();
  const meta = BLOCK_META[block.type];
  const Icon = meta.icon;

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={controls}
      className="group/row flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm"
      whileDrag={{ scale: 1.01, boxShadow: "0 24px 48px -20px oklch(0 0 0 / 0.25)" }}
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{meta.label}</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground/70">
          {blockPreview(block)}
        </p>
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-amber-700 dark:hover:text-amber-300"
          aria-label="Edit block"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete block"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </Reorder.Item>
  );
}

/* ─── Add block picker ───────────────────────────────────────────────────── */

function AddBlockDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: BlockType) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a block</DialogTitle>
          <DialogDescription>Chọn loại nội dung để thêm vào section.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {BLOCK_TYPES.map((type) => {
            const meta = BLOCK_META[type];
            const Icon = meta.icon;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onSelect(type)}
                className="flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-background p-4 text-left transition-colors hover:border-amber-500/40 hover:bg-amber-50/50 dark:hover:bg-amber-500/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{meta.label}</p>
                  <p className="text-[11px] text-muted-foreground">{meta.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Block editor dialog (list mode) ───────────────────────────────────── */

function BlockEditorDialog({
  block,
  onSave,
  onClose,
}: {
  block: ContentBlock;
  onSave: (block: ContentBlock) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ContentBlock>(() => ({ ...block }));
  const meta = BLOCK_META[block.type];

  function patch<T extends ContentBlock>(updates: Partial<T>) {
    setDraft((prev) => ({ ...prev, ...updates } as ContentBlock));
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {meta.label} block</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {draft.type === "text" && <TextBlockEditor block={draft} onChange={(u) => patch<TextBlock>(u)} />}
          {draft.type === "image_gallery" && <ImageGalleryBlockEditor block={draft} onChange={(u) => patch<ImageGalleryBlock>(u)} />}
          {draft.type === "video" && <VideoBlockEditor block={draft} onChange={(u) => patch<VideoBlock>(u)} />}
          {draft.type === "cta_button" && <CtaButtonBlockEditor block={draft} onChange={(u) => patch<CtaButtonBlock>(u)} />}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={() => onSave(draft)}>Save block</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Block field editors ────────────────────────────────────────────────── */

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30";
const textareaCls = inputCls + " min-h-[80px] resize-y";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function TextBlockEditor({ block, onChange }: { block: TextBlock; onChange: (u: Partial<TextBlock>) => void }) {
  return (
    <>
      <Field label="Eyebrow"><input className={inputCls} value={block.eyebrow} onChange={(e) => onChange({ eyebrow: e.target.value })} placeholder="e.g. Our story" /></Field>
      <Field label="Heading"><input className={inputCls} value={block.heading} onChange={(e) => onChange({ heading: e.target.value })} placeholder="Main heading" /></Field>
      <Field label="Subheading"><input className={inputCls} value={block.subheading} onChange={(e) => onChange({ subheading: e.target.value })} placeholder="Optional subheading" /></Field>
      <Field label="Body text"><textarea className={textareaCls} value={block.body} onChange={(e) => onChange({ body: e.target.value })} placeholder="Paragraph text…" /></Field>
      <Field label="Alignment">
        <div className="flex gap-2">
          {(["left", "center", "right"] as const).map((align) => {
            const Icon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
            return (
              <button key={align} type="button" onClick={() => onChange({ alignment: align })} className={cn("flex h-9 w-9 items-center justify-center rounded-md border transition-colors", block.alignment === align ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" : "border-border text-muted-foreground hover:bg-accent")}>
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </Field>
    </>
  );
}

function ImageGalleryBlockEditor({ block, onChange }: { block: ImageGalleryBlock; onChange: (u: Partial<ImageGalleryBlock>) => void }) {
  function addImage() {
    const img: ImageItem = { id: makeId(), src: "", caption: "", alt: "" };
    onChange({ images: [...block.images, img] });
  }
  function updateImage(id: string, updates: Partial<ImageItem>) {
    onChange({ images: block.images.map((img) => (img.id === id ? { ...img, ...updates } : img)) });
  }
  function removeImage(id: string) {
    onChange({ images: block.images.filter((img) => img.id !== id) });
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Layout">
          <div className="relative">
            <select value={block.layout} onChange={(e) => onChange({ layout: e.target.value as ImageGalleryBlock["layout"] })} className={inputCls + " appearance-none pr-8"}>
              <option value="grid">Grid (uniform)</option>
              <option value="masonry">Masonry</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>
        <Field label="Columns">
          <div className="relative">
            <select value={block.columns} onChange={(e) => onChange({ columns: Number(e.target.value) as ImageGalleryBlock["columns"] })} className={inputCls + " appearance-none pr-8"}>
              <option value={2}>2 cột</option>
              <option value={3}>3 cột</option>
              <option value={4}>4 cột</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Images ({block.images.length})</label>
          <Button type="button" variant="outline" size="sm" onClick={addImage} className="gap-1.5"><Plus className="h-3.5 w-3.5" />Add image</Button>
        </div>
        {block.images.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">Chưa có ảnh. Click "Add image" để thêm.</p>
        ) : (
          <div className="space-y-2">
            {block.images.map((img) => (
              <div key={img.id} className="relative space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3">
                <button type="button" onClick={() => removeImage(img.id)} className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                <Field label="Image URL"><input className={inputCls} value={img.src} onChange={(e) => updateImage(img.id, { src: e.target.value })} placeholder="/images/... or https://..." /></Field>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Alt text"><input className={inputCls} value={img.alt} onChange={(e) => updateImage(img.id, { alt: e.target.value })} placeholder="Describe the image" /></Field>
                  <Field label="Caption"><input className={inputCls} value={img.caption} onChange={(e) => updateImage(img.id, { caption: e.target.value })} placeholder="Caption text" /></Field>
                </div>
                {img.src && <img src={img.src} alt={img.alt || "preview"} className="h-28 w-full rounded-md object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function VideoBlockEditor({ block, onChange }: { block: VideoBlock; onChange: (u: Partial<VideoBlock>) => void }) {
  function extractYtId(url: string) {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
    return m?.[1] ?? null;
  }
  const ytId = extractYtId(block.url);
  return (
    <>
      <Field label="Video URL"><input className={inputCls} value={block.url} onChange={(e) => onChange({ url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></Field>
      {ytId && <div className="overflow-hidden rounded-xl border border-border/60"><img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="YouTube thumbnail" className="h-40 w-full object-cover" /><p className="bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">ID: {ytId}</p></div>}
      <Field label="Poster (non-YouTube)"><input className={inputCls} value={block.poster} onChange={(e) => onChange({ poster: e.target.value })} placeholder="/images/poster.jpg" /></Field>
      <Field label="Caption"><input className={inputCls} value={block.caption} onChange={(e) => onChange({ caption: e.target.value })} placeholder="Optional caption" /></Field>
    </>
  );
}

function CtaButtonBlockEditor({ block, onChange }: { block: CtaButtonBlock; onChange: (u: Partial<CtaButtonBlock>) => void }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Button label"><input className={inputCls} value={block.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Get in Touch" /></Field>
        <Field label="Link (href)"><input className={inputCls} value={block.href} onChange={(e) => onChange({ href: e.target.value })} placeholder="/contact" /></Field>
      </div>
      <Field label="Style">
        <div className="flex gap-2">
          {(["primary", "outline", "ghost"] as const).map((v) => (
            <button key={v} type="button" onClick={() => onChange({ variant: v })} className={cn("flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-colors", block.variant === v ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" : "border-border text-muted-foreground hover:bg-accent")}>{v}</button>
          ))}
        </div>
      </Field>
      <Field label="Alignment">
        <div className="flex gap-2">
          {(["left", "center", "right"] as const).map((align) => {
            const Icon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
            return (
              <button key={align} type="button" onClick={() => onChange({ alignment: align })} className={cn("flex h-9 w-9 items-center justify-center rounded-md border transition-colors", block.alignment === align ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" : "border-border text-muted-foreground hover:bg-accent")}>
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </Field>
      <div className={cn("flex rounded-xl border border-border/60 bg-muted/20 p-6", block.alignment === "center" && "justify-center", block.alignment === "right" && "justify-end")}>
        <span className={cn("rounded-lg px-5 py-2.5 text-sm font-semibold", block.variant === "primary" && "bg-amber-500 text-stone-950 shadow-md", block.variant === "outline" && "border-2 border-current text-amber-700 dark:text-amber-300", block.variant === "ghost" && "text-amber-700 dark:text-amber-300")}>{block.label || "Button"}</span>
      </div>
    </>
  );
}
