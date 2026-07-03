/** 학회지 타입 + 순수 헬퍼 — 클라이언트/서버 공용 (next/headers 등 서버 전용 의존성 없음) */

export type JournalIssue = {
  id: string;
  volume: number;
  issue: number;
  year: number;
  month: number | null;
  label: string;
  published_label: string | null;
  article_count: number;
  sort_order: number;
};

export type JournalArticle = {
  id: string;
  issue_id: string;
  article_num: number;
  category: string;
  category_variant: "primary" | "teal";
  title: string;
  authors: string;
  pages: string | null;
  doi: string | null;
  pdf_storage_path: string;
  keywords: string[];
  abstract: string | null;
  sort_order: number;
  volume: number;
  issue: number;
};

export type JournalData = {
  issues: JournalIssue[];
  articles: JournalArticle[];
  source: "supabase" | "seed";
};

export function journalPdfUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (base) {
    return `${base.replace(/\/$/, "")}/storage/v1/object/public/journal/${path}`;
  }
  return `/files/journal/${path}`;
}

export function shortAuthors(authors: string): string {
  if (!authors) return "";
  if (authors.includes(" 외")) return authors.split(",")[0].trim() + " 외";
  const parts = authors.split(",");
  return parts.length > 2 ? parts[0].trim() + " 외" : authors;
}

export function latestIssue(issues: JournalIssue[]): JournalIssue | null {
  if (issues.length === 0) return null;
  return [...issues].sort((a, b) => b.sort_order - a.sort_order)[0];
}

export function articlesForIssue(
  articles: JournalArticle[],
  volume: number,
  issue: number
): JournalArticle[] {
  return articles
    .filter((a) => a.volume === volume && a.issue === issue)
    .sort((a, b) => a.sort_order - b.sort_order);
}
