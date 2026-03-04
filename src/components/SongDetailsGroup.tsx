'use client'

import { useState } from 'react'
import type { Song } from '@/types/song'

type ActivePanel = 'intro' | 'karaoke' | null

const linkClass =
  "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-volt-cyan/30 text-volt-cyan/70 hover:border-volt-cyan/60 hover:text-volt-cyan transition-colors"

/**
 * SongDetailsGroup — 曲紹介とカラオケ情報の排他アコーディオン。
 *
 * inline=false (default): ボタン行＋コンテンツを自前 div で包む。
 * inline=true: display:contents で親 flex に参加。コンテンツは w-full で次行折返し。
 */
export function SongDetailsGroup({
  intro,
  karaoke,
  inline = false,
}: {
  intro?: string
  karaoke?: Song['karaoke']
  inline?: boolean
}) {
  const [active, setActive] = useState<ActivePanel>(null)

  const hasIntro = !!intro
  const hasKaraokeUrls = !!(karaoke?.joysound || karaoke?.dam)
  const karaokeUnconfirmed = !!karaoke && !karaoke.joysound && !karaoke.dam

  if (!hasIntro && !hasKaraokeUrls && !karaokeUnconfirmed) return null

  const toggle = (panel: 'intro' | 'karaoke') => {
    setActive((prev) => (prev === panel ? null : panel))
  }

  const paragraphs = intro ? intro.split('\n\n').filter(Boolean) : []

  const introBtn = hasIntro && (
    <button
      type="button"
      onClick={() => toggle('intro')}
      className={`cursor-pointer select-none inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
        active === 'intro'
          ? 'bg-volt-yellow border-volt-yellow text-black'
          : 'border-volt-yellow/30 text-volt-yellow/70 hover:border-volt-yellow/50 hover:text-volt-yellow'
      }`}
    >
      <span className={`text-[10px] transition-transform duration-200 ${active === 'intro' ? 'rotate-90' : ''}`}>▶</span>
      曲紹介
    </button>
  )

  const karaokeBtn = hasKaraokeUrls && (
    <button
      type="button"
      onClick={() => toggle('karaoke')}
      className={`cursor-pointer select-none inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
        active === 'karaoke'
          ? 'bg-volt-cyan border-volt-cyan text-black'
          : 'border-volt-cyan/30 text-volt-cyan/70 hover:border-volt-cyan/60 hover:text-volt-cyan'
      }`}
    >
      <span className={`text-[10px] transition-transform duration-200 ${active === 'karaoke' ? 'rotate-90' : ''}`}>▶</span>
      カラオケ
    </button>
  )

  const unconfirmedBadge = karaokeUnconfirmed && (
    <span className="inline-flex items-center text-xs px-2.5 py-1.5 text-volt-muted">
      カラオケ配信未確認
    </span>
  )

  const introPanel = active === 'intro' && paragraphs.length > 0 && (
    <div className={`space-y-2 max-h-40 overflow-y-auto text-left${inline ? ' w-full mt-1' : ' mt-2'}`}>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-xs text-white/70 leading-relaxed">{p}</p>
      ))}
    </div>
  )

  const karaokePanel = active === 'karaoke' && karaoke && (karaoke.joysound || karaoke.dam) && (
    <div className={`space-y-2 text-left${inline ? ' w-full mt-1' : ' mt-2'}`}>
      <div className="flex gap-2 flex-wrap">
        {karaoke.joysound && (
          <a href={karaoke.joysound} target="_blank" rel="noopener noreferrer" className={linkClass}>
            ↗ JOYSOUND
          </a>
        )}
        {karaoke.dam && (
          <a href={karaoke.dam} target="_blank" rel="noopener noreferrer" className={linkClass}>
            ↗ DAM
          </a>
        )}
      </div>
      {karaoke.joysound && !karaoke.dam && (
        <p className="text-xs text-volt-muted">DAM: 配信待ち</p>
      )}
      {!karaoke.joysound && karaoke.dam && (
        <p className="text-xs text-volt-muted">JOYSOUND: 配信待ち</p>
      )}
      <p className="text-[10px] text-volt-muted">※本人映像は機種・店舗により異なります</p>
    </div>
  )

  // inline: 親 flex に直接参加（display:contents）
  if (inline) {
    return (
      <div className="contents">
        {introBtn}
        {karaokeBtn}
        {unconfirmedBadge}
        {introPanel}
        {karaokePanel}
      </div>
    )
  }

  // block: 自前レイアウト（default）
  return (
    <div className="text-left">
      <div className="flex gap-2 flex-wrap items-center">
        {introBtn}
        {karaokeBtn}
        {unconfirmedBadge}
      </div>
      {introPanel}
      {karaokePanel}
    </div>
  )
}
