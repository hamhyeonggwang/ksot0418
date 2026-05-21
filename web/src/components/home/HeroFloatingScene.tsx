"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  BookOpen,
  FlaskConical,
  Calendar,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { LEGACY, legacyHref } from "@/lib/constants";

type FloatCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href: string;
  /** % position in scene */
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  floatDuration: number;
  floatDelay: number;
  accent?: boolean;
};

const CARDS: FloatCard[] = [
  {
    id: "journal",
    title: "Journal",
    subtitle: "KCI · KJOT",
    icon: BookOpen,
    href: LEGACY.journalSearch,
    x: 42,
    y: 38,
    z: 120,
    rotateX: 6,
    rotateY: -8,
    rotateZ: -2,
    scale: 1.08,
    floatDuration: 5.5,
    floatDelay: 0,
    accent: true,
  },
  {
    id: "ai",
    title: "AI in OT",
    subtitle: "Digital practice",
    icon: Sparkles,
    href: LEGACY.conference,
    x: 68,
    y: 12,
    z: 90,
    rotateX: 10,
    rotateY: -22,
    rotateZ: 3,
    scale: 1,
    floatDuration: 6.2,
    floatDelay: 0.4,
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    subtitle: "Child & family",
    icon: Users,
    href: LEGACY.journalSearch,
    x: 12,
    y: 28,
    z: 70,
    rotateX: 4,
    rotateY: 18,
    rotateZ: -4,
    scale: 0.95,
    floatDuration: 5.8,
    floatDelay: 0.8,
  },
  {
    id: "research",
    title: "Research",
    subtitle: "Evidence hub",
    icon: FlaskConical,
    href: LEGACY.journalSearch,
    x: 22,
    y: 58,
    z: 40,
    rotateX: 12,
    rotateY: 12,
    rotateZ: 2,
    scale: 0.88,
    floatDuration: 7,
    floatDelay: 1.2,
  },
  {
    id: "conference",
    title: "Conference",
    subtitle: "2026 · 9.19",
    icon: Calendar,
    href: LEGACY.conferenceRegister,
    x: 72,
    y: 52,
    z: 85,
    rotateX: 8,
    rotateY: -14,
    rotateZ: -1,
    scale: 0.92,
    floatDuration: 6.5,
    floatDelay: 0.6,
  },
  {
    id: "community",
    title: "Community OT",
    subtitle: "Integrated care",
    icon: Activity,
    href: LEGACY.journalSearch,
    x: 48,
    y: 72,
    z: 55,
    rotateX: 14,
    rotateY: 6,
    rotateZ: 4,
    scale: 0.9,
    floatDuration: 5.2,
    floatDelay: 1,
  },
];

function FloatingCard({ card }: { card: FloatCard }) {
  const Icon = card.icon;

  return (
    <motion.div
      className="absolute left-0 top-0 w-[min(100%,200px)] sm:w-[200px]"
      style={{
        left: `${card.x}%`,
        top: `${card.y}%`,
        zIndex: Math.round(card.z),
        transform: `translate(-50%, -50%)`,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: card.floatDelay }}
    >
      <motion.div
        animate={{
          y: [0, -16, 0],
          rotateZ: [card.rotateZ, card.rotateZ + 1.5, card.rotateZ],
        }}
        transition={{
          duration: card.floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: card.floatDelay,
        }}
      >
        <Link href={legacyHref(card.href)} className="block">
          <motion.div
            whileHover={{
              scale: 1.06,
              rotateX: card.rotateX - 4,
              rotateY: card.rotateY + 4,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={`hero-float-card group ${card.accent ? "hero-float-card--accent" : ""}`}
            style={{
              transform: `
                perspective(900px)
                rotateX(${card.rotateX}deg)
                rotateY(${card.rotateY}deg)
                rotateZ(${card.rotateZ}deg)
                scale(${card.scale})
              `,
            }}
          >
            <div className="hero-float-card-inner">
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
              <p className="mt-0.5 text-xs text-[#1A2B4C]/50">{card.subtitle}</p>
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
    <div className="hero-scene relative mx-auto w-full max-w-[520px] lg:max-w-none">
      {/* Depth layers — atmosphere only, no imagery */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="hero-scene-orb hero-scene-orb--teal" />
        <div className="hero-scene-orb hero-scene-orb--navy" />
        <div className="hero-scene-grid" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2DD4BF]/15"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.25, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1A2B4C]/8"
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="hero-scene-stage relative aspect-[4/5] min-h-[380px] sm:min-h-[440px] lg:aspect-square lg:min-h-[520px]">
        {CARDS.map((card) => (
          <FloatingCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
