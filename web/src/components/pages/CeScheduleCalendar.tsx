"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, CircleAlert } from "lucide-react";

type CeEvent = {
  day: number | null;
  time?: string;
  title: string;
  detail: string;
  color: string;
};

const MIN_YM = { year: 2026, month: 1 };
const MAX_YM = { year: 2026, month: 12 };

const CE_EVENTS: Record<string, CeEvent[]> = {
  "2026-2": [
    {
      day: 8,
      time: "09:00",
      title: "발달평가 사례·보고서",
      detail:
        "발달평가를 통한 양육환경 조성: 사례 및 보고서 작성 (Bayley-3, DDST-2, SP-2, PAT-2 중심) · 오전 9:00~13:00 · 서울 · 4학점 · 정원 100명 (선착순 마감)",
      color: "#5c7cfa",
    },
    {
      day: 8,
      time: "14:00",
      title: "감각통합 활동분석",
      detail:
        "감각통합 중재에서 활동분석 적용: 사례 기반 활동분석과 목표 설정 · 오후 14:00~18:00 · 서울 · 4학점 · 정원 100명 (선착순 마감)",
      color: "#15aabf",
    },
  ],
  "2026-6": [
    {
      day: null,
      time: "09:00~13:00",
      title: "발달평가를 통한 양육환경 조성: 사례 및 보고서 작성",
      detail: "(Bayley-3, DDST-2, SP-2, PAT-2 중심) · 장소 대전 · 4학점 · 정원 80명 (선착순 마감)",
      color: "#40c057",
    },
    {
      day: null,
      time: "14:00~18:00",
      title: "감각통합 중재에서 활동분석 적용: 사례 기반 활동분석과 목표 설정",
      detail: "장소 대전 · 4학점 · 정원 80명 (선착순 마감)",
      color: "#fd7e14",
    },
  ],
  "2026-9": [
    {
      day: null,
      title: "오프라인 학술대회",
      detail: "제34회 대한작업치료학회 학술대회 · 장소 대전 · 4학점 · 정원 70명 (선착순 마감) · 1개의 보수교육 운영",
      color: "#845ef7",
    },
    {
      day: null,
      title: "오프라인 학술주간",
      detail:
        "제34회 대한작업치료학회 학술대회 학술주간 · 장소 서울 · 4학점 · 정원 100명 (선착순 마감) · 4개의 보수교육 운영",
      color: "#e64980",
    },
    {
      day: null,
      title: "온라인 학술주간",
      detail:
        "제34회 대한작업치료학회 학술대회 학술주간 · 장소 Zoom · 4학점 · 정원 70명 (선착순 마감) · 1개의 보수교육 운영",
      color: "#1098ad",
    },
  ],
};

function toIndex(year: number, month: number) {
  return year * 12 + (month - 1);
}

function fromIndex(idx: number) {
  return { year: Math.floor(idx / 12), month: (idx % 12) + 1 };
}

function clamp(year: number, month: number) {
  const idx = Math.min(
    Math.max(toIndex(year, month), toIndex(MIN_YM.year, MIN_YM.month)),
    toIndex(MAX_YM.year, MAX_YM.month)
  );
  return fromIndex(idx);
}

function buildCells(year: number, month: number) {
  const startDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ day: number | null; dow: number }> = [];
  for (let i = 0; i < startDow; i++) cells.push({ day: null, dow: i });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, dow: (startDow + d - 1) % 7 });
  while (cells.length % 7 !== 0) cells.push({ day: null, dow: cells.length % 7 });
  return cells;
}

export function CeScheduleCalendar() {
  const [ym, setYm] = useState(() => {
    const today = new Date();
    return clamp(today.getFullYear(), today.getMonth() + 1);
  });

  const cells = useMemo(() => buildCells(ym.year, ym.month), [ym]);
  const events = CE_EVENTS[`${ym.year}-${ym.month}`] ?? [];
  const dayEvents = events.filter((e) => e.day !== null);
  const pendingEvents = events.filter((e) => e.day === null);

  const atMin = toIndex(ym.year, ym.month) === toIndex(MIN_YM.year, MIN_YM.month);
  const atMax = toIndex(ym.year, ym.month) === toIndex(MAX_YM.year, MAX_YM.month);

  function go(delta: number) {
    setYm((prev) => {
      const next = fromIndex(toIndex(prev.year, prev.month) + delta);
      return clamp(next.year, next.month);
    });
  }

  return (
    <div className="static-page-content">
      <section className="content-section" id="ce-schedule">
        <div className="content-header">
          <h2>
            <i className="fa-solid fa-calendar-days" /> 2026 보수교육 일정 안내
          </h2>
        </div>
        <div className="info-box info-box-blue" style={{ marginBottom: 22 }}>
          <i className="fa-solid fa-circle-info" />
          <div className="info-box-content">
            <h5>안내</h5>
            <p style={{ margin: 0, lineHeight: 1.65 }}>
              아래 캘린더는 학회 계획에 따른 안내이며, 세부 신청·접수 일정은 추후 공지됩니다. 문의:{" "}
              <a href="mailto:ksotoffice@naver.com" style={{ color: "inherit", fontWeight: 600 }}>
                ksotoffice@naver.com
              </a>
            </p>
          </div>
        </div>

        <div className="ce-cal-month">
          <div className="ce-cal-month-header">
            <button
              type="button"
              className="ce-cal-nav-btn"
              onClick={() => go(-1)}
              disabled={atMin}
              aria-label="이전 달"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="ce-cal-month-title">
              {ym.year}년 {ym.month}월
            </div>
            <button
              type="button"
              className="ce-cal-nav-btn"
              onClick={() => go(1)}
              disabled={atMax}
              aria-label="다음 달"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="ce-cal-grid">
            {["일", "월", "화", "수", "목", "금", "토"].map((label, i) => (
              <div
                key={label}
                className={`ce-cal-dow${i === 0 ? " ce-cal-dow--sun" : ""}${i === 6 ? " ce-cal-dow--sat" : ""}`}
              >
                {label}
              </div>
            ))}
            {cells.map((cell, i) => {
              const cellEvents = cell.day ? dayEvents.filter((e) => e.day === cell.day) : [];
              const classes = [
                "ce-cal-cell",
                cell.day === null ? "ce-cal-cell--empty" : "",
                cellEvents.length ? "ce-cal-cell--active" : "",
                cell.dow === 0 ? "ce-cal-cell--sun" : "",
                cell.dow === 6 ? "ce-cal-cell--sat" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div key={i} className={classes}>
                  {cell.day !== null && (
                    <span className={cellEvents.length ? "ce-cal-daynum ce-cal-daynum--badge" : "ce-cal-daynum"}>
                      {cell.day}
                    </span>
                  )}
                  {cellEvents.map((e, idx) => (
                    <div
                      key={idx}
                      className="ce-cal-bar"
                      style={{ background: `${e.color}1a`, borderLeft: `3px solid ${e.color}` }}
                    >
                      {e.time && <span className="ce-cal-bar-time">{e.time}</span>}
                      <span className="ce-cal-bar-title">{e.title}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {dayEvents.length > 0 && (
            <div className="ce-cal-legend">
              {dayEvents.map((e, idx) => (
                <span key={idx}>
                  <i className="ce-cal-dot" style={{ background: e.color }} />
                  {e.detail}
                </span>
              ))}
            </div>
          )}

          {pendingEvents.length > 0 && (
            <div className="ce-cal-pending">
              <div className="ce-cal-pending-label">
                <Clock size={13} /> 일자 미정 · 확정되는 대로 위 캘린더에 반영됩니다
              </div>
              <div className="ce-cal-pending-list">
                {pendingEvents.map((e, idx) => (
                  <div key={idx} className="ce-cal-pending-item" style={{ borderLeftColor: e.color }}>
                    <strong>
                      {e.time ? `${e.time} · ` : ""}
                      {e.title}
                    </strong>
                    <span>{e.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && (
            <div className="ce-cal-empty">
              <CircleAlert size={15} /> 해당 월에 등록된 보수교육 일정이 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
