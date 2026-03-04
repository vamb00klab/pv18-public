import type { Song } from '@/types/song'

const linkClass =
  "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-volt-cyan/30 text-volt-cyan/70 hover:border-volt-cyan/60 hover:text-volt-cyan transition-colors"

export function SongKaraoke({ karaoke }: { karaoke?: Song['karaoke'] }) {
  if (!karaoke) return null
  const { joysound, dam } = karaoke

  // 両方未確認 → 開閉なしのメッセージ表記
  if (!joysound && !dam) {
    return (
      <span className="inline-flex items-center text-xs px-2.5 py-1.5 text-volt-muted">
        カラオケ配信未確認
      </span>
    )
  }

  return (
    <details className="text-left">
      <summary className="cursor-pointer select-none list-none inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-volt-cyan/30 text-volt-cyan/70 hover:border-volt-cyan/60 hover:text-volt-cyan transition-colors">
        <span className="details-arrow text-[10px]">▶</span>
        カラオケ
      </summary>
      <div className="mt-2 space-y-2">
        <div className="flex gap-2 flex-wrap">
          {joysound && (
            <a
              href={joysound}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              ↗ JOYSOUND
            </a>
          )}
          {dam && (
            <a
              href={dam}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              ↗ DAM
            </a>
          )}
        </div>
        {joysound && !dam && (
          <p className="text-xs text-volt-muted">DAM: 配信待ち</p>
        )}
        {!joysound && dam && (
          <p className="text-xs text-volt-muted">JOYSOUND: 配信待ち</p>
        )}
        <p className="text-[10px] text-volt-muted">※本人映像は機種・店舗により異なります</p>
      </div>
    </details>
  )
}
