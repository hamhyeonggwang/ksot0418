"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { isExternalHref } from "@/lib/constants";

type Props = {
  href?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
  onClick?: () => void;
};

export function GlassCard({
  href,
  className = "",
  children,
  delay = 0,
  onClick,
}: Props) {
  const base =
    "group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 backdrop-blur-md bento-shadow transition-all duration-300 hover:bento-shadow-hover sm:p-6 " +
    className;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      className={base}
      onClick={onClick}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#2DD4BF]/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        {...(isExternalHref(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] rounded-2xl"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
