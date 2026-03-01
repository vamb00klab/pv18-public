/**
 * Tests for src/lib/answerUrl.ts
 *
 * Covers:
 * - compact v1 encode/decode round-trip
 * - legacy v0 decode backward-compat
 * - all AnswerDecodeError branches
 */
import { describe, it, expect } from "vitest";
import {
  encodeAnswers,
  decodeAnswers,
  getDecodeErrorMessage,
} from "./answerUrl";
import type { Answer } from "@/types/quiz";

// ── fixtures ──────────────────────────────────────────────────────────────────

const ANSWERS_15: Answer[] = Array.from({ length: 15 }, (_, i) => ({
  questionId: `q${String(i + 1).padStart(2, "0")}`,
  optionId: `q${String(i + 1).padStart(2, "0")}${"abcd"[i % 4]}`,
}));

const ANSWERS_1: Answer[] = [
  { questionId: "q01", optionId: "q01a" },
];

// ── compact encode ────────────────────────────────────────────────────────────

describe("encodeAnswers (compact v1)", () => {
  it("encodes single answer to 3 chars", () => {
    expect(encodeAnswers(ANSWERS_1)).toBe("01a");
  });

  it("encodes 15 answers to 45 chars", () => {
    expect(encodeAnswers(ANSWERS_15)).toHaveLength(45);
  });

  it("output contains only [0-9a-f]{2}[a-d] groups", () => {
    const encoded = encodeAnswers(ANSWERS_15);
    expect(encoded).toMatch(/^([0-9a-f]{2}[a-d])+$/);
  });

  it("encodes q15 as '0f'", () => {
    const encoded = encodeAnswers([{ questionId: "q15", optionId: "q15d" }]);
    expect(encoded).toBe("0fd");
  });

  it("is much shorter than legacy format", () => {
    const compact = encodeAnswers(ANSWERS_15);
    const legacy = btoa(
      encodeURIComponent(JSON.stringify(ANSWERS_15))
    );
    expect(compact.length).toBeLessThan(legacy.length / 10);
  });
});

// ── compact round-trip ────────────────────────────────────────────────────────

describe("decodeAnswers — compact v1 round-trip", () => {
  it("round-trips 1 answer", () => {
    const result = decodeAnswers(encodeAnswers(ANSWERS_1));
    expect(result).toEqual({ ok: true, answers: ANSWERS_1 });
  });

  it("round-trips 15 answers", () => {
    const result = decodeAnswers(encodeAnswers(ANSWERS_15));
    expect(result).toEqual({ ok: true, answers: ANSWERS_15 });
  });

  it("round-trips q15 → option d", () => {
    const answer: Answer[] = [{ questionId: "q15", optionId: "q15d" }];
    expect(decodeAnswers(encodeAnswers(answer))).toEqual({
      ok: true,
      answers: answer,
    });
  });
});

// ── legacy v0 backward compat ─────────────────────────────────────────────────

describe("decodeAnswers — legacy v0 backward-compat", () => {
  it("decodes a legacy-encoded URL", () => {
    const legacy = btoa(encodeURIComponent(JSON.stringify(ANSWERS_1)));
    const result = decodeAnswers(legacy);
    expect(result).toEqual({ ok: true, answers: ANSWERS_1 });
  });

  it("decodes 15-answer legacy URL", () => {
    const legacy = btoa(encodeURIComponent(JSON.stringify(ANSWERS_15)));
    const result = decodeAnswers(legacy);
    expect(result).toEqual({ ok: true, answers: ANSWERS_15 });
  });
});

// ── error cases ───────────────────────────────────────────────────────────────

describe("decodeAnswers — error cases", () => {
  it("returns missing for null", () => {
    expect(decodeAnswers(null)).toEqual({ ok: false, error: "missing" });
  });

  it("returns missing for undefined", () => {
    expect(decodeAnswers(undefined)).toEqual({ ok: false, error: "missing" });
  });

  it("returns missing for empty string", () => {
    expect(decodeAnswers("")).toEqual({ ok: false, error: "missing" });
  });

  it("returns too_long for oversized input", () => {
    expect(decodeAnswers("a".repeat(2001))).toEqual({
      ok: false,
      error: "too_long",
    });
  });

  it("returns malformed for random garbage", () => {
    expect(decodeAnswers("!!!garbage!!!")).toEqual({
      ok: false,
      error: "malformed",
    });
  });

  it("returns malformed for invalid base64", () => {
    expect(decodeAnswers("not-valid-base64!!!")).toEqual({
      ok: false,
      error: "malformed",
    });
  });

  it("returns empty for base64 of empty JSON array", () => {
    const empty = btoa(encodeURIComponent(JSON.stringify([])));
    expect(decodeAnswers(empty)).toEqual({ ok: false, error: "empty" });
  });

  it("returns invalid_shape for base64 of wrong object shape", () => {
    const bad = btoa(encodeURIComponent(JSON.stringify([{ foo: "bar" }])));
    expect(decodeAnswers(bad)).toEqual({
      ok: false,
      error: "invalid_shape",
    });
  });
});

// ── error messages ────────────────────────────────────────────────────────────

describe("getDecodeErrorMessage", () => {
  it("returns a non-empty string for every error kind", () => {
    const kinds = [
      "missing",
      "too_long",
      "malformed",
      "empty",
      "invalid_shape",
    ] as const;
    for (const kind of kinds) {
      expect(getDecodeErrorMessage(kind).length).toBeGreaterThan(0);
    }
  });
});
