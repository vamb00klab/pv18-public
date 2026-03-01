const btnClass =
  "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-volt-edge text-volt-muted hover:border-white/40 hover:text-white transition-colors"

export function SongLinkButtons({
  youtubeId,
  officialUrl,
}: {
  youtubeId: string
  officialUrl?: string
}) {
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
