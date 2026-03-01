/**
 * Core diagnosis logic — IP-agnostic, data-driven.
 *
 * Steps:
 *   1. calculateScores: accumulate per-type scores from answers
 *   2. determineResult: pick the top-scoring type (tie-break: array order)
 *   3. diagnose: combined entry point
 */
import type { Question, Answer } from "@/types/quiz";
import type { PersonaType } from "@/types/persona";

/**
 * Accumulate per-type scores by walking through answers and their scoreMap.
 *
 * @param answers  - recorded answer list
 * @param questions - full question definitions (with scoreMap per option)
 * @returns map of type_id → total score
 */
export function calculateScores(
  answers: Answer[],
  questions: Question[]
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const option = question.options.find((o) => o.id === answer.optionId);
    if (!option) continue;

    for (const [typeId, delta] of Object.entries(option.scoreMap)) {
      scores[typeId] = (scores[typeId] ?? 0) + (delta ?? 0);
    }
  }

  return scores;
}

/**
 * Determine the result type from a scores map.
 *
 * Tie-break rule: if two types share the same top score, the one that
 * appears earlier in the `types` array wins. This is stable and deterministic.
 *
 * @param scores - output of calculateScores
 * @param types  - ordered type definitions (order matters for tie-breaking)
 */
export function determineResult(
  scores: Record<string, number>,
  types: PersonaType[]
): PersonaType {
  if (types.length === 0) throw new Error("types array must not be empty");

  return types.reduce((best, current) => {
    const bestScore = scores[best.type_id] ?? 0;
    const currentScore = scores[current.type_id] ?? 0;
    // Strictly greater — tie stays with earlier (best) entry
    return currentScore > bestScore ? current : best;
  });
}

export interface DiagnoseResult {
  /** The winning PersonaType */
  result: PersonaType;
  /** Full score map for all types */
  scores: Record<string, number>;
  /** Score of the winning type */
  topScore: number;
}

/**
 * Main entry point: answers + question defs + type defs → diagnosis.
 */
export function diagnose(
  answers: Answer[],
  questions: Question[],
  types: PersonaType[]
): DiagnoseResult {
  const scores = calculateScores(answers, questions);
  const result = determineResult(scores, types);
  return {
    result,
    scores,
    topScore: scores[result.type_id] ?? 0,
  };
}
