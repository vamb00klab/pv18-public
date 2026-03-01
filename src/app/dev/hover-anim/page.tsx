"use client"

/**
 * /dev/hover-anim
 *
 * 楽曲カードのホバーアニメーション比較ページ（開発専用）
 *
 * 3案を並べて外観を確認できる。カーソルを当てるとアニメーション発動。
 *   A. 回転グラデーション枠  — conic-gradient が縁をクルクル回る
 *   B. グロー拍動           — volt カラーの box-shadow がパルス（シアン→イエロー）
 *   C. 走査線               — 光の走査線がカード上をスキャン
 */

import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SONGS } from "@/data/songs"

// 各案に1曲ずつ使う（先頭3曲）
const [songA, songB, songC] = SONGS

const STYLES = `
  /* ── A: Rotating conic-gradient border ───────────────────────────────── */
  @keyframes ha-spin {
    to { transform: rotate(360deg); }
  }
  .ha-wrap {
    position: relative;
    border-radius: 18px;
    padding: 2px;
    background: #2a2a2a;
    overflow: hidden;
  }
  .ha-ring {
    position: absolute;
    inset: -100%;
    background: conic-gradient(from 0deg, #fee023 0deg, #43d9bf 90deg, #c084fc 180deg, #fee023 360deg);
    opacity: 0;
    animation: ha-spin 2.5s linear infinite;
    transition: opacity 0.3s;
  }
  .ha-wrap:hover .ha-ring { opacity: 1; }
  .ha-inner {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #111111;
  }

  /* ── B: Glow pulse ────────────────────────────────────────────────────── */
  @keyframes hb-pulse {
    0%, 100% {
      box-shadow: 0 0 10px 3px rgba(67,217,191,0.50),
                  0 0 28px 10px rgba(67,217,191,0.20);
    }
    50% {
      box-shadow: 0 0 22px 8px rgba(254,224,35,0.60),
                  0 0 50px 20px rgba(254,224,35,0.22);
    }
  }
  .hb-card {
    border-radius: 16px;
    overflow: hidden;
    background: #111111;
    border: 1px solid #2a2a2a;
    transition: border-color 0.3s;
  }
  .hb-card:hover {
    border-color: #43d9bf;
    animation: hb-pulse 1.6s ease-in-out infinite;
  }

  /* ── C: Shimmer scan line ─────────────────────────────────────────────── */
  /*
    仕組み: ::after をカードと同じ高さにして、上端から下端へ translateY で動かす。
    グラデーションの光の帯（中央付近）だけが視覚的に走査線として見える。
  */
  @keyframes hc-scan {
    0%   { transform: translateY(-100%); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(100%);  opacity: 0; }
  }
  .hc-wrap {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #111111;
    border: 1px solid #2a2a2a;
    transition: border-color 0.3s;
  }
  .hc-wrap:hover { border-color: #43d9bf; }
  .hc-scan {
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 10;
    overflow: hidden;
  }
  .hc-scan::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    top: 0;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 44%,
      rgba(67,217,191,0.6) 48%,
      rgba(254,224,35,1.0) 50%,
      rgba(67,217,191,0.6) 52%,
      transparent 56%,
      transparent 100%
    );
    animation: hc-scan 1.5s ease-in-out infinite;
    animation-play-state: paused;
  }
  .hc-wrap:hover .hc-scan::after {
    animation-play-state: running;
  }
`

function DemoCard({
  song,
  label,
  desc,
  wrapper,
}: {
  song: typeof SONGS[number]
  label: string
  desc: string
  wrapper: (inner: React.ReactNode) => React.ReactNode
}) {
  const thumb = (
    <div className="relative w-full aspect-video">
      <Image
        src={`https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`}
        alt={song.title}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center">
          <span className="text-white text-xl ml-0.5">▶</span>
        </div>
      </div>
    </div>
  )

  const info = (
    <div className="px-4 py-3 space-y-2">
      <div>
        <p className="text-sm font-bold text-white leading-snug">{song.title}</p>
        <p className="text-xs" style={{ color: '#8891a4' }}>{song.artist} feat. ミク</p>
      </div>
      <div className="flex gap-1">
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ border: '1px solid #43d9bf', color: '#43d9bf', backgroundColor: '#43d9bf18' }}>
          ふつう
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full border border-volt-cyan/25 text-volt-cyan/60">
          感動
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs" style={{ color: '#8891a4' }}>{desc}</p>
      </div>
      {wrapper(
        <>
          {thumb}
          {info}
        </>
      )}
    </div>
  )
}

export default function HoverAnimPage() {
  if (process.env.NODE_ENV !== "development") notFound()
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <main
        className="min-h-screen px-6 py-10 space-y-10"
        style={{ background: 'linear-gradient(135deg, #0e0c00 0%, #00110e 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <Link href="/dev" className="text-xs" style={{ color: '#8891a4' }}>
            ← /dev
          </Link>
          <h1 className="text-xl font-bold text-white mt-3">ホバーアニメーション比較</h1>
          <p className="text-sm mt-1" style={{ color: '#8891a4' }}>
            各カードにカーソルを当てるとアニメーションが発動します
          </p>
          <div className="h-px mt-4 bg-gradient-to-r from-volt-yellow via-volt-cyan to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* A: 回転グラデーション枠 */}
          <DemoCard
            song={songA}
            label="A. 回転グラデーション枠"
            desc="縁が虹色にクルクル回る"
            wrapper={(inner) => (
              <div className="ha-wrap">
                <div className="ha-ring" />
                <div className="ha-inner">{inner}</div>
              </div>
            )}
          />

          {/* B: グロー拍動 */}
          <DemoCard
            song={songB}
            label="B. グロー拍動"
            desc="シアン→イエローで光が脈打つ"
            wrapper={(inner) => (
              <div className="hb-card">{inner}</div>
            )}
          />

          {/* C: 走査線 */}
          <DemoCard
            song={songC}
            label="C. 走査線"
            desc="光の線がカードをスキャン"
            wrapper={(inner) => (
              <div className="hc-wrap">
                <div className="hc-scan" />
                {inner}
              </div>
            )}
          />

        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-xs" style={{ color: '#8891a4' }}>
            ※ 実装は <code className="text-volt-cyan">/songs</code> の SongCard に組み込む想定。
            気に入った案を選んで指示してください。
          </p>
        </div>
      </main>
    </>
  )
}
