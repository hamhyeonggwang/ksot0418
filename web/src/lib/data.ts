import {
  GraduationCap,
  Brain,
  Heart,
  Users,
  Sparkles,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { LEGACY } from "./constants";

export const heroCTAs = [
  {
    label: "학회지 검색",
    sub: "KCI 등재 논문",
    href: LEGACY.journalSearch,
    icon: "search" as const,
    primary: true,
  },
  {
    label: "학술대회",
    sub: "2026.9.19 대전",
    href: LEGACY.conferenceRegister,
    icon: "calendar" as const,
  },
  {
    label: "보수교육",
    sub: "연수 일정·신청",
    href: LEGACY.education,
    icon: "education" as const,
  },
];

export const latestPapers = [
  {
    tag: "원저",
    title:
      "척수장애인의 여가활동 만족도가 삶의 만족도에 미치는 영향: 자립과 정서적 도움의 다중매개효과",
    authors: "유승모 외",
    vol: "34(1)",
    href: LEGACY.journal,
  },
  {
    tag: "원저",
    title:
      "Sensory Profile-2 SPSI ChatBot 프로토타입 개발 및 활용 전망",
    authors: "박다솔",
    vol: "34(1)",
    href: LEGACY.journal,
  },
  {
    tag: "체계적 고찰",
    title:
      "감각통합기반 중재가 발달지연 아동 운동기능에 미치는 효과: 메타분석",
    authors: "임대웅 외",
    vol: "34(1)",
    href: LEGACY.journal,
  },
];

export const latestEducation = [
  {
    date: "2026.09.19",
    title: "2026 학술대회 본행사 보수교육",
    place: "대전",
    credits: "4학점",
    href: LEGACY.conference,
    status: "open" as const,
  },
  {
    date: "2026.09.12",
    title: "발달장애인 지원사업 이해와 실천 (온라인)",
    place: "Zoom",
    credits: "4학점",
    href: LEGACY.conference,
    status: "open" as const,
  },
  {
    date: "2026.06",
    title: "발달평가를 통한 양육환경 조성",
    place: "대전",
    credits: "4학점",
    href: LEGACY.education,
    status: "soon" as const,
  },
];

export const announcements = [
  {
    type: "학술대회",
    title: "2026 대한작업치료학회 학술대회 안내",
    date: "2026.05.01",
    href: LEGACY.conference,
  },
  {
    type: "학회지",
    title: "제34권 제1호 발행 완료",
    date: "2026.03.30",
    href: LEGACY.journal,
  },
  {
    type: "보수교육",
    title: "2026년 상반기 보수교육 일정 공지",
    date: "2026.04.15",
    href: LEGACY.education,
  },
];

export type ResearchArea = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  href: string;
};

export const researchAreas: ResearchArea[] = [
  {
    id: "pediatrics",
    title: "아동·소아",
    titleEn: "Pediatrics",
    description: "발달, 감각통합, 가족 중심 중재",
    icon: Users,
    gradient: "from-sky-500/20 to-blue-600/10",
    href: LEGACY.journalSearch,
  },
  {
    id: "mental",
    title: "정신건강",
    titleEn: "Mental Health",
    description: "정신의료·회복·참여 중심 실천",
    icon: Heart,
    gradient: "from-violet-500/20 to-purple-600/10",
    href: LEGACY.journalSearch,
  },
  {
    id: "community",
    title: "지역사회 OT",
    titleEn: "Community OT",
    description: "통합돌봄·지역 기반 서비스",
    icon: Activity,
    gradient: "from-emerald-500/20 to-teal-600/10",
    href: LEGACY.journalSearch,
  },
  {
    id: "ai",
    title: "AI in OT",
    titleEn: "AI & Digital",
    description: "AI 워크플로·디지털 헬스",
    icon: Sparkles,
    gradient: "from-cyan-500/20 to-[#2DD4BF]/20",
    href: LEGACY.conference,
  },
  {
    id: "participation",
    title: "참여 중심 OT",
    titleEn: "Participation",
    description: "Occupation·활동분석·실천",
    icon: GraduationCap,
    gradient: "from-amber-500/15 to-orange-500/10",
    href: LEGACY.journalSearch,
  },
  {
    id: "cognitive",
    title: "인지재활",
    titleEn: "Cognitive Rehab",
    description: "뇌손상·인지·신경계",
    icon: Brain,
    gradient: "from-indigo-500/20 to-[#1A2B4C]/15",
    href: LEGACY.journalSearch,
  },
];

export const conferenceHighlights = {
  title: "2026 대한작업치료학회 학술대회",
  theme: "OT Beyond Borders",
  themeKo: "AI와 함께 여는 작업치료의 미래",
  date: "2026.9.19 (토)",
  place: "대전보건대학교 대강당",
  countdown: "2026-09-19T08:00:00",
  href: LEGACY.conference,
  registerHref: LEGACY.conferenceRegister,
  speakers: [
    { name: "홍영일 박사", role: "특별초청강연 · AI와 돌봄" },
    { name: "이혜진 교수", role: "보수교육 · AI 시대 OT 역량" },
    { name: "함형광", role: "Occupation Flow · AI 워크플로" },
  ],
  timeline: [
    { time: "09:00", label: "포스터 전시" },
    { time: "10:00", label: "병행세션·보수교육" },
    { time: "14:00", label: "개회식" },
    { time: "14:20", label: "특별초청강연" },
    { time: "15:40", label: "시상식" },
  ],
};

export const mediaItems = [
  {
    type: "youtube" as const,
    title: "KSOT 공식 유튜브",
    description: "학술대회·보수교육·학회 행사 영상",
    href: LEGACY.youtube,
    thumb: "OT Media",
  },
  {
    type: "story" as const,
    title: "현장 인터뷰",
    description: "치료사·연구자 이야기",
    href: LEGACY.community,
    thumb: "Interview",
  },
  {
    type: "gallery" as const,
    title: "학회 갤러리",
    description: "학술대회·세미나 현장",
    href: `${LEGACY.community}#gallery`,
    thumb: "Gallery",
  },
  {
    type: "newsletter" as const,
    title: "학회 소식",
    description: "공지·자료실·커뮤니티",
    href: LEGACY.notice,
    thumb: "News",
  },
];

export const navLinks = [
  {
    label: "학회소개",
    href: LEGACY.about,
    children: [
      { label: "인사말", href: `${LEGACY.about}#intro` },
      { label: "연혁", href: `${LEGACY.about}#history` },
      { label: "임원진", href: `${LEGACY.about}#executives-org` },
    ],
  },
  {
    label: "학회지",
    href: LEGACY.journal,
    children: [
      { label: "학회지 안내", href: `${LEGACY.journal}` },
      { label: "논문 검색", href: LEGACY.journalSearch },
    ],
  },
  { label: "논문투고", href: LEGACY.submission },
  { label: "교육·연수", href: LEGACY.education },
  { label: "커뮤니티", href: LEGACY.community },
  { label: "학술대회", href: LEGACY.conference, highlight: true },
];

export const platformStats = [
  { value: "1993", label: "창립" },
  { value: "KCI", label: "등재 학회지" },
  { value: "34", label: "발행 권수" },
  { value: "4회/년", label: "학술대회·교육" },
];
