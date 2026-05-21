"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { researchAreas } from "@/lib/data";
import { legacyHref } from "@/lib/constants";

export function ResearchAreasSection() {
  const [active, setActive] = useState(researchAreas[0].id);
  const current = researchAreas.find((r) => r.id === active) ?? researchAreas[0];

  return (
    <section className="bg-white py-16 sm:py-24" id="research">
      <Container>
        <SectionHeader
          label="Explore"
          title="연구 분야"
          titleAccent="탐색"
          description="관심 주제를 선택해 관련 논문·학술대회 콘텐츠로 바로 이동합니다. 탐색형 UX로 메뉴 혼란을 줄입니다."
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Category cards — touch-friendly */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {researchAreas.map((area, i) => {
              const Icon = area.icon;
              const isActive = active === area.id;
              return (
                <motion.button
                  key={area.id}
                  type="button"
                  onClick={() => setActive(area.id)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                    isActive
                      ? "border-[#2DD4BF] bg-[#2DD4BF]/10 ring-2 ring-[#2DD4BF]/30"
                      : "border-[#1A2B4C]/8 bg-[#F8FAFC] hover:border-[#2DD4BF]/40"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-80`}
                  />
                  <div className="relative">
                    <Icon
                      className={`h-6 w-6 ${isActive ? "text-[#14B8A6]" : "text-[#1A2B4C]/60"}`}
                    />
                    <p className="mt-3 font-bold text-[#1A2B4C]">{area.title}</p>
                    <p className="text-xs text-[#1A2B4C]/50">{area.titleEn}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Detail panel — encourages exploration */}
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-between rounded-3xl bg-[#1A2B4C] p-8 text-white sm:p-10"
          >
            <div>
              <current.icon className="h-10 w-10 text-[#2DD4BF]" />
              <h3 className="mt-6 text-3xl font-bold">{current.title}</h3>
              <p className="mt-1 text-[#2DD4BF]">{current.titleEn}</p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                {current.description}
              </p>
              <p className="mt-6 text-sm text-white/50">
                해당 분야 논문·학술 자료를 학회지 검색에서 확인할 수 있습니다.
              </p>
            </div>
            <Link
              href={legacyHref(current.href)}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-3.5 text-sm font-bold text-[#1A2B4C]"
            >
              논문 검색하기
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
