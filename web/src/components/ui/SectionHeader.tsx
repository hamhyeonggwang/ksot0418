"use client";

import { motion } from "framer-motion";

type Props = {
  label: string;
  title: string;
  titleAccent?: string;
  description?: string;
  action?: React.ReactNode;
};

export function SectionHeader({
  label,
  title,
  titleAccent,
  description,
  action,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="max-w-2xl">
        <span className="mb-3 inline-block rounded-full bg-[#2DD4BF]/15 px-3 py-1 text-xs font-bold tracking-widest text-[#14B8A6] uppercase">
          {label}
        </span>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-[#1A2B4C] sm:text-4xl">
          {title}
          {titleAccent && (
            <span className="mt-1 block text-[#2DD4BF] sm:inline sm:mt-0 sm:ml-2">
              {titleAccent}
            </span>
          )}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
