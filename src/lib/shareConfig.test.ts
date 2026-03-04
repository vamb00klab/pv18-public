import { describe, expect, it } from "vitest";
import {
  HASHTAGS,
  buildResultShareText,
  buildRecommendShareText,
  buildSetlistShareText,
} from "./shareConfig";

describe("HASHTAGS", () => {
  it("result hashtags snapshot", () => {
    expect(HASHTAGS.result).toMatchInlineSnapshot(`
      [
        "#ポケミク",
        "#ポケミクタイプ診断",
      ]
    `);
  });

  it("recommend hashtags snapshot", () => {
    expect(HASHTAGS.recommend).toMatchInlineSnapshot(`
      [
        "#ポケミク",
        "#ポケミクおすすめ",
      ]
    `);
  });

  it("lp hashtags snapshot", () => {
    expect(HASHTAGS.lp).toMatchInlineSnapshot(`
      [
        "#ポケミク",
        "#ポケミクタイプ診断",
      ]
    `);
  });

  it("live hashtags snapshot", () => {
    expect(HASHTAGS.live).toMatchInlineSnapshot(`
      [
        "#ポケミク",
        "#ポケミクLIVE",
      ]
    `);
  });
});

describe("buildResultShareText", () => {
  it("generates expected share text", () => {
    expect(buildResultShareText("ほのおタイプ")).toMatchInlineSnapshot(`
      "私は「ほのおタイプ」でした！
      キミは何タイプ？
      #ポケミク #ポケミクタイプ診断"
    `);
  });

  it("includes typeLabel in output", () => {
    const text = buildResultShareText("みずタイプ");
    expect(text).toContain("みずタイプ");
  });

  it("includes result hashtags", () => {
    const text = buildResultShareText("でんきタイプ");
    for (const tag of HASHTAGS.result) {
      expect(text).toContain(tag);
    }
  });
});

describe("buildRecommendShareText", () => {
  it("generates expected share text", () => {
    expect(
      buildRecommendShareText("劣等上等", "Giga & 鏡音リン・レン")
    ).toMatchInlineSnapshot(`
      "今の気分で選んだら「劣等上等 / Giga & 鏡音リン・レン」だった！
      #ポケミク #ポケミクおすすめ"
    `);
  });

  it("includes title and artist in output", () => {
    const text = buildRecommendShareText("砂の惑星", "ハチ feat. 初音ミク");
    expect(text).toContain("砂の惑星");
    expect(text).toContain("ハチ feat. 初音ミク");
  });

  it("includes recommend hashtags", () => {
    const text = buildRecommendShareText("テスト曲", "テストアーティスト");
    for (const tag of HASHTAGS.recommend) {
      expect(text).toContain(tag);
    }
  });
});

describe("buildSetlistShareText", () => {
  it("generates expected share text with all fields", () => {
    expect(
      buildSetlistShareText("ボルテッカー", "Glorious Day", "チャンピオン", "楽しみ！")
    ).toMatchInlineSnapshot(`
      "【ポケミク LIVE セトリ予想】
      1曲目: ボルテッカー
      ラスト: Glorious Day
      最盛り上がり: チャンピオン
      楽しみ！
      #ポケミク #ポケミクLIVE"
    `);
  });

  it("generates text with partial fields", () => {
    expect(
      buildSetlistShareText("ボルテッカー", null, null, "")
    ).toMatchInlineSnapshot(`
      "【ポケミク LIVE セトリ予想】
      1曲目: ボルテッカー
      #ポケミク #ポケミクLIVE"
    `);
  });

  it("includes live hashtags", () => {
    const text = buildSetlistShareText(null, null, null, "");
    for (const tag of HASHTAGS.live) {
      expect(text).toContain(tag);
    }
  });
});
