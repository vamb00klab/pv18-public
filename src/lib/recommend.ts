/**
 * src/lib/recommend.ts
 *
 * 楽曲レコメンドロジック（taxonomy v2）
 *
 * スコアリング方針:
 *   1. feels 一致: +3 点/件（主軸。feels マッチ 0 曲は除外）
 *   2. pokemon_context 一致: +1 点/件（タグ単位。battle 選択 2タグ時も最大+2）
 *   3. pokemon_gen 一致: +2 点
 *   4. vocaloid_pref 一致: +2 点
 *   5. タイブレーク: 殿堂入り > 高評価/名曲 > priority > approx_views の順
 *
 * 上位 TOP_N 曲を返す。スコアが同じ場合はタイブレーク順。
 */

import type {
  Song, RecommendQuery,
  Feel, PokemonContext, EvalGrade,
  PkmnGen, PkmnGenGroup,
} from '@/types/song'

/** レコメンドクエリのグループに含まれる個別世代 */
const GEN_GROUP_MAP: Record<PkmnGenGroup, PkmnGen[]> = {
  'gen1-2': ['gen1', 'gen2'],
  'gen3-5': ['gen3', 'gen4', 'gen5'],
  'gen6+':  ['gen6', 'gen7', 'gen8', 'gen9', 'gen10'],
}

/** タイブレーク用グレード順位（小さいほど優先） */
const GRADE_RANK: Record<EvalGrade, number> = {
  '殿堂入り':   0,
  '高評価/名曲': 1,
}

export const TOP_N = 5

// ---- スコアリング ----

export function scoreSong(song: Song, query: RecommendQuery): number {
  let score = 0

  // 1. feels（クエリで選ばれた feel が曲に含まれるか）
  for (const feel of query.feels) {
    if (song.feels.includes(feel)) score += 3
  }

  // 2. pokemon_context（クエリで選ばれた context が曲に含まれるか）
  //    +1/タグ: battle 選択時 2タグ展開でも最大 +2 に抑制し feels と同等にする
  if (query.pokemon_context) {
    for (const ctx of query.pokemon_context) {
      if (song.pokemon_context.includes(ctx)) score += 1
    }
  }

  // 3. pokemon_gen（選択グループのいずれかに曲の個別世代が含まれるか）
  if (query.pokemon_gen && query.pokemon_gen.length > 0 && song.pokemon_gen) {
    const matched = query.pokemon_gen.some(grp =>
      GEN_GROUP_MAP[grp].includes(song.pokemon_gen!)
    )
    if (matched) score += 2
  }

  // 4. vocaloid_pref（選択キャラのいずれかが曲に参加しているか）
  if (query.vocaloid_pref && query.vocaloid_pref.length > 0) {
    const OTHER_CHARS = ['luka', 'kaito', 'meiko', 'teto'] as const
    const matched = query.vocaloid_pref.some(pref => {
      if (pref === 'rin_len') return song.vocaloids.includes('rin') || song.vocaloids.includes('len')
      if (pref === 'other') return OTHER_CHARS.some(c => song.vocaloids.includes(c))
      return song.vocaloids.includes(pref)
    })
    if (matched) score += 2
  }

  return score
}

// ---- 推薦理由タグ生成 ----

const FEEL_LABEL: Record<Feel, string> = {
  '感動/泣ける':   '感動系',
  '懐かしい':      '懐かしさ',
  'かわいい':      'かわいい',
  'かっこいい':    'かっこいい',
  'チル/癒し':     'チル・癒し',
  '疾走感/ノリ':   '疾走感',
  '中毒性/リピート': '中毒性あり',
}

const CONTEXT_LABEL: Partial<Record<PokemonContext, string>> = {
  'ゲーム体験/対戦・戦術':   'バトル要素',
  'ライバル・チャンピオン文脈': 'ライバル・チャンピオン',
  '旅と冒険/旅立ち・道中':   '旅と冒険',
  '相棒と絆/関係深化':       '相棒との絆',
  'アニポケ参照':             'アニポケ',
  'ゲーム体験/演出・SE・UI': 'ゲーム演出',
}

export function buildReasonTags(song: Song, query: RecommendQuery): string[] {
  const tags: string[] = []

  for (const feel of query.feels) {
    if (song.feels.includes(feel)) {
      tags.push(FEEL_LABEL[feel])
    }
  }

  if (query.pokemon_context) {
    for (const ctx of query.pokemon_context) {
      if (song.pokemon_context.includes(ctx)) {
        const label = CONTEXT_LABEL[ctx]
        if (label) tags.push(label)
      }
    }
  }

  if (query.pokemon_gen && query.pokemon_gen.length > 0 && song.pokemon_gen) {
    const genLabel: Record<PkmnGenGroup, string> = {
      'gen1-2': '第1・2世代のポケモン',
      'gen3-5': '第3〜5世代のポケモン',
      'gen6+':  '第6世代以降のポケモン',
    }
    const matchedGrp = query.pokemon_gen.find(grp =>
      GEN_GROUP_MAP[grp].includes(song.pokemon_gen!)
    )
    if (matchedGrp) tags.push(genLabel[matchedGrp])
  }

  if (query.vocaloid_pref && query.vocaloid_pref.length > 0) {
    const vocaloidLabel: Record<string, string> = {
      miku:    'ミク参加',
      rin_len: 'リン/レン参加',
      other:   '他キャラ参加',
    }
    const OTHER_CHARS = ['luka', 'kaito', 'meiko', 'teto'] as const
    const matchedPref = query.vocaloid_pref.find(pref => {
      if (pref === 'rin_len') return song.vocaloids.includes('rin') || song.vocaloids.includes('len')
      if (pref === 'other') return OTHER_CHARS.some(c => song.vocaloids.includes(c))
      return song.vocaloids.includes(pref)
    })
    if (matchedPref) tags.push(vocaloidLabel[matchedPref])
  }

  return tags
}

// ---- タイブレーク用ヘルパー ----

function gradeRank(song: Song): number {
  if (song.grade === undefined) return 2
  return GRADE_RANK[song.grade]
}

// ---- メイン: recommend ----

export type ScoredSong = {
  song: Song
  score: number
  reasonTags: string[]
}

export function recommend(songs: Song[], query: RecommendQuery): ScoredSong[] {
  const scored = songs
    .map((song) => ({
      song,
      score: scoreSong(song, query),
      reasonTags: buildReasonTags(song, query),
    }))
    .filter(({ song, score }) => {
      if (score === 0) return false
      // feels が指定されている場合、feels が 1 件もマッチしない曲は除外
      // → gen/vocaloid のみで感情的に合わない曲が上位に来る「外れ」を防ぐ
      if (query.feels.length > 0) {
        const hasFeelMatch = query.feels.some(f => song.feels.includes(f))
        if (!hasFeelMatch) return false
      }
      return true
    })
    .sort((a, b) => {
      // 1. スコア降順
      if (b.score !== a.score) return b.score - a.score
      // 2. grade 優先（殿堂入り > 高評価/名曲 > なし）
      const ga = gradeRank(a.song)
      const gb = gradeRank(b.song)
      if (ga !== gb) return ga - gb
      // 3. priority 降順
      const pa = a.song.priority ?? 0
      const pb = b.song.priority ?? 0
      if (pa !== pb) return pb - pa
      // 4. approx_views 降順
      return b.song.approx_views - a.song.approx_views
    })

  // スコアが 0 の曲しかなかった場合（理論上はほぼ起きない）は grade 上位から返す
  if (scored.length === 0) {
    return songs
      .slice()
      .sort((a, b) => {
        const ga = gradeRank(a)
        const gb = gradeRank(b)
        if (ga !== gb) return ga - gb
        return b.approx_views - a.approx_views
      })
      .slice(0, TOP_N)
      .map((song) => ({ song, score: 0, reasonTags: [] }))
  }

  return scored.slice(0, TOP_N)
}
