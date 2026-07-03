import Link from "next/link";
import { FileText, User2, Link2 } from "lucide-react";
import type { JournalArticle } from "@/lib/journal-types";
import { journalPdfUrl } from "@/lib/journal-types";

function CategoryTag({ category, variant }: { category: string; variant: "primary" | "teal" }) {
  const cls =
    variant === "teal"
      ? "bg-[#2DD4BF]/15 text-[#14B8A6]"
      : "bg-[#1A2B4C]/10 text-[#1A2B4C]";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>{category}</span>
  );
}

export function ArticleCard({ article }: { article: JournalArticle }) {
  return (
    <div className="rounded-2xl border border-[#1A2B4C]/8 bg-white p-5 transition hover:border-[#2DD4BF]/40 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryTag category={article.category} variant={article.category_variant} />
        {article.pages && <span className="text-xs text-muted">{article.pages}</span>}
      </div>

      <Link href={`/journal/${article.id}`} className="block">
        <h3 className="mt-3 text-[15px] font-semibold leading-relaxed text-[#1A2B4C] hover:text-[#14B8A6]">
          {article.title}
        </h3>
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
        <span className="flex items-center gap-1.5">
          <User2 className="h-3.5 w-3.5" />
          {article.authors}
        </span>
        {article.doi && (
          <span className="flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5" />
            DOI {article.doi}
          </span>
        )}
        <a
          href={journalPdfUrl(article.pdf_storage_path)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 font-semibold text-[#1A2B4C] hover:text-[#14B8A6]"
        >
          <FileText className="h-3.5 w-3.5" />
          PDF
        </a>
      </div>
    </div>
  );
}
