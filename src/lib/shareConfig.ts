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
  live: ["#ポケミク", "#ポケミクLIVE"] as const,
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

export function buildSetlistShareText(
  firstSong: string | null,
  lastSong: string | null,
  hypeSong: string | null,
  freeComment: string,
  siteUrl?: string,
): string {
  const parts: string[] = ["【ポケミク LIVE セトリ予想】"];
  if (firstSong) parts.push(`1曲目: ${firstSong}`);
  if (lastSong) parts.push(`ラスト: ${lastSong}`);
  if (hypeSong) parts.push(`最盛り上がり: ${hypeSong}`);
  if (freeComment.trim()) parts.push(freeComment.trim());
  parts.push(HASHTAGS.live.join(" "));
  if (siteUrl) parts.push(siteUrl);
  return parts.join("\n");
}
