"use client";

import { useState } from "react";
import type { Axis, TypeAxisScores } from "@/types/axis";

interface Props {
  axes: Axis[];
  scores: TypeAxisScores;
  /** Primary hex color of the type (e.g. "#FF4422") */
  color: string;
}

/**
 * RadarChart — 7軸のスコアプロファイルを SVG レーダーチャートで表示する。
 *
 * スコア範囲: -2〜+2
 * - 中心 (r=0): スコア -2（最も低い）
 * - 点線リング (r=40, 50%): スコア 0（中立）
 * - 外周 (r=80, 100%): スコア +2（最も高い）
 *
 * インタラクション:
 * - 軸ラベルをタップ → チャート中央に軸の説明オーバーレイを表示
 * - 同じラベルを再タップ、またはオーバーレイ/SVG外周をタップ → 閉じる
 *
 * 依存: React / SVG のみ（外部ライブラリ不要）
 */
export function RadarChart({ axes, scores, color }: Props) {
  const [selectedAxis, setSelectedAxis] = useState<Axis | null>(null);

  const n = axes.length;

  // ── レイアウト定数 ──────────────────────────────────────────────────
  const CX = 170;      // 中心 X
  const CY = 140;      // 中心 Y
  const MAX_R = 80;    // スコア +2 時の半径
  const LABEL_R = 112; // 軸ラベルの配置半径（スマホ可読性のため拡大）

  // オーバーレイのサイズ（中央固定）
  const OV_W = 160;
  const OV_H = 106;
  const OV_X = CX - OV_W / 2;
  const OV_Y = CY - OV_H / 2;

  // ── 座標ヘルパー ────────────────────────────────────────────────────
  const axisAngle = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;

  const point = (i: number, r: number) => ({
    x: CX + r * Math.cos(axisAngle(i)),
    y: CY + r * Math.sin(axisAngle(i)),
  });

  const scoreToR = (s: number) => ((s + 2) / 4) * MAX_R;

  const toPoints = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  // ── グリッド ──────────────────────────────────────────────────────────
  const gridLevels = [-1, 0, 1, 2] as const;

  // ── データポリゴン ──────────────────────────────────────────────────
  const dataPoints = axes.map((axis, i) =>
    point(i, scoreToR(scores[axis.id] ?? 0))
  );

  // ── グリッド・軸線色（ニュートラル固定） ───────────────────────────
  const GRID_COLOR       = "rgba(148,163,184,0.30)";
  const GRID_COLOR_NEUT  = "rgba(148,163,184,0.55)"; // 中立リング（score=0）をやや強調

  // ── ラベルクリックハンドラ ───────────────────────────────────────────
  const handleLabelClick = (e: React.MouseEvent, axis: Axis) => {
    e.stopPropagation();
    setSelectedAxis((prev) => (prev?.id === axis.id ? null : axis));
  };

  return (
    <svg
      viewBox="0 0 340 280"
      className="w-full max-w-sm mx-auto"
      aria-hidden="true"
      onClick={() => setSelectedAxis(null)}
    >
      {/* ── グリッドリング ── */}
      {gridLevels.map((score) => {
        const r = scoreToR(score);
        const pts = axes.map((_, i) => point(i, r));
        const isNeutral = score === 0;
        return (
          <polygon
            key={score}
            points={toPoints(pts)}
            fill="none"
            stroke={isNeutral ? GRID_COLOR_NEUT : GRID_COLOR}
            strokeWidth={isNeutral ? 1.5 : 0.75}
            strokeDasharray={isNeutral ? "4 2" : undefined}
          />
        );
      })}

      {/* ── 軸線 ── */}
      {axes.map((axis, i) => {
        const outer = point(i, MAX_R);
        return (
          <line
            key={i}
            x1={CX} y1={CY}
            x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)}
            stroke={GRID_COLOR}
            strokeWidth="0.75"
          />
        );
      })}

      {/* ── データポリゴン ── */}
      <polygon
        points={toPoints(dataPoints)}
        fill={color + "26"}
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* ── データ頂点マーカー ── */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x.toFixed(1)}
          cy={p.y.toFixed(1)}
          r="3.5"
          fill={color}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.5"
        />
      ))}

      {/* ── 軸ラベルチップ ── */}
      {axes.map((axis, i) => {
        const p = point(i, LABEL_R);
        const s = scores[axis.id] ?? 0;
        const isSelected = selectedAxis?.id === axis.id;
        const isHigh = s >= 1;

        const CHIP_H = 20;
        const CHIP_W = axis.label.length * 12 + 18;
        const chipX = (p.x - CHIP_W / 2).toFixed(1);
        const chipY = (p.y - CHIP_H / 2).toFixed(1);

        const chipFill   = isHigh ? color + "30" : "rgba(148,163,184,0.15)";
        const chipStroke = isSelected ? color : "none";
        const textFill   = isSelected ? color : isHigh ? color : "rgba(255,255,255,0.70)";

        return (
          <g
            key={axis.id}
            onClick={(e) => handleLabelClick(e, axis)}
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            <rect
              x={chipX}
              y={chipY}
              width={CHIP_W}
              height={CHIP_H}
              rx="9"
              fill={chipFill}
              stroke={chipStroke}
              strokeWidth="1.5"
            />
            <text
              x={p.x.toFixed(1)}
              y={p.y.toFixed(1)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill={textFill}
              fontWeight={isHigh || isSelected ? "bold" : "normal"}
              fontFamily="sans-serif"
            >
              {axis.label}
            </text>
          </g>
        );
      })}

      {/* ── 説明オーバーレイ ── */}
      {selectedAxis && (
        <foreignObject
          x={OV_X}
          y={OV_Y}
          width={OV_W}
          height={OV_H}
          onClick={(e) => { e.stopPropagation(); setSelectedAxis(null); }}
          style={{ cursor: "pointer" }}
        >
          <div
            style={{
              background: "rgba(17,17,17,0.97)",
              border: `1.5px solid ${color}`,
              borderRadius: "10px",
              padding: "8px 10px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "5px",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: "bold",
                color,
                fontFamily: "sans-serif",
                textAlign: "center",
              }}
            >
              {selectedAxis.label}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#c0c8d4",
                fontFamily: "sans-serif",
                lineHeight: "1.5",
                textAlign: "center",
              }}
            >
              {selectedAxis.description}
            </p>
          </div>
        </foreignObject>
      )}
    </svg>
  );
}
