/**
 * Question selection utility — category-aware shuffle and draw.
 *
 * Usage:
 *   const questions = selectQuestions(pack.questions, pack.questionConfig);
 *   // → shuffled subset (or original array if no config)
 *
 * Algorithm:
 *   1. Filter questions by category ("daily" / "world")
 *   2. Fisher-Yates shuffle each category pool independently
 *   3. Take the first N from each pool (N = config.daily / config.world)
 *   4. Concatenate: daily questions first, then world questions
 *   5. Shuffle options within each question independently
 *
 * If config is undefined (e.g. neutral pack), the original array is returned
 * unchanged — no randomization, no filtering.
 */
import type { Question, QuestionConfig } from "@/types/quiz";

/** Fisher-Yates in-place shuffle (returns a new array) */
function shuffled<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Select and order questions for a quiz session.
 *
 * ⚠️  SSR/Hydration 注意: この関数は Math.random() を使用する。
 *    クライアントコンポーネントの useState lazy init や render 内で呼ぶと
 *    SSR とハイドレーションで異なる結果になり hydration mismatch が起きる。
 *    必ずサーバーコンポーネントで呼び出し、結果を props で渡すこと。
 *    （正しい使用例: src/app/quiz/page.tsx）
 *
 * @param questions - Full question pool from the content pack
 * @param config    - Selection config (daily/world counts). Omit for fixed order.
 * @returns         - Selected and ordered questions (daily first, then world)
 */
export function selectQuestions(
  questions: Question[],
  config: QuestionConfig | undefined
): Question[] {
  if (!config) return questions;

  const daily = shuffled(questions.filter((q) => q.category === "daily")).slice(
    0,
    config.daily
  );
  const world = shuffled(questions.filter((q) => q.category === "world")).slice(
    0,
    config.world
  );

  return [...daily, ...world].map((q) => ({ ...q, options: shuffled(q.options) }));
}
