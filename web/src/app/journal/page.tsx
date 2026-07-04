import type { Metadata } from "next";
import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { JournalArchive } from "@/components/journal/JournalArchive";
import { getJournalData } from "@/lib/journal";
import { latestIssue, articlesForIssue } from "@/lib/journal-types";

export const metadata: Metadata = {
  title: "대한작업치료학회지(KJOT) | KSOT",
  description: "KCI 등재 학술지 대한작업치료학회지(KJOT) 논문 열람·검색·PDF 다운로드",
};

export default async function JournalPage() {
  const { issues, articles } = await getJournalData();
  const latest = latestIssue(issues);
  const currentArticles = latest ? articlesForIssue(articles, latest.volume, latest.issue) : [];

  return (
    <>
      <section className="border-b border-[#1A2B4C]/8 bg-white py-16 sm:py-20">
        <Container>
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#2DD4BF]/15 px-3 py-1 text-xs font-bold tracking-widest text-[#14B8A6] uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            KCI 등재 학술지
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A2B4C] sm:text-4xl">
            대한작업치료학회지
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            Korean Journal of Occupational Therapy (KJOT) — 작업치료 학술 연구의 성과를
            공유하는 대한작업치료학회 공식 학술지입니다.
          </p>
          <a
            href="https://ksotjournal.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1A2B4C] underline-offset-4 hover:text-[#14B8A6] hover:underline"
          >
            정식 저널 사이트 바로가기 (ksotjournal.kr) →
          </a>
        </Container>
      </section>

      {latest && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeader
              label="Current Issue"
              title="최신호"
              titleAccent={latest.label}
              description={`${latest.published_label ?? ""} · 수록 논문 ${currentArticles.length}편`}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {currentArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section id="archive" className="border-t border-[#1A2B4C]/8 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeader
            label="Archive"
            title="논문"
            titleAccent="아카이브"
            description="권·호를 선택하거나 제목·저자·DOI로 전체 논문을 검색하세요."
          />
          <div className="mb-8 flex flex-col items-start gap-3 rounded-2xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-[#1A2B4C]">
              이 홈페이지에서는 <strong className="font-semibold">2024년 이후</strong> 학술지 바로 검색이
              가능하며, 24년 이전 자료를 포함한 전체 검색은 저널 검색 사이트를 이용해 주세요.
            </p>
            <a
              href="https://ksotjournal.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#1A2B4C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243B66]"
            >
              저널 검색 사이트 바로가기 (ksotjournal.kr) →
            </a>
          </div>
          <Suspense fallback={null}>
            <JournalArchive issues={issues} articles={articles} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
