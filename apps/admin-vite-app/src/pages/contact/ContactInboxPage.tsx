import { useState, useMemo } from "react";
import {
  Archive,
  ArchiveRestore,
  Calendar,
  Mail,
  MailOpen,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useContactSubmissions, useUpdateContactStatus, useRemoveContactSubmission } from "@/features/contact/hooks/use-contact";
import { PageContainer } from "@/components/composite/PageContainer";
import { ConfirmDialog } from "@/components/composite/ConfirmDialog";
import { cn } from "@/shared/lib/utils";
import type { ContactStatus, SupportFormRecord } from "@/features/contact/types/contact.types";

/* ─── Helpers ────────────────────────────────────────────────── */

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  return new Date(ts).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const STATUS_CONFIG: Record<ContactStatus, { label: string; dot: string; badge: string }> = {
  PENDING:   { label: "Mới",       dot: "bg-amber-500",  badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20" },
  CONTACTED: { label: "Đã liên hệ",   dot: "bg-muted-foreground/30", badge: "bg-muted/50 text-muted-foreground border-border/50" },
};

type FilterTab = "all" | ContactStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all",       label: "Tất cả" },
  { key: "PENDING",   label: "Mới" },
  { key: "CONTACTED", label: "Đã liên hệ" },
];

/* ─── Avatar ─────────────────────────────────────────────────── */

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const colors = [
    "from-amber-400 to-amber-600",
    "from-rose-400 to-rose-600",
    "from-violet-400 to-violet-600",
    "from-emerald-400 to-emerald-600",
    "from-sky-400 to-sky-600",
    "from-orange-400 to-orange-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sz = size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-xs";
  return (
    <div className={cn("shrink-0 rounded-full bg-gradient-to-br font-semibold text-white flex items-center justify-center", color, sz)}>
      {initials(name)}
    </div>
  );
}

/* ─── Submission row ─────────────────────────────────────────── */

function SubmissionRow({
  sub,
  selected,
  onClick,
}: {
  sub: SupportFormRecord;
  selected: boolean;
  onClick: () => void;
}) {
  const cfg = STATUS_CONFIG[sub.status];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/row relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors",
        selected
          ? "bg-amber-50/80 dark:bg-amber-500/8"
          : "hover:bg-muted/40",
        sub.status === "PENDING" && !selected && "bg-amber-50/20 dark:bg-amber-500/5",
      )}
    >
      {/* Status dot */}
      <span className={cn("mt-4 h-1.5 w-1.5 shrink-0 rounded-full", cfg.dot)} />

      <Avatar name={sub.fullName} size="sm" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("truncate text-sm", sub.status === "PENDING" ? "font-semibold" : "font-medium")}>
            {sub.fullName}
          </span>
          <span className="shrink-0 text-[10px] text-muted-foreground/60">{timeAgo(sub.createdTime)}</span>
        </div>
        <p className="truncate text-[11px] text-muted-foreground/70">{sub.phone}</p>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground/50">{sub.reason}</p>
      </div>

      {/* Selected indicator */}
      {selected && (
        <span className="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-r-full bg-amber-500" />
      )}
    </button>
  );
}

/* ─── Detail panel ───────────────────────────────────────────── */

function DetailPanel({
  sub,
  onClose,
  onSetStatus,
  onDelete,
}: {
  sub: SupportFormRecord;
  onClose: () => void;
  onSetStatus: (s: ContactStatus) => void;
  onDelete: () => void;
}) {
  const cfg = STATUS_CONFIG[sub.status];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={sub.fullName} size="lg" />
          <div>
            <h2 className="text-base font-semibold leading-tight">{sub.fullName}</h2>
            <a
              href={`tel:${sub.phone}`}
              className="text-xs text-muted-foreground transition-colors hover:text-amber-600 dark:hover:text-amber-400"
            >
              {sub.phone}
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 border-b border-border/50 px-5 py-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-amber-500" />
          <span>TG khả dụng:</span>
          <span className="font-semibold text-foreground">{sub.availableTime || "—"}</span>
        </div>
        {sub.requesterEmail && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-amber-500" />
            <span>Email:</span>
            <span className="font-semibold text-foreground">{sub.requesterEmail}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 text-amber-500" />
          <span>Nhận lúc:</span>
          <span className="font-semibold text-foreground">{timeAgo(sub.createdTime)}</span>
        </div>
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", cfg.badge)}>
          {cfg.label}
        </span>
      </div>

      {/* Message */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Nội dung (Lý do)
        </p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
          {sub.reason}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2 border-t border-border/50 px-5 py-4">
        <div className={cn("grid gap-2", sub.requesterEmail ? "grid-cols-2" : "grid-cols-1")}>
          <a
            href={`tel:${sub.phone}`}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            <Mail className="h-4 w-4" />
            Gọi điện / Zalo
          </a>

          {sub.requesterEmail && (
            <a
              href={`mailto:${sub.requesterEmail}`}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-100 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
            >
              <Mail className="h-4 w-4" />
              Gửi Email
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {sub.status === "PENDING" && (
            <button
              type="button"
              onClick={() => onSetStatus("CONTACTED")}
              className="col-span-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <MailOpen className="h-3.5 w-3.5" />
              Đánh dấu đã liên hệ
            </button>
          )}
          {sub.status === "CONTACTED" && (
            <button
              type="button"
              onClick={() => onSetStatus("PENDING")}
              className="col-span-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" />
              Đánh dấu chưa liên hệ
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xóa liên hệ
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */

export function ContactInboxPage() {
  const { data: submissions = [], isLoading } = useContactSubmissions();
  const { mutate: setStatus } = useUpdateContactStatus();
  const { mutate: remove } = useRemoveContactSubmission();
  
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = submissions;
    if (activeTab !== "all") list = list.filter((s: SupportFormRecord) => s.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s: SupportFormRecord) =>
          s.fullName.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          s.reason.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a: SupportFormRecord, b: SupportFormRecord) => b.createdTime - a.createdTime);
  }, [submissions, activeTab, search]);

  const selected = filtered.find((s) => String(s.id) === selectedId) ?? null;

  function handleSelect(sub: SupportFormRecord) {
    setSelectedId(String(sub.id));
    // Remove auto-updating status to read since it's now either PENDING or CONTACTED. 
    // It should be marked as CONTACTED manually by the user, not just by clicking on it.
  }

  function handleDelete() {
    if (!deleteId) return;
    if (selectedId === deleteId) setSelectedId(null);
    remove(deleteId);
    setDeleteId(null);
  }

  if (isLoading) {
    return <PageContainer title="Contact Inbox" description="Đang tải..."><div className="p-8">Loading...</div></PageContainer>;
  }

  const unreadCount = submissions.filter((s: SupportFormRecord) => s.status === "PENDING").length;
  const today = new Date().toDateString();
  const todayCount = submissions.filter((s: SupportFormRecord) => new Date(s.createdTime).toDateString() === today).length;

  return (
    <PageContainer
      title="Contact Inbox"
      description="Danh sách liên hệ từ khách hàng trên trang web."
      badge="CRM"
      className="max-w-full"
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tổng liên hệ", value: submissions.length, color: "text-foreground" },
          { label: "Mới (Chưa LH)", value: unreadCount, color: "text-amber-600 dark:text-amber-400" },
          { label: "Hôm nay", value: todayCount, color: "text-foreground" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-border/50 bg-background py-4 shadow-sm"
          >
            <span className={cn("text-2xl font-bold tabular-nums", s.color)}>{s.value}</span>
            <span className="text-[11px] text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main layout: list + detail */}
      <div className="flex gap-3 overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm" style={{ minHeight: "calc(100vh - 340px)" }}>

        {/* Left: list */}
        <div className={cn("flex flex-col border-r border-border/50", selected ? "w-80 shrink-0" : "flex-1")}>

          {/* Search + Tabs */}
          <div className="space-y-2 border-b border-border/50 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Tìm theo tên, sđt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted/30 py-2 pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-amber-500 focus:bg-background"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/50 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex gap-1">
              {FILTER_TABS.map((tab) => {
                const count =
                  tab.key === "all"
                    ? submissions.length
                    : submissions.filter((s: SupportFormRecord) => s.status === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                      activeTab === tab.key
                        ? "bg-amber-500 text-stone-950"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {tab.label}
                    <span className={cn("rounded-full px-1.5 py-px text-[9px] font-bold", activeTab === tab.key ? "bg-stone-950/20 text-stone-950" : "bg-muted text-muted-foreground")}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/30">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <User className="h-8 w-8 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground/50">Không có liên hệ nào</p>
              </div>
            ) : (
              filtered.map((sub: SupportFormRecord) => (
                <SubmissionRow
                  key={sub.id}
                  sub={sub}
                  selected={selectedId === String(sub.id)}
                  onClick={() => handleSelect(sub)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: detail */}
        {selected ? (
          <div className="flex-1 overflow-hidden">
            <DetailPanel
              sub={selected}
              onClose={() => setSelectedId(null)}
              onSetStatus={(s) => setStatus({ id: selected.id, status: s })}
              onDelete={() => setDeleteId(String(selected.id))}
            />
          </div>
        ) : (
          <div className="hidden flex-1 flex-col items-center justify-center gap-3 text-center md:flex">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
              <Mail className="h-6 w-6 text-amber-500/60" />
            </div>
            <p className="text-sm font-medium text-muted-foreground/60">
              Chọn một liên hệ để xem chi tiết
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Xóa liên hệ này?"
        description="Liên hệ sẽ bị xóa vĩnh viễn và không thể khôi phục."
        confirmLabel="Xóa"
        onConfirm={handleDelete}
      />
    </PageContainer>
  );
}
