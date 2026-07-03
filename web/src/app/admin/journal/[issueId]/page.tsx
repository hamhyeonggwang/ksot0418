import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getJournalIssueAdmin } from "@/lib/journal";
import { DeleteIssueButton } from "@/components/admin/DeleteIssueButton";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";

type Props = {
  params: Promise<{ issueId: string }>;
};

export const metadata: Metadata = {
  title: "호 관리 | KSOT",
};

export default async function AdminIssueDetailPage({ params }: Props) {
  const { issueId } = await params;
  const data = await getJournalIssueAdmin(issueId);
  if (!data) notFound();

  const { issue, articles } = data;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B4C]">{issue.label}</h1>
          <p className="mt-1 text-sm text-muted">{issue.published_label}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/journal/${issue.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#1A2B4C]/12 bg-white px-3 py-1.5 text-xs font-semibold text-[#1A2B4C] transition hover:border-[#2DD4BF]/40"
          >
            <Pencil className="h-3.5 w-3.5" />
            호 수정
          </Link>
          <DeleteIssueButton issueId={issue.id} />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
          수록 논문 {articles.length}편
        </h2>
        <Link
          href={`/admin/journal/${issue.id}/articles/new`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1A2B4C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243B66]"
        >
          <Plus className="h-4 w-4" />
          새 논문 등록
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-[#1A2B4C]/8 rounded-2xl border border-[#1A2B4C]/8 bg-white">
        {articles.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-muted">등록된 논문이 없습니다.</li>
        )}
        {articles.map((a) => (
          <li key={a.id} className="flex items-center gap-3 px-5 py-3">
            <span className="shrink-0 rounded-full bg-[#1A2B4C]/5 px-2 py-0.5 text-xs font-medium text-muted">
              {a.article_num}
            </span>
            <Link
              href={`/admin/journal/${issue.id}/articles/${a.id}`}
              className="flex-1 truncate text-sm font-medium text-[#1A2B4C] hover:text-[#14B8A6]"
            >
              {a.title}
            </Link>
            <span className="shrink-0 text-xs text-muted">{a.authors}</span>
            <DeleteArticleButton articleId={a.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
