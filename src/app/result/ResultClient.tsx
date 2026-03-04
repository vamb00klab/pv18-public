"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { decodeAnswers, getDecodeErrorMessage } from "@/lib/answerUrl";
import type { AnswerDecodeError } from "@/lib/answerUrl";
import { diagnose } from "@/lib/diagnose";
import type { Question } from "@/types/quiz";
import type { PersonaType } from "@/types/persona";
import type { Axis, TypeAxisProfile } from "@/types/axis";
import { ResultCard } from "@/components/ResultCard";
import { ShareButton } from "@/components/ShareButton";
import { appConfig } from "@/lib/config";

interface Props {
  questions: Question[];
  types: PersonaType[];
  axes?: Axis[];
  typeScores?: TypeAxisProfile[];
}

/**
 * ResultClient — reads encoded answers from URL (?a=...), runs diagnosis,
 * and renders the result page.
 *
 * Content pack data is resolved server-side (result/page.tsx) and passed
 * as props. Switching NEXT_PUBLIC_CONTENT_PACK env is sufficient to change
 * all content without modifying this file.
 */
export function ResultClient({ questions, types, axes, typeScores }: Props) {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("a");

  const result = useMemo(() => {
    const decoded = decodeAnswers(encoded);
    if (!decoded.ok) return { ok: false as const, error: decoded.error };
    try {
      return { ok: true as const, diagnosis: diagnose(decoded.answers, questions, types) };
    } catch {
      return { ok: false as const, error: "malformed" as AnswerDecodeError };
    }
  }, [encoded, questions, types]);

  // ── Error state ───────────────────────────────────────────────────────────
  if (!result.ok) {
    const isMissing = result.error === "missing";
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
      >
        {/* 背景レイヤー 1: グリッドライン */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              "linear-gradient(rgba(67,217,191,0.07) 1px, transparent 1px)",
              "linear-gradient(90deg, rgba(67,217,191,0.07) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "48px 48px",
          }}
        />
        {/* 背景レイヤー 2: ホタル */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="result-err-glow-cyan" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="result-err-glow-yellow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {([
            { x: 7,  y: 20, r: 3,   color: "#43d9bf", dur: 7,  delay: 0    },
            { x: 92, y: 15, r: 3.5, color: "#fee023", dur: 6,  delay: -2.0 },
            { x: 4,  y: 55, r: 2.5, color: "#43d9bf", dur: 8,  delay: -4.3 },
            { x: 95, y: 60, r: 3,   color: "#fee023", dur: 7,  delay: -1.1 },
          ] as const).map((f, i) => (
            <circle
              key={`ff-${i}`}
              className="svg-particle"
              cx={`${f.x}%`}
              cy={`${f.y}%`}
              r={f.r}
              fill={f.color}
              filter={f.color === "#43d9bf" ? "url(#result-err-glow-cyan)" : "url(#result-err-glow-yellow)"}
              style={{
                animation: `firefly-pulse ${f.dur}s ease-in-out infinite`,
                animationDelay: `${f.delay}s`,
              }}
            />
          ))}
        </svg>
        <div className="relative z-10 max-w-sm space-y-5">
          <div className="text-5xl">{isMissing ? "📋" : "⚠️"}</div>
          <h2 className="text-2xl font-bold text-white">
            {isMissing ? "診断がまだ完了していません" : "結果を読み込めませんでした"}
          </h2>
          <p className="text-volt-muted text-sm leading-relaxed">
            {isMissing
              ? "以下のボタンから診断を始めてください。"
              : getDecodeErrorMessage(result.error)}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/quiz"
              className="inline-block btn-primary text-black transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #fee023 0%, #43d9bf 100%)" }}
            >
              診断を始める
            </Link>
            {!isMissing && (
              <Link
                href="/"
                className="inline-block btn-primary bg-volt-surface text-white/80 border border-volt-edge hover:bg-volt-edge transition-colors"
              >
                トップへ戻る
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
  const { diagnosis } = result;
  const resultUrl = `${appConfig.baseUrl}/result?a=${encoded}`;

  // Axis profile for the result type (if the pack provides axis data)
  const axisProfile = typeScores?.find(
    (p) => p.type_id === diagnosis.result.type_id
  )?.scores;

  return (
    <div
      className="relative min-h-screen py-12 px-4 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
    >
      {/* 背景レイヤー 1: グリッドライン */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(67,217,191,0.07) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(67,217,191,0.07) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "48px 48px",
        }}
      />
      {/* 背景レイヤー 2: 浮遊ドット + ホタル */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="result-glow-cyan" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="result-glow-yellow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {([
          { x: 5,  y: 10, r: 1.5, color: "#43d9bf", dur: 13, delay: 0    },
          { x: 93, y: 7,  r: 1,   color: "#fee023", dur: 12, delay: -2.8 },
          { x: 8,  y: 42, r: 1,   color: "#43d9bf", dur: 11, delay: -5.5 },
          { x: 95, y: 35, r: 1.5, color: "#fee023", dur: 14, delay: -1.2 },
          { x: 4,  y: 68, r: 1,   color: "#43d9bf", dur: 15, delay: -8.0 },
          { x: 92, y: 75, r: 1.5, color: "#fee023", dur: 10, delay: -3.9 },
          { x: 20, y: 5,  r: 1,   color: "#fee023", dur: 12, delay: -6.3 },
          { x: 78, y: 95, r: 1,   color: "#43d9bf", dur: 13, delay: -4.4 },
        ] as const).map((d, i) => (
          <circle
            key={`dot-${i}`}
            className="svg-particle"
            cx={`${d.x}%`}
            cy={`${d.y}%`}
            r={d.r}
            fill={d.color}
            opacity={0.55}
            style={{
              animation: `${(["dot-float-a","dot-float-b","dot-float-c"] as const)[i % 3]} ${d.dur}s ease-in-out infinite`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}
        {([
          { x: 7,  y: 20, r: 3,   color: "#43d9bf", dur: 7,  delay: 0    },
          { x: 92, y: 15, r: 3.5, color: "#fee023", dur: 6,  delay: -2.0 },
          { x: 4,  y: 55, r: 2.5, color: "#43d9bf", dur: 8,  delay: -4.3 },
          { x: 95, y: 60, r: 3,   color: "#fee023", dur: 7,  delay: -1.1 },
        ] as const).map((f, i) => (
          <circle
            key={`ff-${i}`}
            className="svg-particle"
            cx={`${f.x}%`}
            cy={`${f.y}%`}
            r={f.r}
            fill={f.color}
            filter={f.color === "#43d9bf" ? "url(#result-glow-cyan)" : "url(#result-glow-yellow)"}
            style={{
              animation: `firefly-pulse ${f.dur}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-2xl mx-auto space-y-8 page-enter">

        {/* Header */}
        <PageHeader subLabel="- Diagnosis Result -" />
        <h1 className="text-2xl font-extrabold text-white text-center">
          一番近いタイプは
        </h1>

        {/* Result card + score breakdown */}
        <ResultCard
          result={diagnosis.result}
          scores={diagnosis.scores}
          allTypes={types}
          axes={axes}
          axisProfile={axisProfile}
        />

        {/* Official page link */}
        {diagnosis.result.officialUrl && (
          <div className="text-center">
            <a
              href={diagnosis.result.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-volt-muted hover:text-white transition-colors"
            >
              公式「ポケミク」イラストページで見る
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        )}

        {/* Share section */}
        <div className="bg-volt-surface rounded-2xl p-6 border border-volt-edge text-center space-y-4">
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">
            結果をシェアする
          </h3>
          <ShareButton
            typeLabel={diagnosis.result.label}
            resultUrl={resultUrl}
          />
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/quiz"
            className="btn-primary text-black text-center transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #fee023 0%, #43d9bf 100%)" }}
          >
            もう一度診断する
          </Link>
          <Link
            href="/"
            className="btn-primary bg-volt-surface text-white/80 border border-volt-edge hover:bg-volt-edge text-center transition-colors"
          >
            トップへ戻る
          </Link>
        </div>

        {/* Cross-feature: recommend */}
        <Link
          href="/recommend"
          className="block text-center btn-primary border border-volt-edge text-volt-muted hover:border-white/30 transition-colors"
        >
          気分で楽曲を探してみる →
        </Link>

      </div>
    </div>
  );
}
