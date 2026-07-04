import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllPopups } from "@/lib/popup";
import { MAX_ACTIVE_POPUPS } from "@/lib/popup-types";
import { formatDate } from "@/lib/board-types";
import { DeletePopupButton } from "@/components/admin/DeletePopupButton";

export const metadata: Metadata = {
  title: "팝업 공지 관리 | KSOT",
};

export default async function AdminPopupsPage() {
  const popups = await getAllPopups();
  const nowIso = new Date().toISOString();
  const activeCount = popups.filter(
    (p) => p.is_active && p.starts_at <= nowIso && (!p.ends_at || p.ends_at >= nowIso)
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A2B4C]">팝업 공지 관리</h1>
        <Link
          href="/admin/popups/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1A2B4C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243B66]"
        >
          <Plus className="h-4 w-4" />
          새 팝업 등록
        </Link>
      </div>

      <p className="mt-2 text-sm text-muted">
        랜딩페이지 동시 노출 가능 팝업:{" "}
        <span
          className={
            activeCount >= MAX_ACTIVE_POPUPS ? "font-semibold text-amber-600" : "font-semibold text-[#1A2B4C]"
          }
        >
          {activeCount} / {MAX_ACTIVE_POPUPS}
        </span>
        {activeCount >= MAX_ACTIVE_POPUPS && " — 이미 최대치입니다. 새 팝업을 노출하려면 기존 팝업을 비활성화하세요."}
      </p>

      <ul className="mt-6 divide-y divide-[#1A2B4C]/8 rounded-2xl border border-[#1A2B4C]/8 bg-white">
        {popups.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-muted">등록된 팝업 공지가 없습니다.</li>
        )}
        {popups.map((p) => {
          const isLive =
            p.is_active && p.starts_at <= nowIso && (!p.ends_at || p.ends_at >= nowIso);
          return (
            <li key={p.id} className="flex items-center gap-3 px-5 py-3">
              <span className="shrink-0 rounded-full bg-[#1A2B4C]/5 px-2 py-0.5 text-xs font-medium text-muted">
                {p.media_type === "pdf" ? "PDF" : "이미지"}
              </span>
              <span className="shrink-0 text-xs font-semibold text-muted">순서 {p.sort_order}</span>
              <Link
                href={`/admin/popups/${p.id}`}
                className="flex-1 truncate text-sm font-medium text-[#1A2B4C] hover:text-[#14B8A6]"
              >
                {p.title}
              </Link>
              <span
                className={`shrink-0 text-xs font-medium ${isLive ? "text-[#14B8A6]" : "text-muted"}`}
              >
                {isLive ? "노출 중" : p.is_active ? "기간 외" : "비활성"}
              </span>
              <span className="shrink-0 text-xs text-muted">{formatDate(p.created_at)}</span>
              <DeletePopupButton popupId={p.id} storagePath={p.storage_path} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
