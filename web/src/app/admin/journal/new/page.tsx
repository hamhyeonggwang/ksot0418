import type { Metadata } from "next";
import { IssueForm } from "@/components/admin/IssueForm";

export const metadata: Metadata = {
  title: "새 호 추가 | KSOT",
};

export default function NewIssuePage() {
  return <IssueForm />;
}
