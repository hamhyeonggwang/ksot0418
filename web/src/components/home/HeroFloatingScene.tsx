"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Landmark,
  Send,
  BookOpen,
  Calendar,
  FolderOpen,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { LEGACY, legacyHref, isExternalHref } from "@/lib/constants";

type FloatCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href: string;
  floatDelay: number;
  accent?: boolean;
};

const CARDS: FloatCard[] = [
  {
    id: "about",
    title: "학회소개",
    subtitle: "연혁 · 정관 · 조직도",
    icon: Landmark,
    href: LEGACY.about,
    floatDelay: 0,
  },
  {
    id: "submission",
    title: "논문투고",
    subtitle: "투고규정 · 온라인투고",
    icon: Send,
    href: LEGACY.submission,
    floatDelay: 0.12,
  },
  {
    id: "journal",
    title: "학회지검색",
    subtitle: "KCI · KJOT",
    icon: BookOpen,
    href: LEGACY.journalSearch,
    floatDelay: 0.24,
    accent: true,
  },
  {
    id: "conference",
    title: "학술대회신청",
    subtitle: "2026.9.19 사전등록",
    icon: Calendar,
    href: LEGACY.conferenceRegister,
    floatDelay: 0.36,
  },
  {
    id: "resources",
    title: "자료실",
    subtitle: "서식 · 다운로드",
    icon: FolderOpen,
    href: "/board/resources",
    floatDelay: 0.48,
  },
  {
    id: "contact",
    title: "문의하기",
    subtitle: "이메일 · 연락처",
    icon: Mail,
    href: `${LEGACY.about}#contact`,
    floatDelay: 0.6,
  },
];

function FloatingCard({ card }: { card: FloatCard }) {
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: card.floatDelay }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: card.floatDelay,
        }}
      >
        <Link
          href={legacyHref(card.href)}
          {...(isExternalHref(card.href)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="block"
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={`hero-float-card group h-full ${card.accent ? "hero-float-card--accent" : ""}`}
          >
            <div className="hero-float-card-inner h-full">
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  card.accent
                    ? "bg-[#2DD4BF]/20 text-[#14B8A6] group-hover:bg-[#2DD4BF]/30"
                    : "bg-[#1A2B4C]/5 text-[#1A2B4C]/70 group-hover:bg-[#1A2B4C]/8"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-semibold tracking-tight text-[#1A2B4C]">
                {card.title}
              </p>
              <p className="mt-0.5 text-xs text-muted">{card.subtitle}</p>
              <div className="hero-float-card-shine" aria-hidden />
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function HeroFloatingScene() {
  return (
    <div className="hero-scene relative mx-auto w-full max-w-[440px] lg:max-w-none">
      {/* Depth layers — atmosphere only, no imagery */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="hero-scene-orb hero-scene-orb--teal" />
        <div className="hero-scene-orb hero-scene-orb--navy" />
        <div className="hero-scene-grid" />
      </div>

      <div className="relative grid grid-cols-2 gap-4 sm:gap-5">
        {CARDS.map((card) => (
          <FloatingCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
