import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /** monorepo: 루트의 pages/css 등을 서버 번들 추적에 포함 */
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
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
  /** Legacy HTML → Next.js 라우트 이관 (Phase 3) */
  async redirects() {
    const legacyPages = [
      "about",
      "submission",
      "education",
      "community",
      "guide",
      "member",
    ] as const;
    const htmlRedirects = legacyPages.map((page) => ({
      source: `/pages/${page}.html`,
      destination: `/${page}`,
      permanent: true,
    }));

    return [
      ...htmlRedirects,
      {
        source: "/pages/journal.html",
        destination: "/journal",
        permanent: true,
      },
      {
        source: "/pages/notice.html",
        destination: "/board/notice",
        permanent: true,
      },
      {
        source: "/pages/terms.html",
        destination: "/guide",
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
