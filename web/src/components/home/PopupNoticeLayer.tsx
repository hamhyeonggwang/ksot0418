"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
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

  // 이번 세션에 노출 대상인 팝업(오늘 하루 보지 않기로 숨긴 것 제외) — 진행 표시(1/3 등)의 분모로 사용
  const eligiblePopups = isClient ? popups.filter((p) => !isDismissedToday(p.id)) : [];
  const visiblePopups = eligiblePopups.filter((p) => !closedIds.includes(p.id));

  if (visiblePopups.length === 0) return null;

  // 여러 팝업이 있어도 한 번에 하나씩 순차 노출 — 닫으면 배열에서 빠지며 다음 팝업이 자연스럽게 이어짐
  const current = visiblePopups[0];
  const currentPosition = eligiblePopups.length - visiblePopups.length + 1;

  function handleClose(id: string, hideToday: boolean) {
    if (hideToday) dismissForToday(id);
    setClosedIds((prev) => [...prev, id]);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1220]/55 p-4 backdrop-blur-[2px]"
      aria-live="polite"
      onClick={() => handleClose(current.id, false)}
    >
      <AnimatePresence mode="wait">
        <PopupCard
          key={current.id}
          popup={current}
          position={currentPosition}
          total={eligiblePopups.length}
          onClose={handleClose}
        />
      </AnimatePresence>
    </div>
  );
}

function PopupCard({
  popup,
  position,
  total,
  onClose,
}: {
  popup: PopupNotice;
  position: number;
  total: number;
  onClose: (id: string, hideToday: boolean) => void;
}) {
  const [hideToday, setHideToday] = useState(false);

  const mediaUrl = popupAssetUrl(popup.storage_path);

  const media =
    popup.media_type === "pdf" ? (
      <iframe
        src={`${mediaUrl}#toolbar=0&navpanes=0`}
        title={popup.title}
        className="h-[70vh] max-h-[600px] w-[88vw] max-w-[480px] rounded-t-2xl bg-white"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element -- 관리자가 올린 임의 비율의 원본 이미지를 자연 비율 그대로 보여줘야 해서 next/image의 fill 대신 일반 img 사용
      <img
        src={mediaUrl}
        alt={popup.title}
        className="block max-h-[70vh] w-auto max-w-[88vw] rounded-t-2xl object-contain sm:max-w-[440px] md:max-w-[560px]"
      />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.stopPropagation()}
      className="relative flex max-h-[90vh] w-fit min-w-[280px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-white/50 bg-white shadow-[0_24px_60px_rgba(11,18,32,0.45)]"
    >
      {total > 1 && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-[#1A2B4C]/70 px-2 py-0.5 text-[11px] font-semibold text-white">
          {position} / {total}
        </span>
      )}
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

      <div className="flex items-center justify-between gap-3 border-t border-[#1A2B4C]/8 bg-white px-4 py-2.5">
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
