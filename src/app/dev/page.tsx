/**
 * Dev page — 結果ページの素早い確認用。
 * 本番環境では 404 を返す。
 *
 * アクセス: http://localhost:3000/dev
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getContentPack } from "@/lib/contentPack";
import { encodeAnswers } from "@/lib/answerUrl";

export default function DevPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const { questions, types } = getContentPack();

  const scenarios = [
    {
      label: "全部 A",
      desc: "各質問の最初の選択肢を選んだ場合",
      answers: questions.map((q) => ({ questionId: q.id, optionId: q.options[0].id })),
    },
    {
      label: "全部 D（最後）",
      desc: "各質問の最後の選択肢を選んだ場合",
      answers: questions.map((q) => ({
        questionId: q.id,
        optionId: q.options[q.options.length - 1].id,
      })),
    },
    {
      label: "交互 A/D",
      desc: "A・D・A・D… と交互に選んだ場合",
      answers: questions.map((q, i) => ({
        questionId: q.id,
        optionId: q.options[i % 2 === 0 ? 0 : q.options.length - 1].id,
      })),
    },
    {
      label: "交互 B/C",
      desc: "B・C・B・C… と交互に選んだ場合",
      answers: questions.map((q, i) => ({
        questionId: q.id,
        optionId: q.options[i % 2 === 0 ? 1 : 2].id,
      })),
    },
  ];

  return (
    <main
      className="min-h-screen p-8"
      style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
    >
      <div className="max-w-lg mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-base font-bold text-volt-yellow">⚙ Dev — 確認ツール</h1>
          <p className="text-xs text-volt-muted mt-1">
            本番環境では 404。{questions.length} 問 / {types.length} タイプ
          </p>
        </div>

        {/* Scenario links */}
        <div>
          <p className="text-xs text-volt-muted font-bold uppercase tracking-widest mb-2">
            結果ページ — シナリオ確認
          </p>
          <div className="space-y-2">
            {scenarios.map(({ label, desc, answers }) => (
              <Link
                key={label}
                href={`/result?a=${encodeAnswers(answers)}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-volt-surface border border-volt-edge hover:border-volt-yellow/60 transition-colors"
              >
                <span className="font-mono text-xs text-volt-yellow w-20 shrink-0">{label}</span>
                <span className="text-xs text-volt-muted">{desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Type cards preview */}
        <div>
          <p className="text-xs text-volt-muted font-bold uppercase tracking-widest mb-2">
            全タイプ — 結果カード確認
          </p>
          <div className="grid grid-cols-2 gap-2">
            {types.map((type) => (
              <Link
                key={type.type_id}
                href={`/dev/types#${type.type_id}`}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-volt-surface border border-volt-edge hover:border-volt-cyan/50 transition-colors"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-xs text-white/80 truncate">{type.label}</span>
                <span className="ml-auto text-xs font-mono text-volt-muted shrink-0">
                  {type.shortLabel}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/dev/types"
            className="mt-3 flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-volt-surface border border-volt-cyan/40 hover:border-volt-cyan/80 text-volt-cyan text-xs font-bold transition-colors"
          >
            全タイプ一覧を開く →
          </Link>
        </div>

        {/* Recommend bg effects */}
        <div>
          <p className="text-xs text-volt-muted font-bold uppercase tracking-widest mb-2">
            レコメンド — エフェクト比較
          </p>
          <div className="space-y-2">
            <Link
              href="/dev/bg-effects"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-volt-surface border border-volt-edge hover:border-volt-cyan/60 transition-colors"
            >
              <span className="text-xs text-volt-cyan">✦</span>
              <span className="text-xs text-white/80">背景エフェクト — グリッド / ドット / 2カラム / グロー を ON/OFF</span>
            </Link>
            <Link
              href="/dev/high-effects"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-volt-surface border border-volt-edge hover:border-volt-yellow/60 transition-colors"
            >
              <span className="text-xs text-volt-yellow">⚡</span>
              <span className="text-xs text-white/80">High エネルギー結果エフェクト — A/B/C/D 案を radio 切り替え</span>
            </Link>
            <Link
              href="/dev/hover-anim"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-volt-surface border border-volt-edge hover:border-volt-cyan/60 transition-colors"
            >
              <span className="text-xs text-volt-cyan">✦</span>
              <span className="text-xs text-white/80">楽曲カード ホバーアニメーション — A.回転枠 / B.グロー拍動 / C.走査線</span>
            </Link>
          </div>
        </div>

        {/* OGP image preview */}
        <div>
          <p className="text-xs text-volt-muted font-bold uppercase tracking-widest mb-2">
            OGP 画像確認
          </p>
          <div className="space-y-2">
            <Link
              href="/opengraph-image"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-volt-surface border border-volt-edge hover:border-volt-yellow/60 transition-colors"
            >
              <span className="text-xs text-volt-yellow">🖼</span>
              <span className="text-xs text-white/80">LP — /opengraph-image</span>
              <span className="ml-auto text-xs font-mono text-volt-muted shrink-0">1200×630</span>
            </Link>
            <Link
              href="/recommend/opengraph-image"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-volt-surface border border-volt-edge hover:border-volt-cyan/60 transition-colors"
            >
              <span className="text-xs text-volt-cyan">🖼</span>
              <span className="text-xs text-white/80">レコメンド — /recommend/opengraph-image</span>
              <span className="ml-auto text-xs font-mono text-volt-muted shrink-0">1200×630</span>
            </Link>
          </div>
        </div>

        {/* Other links */}
        <div className="border-t border-volt-edge pt-4 flex gap-4 text-xs text-volt-muted">
          <Link href="/" className="hover:text-white transition-colors">TOP</Link>
          <Link href="/quiz" className="hover:text-white transition-colors">クイズ</Link>
          <Link href="/recommend" className="hover:text-white transition-colors">レコメンド</Link>
        </div>
      </div>
    </main>
  );
}
