"use client";

import Link from "next/link";
import { ArrowRight, Bell, GraduationCap, Pin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate, type Post } from "@/lib/board-types";

type Props = {
  notices: Post[];
  educationNotices: Post[];
};

function NoticeList({ posts, boardHref }: { posts: Post[]; boardHref: string }) {
  if (posts.length === 0) {
    return <p className="py-10 text-center text-sm text-muted">등록된 게시글이 없습니다.</p>;
  }
  return (
    <ul className="divide-y divide-[#1A2B4C]/8">
      {posts.map((p) => (
        <li key={p.id}>
          <Link
            href={`${boardHref}/${p.id}`}
            className="flex items-center gap-3 py-3.5 transition hover:opacity-70"
          >
            {p.is_pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-[#14B8A6]" />}
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#1A2B4C]">
              {p.title}
            </span>
            <span className="shrink-0 text-xs text-muted">{formatDate(p.created_at)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function NoticeBoardsSection({ notices, educationNotices }: Props) {
  return (
    <section className="py-16 sm:py-20" id="notices">
      <Container>
        <SectionHeader
          label="Notice"
          title="공지사항"
          titleAccent="& 교육공지"
          description="학회의 새 소식과 보수교육 일정을 놓치지 마세요."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <GlassCard className="!p-0" delay={0}>
            <div className="flex items-center justify-between border-b border-[#1A2B4C]/8 px-5 py-4 sm:px-6">
              <h3 className="flex items-center gap-2 text-base font-bold text-[#1A2B4C]">
                <Bell className="h-4 w-4 text-[#14B8A6]" /> 공지사항
              </h3>
              <Link
                href="/board/notice"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#14B8A6] hover:underline"
              >
                전체보기
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="px-5 sm:px-6">
              <NoticeList posts={notices} boardHref="/board/notice" />
            </div>
          </GlassCard>

          <GlassCard className="!p-0" delay={0.05}>
            <div className="flex items-center justify-between border-b border-[#1A2B4C]/8 px-5 py-4 sm:px-6">
              <h3 className="flex items-center gap-2 text-base font-bold text-[#1A2B4C]">
                <GraduationCap className="h-4 w-4 text-[#14B8A6]" /> 교육공지
              </h3>
              <Link
                href="/board/education"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#14B8A6] hover:underline"
              >
                전체보기
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="px-5 sm:px-6">
              <NoticeList posts={educationNotices} boardHref="/board/education" />
            </div>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
