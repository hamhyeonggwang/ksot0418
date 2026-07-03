import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, User2, Link2, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getJournalData } from "@/lib/journal";
import { journalPdfUrl } from "@/lib/journal-types";

type Props = {
  params: Promise<{ articleId: string }>;
};

async function loadArticle(articleId: string) {
  const { issues, articles } = await getJournalData();
  const article = articles.find((a) => a.id === articleId);
  if (!article) return null;
  const issue = issues.find((i) => i.id === article.issue_id) ?? null;
  return { article, issue };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleId } = await params;
  const data = await loadArticle(articleId);
  if (!data) return { title: "논문을 찾을 수 없습니다 | KSOT" };

  const { article, issue } = data;
  const authors = article.authors
    .split(",")
    .map((a) => a.split(" 외")[0].trim())
    .filter(Boolean);
  const publicationDate = issue
    ? `${issue.year}/${String(issue.month ?? 1).padStart(2, "0")}`
    : undefined;
  const pdfUrl = journalPdfUrl(article.pdf_storage_path);

  return {
    title: `${article.title} | 대한작업치료학회지`,
    description: article.abstract ?? `${article.authors} · ${article.pages ?? ""}`,
    other: {
      citation_title: article.title,
      citation_author: authors,
      citation_publication_date: publicationDate ?? "",
      citation_journal_title: "대한작업치료학회지 (Korean Journal of Occupational Therapy)",
      citation_volume: String(article.volume),
      citation_issue: String(article.issue),
      citation_firstpage: article.pages?.match(/\d+/)?.[0] ?? "",
      citation_lastpage: article.pages?.match(/\d+-(\d+)/)?.[1] ?? "",
      citation_pdf_url: pdfUrl,
      citation_doi: article.doi ?? "",
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { articleId } = await params;
  const data = await loadArticle(articleId);
  if (!data) notFound();

  const { article, issue } = data;
  const tagCls =
    article.category_variant === "teal"
      ? "bg-[#2DD4BF]/15 text-[#14B8A6]"
      : "bg-[#1A2B4C]/10 text-[#1A2B4C]";

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-[#1A2B4C]"
        >
          <ArrowLeft className="h-4 w-4" />
          학회지 목록으로
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tagCls}`}>
            {article.category}
          </span>
          {issue && <span className="text-sm text-muted">{issue.label}</span>}
          {article.pages && <span className="text-sm text-muted">{article.pages}</span>}
        </div>

        <h1 className="mt-4 text-2xl font-bold leading-snug text-[#1A2B4C] sm:text-3xl">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <User2 className="h-4 w-4" />
            {article.authors}
          </span>
          {article.doi && (
            <span className="flex items-center gap-1.5">
              <Link2 className="h-4 w-4" />
              DOI {article.doi}
            </span>
          )}
        </div>

        <a
          href={journalPdfUrl(article.pdf_storage_path)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1A2B4C] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#243B66]"
        >
          <FileText className="h-4 w-4 text-[#2DD4BF]" />
          PDF 다운로드
        </a>

        {article.abstract && (
          <div className="mt-10 border-t border-[#1A2B4C]/8 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">초록</h2>
            <p className="mt-3 leading-relaxed text-[#1A2B4C]">{article.abstract}</p>
          </div>
        )}

        {article.keywords.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">키워드</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-[#1A2B4C]/10 bg-white px-3 py-1 text-sm text-[#1A2B4C]"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
