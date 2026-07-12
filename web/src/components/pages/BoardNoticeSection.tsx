import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Pin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BOARD_LABELS, formatDate, type BoardSlug, type Post } from "@/lib/board-types";

type Props = {
  boardSlug: BoardSlug;
  posts: Post[];
  title?: string;
  icon: LucideIcon;
};

/** 정적 페이지에 게시판 최신글을 붙이는 CMS 섹션 — 관리자 글쓰기가 실제로 반영되는 지점 */
export function BoardNoticeSection({ boardSlug, posts, title, icon: Icon }: Props) {
  return (
    <section className="content-section" id={`board-${boardSlug}`}>
      <div className="content-header">
        <h2>
          <Icon className="h-[18px] w-[18px] text-[#1A2B4C]" />
          {title ?? BOARD_LABELS[boardSlug]}
        </h2>
        <div className="content-actions">
          <Link
            href={`/board/${boardSlug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#14B8A6] hover:underline"
          >
            전체보기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">등록된 게시글이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-[#1A2B4C]/8">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/board/${boardSlug}/${p.id}`}
                className="flex flex-wrap items-center gap-3 py-3 transition hover:opacity-70"
              >
                {p.is_pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-[#14B8A6]" />}
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#1A2B4C]">
                  {p.title}
                </span>
                {p.event_date && (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    {p.event_date}
                  </span>
                )}
                {p.place && (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {p.place}
                  </span>
                )}
                <span className="shrink-0 text-xs text-muted">{formatDate(p.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
