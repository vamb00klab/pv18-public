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
    intro: '『きみにきめた』という出会いの原点を、世代をまたぐ記憶と未来への再出発へつなぐ祝祭的な楽曲。歌詞では『無限大の中のただ一つ』『偶然なんかじゃなかった』と、数え切れない分岐の中で選び取った相棒との歩みを肯定し、別れと旅立ちを前向きな継続として描いている。歴代パッケージポケモンの連なりや殿堂入りモチーフに涙し、ノスタルジーと現在進行形の冒険心を同時に呼び起こす"世代横断の旅のアンセム"を感じられる曲だ。',
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
    intro: 'ポケモン語彙を散りばめた高速ポップで"子どもの頃の高揚を再起動する"ことを正面から描いた楽曲。歌詞では『12…のポカン』『なみだのレポート』『めのまえまっくら』のようにゲーム体験を身体感覚として呼び戻し、『いつだって戻って来れるんだ』『ドキドキを取り返していけ』へ収束させることで、大人になって鈍ったときめきをもう一度取り戻す意志を打ち出している。指人形（ポケモンキッズ）や初代DS、HGSSモチーフが効いていて、"懐かしさに浸る曲"というより"今の自分をもう一度ワクワク側へ引き戻す曲"だと感じられる。',
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
    intro: 'ポケミク楽曲の中でも稀な"特定キャラクター（N）への深掘り"を前面に押し出した、不穏で知的なキャラクター解釈曲。歌詞では1番と2番を対応させる回文構造や『正と偽』『等式／不等式』といった対立語を使い、Nの高速思考と信念の揺らぎを言葉そのものの設計で表現している。BW当時の"得体の知れないN"の再現、ゲーチスの気配を含む音響演出、2分51秒（251）などの執拗な仕掛けが重なり、懐古ファンサに留まらない"考察型アンセム"として強く感じられる。',
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
    intro: 'ピカチュウ専用の反動技を"傷つく覚悟ごとの恋"へ翻訳した、ポケミクの王道ポップ。歌詞は『すてみなんだもん』『照れのはんどう真っ赤ボルテッカー』『嫌いのタスキ掛けないで』のように、技名・特性・対戦語彙を感情表現へ接続し、恋の高揚と痛みを同時に走らせる設計になっている。Bボタン連打→Aボタンや捕獲SE、歴代BGMの引用まで含めた"わかる人ほど刺さる仕掛け"が効いていて、単なるコラボ曲ではなく、ポケモン体験と言語化しにくい恋心を同じ回路で鳴らす"高密度ギミック型ラブソング"として感じられる。',
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
    intro: 'ポケモン用語を借りて"初音ミクという電子的存在そのもの"を語り直した、ポケミク屈指のコンセプト曲。歌詞の文節をゲームテキスト風に刻み、『この声はいまひとつ』『感情を知らないきれいな声』『感情をでんきにかえて』へ接続することで、タイプ相性の比喩を通して"刺さる／刺さらない"という聴取体験まで内包している。雨＋かみなりの戦術や歴代BGMの引用、ゲートBGMへの着地といった仕掛けが噛み合い、懐古ネタの寄せ集めではなく、ポケモンのUI/音響文法でボカロの現在地を更新する"メタ電子ポップ"として強く感じられる。',
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
    intro: '"ポケモン要素を入れた曲"ではなく、言葉遊びとゲーム音響そのものを作曲素材にして"ポケモン体験の手触り"を再現した祝祭ポップ。歌詞は「博士曰く」「まだスリープ」「不思議騒然」「ミライどんなだろう」といった連鎖で、ポケモン名を自然な文脈に埋め込みながら、〈友情はまだつぼみ〉から〈絆が深まる〉へ進む成長譚を描く。歴代BGM/SEの引用、アニポケED的な王道感、英訳字幕の語呂合わせまで噛み合い、"ポケモン愛の情報量"と"Mitchie M流の明るい歌唱設計"を高密度で両立したハッピー・アンセムとして強く感じられる。',
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
    intro: 'ポケモン世界の物語ではなく「それを遊んできた私たち」の人生を主語にした、ポケミク随一のプレイヤー視点ソング。歌詞は「君は存在しないけど すぐそばに確かにいる」「強くても 弱くても 人気でも 不人気でも」と言い切り、実在しない存在への愛を否定せず、相棒の価値を他人の評価から解放する。ゲームボーイ→DSへの画面遷移やレポートSEの使い方、「HP1でもまだ歩けるかな」「あの頃のワクワクを捨てないで」という感覚まで重なり、懐古の再現ではない"年齢を重ねたトレーナーの現在"を肯定する、静かで強いライフソングだと感じられる。',
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
    intro: 'ポケモンの"戦闘BGM文法"をcosMo節で再構築した、シリーズ随一のハイテンション対戦曲。歌詞は全編ひらがな中心でゲームテキストの手触りを再現しつつ、「じぶんを しんじられる つよさ」「あいてを こえるための かくご」と問いを反復して、挑戦者への煽りとチャンピオン自身の自問を二重化する。Aボタン連打や回復SE、初代〜各世代戦闘曲の引用、ニドリーノ/ゲンガー（→ニドキング）構図まで重なり、懐古BGMメドレーに留まらず、"勝敗の先にある敬意"まで含めてポケモンバトルの熱を現代的に再演した、実戦型バトル・アンセムとして強く感じられる。',
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
    intro: '進化＝成長というポケモンの王道価値を、友情のかたちを守る選択として反転させた、やさしくも芯の強い対話曲。ミズゴロウとペリッパーの会話は、「強くなること」と「一緒にいること」を対立させたうえで、最終的に〈誰かのための自己犠牲〉ではなく〈自分で選んだ在り方〉へ着地する。変化を礼賛するだけではなく、変わらないことを自分の意志で選ぶ尊さと"相棒と飛び続ける日常そのものが宝物"という感覚がまっすぐ届く一曲だ。',
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
    intro: 'ミュウ探索という初代ポケモンの熱狂を、Gigaの高速ビートで現代的に再起動した追跡型パーティーチューン。歌詞は「151のみちへダイブ」「まっさらからすすめ」「Chase down Mew!」でマサラからチャンピオンロードまでを一気に走り抜け、技名・道具名・性格語彙まで織り込んで"トレーナーの日常語"をラップ的に圧縮している。1:39付近のシオンタウン旋律、KAITOによる図鑑ボイス、リンレンを含めたクリプトン総出演、レトロ画風からの進化演出まで噛み合い、不気味さの記憶すら踊れる熱量へ変換する"ハイパーポップ型ポケミク"として強く感じられる。',
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
    intro: 'イーブイの"多様な進化先"を、少年少女が自分の輪郭を見つけていく過程に重ねた青春アンセム。歌詞は「君と僕は違うから」「全部が全部 一生物ばかり」と、違いを前提にしながら同じ旅路を歩む肯定へ着地し、地図・色・街のモチーフで成長を連続的に描く。進化BGMで終わりながら進化先を見せないラスト、旅を経て"初音ミク"へ到達する映像、世代横断のBGM引用まで重なり、懐古をなぞるだけでなく「何者にでもなれる途中の自分」を祝福する、ポケミク屈指のジュブナイル作品として強く感じられる。',
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
    intro: 'ゴーストタイプを"怖がられる存在"ではなく"触れられない強さを持つ自己像"として描き切った、ポケミク屈指の挑発型ダークアンセム。歌詞はシオンタウン文脈を芯に、「あなた ゆうれいは いると おもう？」「あなたのみぎかたに」といった原作由来のフレーズ、みやぶる・シャドークロー・みちづれ等の技語彙、そして「syudou苦労人」の自己名指しまでを高速の韻で接続し、闇を"弱さ"ではなく"武器"へ転換する。シオンタウンBGMを崩さずにアッパーへ変換した編曲、ノーマル無効を示す「指一本触れることも出来ない」の解釈、都市伝説ネタの回収まで重なり、ホラー記号を借りながら自己肯定と戦闘意志を打ち出す、極めてsyudou的なポケモン楽曲として強く感じられる。',
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
    intro: 'ビッパ偏愛をコミカルに押し切りながら、秘伝要員として扱われがちだった存在を"推し"へ反転させる異色のポケミク楽曲。歌詞は「いわくだき・いあいぎり独占」「たんじゅん」「てんねん」「ノーマル・みず唯一無二」など実プレイ前提の語彙を連打し、B連打で進化キャンセルするネタまで織り込んで、ダイパ体験を笑いと愛情で再編集する。ビッパ再評価に至る体験談や「ビッパ、キミにきめた！」文脈、げっ歯類トークまで連鎖し、"丁寧なゴリ押し"の先にあるマイナーポケモンへの誠実な愛を可視化した、ストロングスタイルの偏愛アンセムとして強く感じられる。',
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
    intro: 'ゴーストタイプの"こわい"と"かわいい"を同時成立させたまま、怪談を祝祭へ反転させるポケミク屈指の異形ダンスチューン。歌詞は「1 2の…ポカン！」「てだすけで連れてって」「アンノーン」などの語を自然に織り込み、うらみつらみの世界を描きながらも最終的には酔いと高揚へ着地する。「ポケモンの世界のボカロ曲」と感じる没入感、シオンタウンや森の洋館、黄泉戸喫モチーフの読解、ミミッキュとカラカラの描写まで噛み合い、ポケモン要素を前面に叫ぶのではなく世界観へ沈めて効かせる"高密度ゴーストポップ"として強く感じられる。',
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
    intro: '伝説ポケモンとの邂逅を"壮大な神話"ではなく"息を呑んだ一瞬"として切り出した、透明感の強い遭遇譚。歌詞は「懐かしい海の香り」「言葉は出ないまま」「一瞬の風に」で、旅を重ねたトレーナーがルギアを前に言語化不能になる感覚を描き、サビであえて言葉を薄くする構成がその体験を補強する。水音から始まるルギア咆哮の再現、2:49（図鑑番号249）や投稿日2/16（体重216.0kg）への合わせ込み、相棒レントラーと再会する"必然のEncounter"解釈まで重なり、ポケモン愛を過剰に説明せず、記憶に残る一場面だけで心を撃つ高密度エモーショナルとして強く感じられる。',
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
    intro: 'ラティアス/ラティオスへの偏愛を、GBA時代の記憶からORASの大空体験まで一本の線でつないだ"思い出輸送曲"。歌詞は「ガラスの羽」「やさしいテレパシー」「ミストボール」「ラスターパージ」「こころのしずく」など図鑑・専用技・映画語彙を丁寧に編み込み、「あの日のきみに贈る／ぼくが受け取った」で過去の自分と現在の自分がチケットを受け渡す構図を作る。ラティ兄妹＝ミクKAITOの配役、みなみのことうやミナモシティのBGM引用、3:09以降のメガシンカ〜おおぞらをとぶ演出まで重なり、懐古で終わらない"今も続く旅の感情"を再起動する、世代横断のノスタルジック・アンセムとして強く感じられる。',
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
    intro: 'ロケット団的な"悪の美学"をクラブ/ヒップホップの推進力で再構築し、悪役を「倒される存在」ではなく「自分の流儀を貫く主役」として描いた一曲。歌詞は「泣く子も黙る」「わるだくみの時間だ」「ダサい挑発なんて かみ砕く」「不滅の意志で迎え撃つ」と、悪タイプ技や挑発語彙を連打しながら、規範からはみ出す自己肯定を高圧で宣言する。題名の「PARTY ROCK ET(ロケット)ERNITY」解釈、サカキ台詞や金銀ロケット団（ラジオ塔）への接続、登場ポケモン選定まで重なり、懐古ネタに留まらない"ヴィラン視点のポケモン賛歌"として強く感じられる。',
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
    intro: '"旅の途中"ではなく"旅立つ直前"を描くことで、ポケモン体験の原点にある憧れと不安をすくい上げた序章の歌。歌詞は「誰かがした冒険のおすそわけを見ている」から「書き残したレポートが 旅に出る前に埋まっちゃう」、そして「たいせつなものを受け取ったから」へ進み、見ているだけだった子どもが当事者へ変わる瞬間を、ピチューと並走しながら丁寧に描く。"旅前だから既存ポケモンBGM引用が控えめ"という読解、2:18以降のミクママの語り（「急がないで 振り返って 戻ってきたっていいのよ」）、「おすそわけ」を兄弟プレイや世代継承の記憶として受け取る感覚まで重なり、冒険の高揚だけでなく見送る愛まで含めて旅を再定義した、世代横断のスタートソングとして強く感じられる。',
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
    intro: '恋の駆け引きをエスパータイプの対戦文法に丸ごと変換した、"ラブソング×バトル実況"のハイブリッドポップ。歌詞は「スプーンまげ」「めいそう」「コスモパワー」「ハートひとつにしてからゲットしちゃうぞ」「もうにげることができない」まで、技・特性・捕獲の語彙を連結し、読めそうで読めない相手へじわじわ詰める恋心をコミカルに描く。「ハートひとつ」=HP1ミリ残し解釈、テレポート/かげふみの読み、ジョウト・スター団・N戦などBGM引用特定、デオキシスの合いの手や"阿波踊り"ミームまで連鎖し、ポケモン知識の深さを"解説したくなる楽しさ"に変えた高密度コラボとして強く感じられる。',
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
    intro: 'フェアリーの"かわいさ"を入口にしながら、対戦環境での"かわいくない強さ"と執着をむき出しにする、クチート中核のラブ・バトルソング。歌詞は「このゆびとまれ」「メロメロ」「とける」「うそなき」「ばけのかわ」「めのまえがまっくら」「がぶり」まで技・特性・敗北演出を連打し、「好きだらけ／隙だらけ」「LOVE→LIE」の反転で、恋心がいつの間にか拘束と捕食へ変質していく流れを作る。ニンフィア不在=一方通行の愛という読解、赤い糸やようせいのはね、終盤までクチートを伏せてメガクチートを切り札投入する演出、2:10ビート戦を含むBGM/SE引用まで重なり、"甘いピンク"と"害悪戦法"を同時成立させた中毒系トラックとして強く感じられる。',
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
    intro: '"チャンピオンに挑み続けてきた記憶"を世代横断で再点火する、ポケミク終盤の総決算アンセム。歌詞は「よくここまで辿りついたな」「マダマダッ!! 終わっちゃいないさ」「ゼンリョクでいくから こい」「世界で一番！ 強いってこと」「キミにきめた！」と、歴代シリーズの名台詞温度をまとったフレーズを連鎖させ、勝敗を超えて続く"冒険の現在進行形"を描く。歴代チャンピオン戦BGMの高密度引用、1:55前後の手持ちをチャンピオンの切り札で組む演出、終盤の18タイプミク一斉回収、とくに2:07でレッド戦モチーフと共に無言で現れて去るカットまで重なり、懐古に留まらず次の旅へ背中を押す"王者戦の記憶装置"として強く感じられる。',
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
    intro: '旅立ちや勝利そのものよりも"出逢いと別れを抱えたその後"を描く、ポケミク世界のエンドロール兼リスタート曲。歌詞は「アシアトも、キズアトも 君と生きるための旅人」「未来 またね」「指先に架ける夢の、続きで逢いましょう」と、一区切りの寂しさを否定せず次の再会へ接続し、ポケットの中の物語が世代を越えて続くことを静かに宣言する。相棒が図鑑No.39の"うたう"ポケモンであるプリンに重なる必然性、N登場シーンで「さよなら」ではなく「またね」を置く解釈、ホウオウを起点に歴代主人公・ジムリーダー・各世代要素を横断するMV構成まで重なり、ミクを"単一主人公"ではなく"どの時代にもいた旅人"として成立させた、世代横断の追憶と継承のラブレターとして強く感じられる。',
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
    intro: 'シロナ戦の"勝てそうで勝てない恐怖"をKanaria流の語感とビートで再演した、敗北記憶直撃型バトルポップ。歌詞はミカルゲの「百と八ッつ」、ロズレイドの「花束」「真っ赤っ赤なアイ」、ルカリオの「FIGHT THE IN FIGHT」「波に問い」、ミロカロスの「七色」「いつくしむ」、トゲキッスの「しゅくふく」、ガブリアスの「FIGHT THE DRAGON DIVE」「刃舞い飛び空を裂き」まで手持ち要素を高密度に接続し、技名と図鑑語彙でチャンピオン像を立体化する。1:50のかいふくのくすりSEで蘇る絶望、低HP警告音や鳴き声の編み込み、ルカリオのタスキ再現、ひらがな表記から漢字表記への移行まで重なり、"ガブリアスだけではないシロナ戦全部"を体感として呼び戻す高解像度リメイクとして強く感じられる。',
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
    intro: '進化シーンのSEを骨格にして、相棒と歩いた"足跡"だけで冒険を語る抽象的ロードソング。歌詞は「今日のレポート」「あめがふる／うごけない」「にげられない／あたらない／たてなおす」「どうぐは少しずつ減るけど」と、旅中の細かな実感を積み上げたうえで「ボクらはまだしんかを残している」に着地し、最終進化後も続く関係性を示す。「しんか」を進化/真価の二重意味で読む解釈、モンスターボール視点のMV読解、足跡と色面だけでポケモンを想起できる設計、ルビサファ大雨BGMや各種SE引用まで重なり、固有名詞をほとんど使わずに"ポケモンをやってきた記憶そのもの"を呼び起こす、静かで強い継続のアンセムとして強く感じられる。',
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
    intro: 'テトの"ウソから生まれた存在"という来歴を起点にしつつ、誰もが社会で纏う仮面や擬態を肯定する、風刺混じりの自己受容アンセム。歌詞は「ばけのかわ」「みがわり」「こんらん」「めのまえが まっくら」「わるあがき」などポケモン語彙を心情比喩として編み込み、「あの日のウソが、いつかはホントになるかもしれない」で、偽物/本物の二項対立を越えて"信じ続ける行為"そのものを主題化する。UTAUテトとSVテトの同時歌唱・掛け合い調声、模倣系ポケモン配置の読解、テト誕生史と重なる感覚まで噛み合い、単なる記念コラボに留まらない、弱さゆえの偽装を抱えたまま前進するための実践的なエンパワメントとして強く感じられる。',
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
    intro: 'メロエッタと初音ミクという"二人の歌姫"の邂逅を、Omoiらしい推進力で祝祭化したポケモン30周年節目のアンセム。歌詞の「やっと会えたね」「いにしえのうたも ハジメテノオトも」は、過去と現在、ポケモン史とボカロ史を接続する要として機能し、二つの歴史が出会う瞬間の必然性を鮮明に立ち上げる。スカイアローブリッジ想起の旋律、キー設計や転調、メロエッタの歌声とのユニゾン演出まで重なり、懐古に留まらず"これから先も一緒に歌い続ける約束"を強く感じられる一曲だ。',
  },
]
