import Link from "next/link";
import Image from "next/image";
import { LEGACY, legacyHref, isExternalHref } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1A2B4C]/10 bg-[#1A2B4C] text-white/85">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Image
              src="/images/logo.png"
              alt="KSOT"
              width={160}
              height={48}
              className="mb-4 h-10 w-auto brightness-0 invert"
            />
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              대한작업치료학회는 1993년 창립 이래 작업치료의 학문적 발전과
              전문직 향상을 위해 노력하는 대한민국 대표 학술 단체입니다.
            </p>
            <p className="mt-4 text-sm text-white/60">
              (54538) 전북 익산시 익산대로 460 원광대학교 작업치료학과내
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold text-[#2DD4BF]">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={legacyHref(LEGACY.journal)} className="hover:text-white">
                  학회지
                </Link>
              </li>
              <li>
                <Link
                  href={legacyHref(LEGACY.conference)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  학술대회
                </Link>
              </li>
              <li>
                <Link href={legacyHref(LEGACY.education)} className="hover:text-white">
                  보수교육
                </Link>
              </li>
              <li>
                <Link href={legacyHref(LEGACY.submission)} className="hover:text-white">
                  논문투고
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold text-[#2DD4BF]">문의</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>행정·보수교육: ksotoffice@naver.com</li>
              <li>학술지·학술대회: ksot.editor@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} 대한작업치료학회 (KSOT). All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href={legacyHref("/guide#privacy")}>개인정보처리방침</Link>
            <Link href={legacyHref("/guide#terms")}>이용약관</Link>
            <Link href="/admin" className="text-white/30 hover:text-white/60">
              관리자
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
