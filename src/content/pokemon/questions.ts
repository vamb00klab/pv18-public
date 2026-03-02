/**
 * Pokemon content pack — 15 question definitions.
 *
 * 「ポケモン」「Pokémon」は任天堂・クリーチャーズ・ゲームフリークの登録商標です。
 * 本サイトは非公式ファンサイト（非営利）です。
 *
 * 構成:
 *   daily カテゴリ（8問）: Q01〜Q06, Q08, Q14（日常場面ベース）
 *   world カテゴリ（7問）: Q07, Q09〜Q13, Q15（ポケモン世界観ベース）
 *
 *   questionConfig: { daily: 8, world: 7 } により全15問を毎回シャッフルして出題。
 *   将来的に設問プールを拡充したら config の数値を下げて抽選診断に切り替え可能。
 *
 * Scoring design:
 *   - Each option awards +3 to primary type, +2 to secondary, +1 to tertiary
 *   - All 18 types receive points from at least one question
 *   - Tie-break is handled in diagnose.ts (array order, first wins)
 */
import type { Question } from "@/types/quiz";

export const pokemonQuestions: Question[] = [
  // ── Q01（日常）────────────────────────────────────────────────────────────
  {
    id: "q01",
    category: "daily",
    text: "困難な状況に直面したとき、キミはどうする？",
    options: [
      {
        id: "q01a",
        text: "真っ向から立ち向かい、全力で乗り越えようとする",
        scoreMap: { fire: 3, fighting: 2, rock: 1 },
      },
      {
        id: "q01b",
        text: "じっくりと状況を分析し、最善策を見つけ出す",
        scoreMap: { ice: 3, psychic: 2, steel: 1 },
      },
      {
        id: "q01c",
        text: "仲間と力を合わせて、協力しながら解決する",
        scoreMap: { grass: 3, fairy: 2, bug: 1 },
      },
      {
        id: "q01d",
        text: "状況の流れを読みながら、柔軟に対処する",
        scoreMap: { water: 3, normal: 2, flying: 1 },
      },
    ],
  },

  // ── Q02（日常）────────────────────────────────────────────────────────────
  {
    id: "q02",
    category: "daily",
    text: "大事な決断をするとき、キミが一番重視するのは？",
    options: [
      {
        id: "q02a",
        text: "自分の感情や直感に従う",
        scoreMap: { psychic: 3, fairy: 2, fire: 1 },
      },
      {
        id: "q02b",
        text: "データや論理的な根拠を優先する",
        scoreMap: { steel: 3, ice: 2, rock: 1 },
      },
      {
        id: "q02c",
        text: "長期的なビジョンや理想像から逆算する",
        scoreMap: { dragon: 3, dark: 2, ghost: 1 },
      },
      {
        id: "q02d",
        text: "その場の流れや周囲の状況に合わせる",
        scoreMap: { water: 3, flying: 2, electric: 1 },
      },
    ],
  },

  // ── Q03（日常）────────────────────────────────────────────────────────────
  {
    id: "q03",
    category: "daily",
    text: "キミが特に大切にしている価値観は？",
    options: [
      {
        id: "q03a",
        text: "正義と公正さ。不条理には立ち向かう",
        scoreMap: { fighting: 3, steel: 2, rock: 1 },
      },
      {
        id: "q03b",
        text: "自由と解放感。制約のない生き方",
        scoreMap: { flying: 3, dragon: 2, electric: 1 },
      },
      {
        id: "q03c",
        text: "絆と温もり。人とのつながりを何より大切に",
        scoreMap: { grass: 3, fairy: 2, water: 1 },
      },
      {
        id: "q03d",
        text: "真実と知識。物事の本質を追い求める",
        scoreMap: { psychic: 3, dark: 2, ice: 1 },
      },
    ],
  },

  // ── Q04（日常）────────────────────────────────────────────────────────────
  {
    id: "q04",
    category: "daily",
    text: "理想の週末の過ごし方に近いのは？",
    options: [
      {
        id: "q04a",
        text: "アウトドアや運動など、体を動かして過ごす",
        scoreMap: { ground: 3, fire: 2, fighting: 1 },
      },
      {
        id: "q04b",
        text: "読書や思索など、静かに深く考える時間",
        scoreMap: { dark: 3, psychic: 2, ghost: 1 },
      },
      {
        id: "q04c",
        text: "友人や家族と、温かい時間を共有する",
        scoreMap: { fairy: 3, grass: 2, normal: 1 },
      },
      {
        id: "q04d",
        text: "新しいことに挑戦して、未知の世界を体験する",
        scoreMap: { electric: 3, dragon: 2, flying: 1 },
      },
    ],
  },

  // ── Q05（日常）────────────────────────────────────────────────────────────
  {
    id: "q05",
    category: "daily",
    text: "自分の一番の強みだと思うのは？",
    options: [
      {
        id: "q05a",
        text: "情熱と行動力。思い立ったらすぐ動く",
        scoreMap: { fire: 3, fighting: 2, electric: 1 },
      },
      {
        id: "q05b",
        text: "冷静さと分析力。感情に流されない判断",
        scoreMap: { ice: 3, steel: 2, rock: 1 },
      },
      {
        id: "q05c",
        text: "共感力と包容力。誰もが話しかけやすい",
        scoreMap: { water: 3, fairy: 2, grass: 1 },
      },
      {
        id: "q05d",
        text: "洞察力と独自性。常識を超えた視点",
        scoreMap: { ghost: 3, dark: 2, psychic: 1 },
      },
    ],
  },

  // ── Q06（日常）────────────────────────────────────────────────────────────
  {
    id: "q06",
    category: "daily",
    text: "失敗したとき、キミはどう感じ、どう行動する？",
    options: [
      {
        id: "q06a",
        text: "すぐに気持ちを切り替えて、次へ進む",
        scoreMap: { electric: 3, fire: 2, normal: 1 },
      },
      {
        id: "q06b",
        text: "何がいけなかったか分析し、次に活かす",
        scoreMap: { steel: 3, ice: 2, psychic: 1 },
      },
      {
        id: "q06c",
        text: "深く落ち込むが、静かに立ち直る力がある",
        scoreMap: { dark: 3, ghost: 2, rock: 1 },
      },
      {
        id: "q06d",
        text: "誰かに話を聞いてもらい、気持ちを整理する",
        scoreMap: { fairy: 3, grass: 2, water: 1 },
      },
    ],
  },

  // ── Q07（ポケモン世界観）──────────────────────────────────────────────────
  {
    id: "q07",
    category: "world",
    text: "バトルで窮地に追い込まれたとき、キミはどう動く？",
    options: [
      {
        id: "q07a",
        text: "全力の攻撃でそのまま押し切る",
        scoreMap: { fighting: 3, fire: 2, dragon: 1 },
      },
      {
        id: "q07b",
        text: "相手の弱点を冷静に見極めて突く",
        scoreMap: { ice: 3, psychic: 2, steel: 1 },
      },
      {
        id: "q07c",
        text: "仲間と連携して逆転を狙う",
        scoreMap: { bug: 3, poison: 2, fairy: 1 },
      },
      {
        id: "q07d",
        text: "流れを読んで撤退し、仕切り直す",
        scoreMap: { water: 3, flying: 2, normal: 1 },
      },
    ],
  },

  // ── Q08（日常）────────────────────────────────────────────────────────────
  {
    id: "q08",
    category: "daily",
    text: "チームや仲間とともに動くとき、キミが一番重視するのは？",
    options: [
      {
        id: "q08a",
        text: "強さと頼もしさ。いざというとき頼れる存在",
        scoreMap: { rock: 3, steel: 2, ground: 1 },
      },
      {
        id: "q08b",
        text: "明るさと会話。自然と打ち解けられる雰囲気",
        scoreMap: { normal: 3, water: 2, flying: 1 },
      },
      {
        id: "q08c",
        text: "相性の良さ。自分と波長が合う存在",
        scoreMap: { ghost: 3, fairy: 2, psychic: 1 },
      },
      {
        id: "q08d",
        text: "珍しさ。誰も見たことのない可能性を秘めた存在",
        scoreMap: { dragon: 3, electric: 2, poison: 1 },
      },
    ],
  },

  // ── Q09（ポケモン世界観）──────────────────────────────────────────────────
  {
    id: "q09",
    category: "world",
    text: "キミが惹かれるポケモンの生息地は？",
    options: [
      {
        id: "q09a",
        text: "活火山や灼熱の砂漠",
        scoreMap: { ground: 3, fire: 2, rock: 1 },
      },
      {
        id: "q09b",
        text: "深海や神秘的な湖",
        scoreMap: { water: 3, poison: 2, ghost: 1 },
      },
      {
        id: "q09c",
        text: "果てしなく広がる空や高山",
        scoreMap: { flying: 3, dragon: 2, ice: 1 },
      },
      {
        id: "q09d",
        text: "鬱蒼とした深い森や草原",
        scoreMap: { grass: 3, bug: 2, ground: 1 },
      },
    ],
  },

  // ── Q10（ポケモン世界観）──────────────────────────────────────────────────
  {
    id: "q10",
    category: "world",
    text: "トレーナーとして目指したいのはどれに近い？",
    options: [
      {
        id: "q10a",
        text: "異端児。誰もが避けるポケモンの隠れた力を見出し、常識を覆したい",
        scoreMap: { poison: 3, ghost: 2, steel: 1 },
      },
      {
        id: "q10b",
        text: "博士の助手。未知のポケモンを研究・発見したい",
        scoreMap: { bug: 3, psychic: 2, ice: 1 },
      },
      {
        id: "q10c",
        text: "コーディネーター。美しさと絆を見せたい",
        scoreMap: { fairy: 3, normal: 2, flying: 1 },
      },
      {
        id: "q10d",
        text: "守り人。ポケモンと人が共存できる世界を守りたい",
        scoreMap: { steel: 3, rock: 2, grass: 1 },
      },
    ],
  },

  // ── Q11（ポケモン世界観）──────────────────────────────────────────────────
  {
    id: "q11",
    category: "world",
    text: "ポケモンたちの中で、キミが特に共感できるのは？",
    options: [
      {
        id: "q11a",
        text: "誰とでも仲良くできる、明るいポケモン",
        scoreMap: { normal: 3, fairy: 2, water: 1 },
      },
      {
        id: "q11b",
        text: "孤独だが強い、謎めいたポケモン",
        scoreMap: { dark: 3, ghost: 2, poison: 1 },
      },
      {
        id: "q11c",
        text: "仲間のために自分を犠牲にできるポケモン",
        scoreMap: { fighting: 3, grass: 2, steel: 1 },
      },
      {
        id: "q11d",
        text: "進化を重ね、圧倒的な力を手にしたポケモン",
        scoreMap: { dragon: 3, electric: 2, fire: 1 },
      },
    ],
  },

  // ── Q12（ポケモン世界観）──────────────────────────────────────────────────
  {
    id: "q12",
    category: "world",
    text: "「ポケモンとともに歩む旅」で、キミが一番大切にしたいのは？",
    options: [
      {
        id: "q12a",
        text: "勝利と成長。強くなり続けること",
        scoreMap: { fire: 3, electric: 2, fighting: 1 },
      },
      {
        id: "q12b",
        text: "発見と探求。未知の世界を知ること",
        scoreMap: { psychic: 3, ice: 2, flying: 1 },
      },
      {
        id: "q12c",
        text: "連携と成長。仲間の力を活かして前へ進むこと",
        scoreMap: { bug: 3, normal: 2, fairy: 1 },
      },
      {
        id: "q12d",
        text: "着実な積み重ね。揺るぎない信頼と実績を積むこと",
        scoreMap: { ground: 3, rock: 2, normal: 1 },
      },
    ],
  },

  // ── Q13（ポケモン世界観）──────────────────────────────────────────────────
  {
    id: "q13",
    category: "world",
    text: "バトルでの戦い方が、一番「自分らしい」と感じるのは？",
    options: [
      {
        id: "q13a",
        text: "状態異常や毒でじわじわと相手を追い詰める",
        scoreMap: { poison: 3, dark: 2, ghost: 1 },
      },
      {
        id: "q13b",
        text: "素早い動きと電撃で、先手を制して圧倒する",
        scoreMap: { electric: 3, flying: 2, water: 1 },
      },
      {
        id: "q13c",
        text: "鉄壁の防御で耐え、相手の攻撃を全て受け止める",
        scoreMap: { rock: 3, ground: 2, steel: 1 },
      },
      {
        id: "q13d",
        text: "影から奇襲を仕掛け、心理的に揺さぶる",
        scoreMap: { ghost: 3, dark: 2, poison: 1 },
      },
    ],
  },

  // ── Q14（日常）────────────────────────────────────────────────────────────
  {
    id: "q14",
    category: "daily",
    text: "自分の魅力を一言で表すなら、どれに近い？",
    options: [
      {
        id: "q14a",
        text: "一筋縄ではいかない、謎めいた存在感",
        scoreMap: { poison: 3, ghost: 2, dark: 1 },
      },
      {
        id: "q14b",
        text: "どっしりとした安定感と、揺るがない信頼感",
        scoreMap: { ground: 3, rock: 2, fighting: 1 },
      },
      {
        id: "q14c",
        text: "自由奔放さと、どこへでも飛んでいける行動力",
        scoreMap: { flying: 3, electric: 2, dragon: 1 },
      },
      {
        id: "q14d",
        text: "地道な努力と、気づけば成長している粘り強さ",
        scoreMap: { bug: 3, ground: 2, normal: 1 },
      },
    ],
  },

  // ── Q15（ポケモン世界観）──────────────────────────────────────────────────
  {
    id: "q15",
    category: "world",
    text: "キミが最も憧れるポケモンの在り方は？",
    options: [
      {
        id: "q15a",
        text: "嫌われても恐れられても、独自の道を歩む姿",
        scoreMap: { poison: 3, bug: 2, dragon: 1 },
      },
      {
        id: "q15b",
        text: "長い年月をかけて磨かれた、圧倒的な硬さと重厚感",
        scoreMap: { rock: 3, ground: 2, fighting: 1 },
      },
      {
        id: "q15c",
        text: "深い知性と神秘、見えないものを見通す力",
        scoreMap: { psychic: 3, ice: 2, dark: 1 },
      },
      {
        id: "q15d",
        text: "どんな攻撃にも揺らがない、完璧な防御と誠実さ",
        scoreMap: { steel: 3, fighting: 2, poison: 1 },
      },
    ],
  },
];
