/**
 * /live ページ — データ整合性 + カウントダウン計算テスト
 */
import { describe, it, expect } from "vitest";
import {
  EVENT_CONFIG,
  getEventPhase,
  calculateCountdown,
  CHECKLIST_ITEMS,
  OFFICIAL_LINKS,
  buildSongOptions,
  FREE_COMMENT_MAX,
} from "./liveData";
import { buildSetlistShareText, HASHTAGS } from "@/lib/shareConfig";
import { SONGS } from "@/data/songs";

/* ── EVENT_CONFIG ──────────────────────────────────────────────────── */

describe("EVENT_CONFIG", () => {
  it("has 3 event dates", () => {
    expect(EVENT_CONFIG.dates).toHaveLength(3);
  });

  it("firstShowStart is before lastShowEnd", () => {
    expect(EVENT_CONFIG.firstShowStart.getTime()).toBeLessThan(
      EVENT_CONFIG.lastShowEnd.getTime(),
    );
  });

  it("officialUrl starts with https", () => {
    expect(EVENT_CONFIG.officialUrl).toMatch(/^https:\/\//);
  });
});

/* ── getEventPhase ─────────────────────────────────────────────────── */

describe("getEventPhase", () => {
  const start = EVENT_CONFIG.firstShowStart.getTime();
  const end = EVENT_CONFIG.lastShowEnd.getTime();

  it("returns 'before' for dates well before the event", () => {
    // 2026-01-01 00:00:00 UTC
    expect(getEventPhase(new Date("2026-01-01T00:00:00Z").getTime())).toBe(
      "before",
    );
  });

  it("returns 'today' on event day before showtime (JST morning)", () => {
    // 2026-03-20 00:30:00 JST = 03:00 UTC → same JST calendar day as start
    const jstMorning = new Date("2026-03-19T15:30:00Z").getTime(); // = 03-20 00:30 JST
    expect(getEventPhase(jstMorning)).toBe("today");
  });

  it("returns 'during' after first show starts", () => {
    expect(getEventPhase(start)).toBe("during");
    expect(getEventPhase(start + 1000)).toBe("during");
  });

  it("returns 'during' mid-event", () => {
    const midEvent = start + (end - start) / 2;
    expect(getEventPhase(midEvent)).toBe("during");
  });

  it("returns 'after' once last show ends", () => {
    expect(getEventPhase(end)).toBe("after");
    expect(getEventPhase(end + 1000)).toBe("after");
  });
});

/* ── calculateCountdown ────────────────────────────────────────────── */

describe("calculateCountdown", () => {
  it("returns all zeros when target is in the past", () => {
    const result = calculateCountdown(1000, 2000);
    expect(result).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    });
  });

  it("calculates 1 day correctly", () => {
    const target = 86400000 + 1000;
    const result = calculateCountdown(target, 1000);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it("breaks down mixed time correctly", () => {
    // 2 days, 3 hours, 45 minutes, 30 seconds
    const ms =
      2 * 86400000 + 3 * 3600000 + 45 * 60000 + 30 * 1000;
    const result = calculateCountdown(ms, 0);
    expect(result.days).toBe(2);
    expect(result.hours).toBe(3);
    expect(result.minutes).toBe(45);
    expect(result.seconds).toBe(30);
  });
});

/* ── Checklist data ────────────────────────────────────────────────── */

describe("CHECKLIST_ITEMS", () => {
  it("has no duplicate ids", () => {
    const ids = CHECKLIST_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every item has non-empty label and emoji", () => {
    for (const item of CHECKLIST_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.emoji.length).toBeGreaterThan(0);
    }
  });

  it('has both "essential" and "recommended" groups', () => {
    const groups = new Set(CHECKLIST_ITEMS.map((i) => i.group));
    expect(groups).toContain("essential");
    expect(groups).toContain("recommended");
  });
});

/* ── Official links ────────────────────────────────────────────────── */

describe("OFFICIAL_LINKS", () => {
  it("every link has valid https URL", () => {
    for (const link of OFFICIAL_LINKS) {
      expect(link.url).toMatch(/^https:\/\//);
    }
  });
});

/* ── buildSongOptions ──────────────────────────────────────────────── */

describe("buildSongOptions", () => {
  it("returns SONGS.length + 2 (未発表 + その他)", () => {
    const options = buildSongOptions(SONGS);
    expect(options).toHaveLength(SONGS.length + 2);
  });

  it("first option is 未発表, last is その他", () => {
    const options = buildSongOptions(SONGS);
    expect(options[0].label).toContain("未発表");
    expect(options[0].label).toMatch(/^#\d+/);
    expect(options[options.length - 1].value).toBe("その他");
    expect(options[options.length - 1].label).toBe("その他");
  });

  it("song options have number prefix and artist", () => {
    const options = buildSongOptions(SONGS);
    // Skip first (未発表) and last (その他)
    const songOptions = options.slice(1, -1);
    for (const opt of songOptions) {
      expect(opt.value.length).toBeGreaterThan(0);
      expect(opt.label).toMatch(/^#\d+ .+ \/ .+$/);
    }
  });

  it("song options sorted descending by release date (newest first)", () => {
    const options = buildSongOptions(SONGS);
    const songOptions = options.slice(1, -1);
    const firstNum = parseInt(songOptions[0].label.match(/^#(\d+)/)?.[1] ?? "0");
    const lastNum = parseInt(songOptions[songOptions.length - 1].label.match(/^#(\d+)/)?.[1] ?? "0");
    expect(firstNum).toBe(SONGS.length);
    expect(lastNum).toBe(1);
  });

  it("song numbers are sequential from 1 to SONGS.length", () => {
    const options = buildSongOptions(SONGS);
    const songOptions = options.slice(1, -1);
    const nums = songOptions.map((o) => parseInt(o.label.match(/^#(\d+)/)?.[1] ?? "0"));
    const sorted = [...nums].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: SONGS.length }, (_, i) => i + 1));
  });
});

/* ── シェアテキスト文字数制限 ────────────────────────────────────── */

describe("share text fits X post limit", () => {
  const X_LIMIT = 280;
  const TCO_URL_LEN = 24; // t.co shortened URL (23) + newline (1)

  it("worst case (longest song × 3 + max free comment + URL) fits in 280 chars", () => {
    const longestTitle = [...SONGS]
      .sort((a, b) => b.title.length - a.title.length)[0].title;

    const text = buildSetlistShareText(
      longestTitle,
      longestTitle,
      longestTitle,
      "あ".repeat(FREE_COMMENT_MAX),
    );
    // text + URL must fit in X_LIMIT
    expect(text.length + TCO_URL_LEN).toBeLessThanOrEqual(X_LIMIT);
  });

  it("FREE_COMMENT_MAX is consistent with share template budget", () => {
    // If someone changes the template or hashtags, this test will catch it
    const templateLen = buildSetlistShareText("", "", "", "").length;
    const longestTitle = [...SONGS]
      .sort((a, b) => b.title.length - a.title.length)[0].title;
    const songBudget = longestTitle.length * 3;
    const available = X_LIMIT - templateLen - songBudget - TCO_URL_LEN;
    expect(FREE_COMMENT_MAX).toBeLessThanOrEqual(available);
  });
});
