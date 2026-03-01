/**
 * URL serialization layer for quiz answers.
 *
 * Responsibility: encode/decode Answer[] ↔ URL-safe string only.
 * Does NOT touch storage, sessions, or routing.
 *
 * ## Formats
 *
 * ### Compact (current, v1)
 * Each answer encoded as 3 chars: `{q_hex2}{opt_char}`
 *   - q_hex2  : question number as 2-char lowercase hex ("01"–"0f" for q01–q15)
 *   - opt_char: last character of optionId ("a"/"b"/"c"/"d")
 * Example (15 answers): "01a02b03c04d05a06b07c08d09a0ab0bc0cc0dd0ea0fb" (45 chars)
 * No btoa needed — all characters are URL-safe [0-9a-f] + [a-d].
 *
 * ### Legacy (v0, backward-compat decode only)
 * Format: btoa(encodeURIComponent(JSON.stringify(answers)))
 * Produces ~1344 chars for 15 answers. Kept for decoding old shared URLs.
 */
import type { Answer } from "@/types/quiz";

/** Max length of the encoded ?a= parameter we accept (guards against abuse) */
const MAX_ENCODED_LENGTH = 2000;

// ── Error taxonomy ────────────────────────────────────────────────────────────

export type AnswerDecodeError =
  | "missing" //  ?a= param absent or null
  | "too_long" //  encoded string exceeds MAX_ENCODED_LENGTH
  | "malformed" //  base64 or compact decode failed
  | "empty" //  decoded to empty array
  | "invalid_shape"; //  items missing questionId/optionId fields

export type AnswerDecodeResult =
  | { ok: true; answers: Answer[] }
  | { ok: false; error: AnswerDecodeError };

// ── Compact format (v1) ───────────────────────────────────────────────────────

/**
 * Matches the compact v1 format: one or more groups of 2 hex chars + [a-d].
 * Example: "01a0fb" matches; base64 strings do not.
 */
const COMPACT_RE = /^([0-9a-f]{2}[a-d])+$/;

// ── Encode ────────────────────────────────────────────────────────────────────

/**
 * Encodes answers as a compact URL-safe string (v1 format).
 * Produces 3 chars per answer — ~30× smaller than the legacy format.
 *
 * Assumes:
 * - questionId matches /^q\d+$/ (e.g. "q01", "q15")
 * - optionId ends with a letter "a"–"d" (e.g. "q01a")
 */
export function encodeAnswers(answers: Answer[]): string {
  return answers
    .map(({ questionId, optionId }) => {
      const qNum = parseInt(questionId.slice(1), 10); // "q01" → 1
      const qHex = qNum.toString(16).padStart(2, "0"); // 1 → "01"
      const optChar = optionId[optionId.length - 1]; // "q01a" → "a"
      return qHex + optChar;
    })
    .join("");
}

// ── Decode (with full validation) ─────────────────────────────────────────────

/**
 * Decode and validate answers from a URL parameter value.
 *
 * Tries compact v1 format first; falls back to legacy (v0) for old shared URLs.
 * Always returns a discriminated union — callers must check .ok before
 * accessing .answers. This eliminates silent failures on bad/tampered URLs.
 */
export function decodeAnswers(
  encoded: string | null | undefined
): AnswerDecodeResult {
  if (!encoded) return { ok: false, error: "missing" };
  if (encoded.length > MAX_ENCODED_LENGTH) return { ok: false, error: "too_long" };

  // Try compact v1 format first
  if (COMPACT_RE.test(encoded)) {
    return decodeCompact(encoded);
  }

  // Fall back to legacy v0 format
  return decodeLegacy(encoded);
}

// ── Compact v1 decoder ────────────────────────────────────────────────────────

function decodeCompact(encoded: string): AnswerDecodeResult {
  const answers: Answer[] = [];

  for (let i = 0; i < encoded.length; i += 3) {
    const qHex = encoded.slice(i, i + 2);
    const optChar = encoded[i + 2];

    const qNum = parseInt(qHex, 16);
    if (!qNum || qNum < 1 || qNum > 99) {
      return { ok: false, error: "invalid_shape" };
    }

    const questionId = "q" + qNum.toString().padStart(2, "0"); // 1 → "q01"
    const optionId = questionId + optChar; // "q01" + "a" → "q01a"
    answers.push({ questionId, optionId });
  }

  if (answers.length === 0) return { ok: false, error: "empty" };
  return { ok: true, answers };
}

// ── Legacy v0 decoder ─────────────────────────────────────────────────────────

function decodeLegacy(encoded: string): AnswerDecodeResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return { ok: false, error: "malformed" };
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { ok: false, error: "empty" };
  }

  const validShape = (parsed as unknown[]).every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).questionId === "string" &&
      typeof (item as Record<string, unknown>).optionId === "string"
  );
  if (!validShape) return { ok: false, error: "invalid_shape" };

  return { ok: true, answers: parsed as Answer[] };
}

// ── Human-readable messages ───────────────────────────────────────────────────

const ERROR_MESSAGES: Record<AnswerDecodeError, string> = {
  missing: "診断データが見つかりません。",
  too_long: "URLのデータが長すぎます。",
  malformed: "URLのデータが破損しています。",
  empty: "回答データが空です。",
  invalid_shape: "回答データの形式が不正です。",
};

export function getDecodeErrorMessage(error: AnswerDecodeError): string {
  return ERROR_MESSAGES[error];
}
