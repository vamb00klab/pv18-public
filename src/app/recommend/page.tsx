"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import PageHeader from "@/components/PageHeader"
import { SongLinkButtons } from "@/components/SongLinkButtons"
import { SONGS } from "@/data/songs"
import { recommend } from "@/lib/recommend"
import { appConfig } from "@/lib/config"
import { buildFeatStr } from "@/lib/vocaloidLabels"
import { isNewSong } from "@/lib/songUtils"
import type { Feel, PokemonContext, PkmnGenGroup, VocaloidPref, RecommendQuery, Song } from "@/types/song"
import type { ScoredSong } from "@/lib/recommend"

/**
 * ステップ番号（1〜total）に応じて volt-yellow → volt-cyan を補間した hex カラーを返す。
 * volt-yellow: #fee023 / volt-cyan: #43d9bf
 */
function stepAccent(s: number, total: number): string {
  const t = total > 1 ? (s - 1) / (total - 1) : 0
  const r = Math.round(0xfe + t * (0x43 - 0xfe))
  const g = Math.round(0xe0 + t * (0xd9 - 0xe0))
  const b = Math.round(0x23 + t * (0xbf - 0x23))
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

/**
 * Project VOLTAGE 公式プレイリスト URL
 * 空文字のままにするとリンクを非表示。URL 確定後に設定。
 */
const OFFICIAL_PLAYLIST_URL = ""

// ---- 選択肢定義 ----

/** Q1: 感情反応（taxonomy v2 Category 3）複数選択・6択・2×3グリッド */
const FEEL_OPTIONS: { value: Feel; label: string }[] = [
  { value: "感動/泣ける",    label: "感動・泣ける" },
  { value: "懐かしい",       label: "懐かしい" },
  { value: "かわいい",       label: "かわいい" },
  { value: "かっこいい",     label: "かっこいい" },
  { value: "チル/癒し",      label: "チル・癒し" },
  { value: "疾走感/ノリ",    label: "疾走感・ノリ" },
]

/** Q2: ノリ感・中毒性（単一選択）
 *  "addictive" を選んだ場合は中毒性/リピート feel を effectiveFeels に追加する。
 */
type TempoChoice = "addictive" | "normal" | "any"
const TEMPO_OPTIONS: { value: TempoChoice; label: string; desc: string }[] = [
  { value: "addictive", label: "中毒性・ループしたい", desc: "ついリピートしてしまう曲が好き" },
  { value: "normal",    label: "普通に聴きたい",       desc: "テンポはこだわらない" },
  { value: "any",       label: "どちらでもOK",         desc: "気にしない" },
]

/** Q3: ポケモン体験文脈（taxonomy v2 Category 1 の体験型5択・スキップボタン付き）
 *  各選択肢が pokemon_context タグに展開される。
 *  世代記憶系3タグは Q3 選択肢に出さず Q4（pokemon_gen）が担う。
 */
type ContextChoice = { id: string; label: string; contexts: PokemonContext[] }
const CONTEXT_CHOICES: ContextChoice[] = [
  { id: "battle",  label: "バトル・対戦の熱さ",  contexts: ["ゲーム体験/対戦・戦術", "ライバル・チャンピオン文脈"] },
  { id: "travel",  label: "旅と仲間との冒険",    contexts: ["旅と冒険/旅立ち・道中"] },
  { id: "bond",    label: "相棒との絆",          contexts: ["相棒と絆/関係深化"] },
  { id: "anime",   label: "アニポケの思い出",     contexts: ["アニポケ参照"] },
  { id: "effects", label: "ゲームの演出・音響",   contexts: ["ゲーム体験/演出・SE・UI"] },
]

/** Q4: ポケモン世代（複数選択・スキップボタン付き） */
const GEN_OPTIONS: { value: PkmnGenGroup; label: string; desc: string }[] = [
  { value: "gen1-2", label: "赤・緑・青 / 金・銀 世代",            desc: "赤・緑・青・ピカチュウ版 / 金・銀・クリスタル" },
  { value: "gen3-5", label: "ルビサファ〜ブラック・ホワイト 世代",  desc: "ルビサファ・エメラルド / ダイパ・プラチナ / ブラック・ホワイト" },
  { value: "gen6+",  label: "X・Y〜スカーレット・バイオレット 世代", desc: "X・Y / サン・ムーン / ソード・シールド / スカーレット・バイオレット / Z-A" },
]

/** Q5: ボーカロイドキャラクター（複数選択・スキップボタン付き） */
const VOCALOID_OPTIONS: { value: VocaloidPref; label: string; desc: string }[] = [
  { value: "miku",    label: "初音ミク",         desc: "ミクの声で聴きたい" },
  { value: "rin_len", label: "鏡音リン / レン",  desc: "リンかレン参加曲" },
  { value: "luka",    label: "巡音ルカ",         desc: "ルカの深みある声で" },
]


// ---- 背景パーティクル定義 ----

const FLOAT_ANIMS = ["dot-float-a", "dot-float-b", "dot-float-c"] as const

/** 浮遊ドット（小・画面端寄り） */
const BG_DOTS: { x: number; y: number; r: number; color: string; dur: number; delay: number }[] = [
  { x: 4,  y: 12, r: 1.5, color: "#43d9bf", dur: 12, delay: 0    },
  { x: 94, y: 8,  r: 1,   color: "#fee023", dur: 14, delay: -3.2 },
  { x: 7,  y: 44, r: 1,   color: "#43d9bf", dur: 11, delay: -6.8 },
  { x: 96, y: 38, r: 1.5, color: "#fee023", dur: 13, delay: -1.5 },
  { x: 3,  y: 72, r: 1,   color: "#43d9bf", dur: 15, delay: -9.1 },
  { x: 93, y: 78, r: 1.5, color: "#fee023", dur: 10, delay: -4.7 },
  { x: 22, y: 6,  r: 1,   color: "#fee023", dur: 13, delay: -2.3 },
  { x: 76, y: 94, r: 1,   color: "#43d9bf", dur: 12, delay: -7.6 },
  { x: 11, y: 88, r: 1.5, color: "#43d9bf", dur: 14, delay: -5.0 },
  { x: 88, y: 56, r: 1,   color: "#fee023", dur: 11, delay: -8.4 },
  { x: 48, y: 3,  r: 1,   color: "#43d9bf", dur: 16, delay: -1.1 },
  { x: 55, y: 97, r: 1.5, color: "#fee023", dur: 13, delay: -10.2},
]

/** ホタル（中・うっすらグロー） */
const BG_FIREFLIES: { x: number; y: number; r: number; color: string; dur: number; delay: number }[] = [
  { x: 8,  y: 22, r: 3,   color: "#43d9bf", dur: 6,  delay: 0    },
  { x: 91, y: 18, r: 3.5, color: "#fee023", dur: 7,  delay: -1.8 },
  { x: 5,  y: 58, r: 2.5, color: "#43d9bf", dur: 8,  delay: -3.5 },
  { x: 94, y: 62, r: 3,   color: "#fee023", dur: 6,  delay: -0.9 },
  { x: 12, y: 80, r: 3,   color: "#43d9bf", dur: 7,  delay: -5.2 },
  { x: 87, y: 84, r: 2.5, color: "#fee023", dur: 9,  delay: -2.6 },
  { x: 2,  y: 40, r: 3.5, color: "#43d9bf", dur: 6,  delay: -4.1 },
  { x: 97, y: 45, r: 3,   color: "#fee023", dur: 8,  delay: -6.7 },
]

// ---- 結果フェーズ: feels 別エフェクトパーティクル ----

/** Emotional (感動/泣ける・懐かしい): シアン大型ホタル */
const EMOTIONAL_PULSES: { x: number; y: number; r: number; dur: number; delay: number }[] = [
  { x: 10, y: 28, r: 5.5, dur: 5, delay: 0    },
  { x: 89, y: 24, r: 6,   dur: 6, delay: -2.1 },
  { x: 7,  y: 64, r: 4.5, dur: 5, delay: -3.5 },
  { x: 92, y: 68, r: 5,   dur: 7, delay: -1.0 },
]

/** Chill (チル/癒し): 紫の霧・ゆっくり落下 */
const CHILL_SNOW: { x: number; y: number; r: number; dur: number; delay: number }[] = [
  { x: 8,  y: 3,  r: 2.5, dur: 12, delay: 0    },
  { x: 25, y: 5,  r: 1.5, dur: 14, delay: -3.2 },
  { x: 42, y: 2,  r: 2,   dur: 11, delay: -5.8 },
  { x: 60, y: 4,  r: 1.5, dur: 13, delay: -1.5 },
  { x: 78, y: 3,  r: 2,   dur: 15, delay: -8.1 },
  { x: 15, y: 1,  r: 1.5, dur: 12, delay: -4.4 },
  { x: 35, y: 6,  r: 2.5, dur: 10, delay: -2.1 },
  { x: 55, y: 2,  r: 1.5, dur: 14, delay: -7.6 },
  { x: 72, y: 5,  r: 2,   dur: 11, delay: -0.9 },
  { x: 88, y: 3,  r: 1.5, dur: 13, delay: -6.3 },
  { x: 3,  y: 4,  r: 2,   dur: 15, delay: -3.7 },
  { x: 93, y: 6,  r: 2.5, dur: 12, delay: -9.2 },
]

/** feels から結果背景エフェクトモードを導出 */
function deriveBgMode(feels: Feel[]): "emotional" | "chill" | null {
  if (feels.includes("チル/癒し")) return "chill"
  if (feels.includes("感動/泣ける") || feels.includes("懐かしい")) return "emotional"
  return null
}

// ---- スタイル定数（白カード用） ----

const CARD_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "20px",
  overflow: "hidden",
}

const TOP_BAR_STYLE: React.CSSProperties = {
  height: "3px",
  background: "linear-gradient(to right, #fee023, #43d9bf)",
}

function optionStyleCyan(selected: boolean): React.CSSProperties {
  return {
    borderStyle: "solid",
    borderLeftWidth: "4px",
    borderTopWidth: "1px",
    borderRightWidth: "1px",
    borderBottomWidth: "1px",
    borderLeftColor: selected ? "#43d9bf" : "rgba(67,217,191,0.35)",
    borderTopColor: selected ? "rgba(67,217,191,0.25)" : "rgba(15,23,42,0.10)",
    borderRightColor: selected ? "rgba(67,217,191,0.25)" : "rgba(15,23,42,0.10)",
    borderBottomColor: selected ? "rgba(67,217,191,0.25)" : "rgba(15,23,42,0.10)",
    background: selected ? "rgba(67,217,191,0.18)" : "rgba(15,23,42,0.04)",
    color: "#0F172A",
  }
}

function chipStyleCyan(selected: boolean): React.CSSProperties {
  return {
    border: "1px solid",
    borderColor: selected ? "#43d9bf" : "rgba(15,23,42,0.12)",
    background: selected ? "rgba(67,217,191,0.18)" : "rgba(15,23,42,0.04)",
    color: "#0F172A",
    outline: selected ? "2px solid rgba(67,217,191,0.35)" : "none",
    outlineOffset: "-1px",
  }
}

// ---- プロフィールカードテーマ（feels → 色）----

type ProfileTheme = {
  accent: string
  bg: string
}

const FEEL_THEME: Record<Feel, ProfileTheme> = {
  "感動/泣ける":    { accent: "#fc637f", bg: "#FFF0F3" },
  "懐かしい":       { accent: "#a78bfa", bg: "#F3F0FE" },
  "かわいい":       { accent: "#feb1fd", bg: "#FEF0FE" },
  "かっこいい":     { accent: "#43d9bf", bg: "#EDF9F7" },
  "チル/癒し":      { accent: "#43d9bf", bg: "#EDF9F7" },
  "疾走感/ノリ":    { accent: "#fee023", bg: "#FFFCE8" },
  "中毒性/リピート": { accent: "#ff612c", bg: "#FFF2EE" },
}

/** テーマ選択の優先順位（特徴的な順） */
const FEEL_PRIORITY: Feel[] = ["疾走感/ノリ", "中毒性/リピート", "かっこいい", "かわいい", "感動/泣ける", "チル/癒し", "懐かしい"]

const FEEL_LABEL: Record<Feel, string> = Object.fromEntries(
  [...FEEL_OPTIONS, { value: "中毒性/リピート" as Feel, label: "中毒性・リピート" }].map((o) => [o.value, o.label])
) as Record<Feel, string>

function getProfileTheme(query: RecommendQuery): ProfileTheme {
  for (const feel of FEEL_PRIORITY) {
    if (query.feels.includes(feel)) return FEEL_THEME[feel]
  }
  return { accent: "#fee023", bg: "#FFFCE8" }
}

function buildUserSummary(query: RecommendQuery): string {
  const feelAdj: Record<Feel, string> = {
    "感動/泣ける":    "感動系の",
    "懐かしい":       "懐かしい",
    "かわいい":       "かわいい",
    "かっこいい":     "かっこいい",
    "チル/癒し":      "チル・癒し系の",
    "疾走感/ノリ":    "疾走感のある",
    "中毒性/リピート": "中毒性のある",
  }
  if (query.feels.length === 0) {
    return "今の気分にぴったりの曲をお求め気分のキミへ"
  }
  const feelText = query.feels.map((f) => feelAdj[f]).join("・")
  return `${feelText}曲をお求め気分のキミへ`
}

// ---- コンポーネント ----

export default function RecommendPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | "result">(1)
  const [feels, setFeels] = useState<Feel[]>([])
  const [tempoChoice, setTempoChoice] = useState<TempoChoice | null>(null)
  const [contextChoices, setContextChoices] = useState<string[]>([])
  const [genChoices, setGenChoices] = useState<PkmnGenGroup[]>([])
  const [vocaloidChoices, setVocaloidChoices] = useState<VocaloidPref[]>([])
  const [results, setResults] = useState<ScoredSong[]>([])
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [currentQuery, setCurrentQuery] = useState<RecommendQuery | null>(null)
  const [copiedShare, setCopiedShare] = useState(false)

  function toggleFeel(f: Feel) {
    setFeels((prev) => {
      if (prev.includes(f)) return prev.filter((x) => x !== f)
      if (prev.length >= 3) return prev
      return [...prev, f]
    })
  }

  function toggleContext(id: string) {
    setContextChoices((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  function toggleGen(g: PkmnGenGroup) {
    setGenChoices((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }

  function toggleVocaloid(v: VocaloidPref) {
    setVocaloidChoices((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }

  /** vocaloidOverride: スキップ時に [] を渡すことで state 非同期問題を回避 */
  function handleSubmit(vocaloidOverride?: VocaloidPref[]) {
    const effectiveFeels: Feel[] = [...feels]
    if (tempoChoice === "addictive") {
      effectiveFeels.push("中毒性/リピート")
    }

    const allContextTags: PokemonContext[] = []
    for (const choiceId of contextChoices) {
      const choice = CONTEXT_CHOICES.find((c) => c.id === choiceId)
      if (choice) allContextTags.push(...choice.contexts)
    }

    const effectiveVocaloids = vocaloidOverride ?? vocaloidChoices

    const query: RecommendQuery = {
      feels: effectiveFeels,
      pokemon_context: allContextTags.length > 0 ? allContextTags : undefined,
      pokemon_gen: genChoices.length > 0 ? genChoices : undefined,
      vocaloid_pref: effectiveVocaloids.length > 0 ? effectiveVocaloids : undefined,
    }
    setCurrentQuery(query)
    setResults(recommend(SONGS, query))
    setStep("result")
  }

  function reset() {
    setStep(1)
    setFeels([])
    setTempoChoice(null)
    setContextChoices([])
    setGenChoices([])
    setVocaloidChoices([])
    setCurrentQuery(null)
    setResults([])
    setActiveVideoId(null)
    setCopiedShare(false)
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
    >

      {/* 背景レイヤー 1: グリッドライン */}
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

      {/* 背景レイヤー 2: 浮遊ドット + ホタル */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="ff-glow-cyan" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ff-glow-yellow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* 浮遊ドット */}
        {BG_DOTS.map((d, i) => (
          <circle
            key={`dot-${i}`}
            className="svg-particle"
            cx={`${d.x}%`}
            cy={`${d.y}%`}
            r={d.r}
            fill={d.color}
            opacity={0.55}
            style={{
              animation: `${FLOAT_ANIMS[i % 3]} ${d.dur}s ease-in-out infinite`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}

        {/* ホタル */}
        {BG_FIREFLIES.map((f, i) => (
          <circle
            key={`ff-${i}`}
            className="svg-particle"
            cx={`${f.x}%`}
            cy={`${f.y}%`}
            r={f.r}
            fill={f.color}
            filter={f.color === "#43d9bf" ? "url(#ff-glow-cyan)" : "url(#ff-glow-yellow)"}
            style={{
              animation: `firefly-pulse ${f.dur}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </svg>

      {/* 背景レイヤー 3: 結果フェーズ feels 別エフェクト */}
      {step === "result" && currentQuery && (() => {
        const bgMode = deriveBgMode(currentQuery.feels)
        if (!bgMode) return null
        return (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="res-glow-cyan" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="res-glow-purple" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Emotional: シアン大型ホタル */}
            {bgMode === "emotional" && EMOTIONAL_PULSES.map((m, i) => (
              <circle
                key={`em-${i}`}
                className="svg-particle"
                cx={`${m.x}%`}
                cy={`${m.y}%`}
                r={m.r}
                fill="#43d9bf"
                filter="url(#res-glow-cyan)"
                style={{
                  animation: `firefly-pulse ${m.dur}s ease-in-out infinite`,
                  animationDelay: `${m.delay}s`,
                }}
              />
            ))}

            {/* Chill: 紫の霧・落下 */}
            {bgMode === "chill" && CHILL_SNOW.map((n, i) => (
              <circle
                key={`chill-${i}`}
                className="svg-particle"
                cx={`${n.x}%`}
                cy={`${n.y}%`}
                r={n.r}
                fill="#a78bfa"
                filter="url(#res-glow-purple)"
                style={{
                  animation: `snow-fall ${n.dur}s linear infinite`,
                  animationDelay: `${n.delay}s`,
                }}
              />
            ))}
          </svg>
        )
      })()}

      <div className="relative z-10 flex flex-col items-center px-4 py-12">

      <div className="max-w-lg w-full space-y-6 page-enter">

        {/* ヘッダー */}
        <PageHeader subLabel={<>- Voc<span className="text-volt-cyan">@</span>loid Songs Recommend -</>} />

        {/* ステッププログレス */}
        {typeof step === "number" && (
          <div className="flex items-center justify-center gap-2">
            {([1, 2, 3, 4, 5] as const).map((s) => {
              const color = stepAccent(s, 5)
              return (
                <div
                  key={s}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                  style={
                    s === step
                      ? { backgroundColor: color, color: "#0F172A" }
                      : s < step
                      ? { backgroundColor: color + "33", color }
                      : { backgroundColor: "#2a2a2a", color: "#8891a4" }
                  }
                >
                  {s}
                </div>
              )
            })}
          </div>
        )}

        {/* Step 1: 感情反応（複数選択・6択・2×3グリッド） */}
        {step === 1 && (
          <div style={CARD_STYLE}>
            <div style={TOP_BAR_STYLE} />
            <div className="p-5 space-y-4">
              <h2 className="text-base font-bold" style={{ color: "#0F172A" }}>
                Q1. 今聴くならどんな雰囲気の曲がいい？
                <span className="text-sm font-normal ml-1" style={{ color: feels.length >= 3 ? "#dc2626" : "#64748b" }}>
                  （{feels.length}/3 まで）
                </span>
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {FEEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    aria-pressed={feels.includes(opt.value)}
                    onClick={() => toggleFeel(opt.value)}
                    className="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={chipStyleCyan(feels.includes(opt.value))}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={feels.length === 0}
                  className="px-8 py-2.5 bg-volt-yellow text-black font-bold rounded-xl disabled:opacity-40 transition-opacity"
                >
                  次へ →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: ノリ感・中毒性（単一選択・必須） */}
        {step === 2 && (
          <div style={CARD_STYLE}>
            <div style={TOP_BAR_STYLE} />
            <div className="p-5 space-y-4">
              <h2 className="text-base font-bold" style={{ color: "#0F172A" }}>
                Q2. 曲のノリ感は？
              </h2>
              <div className="space-y-2">
                {TEMPO_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    aria-pressed={tempoChoice === opt.value}
                    onClick={() => setTempoChoice(opt.value)}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all duration-150"
                    style={optionStyleCyan(tempoChoice === opt.value)}
                  >
                    <span className="text-base font-semibold">{opt.label}</span>
                    <span className="block text-sm mt-0.5" style={{ color: "#64748b" }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(3)}
                  disabled={tempoChoice === null}
                  className="px-8 py-2.5 bg-volt-yellow text-black font-bold rounded-xl disabled:opacity-40 transition-opacity"
                >
                  次へ →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: ポケモン体験文脈（複数選択・スキップボタン付き） */}
        {step === 3 && (
          <div style={CARD_STYLE}>
            <div style={TOP_BAR_STYLE} />
            <div className="p-5 space-y-4">
              <h2 className="text-base font-bold" style={{ color: "#0F172A" }}>
                Q3. ポケモン体験で好きなのは？
                <span className="text-sm font-normal ml-1" style={{ color: "#64748b" }}>（複数OK）</span>
              </h2>
              <div className="space-y-2">
                {CONTEXT_CHOICES.map((opt) => (
                  <button
                    key={opt.id}
                    aria-pressed={contextChoices.includes(opt.id)}
                    onClick={() => toggleContext(opt.id)}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all duration-150"
                    style={optionStyleCyan(contextChoices.includes(opt.id))}
                  >
                    <span className="text-base font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => { setContextChoices([]); setStep(4) }}
                  disabled={contextChoices.length > 0}
                  className="text-sm px-4 py-2 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={optionStyleCyan(contextChoices.length === 0)}
                >
                  こだわりなし →
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-8 py-2.5 bg-volt-yellow text-black font-bold rounded-xl disabled:opacity-40 transition-opacity"
                  disabled={contextChoices.length === 0}
                >
                  次へ →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: ポケモン世代（複数選択・スキップボタン） */}
        {step === 4 && (
          <div style={CARD_STYLE}>
            <div style={TOP_BAR_STYLE} />
            <div className="p-5 space-y-4">
              <h2 className="text-base font-bold" style={{ color: "#0F172A" }}>
                Q4. プレイしたことのあるシリーズは？
                <span className="text-sm font-normal ml-1" style={{ color: "#64748b" }}>（複数OK）</span>
              </h2>
              <div className="space-y-2">
                {GEN_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    aria-pressed={genChoices.includes(opt.value)}
                    onClick={() => toggleGen(opt.value)}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all duration-150"
                    style={optionStyleCyan(genChoices.includes(opt.value))}
                  >
                    <span className="text-base font-semibold">{opt.label}</span>
                    <span className="block text-sm mt-0.5" style={{ color: "#64748b" }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => { setGenChoices([]); setStep(5) }}
                  disabled={genChoices.length > 0}
                  className="text-sm px-4 py-2 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={optionStyleCyan(genChoices.length === 0)}
                >
                  こだわりなし →
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-8 py-2.5 bg-volt-yellow text-black font-bold rounded-xl disabled:opacity-40 transition-opacity"
                  disabled={genChoices.length === 0}
                >
                  次へ →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: ボーカロイドキャラクター（複数選択・スキップボタン） */}
        {step === 5 && (
          <div style={CARD_STYLE}>
            <div style={TOP_BAR_STYLE} />
            <div className="p-5 space-y-4">
              <h2 className="text-base font-bold" style={{ color: "#0F172A" }}>
                Q5. 好きなキャラクターは？
                <span className="text-sm font-normal ml-1" style={{ color: "#64748b" }}>（複数OK）</span>
              </h2>
              <div className="space-y-2">
                {VOCALOID_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    aria-pressed={vocaloidChoices.includes(opt.value)}
                    onClick={() => toggleVocaloid(opt.value)}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all duration-150"
                    style={optionStyleCyan(vocaloidChoices.includes(opt.value))}
                  >
                    <span className="text-base font-semibold">{opt.label}</span>
                    <span className="block text-sm mt-0.5" style={{ color: "#64748b" }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => handleSubmit([])}
                  disabled={vocaloidChoices.length > 0}
                  className="text-sm px-4 py-2 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={optionStyleCyan(vocaloidChoices.length === 0)}
                >
                  こだわりなし →
                </button>
                <button
                  onClick={() => handleSubmit()}
                  disabled={vocaloidChoices.length === 0}
                  className="px-8 py-2.5 bg-volt-yellow text-black font-bold rounded-xl disabled:opacity-40 transition-opacity"
                >
                  結果を見る →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {step === "result" && (
          <div className="space-y-4">

            {/* あなたはこんな人 */}
            {currentQuery && (() => {
              const theme = getProfileTheme(currentQuery)
              return (
                <div
                  className="rounded-2xl shadow-sm"
                  style={{
                    backgroundColor: theme.bg,
                    borderTop: `3px solid ${theme.accent}`,
                  }}
                >
                  <div className="p-4">
                    <p className="text-sm leading-relaxed" style={{ color: "#334155" }}>{buildUserSummary(currentQuery)}</p>
                  </div>
                </div>
              )
            })()}

            {results.length > 0 && (
              <p className="text-sm font-bold" style={{ color: "#fee023" }}>
                ⚡ まず1曲、聴いてみて
              </p>
            )}
            {results.length === 0 ? (
              <p className="text-volt-muted text-sm">マッチする曲が見つかりませんでした。</p>
            ) : (
              results.map(({ song, reasonTags }, index) => {
                const rank = index + 1
                return (
                <div
                  key={song.id}
                  className={`bg-volt-surface rounded-xl p-4 space-y-3 ${
                    rank === 1
                      ? "border-2 border-volt-yellow"
                      : rank <= 3
                      ? "border border-volt-cyan/60"
                      : "border border-volt-edge"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-white leading-tight">{song.title}</p>
                        {isNewSong(song) && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-bold shrink-0" style={{ backgroundColor: '#fee023', color: '#000000' }}>
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-volt-muted mt-0.5">{song.artist}{buildFeatStr(song)}</p>
                    </div>
                    {rank === 1 && (
                      <span className="shrink-0 text-xs font-bold px-2 py-1 rounded-lg bg-volt-yellow/20 text-volt-yellow">
                        BEST
                      </span>
                    )}
                  </div>

                  {/* 推薦理由タグ */}
                  {reasonTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {reasonTags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full border border-volt-cyan/40 text-volt-cyan"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* サムネ / 埋め込みプレーヤー */}
                  {activeVideoId === song.youtube_id ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${song.youtube_id}?autoplay=1`}
                        title={song.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveVideoId(song.youtube_id)}
                      className="relative w-full aspect-video rounded-lg overflow-hidden group"
                      aria-label={`${song.title} を再生`}
                    >
                      <Image
                        src={`https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`}
                        alt=""
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                        <div className={`w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg${rank === 1 && activeVideoId !== song.youtube_id ? ' best-invite-pulse' : ''}`}>
                          <span className="text-white text-2xl ml-1">▶</span>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* 外部リンクボタン */}
                  <SongLinkButtons youtubeId={song.youtube_id} officialUrl={song.official_url} />
                </div>
                )
              })
            )}

            {/* シェアボタン（再生開始後に表示） */}
            {results.length > 0 && activeVideoId !== null && (() => {
              const best = results[0].song
              const shareUrl = `${appConfig.baseUrl}/`
              const shareText = `「${best.title} / ${best.artist}」がおすすめ！\n#ポケミク #ポケミクライブ`
              const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
              return (
                <div className="space-y-2">
                  <p className="text-xs text-volt-muted text-center">聴いてみてどうだった？気に入ったらシェアしよう</p>
                  <div className="flex gap-3">
                    <a
                      href={tweetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-volt-surface text-white border border-volt-cyan/50 rounded-xl font-bold hover:bg-volt-edge transition-colors text-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                      </svg>
                      X でシェア
                    </a>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(shareUrl)
                          setCopiedShare(true)
                          setTimeout(() => setCopiedShare(false), 2000)
                        } catch {
                          prompt("以下のURLをコピーしてください", shareUrl)
                        }
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors text-sm ${
                        copiedShare
                          ? "bg-volt-cyan/20 text-volt-cyan border border-volt-cyan/30"
                          : "bg-volt-surface text-white/80 border border-volt-cyan/50 hover:bg-volt-edge"
                      }`}
                    >
                      {copiedShare ? "✓ コピーしました！" : "URLをコピー"}
                    </button>
                  </div>
                </div>
              )
            })()}

            <button
              onClick={reset}
              className="w-full px-6 py-3 rounded-xl font-bold text-black text-center transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #fee023 0%, #43d9bf 100%)" }}
            >
              もう一度診断する
            </button>

            <div className="p-px rounded-xl w-full" style={{ background: "linear-gradient(135deg, #fee023, #43d9bf)" }}>
              <Link
                href="/songs"
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-volt-surface hover:bg-[#1a1a1a] text-sm font-medium text-white transition-colors"
              >
                全曲一覧から探す →
              </Link>
            </div>

            <Link
              href="/quiz"
              className="w-full block text-center px-6 py-3 border border-volt-edge text-volt-muted rounded-xl hover:border-white/30 transition-colors text-sm"
            >
              タイプ診断もやってみる →
            </Link>

            {OFFICIAL_PLAYLIST_URL && (
              <a
                href={OFFICIAL_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 border border-volt-cyan/30 text-volt-cyan text-sm rounded-xl hover:border-volt-cyan/60 transition-colors"
              >
                ▸ 全曲を公式プレイリストで見る ↗
              </a>
            )}

            <Link
              href="/"
              className="w-full block text-center px-6 py-3 bg-volt-surface text-white/80 border border-volt-edge rounded-xl font-bold hover:bg-volt-edge transition-colors"
            >
              ← トップへ戻る
            </Link>
          </div>
        )}

      </div>

      </div>
    </main>
  )
}
