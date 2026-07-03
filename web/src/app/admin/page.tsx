import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BOARD_SLUGS, BOARD_LABELS, formatDate } from "@/lib/board-types";

export const metadata: Metadata = {
  title: "관리자 대시보드 | KSOT",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const counts = await Promise.all(
    BOARD_SLUGS.map(async (board) => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("board", board);
      return { board, count: count ?? 0 };
    })
  );

  const { data: recent } = await supabase
    .from("posts")
    .select("id, board, title, created_at, is_published")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A2B4C]">대시보드</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1A2B4C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243B66]"
        >
          <Plus className="h-4 w-4" />
          새 글 작성
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {counts.map(({ board, count }) => (
          <Link
            key={board}
            href={`/admin/posts?board=${board}`}
            className="rounded-2xl border border-[#1A2B4C]/8 bg-white p-5 transition hover:border-[#2DD4BF]/40"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              {BOARD_LABELS[board]}
            </p>
            <p className="mt-2 text-2xl font-bold text-[#1A2B4C]">{count}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">최근 글</h2>
        <ul className="mt-3 divide-y divide-[#1A2B4C]/8 rounded-2xl border border-[#1A2B4C]/8 bg-white">
          {(recent ?? []).length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-muted">등록된 글이 없습니다.</li>
          )}
          {(recent ?? []).map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/posts/${p.id}`}
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#F8FAFC]"
              >
                <span className="shrink-0 rounded-full bg-[#1A2B4C]/5 px-2 py-0.5 text-xs font-medium text-muted">
                  {BOARD_LABELS[p.board as keyof typeof BOARD_LABELS]}
                </span>
                <span className="flex-1 truncate text-sm text-[#1A2B4C]">{p.title}</span>
                {!p.is_published && (
                  <span className="shrink-0 text-xs font-medium text-amber-600">비공개</span>
                )}
                <span className="shrink-0 text-xs text-muted">{formatDate(p.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
