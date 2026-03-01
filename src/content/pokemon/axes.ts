/**
 * Pokemon content pack — 7 personality axes.
 *
 * ⚠️  PERSONAL USE ONLY — DO NOT PUBLISH
 *
 * 7本の軸で18タイプの性格傾向を表現する。
 * 各軸は IP 非依存の概念で定義し、neutral パックへの移植を意識している。
 *
 * 設計根拠: design_notes/AXIS_DESIGN.md 参照。
 */
import type { Axis } from "@/types/axis";

export const pokemonAxes: Axis[] = [
  // 1 — 行動性
  {
    id: "action",
    label: "行動性",
    description: "主体的に動く・推し進める度合い。高いほど即行動、低いほど観察・内省を好む。",
    highLabel: "推進型",
    lowLabel: "内省型",
  },
  // 2 — 共感性
  {
    id: "empathy",
    label: "共感性",
    description: "他者への感受・協調・支援の度合い。高いほど人との感情的つながりを重視する。",
    highLabel: "共感型",
    lowLabel: "客観型",
  },
  // 3 — 論理性
  {
    id: "logic",
    label: "論理性",
    description: "分析・体系化・計画的思考の度合い。高いほど合理・精密を好み、低いほど直感・感性を優先する。",
    highLabel: "分析型",
    lowLabel: "直感型",
  },
  // 4 — 創造性
  {
    id: "creativity",
    label: "創造性",
    description: "新奇・独創的なアプローチの度合い。高いほど変化と発想を好み、低いほど実績ある手法を好む。",
    highLabel: "革新型",
    lowLabel: "安定型",
  },
  // 5 — 継続性
  {
    id: "endurance",
    label: "継続性",
    description: "長期的な粘り強さ・忍耐の度合い。高いほど一つのことを深く続け、低いほど素早く切り替える。",
    highLabel: "持久型",
    lowLabel: "機動型",
  },
  // 6 — 自律性
  {
    id: "autonomy",
    label: "自律性",
    description: "独自判断・独立した行動の度合い。高いほど自分の信念で動き、低いほど協調・合意を重視する。",
    highLabel: "独立型",
    lowLabel: "協調型",
  },
  // 7 — 専門性
  {
    id: "depth",
    label: "専門性",
    description: "特定領域への集中・深掘りの度合い。高いほど専門特化、低いほど幅広い汎用性を持つ。",
    highLabel: "専門型",
    lowLabel: "汎用型",
  },
];
