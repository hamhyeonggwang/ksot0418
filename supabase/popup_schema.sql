-- KSOT 팝업 공지 — Supabase schema
-- Dashboard SQL Editor에서 schema.sql, board_schema.sql 다음에 실행하거나: supabase db push
-- 관리자 로그인 후 이미지/PDF 업로드 → 랜딩페이지 반투명 오버레이 팝업(최대 동시 3개)

create table if not exists public.popup_notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,                      -- 관리용 제목(팝업 화면엔 미노출)
  media_type text not null check (media_type in ('image', 'pdf')),
  storage_path text not null,               -- bucket 'popup' 내 경로
  link_url text,                            -- 클릭 시 이동(선택)
  starts_at timestamptz not null default now(),
  ends_at timestamptz,                      -- null이면 무기한 노출
  sort_order int not null default 0,        -- 낮을수록 먼저 노출(카스케이드 앞쪽)
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists popup_notices_active_idx
  on public.popup_notices (is_active, sort_order);

alter table public.popup_notices enable row level security;

-- 공개 읽기: 활성 + 노출기간 내인 팝업만
drop policy if exists "popup_notices_public_read" on public.popup_notices;
create policy "popup_notices_public_read"
  on public.popup_notices for select
  to anon, authenticated
  using (
    is_active = true
    and starts_at <= now()
    and (ends_at is null or ends_at >= now())
  );

-- 관리자만 쓰기 (board_schema.sql의 admins 테이블 필요)
drop policy if exists "popup_notices_admin_write" on public.popup_notices;
create policy "popup_notices_admin_write"
  on public.popup_notices for all
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 관리자는 비활성/기간 만료 팝업도 목록에서 볼 수 있어야 하므로 별도 정책 추가
drop policy if exists "popup_notices_admin_read_all" on public.popup_notices;
create policy "popup_notices_admin_read_all"
  on public.popup_notices for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Storage: Dashboard에서 bucket `popup` 생성 (Public bucket, 관리자만 업로드)
-- 경로 예: popup/{uuid}-파일명.(png|jpg|pdf)
