import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getJournalIssueAdmin, getJournalArticleAdmin } from "@/lib/journal";

type Props = {
  params: Promise<{ issueId: string; articleId: string }>;
};

export const metadata: Metadata = {
  title: "논문 수정 | KSOT",
};

export default async function EditArticlePage({ params }: Props) {
  const { issueId, articleId } = await params;
  const [issueData, article] = await Promise.all([
    getJournalIssueAdmin(issueId),
    getJournalArticleAdmin(articleId),
  ]);

  if (!issueData || !article || article.issue_id !== issueId) notFound();

  const issueFolder = `${issueData.issue.volume}-${issueData.issue.issue}`;

  return <ArticleForm issueId={issueId} issueFolder={issueFolder} initialArticle={article} />;
}
