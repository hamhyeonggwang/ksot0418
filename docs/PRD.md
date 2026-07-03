# 대한작업치료학회(KSOT) 리뉴얼 PRD

> 페이지별 제품 요구사항 정의서 (Product Requirements Document)
> v2 — 최종 갱신: 2026-07-03 (PM 리뷰 + UX/UI 디자인 가이드 반영)

---

## 0. 개요 · 목표

기존 `ksot.kr` 정적 사이트를 **Next.js + Supabase** 기반 플랫폼으로 리뉴얼한다.

### 핵심 목표
1. **학회지(KJOT)** — Supabase 연동으로 논문 자료 저장·검색이 가능한 구조
2. **관리자 CMS** — 관리자 로그인(Supabase Auth) 후 게시판 글 등록/수정/삭제
3. **학술대회** — [ksot0919.vercel.app](https://ksot0919.vercel.app/index.html) 외부 사이트로 연동(링크 이동)

### 확정 결정사항
| 항목 | 결정 | 근거 |
|------|------|------|
| 학술대회 연동 | **외부 링크 이동** (새 탭) | 두 사이트 분리 운영, 최소 공수 |
| 인증 범위 | **관리자 전용** (회원 기능은 Phase 5) | 목표 집중 |
| 게시판 범위 | 공지사항 · 자료실 · 보수교육 일정 · 학술대회 공지 (4종) | |
| 학회지 운영 | **v1은 개발자 운영**(seed + 업로드 스크립트), 관리 CMS는 **Phase 4** | 연 4회 저빈도 vs 개발비용, 8월 게시판 데드라인 우선 |

### 핵심 데드라인
- **2026.8.17~31 학술대회 사전등록** → 8월 초까지 게시판·CMS 가동 (Phase 3 완료)
- 34권 3호 발행(~9월) → 개발자 운영으로 커버 가능

---

## 1. 사용자 · 성공 지표

### 1.1 페르소나
| # | 페르소나 | 핵심 과업 | 시사점 |
|---|---------|----------|--------|
| P1 | **임상 치료사** (회원, 모바일 위주, 30~50대) | 보수교육 일정·학점 확인, 학술대회 등록 | 모바일 퍼스트, 일정 카드 UI, 큰 터치 타깃 |
| P2 | **연구자·대학원생** (데스크톱, 검색 유입) | 논문 검색→초록 확인→PDF 다운로드 | 검색 정확도, SEO/Scholar 색인, 3클릭 이내 PDF |
| P3 | **학회 사무국 관리자** (비개발자) | 공지·자료·일정 등록 | 단순한 CMS UX, 실수 방지(미리보기·발행 토글) |

### 1.2 유저 스토리 (핵심)
- P1: "출퇴근 중 폰으로 다음 보수교육 날짜·장소·학점을 30초 안에 확인하고 싶다"
- P2: "'감각통합' 검색으로 관련 논문 목록을 보고 PDF를 바로 열고 싶다"
- P3: "개발자 도움 없이 공지 하나를 5분 안에 올리고 싶다"

### 1.3 성공 지표 (KPI)
| 지표 | 목표 |
|------|------|
| 사무국 공지 등록 소요 | **5분 이내** (개발자 개입 0) |
| 논문 검색 → PDF 열람 | **3클릭 이내** |
| 신규 호 발행 반영 리드타임 | v1: 1일 이내(개발자) → Phase 4 후: 사무국 자체 처리 |
| Lighthouse (모바일, 콘텐츠 페이지) | Performance ≥ 85 · Accessibility ≥ 95 |
| Google Scholar 색인 | 신규 호 논문 발행 후 1개월 내 색인 |

---

## 2. 아키텍처 · 공통

### 2.1 기술 스택
- **Frontend**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · framer-motion
- **Backend**: Supabase (Postgres · Auth · Storage · RLS)
- **배포**: Vercel (`web/` 루트, Framework Preset = Next.js)

### 2.2 라우트 맵 (목표)
| 경로 | 유형 | 데이터 | 상태 |
|------|------|--------|------|
| `/` | Next (Server) | 정적 + 최신글(Supabase) | 리팩터 |
| `/journal` | Next (**SSR**) | Supabase `journal_*` | **신규 이관** |
| `/journal/[articleId]` | Next (**SSR**) | 논문 상세 + Scholar 메타 | **신규** |
| `/board/[slug]` | Next | Supabase `posts` | **신규** (4종 공용) |
| `/board/[slug]/[id]` | Next | Supabase `posts` | **신규** (상세) |
| `/admin/*` | Next (Client) | Supabase Auth + CRUD | **신규** |
| `/conference` | 외부 리다이렉트 | — | **신규** (→ ksot0919) |
| `/pages/*.html` | 레거시 정적 | — | 유지 (헤더/푸터 톤 통일) |

> **원칙**: 동적·검색·CMS 페이지는 Next 라우트로 이관. 순수 정적 페이지는 레거시 유지.
> **SEO 원칙**: 학회지 관련 라우트는 반드시 Server Component/SSR — 클라이언트 온리 렌더 금지 (Scholar 색인 필수).

### 2.3 환경변수
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # 서버 전용, NEXT_PUBLIC_ 금지
```

### 2.4 Supabase 클라이언트
- `web/src/lib/supabase/client.ts` — 브라우저 anon
- `web/src/lib/supabase/server.ts` — 서버(쿠키 세션), `@supabase/ssr`

### 2.5 완료 기준(공통)
- [ ] anon 키만으로 공개 읽기 가능, 쓰기는 RLS 차단
- [ ] 미인증 `/admin` 접근 → 로그인 리다이렉트
- [ ] 모바일 우선 반응형 + §5 디자인 가이드 준수
- [ ] Supabase 미설정 환경에서 시드 폴백 렌더

---

## 3. 데이터 모델 (Supabase)

### 3.1 기존 테이블 (유지)
- `journal_issues` — 권·호 / `journal_articles` — 논문 메타 + `pdf_storage_path`

### 3.2 신규 테이블
```sql
create type board_slug as enum ('notice', 'resources', 'education', 'conference');

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

create table if not exists public.post_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
```

### 3.3 RLS 정책
```sql
alter table public.posts enable row level security;
alter table public.post_attachments enable row level security;
alter table public.admins enable row level security;

-- 공개 읽기: 게시글은 발행분만, 단 관리자는 비발행분도 읽기(미리보기)
create policy "posts_public_read" on public.posts
  for select to anon, authenticated
  using (
    is_published = true
    or exists (select 1 from public.admins a where a.user_id = auth.uid())
  );
create policy "attach_public_read" on public.post_attachments
  for select to anon, authenticated using (true);

-- 관리자만 쓰기
create policy "posts_admin_write" on public.posts
  for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "attach_admin_write" on public.post_attachments
  for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
```

### 3.4 조회수 RPC (RLS 우회 필수)
익명 방문자는 posts UPDATE 권한이 없으므로 `security definer` 함수로 처리:
```sql
create or replace function public.increment_view_count(post_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.posts set view_count = view_count + 1
  where id = post_id and is_published = true;
$$;
grant execute on function public.increment_view_count(uuid) to anon, authenticated;
```

### 3.5 Storage
| 버킷 | 공개 | 용도 | 비고 |
|------|------|------|------|
| `journal` | Public | 논문 PDF (기존) | |
| `board` | Public 읽기 / 관리자 쓰기 | 게시판 첨부 | **글 삭제 시 Storage 파일도 삭제** (고아 파일 방지 — 삭제 핸들러에서 처리) |

---

## 4. 페이지별 PRD

### 4.1 홈 `/`
**목적** — 대문. 핵심 경로 진입 + 최신 소식.

**요구사항**
- 최신 공지 3건: `posts`(notice) → 하드코딩 `announcements` 대체
- 최신 논문 3건: 최신 호 `journal_articles` → `latestPapers` 대체
- 학술대회 CTA → ksot0919 **새 탭**
- Server Component SSR, 실패 시 시드 폴백
- (운영 문서화) `data.ts`의 학술대회 연사·일정·통계는 **연 1회 코드 갱신 필요** 항목으로 명시

**완료 기준**
- [ ] 관리자 공지 등록 → 홈 자동 반영
- [ ] 학술대회 진입점 외부 새 탭 일관
- [ ] 폴백 렌더 정상

### 4.2 학회지 `/journal` · `/journal/[articleId]` ⭐ 핵심
**목적** — KJOT 논문 열람·검색·PDF + **검색엔진/Scholar 색인**.

**요구사항**
- **최신 호 뷰**: 최신 issue + 논문 목록(카테고리 뱃지·저자·페이지·DOI)
- **아카이브**: 권·호 셀렉트 → 해당 호 목록
- **검색** (현실화된 스펙):
  - 기본: `ilike '%검색어%'` 부분일치 (제목·저자) — 한국어는 형태소 분석이 없어 FTS 신뢰 불가
  - 보조: `to_tsvector('simple')` GIN — 공백 구분 토큰 매칭용
  - (확장) `keywords[]` 필터
- **논문 상세 `/journal/[articleId]`** (SSR):
  - 초록·키워드·DOI·인용 정보
  - **Google Scholar 메타태그 필수**: `citation_title`, `citation_author`, `citation_publication_date`, `citation_journal_title`, `citation_volume`, `citation_issue`, `citation_firstpage/lastpage`, `citation_pdf_url`, `citation_doi`
- **PDF**: Storage Public URL 새 탭
- **외부 저널 링크**: ksotjournal.kr 노출 (현 누락 보강)
- **운영(v1)**: 신규 호 = seed/Table Editor + `npm run upload:journal` — **개발자 운영으로 명시**. 사무국용 CMS는 Phase 4(§4.5)

**완료 기준**
- [ ] "감각통합" 등 부분일치 검색이 제목·저자에서 동작
- [ ] 논문 상세가 SSR + citation 메타태그 출력 (curl로 HTML 소스 검증)
- [ ] PDF 3클릭 이내 열람
- [ ] `pages/journal.html` → `/journal` 리다이렉트

### 4.3 게시판 `/board/[slug]` · 상세 `/board/[slug]/[id]`
**요구사항**
- 목록: 고정글 상단 → 최신순, 제목·작성일·조회수, 제목 검색, 20건 페이지네이션
- `resources`: 첨부 다운로드 노출 / `education`: **일정 카드**(교육일·장소·학점·상태)
- 상세: 마크다운 렌더(sanitize), 첨부, 조회수(`increment_view_count` RPC 호출), 목록 복귀
- 관리자 세션이면 수정/삭제 버튼 + 비발행 글 미리보기 가능(§3.3 정책)

**완료 기준**
- [ ] 4개 슬러그 공용 컴포넌트 + board별 분기
- [ ] 비발행 글: 일반 비노출 / 관리자 미리보기 가능
- [ ] XSS 방지, 없는 id → 404

### 4.4 관리자 CMS `/admin` ⭐ 핵심
**요구사항**
- **로그인** `/admin/login`: Supabase Auth(이메일+비번), `admins` 미등록 거부
- **대시보드**: 게시판별 글 수·최근 글·빠른 작성
- **글 작성/수정**: board 선택, 제목, **마크다운 에디터 + 미리보기**, `is_pinned`/`is_published` 토글, education 전용 필드, 첨부 업로드
- **글 관리**: 필터·검색·삭제(첨부 Storage 동시 정리)
- **세션 가드**: 레이아웃/미들웨어 검증 + RLS 이중 방어
- **P3 UX 원칙**: 비개발자 기준 — 필수 필드 최소화, 발행 전 미리보기, 삭제 확인 다이얼로그, 성공/실패 토스트

**완료 기준**
- [ ] 비관리자 차단 / 로그아웃 동작
- [ ] 글 작성 → 게시판·홈 즉시 반영
- [ ] 첨부 업로드·삭제 시 Storage-DB 동기화
- [ ] 사무국 시나리오 테스트: 공지 등록 5분 이내

### 4.5 학회지 관리 CMS (Phase 4)
**목적** — 사무국이 개발자 없이 신규 호 발행.
- 호 생성 폼(권·호·연·월·라벨)
- 논문 등록 폼(카테고리·제목·저자·페이지·DOI·키워드·초록) + **PDF 업로드**(Storage `journal`)
- 논문 순서 관리, 기존 호 수정
- `journal_issues`/`journal_articles`에 admin write RLS 정책 추가 필요

**완료 기준**
- [ ] 신규 호 발행 전 과정을 CMS만으로 완료(코드·SQL 개입 0)

### 4.6 학술대회 `/conference`
- 모든 진입점 → `https://ksot0919.vercel.app/index.html` 새 탭(`rel="noopener"`)
- URL은 `constants.ts` 단일 관리(예: `EXTERNAL.conferenceSite`)
- **연도별 아카이브 전략**: 대회 사이트는 연 단위 교체 — 지난 대회 링크는 `/board/conference` 게시글로 보존(예: "2026 학술대회 사이트" 게시글)
- 학술대회 공지·자료는 `/board/conference`에서 관리

### 4.7 유지(정적) 페이지
| 페이지 | 조치 |
|--------|------|
| `/pages/about.html` | **연간계획 섹션 추가** + 헤더/푸터 톤 통일 |
| `/pages/submission.html` | 편집위원회·심사기준 실 콘텐츠 보강 |
| `/pages/member.html` | 유지 (온라인 회비·ID/PW찾기는 Phase 5) |
| `/pages/guide.html`, `terms.html` | 유지 |

---

## 5. 디자인 · UX/UI 가이드라인 (2026 트렌드 반영)

### 5.1 디자인 원칙 — "Calm Academic"
2026 트렌드 핵심(시각적 연출 자제·기능적 미니멀리즘·접근성 인프라화)을 학술 플랫폼 성격에 맞게 적용:

| 원칙 | 적용 |
|------|------|
| **연출은 홈에만, 콘텐츠는 기능에** | 3D 글래스 히어로는 홈 브랜드 아이덴티티로 유지. **학회지·게시판·CMS는 기능적 미니멀리즘** — 카드·표·타이포 중심, glassmorphism·blur 최소화 |
| **모션 = 구조, 장식 아님** | 애니메이션은 상태 변화 피드백(로딩·전환·성공)에만. 장식성 shine/파티클은 홈 히어로 한정 |
| **접근성 = 인프라** | WCAG 2.2 AA를 기본값으로 (아래 5.3) |
| **저비용 렌더** | 콘텐츠 페이지에서 `backdrop-blur` 다층 사용 금지(모바일 프레임 드랍), 이미지 최적화(`next/image`) |

### 5.2 디자인 토큰 정비 (현행 부채 해소)
- **문제**: `#1A2B4C` 등 hex가 컴포넌트에 수십 곳 하드코딩 — `globals.css` `@theme` 토큰 미사용
- **조치**: 시맨틱 토큰 체계로 통일하고 컴포넌트는 토큰 클래스만 사용
```css
@theme inline {
  --color-brand: #1a2b4c;        /* navy */
  --color-brand-light: #243b66;
  --color-accent: #2dd4bf;       /* teal */
  --color-accent-dark: #14b8a6;
  --color-surface: #f8fafc;
  --color-text: #1a2b4c;
  --color-text-muted: #4a5875;   /* 대비 검증된 muted (opacity 대신) */
  --color-border: #e2e8f0;
}
```
- 규칙: **텍스트 색에 opacity 변형(`/45`, `/50`) 금지** — 대비 검증된 solid 토큰 사용

### 5.3 접근성 (WCAG 2.2 AA)
- [ ] **대비**: 본문 4.5:1, 대형 텍스트 3:1 — 현행 `text-[#1A2B4C]/45~60` 전수 교체
- [ ] **`prefers-reduced-motion`**: framer-motion 전역 대응 (`useReducedMotion` 또는 `MotionConfig reducedMotion="user"`)
- [ ] **키보드**: 모든 인터랙티브 요소 focus-visible 링(현 GlassCard 패턴 전역화), CMS 폼 Tab 순서
- [ ] **시맨틱**: 게시판 목록 `<table>`/`<ul>` 적절 사용, 랜드마크(`nav`/`main`/`aside`), 페이지별 `h1` 1개
- [ ] **터치 타깃**: 최소 44×44px 유지
- [ ] **폼 접근성**(CMS): label 연결, 에러 메시지 `aria-describedby`

### 5.4 타이포그래피
- **Pretendard Variable 공식 로드** (`next/font/local` 또는 CDN) — 현재 폴백 선언만 있고 미로드
- 본문 최소 16px, 논문 제목·초록은 가독 우선 줄간(1.7)
- 국·영문 혼용(논문 제목) 최적화: `word-break: keep-all`

### 5.5 페이지 유형별 UI 스펙
| 유형 | 레이아웃 | 참고 |
|------|---------|------|
| 학회지 목록 | 검색바 상단 고정 + 논문 카드 리스트(카테고리 뱃지·저자·DOI) | P2: 스캔 속도 우선 |
| 논문 상세 | 단일 컬럼 아티클 뷰, 초록 → 키워드 → 인용정보 → PDF 버튼(주 CTA) | 인쇄 스타일 고려 |
| 게시판 목록 | 모바일: 카드 리스트 / 데스크톱: 테이블. 고정글 시각 구분(핀 아이콘) | |
| 보수교육 | 일정 카드(D-day·장소·학점·상태 뱃지) — 현 `latestEducation` 카드 계승 | P1 모바일 |
| 관리자 CMS | 좌측 네비 + 넓은 폼, 위험 액션(삭제) 색 구분·확인 단계 | P3 비개발자 |

### 5.6 레거시 페이지 톤 통일
- 정적 페이지(`pages/*.html`)의 헤더·푸터·브랜드 컬러를 Next 디자인과 일치(sync 스크립트 유지 범위 내 CSS 패치)
- 신규-레거시 이동 시 이질감 최소화가 목표 (완전 리디자인은 범위 밖)

### 5.7 다크모드
- **범위 밖(차기)** — 토큰 체계(5.2)를 시맨틱으로 정비해 두면 추후 `prefers-color-scheme` 대응 비용 최소화

---

## 6. 콘텐츠 마이그레이션 계획

| 대상 | 범위 | 방법 | 담당 |
|------|------|------|------|
| 공지사항 | **최근 1년치** (ksot.kr 공지) | 관리자 CMS 수동 등록 (Phase 3 완료 후) | 사무국/개발자 |
| 자료실 | 유효 자료 선별 | CMS 수동 등록 + 첨부 재업로드 | 사무국 |
| 학회지 | 34-1은 seed 완료, **과월호는 점진 소급**(최신 → 과거 순) | seed + 업로드 스크립트 | 개발자 |
| 학술대회 과거 갤러리 | 이관하지 않음 — 필요 시 `/board/conference` 게시글 링크 | — | — |

> 과거 공지 전체 이관은 하지 않는다(수년치 수동 이관 비용 대비 가치 낮음). 구 사이트 병행 운영 기간 동안 원본 참조 가능.

---

## 7. 로드맵 · 일정 추정 (1인 개발 기준)

| Phase | 내용 | 추정 | 목표 시점 |
|-------|------|------|----------|
| **P1** 기반 | `@supabase/ssr`, 신규 스키마+RLS+RPC 마이그레이션, `board` 버킷, 관리자 계정, **디자인 토큰 정비(§5.2)** | ~0.5주 | 7월 2주 |
| **P2** 학회지 | `/journal` + `/journal/[id]` SSR, 검색, Scholar 메타, 외부저널 링크, journal.html 리다이렉트 | ~1주 | 7월 3주 |
| **P3** 게시판+CMS ⭐ | `/board/*` 목록·상세, `/admin` 로그인·CRUD·첨부, 홈 연동, 접근성 체크(§5.3) | ~2주 | **8월 초 (사전등록 전 필수)** |
| **P4** 보강 | 학회지 관리 CMS(§4.5), 학술대회 외부링크, 정적 페이지 보강·톤 통일, 콘텐츠 마이그레이션 | ~1.5주 | 9월 학술대회 전 |
| **P5** 차기 | 회원 가입·로그인·마이페이지, 온라인 회비 결제, ID/PW 찾기, 다크모드 | 범위 밖 | — |

---

## 8. 리스크 · 비고
- **Next 16**: `web/AGENTS.md` — 코드 작성 전 `node_modules/next/dist/docs/` 확인 (관례 변경 가능)
- **RLS 우선**: 클라이언트 가드만으로 쓰기 보호 금지, DB 정책 이중 방어
- **한국어 검색 한계**: Postgres 기본 FTS는 한국어 형태소 미지원 — ilike가 주력. 검색 품질 요구 상승 시 pg_bigm/외부 검색(차기) 검토
- **본문 sanitize**: 마크다운 → HTML 렌더 시 XSS 방지 라이브러리 필수
- **ksot0919 의존성**: 외부 사이트 URL 변경/만료 시 `constants.ts` 1곳 수정, 지난 대회는 게시글로 보존
- **성능**: blur·모션 과다 사용 금지(§5.1), 콘텐츠 페이지 Lighthouse 모바일 85+ 유지
