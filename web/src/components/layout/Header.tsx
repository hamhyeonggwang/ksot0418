"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown, User } from "lucide-react";
import { navLinks } from "@/lib/data";
import { LEGACY, legacyHref, isExternalHref } from "@/lib/constants";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <div className="hidden border-b border-[#1A2B4C]/5 bg-[#1A2B4C] text-xs text-white/80 lg:block">
        <div className="mx-auto flex max-w-7xl justify-between px-8 py-2">
          <span>행정·보수교육 ksotoffice@naver.com</span>
          <span>학술지·학술대회 ksot.editor@gmail.com</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-[#1A2B4C]/8 bg-white/80 shadow-[0_4px_24px_rgba(26,43,76,0.06)] backdrop-blur-xl"
            : "bg-[#F8FAFC]/0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
          <Link href="/" className="relative z-10 flex shrink-0 items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="대한작업치료학회 KSOT"
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 text-[#1A2B4C] lg:flex">
            {navLinks.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={legacyHref(item.href)}
                  {...(isExternalHref(item.href)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${
                    "highlight" in item && item.highlight
                      ? "bg-[#2DD4BF] text-[#1A2B4C] hover:bg-[#2DD4BF]/90"
                      : ""
                  }`}
                >
                  {item.label}
                  {"children" in item && item.children && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  )}
                </Link>
                {"children" in item && item.children && openMenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 top-full min-w-[180px] rounded-xl border border-white/20 bg-white p-2 shadow-xl"
                  >
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={legacyHref(c.href)}
                        className="block rounded-lg px-3 py-2 text-sm text-[#1A2B4C] hover:bg-[#F8FAFC]"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="검색"
              className="rounded-full p-2.5 text-[#1A2B4C] transition-colors hover:bg-[#1A2B4C]/5"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href={legacyHref(LEGACY.login)}
              className="hidden items-center gap-2 rounded-full bg-[#1A2B4C] px-4 py-2 text-sm font-semibold text-white sm:inline-flex hover:bg-[#243B66]"
            >
              <User className="h-4 w-4" />
              로그인
            </Link>
            <button
              type="button"
              className="rounded-full p-2.5 text-[#1A2B4C] lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="메뉴 열기"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-[#1A2B4C]/40 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[min(100%,320px)] flex-col bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-[#1A2B4C]/10 p-4">
                <span className="font-bold text-[#1A2B4C]">KSOT</span>
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label="닫기">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={legacyHref(item.href)}
                    onClick={() => setDrawerOpen(false)}
                    {...(isExternalHref(item.href)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={`rounded-xl px-4 py-3.5 text-base font-medium ${
                      "highlight" in item && item.highlight
                        ? "bg-[#2DD4BF]/15 text-[#14B8A6]"
                        : "text-[#1A2B4C] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="my-4 border-[#1A2B4C]/10" />
                <Link
                  href={legacyHref(LEGACY.join)}
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl bg-[#1A2B4C] px-4 py-3.5 text-center font-semibold text-white"
                >
                  회원가입
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
