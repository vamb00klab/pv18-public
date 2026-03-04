const btnClass =
  "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-volt-edge text-volt-muted hover:border-white/40 hover:text-white transition-colors"

const iconBtnClass =
  "inline-flex items-center justify-center w-7 h-7 rounded-lg border border-volt-edge text-volt-muted hover:border-white/40 hover:text-white transition-colors"

function YouTubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export function SongLinkButtons({
  youtubeId,
  officialUrl,
  compact = false,
}: {
  youtubeId: string
  officialUrl?: string
  compact?: boolean
}) {
  if (compact) {
    return (
      <div className="flex gap-1.5">
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={iconBtnClass}
          title="YouTube で開く"
          aria-label="YouTube で開く"
        >
          <YouTubeIcon />
        </a>
        {officialUrl && (
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={iconBtnClass}
            title="公式ページ"
            aria-label="公式ページ"
          >
            <ExternalIcon />
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <a
        href={`https://www.youtube.com/watch?v=${youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        ↗ YouTube で開く
      </a>
      {officialUrl && (
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
        >
          ↗ ポケミク公式
        </a>
      )}
    </div>
  )
}
