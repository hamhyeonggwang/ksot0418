/** KSOT design system & route map (legacy static pages coexist at repo root) */
export const COLORS = {
  navy: "#1A2B4C",
  navyLight: "#243B66",
  teal: "#2DD4BF",
  tealDark: "#14B8A6",
  bg: "#F8FAFC",
  white: "#FFFFFF",
} as const;

/** Deploy: set NEXT_PUBLIC_LEGACY_BASE="" when static pages are served from same origin */
export const LEGACY = {
  base: process.env.NEXT_PUBLIC_LEGACY_BASE ?? "",
  about: "/about",
  journal: "/journal",
  journalSearch: "/journal#archive",
  submission: "/submission",
  education: "/education",
  /** 학회 갤러리(사진 게시판) — 2026 학술대회 종료 후 외부 행사 사이트 대신 연결 */
  gallery: "/board/gallery",
  community: "/community",
  notice: "/board/notice",
  member: "/member",
  login: "/member#login",
  join: "/member#join",
  guide: "/guide",
  youtube: "https://www.youtube.com/channel/UCx3zw743-w7mZ2jvCjzgrfQ",
} as const;

export function legacyHref(path: string) {
  const base = LEGACY.base.replace(/\/$/, "");
  return base ? `${base}${path}` : path;
}

/** 절대 URL(외부 사이트)인지 판별 — Link에 target="_blank" rel="noopener" 부여 여부 결정 */
export function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}
