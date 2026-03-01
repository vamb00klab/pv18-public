/**
 * Dev page — 全タイプの結果カードを一覧確認。
 * 本番環境では 404 を返す。
 *
 * アクセス: http://localhost:3000/dev/types
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getContentPack } from "@/lib/contentPack";
import { ResultCard } from "@/components/ResultCard";

/** 対象タイプを1位にしたフェイクスコアを生成する。 */
function buildFakeScores(
  targetId: string,
  allTypeIds: string[]
): Record<string, number> {
  const scores: Record<string, number> = {};
  let rank = 0;
  for (const id of allTypeIds) {
    if (id === targetId) {
      scores[id] = 100;
    } else {
      // 2位以下: 60 → 0 に向けて等差減少
      scores[id] = Math.max(0, 60 - rank * 4);
      rank++;
    }
  }
  return scores;
}

export default function DevTypesPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const { types, axes, typeScores } = getContentPack();
  const allTypeIds = types.map((t) => t.type_id);

  return (
    <main
      className="min-h-screen py-10 px-4"
      style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
    >
      <div className="max-w-2xl mx-auto space-y-16">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-base font-bold text-volt-yellow">⚙ Dev — 全タイプ結果カード確認</h1>
            <p className="text-xs text-volt-muted mt-1">
              本番環境では 404。{types.length} タイプ / スコアはダミー
            </p>
          </div>
          <Link
            href="/dev"
            className="text-xs text-volt-muted hover:text-white transition-colors shrink-0"
          >
            ← dev トップ
          </Link>
        </div>

        {/* Type cards */}
        {types.map((type) => {
          const scores = buildFakeScores(type.type_id, allTypeIds);
          const axisProfile = typeScores?.find((p) => p.type_id === type.type_id)?.scores;

          return (
            <section key={type.type_id} id={type.type_id}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: type.color }}
                />
                <h2 className="text-sm font-bold text-white">{type.label}</h2>
                <span className="text-xs font-mono text-volt-muted">{type.type_id}</span>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: type.color + "30", color: type.color }}
                >
                  {type.shortLabel}
                </span>
              </div>

              <ResultCard
                result={type}
                scores={scores}
                allTypes={types}
                axes={axes}
                axisProfile={axisProfile}
              />
            </section>
          );
        })}

        {/* Footer nav */}
        <div className="border-t border-volt-edge pt-4 flex gap-4 text-xs text-volt-muted pb-8">
          <Link href="/dev" className="hover:text-white transition-colors">← dev トップ</Link>
          <Link href="/" className="hover:text-white transition-colors">TOP</Link>
          <Link href="/quiz" className="hover:text-white transition-colors">クイズ</Link>
        </div>
      </div>
    </main>
  );
}
