/**
 * Pokemon content pack — type × axis score mappings.
 *
 * ⚠️  PERSONAL USE ONLY — DO NOT PUBLISH
 *
 * 各タイプを 7本の性格軸（pokemonAxes）に対して -2〜+2 でスコアリングする。
 *
 * スコアの意味:
 *   +2 = その軸の傾向が非常に強い（強み・核心的特性）
 *   +1 = やや強い
 *    0 = 中立（その軸が本質的に問われない、または両面を持つ）
 *   -1 = やや弱い（反対傾向を持つ）
 *   -2 = 非常に弱い・反対傾向が強い（弱点・コントラスト）
 *
 * 設計根拠: design_notes/AXIS_DESIGN.md 参照。
 * 設計素材: design_notes/pv18_type_definitions.md 参照。
 */
import type { TypeAxisProfile } from "@/types/axis";

export const pokemonTypeScores: TypeAxisProfile[] = [
  // 1 — ほのお
  // 推進力・突破力、直感で即動く、熱中対象で爆発的に伸びる、飽きやすい
  {
    type_id: "fire",
    scores: { action: +2, empathy:  0, logic: -1, creativity: +1, endurance: -1, autonomy: +1, depth: -1 },
  },

  // 2 — みず
  // 空気を察す・調整役・協調性、状況対応力（受け止め役）、流されやすい
  {
    type_id: "water",
    scores: { action:  0, empathy: +2, logic:  0, creativity: -1, endurance: +1, autonomy: -1, depth:  0 },
  },

  // 3 — くさ
  // 応援型・チームワーク・明るさ・リズム感、鼓舞力・共感、自分のことは後回し
  {
    type_id: "grass",
    scores: { action: +1, empathy: +2, logic: -1, creativity: +1, endurance: +1, autonomy: -1, depth: -1 },
  },

  // 4 — でんき
  // 行動が早い・スピード、創造性・発想豊富・発信型、散漫・継続力不足
  {
    type_id: "electric",
    scores: { action: +2, empathy:  0, logic: -1, creativity: +2, endurance: -2, autonomy: +1, depth: -1 },
  },

  // 5 — こおり
  // 論理型・分析派・客観視・精密な思考、共感不足
  {
    type_id: "ice",
    scores: { action: -1, empathy: -2, logic: +2, creativity:  0, endurance: +1, autonomy: +1, depth: +2 },
  },

  // 6 — かくとう
  // 努力型・根性派・成長志向・負けず嫌い、粘り強さ・精神力、視野狭窄
  {
    type_id: "fighting",
    scores: { action: +2, empathy:  0, logic:  0, creativity: -1, endurance: +2, autonomy: +1, depth: +1 },
  },

  // 7 — どく
  // 独自路線・逆張り・戦略型、差別化・独創的アプローチ、誤解されやすい
  {
    type_id: "poison",
    scores: { action:  0, empathy: -1, logic: +1, creativity: +2, endurance:  0, autonomy: +2, depth: +1 },
  },

  // 8 — じめん
  // 現実派・計画型・管理型・堅実、実行力・信頼性、保守的・柔軟性不足
  {
    type_id: "ground",
    scores: { action: -1, empathy:  0, logic: +1, creativity: -2, endurance: +2, autonomy: -1, depth: +1 },
  },

  // 9 — ひこう
  // 自由志向・機動力・好奇心旺盛・軽快、発想力、定着しない・ルーズ
  {
    type_id: "flying",
    scores: { action: +1, empathy:  0, logic: -1, creativity: +2, endurance: -2, autonomy: +2, depth: -2 },
  },

  // 10 — エスパー
  // 直感派・洞察型・内省型、感受性・共感力・先読み、考えすぎ・繊細
  {
    type_id: "psychic",
    scores: { action: -1, empathy: +2, logic:  0, creativity: +1, endurance:  0, autonomy: +1, depth: +2 },
  },

  // 11 — むし
  // 繊細な感性・専門志向・集中型・こだわり、深掘力、視野狭窄
  {
    type_id: "bug",
    scores: { action: -1, empathy: +1, logic: +1, creativity:  0, endurance: +2, autonomy:  0, depth: +2 },
  },

  // 12 — いわ
  // 信念型・耐久型・安定志向・責任感、安定感・忍耐力、頑固・変化苦手
  {
    type_id: "rock",
    scores: { action: -1, empathy:  0, logic:  0, creativity: -2, endurance: +2, autonomy:  0, depth: +1 },
  },

  // 13 — ゴースト
  // 内向型・想像派・世界観重視、独創性・表現力、孤立・気分屋
  {
    type_id: "ghost",
    scores: { action: -1, empathy: -1, logic: -1, creativity: +2, endurance:  0, autonomy: +2, depth: +1 },
  },

  // 14 — ドラゴン
  // 高理想・挑戦型・向上心・勉強家、学習力・影響力、完璧主義・プレッシャー過多
  {
    type_id: "dragon",
    scores: { action: +1, empathy:  0, logic: +1, creativity: +1, endurance: +1, autonomy: +2, depth: +1 },
  },

  // 15 — あく
  // 洗練・カリスマ・統率力・現実志向、交渉力、冷酷視・摩擦
  {
    type_id: "dark",
    scores: { action: +1, empathy: -2, logic: +2, creativity:  0, endurance:  0, autonomy: +2, depth: +1 },
  },

  // 16 — はがね
  // 求道者・探求心・品質重視・長い旅、品質・精密、融通不足・硬直
  {
    type_id: "steel",
    scores: { action: -1, empathy: -1, logic: +2, creativity: -2, endurance: +2, autonomy:  0, depth: +2 },
  },

  // 17 — フェアリー
  // 共感型・支援型・平和志向・優しい、調和力・包容力、気疲れ・依存傾向
  {
    type_id: "fairy",
    scores: { action:  0, empathy: +2, logic: -1, creativity: +1, endurance:  0, autonomy: -2, depth:  0 },
  },

  // 18 — ノーマル
  // 社交的・コミュ力・明るさ・親しみ、場を明るくする力、八方美人・専門性不足
  {
    type_id: "normal",
    scores: { action: +1, empathy: +2, logic: -1, creativity:  0, endurance: -1, autonomy: -1, depth: -2 },
  },
];
