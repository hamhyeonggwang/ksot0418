"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  GraduationCap,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { heroCTAs, platformStats } from "@/lib/data";
import { legacyHref } from "@/lib/constants";
import { HeroFloatingScene } from "./HeroFloatingScene";

const iconMap = {
  search: Search,
  calendar: Calendar,
  education: GraduationCap,
  user: UserPlus,
} as const;

export function HeroSection() {
  const primaryCta = heroCTAs[0];
  const secondaryCtas = heroCTAs.slice(1);
  const PrimaryIcon = iconMap[primaryCta.icon];

  return (
    <section className="hero-premium relative overflow-hidden bg-[#F8FAFC]">
      {/* Cinematic ambient — depth without images */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-[20%] top-[-30%] h-[70%] w-[70%] rounded-full bg-[#2DD4BF]/12 blur-[100px]" />
        <div className="absolute -right-[15%] bottom-[-20%] h-[60%] w-[55%] rounded-full bg-[#1A2B4C]/8 blur-[90px]" />
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#1A2B4C]/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-12">
          {/* LEFT — Brand, hierarchy, actions */}
          <div className="relative z-10 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="대한작업치료학회"
                  width={160}
                  height={48}
                  className="h-10 w-auto sm:h-11"
                  priority
                />
              </Link>

              <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-[#1A2B4C]/45 uppercase">
                Korean Society of Occupational Therapy
              </p>

              <h1 className="text-balance mt-4 text-[2.35rem] font-bold leading-[1.08] tracking-tight text-[#1A2B4C] sm:text-5xl lg:text-[3.5rem]">
                Modern OT
                <br />
                <span className="bg-gradient-to-r from-[#1A2B4C] via-[#243B66] to-[#14B8A6] bg-clip-text text-transparent">
                  knowledge platform
                </span>
              </h1>

              <p className="mt-5 max-w-md text-lg leading-relaxed text-[#1A2B4C]/60">
                논문·학술대회·교육·커뮤니티를 하나의 학술 생태계에서.
                <span className="text-[#1A2B4C]/80"> 지금 바로 시작하세요.</span>
              </p>
            </motion.div>

            {/* CTAs — clear hierarchy, not a 4-box grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Link
                href={legacyHref(primaryCta.href)}
                className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-[#1A2B4C] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_40px_rgba(26,43,76,0.22)] transition hover:bg-[#243B66] hover:shadow-[0_16px_48px_rgba(26,43,76,0.28)] active:scale-[0.98]"
              >
                <PrimaryIcon className="h-[18px] w-[18px] text-[#2DD4BF]" />
                {primaryCta.label}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>

              <div className="flex flex-wrap gap-2.5">
                {secondaryCtas.map((cta) => {
                  const Icon = iconMap[cta.icon];
                  return (
                    <Link
                      key={cta.label}
                      href={legacyHref(cta.href)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#1A2B4C]/10 bg-white/70 px-4 py-2.5 text-sm font-medium text-[#1A2B4C]/85 shadow-sm backdrop-blur-md transition hover:border-[#2DD4BF]/40 hover:bg-white hover:text-[#1A2B4C] active:scale-[0.98]"
                    >
                      <Icon className="h-4 w-4 text-[#2DD4BF]" />
                      {cta.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Trust metrics — minimal, not bulletin stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-10 flex flex-wrap gap-8 border-t border-[#1A2B4C]/8 pt-8"
            >
              {platformStats.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold tabular-nums text-[#1A2B4C] sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-[#1A2B4C]/45">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — 3D floating interface objects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:min-h-[540px]"
          >
            <HeroFloatingScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
