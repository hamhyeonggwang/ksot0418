# 배포: Next.js 메인 (`web/`)

개발 화면(`npm run dev` → http://localhost:3000)이 **프로덕션 메인**이 되도록 설정합니다.

## Vercel (필수 1회)

1. [Vercel](https://vercel.com) → 프로젝트 **Settings** → **General**
2. **Root Directory** → `web` 입력 후 **Save**
3. **Deployments** → 최신 배포 **Redeploy**

이렇게 하면 루트의 예전 `index.html`(저널 캐러셀)이 아니라 Next 홈이 `/` 에서 열립니다.

## 로컬

```bash
cd web
npm install
npm run dev
```

`predev` / `prebuild` 가 자동으로 `pages`, `css`, `js`, `images`, `files` 를 `web/public/` 으로 복사합니다.  
헤더 로고 링크는 `../index.html` → `/` 로 패치되어 Next 홈으로 돌아갑니다.

## 링크 구조

| 경로 | 설명 |
|------|------|
| `/` | Next.js 새 홈 (Hero, QuickPath 등) |
| `/pages/journal.html` | 기존 학술지 페이지 (Supabase 연동) |
| `/pages/conference.html` | 학술대회 |
| 기타 `/pages/*.html` | 기존 정적 페이지 |

`web/src/lib/constants.ts` 의 `LEGACY` 경로는 위와 동일합니다.
