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
      title="Quản lý Sections"
      description="Quản lý các section động và các trường dữ liệu tùy chỉnh."
      badge="CMS"
      actions={
        <Button onClick={() => navigate("/section-crud/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo section
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Đang tải sections...
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
              title="Không tìm thấy section nào"
              description="Tạo section mới để bắt đầu xây dựng nội dung động."
              action={
                <Button variant="outline" onClick={() => navigate("/section-crud/new")}>
                  Tạo section
                </Button>
              }
            />
          }
          renderRow={(item) => (
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                Trạng thái: {item.status} · Thứ tự: {item.displayOrder} · Trường: {Object.keys(item.data || {}).length}
              </p>
            </div>
          )}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa section?"
        description={`Bạn có chắc muốn xóa "${deleteTarget?.name}" không? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        onConfirm={handleDelete}
      />
    </PageContainer>
  );
}
