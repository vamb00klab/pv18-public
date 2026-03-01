import { describe, it, expect } from 'vitest'
import { scoreSong, recommend, TOP_N } from './recommend'
import type { Song, RecommendQuery } from '@/types/song'

const makeSong = (overrides: Partial<Song>): Song => ({
  id: 'test',
  title: 'Test Song',
  artist: 'Test Artist',
  vocaloids: ['miku'],
  youtube_id: 'XXXXXXXXXX1',
  pokemon_types: [],
  pokemon_names: [],
  pokemon_gen: null,
  feels: [],
  pokemon_context: [],
  lyrics_themes: [],
  approx_views: 1_000_000,
  ...overrides,
})

describe('scoreSong', () => {
  it('feels 1件一致で +3', () => {
    const song = makeSong({ feels: ['感動/泣ける'] })
    const query: RecommendQuery = { feels: ['感動/泣ける'] }
    expect(scoreSong(song, query)).toBe(3)
  })

  it('feels 2件一致で +6', () => {
    const song = makeSong({ feels: ['感動/泣ける', '懐かしい'] })
    const query: RecommendQuery = { feels: ['感動/泣ける', '懐かしい'] }
    expect(scoreSong(song, query)).toBe(6)
  })

  it('feels 不一致では加点なし', () => {
    const song = makeSong({ feels: ['かわいい'] })
    const query: RecommendQuery = { feels: ['かっこいい'] }
    expect(scoreSong(song, query)).toBe(0)
  })

  it('pokemon_context 1件一致で +1（feels +3 との合計 +4）', () => {
    const song = makeSong({
      feels: ['懐かしい'],
      pokemon_context: ['ゲーム体験/対戦・戦術'],
    })
    const query: RecommendQuery = {
      feels: ['懐かしい'],
      pokemon_context: ['ゲーム体験/対戦・戦術'],
    }
    expect(scoreSong(song, query)).toBe(3 + 1)
  })

  it('pokemon_context 2件一致で +2（battle選択展開2タグ時のインフレ抑制）', () => {
    const song = makeSong({
      feels: ['かっこいい'],
      pokemon_context: ['ゲーム体験/対戦・戦術', 'ライバル・チャンピオン文脈'],
    })
    const query: RecommendQuery = {
      feels: ['かっこいい'],
      pokemon_context: ['ゲーム体験/対戦・戦術', 'ライバル・チャンピオン文脈'],
    }
    // battle 選択 2タグ展開 → +1+1=+2 (travel の +1 と同等の上限)
    expect(scoreSong(song, query)).toBe(3 + 2)
  })

  it('pokemon_context が undefined のとき加点なし', () => {
    const song = makeSong({
      feels: ['懐かしい'],
      pokemon_context: ['旅と冒険/旅立ち・道中'],
    })
    const query: RecommendQuery = { feels: ['懐かしい'] }
    expect(scoreSong(song, query)).toBe(3)
  })

  it('pokemon_gen 一致（gen1 が gen1-2 グループ内）で +2', () => {
    const song = makeSong({ feels: ['懐かしい'], pokemon_gen: 'gen1' })
    const query: RecommendQuery = { feels: ['懐かしい'], pokemon_gen: ['gen1-2'] }
    expect(scoreSong(song, query)).toBe(3 + 2)
  })

  it('pokemon_gen 一致（gen2 が gen1-2 グループ内）で +2', () => {
    const song = makeSong({ feels: ['懐かしい'], pokemon_gen: 'gen2' })
    const query: RecommendQuery = { feels: ['懐かしい'], pokemon_gen: ['gen1-2'] }
    expect(scoreSong(song, query)).toBe(3 + 2)
  })

  it('pokemon_gen 不一致（gen3 は gen1-2 グループ外）では加点なし', () => {
    const song = makeSong({ feels: ['懐かしい'], pokemon_gen: 'gen3' })
    const query: RecommendQuery = { feels: ['懐かしい'], pokemon_gen: ['gen1-2'] }
    expect(scoreSong(song, query)).toBe(3)
  })

  it('pokemon_gen 複数選択でいずれかが一致すれば +2（ダブルカウントなし）', () => {
    const song = makeSong({ feels: ['懐かしい'], pokemon_gen: 'gen3' })
    const query: RecommendQuery = { feels: ['懐かしい'], pokemon_gen: ['gen1-2', 'gen3-5'] }
    expect(scoreSong(song, query)).toBe(3 + 2)
  })

  it('pokemon_gen 空配列では加点なし', () => {
    const song = makeSong({ feels: ['懐かしい'], pokemon_gen: 'gen1' })
    const query: RecommendQuery = { feels: ['懐かしい'], pokemon_gen: [] }
    expect(scoreSong(song, query)).toBe(3)
  })

  it('vocaloid_pref miku 一致で +2', () => {
    const song = makeSong({ feels: ['懐かしい'], vocaloids: ['miku'] })
    const query: RecommendQuery = { feels: ['懐かしい'], vocaloid_pref: ['miku'] }
    expect(scoreSong(song, query)).toBe(3 + 2)
  })

  it('vocaloid_pref rin_len は rin 参加曲にマッチ', () => {
    const song = makeSong({ feels: ['懐かしい'], vocaloids: ['miku', 'rin'] })
    const query: RecommendQuery = { feels: ['懐かしい'], vocaloid_pref: ['rin_len'] }
    expect(scoreSong(song, query)).toBe(3 + 2)
  })

  it('vocaloid_pref rin_len は len 参加曲にマッチ', () => {
    const song = makeSong({ feels: ['懐かしい'], vocaloids: ['miku', 'len'] })
    const query: RecommendQuery = { feels: ['懐かしい'], vocaloid_pref: ['rin_len'] }
    expect(scoreSong(song, query)).toBe(3 + 2)
  })

  it('vocaloid_pref 空配列では加点なし', () => {
    const song = makeSong({ feels: ['懐かしい'], vocaloids: ['miku'] })
    const query: RecommendQuery = { feels: ['懐かしい'], vocaloid_pref: [] }
    expect(scoreSong(song, query)).toBe(3)
  })

  it('vocaloid_pref 不一致では加点なし', () => {
    const song = makeSong({ feels: ['懐かしい'], vocaloids: ['miku'] })
    const query: RecommendQuery = { feels: ['懐かしい'], vocaloid_pref: ['luka'] }
    expect(scoreSong(song, query)).toBe(3)
  })

  it('vocaloid_pref 複数選択でいずれかが一致すれば +2（ダブルカウントなし）', () => {
    const song = makeSong({ feels: ['懐かしい'], vocaloids: ['miku', 'luka'] })
    const query: RecommendQuery = { feels: ['懐かしい'], vocaloid_pref: ['miku', 'luka'] }
    // 両方マッチするが +2 のみ（ダブルカウントなし）
    expect(scoreSong(song, query)).toBe(3 + 2)
  })
})

describe('recommend', () => {
  const songs: Song[] = [
    makeSong({ id: 's1', feels: ['感動/泣ける', '懐かしい'], approx_views: 1_000_000, grade: '殿堂入り' }),
    makeSong({ id: 's2', feels: ['感動/泣ける'], approx_views: 500_000 }),
    makeSong({ id: 's3', feels: ['かっこいい'], approx_views: 2_000_000 }),
  ]

  it(`上位 ${TOP_N} 件以内を返す`, () => {
    const query: RecommendQuery = { feels: ['感動/泣ける'] }
    const result = recommend(songs, query)
    expect(result.length).toBeLessThanOrEqual(TOP_N)
  })

  it('高スコア曲が先頭に来る', () => {
    const query: RecommendQuery = { feels: ['感動/泣ける', '懐かしい'] }
    const result = recommend(songs, query)
    // s1: feels 2件 = 6, s2: feels 1件 = 3, s3: feels 0件 → 除外
    expect(result[0].song.id).toBe('s1')
    expect(result[0].score).toBe(6)
  })

  it('スコア 0 の曲は除外される', () => {
    const query: RecommendQuery = { feels: ['感動/泣ける'] }
    const result = recommend(songs, query)
    expect(result.every(({ score }) => score > 0)).toBe(true)
  })

  it('feels 指定時に feelsマッチ 0 の曲は除外される（gen/vocaloid だけ一致しても）', () => {
    const testSongs: Song[] = [
      makeSong({ id: 'no-feels', feels: ['かっこいい'], pokemon_gen: 'gen1', vocaloids: ['miku'] }),
      makeSong({ id: 'has-feels', feels: ['感動/泣ける'] }),
    ]
    const query: RecommendQuery = {
      feels: ['感動/泣ける'],
      pokemon_gen: ['gen1-2'],
      vocaloid_pref: ['miku'],
    }
    const result = recommend(testSongs, query)
    // 'no-feels' は gen+vocaloid で score=4 になるが feels マッチ 0 → 除外
    expect(result.find(r => r.song.id === 'no-feels')).toBeUndefined()
    expect(result[0].song.id).toBe('has-feels')
  })

  it('タイブレーク: 殿堂入り > 高評価/名曲 > なし（スコア同値時）', () => {
    const tiedSongs: Song[] = [
      makeSong({ id: 'a', feels: ['懐かしい'], approx_views: 5_000_000 }),
      makeSong({ id: 'b', feels: ['懐かしい'], approx_views: 1_000_000, grade: '殿堂入り' }),
      makeSong({ id: 'c', feels: ['懐かしい'], approx_views: 3_000_000, grade: '高評価/名曲' }),
    ]
    const query: RecommendQuery = { feels: ['懐かしい'] }
    const result = recommend(tiedSongs, query)
    // 全て score=3。b は殿堂入り → 先頭、c は高評価/名曲 → 次、a はなし → 末尾
    expect(result[0].song.id).toBe('b')
    expect(result[1].song.id).toBe('c')
    expect(result[2].song.id).toBe('a')
  })

  it('タイブレーク: 同グレードなら approx_views 降順', () => {
    const tiedSongs: Song[] = [
      makeSong({ id: 'a', feels: ['懐かしい'], approx_views: 5_000_000 }),
      makeSong({ id: 'b', feels: ['懐かしい'], approx_views: 1_000_000 }),
    ]
    const query: RecommendQuery = { feels: ['懐かしい'] }
    const result = recommend(tiedSongs, query)
    expect(result[0].song.id).toBe('a')
  })
})
