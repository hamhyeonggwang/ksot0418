import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /** monorepo: 루트의 pages/css 등을 서버 번들 추적에 포함 */
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  images: {
    remotePatterns: [],
  },
  /** Legacy HTML pages: copy repo `pages/`, `css/`, `js/` into `web/public/` for same-origin links */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
    ];
  },
  /** 학회지: 정적 페이지에서 Next.js 학회지 라우트로 이관 (PRD Phase 2) */
  /** 학술대회: 별도 사이트에서 운영 — /conference 직접 접근 시 외부로 이동 (PRD Phase 4 §4.6, EXTERNAL.conferenceSite와 동일 URL) */
  async redirects() {
    return [
      {
        source: "/pages/journal.html",
        destination: "/journal",
        permanent: true,
      },
      {
        source: "/pages/conference.html",
        destination: "https://ksot0919.vercel.app/index.html",
        permanent: false,
      },
      {
        source: "/conference",
        destination: "https://ksot0919.vercel.app/index.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
