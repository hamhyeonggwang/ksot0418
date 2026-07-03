"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Mic2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { conferenceHighlights, latestEducation } from "@/lib/data";
import { LEGACY, legacyHref } from "@/lib/constants";

export function ConferenceEducationSection() {
  const conf = conferenceHighlights;

  return (
    <section className="py-16 sm:py-24" id="conference">
      <Container>
        <SectionHeader
          label="학회행사안내"
          title="학술대회 &"
          titleAccent="보수교육"
          description="게시판형 텍스트 대신 포스터·타임라인·스피커 카드로 행동(등록·일정 확인)을 유도합니다."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Poster-style conference card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2B4C] via-[#243B66] to-[#1A2B4C] p-8 text-white lg:col-span-7 lg:p-10"
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#2DD4BF]/20 blur-3xl" />
            <span className="relative text-xs font-bold tracking-[0.2em] text-[#2DD4BF] uppercase">
              2026 KSOT Conference
            </span>
            <h3 className="relative mt-4 text-3xl font-bold sm:text-4xl">{conf.title}</h3>
            <p className="relative mt-2 text-xl text-[#2DD4BF]">{conf.theme}</p>
            <p className="relative text-white/70">{conf.themeKo}</p>
            <div className="relative mt-8 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Calendar className="h-4 w-4 text-[#2DD4BF]" />
                {conf.date}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <MapPin className="h-4 w-4 text-[#2DD4BF]" />
                {conf.place}
              </span>
            </div>
            <Link
              href={legacyHref(conf.registerHref)}
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-4 font-bold text-[#1A2B4C]"
            >
              지금 등록 안내 보기
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Timeline */}
            <div className="relative mt-10 border-t border-white/10 pt-8">
              <p className="mb-4 text-xs font-bold text-white/50 uppercase">당일 일정</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {conf.timeline.map((t) => (
                  <div
                    key={t.time}
                    className="min-w-[100px] shrink-0 rounded-xl bg-white/5 px-3 py-3 text-center"
                  >
                    <div className="font-mono text-sm text-[#2DD4BF]">{t.time}</div>
                    <div className="mt-1 text-xs text-white/80">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Speakers + education stack */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-2xl border border-[#1A2B4C]/8 bg-white p-6 bento-shadow">
              <p className="flex items-center gap-2 text-sm font-bold text-[#1A2B4C]">
                <Mic2 className="h-4 w-4 text-[#2DD4BF]" />
                연자 하이라이트
              </p>
              <ul className="mt-4 space-y-4">
                {conf.speakers.map((s) => (
                  <li
                    key={s.name}
                    className="flex gap-3 border-b border-[#1A2B4C]/5 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A2B4C] text-xs font-bold text-[#2DD4BF]">
                      {s.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A2B4C]">{s.name}</p>
                      <p className="text-xs text-muted">{s.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <p className="text-sm font-bold text-muted">학술주간 교육</p>
              {latestEducation.slice(0, 2).map((e) => (
                <Link
                  key={e.title}
                  href={legacyHref(e.href)}
                  className="group rounded-2xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/5 p-5 transition hover:bg-[#2DD4BF]/10"
                >
                  <span className="text-xs font-mono text-[#14B8A6]">{e.date}</span>
                  <p className="mt-2 font-semibold text-[#1A2B4C] group-hover:text-[#14B8A6]">
                    {e.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {e.place} · {e.credits}
                  </p>
                </Link>
              ))}
              <Link
                href={legacyHref(LEGACY.education)}
                className="text-center text-sm font-semibold text-[#1A2B4C] underline-offset-4 hover:underline"
              >
                전체 교육 일정 →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
