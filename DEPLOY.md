# 배포: Next.js 메인 (`web/`)

개발 화면(`npm run dev` → http://localhost:3000)이 **프로덕션 메인**이 되도록 설정합니다.

## Vercel (필수 1회)

### A. Root Directory = `web` (권장)

1. **Settings** → **General** → **Root Directory** → `web` → **Save**
2. **Settings** → **Build and Deployment** → **Framework Preset** → **Next.js** (Other/Static 아님)
3. **Output Directory** → **비워 두기** (`public`, `out`, `.next` 입력 금지)
4. **Include source files outside of the Root Directory in the Build Step** → **ON** (sync가 `../pages` 등을 읽음)
5. **Deployments** → 최신 성공 배포 → **⋯** → **Promote to Production** (또는 **Redeploy**)

### B. Root Directory 비움 (대안)

대시보드 Root Directory를 **비운** 경우, 저장소 루트 `vercel.json` 이 `web/` 을 빌드합니다.

---

## 404: NOT_FOUND 가 나올 때

빌드 로그에 `Route (app) ○ /` 가 보이는데 사이트만 404면, **배포는 됐지만 Vercel이 Next 출력을 서빙하지 않는 설정**입니다.

| 확인 | 올바른 값 |
|------|-----------|
| Framework Preset | **Next.js** |
| Output Directory | **(비움)** |
| Root Directory | `web` (A안) 또는 비움 (B안) |
| Production | 최신 **Ready** 배포가 Production인지 |

`Output Directory` 가 `public` 이면 `index.html` 이 없어 **전체 404** 가 납니다. 반드시 비우세요.

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
