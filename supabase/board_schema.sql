-- KSOT 게시판 + 관리자 CMS — Supabase schema
-- Dashboard SQL Editor에서 schema.sql 다음에 실행하거나: supabase db push
-- 참고: docs/PRD.md §3

-- 게시판 종류(5종)
do $$ begin
  create type board_slug as enum ('notice', 'resources', 'education', 'conference', 'gallery');
exception
  when duplicate_object then null;
end $$;

-- 기존 DB에 이미 board_slug가 4종으로 생성돼 있다면:
-- alter type board_slug add value if not exists 'gallery';

-- 게시글
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  board board_slug not null,
  title text not null,
  body text not null default '',            -- 마크다운
  is_pinned boolean not null default false,
  is_published boolean not null default true,
  event_date date,                           -- education: 교육일
  place text,                                -- education: 장소
  credits text,                              -- education: 학점
  view_count int not null default 0,
  author_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_board_idx on public.posts (board, is_pinned desc, created_at desc);
create index if not exists posts_title_idx on public.posts using gin (to_tsvector('simple', title));

-- 첨부파일(자료실 등)
create table if not exists public.post_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  file_name text not null,
  storage_path text not null,               -- Storage bucket 'board' 내 경로
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create index if not exists post_attachments_post_id_idx on public.post_attachments (post_id);

-- 관리자 허용 목록(auth.users 중 관리자만 등록)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- RLS
alter table public.posts enable row level security;
alter table public.post_attachments enable row level security;
alter table public.admins enable row level security;

-- 공개 읽기: 발행글만, 관리자는 비발행글도 읽기(미리보기)
drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read"
  on public.posts for select
  to anon, authenticated
  using (
    is_published = true
    or exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

drop policy if exists "attach_public_read" on public.post_attachments;
create policy "attach_public_read"
  on public.post_attachments for select
  to anon, authenticated
  using (true);

-- 관리자만 쓰기
drop policy if exists "posts_admin_write" on public.posts;
create policy "posts_admin_write"
  on public.posts for all
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "attach_admin_write" on public.post_attachments;
create policy "attach_admin_write"
  on public.post_attachments for all
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- admins 테이블: 본인 행만 조회 가능(로그인 후 관리자 여부 확인용), 쓰기는 Dashboard에서 수동
drop policy if exists "admins_self_read" on public.admins;
create policy "admins_self_read"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- 조회수 증가 RPC (익명 사용자는 posts UPDATE 권한이 없으므로 security definer로 우회)
create or replace function public.increment_view_count(post_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.posts
  set view_count = view_count + 1
  where id = post_id and is_published = true;
$$;

grant execute on function public.increment_view_count(uuid) to anon, authenticated;

-- Storage: Dashboard에서 bucket `board` 생성 (Public bucket, 관리자만 업로드)
-- 경로 예: notice/2026-07-01-공지제목/파일명.pdf
