# KSOT Supabase 연동

`files/journal/` 폴더의 PDF·논문 메타데이터, 그리고 관리자 게시판(공지·자료실·보수교육·학술대회 공지)을 Supabase로 제공합니다.

## 1. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. **SQL Editor**에서 순서대로 실행:
   - `schema.sql` — 학회지(journal_issues, journal_articles)
   - `seed.sql` — 32권 1호~4호, 33권 1호~4호, 34권 1~2호 시드 데이터 (files/journal/KJOT-vXXnY-Z.pdf 원문에서 추출)
   - `board_schema.sql` — 게시판(posts, post_attachments, admins) + RLS + 조회수 RPC
3. **Storage** → New bucket
   - Name: `journal`
   - **Public bucket** 체크
   - Name: `board`
   - **Public bucket** 체크 (읽기 공개, 쓰기는 RLS로 관리자만 — 아래 4번 참고)
4. **관리자 계정 등록**
   - **Authentication** → Users → Add user (이메일+비밀번호)로 관리자 계정 생성
   - **SQL Editor**에서 등록:
     ```sql
     insert into public.admins (user_id, email)
     values ('<auth.users의 uuid>', '관리자이메일');
     ```
5. **Storage RLS** (board·journal 버킷 업로드를 관리자만 허용)
   - Dashboard → Storage → 각 버킷 → Policies에서 아래 정책 추가:
     ```sql
     create policy "board_public_read" on storage.objects
       for select to anon, authenticated using (bucket_id = 'board');
     create policy "board_admin_write" on storage.objects
       for all to authenticated
       using (bucket_id = 'board' and exists (select 1 from public.admins a where a.user_id = auth.uid()))
       with check (bucket_id = 'board' and exists (select 1 from public.admins a where a.user_id = auth.uid()));

     create policy "journal_public_read" on storage.objects
       for select to anon, authenticated using (bucket_id = 'journal');
     create policy "journal_admin_write" on storage.objects
       for all to authenticated
       using (bucket_id = 'journal' and exists (select 1 from public.admins a where a.user_id = auth.uid()))
       with check (bucket_id = 'journal' and exists (select 1 from public.admins a where a.user_id = auth.uid()));
     ```

## 2. PDF 업로드 (로컬 → Storage)

```bash
cp .env.example .env
# .env 에 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 입력

npm install
npm run upload:journal
```

`files/journal/KJOT-v34n1-1.pdf` (파일명의 `-1`은 시작 페이지) → 호 내 시작 페이지 순으로 정렬 후 Storage 경로 `34-1/01.pdf`로 업로드됩니다.

## 3. 프론트엔드 설정

### 레거시 정적 페이지 (`pages/*.html`)
```bash
cp js/supabase-config.example.js js/supabase-config.js
```

`js/supabase-config.js`에 **anon key**만 넣습니다 (service role은 넣지 마세요).

```javascript
window.KSOT_SUPABASE = {
  url: 'https://xxxx.supabase.co',
  anonKey: 'eyJhbG...',
  storageBucket: 'journal',
};
```

설정이 비어 있으면 사이트는 자동으로 `files/journal/` 로컬 PDF와 내장 시드 데이터를 사용합니다.

### Next.js 앱 (`web/`)
```bash
cp .env.example web/.env.local
```

`web/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=  # 서버 전용 스크립트에서만 사용, 절대 NEXT_PUBLIC_ 금지
```

## 4. 테이블 구조

| 테이블 | 설명 |
|--------|------|
| `journal_issues` | 권·호 (제34권 제1호 등) |
| `journal_articles` | 논문 제목, 저자, DOI, `pdf_storage_path` |
| `posts` | 게시판 글 (board: notice/resources/education/conference) |
| `post_attachments` | 게시글 첨부파일 (board 버킷) |
| `admins` | 관리자 허용 목록 (auth.users 참조) |

PDF 공개 URL:

```
{SUPABASE_URL}/storage/v1/object/public/journal/34-1/01.pdf
{SUPABASE_URL}/storage/v1/object/public/board/<path>
```

## 5. 새 호 추가 방법

**A. 관리자 CMS (권장, Phase 4)**
`/admin/journal` 에서 관리자 로그인 후 호 생성 → 논문 등록 + PDF 업로드까지 브라우저에서 처리합니다. 코드·SQL 개입이 필요 없습니다.

**B. 스크립트 (초기 시드용)**
1. `files/journal/34-2/` 등에 PDF 배치
2. `seed.sql`에 issue·articles INSERT 추가 (또는 Dashboard Table Editor)
3. `npm run upload:journal` 재실행
