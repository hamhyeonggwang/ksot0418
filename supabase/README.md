# 학회지 Supabase 연동

`files/journal/` 폴더의 PDF와 논문 메타데이터를 Supabase로 제공합니다.

## 1. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. **SQL Editor**에서 순서대로 실행:
   - `schema.sql`
   - `seed.sql`
3. **Storage** → New bucket
   - Name: `journal`
   - **Public bucket** 체크

## 2. PDF 업로드 (로컬 → Storage)

```bash
cp .env.example .env
# .env 에 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 입력

npm install
npm run upload:journal
```

`files/journal/34-1/01.pdf` → Storage 경로 `34-1/01.pdf`

## 3. 프론트엔드 설정

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

## 4. 테이블 구조

| 테이블 | 설명 |
|--------|------|
| `journal_issues` | 권·호 (제34권 제1호 등) |
| `journal_articles` | 논문 제목, 저자, DOI, `pdf_storage_path` |

PDF 공개 URL:

```
{SUPABASE_URL}/storage/v1/object/public/journal/34-1/01.pdf
```

## 5. 새 호 추가 방법

1. `files/journal/34-2/` 등에 PDF 배치
2. `seed.sql`에 issue·articles INSERT 추가 (또는 Dashboard Table Editor)
3. `npm run upload:journal` 재실행
