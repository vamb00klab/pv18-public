/**
 * src/data/songs.ts
 *
 * Project VOLTAGE 楽曲データ（原曲のみ・リミックスは除外）
 *
 * 更新方針:
 *   - 新曲追加時はこのファイルに Song オブジェクトを追記するだけ
 *   - youtube_id: YouTube URL の v= 以降 11 文字
 *   - taxonomy v2 タグは vihar-lab の blended intros を参照してキュレーション
 *   - approx_views は概算桁数で記入（タイブレーカー用途、正確性不要）
 *   - priority: 開発者優先度（0=指定なし、高いほど同スコア時に上位）
 *   - release_date: ISO 8601 形式 "YYYY-MM-DD"（公式サイト記載日）
 *
 * taxonomy v2 フィールド:
 *   feels[]         : 感情反応（Category 3）→ レコメンド Q1 スコア +2/件
 *   pokemon_context[]: ポケモン体験文脈（Category 1 全11タグ）→ レコメンド Q2 スコア +2/件
 *   lyrics_themes[] : 歌詞主題（Category 2）→ /songs フィルタ用・スコア外
 *   grade?          : 評価グレード（Category 5）→ タイブレーカー用
 *
 * pokemon_types 凡例:
 *   タイトルや公式情報から明確に割り当てられているものだけ記入。
 *   不明・推測の場合は空配列 []。
 *
 * pokemon_names / pokemon_names_mv 凡例:
 *   pokemon_names:    代表ポケモン（最大3体・カード表示用）
 *   pokemon_names_mv: MV全登場ポケモン（表示しない・参照用）。
 *                     pokemon_names に収まりきらない場合のみ設定。
 *
 * pokemon_gen 凡例:
 *   MVや概要欄から登場ポケモンが特定できた場合のみ記入。
 *   複数世代にまたがる場合・不明の場合は null。
 *   gen1-2: カントー(001-151) + ジョウト(152-251)
 *   gen3-5: ホウエン(252-386) + シンオウ(387-493) + イッシュ(494-649)
 *   gen6+:  カロス(650-721) + アローラ(722-809) + ガラル(810-905) + パルデア(906+)
 *
 * リミックス管理:
 *   ボルテッカー（Jewel Remix）、電気予報（bachibachi Remix）、
 *   たびのまえ、たびのあと（tabitabi Remix）は現時点でスコープ外。
 *   将来追加する場合は別ファイル or is_remix フィールドを追加検討。
 */

import type { Song } from '@/types/song'

export const SONGS: Song[] = [
  {
    // 001
    id: 'tabidachi-no-uta',
    title: 'たびだちのうた',
    artist: '烏屋茶房',
    vocaloids: ['miku'],
    youtube_id: 'iP1EAgXd42s',
    official_url: 'https://www.project-voltage.jp/music.html#high_mv05',
    release_date: '2026-01-28',
    pokemon_types: [],
    pokemon_names: ['Meloetta'],
    pokemon_gen: 'gen5',              // メロエッタ（イッシュ #648）
    feels: ['感動/泣ける', '懐かしい', '疾走感/ノリ'],
    pokemon_context: ['旅と冒険/旅立ち・道中', '相棒と絆/関係深化'],
    lyrics_themes: ['歌詞主題/再出発・未来志向', '歌詞主題/別れ・再会'],
    approx_views: 1_000_000,
    priority: 2,
  },
  {
    // 002
    id: 'doki-doki',
    title: 'ドキドキ！',
    artist: 'すりぃ',
    vocaloids: ['miku', 'len'],
    youtube_id: 'rpPqsJj2YwQ',
    official_url: 'https://www.project-voltage.jp/music.html#high_mv04',
    release_date: '2025-10-21',
    pokemon_types: [],
    pokemon_names: [],
    pokemon_gen: null,
    feels: ['懐かしい', '疾走感/ノリ', '中毒性/リピート'],
    pokemon_context: ['世代記憶/初代〜金銀', '世代記憶/DS・3DS', '復帰勢共感'],
    lyrics_themes: ['歌詞主題/自己肯定', '歌詞主題/再出発・未来志向'],
    approx_views: 2_000_000,
    priority: 1,
  },
  {
    // 003
    id: 'ooparts',
    title: 'オーパーツ',
    artist: '煮ル果実',
    vocaloids: ['miku'],
    youtube_id: 'LFZK8GbCmQY',
    official_url: 'https://www.project-voltage.jp/music.html#high_mv03',
    release_date: '2025-09-18',
    pokemon_types: [],
    pokemon_names: ['Zekrom', 'Reshiram'],
    pokemon_gen: 'gen5',              // ゼクロム（#644）レシラム（#643）（イッシュ）
    feels: ['かっこいい', '中毒性/リピート'],
    pokemon_context: ['世代記憶/DS・3DS', 'ライバル・チャンピオン文脈'],
    lyrics_themes: ['歌詞主題/正体・擬態（本物/偽物）', '歌詞主題/挑戦・闘志'],
    approx_views: 1_500_000,
    priority: 1,
  },
  {
    // 004
    id: 'volteccer',
    title: 'ボルテッカー',
    artist: 'DECO*27',
    vocaloids: ['miku'],
    youtube_id: 'C-7TIDIKc98',
    official_url: 'https://www.project-voltage.jp/music.html#mv01',
    release_date: '2023-09-29',
    pokemon_types: ['electric'],
    pokemon_names: ['Pikachu'],
    pokemon_gen: 'gen1',              // ピカチュウ（カントー #025）
    feels: ['かっこいい', '疾走感/ノリ', '中毒性/リピート'],
    pokemon_context: ['ゲーム体験/対戦・戦術', 'ゲーム体験/演出・SE・UI', '世代記憶/初代〜金銀'],
    lyrics_themes: ['歌詞主題/恋愛・執着'],
    grade: '殿堂入り',
    approx_views: 10_000_000,
    priority: 5,
  },
  {
    // 005
    id: 'denki-yoho',
    title: '電気予報',
    artist: '稲葉曇',
    vocaloids: ['miku'],
    youtube_id: 'Imcr7rsBxsc',
    official_url: 'https://www.project-voltage.jp/music.html#mv02',
    release_date: '2023-10-06',
    pokemon_types: ['electric'],
    pokemon_names: ['Miraidon'],
    pokemon_gen: 'gen9',              // ミライドン（パルデア #1008）
    feels: ['かっこいい', 'チル/癒し', '中毒性/リピート'],
    pokemon_context: ['ゲーム体験/演出・SE・UI', 'ゲーム体験/対戦・戦術'],
    lyrics_themes: ['歌詞主題/正体・擬態（本物/偽物）', '歌詞主題/自己肯定'],
    approx_views: 3_000_000,
    priority: 2,
  },
  {
    // 006
    id: 'mirai-donna-daro',
    title: 'ミライどんなだろう',
    artist: 'Mitchie M',
    vocaloids: ['miku'],
    youtube_id: 'EG05Sm68z4s',
    official_url: 'https://www.project-voltage.jp/music.html#mv03',
    release_date: '2023-10-13',
    pokemon_types: [],
    pokemon_names: [],
    pokemon_gen: null,               // 多数のポケモンが登場・世代混在
    feels: ['懐かしい', '疾走感/ノリ'],
    pokemon_context: ['ゲーム体験/演出・SE・UI', 'アニポケ参照', '相棒と絆/関係深化'],
    lyrics_themes: ['歌詞主題/成長・進化', '歌詞主題/再出発・未来志向'],
    approx_views: 2_000_000,
    priority: 1,
  },
  {
    // 007
    id: 'pocket-no-monster',
    title: 'ポケットのモンスター',
    artist: 'ピノキオピー',
    vocaloids: ['miku'],
    youtube_id: 'lIoi2r3f5fU',
    official_url: 'https://www.project-voltage.jp/music.html#mv04',
    release_date: '2023-10-20',
    pokemon_types: ['fire', 'water', 'grass'],
    pokemon_names: ['Charmander', 'Squirtle', 'Bulbasaur'],
    pokemon_gen: 'gen1',             // ヒトカゲ(#4)・ゼニガメ(#7)・フシギダネ(#1)（カントー御三家）
    feels: ['感動/泣ける', '懐かしい', 'チル/癒し'],
    pokemon_context: ['世代記憶/初代〜金銀', '世代記憶/DS・3DS', '相棒と絆/関係深化', '復帰勢共感'],
    lyrics_themes: ['歌詞主題/自己肯定'],
    approx_views: 2_000_000,
    priority: 2,
  },
  {
    // 008
    id: 'battle-hatsune-miku',
    title: '戦闘！初音ミク',
    artist: 'cosMo＠暴走P',
    vocaloids: ['miku'],
    youtube_id: 'knxWl1LzJ10',
    official_url: 'https://www.project-voltage.jp/music.html#mv05',
    release_date: '2023-12-01',
    pokemon_types: ['ghost', 'poison'],
    pokemon_names: ['Gengar', 'Nidoking'],
    pokemon_gen: 'gen1',              // ゲンガー（#094）ニドキング（#034）（カントー）
    feels: ['かっこいい', '疾走感/ノリ', '中毒性/リピート'],
    pokemon_context: ['ゲーム体験/対戦・戦術', 'ゲーム体験/演出・SE・UI', 'ライバル・チャンピオン文脈'],
    lyrics_themes: ['歌詞主題/挑戦・闘志', '歌詞主題/自己肯定'],
    approx_views: 2_000_000,
    priority: 1,
  },
  {
    // 009
    id: 'kimi-to-sora-wo-tobu',
    title: 'きみとそらをとぶ',
    artist: '傘村トータ',
    vocaloids: ['miku', 'luka'],
    youtube_id: 'pwBImZgRnVU',
    official_url: 'https://www.project-voltage.jp/music.html#mv06',
    release_date: '2023-12-08',
    pokemon_types: ['water', 'flying'],
    pokemon_names: ['Mudkip', 'Pelipper'],
    pokemon_gen: 'gen3',              // ミズゴロウ（#258）ペリッパー（#279）（ホウエン）
    feels: ['感動/泣ける', 'チル/癒し'],
    pokemon_context: ['相棒と絆/関係深化', '旅と冒険/旅立ち・道中'],
    lyrics_themes: ['歌詞主題/自己肯定', '歌詞主題/成長・進化'],
    approx_views: 800_000,
    priority: 3,   // 低再生数だが良曲・発見価値高
  },
  {
    // 010
    id: 'gatchu',
    title: 'ガッチュー！',
    artist: 'Giga',
    vocaloids: ['miku', 'rin', 'len'],
    youtube_id: 'Dq2HJl5vKbY',
    official_url: 'https://www.project-voltage.jp/music.html#mv07',
    release_date: '2023-12-15',
    pokemon_types: ['fire', 'water', 'grass', 'psychic'],
    pokemon_names: ['Mew'],
    pokemon_gen: 'gen1',              // ミュウ（カントー #151）+ 御三家
    feels: ['疾走感/ノリ', '懐かしい', '中毒性/リピート'],
    pokemon_context: ['世代記憶/初代〜金銀', 'ゲーム体験/演出・SE・UI', 'ゲーム体験/育成・収集'],
    lyrics_themes: ['歌詞主題/挑戦・闘志', '歌詞主題/再出発・未来志向'],
    grade: '高評価/名曲',
    approx_views: 5_000_000,
    priority: 4,
  },
  {
    // 011
    id: 'juvenile',
    title: 'JUVENILE',
    artist: 'じん',
    vocaloids: ['miku'],
    youtube_id: 'N2-HzUpMY7c',
    official_url: 'https://www.project-voltage.jp/music.html#mv08',
    release_date: '2023-12-22',
    pokemon_types: ['normal'],
    pokemon_names: ['Eevee'],
    pokemon_gen: 'gen1',              // イーブイ（カントー #133）
    feels: ['感動/泣ける', '懐かしい'],
    pokemon_context: ['世代記憶/初代〜金銀', '相棒と絆/関係深化', '旅と冒険/旅立ち・道中'],
    lyrics_themes: ['歌詞主題/成長・進化', '歌詞主題/自己肯定'],
    approx_views: 4_000_000,
    priority: 3,
  },
  {
    // 012
    id: 'ore-ghost-type',
    title: '俺ゴーストタイプ',
    artist: 'syudou',
    vocaloids: ['miku'],
    youtube_id: 'tVSSFcP90k0',
    official_url: 'https://www.project-voltage.jp/music.html#mv09',
    release_date: '2024-01-27',
    pokemon_types: ['ghost', 'poison'],
    pokemon_names: ['Gengar'],
    pokemon_gen: 'gen1',              // ゲンガー（カントー #094）
    feels: ['かっこいい', '中毒性/リピート'],
    pokemon_context: ['世代記憶/初代〜金銀', 'ゲーム体験/演出・SE・UI'],
    lyrics_themes: ['歌詞主題/自己肯定', '歌詞主題/正体・擬態（本物/偽物）'],
    approx_views: 5_000_000,
    priority: 3,
  },
  {
    // 013
    id: 'go-team-bippa',
    title: 'ゴー！ビッパ団',
    artist: 'ワンダフル☆オポチュニティ！',
    vocaloids: ['miku', 'rin', 'len'],
    youtube_id: 'OtSKbj_Nz_c',
    official_url: 'https://www.project-voltage.jp/music.html#mv10',
    release_date: '2024-02-02',
    pokemon_types: ['normal'],
    pokemon_names: ['Bidoof', 'Bibarel'],
    pokemon_gen: 'gen4',              // ビッパ・ビーダル（シンオウ #399/#400）
    feels: ['疾走感/ノリ', 'かわいい', '中毒性/リピート'],
    pokemon_context: ['世代記憶/DS・3DS', 'ゲーム体験/育成・収集', '相棒と絆/関係深化'],
    lyrics_themes: ['歌詞主題/自己肯定'],
    approx_views: 1_000_000,
    priority: 1,
  },
  {
    // 014
    id: 'hyu-doro-doro',
    title: 'ひゅ～どろどろ',
    artist: '栗山夕璃',
    vocaloids: ['miku', 'meiko'],
    youtube_id: '8D_7-jNaErg',
    official_url: 'https://www.project-voltage.jp/music.html#mv11',
    release_date: '2024-02-09',
    pokemon_types: [],
    pokemon_names: ['Mimikyu', 'Cubone'],
    pokemon_gen: null,               // ミミッキュ（アローラ #778）カラカラ（カントー #104）・世代混在
    feels: ['かわいい', '疾走感/ノリ', '中毒性/リピート'],
    pokemon_context: ['世代記憶/初代〜金銀', 'ゲーム体験/演出・SE・UI'],
    lyrics_themes: ['歌詞主題/自己肯定'],
    approx_views: 500_000,
    priority: 1,
  },
  {
    // 015
    id: 'encounter',
    title: 'Encounter',
    artist: 'Orangestar',
    vocaloids: ['miku'],
    youtube_id: 'EUMn-kJbNc0',
    official_url: 'https://www.project-voltage.jp/music.html#mv12',
    release_date: '2024-02-16',
    pokemon_types: [],
    pokemon_names: ['Lugia'],
    pokemon_gen: 'gen2',             // ルギア（ジョウト #249）
    feels: ['感動/泣ける', 'チル/癒し', '懐かしい'],
    pokemon_context: ['世代記憶/初代〜金銀', '相棒と絆/関係深化'],
    lyrics_themes: ['歌詞主題/別れ・再会'],
    approx_views: 2_000_000,
    priority: 2,
  },
  {
    // 016
    id: 'mugen-no-ticket',
    title: 'むげんのチケット',
    artist: 'まらしぃ',
    vocaloids: ['miku', 'kaito'],
    youtube_id: 'k7Y30h8S7Uw',
    official_url: 'https://www.project-voltage.jp/music.html#mv13',
    release_date: '2024-02-17',
    pokemon_types: [],
    pokemon_names: ['Latias', 'Latios'],
    pokemon_gen: 'gen3',             // ラティアス（#380）ラティオス（#381）（ホウエン）
    feels: ['感動/泣ける', '懐かしい'],
    pokemon_context: ['世代記憶/DS・3DS', '相棒と絆/関係深化', '旅と冒険/旅立ち・道中'],
    lyrics_themes: ['歌詞主題/別れ・再会', '歌詞主題/再出発・未来志向'],
    approx_views: 1_500_000,
    priority: 2,
  },
  {
    // 017
    id: 'party-rock-eternity',
    title: 'PARTY ROCK ETERNITY',
    artist: '八王子P',
    vocaloids: ['miku'],
    youtube_id: 'MyV8DhouDXY',
    official_url: 'https://www.project-voltage.jp/music.html#mv14',
    release_date: '2024-02-23',
    pokemon_types: ['normal', 'poison'],
    pokemon_names: ['Arbok', 'Houndoom'],
    pokemon_gen: null,               // アーボック（カントー #024）ヘルガー（ジョウト #229）・世代混在
    feels: ['かっこいい', '疾走感/ノリ', '中毒性/リピート'],
    pokemon_context: ['世代記憶/初代〜金銀', 'ライバル・チャンピオン文脈'],
    lyrics_themes: ['歌詞主題/自己肯定', '歌詞主題/挑戦・闘志'],
    approx_views: 2_000_000,
    priority: 1,
  },
  {
    // 018
    id: 'tabi-no-mae-ato',
    title: 'たびのまえ、たびのあと',
    artist: 'いよわ',
    vocaloids: ['miku'],
    youtube_id: 'HbS1T4d1P70',
    official_url: 'https://www.project-voltage.jp/music.html#mv15',
    release_date: '2024-02-27',
    pokemon_types: ['electric'],
    pokemon_names: ['Pichu'],
    pokemon_gen: 'gen2',              // ピチュー（ジョウト #172）
    feels: ['感動/泣ける', '懐かしい', 'チル/癒し'],
    pokemon_context: ['旅と冒険/旅立ち・道中', '相棒と絆/関係深化', '世代記憶/初代〜金銀'],
    lyrics_themes: ['歌詞主題/再出発・未来志向', '歌詞主題/成長・進化'],
    approx_views: 2_500_000,
    priority: 2,
  },
  {
    // 019
    id: 'esper-esper',
    title: 'エスパーエスパー',
    artist: 'ナユタン星人',
    vocaloids: ['miku'],
    youtube_id: 'VA35FGCCX0E',
    official_url: 'https://www.project-voltage.jp/music.html#mv16',
    release_date: '2024-03-01',
    pokemon_types: ['psychic'],
    pokemon_names: ['Mewtwo', 'Espeon', 'Deoxys'],
    pokemon_gen: null,               // ミュウツー（#150）エーフィ（#196）デオキシス（#386）・世代混在
    feels: ['かわいい', '疾走感/ノリ', '中毒性/リピート'],
    pokemon_context: ['ゲーム体験/対戦・戦術', 'ゲーム体験/演出・SE・UI'],
    lyrics_themes: ['歌詞主題/恋愛・執着'],
    approx_views: 4_000_000,
    priority: 3,
  },
  {
    // 020
    id: 'merome-roid',
    title: 'メロメロイド',
    artist: 'かいりきベア',
    vocaloids: ['miku'],
    youtube_id: 'TFpizvPDbec',
    official_url: 'https://www.project-voltage.jp/music.html#mv17',
    release_date: '2024-03-03',
    pokemon_types: [],
    pokemon_names: ['Mawile'],                             // クチート（メガクチート含む）
    pokemon_names_mv: ['Jigglypuff', 'Clefairy', 'Mime Jr.', 'Mr. Rime', 'Alcremie', 'Tinkaton', 'Mimikyu', 'Mawile'],
    pokemon_gen: null,               // フェアリー系多数・世代混在（Gen1〜Gen9）
    feels: ['かわいい', '中毒性/リピート'],
    pokemon_context: ['ゲーム体験/対戦・戦術'],
    lyrics_themes: ['歌詞主題/恋愛・執着'],
    grade: '高評価/名曲',
    approx_views: 3_000_000,
    priority: 2,
  },
  {
    // 021
    id: 'glorious-day',
    title: 'Glorious Day',
    artist: 'Eve',
    vocaloids: ['miku'],
    youtube_id: 'ABQvefYR9ec',
    official_url: 'https://www.project-voltage.jp/music.html#mv18',
    release_date: '2024-03-09',
    pokemon_types: ['psychic', 'fairy'],
    pokemon_names: ['Gardevoir', 'Garchomp'],  // 2体のみ・確定
    pokemon_gen: null,               // サーナイト（ホウエン #282）ガブリアス（シンオウ #445）・世代混在
    feels: ['感動/泣ける', '疾走感/ノリ', '懐かしい', 'かっこいい'],
    pokemon_context: ['ライバル・チャンピオン文脈', '世代記憶/初代〜金銀', '世代記憶/DS・3DS'],
    lyrics_themes: ['歌詞主題/挑戦・闘志', '歌詞主題/再出発・未来志向'],
    approx_views: 8_000_000,
    priority: 4,
  },
  {
    // 022
    id: 'after-epochx',
    title: 'アフターエポックス',
    artist: 'sasakure.UK',
    vocaloids: ['miku'],
    youtube_id: 'pykE4kMhUUU',
    official_url: 'https://www.project-voltage.jp/music.html#mv19',
    release_date: '2024-05-10',
    pokemon_types: [],
    pokemon_names: ['Jigglypuff', 'Ho-Oh'],
    pokemon_gen: null,               // プリン（カントー #039）ホウオウ（ジョウト #250）・世代混在
    feels: ['感動/泣ける', '懐かしい', 'チル/癒し'],
    pokemon_context: ['旅と冒険/旅立ち・道中', '世代記憶/初代〜金銀', '世代記憶/DS・3DS'],
    lyrics_themes: ['歌詞主題/別れ・再会', '歌詞主題/再出発・未来志向'],
    approx_views: 1_000_000,
    grade: '高評価/名曲',
    priority: 2,   // sasakure.UK・低再生数だが独自の世界観
  },
  {
    // 023
    id: 'champion',
    title: 'チャンピオン',
    artist: 'Kanaria',
    vocaloids: ['miku'],
    youtube_id: 'VxjledMkwyk',
    official_url: 'https://www.project-voltage.jp/music.html#mv20',
    release_date: '2024-07-19',
    pokemon_types: [],
    pokemon_names: ['Garchomp', 'Spiritomb', 'Lucario'],
    pokemon_names_mv: ['Garchomp', 'Spiritomb', 'Roserade', 'Lucario', 'Milotic', 'Togekiss'],
    pokemon_gen: 'gen4',             // シロナのパーティ（シンオウ）。ミロカロスのみホウエン産（#350）だが文脈はgen4
    feels: ['かっこいい', '懐かしい', '疾走感/ノリ'],
    pokemon_context: ['ライバル・チャンピオン文脈', '世代記憶/DS・3DS', 'ゲーム体験/対戦・戦術'],
    lyrics_themes: ['歌詞主題/挑戦・闘志'],
    approx_views: 10_000_000,
    priority: 4,
  },
  {
    // 024
    id: 'shinka-shinka-shinka',
    title: 'しんかしんかしんか',
    artist: '原口沙輔',
    vocaloids: ['miku'],
    youtube_id: 'O_kA7kM3Sos',
    official_url: 'https://www.project-voltage.jp/music.html#high_mv01',
    release_date: '2024-12-06',
    pokemon_types: [],
    pokemon_names: ['Bulbasaur', 'Ivysaur', 'Venusaur'],
    pokemon_names_mv: ['Bulbasaur', 'Ivysaur', 'Venusaur', 'Pikachu', 'Raichu'],
    pokemon_gen: 'gen1',             // フシギダネ(#1)・フシギソウ(#2)・フシギバナ(#3)・ピカチュウ(#25)・ライチュウ(#26)（カントー）
    feels: ['感動/泣ける', '懐かしい', 'チル/癒し'],
    pokemon_context: ['相棒と絆/関係深化', '旅と冒険/旅立ち・道中', 'ゲーム体験/演出・SE・UI'],
    lyrics_themes: ['歌詞主題/成長・進化', '歌詞主題/再出発・未来志向'],
    grade: '高評価/名曲',
    approx_views: 1_500_000,
    priority: 2,
  },
  {
    // 025
    id: 'facade-question',
    title: 'ファサード・クエスチョン',
    artist: 'サツキ',
    // 重音テト は Crypton 系でないため string リテラルで追加
    vocaloids: ['miku', 'teto'],
    youtube_id: 'njKdvdYQ-xE',
    official_url: 'https://www.project-voltage.jp/music.html#high_mv02',
    release_date: '2025-04-01',
    pokemon_types: [],
    pokemon_names: ['Voltorb', 'Foongus', 'Ditto'],
    pokemon_names_mv: [
      'Voltorb', 'Foongus', 'Polteageist', 'Bronzong', 'Sandygast', 'Heat Rotom',
      'Azurill', 'Incineroar', 'Slowpoke', 'Pawmot', 'Porygon-Z', 'Electrode',
      'Amoonguss', 'Swablu', 'Sudowoodo', 'Goomy', 'Ferroseed', 'Ledyba',
      'Eiscue', 'Stunfisk', 'Applin', 'Ditto',
    ],
    pokemon_gen: null,               // 多数・世代混在（Gen1〜Gen9）
    feels: ['かっこいい', '疾走感/ノリ', '中毒性/リピート'],
    pokemon_context: ['ゲーム体験/演出・SE・UI'],
    lyrics_themes: ['歌詞主題/正体・擬態（本物/偽物）', '歌詞主題/自己肯定'],
    grade: '高評価/名曲',
    approx_views: 1_500_000,
    priority: 2,
  },
  {
    // 026
    id: 'spiral-melodies',
    title: 'スパイラル・メロディーズ',
    artist: 'Omoi',
    vocaloids: ['miku'],
    vocalist_label: '初音ミク with メロエッタ',
    youtube_id: 'yNw89sQOKas',
    official_url: 'https://www.project-voltage.jp/music.html#high_mv06',
    release_date: '2026-02-27',
    pokemon_types: [],
    pokemon_names: ['Meloetta'],
    pokemon_gen: 'gen5',
    feels: ['感動/泣ける', '疾走感/ノリ'],
    pokemon_context: ['相棒と絆/関係深化'],
    lyrics_themes: ['歌詞主題/再出発・未来志向'],
    approx_views: 190_000,
  },
]
