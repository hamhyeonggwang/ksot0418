/** KSOT design system & route map (legacy static pages coexist at repo root) */
export const COLORS = {
  navy: "#1A2B4C",
  navyLight: "#243B66",
  teal: "#2DD4BF",
  tealDark: "#14B8A6",
  bg: "#F8FAFC",
  white: "#FFFFFF",
} as const;

/** 학회지·홈과 분리 운영되는 외부 사이트 (PRD §4.6) */
export const EXTERNAL = {
  conferenceSite: "https://ksot0919.vercel.app/index.html",
} as const;

/** Deploy: set NEXT_PUBLIC_LEGACY_BASE="" when static pages are served from same origin /pages */
export const LEGACY = {
  base: process.env.NEXT_PUBLIC_LEGACY_BASE ?? "",
  about: "/pages/about.html",
  journal: "/journal",
  journalSearch: "/journal#archive",
  submission: "/pages/submission.html",
  education: "/pages/education.html",
  /** 학술대회는 별도 사이트에서 운영 — 새 탭으로 이동 (isExternalHref로 판별) */
  conference: EXTERNAL.conferenceSite,
  conferenceRegister: `${EXTERNAL.conferenceSite}#register`,
  community: "/pages/community.html",
  notice: "/pages/community.html#notice",
  member: "/pages/member.html",
  login: "/pages/member.html#login",
  join: "/pages/member.html#join",
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
