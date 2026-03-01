/** ボカロキャラクター表示名マッピング */
export const VOCALOID_LABEL: Record<string, string> = {
  miku:  '初音ミク',
  rin:   '鏡音リン',
  len:   '鏡音レン',
  luka:  '巡音ルカ',
  kaito: 'KAITO',
  meiko: 'MEIKO',
  teto:  '重音テト',
}

/**
 * 楽曲のボーカリスト表記文字列を返す。
 * vocalist_label が設定されていればそれを優先する。
 * @returns " / ボカロ名・..." 形式（先頭スペース含む）、または空文字
 */
export function buildFeatStr(song: { vocaloids: string[]; vocalist_label?: string }): string {
  if (song.vocalist_label) return ' / ' + song.vocalist_label
  if (song.vocaloids.length === 0) return ''
  return ' / ' + song.vocaloids.map(v => VOCALOID_LABEL[v] ?? v).join('・')
}
