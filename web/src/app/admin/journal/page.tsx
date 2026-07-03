import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllJournalIssuesAdmin } from "@/lib/journal";

export const metadata: Metadata = {
  title: "학회지 관리 | KSOT",
};

export default async function AdminJournalPage() {
  const issues = await getAllJournalIssuesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A2B4C]">학회지 관리</h1>
        <Link
          href="/admin/journal/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1A2B4C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243B66]"
        >
          <Plus className="h-4 w-4" />
          새 호 추가
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-[#1A2B4C]/8 rounded-2xl border border-[#1A2B4C]/8 bg-white">
        {issues.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-muted">등록된 호가 없습니다.</li>
        )}
        {issues.map((i) => (
          <li key={i.id}>
            <Link
              href={`/admin/journal/${i.id}`}
              className="flex items-center gap-3 px-5 py-4 transition hover:bg-[#F8FAFC]"
            >
              <span className="flex-1 text-sm font-medium text-[#1A2B4C]">{i.label}</span>
              <span className="text-xs text-muted">{i.published_label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
