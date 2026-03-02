"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import type { Question, Answer } from "@/types/quiz";
import { answerSession } from "@/lib/answerSession";
import { encodeAnswers } from "@/lib/answerUrl";

interface Props {
  questions: Question[];
}

/**
 * 進捗 t（0=開始, 1=最終問）に応じて volt-yellow → volt-cyan を補間した hex カラーを返す。
 * volt-yellow: #fee023 / volt-cyan: #43d9bf
 * 用途: ダーク背景（プログレスバー glow など）
 */
function quizAccent(t: number): string {
  const r = Math.round(0xfe + t * (0x43 - 0xfe));
  const g = Math.round(0xe0 + t * (0xd9 - 0xe0));
  const b = Math.round(0x23 + t * (0xbf - 0x23));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * 進捗 t に応じて amber-700 → teal-700 を補間した hex カラーを返す。
 * amber-700: #b45309 / teal-700: #0f766e
 * 用途: 白背景カード内（視認性確保。両端とも白背景で WCAG AA 基準クリア）
 */
function quizAccentDark(t: number): string {
  const r = Math.round(0xb4 + t * (0x0f - 0xb4));
  const g = Math.round(0x53 + t * (0x76 - 0x53));
  const b = Math.round(0x09 + t * (0x6e - 0x09));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * QuizFlow — manages the multi-step question flow.
 *
 * State: React local state (answers array + current index).
 * On finish: persists to answerSession, serializes to URL, navigates to /result.
 *
 * Accessibility:
 * - Options rendered as role="radio" inside role="radiogroup" (ARIA radiogroup pattern)
 * - Arrow keys navigate between options; Space/Enter selects
 * - Progress bar uses role="progressbar" with aria-valuenow/min/max
 */
export function QuizFlow({ questions }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [backFlash, setBackFlash] = useState(false);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // アンマウント時にペンディングタイマーをキャンセル
  useEffect(() => {
    return () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      if (backFlashTimerRef.current) clearTimeout(backFlashTimerRef.current);
    };
  }, []);

  // 問題リストはサーバー側（quiz/page.tsx）で選出済み。クライアントではそのまま使う。
  const activeQuestions = questions;

  const question = activeQuestions[currentIndex];
  const isLast = currentIndex === activeQuestions.length - 1;
  const progressPct = (currentIndex / activeQuestions.length) * 100;
  const questionHeadingId = `question-heading-${currentIndex}`;

  const t = activeQuestions.length > 1 ? currentIndex / (activeQuestions.length - 1) : 0;
  const accent = quizAccent(t);
  const accentDark = quizAccentDark(t);

  function handleBack() {
    if (currentIndex === 0) return;
    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    if (backFlashTimerRef.current) clearTimeout(backFlashTimerRef.current);
    setBackFlash(true);
    backFlashTimerRef.current = setTimeout(() => {
      setAnswers((prev) => prev.slice(0, -1));
      setCurrentIndex((i) => i - 1);
      setSelected(null);
      setBackFlash(false);
    }, 150);
  }

  const handleSelect = useCallback((optionId: string) => {
    setSelected(optionId);
  }, []);

  const handleOptionClick = useCallback((optionId: string) => {
    if (!question) return;

    // 選択状態を即時反映（視覚フィードバック）
    setSelected(optionId);

    const newAnswers: Answer[] = [
      ...answers,
      { questionId: question.id, optionId },
    ];

    // 二重タップ防止: 既存タイマーをキャンセルしてから再設定
    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    pendingTimerRef.current = setTimeout(() => {
      setAnswers(newAnswers);
      if (isLast) {
        answerSession.save(newAnswers);
        router.push(`/result?a=${encodeAnswers(newAnswers)}`);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
      }
    }, 300);
  }, [question, answers, isLast, router]);

  const handleOptionKeyDown = useCallback(
    (e: React.KeyboardEvent, currentOptionIndex: number) => {
      const options = question?.options ?? [];
      let nextIndex: number | null = null;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        nextIndex = (currentOptionIndex + 1) % options.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        nextIndex = (currentOptionIndex - 1 + options.length) % options.length;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        const nextOption = options[nextIndex];
        if (nextOption) {
          handleSelect(nextOption.id);
          optionRefs.current[nextIndex]?.focus();
        }
      }
    },
    [question, handleSelect]
  );

  if (!question) return null;

  return (
    <div
      className="relative min-h-screen flex flex-col px-3 sm:px-4 overflow-hidden"
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
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="quiz-glow-cyan" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="quiz-glow-yellow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* 浮遊ドット */}
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

        {/* ホタル */}
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
            filter={f.color === "#43d9bf" ? "url(#quiz-glow-cyan)" : "url(#quiz-glow-yellow)"}
            style={{
              animation: `firefly-pulse ${f.dur}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </svg>

      {/* コンテンツ */}
      {/* Logo header */}
      <div className="relative z-10 pt-4 pb-2 sm:pt-5 sm:pb-3">
        <PageHeader subLabel="- Type Diagnosis -" />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-3 sm:pt-4 pb-8 sm:pb-12">

        {/* Progress bar */}
        <div className="w-full max-w-2xl mb-5 sm:mb-8">
          <div className="flex justify-between text-sm text-volt-muted mb-2">
            <span>質問 {currentIndex + 1} / {activeQuestions.length}</span>
            <span aria-hidden="true">{Math.round(progressPct)}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={activeQuestions.length}
            aria-label={`質問 ${currentIndex + 1} / ${activeQuestions.length}`}
            className="w-full rounded-full h-2"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <div
              className="h-2 rounded-full transition-all duration-500 volt-spark-bar"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(to right, #fee023, #43d9bf)",
                boxShadow: `0 0 6px ${accent}66, 0 0 14px ${accent}33`,
              }}
            />
          </div>
        </div>

        {/* Question card — glassmorphism */}
        <div
          className="w-full max-w-2xl p-5 sm:p-8"
          style={{
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {/* アクセントバー */}
          <div
            className="-mx-5 -mt-5 mb-5 sm:-mx-8 sm:-mt-8 sm:mb-8"
            style={{
              height: "4px",
              background: "linear-gradient(to right, #fee023, #43d9bf)",
            }}
          />
          <h2
            id={questionHeadingId}
            className="text-lg sm:text-xl font-bold mb-5 sm:mb-8 leading-relaxed"
            style={{ color: "#0F172A" }}
          >
            {question.text}
          </h2>

          <div
            role="radiogroup"
            aria-labelledby={questionHeadingId}
            className="space-y-2 sm:space-y-3"
          >
            {question.options.map((option, i) => {
              const isChecked = selected === option.id;
              return (
                <button
                  key={option.id}
                  ref={(el) => { optionRefs.current[i] = el; }}
                  type="button"
                  role="radio"
                  aria-checked={isChecked}
                  onClick={() => handleOptionClick(option.id)}
                  onKeyDown={(e) => handleOptionKeyDown(e, i)}
                  tabIndex={isChecked || (selected === null && i === 0) ? 0 : -1}
                  className="w-full text-left btn-option sm:px-5 sm:py-4 sm:text-base transition-all duration-150 leading-snug"
                  style={{
                    borderStyle: "solid",
                    borderLeftWidth: "4px",
                    borderTopWidth: "1px",
                    borderRightWidth: "1px",
                    borderBottomWidth: "1px",
                    borderLeftColor: isChecked ? accent : "rgba(57,197,187,0.50)",
                    borderTopColor: isChecked ? "rgba(15,23,42,0.10)" : "rgba(57,197,187,0.30)",
                    borderRightColor: isChecked ? "rgba(15,23,42,0.10)" : "rgba(57,197,187,0.30)",
                    borderBottomColor: isChecked ? "rgba(15,23,42,0.10)" : "rgba(57,197,187,0.30)",
                    backgroundColor: isChecked ? accent + "28" : "rgba(15,23,42,0.04)",
                    color: "#0F172A",
                  }}
                >
                  {option.text}
                </button>
              );
            })}
          </div>

          {/* 戻るボタン + 自動進行ヒント */}
          <div className="mt-5 flex items-center justify-between">
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="text-sm hover:opacity-70"
                style={{
                  color: backFlash ? "#38bdf8" : "#8891a4",
                  border: `1px solid ${backFlash ? "rgba(56,189,248,0.70)" : "rgba(136,145,164,0.35)"}`,
                  background: backFlash ? "rgba(56,189,248,0.18)" : "transparent",
                  padding: "5px 14px",
                  borderRadius: "999px",
                  transition: "all 100ms",
                }}
              >
                ← 戻る
              </button>
            ) : (
              <span />
            )}
            <p
              className="text-sm"
              style={{
                color: isLast ? accentDark : "#8891a4",
                fontWeight: isLast ? 600 : 400,
              }}
            >
              {isLast ? "選択で結果を表示 →" : "いずれか選択で次へ →"}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
