/**
 * SongIntro — 曲紹介の開閉式表示。
 * intro が未設定の曲では何も描画しない。
 */
export function SongIntro({ intro }: { intro?: string }) {
  if (!intro) return null;

  const paragraphs = intro.split("\n\n").filter(Boolean);

  return (
    <details className="text-left">
      <summary className="cursor-pointer select-none list-none inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-volt-yellow/30 text-volt-yellow/70 hover:border-volt-yellow/50 hover:text-volt-yellow transition-colors">
        <span className="details-arrow text-[10px]">▶</span>
        曲紹介
      </summary>
      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-xs text-white/70 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </details>
  );
}
