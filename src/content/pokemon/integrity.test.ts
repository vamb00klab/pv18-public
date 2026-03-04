/**
 * Content pack integrity tests — pokemon pack.
 *
 * Run: npm test
 */
import { describe, it, expect } from "vitest";
import { pokemonTypes } from "./types";
import { pokemonQuestions } from "./questions";
import { appConfig } from "@/lib/config";
import { SONGS } from "@/data/songs";

const EXPECTED_TYPE_COUNT = 18;
const EXPECTED_QUESTION_COUNT = 15;

describe("pokemon content pack — types", () => {
  it(`has exactly ${EXPECTED_TYPE_COUNT} types`, () => {
    expect(pokemonTypes).toHaveLength(EXPECTED_TYPE_COUNT);
  });

  it("type count matches appConfig.totalTypes", () => {
    expect(pokemonTypes).toHaveLength(appConfig.totalTypes);
  });

  it("has no duplicate type_ids", () => {
    const ids = pokemonTypes.map((t) => t.type_id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every type has non-empty required string fields", () => {
    for (const t of pokemonTypes) {
      expect(t.type_id.length, `type_id empty: ${t.type_id}`).toBeGreaterThan(0);
      expect(t.label.length, `label empty for ${t.type_id}`).toBeGreaterThan(0);
      expect(t.shortLabel.length, `shortLabel empty for ${t.type_id}`).toBeGreaterThan(0);
      expect(t.description.length, `description empty for ${t.type_id}`).toBeGreaterThan(0);
      expect(t.traits.length, `traits empty for ${t.type_id}`).toBeGreaterThan(0);
    }
  });

  it("every type has valid hex color values", () => {
    const hexRe = /^#[0-9A-Fa-f]{6}$/;
    for (const t of pokemonTypes) {
      expect(t.color, `color invalid for ${t.type_id}`).toMatch(hexRe);
      expect(t.bgColor, `bgColor invalid for ${t.type_id}`).toMatch(hexRe);
    }
  });

  it("every type has suitableFor (4 items), strengths (2 items), weaknesses (2 items)", () => {
    for (const t of pokemonTypes) {
      expect(t.suitableFor?.length, `suitableFor missing or wrong count for ${t.type_id}`).toBe(4);
      expect(t.strengths?.length, `strengths missing or wrong count for ${t.type_id}`).toBe(2);
      expect(t.weaknesses?.length, `weaknesses missing or wrong count for ${t.type_id}`).toBe(2);
    }
  });
});

describe("pokemon content pack — questions", () => {
  it(`has exactly ${EXPECTED_QUESTION_COUNT} questions`, () => {
    expect(pokemonQuestions).toHaveLength(EXPECTED_QUESTION_COUNT);
  });

  it("has no duplicate question ids", () => {
    const ids = pokemonQuestions.map((q) => q.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every question has at least 2 options", () => {
    for (const q of pokemonQuestions) {
      expect(q.options.length, `too few options in ${q.id}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("has no duplicate option ids within a question", () => {
    for (const q of pokemonQuestions) {
      const ids = q.options.map((o) => o.id);
      const unique = new Set(ids);
      expect(unique.size, `duplicate option id in ${q.id}`).toBe(ids.length);
    }
  });

  it("no option id is duplicated across questions", () => {
    const allOptionIds = pokemonQuestions.flatMap((q) => q.options.map((o) => o.id));
    const unique = new Set(allOptionIds);
    expect(unique.size).toBe(allOptionIds.length);
  });
});

describe("pokemon content pack — scoreMap integrity", () => {
  const knownTypeIds = new Set(pokemonTypes.map((t) => t.type_id));

  it("all scoreMap keys are known type_ids", () => {
    for (const q of pokemonQuestions) {
      for (const option of q.options) {
        for (const key of Object.keys(option.scoreMap)) {
          expect(
            knownTypeIds.has(key),
            `Unknown type_id "${key}" in scoreMap of option ${option.id}`
          ).toBe(true);
        }
      }
    }
  });

  it("no option has an empty scoreMap", () => {
    for (const q of pokemonQuestions) {
      for (const option of q.options) {
        expect(
          Object.keys(option.scoreMap).length,
          `Empty scoreMap in option ${option.id}`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every type is reachable (awarded points by at least one option)", () => {
    const reachable = new Set<string>();
    for (const q of pokemonQuestions) {
      for (const option of q.options) {
        for (const key of Object.keys(option.scoreMap)) {
          reachable.add(key);
        }
      }
    }
    for (const t of pokemonTypes) {
      expect(
        reachable.has(t.type_id),
        `Type "${t.type_id}" is never awarded points by any question option`
      ).toBe(true);
    }
  });
});

describe("songs — karaoke data integrity", () => {
  const songsWithKaraoke = SONGS.filter((s) => s.karaoke);
  const songsWithKaraokeUrls = songsWithKaraoke.filter(
    (s) => s.karaoke!.joysound || s.karaoke!.dam
  );

  it("karaoke field with URLs has at least one URL", () => {
    for (const s of songsWithKaraokeUrls) {
      const { joysound, dam } = s.karaoke!;
      expect(
        joysound || dam,
        `Song "${s.id}" has karaoke but no URLs`
      ).toBeTruthy();
    }
  });

  it("karaoke URLs start with https://", () => {
    for (const s of songsWithKaraokeUrls) {
      const { joysound, dam } = s.karaoke!;
      if (joysound) {
        expect(joysound, `JOYSOUND URL invalid for ${s.id}`).toMatch(/^https:\/\//);
      }
      if (dam) {
        expect(dam, `DAM URL invalid for ${s.id}`).toMatch(/^https:\/\//);
      }
    }
  });

  it("no duplicate karaoke URLs across songs", () => {
    const joyUrls = songsWithKaraokeUrls.map((s) => s.karaoke!.joysound).filter(Boolean);
    const damUrls = songsWithKaraokeUrls.map((s) => s.karaoke!.dam).filter(Boolean);
    expect(new Set(joyUrls).size, "duplicate JOYSOUND URLs").toBe(joyUrls.length);
    expect(new Set(damUrls).size, "duplicate DAM URLs").toBe(damUrls.length);
  });
});
