import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { JournalArticle, JournalData, JournalIssue } from "@/lib/journal-types";

export type { JournalIssue, JournalArticle, JournalData } from "@/lib/journal-types";
export {
  journalPdfUrl,
  shortAuthors,
  latestIssue,
  articlesForIssue,
} from "@/lib/journal-types";

/** Supabase 미연결 시 폴백 (제34권 1호 — files/journal/34-1 와 동기화) */
const SEED_ISSUES: JournalIssue[] = [
  {
    id: "seed-34-1",
    volume: 34,
    issue: 1,
    year: 2026,
    month: 3,
    label: "제34권 제1호",
    published_label: "2026년 3월 발행",
    article_count: 8,
    sort_order: 3401,
  },
];

const SEED_ARTICLES: JournalArticle[] = [
  { id: "seed-34-1-1", issue_id: "seed-34-1", article_num: 1, category: "원저", category_variant: "primary", title: "척수장애인의 여가활동 만족도가 삶의 만족도에 미치는 영향: 자립과 정서적 도움의 다중매개효과", authors: "유승모, 차태현, 김희 외 1명", pages: "pp. 1-12", doi: "10.14519/kjot.2026.34.1.01", pdf_storage_path: "34-1/01.pdf", keywords: [], abstract: null, sort_order: 1, volume: 34, issue: 1 },
  { id: "seed-34-1-2", issue_id: "seed-34-1", article_num: 2, category: "원저", category_variant: "primary", title: "Sensory Profile-2 Summary and Interpretation (SPSI) ChatBot 프로토타입 개발 및 활용 전망", authors: "박다솔", pages: "pp. 13-22", doi: "10.14519/kjot.2026.34.1.02", pdf_storage_path: "34-1/02.pdf", keywords: [], abstract: null, sort_order: 2, volume: 34, issue: 1 },
  { id: "seed-34-1-3", issue_id: "seed-34-1", article_num: 3, category: "원저", category_variant: "primary", title: "중국인유학생을 위한 작업역할기반 시간사용중재 프로그램 적용의 효과", authors: "양몽은, 정민예", pages: "pp. 23-36", doi: "10.14519/kjot.2026.34.1.03", pdf_storage_path: "34-1/03.pdf", keywords: [], abstract: null, sort_order: 3, volume: 34, issue: 1 },
  { id: "seed-34-1-4", issue_id: "seed-34-1", article_num: 4, category: "원저", category_variant: "primary", title: "상호작용식 메트로놈 중재가 뇌졸중 환자의 집중력, 기능적 활동 및 삶의 질에 미치는 영향", authors: "손솔, 김덕주", pages: "pp. 37-58", doi: "10.14519/kjot.2026.34.1.04", pdf_storage_path: "34-1/04.pdf", keywords: [], abstract: null, sort_order: 4, volume: 34, issue: 1 },
  { id: "seed-34-1-5", issue_id: "seed-34-1", article_num: 5, category: "계량서지학적 분석", category_variant: "teal", title: "중환자실 작업치료의 연구 동향: 계량서지학적 분석", authors: "심혜림, 김수경", pages: "pp. 59-72", doi: "10.14519/kjot.2026.34.1.05", pdf_storage_path: "34-1/05.pdf", keywords: [], abstract: null, sort_order: 5, volume: 34, issue: 1 },
  { id: "seed-34-1-6", issue_id: "seed-34-1", article_num: 6, category: "범위 문헌고찰", category_variant: "teal", title: "커뮤니티 케어 서비스 대상자 선정기준에 관한 연구: 범위 문헌고찰", authors: "박은지, 홍익표", pages: "pp. 73-85", doi: "10.14519/kjot.2026.34.1.06", pdf_storage_path: "34-1/06.pdf", keywords: [], abstract: null, sort_order: 6, volume: 34, issue: 1 },
  { id: "seed-34-1-7", issue_id: "seed-34-1", article_num: 7, category: "체계적 고찰 및 메타분석", category_variant: "teal", title: "감각통합기반 중재가 발달지연 및 장애 아동의 운동기능에 미치는 효과: 체계적 고찰 및 메타분석", authors: "임대웅, 차태현, 유두한 외 1명", pages: "pp. 87-102", doi: "10.14519/kjot.2026.34.1.07", pdf_storage_path: "34-1/07.pdf", keywords: [], abstract: null, sort_order: 7, volume: 34, issue: 1 },
  { id: "seed-34-1-8", issue_id: "seed-34-1", article_num: 8, category: "체계적 고찰", category_variant: "teal", title: "휠체어 사용자의 이승(Transfer)에 영향을 미치는 요인에 관한 체계적 고찰", authors: "홍진이, 권영훈, 김종배", pages: "pp. 103-121", doi: "10.14519/kjot.2026.34.1.08", pdf_storage_path: "34-1/08.pdf", keywords: [], abstract: null, sort_order: 8, volume: 34, issue: 1 },
];

function seedData(): JournalData {
  return { issues: SEED_ISSUES, articles: SEED_ARTICLES, source: "seed" };
}

/** 전체 호·논문 조회 (SSR 전용). Supabase 미설정/오류 시 시드로 폴백 */
export async function getJournalData(): Promise<JournalData> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return seedData();
  }

  try {
    const supabase = await createClient();

    const [{ data: issues, error: issuesErr }, { data: articlesRaw, error: articlesErr }] =
      await Promise.all([
        supabase
          .from("journal_issues")
          .select("*")
          .order("sort_order", { ascending: false }),
        supabase
          .from("journal_articles")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

    if (issuesErr || articlesErr || !issues || !articlesRaw) {
      throw issuesErr ?? articlesErr ?? new Error("journal data empty");
    }

    const issueMap = new Map(issues.map((i) => [i.id, i]));
    const articles: JournalArticle[] = articlesRaw.map((a) => {
      const iss = issueMap.get(a.issue_id);
      return { ...a, volume: iss?.volume ?? 0, issue: iss?.issue ?? 0 };
    });

    if (issues.length === 0) return seedData();

    return { issues, articles, source: "supabase" };
  } catch {
    return seedData();
  }
}

export async function getJournalArticle(articleId: string): Promise<JournalArticle | null> {
  const { articles } = await getJournalData();
  return articles.find((a) => a.id === articleId) ?? null;
}

/** 관리자 CMS 전용 — 시드 폴백 없이 실 DB만 조회 */
export async function getJournalIssueAdmin(issueId: string) {
  const supabase = await createClient();
  const { data: issue } = await supabase
    .from("journal_issues")
    .select("*")
    .eq("id", issueId)
    .maybeSingle();
  if (!issue) return null;

  const { data: articles } = await supabase
    .from("journal_articles")
    .select("*")
    .eq("issue_id", issueId)
    .order("sort_order", { ascending: true });

  return { issue: issue as JournalIssue, articles: (articles ?? []) as JournalArticle[] };
}

export async function getJournalArticleAdmin(articleId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("journal_articles")
    .select("*")
    .eq("id", articleId)
    .maybeSingle();
  return data as JournalArticle | null;
}

export async function getAllJournalIssuesAdmin(): Promise<JournalIssue[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("journal_issues")
    .select("*")
    .order("sort_order", { ascending: false });
  return (data ?? []) as JournalIssue[];
}
