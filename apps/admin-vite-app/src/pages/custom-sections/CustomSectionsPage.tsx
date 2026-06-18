import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reorder, useDragControls } from "motion/react";
import {
  Eye,
  EyeOff,
  GripVertical,
  LayoutTemplate,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useCustomSections, useUpdateCustomSections } from "@/features/custom-sections/hooks/use-custom-sections";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { ConfirmDialog } from "@/components/composite/ConfirmDialog";
import { EmptyState } from "@/components/composite/EmptyState";
import { Switch } from "shared-ui";
import { Button } from "shared-ui";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shared-ui";
import type { CustomSection } from "shared-ui";
import { cn } from "@/shared/lib/utils";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function makeSection(name: string): CustomSection {
  const now = Date.now();
  return {
    id: `custom-${now}`,
    name,
    slug: slugify(name),
    visible: true,
    paddingY: "lg",
    blocks: [],
    layoutMode: "canvas",
    canvasElements: [],
    canvasHeight: 900,
    backgroundColor: "#ffffff",
    backgroundType: "solid",
    bgGradientAngle: 135,
    bgGradientFrom: "#ffffff",
    bgGradientTo: "#f5f5f4",
    bgImage: "",
    bgImageOverlay: "#000000",
    bgImageOverlayOpacity: 30,
    createdAt: now,
    updatedAt: now,
  };
}

export function CustomSectionsPage() {
  const { data: sections = [], isLoading } = useCustomSections();
  const { mutate: updateSections } = useUpdateCustomSections();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CustomSection | null>(null);

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    const section = makeSection(name);
    updateSections([...sections, section]);
    setNewName("");
    setCreateOpen(false);
    navigate(`/custom-sections/${section.id}`);
  }

  function handleRemove(id: string) {
    updateSections(sections.filter((s: CustomSection) => s.id !== id));
  }

  function handleReorder(newOrder: CustomSection[]) {
    updateSections(newOrder);
  }

  function handleToggle(id: string) {
    updateSections(
      sections.map((s: CustomSection) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      )
    );
  }

  return (
    <PageContainer
      title="Custom sections"
      description="Create your own sections, design them with blocks, then drag to reorder."
      badge="Custom"
    >
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New section
        </Button>
      </div>

      <SectionCard
        icon={<LayoutTemplate className="h-4 w-4" />}
        title="Your custom sections"
        description={
          sections.length === 0
            ? "No custom sections yet."
            : `${sections.filter((s) => s.visible).length} of ${sections.length} visible.`
        }
      >
        {sections.length === 0 ? (
          <EmptyState
            icon={<LayoutTemplate className="h-6 w-6" />}
            title="No custom sections"
            description="Create a section and design it with text, images, videos, and buttons."
            action={
              <Button variant="outline" onClick={() => setCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create first section
              </Button>
            }
          />
        ) : (
          <Reorder.Group
            axis="y"
            values={sections}
            onReorder={handleReorder}
            className="space-y-2"
          >
            {sections.map((section: CustomSection) => (
              <SectionRow
                key={section.id}
                section={section}
                onEdit={() => navigate(`/custom-sections/${section.id}`)}
                onDelete={() => setDeleteTarget(section)}
                onToggle={() => handleToggle(section.id)}
              />
            ))}
          </Reorder.Group>
        )}
      </SectionCard>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new section</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="section-name">
                Section name
              </label>
              <input
                id="section-name"
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Our Story, Packages, FAQ…"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newName.trim()}>
                Create & edit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This will permanently remove the section and all its blocks."
        confirmLabel="Delete section"
        onConfirm={() => {
          if (deleteTarget) handleRemove(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </PageContainer>
  );
}

interface SectionRowProps {
  section: CustomSection;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

function SectionRow({ section, onEdit, onDelete, onToggle }: SectionRowProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "group/row flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm transition-colors",
        !section.visible && "bg-muted/40 opacity-70",
      )}
      whileDrag={{ scale: 1.01, boxShadow: "0 24px 48px -20px oklch(0 0 0 / 0.25)" }}
    >
      {/* Drag handle */}
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Color swatch */}
      <span
        className="h-9 w-9 shrink-0 rounded-md border border-border/60 shadow-sm"
        style={{ backgroundColor: section.backgroundColor }}
        title="Background color"
      />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{section.name}</p>
          {section.visible ? (
            <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        <p className="truncate font-mono text-[11px] text-muted-foreground/70">
          {section.blocks.length} block{section.blocks.length !== 1 ? "s" : ""} · /{section.slug}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-amber-700 dark:hover:text-amber-300"
            aria-label="Edit section"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <Switch
          checked={section.visible}
          onCheckedChange={onToggle}
          aria-label={`Toggle ${section.name}`}
        />
      </div>
    </Reorder.Item>
  );
}
