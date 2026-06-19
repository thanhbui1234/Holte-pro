import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Section as SectionIcon } from "lucide-react";
import { PageContainer } from "@/components/composite/PageContainer";
import { EntityList } from "@/components/composite/EntityList";
import { EmptyState } from "@/components/composite/EmptyState";
import { ConfirmDialog } from "@/components/composite/ConfirmDialog";
import { Button } from "shared-ui";
import { useSectionList, useRemoveSection } from "@/features/section-crud/hooks/use-section-crud";
import type { SectionRecord } from "@/shared/api";

export function SectionCrudListPage() {
  const navigate = useNavigate();
  const { data: sections = [], isLoading } = useSectionList();
  const { mutate: removeSection } = useRemoveSection();
  const [deleteTarget, setDeleteTarget] = useState<SectionRecord | null>(null);

  const handleDelete = () => {
    if (deleteTarget) {
      removeSection(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <PageContainer
      title="Sections CRUD"
      description="Manage dynamic sections and their custom data fields."
      badge="CMS"
      actions={
        <Button onClick={() => navigate("/section-crud/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create section
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Loading sections...
        </div>
      ) : (
        <EntityList<SectionRecord>
          items={sections}
          getKey={(item) => String(item.id)}
          onEdit={(item) => navigate(`/section-crud/${item.id}`)}
          onDelete={(item) => setDeleteTarget(item)}
          emptyState={
            <EmptyState
              icon={<SectionIcon className="h-6 w-6" />}
              title="No sections found"
              description="Create a new section to start building dynamic content."
              action={
                <Button variant="outline" onClick={() => navigate("/section-crud/new")}>
                  Create section
                </Button>
              }
            />
          }
          renderRow={(item) => (
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                Status: {item.status} · Order: {item.displayOrder} · Fields: {Object.keys(item.data || {}).length}
              </p>
            </div>
          )}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete section?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </PageContainer>
  );
}
