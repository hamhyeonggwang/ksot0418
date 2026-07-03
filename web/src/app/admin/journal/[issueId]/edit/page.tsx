import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IssueForm } from "@/components/admin/IssueForm";
import { getJournalIssueAdmin } from "@/lib/journal";

type Props = {
  params: Promise<{ issueId: string }>;
};

export const metadata: Metadata = {
  title: "호 수정 | KSOT",
};

export default async function EditIssuePage({ params }: Props) {
  const { issueId } = await params;
  const data = await getJournalIssueAdmin(issueId);
  if (!data) notFound();

  return <IssueForm initialIssue={data.issue} />;
}
