/**
 * scripts/bias-check.ts — タイプ出現バイアス分析
 *
 * 実行: npx tsx scripts/bias-check.ts [--mc=N]
 *   --mc=N : モンテカルロ試行回数（デフォルト 100000）
 *
 * 出力:
 *   1. 解析的期待スコア（均一選択仮定）
 *   2. 主加点（+3）オプション数 & 適用質問一覧
 *   3. 理論最大 / 最小スコア
 *   4. モンテカルロ出現率
 *   5. 懸念タイプ一覧（2× 超 or 0.5× 未満）
 *
 * NOTE: pokemon パック専用。content/pokemon ブランチでのみ使用。
 */

// relative imports to avoid tsconfig path-alias resolution in tsx
import { pokemonQuestions as QUESTIONS } from "../src/content/pokemon/questions";
import { pokemonTypes as TYPES } from "../src/content/pokemon/types";
import { calculateScores, determineResult } from "../src/lib/diagnose";

// ── CLI args ──────────────────────────────────────────────────────────────────

const mcArg = process.argv.find((a) => a.startsWith("--mc="));
const MONTE_CARLO_N = mcArg ? parseInt(mcArg.slice(5), 10) : 100_000;

const TYPE_IDS = TYPES.map((t) => t.type_id);

// ── 1. 解析的期待スコア ────────────────────────────────────────────────────────
//
// 全選択肢が等確率（1/4）で選ばれると仮定した場合の
// 各タイプの期待総スコア（タイブレークボーナス込み）。

interface ExpectedEntry {
  rawExpected: number;       // +3/+2/+1 合計の期待値
  primaryHitsExpected: number; // 主加点（+3）が選ばれる期待回数
  bonusExpected: number;     // primaryHitsExpected × 0.5
  totalExpected: number;     // rawExpected + bonusExpected
}

function calcExpectedScores(): Record<string, ExpectedEntry> {
  const result: Record<string, ExpectedEntry> = {};
  for (const typeId of TYPE_IDS) {
    result[typeId] = {
      rawExpected: 0,
      primaryHitsExpected: 0,
      bonusExpected: 0,
      totalExpected: 0,
    };
  }

  for (const question of QUESTIONS) {
    const n = question.options.length; // 4
    for (const option of question.options) {
      for (const [typeId, score] of Object.entries(option.scoreMap)) {
        const s = score ?? 0;
        if (!(typeId in result)) continue;
        result[typeId].rawExpected += s / n;
        if (s === 3) result[typeId].primaryHitsExpected += 1 / n;
      }
    }
  }

  for (const typeId of TYPE_IDS) {
    const r = result[typeId];
    r.bonusExpected = r.primaryHitsExpected * 0.5;
    r.totalExpected = r.rawExpected + r.bonusExpected;
  }

  return result;
}

// ── 2. 主加点オプション数（+3 が付く選択肢の総数）─────────────────────────────

interface PrimaryHitEntry {
  optionCount: number;   // 全問通じて +3 になる選択肢の総数
  questions: string[];   // +3 を持つ質問 ID（重複なし）
}

function countPrimaryHits(): Record<string, PrimaryHitEntry> {
  const result: Record<string, PrimaryHitEntry> = {};
  for (const typeId of TYPE_IDS) {
    result[typeId] = { optionCount: 0, questions: [] };
  }

  for (const question of QUESTIONS) {
    for (const option of question.options) {
      for (const [typeId, score] of Object.entries(option.scoreMap)) {
        if (score === 3 && typeId in result) {
          result[typeId].optionCount++;
          if (!result[typeId].questions.includes(question.id)) {
            result[typeId].questions.push(question.id);
          }
        }
      }
    }
  }

  return result;
}

// ── 3. 理論スコア範囲（最大 / 最小）──────────────────────────────────────────
//
// 最大: 各質問で typeId への得点が最大になる選択肢を選んだ場合
// 最小: 各質問で typeId への得点が最小（0含む）になる選択肢を選んだ場合

interface ScoreRange {
  max: number;  // タイブレークボーナス込み
  min: number;
  zeroQuestions: string[]; // いずれの選択肢も得点 0 の質問
}

function calcScoreRange(): Record<string, ScoreRange> {
  const result: Record<string, ScoreRange> = {};
  for (const typeId of TYPE_IDS) {
    result[typeId] = { max: 0, min: 0, zeroQuestions: [] };
  }

  for (const question of QUESTIONS) {
    for (const typeId of TYPE_IDS) {
      const scores = question.options.map((opt) => opt.scoreMap[typeId] ?? 0);
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);

      // 最大スコア + 主加点ボーナス
      result[typeId].max += maxScore + (maxScore === 3 ? 0.5 : 0);
      result[typeId].min += minScore;

      if (maxScore === 0) {
        result[typeId].zeroQuestions.push(question.id);
      }
    }
  }

  return result;
}

// ── 4. モンテカルロシミュレーション ─────────────────────────────────────────

function runMonteCarlo(n: number): Record<string, number> {
  const winCounts: Record<string, number> = {};
  for (const typeId of TYPE_IDS) winCounts[typeId] = 0;

  for (let i = 0; i < n; i++) {
    const answers = QUESTIONS.map((q) => ({
      questionId: q.id,
      optionId: q.options[Math.floor(Math.random() * q.options.length)].id,
    }));
    const scores = calculateScores(answers, QUESTIONS);
    const winner = determineResult(scores, TYPES);
    winCounts[winner.type_id]++;
  }

  return winCounts;
}

// ── 出力ヘルパー ──────────────────────────────────────────────────────────────

const COL = {
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  GREEN: "\x1b[32m",
  CYAN: "\x1b[36m",
  DIM: "\x1b[2m",
};

function c(color: string, s: string): string {
  return color + s + COL.RESET;
}

function padR(s: string | number, n: number): string {
  return String(s).padEnd(n);
}

function padL(s: string | number, n: number): string {
  return String(s).padStart(n);
}

function fmt(n: number, d = 2): string {
  return n.toFixed(d);
}

function pct(n: number, total: number): string {
  return fmt((n / total) * 100);
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log(c(COL.BOLD, "\n=== PersonaVOLT18 バイアス分析レポート ===\n"));
  console.log(
    `設問数: ${QUESTIONS.length}  タイプ数: ${TYPES.length}  ` +
    `MC試行: ${MONTE_CARLO_N.toLocaleString()}\n`
  );

  const expected = calcExpectedScores();
  const primary = countPrimaryHits();
  const range = calcScoreRange();

  console.log(c(COL.DIM, "Monte Carlo 実行中..."));
  const wins = runMonteCarlo(MONTE_CARLO_N);
  console.log(c(COL.DIM, "完了\n"));

  const fairRate = 100 / TYPES.length; // 5.555...%
  const OVER_THRESHOLD = fairRate * 2;  // 11.11%
  const UNDER_THRESHOLD = fairRate * 0.5; // 2.78%

  // ソート: MC 出現率降順
  const sorted = TYPE_IDS.slice().sort(
    (a, b) => (wins[b] ?? 0) - (wins[a] ?? 0)
  );

  // ─── Table 1: 期待スコア + 出現率 ──────────────────────────────────────────
  console.log(c(COL.BOLD, "── 1. 期待スコア & モンテカルロ出現率 ──────────────────────────────────────────"));
  console.log(c(COL.DIM,
    padR("タイプ", 11) +
    padL("期待スコア", 11) +
    padL("(ボーナス)", 11) +
    padL("理論最大", 10) +
    padL("理論最小", 10) +
    padL("勝者数", 9) +
    padL("出現率", 9) +
    "  偏差"
  ));
  console.log(c(COL.DIM, "─".repeat(82)));

  const concerns: string[] = [];

  for (const typeId of sorted) {
    const e = expected[typeId];
    const r = range[typeId];
    const w = wins[typeId] ?? 0;
    const rate = (w / MONTE_CARLO_N) * 100;
    const deviation = rate - fairRate;
    const devStr = (deviation >= 0 ? "+" : "") + fmt(deviation) + "%";

    let rowColor = COL.RESET;
    let alert = "";
    if (rate >= OVER_THRESHOLD) {
      rowColor = COL.RED;
      alert = " ⚠ 過多";
      concerns.push(typeId);
    } else if (rate <= UNDER_THRESHOLD) {
      rowColor = COL.YELLOW;
      alert = " ⚠ 過少";
      concerns.push(typeId);
    }

    console.log(
      c(rowColor,
        padR(typeId, 11) +
        padL(fmt(e.totalExpected), 11) +
        padL("(+" + fmt(e.bonusExpected) + ")", 11) +
        padL(fmt(r.max), 10) +
        padL(fmt(r.min, 0), 10) +
        padL(w.toString(), 9) +
        padL(fmt(rate) + "%", 9) +
        "  " + devStr + alert
      )
    );
  }

  console.log(
    c(COL.DIM, `\n均等出現率: ${fmt(fairRate)}%  ` +
      `過多閾値: >${fmt(OVER_THRESHOLD)}%  過少閾値: <${fmt(UNDER_THRESHOLD)}%`)
  );

  // ─── Table 2: 主加点オプション数 ───────────────────────────────────────────
  console.log(c(COL.BOLD, "\n── 2. 主加点（+3）オプション数 ─────────────────────────────────────────────────"));
  console.log(c(COL.DIM,
    padR("タイプ", 11) + padL("+3オプ数", 10) + padL("質問数", 8) + "  適用質問"
  ));
  console.log(c(COL.DIM, "─".repeat(70)));

  const sortedByPrimary = TYPE_IDS.slice().sort(
    (a, b) => primary[b].optionCount - primary[a].optionCount
  );

  for (const typeId of sortedByPrimary) {
    const p = primary[typeId];
    const color = p.optionCount < 2 ? COL.YELLOW : COL.RESET;
    console.log(
      c(color,
        padR(typeId, 11) +
        padL(p.optionCount.toString(), 10) +
        padL(p.questions.length.toString(), 8) +
        "  " + p.questions.join(", ")
      )
    );
  }
  console.log(c(COL.DIM, "\n設計ルール: 各タイプの主加点（+3）は全オプション通じて 2個以上"));

  // ─── Table 3: ゼロ貢献質問 ─────────────────────────────────────────────────
  const typesWithZero = TYPE_IDS.filter((id) => range[id].zeroQuestions.length > 0);
  if (typesWithZero.length > 0) {
    console.log(c(COL.BOLD, "\n── 3. 得点ゼロの質問（いずれの選択肢も 0点）────────────────────────────────────"));
    console.log(c(COL.DIM, padR("タイプ", 11) + padL("ゼロ質問数", 12) + "  質問 ID"));
    console.log(c(COL.DIM, "─".repeat(60)));
    for (const typeId of typesWithZero.sort(
      (a, b) => range[b].zeroQuestions.length - range[a].zeroQuestions.length
    )) {
      const zq = range[typeId].zeroQuestions;
      console.log(
        c(COL.YELLOW,
          padR(typeId, 11) +
          padL(zq.length.toString(), 12) +
          "  " + zq.join(", ")
        )
      );
    }
    console.log(c(COL.DIM, "\n参考: ゼロ質問数が多いほどそのタイプが出にくい傾向"));
  } else {
    console.log(c(COL.GREEN, "\n✅ 全タイプ：全質問で少なくとも 1選択肢以上に得点あり"));
  }

  // ─── 懸念タイプサマリー ────────────────────────────────────────────────────
  if (concerns.length > 0) {
    console.log(c(COL.BOLD, `\n── ⚠  懸念タイプ一覧（出現率が均等値の 2× 超 or 0.5× 未満）──────────────────────`));
    for (const typeId of concerns) {
      const rate = ((wins[typeId] ?? 0) / MONTE_CARLO_N) * 100;
      const deviation = rate - fairRate;
      const direction = deviation > 0 ? "過多" : "過少";
      const e = expected[typeId];
      const p = primary[typeId];
      console.log(
        c(deviation > 0 ? COL.RED : COL.YELLOW,
          `  ${padR(typeId, 10)} 出現率 ${fmt(rate)}%（偏差 ${deviation >= 0 ? "+" : ""}${fmt(deviation)}%、${direction}）` +
          `  期待スコア: ${fmt(e.totalExpected)}  主加点オプ数: ${p.optionCount}`
        )
      );
    }
    console.log(c(COL.DIM, `\n  → 「過多」タイプ: 主加点オプションを減らす or 他タイプに配分`));
    console.log(c(COL.DIM, `  → 「過少」タイプ: 主加点オプションを増やす or 質問へのゼロ貢献を減らす`));
  } else {
    console.log(c(COL.GREEN, "\n✅ 懸念タイプなし（全タイプ 均等値の 0.5× ～ 2× 以内）"));
  }

  console.log(c(COL.BOLD, "\n=== 完了 ===\n"));
}

main();
