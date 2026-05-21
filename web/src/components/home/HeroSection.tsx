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
  Sparkles,
} from "lucide-react";
import { heroCTAs, conferenceHighlights, platformStats } from "@/lib/data";
import { legacyHref } from "@/lib/constants";

const iconMap = {
  search: Search,
  calendar: Calendar,
  education: GraduationCap,
  user: UserPlus,
} as const;

export function HeroSection() {
  const conf = conferenceHighlights;

  return (
    <section className="relative overflow-hidden bg-[#1A2B4C] text-white">
      {/* Cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-[#2DD4BF]/20 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-[#243B66] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-28 sm:pt-12 lg:px-8 lg:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Copy + CTAs — UX: answer "what can I do here?" in 3 seconds */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#2DD4BF]">
                <Sparkles className="h-3.5 w-3.5" />
                Korean Society of Occupational Therapy
              </span>
              <h1 className="text-balance mt-6 text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                작업치료의 지식을
                <br />
                <span className="text-[#2DD4BF]">연결하고 확장하는</span>
                <br />
                학술 플랫폼
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
                논문 검색 · 학술대회 · 보수교육 · 학회지 — 임상가·학생·연구자가
                필요한 학술 활동을 한곳에서 시작하세요.
              </p>
            </motion.div>

            {/* Primary action grid — mobile-first touch targets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {heroCTAs.map((cta, i) => {
                const Icon = iconMap[cta.icon];
                return (
                  <Link
                    key={cta.label}
                    href={legacyHref(cta.href)}
                    className={`group flex min-h-[88px] flex-col justify-between rounded-2xl border p-4 transition-all active:scale-[0.98] ${
                      cta.primary
                        ? "border-[#2DD4BF]/50 bg-[#2DD4BF] text-[#1A2B4C] hover:bg-[#2DD4BF]/90"
                        : "border-white/15 bg-white/5 hover:border-[#2DD4BF]/40 hover:bg-white/10"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${cta.primary ? "text-[#1A2B4C]" : "text-[#2DD4BF]"}`}
                    />
                    <div>
                      <span className="block text-sm font-bold">{cta.label}</span>
                      <span
                        className={`text-xs ${cta.primary ? "text-[#1A2B4C]/70" : "text-white/55"}`}
                      >
                        {cta.sub}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8"
            >
              {platformStats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-[#2DD4BF]">{s.value}</div>
                  <div className="text-xs text-white/50">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Conference highlight card — drives #1 user action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="glass-dark overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8">
              <p className="text-xs font-bold tracking-widest text-[#2DD4BF] uppercase">
                Featured Event
              </p>
              <h2 className="mt-2 text-2xl font-bold">{conf.title}</h2>
              <p className="mt-1 text-[#2DD4BF]">{conf.theme}</p>
              <p className="text-sm text-white/70">{conf.themeKo}</p>
              <dl className="mt-6 space-y-2 text-sm text-white/80">
                <div className="flex gap-2">
                  <dt className="text-white/50">일시</dt>
                  <dd className="font-medium">{conf.date}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-white/50">장소</dt>
                  <dd>{conf.place}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={legacyHref(conf.registerHref)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3.5 text-sm font-bold text-[#1A2B4C] transition hover:bg-[#2DD4BF]/90"
                >
                  사전등록 · 프로그램
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={legacyHref(conf.href)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/10"
                >
                  대회 안내
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/30 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-[#2DD4BF]" />
        </div>
      </motion.div>
    </section>
  );
}
