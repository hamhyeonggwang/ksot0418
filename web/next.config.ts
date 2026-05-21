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
};

export default nextConfig;
