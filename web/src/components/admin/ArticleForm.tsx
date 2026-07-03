"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileCheck } from "lucide-react";
import type { JournalArticle } from "@/lib/journal-types";
import {
  createArticle,
  updateArticle,
  uploadJournalPdf,
  type ArticleInput,
} from "@/lib/journal-admin";

type Props = {
  issueId: string;
  issueFolder: string;
  initialArticle?: JournalArticle;
};

export function ArticleForm({ issueId, issueFolder, initialArticle }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initialArticle);

  const [articleNum, setArticleNum] = useState(initialArticle?.article_num ?? 1);
  const [category, setCategory] = useState(initialArticle?.category ?? "원저");
  const [categoryVariant, setCategoryVariant] = useState<"primary" | "teal">(
    initialArticle?.category_variant ?? "primary"
  );
  const [title, setTitle] = useState(initialArticle?.title ?? "");
  const [authors, setAuthors] = useState(initialArticle?.authors ?? "");
  const [pages, setPages] = useState(initialArticle?.pages ?? "");
  const [doi, setDoi] = useState(initialArticle?.doi ?? "");
  const [keywords, setKeywords] = useState(initialArticle?.keywords?.join(", ") ?? "");
  const [abstract, setAbstract] = useState(initialArticle?.abstract ?? "");
  const [pdfPath, setPdfPath] = useState(initialArticle?.pdf_storage_path ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { path, error } = await uploadJournalPdf(issueFolder, file);
    setUploading(false);
    if (error || !path) {
      alert(`업로드 실패: ${error}`);
      return;
    }
    setPdfPath(path);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pdfPath) {
      setError("PDF를 업로드해주세요.");
      return;
    }
    setSaving(true);
    setError(null);

    const input: ArticleInput = {
      issue_id: issueId,
      article_num: articleNum,
      category: category.trim(),
      category_variant: categoryVariant,
      title: title.trim(),
      authors: authors.trim(),
      pages: pages.trim() || null,
      doi: doi.trim() || null,
      pdf_storage_path: pdfPath,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      abstract: abstract.trim() || null,
      sort_order: articleNum,
    };

    if (isEdit && initialArticle) {
      const { error } = await updateArticle(initialArticle.id, input);
      setSaving(false);
      if (error) {
        setError(error);
        return;
      }
      router.push(`/admin/journal/${issueId}`);
      router.refresh();
    } else {
      const { data, error } = await createArticle(input);
      setSaving(false);
      if (error || !data) {
        setError(error ?? "저장에 실패했습니다.");
        return;
      }
      router.push(`/admin/journal/${issueId}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1A2B4C]">
        {isEdit ? "논문 수정" : "새 논문 등록"}
      </h1>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="articleNum" className="text-sm font-medium text-[#1A2B4C]">
              논문 번호
            </label>
            <input
              id="articleNum"
              type="number"
              required
              value={articleNum}
              onChange={(e) => setArticleNum(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
          <div>
            <label htmlFor="category" className="text-sm font-medium text-[#1A2B4C]">
              분류
            </label>
            <input
              id="category"
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="원저, 체계적 고찰 등"
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
          <div>
            <label htmlFor="categoryVariant" className="text-sm font-medium text-[#1A2B4C]">
              뱃지 색상
            </label>
            <select
              id="categoryVariant"
              value={categoryVariant}
              onChange={(e) => setCategoryVariant(e.target.value as "primary" | "teal")}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            >
              <option value="primary">네이비 (원저)</option>
              <option value="teal">틸 (고찰·분석)</option>
            </select>
          </div>
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

        <div>
          <label htmlFor="authors" className="text-sm font-medium text-[#1A2B4C]">
            저자 (쉼표로 구분)
          </label>
          <input
            id="authors"
            type="text"
            required
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            placeholder="홍길동, 김철수 외 1명"
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pages" className="text-sm font-medium text-[#1A2B4C]">
              페이지 (예: pp. 1-12)
            </label>
            <input
              id="pages"
              type="text"
              value={pages ?? ""}
              onChange={(e) => setPages(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
          <div>
            <label htmlFor="doi" className="text-sm font-medium text-[#1A2B4C]">
              DOI
            </label>
            <input
              id="doi"
              type="text"
              value={doi ?? ""}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="10.14519/kjot.2026.34.1.01"
              className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="keywords" className="text-sm font-medium text-[#1A2B4C]">
            키워드 (쉼표로 구분)
          </label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="감각통합, 아동, 발달"
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>

        <div>
          <label htmlFor="abstract" className="text-sm font-medium text-[#1A2B4C]">
            초록
          </label>
          <textarea
            id="abstract"
            rows={5}
            value={abstract ?? ""}
            onChange={(e) => setAbstract(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-3 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#1A2B4C]">PDF 파일</label>
          <div className="mt-1.5 flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#1A2B4C]/12 bg-white px-3 py-1.5 text-xs font-semibold text-[#1A2B4C] transition hover:border-[#2DD4BF]/40">
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "업로드 중…" : "PDF 선택"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            {pdfPath && (
              <span className="flex items-center gap-1 text-xs text-[#14B8A6]">
                <FileCheck className="h-3.5 w-3.5" />
                {pdfPath.split("/").pop()}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="mt-8 rounded-full bg-[#1A2B4C] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#243B66] disabled:opacity-50"
      >
        {saving ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}
