import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getJournalIssueAdmin } from "@/lib/journal";

type Props = {
  params: Promise<{ issueId: string }>;
};

export const metadata: Metadata = {
  title: "새 논문 등록 | KSOT",
};

export default async function NewArticlePage({ params }: Props) {
  const { issueId } = await params;
  const data = await getJournalIssueAdmin(issueId);
  if (!data) notFound();

  const issueFolder = `${data.issue.volume}-${data.issue.issue}`;

  return <ArticleForm issueId={issueId} issueFolder={issueFolder} />;
}
