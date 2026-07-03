"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { LEGACY, legacyHref, isExternalHref } from "@/lib/constants";

/** UX: 3-click rule — explicit paths for primary personas */
const paths = [
  { persona: "임상 치료사", actions: ["보수교육 신청", "학회지 열람", "학술대회 등록"], links: [LEGACY.education, LEGACY.journal, LEGACY.conferenceRegister] },
  { persona: "학생·대학원생", actions: ["논문 검색", "투고 안내", "커뮤니티"], links: [LEGACY.journalSearch, LEGACY.submission, LEGACY.community] },
  { persona: "연구자·교수", actions: ["온라인 투고", "편집 규정", "최신 호"], links: [LEGACY.submission, `${LEGACY.submission}#policy`, LEGACY.journal] },
];

export function QuickPathSection() {
  return (
    <section className="border-y border-[#1A2B4C]/8 bg-white py-12">
      <Container>
        <p className="mb-8 text-center text-sm font-bold tracking-widest text-muted uppercase">
          3 clicks to your goal
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {paths.map((p, i) => (
            <motion.div
              key={p.persona}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-[#F8FAFC] p-6"
            >
              <h3 className="font-bold text-[#1A2B4C]">{p.persona}</h3>
              <ul className="mt-4 space-y-2">
                {p.actions.map((label, j) => (
                  <li key={label}>
                    <Link
                      href={legacyHref(p.links[j])}
                      {...(isExternalHref(p.links[j])
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-medium text-[#1A2B4C] shadow-sm transition hover:text-[#14B8A6] hover:shadow-md"
                    >
                      {label}
                      <span className="text-[#2DD4BF]">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
