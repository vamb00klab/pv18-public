"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { PersonaType } from "@/types/persona";
import type { Axis, TypeAxisScores } from "@/types/axis";
import { RadarChart } from "@/components/RadarChart";

// ── Stars helpers ──────────────────────────────────────────────────────────────

function rankToStars(rank: number, total: number): number {
  const pct = rank / total;
  if (pct <= 0.10) return 5;
  if (pct <= 0.25) return 4;
  if (pct <= 0.50) return 3;
  if (pct <= 0.75) return 2;
  return 1;
}

function denseRank(score: number, allRanked: { score: number }[]): number {
  return allRanked.filter((t) => t.score > score).length + 1;
}

function starsDisplay(stars: number): string {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

function starsToBarPct(stars: number): number {
  return ([0, 15, 35, 55, 78, 100] as const)[stars] ?? 0;
}

interface Props {
  result: PersonaType;
  scores: Record<string, number>;
  allTypes: PersonaType[];
  axes?: Axis[];
  axisProfile?: TypeAxisScores;
}

export function ResultCard({ result, scores, allTypes, axes, axisProfile }: Props) {
  type RankedType = PersonaType & { score: number };
  const [popupType, setPopupType] = useState<RankedType | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closePopup = useCallback(() => {
    setPopupType(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!popupType) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const closeBtn = dialogRef.current?.querySelector<HTMLElement>("button");
    closeBtn?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [popupType, closePopup]);

  const allRanked = [...allTypes]
    .map((t) => ({ ...t, score: scores[t.type_id] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const ranked = allRanked.slice(0, 5);
  const total = allRanked.length;

  const second = ranked[1];
  const third = ranked[2];

  return (
    <div className="space-y-6">
      {/* ── Main result card ── */}
      <div
        className="rounded-2xl p-8 text-center shadow-xs"
        style={{ backgroundColor: result.bgColor, borderTop: `3px solid ${result.color}` }}
      >
        {result.iconPath && (
          <div className="flex justify-center mb-5">
            <Image
              src={result.iconPath}
              alt={result.label}
              width={96}
              height={96}
              className="rounded-2xl shadow-md"
            />
          </div>
        )}

        <div
          className="inline-block px-4 py-1 rounded-full text-sm font-bold text-white mb-4 tracking-widest"
          style={{ backgroundColor: result.color }}
        >
          {result.shortLabel}
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          {result.label}
        </h2>

        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
          {result.description}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {result.traits.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: result.color + "CC" }}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* ── Traits / Radar chart ── */}
      <div className="bg-volt-surface rounded-2xl p-6 border border-volt-edge">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 volt-divider pb-2">
          キミの傾向
        </h3>

        {axes && axisProfile ? (
          <>
            <RadarChart axes={axes} scores={axisProfile} color={result.color} />
            <p className="mt-3 text-xs text-center text-volt-muted">
              傾向名をタップで詳細確認
            </p>
            <details className="mt-3 text-left">
              <summary className="cursor-pointer select-none list-none flex items-center justify-between w-full px-3 py-2 rounded-lg bg-volt-edge hover:bg-white/10 active:bg-white/15 transition-colors border border-white/10">
                <span className="text-xs font-medium text-white/70">くわしく見る（分析好きな人向け）</span>
                <span className="details-arrow text-volt-muted text-xs ml-1">▶</span>
              </summary>
              <ul className="mt-3 space-y-3">
                {axes.map((a) => {
                  const s = axisProfile[a.id] ?? 0;
                  const isHigh = s >= 1;
                  const isLow = s <= -1;
                  return (
                    <li key={a.id} className="flex gap-2">
                      <span
                        className="mt-0.5 shrink-0 text-xs font-bold w-14 leading-relaxed"
                        style={{ color: isHigh ? result.color : isLow ? "#8891a4" : "#9ca3af" }}
                      >
                        {a.label}
                      </span>
                      <span className="text-xs text-white/75 leading-relaxed">
                        {a.description}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </details>
          </>
        ) : (
          <>
            <ul className="space-y-2 mb-5">
              {result.traits.map((trait) => (
                <li key={trait} className="flex items-center gap-2 text-white/80 text-sm">
                  <span className="font-bold" style={{ color: result.color }}>・</span>
                  {trait}
                </li>
              ))}
            </ul>
            <p className="text-sm font-bold" style={{ color: result.color }}>
              → {result.label}と相性が良い傾向が強く出ています
            </p>
          </>
        )}
      </div>

      {/* ── Detailed profile ── */}
      {(result.suitableFor || result.strengths || result.weaknesses) && (
        <div className="bg-volt-surface rounded-2xl p-6 border border-volt-edge">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 volt-divider pb-2">
            こんな人かも！
          </h3>

          {result.suitableFor && (
            <div className="mb-5">
              <ul className="space-y-1.5">
                {result.suitableFor.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="mt-0.5 shrink-0" style={{ color: result.color }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {result.strengths && (
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: result.color }}>得意なこと</p>
                <ul className="space-y-1.5">
                  {result.strengths.map((s) => (
                    <li key={s} className="text-sm text-white/80 flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0" style={{ color: result.color }}>●</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.weaknesses && (
              <div>
                <p className="text-xs font-bold text-white/70 mb-2">ちょっと苦手</p>
                <ul className="space-y-1.5">
                  {result.weaknesses.map((w) => (
                    <li key={w} className="text-sm text-white/80 flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0 text-white/50">○</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sub types ── */}
      {(second || third) && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">
            他にもこんなタイプかも？
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {([second, third] as typeof ranked).filter(Boolean).map((type) => (
              <button
                key={type.type_id}
                type="button"
                ref={(el) => { if (popupType?.type_id === type.type_id) triggerRef.current = el; }}
                onClick={(e) => { triggerRef.current = e.currentTarget; setPopupType(type); }}
                className="rounded-xl p-4 text-center shadow-xs text-left active:scale-95 transition-transform"
                style={{ backgroundColor: type.bgColor, borderTop: `3px solid ${type.color}` }}
              >
                {type.iconPath && (
                  <div className="flex justify-center mb-2">
                    <Image
                      src={type.iconPath}
                      alt={type.label}
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                  </div>
                )}
                <div
                  className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white mb-1"
                  style={{ backgroundColor: type.color }}
                >
                  {type.shortLabel}
                </div>
                <p className="text-sm font-bold text-gray-900">{type.label}</p>
                <p className="text-xs mt-1" style={{ color: type.color }}>
                  相性度：{starsDisplay(rankToStars(denseRank(type.score, allRanked), total))}
                </p>
                <p className="text-xs mt-2 text-gray-400">タップで詳細 ▸</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Score breakdown ── */}
      <div className="bg-volt-surface rounded-2xl p-6 border border-volt-edge">
        <h3 className="text-base font-bold text-white mb-5 volt-divider pb-2">
          フィット度ランキング
        </h3>
        <div className="space-y-4">
          {ranked.map((type, i) => (
            <div key={type.type_id}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className={`flex items-center gap-2 font-medium ${i === 0 ? "text-white" : "text-white/80"}`}>
                  {type.iconPath ? (
                    <Image
                      src={type.iconPath}
                      alt=""
                      width={18}
                      height={18}
                      className="rounded shrink-0"
                    />
                  ) : (
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: type.color }} />
                  )}
                  {type.label}
                </span>
                <span className="tabular-nums text-xs text-white/60">
                  {starsDisplay(rankToStars(denseRank(type.score, allRanked), total))}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${starsToBarPct(rankToStars(denseRank(type.score, allRanked), total))}%`,
                    backgroundColor: type.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subtype popup overlay ── */}
      {popupType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.72)" }}
          onClick={closePopup}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${popupType.label}の詳細`}
            className="w-full max-w-sm rounded-2xl p-6 shadow-xl relative"
            style={{ backgroundColor: popupType.bgColor, borderTop: `4px solid ${popupType.color}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 text-base font-bold"
              style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
              aria-label="閉じる"
            >
              ✕
            </button>

            {popupType.iconPath && (
              <div className="flex justify-center mb-4">
                <Image
                  src={popupType.iconPath}
                  alt={popupType.label}
                  width={80}
                  height={80}
                  className="rounded-2xl shadow-md"
                />
              </div>
            )}

            <div className="flex justify-center mb-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white tracking-widest"
                style={{ backgroundColor: popupType.color }}
              >
                {popupType.shortLabel}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-gray-900 text-center mb-3">
              {popupType.label}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed text-center mb-4">
              {popupType.description}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {popupType.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: popupType.color + "CC" }}
                >
                  {trait}
                </span>
              ))}
            </div>

            <p className="text-center text-sm font-bold" style={{ color: popupType.color }}>
              相性度：{starsDisplay(rankToStars(denseRank(popupType.score, allRanked), total))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
