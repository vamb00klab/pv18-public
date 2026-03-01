/**
 * Pokemon content pack — 18 type definitions.
 *
 * 「ポケモン」「Pokémon」は任天堂・クリーチャーズ・ゲームフリークの登録商標です。
 * © Nintendo / Creatures Inc. / GAME FREAK inc.
 * 本サイトは非公式ファンサイトです。
 *
 * type_id 命名規則:
 *   公式英語タイプ名をそのまま使用（scoreMap の可読性を最優先）
 *
 * タイプ対応表:
 *   # | type_id   | ポケモン和名
 *   --+-----------+-------------
 *   1 | fire      | ほのお
 *   2 | water     | みず
 *   3 | grass     | くさ
 *   4 | electric  | でんき
 *   5 | ice       | こおり
 *   6 | fighting  | かくとう
 *   7 | poison    | どく
 *   8 | ground    | じめん
 *   9 | flying    | ひこう
 *  10 | psychic   | エスパー
 *  11 | bug       | むし
 *  12 | rock      | いわ
 *  13 | ghost     | ゴースト
 *  14 | dragon    | ドラゴン
 *  15 | dark      | あく
 *  16 | steel     | はがね
 *  17 | fairy     | フェアリー
 *  18 | normal    | ノーマル
 */
import type { PersonaType } from "@/types/persona";

export const pokemonTypes: PersonaType[] = [
  // 1 — ほのお
  {
    type_id: "fire",
    label: "ほのおタイプ",
    shortLabel: "FIRE",
    description:
      "情熱と闘志を燃やし続ける、熱血漢。どんな逆境も炎のような意志で焼き払い、仲間を鼓舞して前へ進む。",
    traits: ["情熱的", "行動力", "熱血", "勇気"],
    color: "#FF612C",
    bgColor: "#FFF2EE",
    suitableFor: ["直感でまず動ける", "熱中対象があると爆発的に伸びる", "主導権を握って推進したい", "勝負所でアクセルを踏める"],
    strengths: ["推進力・突破力", "周囲を巻き込む熱量"],
    weaknesses: ["飽きやすくムラが出る", "詰めや検証が後回しになりがち"],
  },
  // 2 — みず
  {
    type_id: "water",
    label: "みずタイプ",
    shortLabel: "WATER",
    description:
      "どんな状況にも柔軟に適応し、流れを読んで仲間を導く。深い包容力と直感で、周囲をそっと支える。",
    traits: ["柔軟性", "適応力", "直感", "包容力"],
    color: "#2992FF",
    bgColor: "#EEF6FF",
    suitableFor: ["空気を察しやすい", "状況対応力が高い", "調整役になれる", "受け止め役"],
    strengths: ["柔軟性", "協調性"],
    weaknesses: ["流されやすい", "疲れを溜めやすい"],
  },
  // 3 — くさ
  {
    type_id: "grass",
    label: "くさタイプ",
    shortLabel: "GRASS",
    description:
      "穏やかで思いやり深く、人と自然をつなぐ存在。じっくりと根を張り、周囲を癒しながら成長し続ける。",
    traits: ["思いやり", "協調性", "粘り強さ", "癒し"],
    color: "#42BF24",
    bgColor: "#F0FAEE",
    suitableFor: ["継続型", "育成志向", "裏方向き", "長期志向"],
    strengths: ["継続力", "忍耐力"],
    weaknesses: ["変化に弱い", "保守的"],
  },
  // 4 — でんき
  {
    type_id: "electric",
    label: "でんきタイプ",
    shortLabel: "ELECTRIC",
    description:
      "鋭い閃きと素早い判断で、場の空気を一変させる。予測不能な発想が、周囲に新鮮な刺激と活力をもたらす。",
    traits: ["機敏", "閃き", "エネルギッシュ", "創造性"],
    color: "#FFDB00",
    bgColor: "#FFFCEB",
    suitableFor: ["発想豊富", "新規好き", "行動が早い", "発信型"],
    strengths: ["創造性", "スピード"],
    weaknesses: ["散漫", "継続力不足"],
  },
  // 5 — こおり
  {
    type_id: "ice",
    label: "こおりタイプ",
    shortLabel: "ICE",
    description:
      "冷静な分析力と精密な思考の持ち主。感情に流されず、鋭い観察眼で物事の本質を静かに見抜く。",
    traits: ["冷静", "分析力", "精密", "理知的"],
    color: "#42D8FF",
    bgColor: "#F0FCFF",
    suitableFor: ["論理型", "冷静", "分析派", "客観視"],
    strengths: ["判断力", "客観性"],
    weaknesses: ["冷たく見える", "共感不足"],
  },
  // 6 — かくとう
  {
    type_id: "fighting",
    label: "かくとうタイプ",
    shortLabel: "FIGHTING",
    description:
      "強靭な意志と圧倒的な実行力。正義感が強く、不条理に立ち向かい、弱者を守るために全力を尽くす。",
    traits: ["強靭", "正義感", "実行力", "不屈"],
    color: "#FFA202",
    bgColor: "#FFF8EB",
    suitableFor: ["努力型", "負けず嫌い", "根性派", "成長志向"],
    strengths: ["粘り強さ", "精神力"],
    weaknesses: ["無理しがち", "視野狭窄"],
  },
  // 7 — どく
  {
    type_id: "poison",
    label: "どくタイプ",
    shortLabel: "POISON",
    description:
      "複雑な物事の本質を見抜く洞察力を持つ。表に見えないものを感じ取り、独自の知恵で周囲を導く。",
    traits: ["洞察力", "神秘的", "直観", "深淵"],
    color: "#994DCF",
    bgColor: "#F7F1FB",
    suitableFor: ["独自路線", "戦略型", "逆張り", "空気読める"],
    strengths: ["差別化", "戦略性"],
    weaknesses: ["誤解されやすい", "皮肉的"],
  },
  // 8 — じめん
  {
    type_id: "ground",
    label: "じめんタイプ",
    shortLabel: "GROUND",
    description:
      "どっしりとした安定感と揺るぎない信頼性。大地のように周囲の重荷を支え、確かな基盤を作り出す。",
    traits: ["安定", "信頼", "忍耐", "支持力"],
    color: "#AB7939",
    bgColor: "#F8F4EF",
    suitableFor: ["現実派", "計画型", "堅実", "管理型"],
    strengths: ["実行力", "信頼性"],
    weaknesses: ["保守的", "柔軟性不足"],
  },
  // 9 — ひこう
  {
    type_id: "flying",
    label: "ひこうタイプ",
    shortLabel: "FLYING",
    description:
      "自由を愛し、枠にとらわれない発想で可能性を広げる。軽やかに変化し、新しい風を周囲に運ぶ。",
    traits: ["自由", "軽快", "開放感", "変化"],
    color: "#95C9FD",
    bgColor: "#F7FBFF",
    suitableFor: ["自由志向", "行動派", "好奇心旺盛", "軽快"],
    strengths: ["機動力", "発想力"],
    weaknesses: ["定着しない", "ルーズ"],
  },
  // 10 — エスパー
  {
    type_id: "psychic",
    label: "エスパータイプ",
    shortLabel: "PSYCHIC",
    description:
      "深い感受性と高い共感力を持つ。人の心の機微を読み取り、見えない絆でつながり、そっと寄り添う。",
    traits: ["共感力", "感受性", "洞察", "繊細"],
    color: "#FC637F",
    bgColor: "#FFF3F5",
    suitableFor: ["直感派", "洞察型", "抽象思考", "内省型"],
    strengths: ["洞察力", "先読み"],
    weaknesses: ["考えすぎ", "繊細"],
  },
  // 11 — むし
  {
    type_id: "bug",
    label: "むしタイプ",
    shortLabel: "BUG",
    description:
      "小さな積み重ねと細やかな連携が大きな力を生む。地道な努力と粘り強さで、不可能を可能にする。",
    traits: ["協力", "細やか", "連携", "粘り強さ"],
    color: "#9FA424",
    bgColor: "#F7F8EE",
    suitableFor: ["専門志向", "集中型", "改善型", "こだわり"],
    strengths: ["専門性", "深掘力"],
    weaknesses: ["視野狭窄", "説明下手"],
  },
  // 12 — いわ
  {
    type_id: "rock",
    label: "いわタイプ",
    shortLabel: "ROCK",
    description:
      "堅固な意志と確固たる信念の持ち主。何があっても揺らがない、頼もしい存在として皆を守り抜く。",
    traits: ["堅固", "信念", "防御", "頼もしさ"],
    color: "#BCB889",
    bgColor: "#FAF9F4",
    suitableFor: ["信念型", "責任感", "耐久型", "安定志向"],
    strengths: ["安定感", "忍耐力"],
    weaknesses: ["頑固", "変化苦手"],
  },
  // 13 — ゴースト
  {
    type_id: "ghost",
    label: "ゴーストタイプ",
    shortLabel: "GHOST",
    description:
      "静かに観察し、誰も気づかない本質を見抜く鋭い感性を持つ。独特の世界観が、周囲に不思議な奥行きをもたらす。",
    traits: ["神秘", "観察眼", "独自性", "影の力"],
    color: "#6E4570",
    bgColor: "#F3F0F4",
    suitableFor: ["内向型", "想像派", "世界観重視", "夜型"],
    strengths: ["独創性", "表現力"],
    weaknesses: ["孤立", "気分屋"],
  },
  // 14 — ドラゴン
  {
    type_id: "dragon",
    label: "ドラゴンタイプ",
    shortLabel: "DRAGON",
    description:
      "高い理想と壮大なビジョンを持つ夢想家。遠くを見つめ、誰も見たことのない未来を力強く描く。",
    traits: ["理想主義", "ビジョン", "壮大", "創造"],
    color: "#5462D6",
    bgColor: "#F1F2FC",
    suitableFor: ["高理想", "向上心", "勉強家", "挑戦型"],
    strengths: ["学習力", "影響力"],
    weaknesses: ["完璧主義", "プレッシャー過多"],
  },
  // 15 — あく
  {
    type_id: "dark",
    label: "あくタイプ",
    shortLabel: "DARK",
    description:
      "光と影を等しく見つめ、現実を冷静に受け止める力がある。独自の価値観を軸に、ぶれることなく自分の道を歩む。",
    traits: ["内省", "知恵", "哲学的", "深沈"],
    color: "#4F4747",
    bgColor: "#F1F0F0",
    suitableFor: ["合理派", "割り切り型", "現実志向", "交渉型"],
    strengths: ["判断力", "交渉力"],
    weaknesses: ["冷酷視", "摩擦"],
  },
  // 16 — はがね
  {
    type_id: "steel",
    label: "はがねタイプ",
    shortLabel: "STEEL",
    description:
      "強い精神と完璧主義的な姿勢。高い基準を持ち、確かな技術と不屈の意志力で理想を形にする。",
    traits: ["完璧主義", "意志力", "職人気質", "精密"],
    color: "#6AAED3",
    bgColor: "#F3F9FC",
    suitableFor: ["規律派", "正確型", "管理型", "品質重視"],
    strengths: ["品質", "統制力"],
    weaknesses: ["融通不足", "硬直"],
  },
  // 17 — フェアリー
  {
    type_id: "fairy",
    label: "フェアリータイプ",
    shortLabel: "FAIRY",
    description:
      "温かな愛情と魅力的な人柄。人を惹きつけ、周囲に幸福と笑顔をもたらす特別な輝きを持つ。",
    traits: ["愛情", "魅力", "共感", "幸福"],
    color: "#FEB1FD",
    bgColor: "#FFF9FF",
    suitableFor: ["共感型", "支援型", "平和志向", "優しい"],
    strengths: ["調和力", "包容力"],
    weaknesses: ["気疲れ", "依存傾向"],
  },
  // 18 — ノーマル
  {
    type_id: "normal",
    label: "ノーマルタイプ",
    shortLabel: "NORMAL",
    description:
      "特定の型にはまらず、どんな場でも自分の軸を保つ。着実な積み重ねが、やがて揺るがない信頼と実績になる。",
    traits: ["バランス", "安定", "実直", "堅実"],
    color: "#999999",
    bgColor: "#F7F7F7",
    suitableFor: ["バランス型", "常識派", "適応型", "安定志向"],
    strengths: ["汎用性", "安定感"],
    weaknesses: ["個性薄", "優柔不断"],
  },
];
