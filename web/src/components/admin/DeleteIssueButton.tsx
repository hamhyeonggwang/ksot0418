"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteIssue } from "@/lib/journal-admin";

export function DeleteIssueButton({ issueId }: { issueId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("이 호를 삭제하시겠습니까? 소속된 논문도 함께 삭제됩니다.")) return;
    setPending(true);
    const { error } = await deleteIssue(issueId);
    setPending(false);
    if (error) {
      alert(`삭제 실패: ${error}`);
      return;
    }
    router.push("/admin/journal");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-400 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      호 삭제
    </button>
  );
}
