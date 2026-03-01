"use client"

/**
 * /dev/high-effects
 *
 * high エネルギー結果フェーズ用エフェクト比較ページ（開発専用）
 *
 * 4案を radio で切り替えて外観を確認できる。
 *   A. コーニック回転  — conic-gradient ビームが角からゆっくり回転
 *   B. シャドウパルス  — 4 隅の box-shadow 黄色グロー拍動
 *   C. スパーク（黄）  — SVG ホタルを黄色に（glow filter なし・低負荷）
 *   D. 走査線          — 黄ライン水平スキャン
 */

import { notFound } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

type EffectKey = "conic" | "shadow" | "spark" | "stripe"

const EFFECTS: { key: EffectKey; label: string; desc: string }[] = [
  { key: "conic",  label: "A. コーニック回転", desc: "corner lighthouse beam" },
  { key: "shadow", label: "B. シャドウパルス", desc: "box-shadow 黄グロー拍動" },
  { key: "spark",  label: "C. スパーク（黄）", desc: "SVG ホタル / glow なし" },
  { key: "stripe", label: "D. 走査線",          desc: "横ライン水平スキャン" },
]

// C: 黄色ホタル配置（perimeter のみ）
const SPARK_POS: { cx: number; cy: number; r: number; dur: number; delay: number }[] = [
  { cx: 10, cy: 18, r: 3.5, dur: 4.0, delay:  0.0 },
  { cx: 90, cy: 15, r: 4.0, dur: 3.5, delay: -1.2 },
  { cx: 7,  cy: 52, r: 3.0, dur: 4.5, delay: -2.4 },
  { cx: 93, cy: 60, r: 3.5, dur: 3.8, delay: -0.7 },
  { cx: 13, cy: 80, r: 3.0, dur: 4.2, delay: -3.1 },
  { cx: 87, cy: 78, r: 4.0, dur: 3.6, delay: -1.8 },
  { cx: 28, cy:  8, r: 3.0, dur: 4.8, delay: -2.9 },
  { cx: 72, cy: 90, r: 3.5, dur: 3.9, delay: -0.4 },
]

// B: シャドウパルス 配置（4 隅）
const SHADOW_POS: React.CSSProperties[] = [
  { top: "12%",    left:  "4%"  },
  { top: "10%",    right: "5%"  },
  { bottom: "18%", left:  "5%"  },
  { bottom: "15%", right: "4%"  },
]

// D: 走査線 3 本
const STRIPE_LINES: { dur: number; delay: string }[] = [
  { dur: 6.0, delay: "0s"    },
  { dur: 5.5, delay: "-2.0s" },
  { dur: 7.0, delay: "-4.5s" },
]

export default function HighEffectsPage() {
  if (process.env.NODE_ENV !== "development") notFound()
  const [active, setActive] = useState<EffectKey | null>(null)

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
    >

      {/* ベース: グリッドライン */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(67,217,191,0.07) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(67,217,191,0.07) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Effect A: コーニック回転 ─────────────────────────────── */}
      {active === "conic" && (
        <>
          {/* 左上コーナー beacon */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-260px", left: "-260px",
              width: "520px", height: "520px",
              borderRadius: "50%",
              background: "conic-gradient(from 0deg, transparent 0%, rgba(254,224,35,0.28) 14%, transparent 30%)",
              animation: "dev-spin 9s linear infinite",
              filter: "blur(3px)",
            }}
          />
          {/* 右下コーナー beacon（逆回転） */}
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: "-260px", right: "-260px",
              width: "520px", height: "520px",
              borderRadius: "50%",
              background: "conic-gradient(from 180deg, transparent 0%, rgba(254,224,35,0.28) 14%, transparent 30%)",
              animation: "dev-spin 12s linear infinite reverse",
              filter: "blur(3px)",
            }}
          />
        </>
      )}

      {/* ── Effect B: シャドウパルス ──────────────────────────────── */}
      {active === "shadow" && (
        <>
          {SHADOW_POS.map((pos, i) => (
            <div
              key={i}
              className="absolute pointer-events-none w-3 h-3 rounded-full"
              style={{
                ...pos,
                background: "#fee023",
                animation: `dev-shadow-pulse ${3.6 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${[-0.0, -1.5, -0.8, -2.3][i]}s`,
              }}
            />
          ))}
        </>
      )}

      {/* ── Effect C: スパーク（黄 ホタル） ──────────────────────── */}
      {active === "spark" && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {SPARK_POS.map((s, i) => (
            <circle
              key={i}
              className="svg-particle"
              cx={`${s.cx}%`}
              cy={`${s.cy}%`}
              r={s.r}
              fill="#fee023"
              style={{
                animation: `firefly-pulse ${s.dur}s ease-in-out infinite`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </svg>
      )}

      {/* ── Effect D: 走査線 ─────────────────────────────────────── */}
      {active === "stripe" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {STRIPE_LINES.map((l, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0, right: 0, height: "2px",
                background: "linear-gradient(to right, transparent, #fee023 25%, #fee023 75%, transparent)",
                opacity: 0.45,
                animation: `dev-stripe-scan ${l.dur}s linear infinite`,
                animationDelay: l.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* ── モック: result フェーズ コンテンツ ──────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-4 py-12">
        <div className="max-w-lg w-full space-y-4">

          {/* あなたはこんな人 (high テーマ) */}
          <div
            className="rounded-xl px-4 py-3 space-y-1"
            style={{ background: "rgba(254,224,35,0.07)", border: "1px solid rgba(254,224,35,0.35)" }}
          >
            <p className="text-xs font-bold tracking-wide text-volt-yellow">キミはこんな人</p>
            <p className="text-white text-sm">
              テンション高めで、クールで盛り上がる曲を楽しみたいタイプ。
            </p>
          </div>

          <p className="text-sm font-semibold text-volt-muted">だから、こんな曲がぴったり ↓</p>

          {/* 曲カード × 3 (デモ) */}
          {[
            { rank: 1, title: "ボルテッカー",   artist: "DECO*27",   best: true  },
            { rank: 2, title: "電撃ガールズ",   artist: "syudou",    best: false },
            { rank: 3, title: "VOLT TACKLING", artist: "ナユタン星人", best: false },
          ].map(({ rank, title, artist, best }) => (
            <div
              key={rank}
              className="rounded-xl p-4 border-2"
              style={{
                background: "#111111",
                borderColor: rank === 1 ? "#fee023" : rank <= 3 ? "#43d9bf" : "#2a2a2a",
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-bold text-white">{title}</p>
                  <p className="text-xs text-volt-muted mt-0.5">{artist}</p>
                </div>
                {best && (
                  <span className="shrink-0 text-xs font-bold px-2 py-1 rounded-lg bg-volt-yellow/20 text-volt-yellow">
                    BEST
                  </span>
                )}
              </div>
              <div className="volt-embed-frame w-full">
                <div className="vef-glow" />
                <div className="vef-dark" />
                <div className="vef-white" />
                <div className="vef-line" />
                <div className="vef-inner bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600/80 flex items-center justify-center">
                    <span className="text-white text-xl ml-1">▶</span>
                  </div>
                  <span className="absolute bottom-2 right-2 text-xs text-white/40">縁取りアニメ (sandbox)</span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ── フローティング選択パネル ─────────────────────────────── */}
      <div
        className="fixed bottom-4 right-4 z-50 rounded-xl p-4 space-y-3"
        style={{
          background: "rgba(0,0,0,0.85)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          minWidth: "220px",
        }}
      >
        <p className="text-xs font-bold text-volt-yellow tracking-wider">High エネルギー エフェクト</p>
        {EFFECTS.map((e) => (
          <label key={e.key} className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="effect"
              checked={active === e.key}
              onChange={() => setActive(e.key)}
              className="w-3.5 h-3.5 mt-0.5 accent-[#fee023]"
            />
            <div>
              <span className="text-sm text-white group-hover:text-volt-yellow transition-colors">
                {e.label}
              </span>
              <span className="text-xs text-volt-muted ml-1.5">{e.desc}</span>
            </div>
          </label>
        ))}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="radio"
            name="effect"
            checked={active === null}
            onChange={() => setActive(null)}
            className="w-3.5 h-3.5 accent-[#fee023]"
          />
          <span className="text-sm text-volt-muted group-hover:text-white transition-colors">
            なし（ベースのみ）
          </span>
        </label>
        <div className="pt-1 border-t border-white/10 flex gap-3">
          <Link href="/dev" className="text-xs text-volt-muted hover:text-white transition-colors">
            ← dev
          </Link>
          <Link href="/recommend" className="text-xs text-volt-muted hover:text-white transition-colors">
            recommend →
          </Link>
        </div>
      </div>

    </main>
  )
}
