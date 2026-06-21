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
import {
  useCustomSections,
  useCreateCustomSection,
  useToggleCustomSection,
  useDeleteCustomSection,
} from "@/features/custom-sections/hooks/use-custom-sections";
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
import type { SectionRecord } from "@/shared/api/section.api";
import { cn } from "@/shared/lib/utils";

export function CustomSectionsPage() {
  const { data: sections = [] } = useCustomSections();
  const { mutate: createSection, isPending: isCreating } = useCreateCustomSection();
  const { mutate: toggleSection } = useToggleCustomSection();
  const { mutate: deleteSection } = useDeleteCustomSection();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SectionRecord | null>(null);

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    createSection(name, {
      onSuccess: () => {
        setNewName("");
        setCreateOpen(false);
      },
    });
  }

  const activeCount = sections.filter((s) => s.status === "ACTIVE").length;

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
            : `${activeCount} of ${sections.length} visible.`
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
            onReorder={() => {}}
            className="space-y-2"
          >
            {sections.map((section) => (
              <SectionRow
                key={section.id}
                section={section}
                onEdit={() => navigate(`/sections/custom-sections/${section.id}`)}
                onDelete={() => setDeleteTarget(section)}
                onToggle={() => toggleSection(section)}
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
              <Button type="submit" disabled={!newName.trim() || isCreating}>
                {isCreating ? "Creating…" : "Create & edit"}
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
          if (deleteTarget) deleteSection(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </PageContainer>
  );
}

interface SectionRowProps {
  section: SectionRecord;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

function SectionRow({ section, onEdit, onDelete, onToggle }: SectionRowProps) {
  const controls = useDragControls();
  const isActive = section.status === "ACTIVE";

  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "group/row flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm transition-colors",
        !isActive && "bg-muted/40 opacity-70",
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

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{section.name}</p>
          {isActive ? (
            <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        {section.description && (
          <p className="truncate text-[11px] text-muted-foreground/70">{section.description}</p>
        )}
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
          checked={isActive}
          onCheckedChange={onToggle}
          aria-label={`Toggle ${section.name}`}
        />
      </div>
    </Reorder.Item>
  );
}
