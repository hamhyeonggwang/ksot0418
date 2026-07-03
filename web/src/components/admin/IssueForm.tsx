"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { JournalIssue } from "@/lib/journal-types";
import { createIssue, updateIssue, type IssueInput } from "@/lib/journal-admin";

type Props = {
  initialIssue?: JournalIssue;
};

export function IssueForm({ initialIssue }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initialIssue);

  const [volume, setVolume] = useState(initialIssue?.volume ?? new Date().getFullYear() - 1992);
  const [issue, setIssue] = useState(initialIssue?.issue ?? 1);
  const [year, setYear] = useState(initialIssue?.year ?? new Date().getFullYear());
  const [month, setMonth] = useState(initialIssue?.month ?? 1);
  const [label, setLabel] = useState(initialIssue?.label ?? "");
  const [publishedLabel, setPublishedLabel] = useState(initialIssue?.published_label ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const input: IssueInput = {
      volume,
      issue,
      year,
      month: month || null,
      label: label.trim(),
      published_label: publishedLabel.trim() || null,
      article_count: initialIssue?.article_count ?? 0,
      sort_order: volume * 100 + issue,
    };

    if (isEdit && initialIssue) {
      const { error } = await updateIssue(initialIssue.id, input);
      setSaving(false);
      if (error) {
        setError(error);
        return;
      }
      router.push(`/admin/journal/${initialIssue.id}`);
      router.refresh();
    } else {
      const { data, error } = await createIssue(input);
      setSaving(false);
      if (error || !data) {
        setError(error ?? "저장에 실패했습니다.");
        return;
      }
      router.push(`/admin/journal/${data.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <h1 className="text-2xl font-bold text-[#1A2B4C]">{isEdit ? "호 수정" : "새 호 추가"}</h1>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="volume" className="text-sm font-medium text-[#1A2B4C]">
              권 (volume)
            </label>
            <input
              id="volume"
              type="number"
              required
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
          <div>
            <label htmlFor="issue" className="text-sm font-medium text-[#1A2B4C]">
              호 (issue)
            </label>
            <input
              id="issue"
              type="number"
              required
              value={issue}
              onChange={(e) => setIssue(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="year" className="text-sm font-medium text-[#1A2B4C]">
              발행 연도
            </label>
            <input
              id="year"
              type="number"
              required
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
          <div>
            <label htmlFor="month" className="text-sm font-medium text-[#1A2B4C]">
              발행 월
            </label>
            <input
              id="month"
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="label" className="text-sm font-medium text-[#1A2B4C]">
            표시 라벨 (예: 제34권 제2호)
          </label>
          <input
            id="label"
            type="text"
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>

        <div>
          <label htmlFor="publishedLabel" className="text-sm font-medium text-[#1A2B4C]">
            발행 정보 (예: 2026년 6월 발행)
          </label>
          <input
            id="publishedLabel"
            type="text"
            value={publishedLabel}
            onChange={(e) => setPublishedLabel(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-8 rounded-full bg-[#1A2B4C] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#243B66] disabled:opacity-50"
      >
        {saving ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}
