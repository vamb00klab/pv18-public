import { SONGS } from '@/data/songs'
import type { Feel, EvalGrade, PkmnGen } from '@/types/song'

// --- フィルタ選択肢 ---

export const ALL_FEELS: Feel[] = [
  '感動/泣ける', '懐かしい', 'かわいい', 'かっこいい', 'チル/癒し', '疾走感/ノリ', '中毒性/リピート',
]
export const ALL_GRADES: EvalGrade[] = ['殿堂入り', '高評価/名曲']
export const ALL_GENS: PkmnGen[] = ['gen1', 'gen2', 'gen3', 'gen4', 'gen5', 'gen6', 'gen7', 'gen8', 'gen9', 'gen10']

// songs.ts の配列から重複排除してキャラ一覧を生成
export const ALL_VOCALOIDS: string[] = Array.from(new Set(SONGS.flatMap(s => s.vocaloids))).sort()

// --- ラベルマッピング ---

export const FEEL_LABEL: Record<Feel, string> = {
  '感動/泣ける':     '感動',
  '懐かしい':        '懐かしい',
  'かわいい':        'かわいい',
  'かっこいい':      'かっこいい',
  'チル/癒し':       'チル/癒し',
  '疾走感/ノリ':     '疾走感',
  '中毒性/リピート': '中毒性',
}
export const GEN_LABEL: Record<PkmnGen, string> = {
  gen1:  '第1世代',
  gen2:  '第2世代',
  gen3:  '第3世代',
  gen4:  '第4世代',
  gen5:  '第5世代',
  gen6:  '第6世代',
  gen7:  '第7世代',
  gen8:  '第8世代',
  gen9:  '第9世代',
  gen10: '第10世代',
}
export const GEN_GAMES_FULL: Record<PkmnGen, string> = {
  gen1:  '赤・緑・青・ピカチュウ（1996〜）',
  gen2:  '金・銀・クリスタル（1999〜）',
  gen3:  'ルビー・サファイア・エメラルド（2002〜）',
  gen4:  'ダイヤモンド・パール・プラチナ（2006〜）',
  gen5:  'ブラック・ホワイト（2010〜）',
  gen6:  'X・Y（2013〜）',
  gen7:  'サン・ムーン（2016〜）',
  gen8:  'ソード・シールド（2019〜）',
  gen9:  'スカーレット・バイオレット（2022〜）',
  gen10: 'レジェンズ Z-A（2025〜）',
}
export const CATEGORY_HELP: Record<string, string> = {
  feels:    '気分・雰囲気で絞り込みます。OR モードではいずれかに当てはまる曲、AND モードではすべてに当てはまる曲を表示します。',
  grade:    'サイト開発者が YouTube 動画の投稿日・再生数・コメント欄を元に評価し独自にタグ付け。特に強い傾向が見られた曲を「高評価」、評価が抜きん出ていた曲を「殿堂入り」としています。',
  vocaloid: 'メインボーカルまたは印象的なパートを担当しているキャラクターで絞り込みます。OR モードではいずれかのキャラが参加している曲、AND モードではすべてのキャラが参加している曲を表示します。',
  gen:              '登場するポケモンの世代で絞り込みます。世代情報がない曲は選択時に非表示になります。',
  pokemon_criteria: '各曲の MV に登場するポケモンから代表的なものを最大3体、紫タグで表示しています。世代フィルタの絞り込みにも使われます。登場ポケモンが多い曲では一部のみの掲載になります。',
}

/** songs.ts の pokemon_names（英語）→ 日本語表示名 */
export const POKEMON_JP: Record<string, string> = {
  // Gen 1
  Pikachu:      'ピカチュウ',
  Raichu:       'ライチュウ',
  Clefairy:     'ピッピ',
  Jigglypuff:   'プリン',
  Mewtwo:       'ミュウツー',
  Mew:          'ミュウ',
  Bulbasaur:    'フシギダネ',
  Ivysaur:      'フシギソウ',
  Venusaur:     'フシギバナ',
  Charmander:   'ヒトカゲ',
  Squirtle:     'ゼニガメ',
  Gengar:       'ゲンガー',
  Cubone:       'カラカラ',
  Eevee:        'イーブイ',
  Voltorb:      'ビリリダマ',
  Electrode:    'マルマイン',
  Arbok:        'アーボック',
  Nidoking:     'ニドキング',
  Slowpoke:     'ヤドン',
  Ditto:        'メタモン',
  // Gen 2
  Pichu:        'ピチュー',
  Espeon:       'エーフィ',
  Ledyba:       'レディバ',
  Sudowoodo:    'ウソッキー',
  Lugia:        'ルギア',
  'Ho-Oh':      'ホウオウ',
  Houndoom:     'ヘルガー',
  // Gen 3
  Mudkip:       'ミズゴロウ',
  Gardevoir:    'サーナイト',
  Milotic:      'ミロカロス',
  Latias:       'ラティアス',
  Latios:       'ラティオス',
  Deoxys:       'デオキシス',
  Pelipper:     'ペリッパー',
  Swablu:       'チルット',
  Azurill:      'ルリリ',
  Mawile:       'クチート',
  // Gen 4
  Bidoof:       'ビッパ',
  Bibarel:      'ビーダル',
  Garchomp:     'ガブリアス',
  Spiritomb:    'ミカルゲ',
  Roserade:     'ロズレイド',
  Lucario:      'ルカリオ',
  Togekiss:     'トゲキッス',
  'Mime Jr.':   'マネネ',
  Bronzong:     'ドータクン',
  'Porygon-Z':  'ポリゴンZ',
  'Heat Rotom': 'ヒートロトム',
  // Gen 5
  Meloetta:     'メロエッタ',
  Zekrom:       'ゼクロム',
  Reshiram:     'レシラム',
  Foongus:      'タマゲタケ',
  Amoonguss:    'モロバレル',
  Ferroseed:    'テッシード',
  Stunfisk:     'マッギョ',
  // Gen 6
  Goomy:        'ヌメラ',
  // Gen 7
  Mimikyu:      'ミミッキュ',
  Incineroar:   'ガオガエン',
  Sandygast:    'スナバァ',
  // Gen 8
  'Mr. Rime':   'ブリムオン',
  Alcremie:     'マホイップ',
  Polteageist:  'ポットデス',
  Eiscue:       'コオリッポ',
  Applin:       'カジッチュ',
  Zacian:       'ザシアン',
  Zamazenta:    'ザマゼンタ',
  // Gen 9
  Miraidon:     'ミライドン',
  Tinkaton:     'デカヌチャン',
  Pawmot:       'パーモット',
}

// --- ユーティリティ ---

export function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
}

/** "YYYY-MM-DD" → "YYYY.MM.DD" */
export function formatDate(iso: string): string {
  return iso.replace(/-/g, '.')
}
