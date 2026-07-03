"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Upload, Trash2 } from "lucide-react";
import {
  BOARD_SLUGS,
  BOARD_LABELS,
  formatBytes,
  type BoardSlug,
  type Post,
  type PostAttachment,
} from "@/lib/board-types";
import {
  createPost,
  updatePost,
  uploadAttachment,
  deleteAttachment,
  type PostInput,
} from "@/lib/board-admin";
import { MarkdownBody } from "@/components/board/MarkdownBody";

type Props = {
  initialPost?: Post;
  initialAttachments?: PostAttachment[];
};

export function PostForm({ initialPost, initialAttachments = [] }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initialPost);

  const [board, setBoard] = useState<BoardSlug>(initialPost?.board ?? "notice");
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [body, setBody] = useState(initialPost?.body ?? "");
  const [isPinned, setIsPinned] = useState(initialPost?.is_pinned ?? false);
  const [isPublished, setIsPublished] = useState(initialPost?.is_published ?? true);
  const [eventDate, setEventDate] = useState(initialPost?.event_date ?? "");
  const [place, setPlace] = useState(initialPost?.place ?? "");
  const [credits, setCredits] = useState(initialPost?.credits ?? "");
  const [preview, setPreview] = useState(false);
  const [attachments, setAttachments] = useState(initialAttachments);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const input: PostInput = {
      board,
      title: title.trim(),
      body,
      is_pinned: isPinned,
      is_published: isPublished,
      event_date: board === "education" && eventDate ? eventDate : null,
      place: board === "education" && place ? place : null,
      credits: board === "education" && credits ? credits : null,
    };

    if (isEdit && initialPost) {
      const { error } = await updatePost(initialPost.id, input);
      setSaving(false);
      if (error) {
        setError(error);
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } else {
      const { data, error } = await createPost(input);
      setSaving(false);
      if (error || !data) {
        setError(error ?? "저장에 실패했습니다.");
        return;
      }
      router.push(`/admin/posts/${data.id}`);
      router.refresh();
    }
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !initialPost) return;
    setUploading(true);
    const { error } = await uploadAttachment(initialPost.id, file);
    setUploading(false);
    e.target.value = "";
    if (error) {
      alert(`업로드 실패: ${error}`);
      return;
    }
    router.refresh();
  }

  async function handleDeleteAttachment(id: string, path: string) {
    if (!confirm("첨부파일을 삭제하시겠습니까?")) return;
    const { error } = await deleteAttachment(id, path);
    if (error) {
      alert(`삭제 실패: ${error}`);
      return;
    }
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1A2B4C]">
        {isEdit ? "게시글 수정" : "새 글 작성"}
      </h1>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor="board" className="text-sm font-medium text-[#1A2B4C]">
            게시판
          </label>
          <select
            id="board"
            value={board}
            onChange={(e) => setBoard(e.target.value as BoardSlug)}
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          >
            {BOARD_SLUGS.map((b) => (
              <option key={b} value={b}>
                {BOARD_LABELS[b]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="text-sm font-medium text-[#1A2B4C]">
            제목
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>

        {board === "education" && (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="eventDate" className="text-sm font-medium text-[#1A2B4C]">
                교육일
              </label>
              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-3 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
              />
            </div>
            <div>
              <label htmlFor="place" className="text-sm font-medium text-[#1A2B4C]">
                장소
              </label>
              <input
                id="place"
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-3 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
              />
            </div>
            <div>
              <label htmlFor="credits" className="text-sm font-medium text-[#1A2B4C]">
                학점
              </label>
              <input
                id="credits"
                type="text"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-3 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="body" className="text-sm font-medium text-[#1A2B4C]">
              본문 (마크다운)
            </label>
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#1A2B4C]"
            >
              {preview ? (
                <>
                  <Pencil className="h-3.5 w-3.5" />
                  편집
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  미리보기
                </>
              )}
            </button>
          </div>
          {preview ? (
            <div className="mt-1.5 min-h-[240px] rounded-xl border border-[#1A2B4C]/12 bg-[#F8FAFC] p-4">
              <MarkdownBody body={body || "_내용 없음_"} />
            </div>
          ) : (
            <textarea
              id="body"
              required
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-3 font-mono text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          )}
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-[#1A2B4C]">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="h-4 w-4 rounded border-[#1A2B4C]/20"
            />
            상단 고정
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-[#1A2B4C]">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-[#1A2B4C]/20"
            />
            공개 발행
          </label>
        </div>

        {isEdit && initialPost ? (
          <div className="border-t border-[#1A2B4C]/8 pt-5">
            <label className="text-sm font-medium text-[#1A2B4C]">첨부파일</label>
            <ul className="mt-2 space-y-2">
              {attachments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-2 rounded-lg border border-[#1A2B4C]/8 px-3 py-2 text-sm"
                >
                  <span className="flex-1 truncate text-[#1A2B4C]">{a.file_name}</span>
                  <span className="text-xs text-muted">{formatBytes(a.size_bytes)}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteAttachment(a.id, a.storage_path)}
                    className="text-muted hover:text-red-600"
                    aria-label="첨부파일 삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#1A2B4C]/12 bg-white px-3 py-1.5 text-xs font-semibold text-[#1A2B4C] transition hover:border-[#2DD4BF]/40">
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "업로드 중…" : "파일 추가"}
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>
        ) : (
          <p className="text-xs text-muted">첨부파일은 저장 후 추가할 수 있습니다.</p>
        )}
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
