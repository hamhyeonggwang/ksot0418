"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Video, MessageCircle, Images, Mail, Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mediaItems } from "@/lib/data";
import { LEGACY, legacyHref } from "@/lib/constants";

const typeIcons = {
  youtube: Video,
  story: MessageCircle,
  gallery: Images,
  newsletter: Mail,
};

export function MediaCommunitySection() {
  return (
    <section className="bg-[#1A2B4C] py-16 text-white sm:py-24" id="media">
      <Container>
        <SectionHeader
          label="Media & Community"
          title="OT 미디어"
          titleAccent="허브"
          description="영상·인터뷰·갤러리로 학회 활동에 머무르게 합니다. 플랫폼 체류·재방문을 높이는 영역입니다."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mediaItems.map((item, i) => {
            const Icon = typeIcons[item.type];
            const isYoutube = item.type === "youtube";
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={item.type === "youtube" ? item.href : legacyHref(item.href)}
                  target={isYoutube ? "_blank" : undefined}
                  rel={isYoutube ? "noopener noreferrer" : undefined}
                  className={`group block h-full overflow-hidden rounded-2xl border transition ${
                    isYoutube
                      ? "border-red-500/30 bg-gradient-to-b from-red-600/20 to-transparent hover:border-red-400/50"
                      : "border-white/10 bg-white/5 hover:border-[#2DD4BF]/40 hover:bg-white/10"
                  }`}
                >
                  <div className="relative flex aspect-video items-center justify-center bg-[#243B66]">
                    {isYoutube ? (
                      <Play className="h-14 w-14 text-red-400 transition group-hover:scale-110" />
                    ) : (
                      <Icon className="h-10 w-10 text-[#2DD4BF]" />
                    )}
                    <span className="absolute left-3 top-3 rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold">
                      {item.thumb}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Newsletter CTA strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 p-8 sm:flex-row"
        >
          <div>
            <h3 className="text-xl font-bold">커뮤니티에 참여하세요</h3>
            <p className="mt-1 text-sm text-white/70">
              공지·자료실·자유게시판에서 동료 치료사와 소통합니다.
            </p>
          </div>
          <Link
            href={legacyHref(LEGACY.community)}
            className="shrink-0 rounded-xl bg-[#2DD4BF] px-8 py-3.5 font-bold text-[#1A2B4C]"
          >
            커뮤니티 바로가기
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
