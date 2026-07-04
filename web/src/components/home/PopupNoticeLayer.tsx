"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { popupAssetUrl, type PopupNotice } from "@/lib/popup-types";

const DISMISS_KEY_PREFIX = "ksot_popup_dismiss_";

function endOfTodayTimestamp(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

function isDismissedToday(id: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(DISMISS_KEY_PREFIX + id);
  if (!raw) return false;
  const expiresAt = Number(raw);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

function dismissForToday(id: string) {
  window.localStorage.setItem(DISMISS_KEY_PREFIX + id, String(endOfTodayTimestamp()));
}

// localStorage는 SSR에 없으므로 hydration mismatch 없이 client 값을 읽기 위해 useSyncExternalStore 사용
const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

type Props = {
  popups: PopupNotice[];
};

export function PopupNoticeLayer({ popups }: Props) {
  const isClient = useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);
  const [closedIds, setClosedIds] = useState<string[]>([]);

  const visiblePopups = isClient
    ? popups.filter((p) => !closedIds.includes(p.id) && !isDismissedToday(p.id))
    : [];

  if (visiblePopups.length === 0) return null;

  function handleClose(id: string, hideToday: boolean) {
    if (hideToday) dismissForToday(id);
    setClosedIds((prev) => [...prev, id]);
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-live="polite">
      <AnimatePresence>
        {visiblePopups.map((popup, index) => (
          <PopupCard key={popup.id} popup={popup} index={index} onClose={handleClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function PopupCard({
  popup,
  index,
  onClose,
}: {
  popup: PopupNotice;
  index: number;
  onClose: (id: string, hideToday: boolean) => void;
}) {
  const [hideToday, setHideToday] = useState(false);
  const offset = index * 28;

  const mediaUrl = popupAssetUrl(popup.storage_path);

  const media =
    popup.media_type === "pdf" ? (
      <iframe
        src={`${mediaUrl}#toolbar=0&navpanes=0`}
        title={popup.title}
        className="h-[380px] w-full rounded-t-2xl bg-white"
      />
    ) : (
      <div className="relative h-[320px] w-full overflow-hidden rounded-t-2xl bg-[#F8FAFC]">
        <Image
          src={mediaUrl}
          alt={popup.title}
          fill
          unoptimized
          className="object-contain"
          sizes="360px"
        />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      style={{
        top: `calc(6% + ${offset}px)`,
        left: `calc(5% + ${offset}px)`,
        zIndex: 100 + index,
      }}
      className="pointer-events-auto absolute w-[86vw] max-w-[340px] overflow-hidden rounded-2xl border border-white/50 bg-white/85 shadow-[0_24px_60px_rgba(26,43,76,0.28)] backdrop-blur-md"
    >
      <button
        type="button"
        onClick={() => onClose(popup.id, hideToday)}
        aria-label="팝업 닫기"
        className="absolute right-2 top-2 z-10 rounded-full bg-[#1A2B4C]/70 p-1.5 text-white transition hover:bg-[#1A2B4C]"
      >
        <X className="h-4 w-4" />
      </button>

      {popup.link_url ? (
        <Link href={popup.link_url} target="_blank" rel="noopener noreferrer">
          {media}
        </Link>
      ) : (
        media
      )}

      <div className="flex items-center justify-between gap-3 border-t border-[#1A2B4C]/8 bg-white/90 px-4 py-2.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-[#1A2B4C]/80">
          <input
            type="checkbox"
            checked={hideToday}
            onChange={(e) => setHideToday(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-[#1A2B4C]/20"
          />
          오늘 하루 보지 않기
        </label>
        <button
          type="button"
          onClick={() => onClose(popup.id, hideToday)}
          className="text-xs font-semibold text-muted hover:text-[#1A2B4C]"
        >
          닫기
        </button>
      </div>
    </motion.div>
  );
}
