"use client"

/**
 * /dev/bg-effects
 *
 * /recommend 背景エフェクトの比較・試着ページ（開発専用）
 *
 * 4つのエフェクトを個別にON/OFFして外観を確認できる。
 *   A. グリッドライン  — うっすら格子模様
 *   B. ドット散布     — volt色の小粒子が散る
 *   C. 2カラム(PC)   — 左にサイドパネル（デスクトップのみ有効）
 *   D. 光彩グロー     — コンテンツ列の背後に放射グロー
 */

import { notFound } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

type EffectKey = "grid" | "dots" | "twocol" | "glow"

const EFFECTS: { key: EffectKey; label: string; desc: string }[] = [
  { key: "grid",   label: "A. グリッドライン", desc: "うっすら格子模様" },
  { key: "dots",   label: "B. ドット散布",     desc: "volt色の小粒子" },
  { key: "twocol", label: "C. 2カラム(PC)",    desc: "左サイドパネル" },
  { key: "glow",   label: "D. 光彩グロー",     desc: "放射グロー" },
]

// Effect B — 散布ドット座標（% 単位）
const DOTS: { x: number; y: number; r: number; color: string; op: number }[] = [
  { x: 4,  y: 8,  r: 1.5, color: "#fee023", op: 0.35 },
  { x: 94, y: 6,  r: 1,   color: "#43d9bf", op: 0.40 },
  { x: 11, y: 28, r: 2,   color: "#43d9bf", op: 0.18 },
  { x: 89, y: 42, r: 1.5, color: "#fee023", op: 0.22 },
  { x: 2,  y: 58, r: 1,   color: "#43d9bf", op: 0.30 },
  { x: 97, y: 63, r: 2,   color: "#fee023", op: 0.14 },
  { x: 6,  y: 80, r: 1,   color: "#fee023", op: 0.28 },
  { x: 93, y: 83, r: 1.5, color: "#43d9bf", op: 0.32 },
  { x: 19, y: 94, r: 1,   color: "#fee023", op: 0.20 },
  { x: 79, y: 20, r: 1,   color: "#43d9bf", op: 0.24 },
  { x: 34, y: 3,  r: 1.5, color: "#fee023", op: 0.28 },
  { x: 66, y: 97, r: 1,   color: "#43d9bf", op: 0.38 },
  { x: 1,  y: 48, r: 1.5, color: "#43d9bf", op: 0.14 },
  { x: 99, y: 32, r: 1,   color: "#fee023", op: 0.20 },
  { x: 50, y: 1,  r: 1.5, color: "#43d9bf", op: 0.28 },
  { x: 50, y: 99, r: 1,   color: "#fee023", op: 0.22 },
  { x: 25, y: 16, r: 1,   color: "#43d9bf", op: 0.20 },
  { x: 73, y: 74, r: 1.5, color: "#fee023", op: 0.18 },
  { x: 15, y: 52, r: 1,   color: "#fee023", op: 0.15 },
  { x: 84, y: 90, r: 1,   color: "#43d9bf", op: 0.25 },
]

// カードスタイル（recommend/page.tsx と同一）
const CARD_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "20px",
  overflow: "hidden",
}

const TOP_BAR: React.CSSProperties = {
  height: "3px",
  background: "linear-gradient(to right, #fee023, #43d9bf)",
}

// サンプル選択状態（デモ用固定）
const CHIP_SELECTED = new Set([0, 2])

export default function BgEffectsPage() {
  if (process.env.NODE_ENV !== "development") notFound()
  const [active, setActive] = useState<Set<EffectKey>>(new Set())

  const on = (key: EffectKey) => active.has(key)

  function toggle(key: EffectKey) {
    setActive((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // ── サンプルコンテンツ（Q2 デモ） ──────────────────────────────
  const mainContent = (
    <div className="max-w-lg w-full space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <Image
            src="/logos/pv18_logo_header_w400.png"
            alt="PersonaVOLT18"
            width={200}
            height={42}
            priority
          />
        </div>
        <p className="text-xs tracking-widest text-volt-muted">
          - Voc<span className="text-volt-cyan">@</span>loid Songs Recommend -
        </p>
        <div
          className="volt-spark-bar mx-auto"
          style={{
            height: "1px",
            width: "80%",
            background: "linear-gradient(to right, transparent, #fee023 8%, #43d9bf 92%, transparent)",
          }}
        />
      </div>

      {/* プログレス */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`rounded-full transition-all ${
              s === 2
                ? "w-8 h-1.5 bg-volt-yellow"
                : s < 2
                ? "w-2 h-1.5 bg-volt-yellow/40"
                : "w-2 h-1.5 bg-volt-edge"
            }`}
          />
        ))}
      </div>

      {/* Q2 サンプルカード */}
      <div style={CARD_STYLE}>
        <div style={TOP_BAR} />
        <div className="p-5 space-y-4">
          <h2 className="text-base font-bold" style={{ color: "#0F172A" }}>
            Q2. 聞きたい雰囲気は？
            <span className="text-sm font-normal ml-1" style={{ color: "#64748b" }}>（複数選択可）</span>
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {["明るい", "クール", "エモい", "かわいい", "盛り上がる", "独特"].map((label, i) => (
              <button
                key={label}
                className="px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  border: `1px solid ${CHIP_SELECTED.has(i) ? "#43d9bf" : "rgba(15,23,42,0.12)"}`,
                  background: CHIP_SELECTED.has(i) ? "rgba(67,217,191,0.18)" : "rgba(15,23,42,0.04)",
                  color: "#0F172A",
                  outline: CHIP_SELECTED.has(i) ? "2px solid rgba(67,217,191,0.35)" : "none",
                  outlineOffset: "-1px",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button className="px-8 py-2.5 bg-volt-yellow text-black font-bold rounded-xl">
              次へ →
            </button>
          </div>
        </div>
      </div>

      {/* 2枚目カード（ページの高さ感を出すため） */}
      <div
        className="rounded-xl p-4 border-2 border-volt-yellow"
        style={{ background: "#111111" }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-bold text-white">ボルテッカー</p>
            <p className="text-xs text-volt-muted mt-0.5">DECO*27</p>
          </div>
          <span className="shrink-0 text-xs font-bold px-2 py-1 rounded-lg bg-volt-yellow/20 text-volt-yellow">
            BEST
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {["テンション高め", "明るい", "クール"].map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-volt-cyan/40 text-volt-cyan">
              {t}
            </span>
          ))}
        </div>
        <div
          className="relative w-full rounded-lg overflow-hidden flex items-center justify-center bg-black/40"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="w-14 h-14 rounded-full bg-red-600/80 flex items-center justify-center">
            <span className="text-white text-2xl ml-1">▶</span>
          </div>
          <span className="absolute bottom-2 right-2 text-xs text-white/50">サムネ (demo)</span>
        </div>
      </div>
    </div>
  )

  // ── Effect C: サイドパネル ────────────────────────────────────
  const sidePanel = (
    <div className="hidden lg:flex flex-col justify-center gap-6 pl-4 pr-8">
      <div className="space-y-2">
        <p className="text-volt-yellow text-xs font-bold tracking-widest uppercase">Project Voltage</p>
        <p className="text-white font-semibold text-lg leading-snug">
          ポケモン × 初音ミク<br />公式コラボ楽曲
        </p>
        <p className="text-volt-muted text-sm leading-relaxed">
          25曲以上のオリジナル楽曲から<br />
          今の気分にぴったりの1曲を見つけよう
        </p>
      </div>
      <div className="volt-divider" />
      <ul className="space-y-2 text-volt-muted text-sm">
        {[
          "4問・約1分で完了",
          "エネルギー・雰囲気で絞り込み",
          "YouTube でその場で試聴",
        ].map((t) => (
          <li key={t} className="flex items-start gap-2">
            <span className="text-volt-cyan mt-0.5">▸</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
    >

      {/* Effect A: グリッドライン（dev: 強め表示） */}
      {on("grid") && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              "linear-gradient(rgba(67,217,191,0.18) 1px, transparent 1px)",
              "linear-gradient(90deg, rgba(67,217,191,0.18) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "48px 48px",
          }}
        />
      )}

      {/* Effect B: ドット散布（dev: 大きめ・高opacity） */}
      {on("dots") && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          {DOTS.map((d, i) => (
            <circle
              key={i}
              cx={`${d.x}%`}
              cy={`${d.y}%`}
              r={d.r * 3}
              fill={d.color}
              opacity={Math.min(d.op * 2.5, 0.85)}
            />
          ))}
        </svg>
      )}

      {/* Effect D: 光彩グロー（dev: 強め表示） */}
      {on("glow") && (
        <div
          className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "700px",
            height: "900px",
            background:
              "radial-gradient(ellipse at center, rgba(67,217,191,0.35) 0%, rgba(254,224,35,0.18) 45%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      )}

      {/* Effect C: 2カラム / 通常レイアウト */}
      {on("twocol") ? (
        <div className="relative z-10 min-h-screen lg:grid lg:grid-cols-[1fr_minmax(0,512px)_1fr] lg:items-start lg:pt-12 flex flex-col items-center px-4 py-12">
          {sidePanel}
          <div className="flex justify-center w-full">
            {mainContent}
          </div>
          <div className="hidden lg:block" />
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center px-4 py-12">
          {mainContent}
        </div>
      )}

      {/* フローティングトグルパネル */}
      <div
        className="fixed bottom-4 right-4 z-50 rounded-xl p-4 space-y-3"
        style={{
          background: "rgba(0,0,0,0.85)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          minWidth: "200px",
        }}
      >
        <p className="text-xs font-bold text-volt-yellow tracking-wider">背景エフェクト</p>
        {EFFECTS.map((e) => (
          <label key={e.key} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={on(e.key)}
              onChange={() => toggle(e.key)}
              className="w-3.5 h-3.5 accent-[#fee023]"
            />
            <div>
              <span className="text-sm text-white group-hover:text-volt-yellow transition-colors">
                {e.label}
              </span>
              <span className="text-xs text-volt-muted ml-1.5">{e.desc}</span>
            </div>
          </label>
        ))}
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
