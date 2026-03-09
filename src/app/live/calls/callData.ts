/**
 * /live/calls ページ用データ
 *
 * コール＆レスポンス情報の出典:
 * - sourceType: 'artist' = アーティスト本人発信
 * - sourceType: 'fan'    = ファン提案（非公式）
 */

export type CallPart = {
  text: string
  type: 'buildup' | 'call'
}

export type CallEntry = {
  /** 曲名（表示用） */
  songTitle: string
  /** アーティスト名 */
  artist: string
  /** songs.ts の id（あればリンク可能） */
  songId?: string
  /** 出典の種類 */
  sourceType: 'artist' | 'fan'
  /** X ポストの embed 用 URL */
  tweetUrl: string
  /** 出典表示名（@ハンドル等） */
  sourceLabel: string
  /** コール内容（構造化: buildup=前フリ, call=実際のコール） */
  callParts: CallPart[]
  /** 補足テキスト */
  note?: string
  /** 外部リンク（mond 等、詳細が別ページにある場合） */
  externalUrl?: string
  /** 外部リンクのラベル */
  externalLabel?: string
}

export const CALL_ENTRIES: CallEntry[] = [
  {
    songTitle: 'ミライどんなだろう',
    artist: 'Mitchie M',
    songId: 'mirai-donna-daro',
    sourceType: 'artist',
    tweetUrl: 'https://x.com/_MitchieM/status/1962011372474216912',
    sourceLabel: '@_MitchieM',
    callParts: [
      { text: '「ホウオウ・ウォオー」', type: 'call' },
    ],
    note: 'でコール',
  },
  {
    songTitle: 'ビッパの歌',
    artist: 'ワンダフル☆オポチュニティ！',
    songId: 'go-team-bippa',
    sourceType: 'artist',
    tweetUrl: 'https://x.com/WAN_OPO/status/2023349298965127351',
    sourceLabel: '@WAN_OPO',
    callParts: [
      { text: 'B！I！P！P～A～！', type: 'buildup' },
      { text: '「ビッパ！」', type: 'call' },
    ],
    note: 'などのコールガイド',
    externalUrl: 'https://mond.how/ja/topics/eeq9ddv8hpzssck/lt96enz1elw19t1',
    externalLabel: 'コールガイド全文（mond）',
  },
]

/** 出典バッジのラベル */
export const SOURCE_LABEL = {
  artist: 'アーティスト本人',
  fan: 'ファン提案',
} as const
