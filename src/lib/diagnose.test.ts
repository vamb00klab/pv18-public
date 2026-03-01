import { describe, it, expect } from "vitest";
import { calculateScores, determineResult, diagnose } from "./diagnose";
import type { Question, Answer } from "@/types/quiz";
import type { PersonaType } from "@/types/persona";

// ── Minimal fixtures ────────────────────────────────────────────────────────

const mockTypes: PersonaType[] = [
  {
    type_id: "alpha",
    label: "Alpha",
    shortLabel: "A",
    description: "",
    traits: [],
    color: "#000",
    bgColor: "#fff",
  },
  {
    type_id: "beta",
    label: "Beta",
    shortLabel: "B",
    description: "",
    traits: [],
    color: "#111",
    bgColor: "#eee",
  },
  {
    type_id: "gamma",
    label: "Gamma",
    shortLabel: "G",
    description: "",
    traits: [],
    color: "#222",
    bgColor: "#ddd",
  },
];

const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "Question 1",
    options: [
      { id: "q1a", text: "Option A", scoreMap: { alpha: 3, beta: 1 } },
      { id: "q1b", text: "Option B", scoreMap: { beta: 3, gamma: 1 } },
    ],
  },
  {
    id: "q2",
    text: "Question 2",
    options: [
      { id: "q2a", text: "Option A", scoreMap: { alpha: 2, gamma: 2 } },
      { id: "q2b", text: "Option B", scoreMap: { gamma: 3, beta: 1 } },
    ],
  },
];

// ── calculateScores ──────────────────────────────────────────────────────────

describe("calculateScores", () => {
  it("accumulates scores from multiple answers", () => {
    const answers: Answer[] = [
      { questionId: "q1", optionId: "q1a" }, // alpha+3, beta+1
      { questionId: "q2", optionId: "q2a" }, // alpha+2, gamma+2
    ];
    const scores = calculateScores(answers, mockQuestions);
    expect(scores.alpha).toBe(5);
    expect(scores.beta).toBe(1);
    expect(scores.gamma).toBe(2);
  });

  it("returns empty object for empty answers", () => {
    expect(calculateScores([], mockQuestions)).toEqual({});
  });

  it("ignores answers with unknown questionId", () => {
    const answers: Answer[] = [{ questionId: "nonexistent", optionId: "q1a" }];
    expect(calculateScores(answers, mockQuestions)).toEqual({});
  });

  it("ignores answers with unknown optionId", () => {
    const answers: Answer[] = [{ questionId: "q1", optionId: "nonexistent" }];
    expect(calculateScores(answers, mockQuestions)).toEqual({});
  });

  it("accumulates correctly across multiple questions picking same type", () => {
    const answers: Answer[] = [
      { questionId: "q1", optionId: "q1a" }, // alpha+3
      { questionId: "q2", optionId: "q2a" }, // alpha+2
    ];
    const scores = calculateScores(answers, mockQuestions);
    expect(scores.alpha).toBe(5);
  });
});

// ── determineResult ──────────────────────────────────────────────────────────

describe("determineResult", () => {
  it("returns type with highest score", () => {
    const result = determineResult({ alpha: 5, beta: 3, gamma: 4 }, mockTypes);
    expect(result.type_id).toBe("alpha");
  });

  it("tie-break: earlier entry in types array wins", () => {
    // alpha and beta tied; alpha is at index 0
    const result = determineResult({ alpha: 5, beta: 5, gamma: 3 }, mockTypes);
    expect(result.type_id).toBe("alpha");
  });

  it("tie-break between middle and last: middle wins", () => {
    const result = determineResult({ alpha: 3, beta: 5, gamma: 5 }, mockTypes);
    expect(result.type_id).toBe("beta");
  });

  it("handles scores with all zeros (first type wins)", () => {
    const result = determineResult({}, mockTypes);
    expect(result.type_id).toBe("alpha");
  });

  it("throws when types array is empty", () => {
    expect(() => determineResult({}, [])).toThrow();
  });
});

// ── diagnose ────────────────────────────────────────────────────────────────

describe("diagnose", () => {
  it("returns correct result, scores and topScore", () => {
    const answers: Answer[] = [
      { questionId: "q1", optionId: "q1a" }, // alpha+3, beta+1
      { questionId: "q2", optionId: "q2b" }, // gamma+3, beta+1
    ];
    const { result, scores, topScore } = diagnose(
      answers,
      mockQuestions,
      mockTypes
    );

    // alpha=3, beta=2, gamma=3 → tie alpha vs gamma → alpha wins (index 0)
    expect(scores.alpha).toBe(3);
    expect(scores.beta).toBe(2);
    expect(scores.gamma).toBe(3);
    expect(result.type_id).toBe("alpha");
    expect(topScore).toBe(3);
  });

  it("returns first type when no answers", () => {
    const { result, topScore } = diagnose([], mockQuestions, mockTypes);
    expect(result.type_id).toBe("alpha");
    expect(topScore).toBe(0);
  });
});
