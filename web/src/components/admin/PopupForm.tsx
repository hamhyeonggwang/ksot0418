"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPopup, updatePopup, countActivePopupsClient } from "@/lib/popup-admin";
import { popupAssetUrl, MAX_ACTIVE_POPUPS, type PopupNotice } from "@/lib/popup-types";

type Props = {
  initialPopup?: PopupNotice;
};

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

export function PopupForm({ initialPopup }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initialPopup);

  const [title, setTitle] = useState(initialPopup?.title ?? "");
  const [linkUrl, setLinkUrl] = useState(initialPopup?.link_url ?? "");
  const [startsAt, setStartsAt] = useState(
    toDatetimeLocal(initialPopup?.starts_at ?? new Date().toISOString())
  );
  const [endsAt, setEndsAt] = useState(toDatetimeLocal(initialPopup?.ends_at ?? null));
  const [sortOrder, setSortOrder] = useState(initialPopup?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(initialPopup?.is_active ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isEdit && !file) {
      setError("이미지 또는 PDF 파일을 선택하세요.");
      return;
    }

    if (isActive) {
      const activeCount = await countActivePopupsClient(initialPopup?.id);
      if (activeCount >= MAX_ACTIVE_POPUPS) {
        setError(
          `동시 노출 가능한 팝업은 최대 ${MAX_ACTIVE_POPUPS}개입니다. 다른 팝업을 먼저 비활성화하세요.`
        );
        return;
      }
    }

    setSaving(true);

    const input = {
      title: title.trim(),
      link_url: linkUrl.trim() || null,
      starts_at: fromDatetimeLocal(startsAt) ?? new Date().toISOString(),
      ends_at: fromDatetimeLocal(endsAt),
      sort_order: sortOrder,
      is_active: isActive,
    };

    if (isEdit && initialPopup) {
      const { error } = await updatePopup(
        initialPopup.id,
        input,
        file ?? undefined,
        initialPopup.storage_path
      );
      setSaving(false);
      if (error) {
        setError(error);
        return;
      }
      router.push("/admin/popups");
      router.refresh();
    } else {
      const { error } = await createPopup(input, file!);
      setSaving(false);
      if (error) {
        setError(error);
        return;
      }
      router.push("/admin/popups");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <h1 className="text-2xl font-bold text-[#1A2B4C]">
        {isEdit ? "팝업 공지 수정" : "새 팝업 공지"}
      </h1>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-[#1A2B4C]">
            관리용 제목
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 2026 정기총회 안내 팝업"
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>

        <div>
          <label htmlFor="file" className="text-sm font-medium text-[#1A2B4C]">
            팝업 파일 (이미지 또는 PDF)
          </label>
          <input
            id="file"
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1.5 w-full text-sm text-[#1A2B4C]"
          />
          {isEdit && initialPopup && !file && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              현재 파일: {initialPopup.media_type === "pdf" ? "PDF" : "이미지"}
              {initialPopup.media_type === "image" && (
                <Image
                  src={popupAssetUrl(initialPopup.storage_path)}
                  alt="현재 팝업 이미지"
                  width={64}
                  height={64}
                  unoptimized
                  className="rounded-lg border border-[#1A2B4C]/10 object-cover"
                />
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="linkUrl" className="text-sm font-medium text-[#1A2B4C]">
            클릭 시 이동 링크 (선택)
          </label>
          <input
            id="linkUrl"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="startsAt" className="text-sm font-medium text-[#1A2B4C]">
              노출 시작
            </label>
            <input
              id="startsAt"
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-3 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
          <div>
            <label htmlFor="endsAt" className="text-sm font-medium text-[#1A2B4C]">
              노출 종료 (비우면 무기한)
            </label>
            <input
              id="endsAt"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-3 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="sortOrder" className="text-sm font-medium text-[#1A2B4C]">
            노출 순서 (낮을수록 먼저 표시)
          </label>
          <input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="mt-1.5 w-32 rounded-xl border border-[#1A2B4C]/12 px-3 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-[#1A2B4C]">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-[#1A2B4C]/20"
          />
          활성화 (노출기간 내면 랜딩페이지에 표시)
        </label>
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
