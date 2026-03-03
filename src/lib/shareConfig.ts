/**
 * Share text & hashtag configuration — single source of truth.
 *
 * All share text builders and OGP image hashtag chips import from here.
 * To update hashtags, edit this file only.
 */

export const HASHTAGS = {
  result: ["#ポケミク", "#ポケミクタイプ診断"] as const,
  recommend: ["#ポケミク", "#ポケミクおすすめ"] as const,
  lp: ["#ポケミク", "#ポケミクタイプ診断"] as const,
} as const;

export function buildResultShareText(typeLabel: string): string {
  return `私は「${typeLabel}」でした！\nキミは何タイプ？\n${HASHTAGS.result.join(" ")}`;
}

export function buildRecommendShareText(
  title: string,
  artist: string
): string {
  return `今の気分で選んだら「${title} / ${artist}」だった！\n${HASHTAGS.recommend.join(" ")}`;
}
