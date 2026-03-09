"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import PageHeader from "@/components/PageHeader"
import FeedbackButton from "@/components/FeedbackButton"
import { SONGS } from "@/data/songs"
import { CALL_ENTRIES, SOURCE_LABEL, type CallEntry } from "./callData"

/* ── X (Twitter) types ─────────────────────────────────────────────── */

type Twttr = {
  widgets: {
    createTweet: (
      id: string,
      el: HTMLElement,
      opts?: Record<string, unknown>,
    ) => Promise<HTMLElement | undefined>
  }
}

function loadTwitterWidgets(): Promise<Twttr> {
  return new Promise((resolve) => {
    const w = window as unknown as { twttr?: Twttr }
    if (w.twttr?.widgets) {
      resolve(w.twttr)
      return
    }

    if (!document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) {
      const script = document.createElement("script")
      script.src = "https://platform.twitter.com/widgets.js"
      script.async = true
      script.charset = "utf-8"
      document.body.appendChild(script)
    }

    const check = setInterval(() => {
      if ((window as unknown as { twttr?: Twttr }).twttr?.widgets) {
        clearInterval(check)
        resolve((window as unknown as { twttr: Twttr }).twttr)
      }
    }, 200)
  })
}

function extractTweetId(url: string): string | null {
  const m = url.match(/status\/(\d+)/)
  return m ? m[1] : null
}

/* ── Tweet embed ──────────────────────────────────────────────────── */

function TweetEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tweetId = extractTweetId(url)
  const [status, setStatus] = useState<"loading" | "ok" | "error">(
    tweetId ? "loading" : "error",
  )

  useEffect(() => {
    if (!tweetId || !containerRef.current) return

    let cancelled = false
    const el = containerRef.current

    loadTwitterWidgets().then((twttr) => {
      if (cancelled) return
      twttr.widgets
        .createTweet(tweetId, el, { theme: "dark", align: "center" })
        .then((result) => {
          if (!cancelled) setStatus(result ? "ok" : "error")
        })
        .catch(() => {
          if (!cancelled) setStatus("error")
        })
    })

    return () => { cancelled = true }
  }, [tweetId])

  return (
    <>
      <div ref={containerRef} className="max-w-lg" />
      {status === "loading" && (
        <p className="text-xs text-volt-muted animate-pulse py-2">ポストを読み込み中...</p>
      )}
      {status === "error" && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-volt-cyan hover:underline py-2"
        >
          ポストを見る ↗
        </a>
      )}
    </>
  )
}

/* ── YouTube mini player ──────────────────────────────────────────── */

function YouTubeMiniPlayer({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const toggle = useCallback(() => setPlaying((p) => !p), [])

  return (
    <div className="rounded-xl overflow-hidden border border-volt-edge">
      {playing ? (
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={toggle}
          className="relative w-full group cursor-pointer"
          style={{ aspectRatio: "16/9" }}
          aria-label={`${title} を再生`}
        >
          <Image
            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-volt-yellow/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0e0c00">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  )
}

/* ── Source badge ──────────────────────────────────────────────────── */

function SourceBadge({ type }: { type: CallEntry["sourceType"] }) {
  const isArtist = type === "artist"
  return (
    <span
      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
        isArtist
          ? "bg-volt-yellow/20 text-volt-yellow border border-volt-yellow/40"
          : "bg-volt-cyan/20 text-volt-cyan border border-volt-cyan/40"
      }`}
    >
      {SOURCE_LABEL[type]}
    </span>
  )
}

/* ── Call card ─────────────────────────────────────────────────────── */

function CallCard({ entry }: { entry: CallEntry }) {
  const [isOpen, setIsOpen] = useState(true)
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  // Resolve youtube_id from songs.ts
  const song = entry.songId ? SONGS.find((s) => s.id === entry.songId) : undefined

  return (
    <div className="rounded-2xl border border-volt-edge bg-volt-surface/60 overflow-hidden">
      {/* Header */}
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-white">{entry.songTitle}</span>
            <SourceBadge type={entry.sourceType} />
          </div>
          <p className="text-xs text-volt-muted">{entry.artist}（{entry.sourceLabel}）</p>
        </div>
        <span
          className={`text-volt-muted text-sm shrink-0 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-4 border-t border-volt-edge/50">
          {/* YouTube mini player */}
          {song && (
            <div className="pt-3">
              <YouTubeMiniPlayer youtubeId={song.youtube_id} title={song.title} />
            </div>
          )}

          {/* Call parts */}
          <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-1">
            {entry.callParts.map((part, i) => (
              <span key={i}>
                {part.type === "buildup" && i > 0 && (
                  <span className="text-volt-muted mx-1">→</span>
                )}
                {part.type === "call" && i > 0 && (
                  <span className="text-volt-muted mx-1">→</span>
                )}
                <span
                  className={
                    part.type === "call"
                      ? "text-sm font-bold text-volt-yellow"
                      : "text-xs text-white/40"
                  }
                >
                  {part.text}
                </span>
              </span>
            ))}
            {entry.note && (
              <span className="text-xs text-white/50">{entry.note}</span>
            )}
          </div>

          {/* Tweet embed */}
          <TweetEmbed url={entry.tweetUrl} />

          {/* External link */}
          {entry.externalUrl && (
            <a
              href={entry.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-medium text-volt-cyan border border-volt-cyan/30 rounded-xl px-4 py-2 hover:bg-volt-cyan/10 transition-colors"
            >
              {entry.externalLabel ?? "詳細を見る"} ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────── */

export default function CallsClient() {
  return (
    <main
      className="relative min-h-screen overflow-hidden page-enter"
      style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
    >
      {/* 背景: グリッドライン */}
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

      {/* コンテンツ */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 space-y-8">
        <PageHeader subLabel="Call & Response" />

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-bold text-white text-center">
          コール＆レスポンスまとめ
        </h1>

        {/* Notice */}
        <div className="rounded-xl border border-volt-yellow/30 bg-volt-yellow/5 px-4 py-3 space-y-1">
          <p className="text-xs text-volt-yellow font-bold">
            このページについて
          </p>
          <p className="text-xs text-white/60 leading-relaxed">
            アーティスト本人や公式が発信したコール情報と、ファンコミュニティで共有されている提案をまとめています。
            公式ルールではありません。周りの様子を見ながら楽しみましょう！
          </p>
        </div>

        {/* Call entries */}
        <div className="space-y-4">
          {CALL_ENTRIES.map((entry) => (
            <CallCard key={entry.tweetUrl} entry={entry} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-volt-muted text-center leading-relaxed pt-4">
          情報は随時追加・更新されます。
          <br />
          掲載情報に問題がある場合はお知らせください。
        </p>

        {/* Back to /live */}
        <div className="text-center">
          <Link
            href="/live"
            className="inline-block text-sm font-medium text-volt-cyan border border-volt-cyan/30 rounded-xl px-6 py-2.5 hover:bg-volt-cyan/10 transition-colors"
          >
            ← LIVE 特設ページに戻る
          </Link>
        </div>
      </div>

      <FeedbackButton />
    </main>
  )
}
