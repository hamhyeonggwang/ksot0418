import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  BOARD_SLUGS,
  BOARD_LABELS,
  isBoardSlug,
  formatDate,
  type BoardSlug,
} from "@/lib/board-types";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export const metadata: Metadata = {
  title: "게시글 관리 | KSOT",
};

type Props = {
  searchParams: Promise<{ board?: string; q?: string }>;
};

export default async function AdminPostsPage({ searchParams }: Props) {
  const { board, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("id, board, title, is_pinned, is_published, created_at")
    .order("created_at", { ascending: false });

  if (board && isBoardSlug(board)) {
    query = query.eq("board", board);
  }
  if (q?.trim()) {
    query = query.ilike("title", `%${q.trim()}%`);
  }

  const { data: posts } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A2B4C]">게시글 관리</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1A2B4C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243B66]"
        >
          <Plus className="h-4 w-4" />
          새 글 작성
        </Link>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" action="/admin/posts">
        <select
          name="board"
          defaultValue={board ?? ""}
          className="rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
        >
          <option value="">전체 게시판</option>
          {BOARD_SLUGS.map((b) => (
            <option key={b} value={b}>
              {BOARD_LABELS[b]}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="제목 검색…"
          className="min-w-[200px] flex-1 rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] placeholder:text-muted outline-none focus:border-[#2DD4BF]/60"
        />
        <button
          type="submit"
          className="rounded-xl bg-[#1A2B4C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243B66]"
        >
          검색
        </button>
      </form>

      <ul className="mt-6 divide-y divide-[#1A2B4C]/8 rounded-2xl border border-[#1A2B4C]/8 bg-white">
        {(posts ?? []).length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-muted">게시글이 없습니다.</li>
        )}
        {(posts ?? []).map((p) => (
          <li key={p.id} className="flex items-center gap-3 px-5 py-3">
            <span className="shrink-0 rounded-full bg-[#1A2B4C]/5 px-2 py-0.5 text-xs font-medium text-muted">
              {BOARD_LABELS[p.board as BoardSlug]}
            </span>
            {p.is_pinned && (
              <span className="shrink-0 text-xs font-bold text-[#14B8A6]">고정</span>
            )}
            <Link
              href={`/admin/posts/${p.id}`}
              className="flex-1 truncate text-sm font-medium text-[#1A2B4C] hover:text-[#14B8A6]"
            >
              {p.title}
            </Link>
            {!p.is_published && (
              <span className="shrink-0 text-xs font-medium text-amber-600">비공개</span>
            )}
            <span className="shrink-0 text-xs text-muted">{formatDate(p.created_at)}</span>
            <DeletePostButton postId={p.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
