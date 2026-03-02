// taxonomy v2 対応型定義

// ---- taxonomy v2 タグ型 ----

/** Category 3: 感情反応（レコメンド Q1・スコア +2/件） */
export type Feel =
  | '感動/泣ける'
  | '懐かしい'
  | 'かわいい'
  | 'かっこいい'
  | 'チル/癒し'
  | '疾走感/ノリ'
  | '中毒性/リピート'

/** Category 1: ポケモン体験文脈（全11タグ。レコメンド Q2・スコア +2/件） */
export type PokemonContext =
  | '世代記憶/初代〜金銀'
  | '世代記憶/DS・3DS'
  | '世代記憶/Switch以降'
  | '復帰勢共感'
  | 'アニポケ参照'
  | 'ライバル・チャンピオン文脈'
  | 'ゲーム体験/対戦・戦術'
  | 'ゲーム体験/育成・収集'
  | 'ゲーム体験/演出・SE・UI'
  | '旅と冒険/旅立ち・道中'
  | '相棒と絆/関係深化'

/** Category 2: 歌詞主題・解釈（/songs フィルタ用・スコア外） */
export type LyricsTheme =
  | '歌詞主題/自己肯定'
  | '歌詞主題/成長・進化'
  | '歌詞主題/再出発・未来志向'
  | '歌詞主題/別れ・再会'
  | '歌詞主題/挑戦・闘志'
  | '歌詞主題/恋愛・執着'
  | '歌詞主題/正体・擬態（本物/偽物）'

/** Category 5: 評価グレード（タイブレーカー） */
export type EvalGrade =
  | '殿堂入り'
  | '高評価/名曲'

/** Category 6: 音楽ジャンル補助タグ（Phase 2） */
export type GenreTag =
  | 'ジャンル/ポップ'
  | 'ジャンル/ロック'
  | 'ジャンル/ヒップホップ・ラップ'
  | 'ジャンル/ダンス・クラブ'
  | 'ジャンル/エレクトロ・EDM'
  | 'ジャンル/バラード'
  | 'ジャンル/オルタナ・実験系'
  | 'ジャンル/チップチューン・ゲーム音楽系'

/** Category 7: 楽曲機能補助タグ（Phase 2） */
export type FunctionTag =
  | '機能/バトルソング'
  | '機能/アンセム（合唱・鼓舞）'
  | '機能/ダンスチューン'
  | '機能/ラブソング'
  | '機能/ダーク・挑発'
  | '機能/チル・内省'
  | '機能/コミカル・キャラソン'
  | '機能/ノスタルジー喚起'
  | '機能/ストーリー終章・再出発'

// ---- 既存型（変更なし）----

/** 楽曲データ用・個別世代 */
export type PkmnGen = 'gen1' | 'gen2' | 'gen3' | 'gen4' | 'gen5' | 'gen6' | 'gen7' | 'gen8' | 'gen9' | 'gen10'

/** レコメンドクエリ用・まとめグループ */
export type PkmnGenGroup = 'gen1-2' | 'gen3-5' | 'gen6+'

/** キャラクター絞り込み選択肢（"rin_len" は rin か len どちらかが参加していればマッチ） */
export type VocaloidPref = 'miku' | 'rin_len' | 'other'

export type VocaloidChar =
  | 'miku'
  | 'rin'
  | 'len'
  | 'luka'
  | 'kaito'
  | 'meiko'
  | string

// ---- Song 型 ----

export type Song = {
  /** 一意ID（スラッグ形式推奨: "dazzling-feat-miku"） */
  id: string
  title: string
  /** ボカロP名（アーティスト表記） */
  artist: string
  /** フィーチャリングキャラクター */
  vocaloids: VocaloidChar[]
  /** 表示用ボーカリスト表記（特殊コラボ等で vocaloids から自動生成できない場合に設定） */
  vocalist_label?: string
  /** YouTube 動画ID（"dQw4w9WgXcQ" 形式） */
  youtube_id: string
  /** 公式曲紹介ページURL（project-voltage.jp/music.html#... 形式） */
  official_url?: string
  /** リリース日（ISO 8601 "YYYY-MM-DD" 形式） */
  release_date?: string
  /** 公式タイプ割り当て（あれば。type_id 文字列） */
  pokemon_types: string[]
  /** 代表ポケモン（最大3体・カード表示用） */
  pokemon_names: string[]
  /** MV全登場ポケモン（表示しない・参照用）。pokemon_names に収まりきらない場合に設定 */
  pokemon_names_mv?: string[]
  /** 登場ポケモンの主な世代帯（判定困難な場合は null） */
  pokemon_gen: PkmnGen | null

  // ---- taxonomy v2 タグ ----
  /** 感情反応（Category 3）レコメンド Q1 対応・スコア +2/件 */
  feels: Feel[]
  /** ポケモン体験文脈（Category 1 全11タグ）レコメンド Q2 対応・スコア +2/件 */
  pokemon_context: PokemonContext[]
  /** 歌詞主題（Category 2）/songs フィルタ用・スコア外 */
  lyrics_themes: LyricsTheme[]
  /** 評価グレード（Category 5）タイブレーカー用 */
  grade?: EvalGrade
  /** 音楽ジャンル補助タグ（Category 6）Phase 2 */
  genre_tags?: GenreTag[]
  /** 楽曲機能補助タグ（Category 7）Phase 2 */
  function_tags?: FunctionTag[]
  /** 曲紹介文 Phase 2 */
  intro?: string

  // ---- 知名度メタ（ソート用・ユーザーには非表示）----
  /** 概算再生数（桁数程度で OK。タイブレーカー用） */
  approx_views: number
  /**
   * 開発者優先度（タイブレーカー用・ユーザーには非表示）
   * 未設定/0 = 指定なし / 数値が大きいほど同スコア時に上位に表示
   */
  priority?: number
}

// ---- クエリ型 ----

export type RecommendQuery = {
  /** Q1: 感情反応（複数選択・必須） */
  feels: Feel[]
  /**
   * Q3: ポケモン体験文脈（複数選択・任意）
   * UI の 5択選択肢から PokemonContext タグへ展開して格納する。
   * 世代記憶系3タグは Q3 選択肢に出さず Q4（pokemon_gen）が担う。
   * undefined = こだわりなし
   */
  pokemon_context?: PokemonContext[]
  /**
   * Q4: ポケモン世代（複数選択可。undefined または空配列 = 詳しくない / スキップ）
   * いずれかのグループに曲の pokemon_gen が含まれれば +2
   */
  pokemon_gen?: PkmnGenGroup[]
  /**
   * Q5: 好きなキャラクター（複数選択可。undefined または空配列 = 気にしない）
   * いずれかの pref が曲の vocaloids に含まれれば +2
   */
  vocaloid_pref?: VocaloidPref[]
}
