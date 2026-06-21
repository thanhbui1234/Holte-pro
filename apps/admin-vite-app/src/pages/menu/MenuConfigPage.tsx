import { useRef, useState } from "react";
import { Reorder, useDragControls } from "motion/react";
import {
  Eye,
  EyeOff,
  GripVertical,
  Navigation,
  Pencil,
  X as XIcon,
  Check,
} from "lucide-react";
import {
  useMenuConfig,
  useUpdateMenuConfig,
} from "@/features/menu/hooks/use-menu";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { FormField } from "@/components/composite/FormField";
import { Input } from "shared-ui";
import { Switch } from "shared-ui";
import { Button } from "shared-ui";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shared-ui";
import { cn } from "@/shared/lib/utils";
import type { NavMenuItem } from "@/features/menu/types/menu.types";

export function MenuConfigPage() {
  const { data: menuConfig = [], isLoading } = useMenuConfig();
  const { mutate: updateMenu } = useUpdateMenuConfig();

  if (isLoading) {
    return <PageContainer title="Menu điều hướng" description="Đang tải..."><div className="p-8">Đang tải...</div></PageContainer>;
  }

  const visibleCount = menuConfig.filter((m: NavMenuItem) => m.visible).length;

  let visibleIndex = 0;
  const withIndex = menuConfig.map((item: NavMenuItem) => ({
    ...item,
    displayIndex: item.visible ? ++visibleIndex : null,
  }));

  function reorder(newOrder: NavMenuItem[]) {
    updateMenu(newOrder);
  }

  function toggle(id: string) {
    updateMenu(menuConfig.map((item: NavMenuItem) => item.id === id ? { ...item, visible: !item.visible } : item));
  }

  function updateLabel(id: string, label: string) {
    updateMenu(menuConfig.map((item: NavMenuItem) => item.id === id ? { ...item, label } : item));
  }

  return (
    <PageContainer
      title="Menu điều hướng"
      description="Kéo để sắp xếp. Bật tắt để hiện hoặc ẩn trang. Nhấp icon bút chì để đổi tên nhãn."
      badge="Menu"
    >
      <SectionCard
        icon={<Navigation className="h-4 w-4" />}
        title="Mục menu"
        description={`${visibleCount} trong số ${menuConfig.length} trang hiển thị trong điều hướng.`}
      >
        <Reorder.Group
          axis="y"
          values={menuConfig}
          onReorder={reorder}
          className="space-y-2"
        >
          {withIndex.map((item) => (
            <MenuRow
              key={item.id}
              item={item}
              displayIndex={item.displayIndex}
              onToggle={() => toggle(item.id)}
              onLabelSave={(label) => updateLabel(item.id, label)}
            />
          ))}
        </Reorder.Group>

        <p className="mt-3 text-[11px] text-muted-foreground/60">
          Số thứ tự (01, 02…) được tính lại dựa trên các mục hiển thị theo thứ tự.
        </p>
      </SectionCard>
    </PageContainer>
  );
}

interface MenuRowProps {
  item: NavMenuItem & { displayIndex: number | null };
  displayIndex: number | null;
  onToggle: () => void;
  onLabelSave: (label: string) => void;
}

function MenuRow({ item, displayIndex, onToggle, onLabelSave }: MenuRowProps) {
  const controls = useDragControls();
  const switchId = `menu-${item.id}`;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraft(item.label);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== item.label) onLabelSave(trimmed);
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(item.label);
    setEditing(false);
  };

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "group/row flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm transition-colors",
        !item.visible && "bg-muted/40 opacity-60",
      )}
      whileDrag={{ scale: 1.01, boxShadow: "0 24px 48px -20px oklch(0 0 0 / 0.25)" }}
    >
      {/* Drag handle */}
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:cursor-grabbing"
        aria-label="Kéo để sắp xếp"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Index badge */}
      <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background font-mono text-xs text-muted-foreground sm:flex">
        {displayIndex != null ? String(displayIndex).padStart(2, "0") : "—"}
      </span>

      {/* Label + href */}
      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              className="h-7 w-full max-w-[200px] rounded border border-amber-500/40 bg-background px-2 text-sm font-medium outline-none ring-2 ring-amber-500/20"
            />
            <button
              type="button"
              onClick={commitEdit}
              className="flex h-7 w-7 items-center justify-center rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{item.label}</p>
            {item.visible ? (
              <Eye className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            <button
              type="button"
              onClick={startEdit}
              className="ml-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-opacity hover:text-foreground group-hover/row:opacity-100"
              aria-label={`Đổi tên ${item.label}`}
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
        )}
        <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground/60">
          {item.href}
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-2">
        <label
          htmlFor={switchId}
          className="hidden cursor-pointer text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline"
        >
          {item.visible ? "Hiển thị" : "Ẩn"}
        </label>
        <Switch
          id={switchId}
          checked={item.visible}
          onCheckedChange={onToggle}
          aria-label={`Toggle ${item.label}`}
        />
      </div>
    </Reorder.Item>
  );
}
