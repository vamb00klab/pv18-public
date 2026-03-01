/**
 * Axis (スコア軸) — IP-agnostic structural definitions.
 *
 * src/types/ はインターフェース定義のみを含む。
 * 実際の軸データは src/content/[pack]/axes.ts に存在する。
 */

/**
 * 各軸のスコア範囲。-2〜+2 の整数。
 * 0 = その軸が本質的に中立または該当しない。
 */
export type AxisWeight = -2 | -1 | 0 | 1 | 2;

/** 1本のスコア軸の定義 */
export interface Axis {
  /** 安定した内部キー。リネーム厳禁（typeScores の参照キーと一致）。 */
  id: string;
  /** 表示ラベル（IP非依存の日本語名）。 */
  label: string;
  /** この軸が測定する人格特性の説明。 */
  description: string;
  /** スコア高側の傾向ラベル（例: "推進型"）。 */
  highLabel: string;
  /** スコア低側の傾向ラベル（例: "内省型"）。 */
  lowLabel: string;
}

/** 1タイプの全軸スコア。全 axis.id を網羅すること。 */
export type TypeAxisScores = Record<string, AxisWeight>;

/** タイプIDと軸スコアのペア */
export interface TypeAxisProfile {
  /** PersonaType.type_id と一致させること。 */
  type_id: string;
  scores: TypeAxisScores;
}
