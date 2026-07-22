"use client";

import { useState, FormEvent } from "react";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LEGACY, legacyHref } from "@/lib/constants";

const suggestions = [
  "감각통합",
  "뇌졸중 재활",
  "인지재활",
  "소아 발달",
  "일상생활활동",
  "보조공학",
  "정신건강",
  "지역사회",
  "정책",
  "척수장애",
];

export function ResearchAreasSection() {
  const [query, setQuery] = useState("");

  const searchHref = legacyHref(
    query.trim()
      ? `/journal?q=${encodeURIComponent(query.trim())}#archive`
      : LEGACY.journalSearch
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    window.location.href = searchHref;
  }

  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-24" id="research">
      <Container>
        <SectionHeader
          label="Search"
          title="논문"
          titleAccent="검색"
          description="관심 주제·키워드로 학회지 논문을 바로 검색하세요."
        />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-[#1A2B4C]/12 bg-white px-5 py-3.5 shadow-sm focus-within:border-[#2DD4BF]/60 focus-within:shadow-md transition-all">
            <Search className="h-5 w-5 shrink-0 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="논문 제목, 저자, 키워드 검색…"
              className="flex-1 bg-transparent text-base text-[#1A2B4C] placeholder:text-muted outline-none"
              aria-label="논문 검색"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1A2B4C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243B66] active:scale-[0.97]"
            >
              검색
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Keyword suggestions */}
          <div className="mt-5 flex flex-wrap gap-2">
            {suggestions.map((kw, i) => (
              <motion.button
                key={kw}
                type="button"
                onClick={() => setQuery(kw)}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                  query === kw
                    ? "border-[#2DD4BF] bg-[#2DD4BF]/15 text-[#14B8A6]"
                    : "border-[#1A2B4C]/10 bg-white text-muted hover:border-[#2DD4BF]/50 hover:text-[#1A2B4C]"
                }`}
              >
                {kw}
              </motion.button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            또는{" "}
            <Link
              href={legacyHref(LEGACY.journalSearch)}
              className="font-semibold text-[#14B8A6] underline-offset-2 hover:underline"
            >
              전체 논문 아카이브 보기
            </Link>
          </p>
        </motion.form>
      </Container>
    </section>
  );
}
