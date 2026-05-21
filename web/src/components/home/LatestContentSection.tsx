"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Bell, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  latestPapers,
  latestEducation,
  announcements,
} from "@/lib/data";
import { LEGACY, legacyHref } from "@/lib/constants";

export function LatestContentSection() {
  return (
    <section className="py-16 sm:py-24" id="latest">
      <Container>
        <SectionHeader
          label="Latest"
          title="최신 학술 콘텐츠"
          titleAccent="한눈에"
          description="논문·교육·공지를 카드로 빠르게 탐색하세요. 메뉴 탐색 없이 바로 행동으로 이어집니다."
          action={
            <Link
              href={legacyHref(LEGACY.journalSearch)}
              className="inline-flex items-center gap-2 rounded-full bg-[#1A2B4C] px-5 py-2.5 text-sm font-semibold text-white"
            >
              전체 논문 검색
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        {/* Bento grid — scannable on mobile */}
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Featured journal — large bento cell */}
          <GlassCard
            href={legacyHref(LEGACY.journal)}
            className="lg:col-span-5 lg:row-span-2 !p-0"
            delay={0}
          >
            <div className="flex h-full min-h-[280px] flex-col sm:min-h-[320px]">
              <div className="relative flex-1 bg-gradient-to-br from-[#1A2B4C] to-[#243B66] p-6 text-white">
                <FileText className="h-8 w-8 text-[#2DD4BF]" />
                <p className="mt-4 text-xs font-bold tracking-widest text-[#2DD4BF]">
                  KCI 등재
                </p>
                <h3 className="mt-2 text-2xl font-bold">대한작업치료학회지</h3>
                <p className="mt-2 text-sm text-white/70">제34권 제1호 · 2026.3</p>
                <div className="absolute right-4 bottom-4 opacity-90">
                  <Image
                    src="/images/kjot-cover.png"
                    alt="KJOT 표지"
                    width={100}
                    height={136}
                    className="rounded-lg shadow-2xl"
                  />
                </div>
              </div>
              <div className="border-t border-[#1A2B4C]/5 p-5">
                <p className="line-clamp-2 text-sm font-medium text-[#1A2B4C]">
                  {latestPapers[0].title}
                </p>
                <p className="mt-1 text-xs text-[#1A2B4C]/55">
                  {latestPapers[0].authors} · {latestPapers[0].vol}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Papers list */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <h3 className="text-sm font-bold text-[#1A2B4C]/50 uppercase tracking-wider">
              최신 논문
            </h3>
            {latestPapers.slice(1).map((p, i) => (
              <GlassCard key={p.title} href={legacyHref(p.href)} delay={0.05 * (i + 1)}>
                <span className="text-xs font-semibold text-[#2DD4BF]">{p.tag}</span>
                <p className="mt-2 line-clamp-2 text-sm font-semibold text-[#1A2B4C]">
                  {p.title}
                </p>
                <p className="mt-2 text-xs text-[#1A2B4C]/50">
                  {p.authors} · Vol.{p.vol}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* Education + notices column */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#1A2B4C]/50 uppercase tracking-wider">
              <GraduationCap className="h-4 w-4" /> 보수교육
            </h3>
            {latestEducation.map((e, i) => (
              <GlassCard key={e.title} href={legacyHref(e.href)} delay={0.1 * i}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono text-[#1A2B4C]/45">{e.date}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      e.status === "open"
                        ? "bg-[#2DD4BF]/20 text-[#14B8A6]"
                        : "bg-[#1A2B4C]/10 text-[#1A2B4C]/50"
                    }`}
                  >
                    {e.status === "open" ? "신청" : "예정"}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-snug text-[#1A2B4C]">
                  {e.title}
                </p>
                <p className="mt-1 text-xs text-[#1A2B4C]/50">
                  {e.place} · {e.credits}
                </p>
              </GlassCard>
            ))}

            <h3 className="mt-2 flex items-center gap-2 text-sm font-bold text-[#1A2B4C]/50 uppercase tracking-wider">
              <Bell className="h-4 w-4" /> 공지
            </h3>
            {announcements.map((a, i) => (
              <Link
                key={a.title}
                href={legacyHref(a.href)}
                className="block rounded-xl border border-[#1A2B4C]/8 bg-white px-4 py-3 transition hover:border-[#2DD4BF]/40"
              >
                <span className="text-[10px] font-bold text-[#2DD4BF]">{a.type}</span>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-[#1A2B4C]">
                  {a.title}
                </p>
                <p className="mt-1 text-xs text-[#1A2B4C]/45">{a.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
