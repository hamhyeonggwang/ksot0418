-- KSOT 학회지 (KJOT) — Supabase schema
-- Dashboard SQL Editor에서 실행하거나: supabase db push

-- 권·호 (간행물 호)
create table if not exists public.journal_issues (
  id uuid primary key default gen_random_uuid(),
  volume int not null,
  issue int not null,
  year int not null,
  month int,
  label text not null,
  published_label text,
  article_count int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (volume, issue)
);

-- 논문
create table if not exists public.journal_articles (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.journal_issues (id) on delete cascade,
  article_num int not null,
  category text not null,
  category_variant text not null default 'primary' check (category_variant in ('primary', 'teal')),
  title text not null,
  authors text not null,
  pages text,
  doi text,
  pdf_storage_path text not null,
  keywords text[] default '{}',
  abstract text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (issue_id, article_num)
);

create index if not exists journal_articles_issue_id_idx on public.journal_articles (issue_id);
create index if not exists journal_articles_title_idx on public.journal_articles using gin (to_tsvector('simple', title));

alter table public.journal_issues enable row level security;
alter table public.journal_articles enable row level security;

-- 공개 읽기 (학회지 열람)
create policy "journal_issues_public_read"
  on public.journal_issues for select
  to anon, authenticated
  using (true);

create policy "journal_articles_public_read"
  on public.journal_articles for select
  to anon, authenticated
  using (true);

-- 학회지 관리 CMS (PRD §4.5) — 관리자만 쓰기 가능 (board_schema.sql의 admins 테이블 필요)
create policy "journal_issues_admin_write"
  on public.journal_issues for all
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "journal_articles_admin_write"
  on public.journal_articles for all
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Storage: Dashboard에서 bucket `journal` 생성 (Public bucket)
-- 경로 예: 34-1/01.pdf
