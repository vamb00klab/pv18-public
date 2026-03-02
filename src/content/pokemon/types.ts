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

const ILLUST = "https://www.project-voltage.jp/illust.html";

export const pokemonTypes: PersonaType[] = [
  // 1 — ほのお
  {
    type_id: "fire",
    label: "ほのおタイプ",
    shortLabel: "FIRE",
    description:
      "情熱と闘志を燃やし続ける、熱いパフォーマー。どんな逆境も炎のような意志で焼き払い、仲間を鼓舞して前へ進む。",
    traits: ["情熱的", "行動力", "熱血", "鼓舞力"],
    color: "#FF612C",
    bgColor: "#FFF2EE",
    suitableFor: ["直感でまず動ける", "熱中対象があると爆発的に伸びる", "主導権を握って推進したい", "仲間と熱いセッションで盛り上がれる"],
    strengths: ["推進力・突破力", "周囲を巻き込む熱量"],
    weaknesses: ["飽きやすくムラが出る", "詰めや検証が後回しになりがち"],
    officialUrl: `${ILLUST}#illust03`,
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
    officialUrl: `${ILLUST}#illust04`,
  },
  // 3 — くさ
  {
    type_id: "grass",
    label: "くさタイプ",
    shortLabel: "GRASS",
    description:
      "仲間を全力で応援し、チームの力を引き出す。明るいエネルギーと持ち前のリズム感で、周囲を元気づける存在。",
    traits: ["応援力", "チームワーク", "明るさ", "リズム感"],
    color: "#42BF24",
    bgColor: "#F0FAEE",
    suitableFor: ["チームを盛り上げられる", "一緒にいると元気が出ると言われる", "協力して成果を出すのが好き", "リズムよく物事を進められる"],
    strengths: ["チームを鼓舞する力", "共感しながら支える力"],
    weaknesses: ["自分のことは後回しになりがち", "頑張りすぎて息切れする"],
    officialUrl: `${ILLUST}#illust02`,
  },
  // 4 — でんき
  {
    type_id: "electric",
    label: "でんきタイプ",
    shortLabel: "ELECTRIC",
    description:
      "鋭い閃きとサプライズで、場の空気を一変させるエンターテイナー。予測不能な発想で周囲を驚かせ、新鮮な興奮をもたらす。",
    traits: ["閃き", "サプライズ", "エネルギッシュ", "演出力"],
    color: "#FFDB00",
    bgColor: "#FFFCEB",
    suitableFor: ["発想豊富", "サプライズ好き", "行動が早い", "注目を集めたい"],
    strengths: ["演出力・サプライズ力", "スピード"],
    weaknesses: ["散漫", "継続力不足"],
    officialUrl: `${ILLUST}#illust05`,
  },
  // 5 — こおり
  {
    type_id: "ice",
    label: "こおりタイプ",
    shortLabel: "ICE",
    description:
      "冷静な分析力と鋭い判断の持ち主。感情に流されず、クールな視点で物事の本質を見抜くプロフェッショナル。",
    traits: ["冷静", "分析力", "鋭敏", "プロ意識"],
    color: "#42D8FF",
    bgColor: "#F0FCFF",
    suitableFor: ["論理型", "冷静沈着", "分析派", "プロフェッショナル志向"],
    strengths: ["判断力", "客観性"],
    weaknesses: ["冷たく見える", "共感不足"],
    officialUrl: `${ILLUST}#illust07`,
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
    officialUrl: `${ILLUST}#illust17`,
  },
  // 7 — どく
  {
    type_id: "poison",
    label: "どくタイプ",
    shortLabel: "POISON",
    description:
      "既存の常識をひっくり返す実験精神と洞察力。表に見えないものを感じ取り、科学的な好奇心で独自の解を見つけ出す。",
    traits: ["洞察力", "実験精神", "直観", "独創性"],
    color: "#994DCF",
    bgColor: "#F7F1FB",
    suitableFor: ["独自路線", "実験好き", "逆張り", "科学的思考"],
    strengths: ["実験力・検証力", "差別化"],
    weaknesses: ["誤解されやすい", "皮肉的"],
    officialUrl: `${ILLUST}#illust13`,
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
    officialUrl: `${ILLUST}#illust09`,
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
    officialUrl: `${ILLUST}#illust10`,
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
    officialUrl: `${ILLUST}#illust01`,
  },
  // 11 — むし
  {
    type_id: "bug",
    label: "むしタイプ",
    shortLabel: "BUG",
    description:
      "小さな美しさや儚さに心を寄せる繊細な感性。細やかな連携と地道な積み重ねで、静かに大きな力を生む。",
    traits: ["繊細", "細やか", "連携", "粘り強さ"],
    color: "#9FA424",
    bgColor: "#F7F8EE",
    suitableFor: ["専門志向", "集中型", "繊細な感性を活かせる", "こだわり"],
    strengths: ["繊細な感性", "深掘力"],
    weaknesses: ["視野狭窄", "説明下手"],
    officialUrl: `${ILLUST}#illust12`,
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
    officialUrl: `${ILLUST}#illust08`,
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
    officialUrl: `${ILLUST}#illust14`,
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
    officialUrl: `${ILLUST}#illust18`,
  },
  // 15 — あく
  {
    type_id: "dark",
    label: "あくタイプ",
    shortLabel: "DARK",
    description:
      "洗練された存在感と、冷静な判断力。光と影の両面を見据え、独自の美意識とカリスマで周囲を導く。",
    traits: ["洗練", "知恵", "カリスマ", "冷静"],
    color: "#4F4747",
    bgColor: "#F1F0F0",
    suitableFor: ["統率力がある", "洗練された美意識", "現実志向", "交渉型"],
    strengths: ["統率力・カリスマ", "交渉力"],
    weaknesses: ["冷酷視", "摩擦"],
    officialUrl: `${ILLUST}#illust15`,
  },
  // 16 — はがね
  {
    type_id: "steel",
    label: "はがねタイプ",
    shortLabel: "STEEL",
    description:
      "理想を追い求め、長い旅路を歩み続ける求道者。高い基準と不屈の意志で、確かな技術を磨き続ける。",
    traits: ["探求心", "意志力", "職人気質", "精密"],
    color: "#6AAED3",
    bgColor: "#F3F9FC",
    suitableFor: ["求道者タイプ", "正確型", "長期目標に向かえる", "品質重視"],
    strengths: ["探求心", "品質"],
    weaknesses: ["融通不足", "硬直"],
    officialUrl: `${ILLUST}#illust16`,
  },
  // 17 — フェアリー
  {
    type_id: "fairy",
    label: "フェアリータイプ",
    shortLabel: "FAIRY",
    description:
      "温かな愛情と親しみやすい人柄。気取らない自然体で人を惹きつけ、周囲に笑顔と幸福をもたらす。",
    traits: ["愛情", "親しみ", "共感", "笑顔"],
    color: "#FEB1FD",
    bgColor: "#FFF9FF",
    suitableFor: ["共感型", "支援型", "平和志向", "誰とでもすぐ仲良くなれる"],
    strengths: ["調和力", "包容力"],
    weaknesses: ["気疲れ", "依存傾向"],
    officialUrl: `${ILLUST}#illust11`,
  },
  // 18 — ノーマル
  {
    type_id: "normal",
    label: "ノーマルタイプ",
    shortLabel: "NORMAL",
    description:
      "明るく社交的で、誰とでも自然に打ち解ける。場を盛り上げるコミュニケーションの達人で、人と人をつなぐ架け橋になる。",
    traits: ["社交的", "コミュ力", "明るさ", "親しみ"],
    color: "#999999",
    bgColor: "#F7F7F7",
    suitableFor: ["ムードメーカー", "話し上手", "人脈を広げられる", "場を盛り上げるのが得意"],
    strengths: ["コミュニケーション力", "場を明るくする力"],
    weaknesses: ["八方美人になりがち", "深い専門性が育ちにくい"],
    officialUrl: `${ILLUST}#illust06`,
  },
];
