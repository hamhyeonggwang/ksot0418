"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { JournalArticle, JournalIssue } from "@/lib/journal-types";
import { ArticleCard } from "./ArticleCard";

type Props = {
  issues: JournalIssue[];
  articles: JournalArticle[];
};

function issueKey(vol: number, iss: number) {
  return `${vol}-${iss}`;
}

export function JournalArchive({ issues, articles }: Props) {
  const searchParams = useSearchParams();
  const [issueValue, setIssueValue] = useState("all");
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const sortedIssues = useMemo(
    () => [...issues].sort((a, b) => b.sort_order - a.sort_order),
    [issues]
  );

  const hasSearched = issueValue !== "all" || query.trim().length > 0;

  const filtered = useMemo(() => {
    let list = [...articles];

    if (issueValue !== "all") {
      const [vol, iss] = issueValue.split("-").map(Number);
      list = list.filter((a) => a.volume === vol && a.issue === iss);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((a) => {
        const title = a.title.toLowerCase();
        const authors = a.authors.toLowerCase();
        const doi = (a.doi ?? "").toLowerCase();
        return title.includes(q) || authors.includes(q) || doi.includes(q);
      });
    }

    return list.sort((a, b) => {
      if (b.volume !== a.volume) return b.volume - a.volume;
      if (b.issue !== a.issue) return b.issue - a.issue;
      return a.sort_order - b.sort_order;
    });
  }, [articles, issueValue, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#1A2B4C]/12 bg-white px-5 py-3 shadow-sm focus-within:border-[#2DD4BF]/60">
          <Search className="h-5 w-5 shrink-0 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="논문 제목, 저자, DOI 검색…"
            className="flex-1 bg-transparent text-base text-[#1A2B4C] placeholder:text-muted outline-none"
            aria-label="논문 검색"
          />
        </div>
        <select
          value={issueValue}
          onChange={(e) => setIssueValue(e.target.value)}
          className="rounded-2xl border border-[#1A2B4C]/12 bg-white px-4 py-3 text-sm font-medium text-[#1A2B4C] shadow-sm outline-none focus:border-[#2DD4BF]/60"
          aria-label="권·호 선택"
        >
          <option value="all">전체 호</option>
          {sortedIssues.map((i) => (
            <option key={i.id} value={issueKey(i.volume, i.issue)}>
              {i.label}
            </option>
          ))}
        </select>
      </div>

      {hasSearched ? (
        <>
          <p className="mt-4 text-sm text-muted">
            검색 결과 <span className="font-semibold text-[#1A2B4C]">{filtered.length}</span>편
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {filtered.length === 0 ? (
              <p className="col-span-full py-12 text-center text-sm text-muted">
                검색 결과가 없습니다.
              </p>
            ) : (
              filtered.map((a) => <ArticleCard key={a.id} article={a} />)
            )}
          </div>
        </>
      ) : (
        <p className="mt-10 py-12 text-center text-sm text-muted">
          검색어를 입력하거나 권·호를 선택하면 논문 목록이 표시됩니다.
        </p>
      )}
    </div>
  );
}
