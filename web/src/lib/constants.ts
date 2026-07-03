/** KSOT design system & route map (legacy static pages coexist at repo root) */
export const COLORS = {
  navy: "#1A2B4C",
  navyLight: "#243B66",
  teal: "#2DD4BF",
  tealDark: "#14B8A6",
  bg: "#F8FAFC",
  white: "#FFFFFF",
} as const;

/** Deploy: set NEXT_PUBLIC_LEGACY_BASE="" when static pages are served from same origin /pages */
export const LEGACY = {
  base: process.env.NEXT_PUBLIC_LEGACY_BASE ?? "",
  about: "/pages/about.html",
  journal: "/journal",
  journalSearch: "/journal#archive",
  submission: "/pages/submission.html",
  education: "/pages/education.html",
  conference: "/pages/conference.html",
  conferenceRegister: "/pages/conference.html#register",
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
