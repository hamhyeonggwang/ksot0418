import type { Metadata } from "next";
import {
  Building2,
  Calendar,
  CalendarDays,
  Clock,
  FileUp,
  FileText,
  Flag,
  Globe,
  GraduationCap,
  Handshake,
  History,
  Image,
  ListChecks,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Network,
  ScrollText,
  Send,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import type { StaticPageConfig } from "@/components/pages/StaticSitePage";
import * as aboutContent from "@/content/static-pages/about";
import * as submissionContent from "@/content/static-pages/submission";
import * as educationContent from "@/content/static-pages/education";
import * as communityContent from "@/content/static-pages/community";
import * as guideContent from "@/content/static-pages/guide";
import * as memberContent from "@/content/static-pages/member";

export const staticPageSlugs = [
  "about",
  "submission",
  "education",
  "community",
  "guide",
  "member",
] as const;

export type StaticPageSlug = (typeof staticPageSlugs)[number];

export const staticPages: Record<StaticPageSlug, StaticPageConfig> = {
  about: {
    slug: "about",
    metadata: {
      title: "학회소개 | KSOT",
      description: "대한작업치료학회 인사말, 연혁, 임원진, 정관 및 연락처",
    },
    hero: {
      label: "About KSOT",
      labelIcon: Building2,
      title: "인사",
      titleAccent: "말",
      description: "대한작업치료학회를 소개합니다",
      breadcrumb: "학회소개",
      meta: [
        { icon: Calendar, text: "창립: 1993년" },
        { icon: Flag, text: "창립 34주년" },
        { icon: Globe, text: "WFOT 정회원" },
      ],
    },
    sidebar: {
      title: "학회소개",
      icon: Building2,
      items: [
        { label: "인사말", href: "/about#intro", icon: Handshake },
        { label: "연혁", href: "/about#history", icon: History },
        { label: "역대회장단", href: "/about#past-presidents", icon: Users },
        { label: "연간계획", href: "/about#annual-plan", icon: CalendarDays },
        { label: "임원진/조직도", href: "/about#executives-org", icon: Network },
        { label: "학회 정관", href: "/about#bylaws", icon: ScrollText },
        { label: "학회연락처", href: "/about#contact", icon: MapPin },
        { label: "이용안내", href: "/guide", icon: FileText },
      ],
    },
    content: aboutContent,
  },

  submission: {
    slug: "submission",
    metadata: {
      title: "논문투고 | KSOT",
      description: "대한작업치료학회지 논문투고 안내, 편집규정, 심사기준",
    },
    hero: {
      label: "Submission",
      labelIcon: FileUp,
      title: "논문",
      titleAccent: "투고",
      description: "대한작업치료학회지에 논문을 투고하는 방법을 안내드립니다",
      breadcrumb: "논문투고",
      meta: [
        { icon: Mail, text: "ksotoffice@naver.com" },
        { icon: Mail, text: "ksot.editor@gmail.com" },
        { icon: Clock, text: "연중 수시 접수" },
      ],
    },
    sidebar: {
      title: "논문투고",
      icon: FileUp,
      items: [
        {
          label: "논문투고 안내",
          href: "/submission#guide",
          icon: ListChecks,
          children: [
            { label: "논문투고방법", href: "/submission#guide-method" },
            { label: "투고료/게재료", href: "/submission#guide-fees" },
          ],
        },
        {
          label: "편집방침과 투고규정",
          href: "/submission#policy",
          icon: ScrollText,
          children: [
            { label: "일반규정", href: "/submission#policy-general" },
            { label: "투고규정", href: "/submission#policy-submission" },
            { label: "윤리규정", href: "/submission#policy-ethics" },
          ],
        },
        { label: "편집위원회", href: "/submission#editorial-board", icon: Users },
        { label: "논문 심사기준", href: "/submission#review", icon: ListChecks },
        { label: "온라인논문투고", href: "/submission#submit", icon: Send },
      ],
    },
    content: submissionContent,
  },

  education: {
    slug: "education",
    metadata: {
      title: "보수교육 | KSOT",
      description: "2026년 대한작업치료학회 보수교육 일정 안내",
    },
    hero: {
      label: "Education",
      labelIcon: GraduationCap,
      title: "보수교육",
      titleAccent: "일정",
      description: "2026년 대한작업치료학회 보수교육 일정을 안내합니다",
      breadcrumb: "교육·연수",
      meta: [
        { icon: CalendarDays, text: "2026 일정" },
        { icon: MapPin, text: "서울·대전·익산 등" },
        { icon: GraduationCap, text: "학점 안내" },
      ],
    },
    sidebar: {
      title: "교육·연수",
      icon: GraduationCap,
      items: [
        { label: "보수교육", href: "/education#ce-schedule", icon: CalendarDays },
        { label: "관련 공지", href: "/education#board-education", icon: Megaphone },
      ],
    },
    showContactCard: true,
    content: educationContent,
  },

  community: {
    slug: "community",
    metadata: {
      title: "커뮤니티 | KSOT",
      description: "대한작업치료학회 공지, 갤러리, 커뮤니티",
    },
    hero: {
      label: "Community",
      labelIcon: MessageSquare,
      title: "학회",
      titleAccent: "커뮤니티",
      description: "대한작업치료학회의 소식과 현장의 순간을 만나보세요",
      breadcrumb: "커뮤니티",
      meta: [
        { icon: Megaphone, text: "공지사항" },
        { icon: Image, text: "학회 갤러리" },
      ],
    },
    sidebar: {
      title: "커뮤니티",
      icon: MessageSquare,
      items: [
        { label: "공지사항", href: "/board/notice", icon: Megaphone },
        { label: "학회 갤러리", href: "/community#gallery", icon: Image },
        { label: "학술대회 공지", href: "/community#board-conference", icon: CalendarDays },
      ],
    },
    showContactCard: false,
    content: communityContent,
  },

  guide: {
    slug: "guide",
    metadata: {
      title: "이용안내 | KSOT",
      description: "이용약관, 개인정보처리방침, 이메일 무단 수집 거부",
    },
    hero: {
      label: "Legal",
      labelIcon: FileText,
      title: "이용",
      titleAccent: "안내",
      description: "이용약관, 개인정보처리방침, 이메일 무단 수집 거부",
      breadcrumb: "이용안내",
    },
    sidebar: {
      title: "이용안내",
      icon: FileText,
      items: [
        { label: "이용약관", href: "/guide#terms", icon: ScrollText },
        { label: "개인정보처리방침", href: "/guide#privacy", icon: Shield },
        { label: "이메일무단수집거부", href: "/guide#email-refusal", icon: Mail },
      ],
    },
    showContactCard: false,
    content: guideContent,
  },

  member: {
    slug: "member",
    metadata: {
      title: "회원 | KSOT",
      description: "대한작업치료학회 회원 가입, 로그인, 마이페이지",
    },
    hero: {
      label: "Member",
      labelIcon: Users,
      title: "회원",
      description: "작업치료사라면 누구나 무료로 가입하고 커뮤니티를 이용할 수 있습니다",
      breadcrumb: "회원",
    },
    sidebar: {
      title: "회원",
      icon: Users,
      items: [
        { label: "로그인", href: "/member#login", icon: Users },
        { label: "회원가입", href: "/member#join", icon: UserPlus },
        { label: "마이페이지", href: "/member#mypage", icon: Users },
      ],
    },
    content: memberContent,
  },
};

export function isStaticPageSlug(slug: string): slug is StaticPageSlug {
  return staticPageSlugs.includes(slug as StaticPageSlug);
}

export function staticPageMetadata(slug: StaticPageSlug): Metadata {
  const page = staticPages[slug];
  return {
    title: page.metadata.title,
    description: page.metadata.description,
  };
}
