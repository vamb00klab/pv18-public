"use client";

import { useState, useEffect, useCallback, useMemo, useRef, Fragment, memo } from "react";
import { Oswald } from "next/font/google";

const countdownFont = Oswald({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});
import PageHeader from "@/components/PageHeader";
import { ParticleBackground } from "@/components/ParticleBackground";
import { SONGS } from "@/data/songs";
import { appConfig } from "@/lib/config";
import { buildSetlistShareText } from "@/lib/shareConfig";
import {
  EVENT_CONFIG,
  type EventPhase,
  getEventPhase,
  calculateCountdown,
  GUIDELINE_POINTS,
  CHECKLIST_ITEMS,
  CHECKLIST_STORAGE_KEY,
  type SetlistPrediction,
  EMPTY_PREDICTION,
  SETLIST_STORAGE_KEY,
  FREE_COMMENT_MAX,
  buildSongOptions,
  OFFICIAL_LINKS,
  VENUE_MAP_EMBED_URL,
  VENUE_MAP_URL,
  ACCESS_POINTS,
  NEARBY_SPOTS,
  PARKING_INFO,
} from "./liveData";

/* ── Helpers ────────────────────────────────────────────────────────── */

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/* ── Hooks ─────────────────────────────────────────────────────────── */

function useNow() {
  const [nowMs, setNowMs] = useState(0);
  useEffect(() => {
    // setTimeout(0) for immediate first tick without triggering set-state-in-effect lint
    const boot = setTimeout(() => setNowMs(Date.now()), 0);
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => { clearTimeout(boot); clearInterval(id); };
  }, []);
  return nowMs;
}

function useChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // Hydrate from localStorage after mount (avoids SSR/client mismatch)
  useEffect(() => {
    const boot = setTimeout(() => setChecked(readJson(CHECKLIST_STORAGE_KEY, {})), 0);
    return () => clearTimeout(boot);
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setChecked({});
    localStorage.removeItem(CHECKLIST_STORAGE_KEY);
  }, []);

  return { checked, toggle, reset };
}

function usePrediction() {
  const [pred, setPred] = useState<SetlistPrediction>(EMPTY_PREDICTION);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch)
  useEffect(() => {
    const boot = setTimeout(() => setPred(readJson(SETLIST_STORAGE_KEY, EMPTY_PREDICTION)), 0);
    return () => clearTimeout(boot);
  }, []);

  const update = useCallback(
    (field: keyof SetlistPrediction, value: string | null) => {
      setPred((prev) => {
        const next = { ...prev, [field]: value };
        localStorage.setItem(SETLIST_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  return { pred, update };
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function LiveClient() {
  const nowMs = useNow();
  const ready = nowMs > 0;
  const phase = ready ? getEventPhase(nowMs) : "before";
  const countdown = ready
    ? calculateCountdown(EVENT_CONFIG.firstShowStart.getTime(), nowMs)
    : { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  const { checked, toggle, reset } = useChecklist();
  const { pred, update } = usePrediction();
  const songOptions = useMemo(() => buildSongOptions(SONGS), []);

  const essentialItems = CHECKLIST_ITEMS.filter((i) => i.group === "essential");
  const recommendedItems = CHECKLIST_ITEMS.filter(
    (i) => i.group === "recommended",
  );
  const checkedCount = CHECKLIST_ITEMS.filter((i) => checked[i.id]).length;
  const allChecked = checkedCount === CHECKLIST_ITEMS.length;

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)",
      }}
    >
      <ParticleBackground
        prefix="live"
        fireflies={[
          { x: 7,  y: 15, r: 3,   color: "#43d9bf", dur: 7, delay: 0 },
          { x: 93, y: 10, r: 3.5, color: "#fee023", dur: 6, delay: -2.0 },
          { x: 5,  y: 50, r: 2.5, color: "#43d9bf", dur: 8, delay: -4.3 },
          { x: 94, y: 55, r: 3,   color: "#fee023", dur: 7, delay: -1.1 },
        ]}
      />

      {/* メインコンテンツ */}
      <main className="relative z-10 flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-10 page-enter">
        <PageHeader subLabel="LIVE Special" />

        {/* 非公式表記 */}
        <p className="-mt-4 text-xs text-volt-muted text-center leading-relaxed">
          ※ 本サイトは非公式ファンサイトです。<br />
          最新情報は<a
            href={EVENT_CONFIG.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-volt-cyan hover:underline"
          >公式サイト ↗</a>でご確認ください。
        </p>

        {/* ────────── A: カウントダウン ────────── */}
        <CountdownSection phase={phase} countdown={countdown} ready={ready} />

        {/* ────────── I: セトリ予想 ────────── */}
        <SetlistSection
          pred={pred}
          update={update}
          songOptions={songOptions}
        />

        {/* ────────── G: 会場ガイドライン ────────── */}
        <GuidelineSection />

        {/* ────────── B: 持ち物チェックリスト ────────── */}
        <ChecklistSection
          essentialItems={essentialItems}
          recommendedItems={recommendedItems}
          checked={checked}
          toggle={toggle}
          reset={reset}
          checkedCount={checkedCount}
          totalCount={CHECKLIST_ITEMS.length}
          allChecked={allChecked}
        />

        {/* ────────── V: 会場・周辺ガイド ────────── */}
        <VenueSection />

        {/* ────────── J: 公式リンク ────────── */}
        <OfficialLinksSection />

      </main>

      {/* フローティングジャンプメニュー（フィードバックボタンの上） */}
      <FloatingJumpMenu />
    </div>
  );
}

/* ── Floating Jump Menu ────────────────────────────────────────────── */

const JUMP_ITEMS = [
  { id: "countdown", label: "カウントダウン" },
  { id: "setlist", label: "セトリ予想" },
  { id: "guideline", label: "ガイドライン" },
  { id: "checklist", label: "持ち物" },
  { id: "venue", label: "会場・周辺" },
  { id: "links", label: "公式リンク" },
] as const;

function FloatingJumpMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* バックドロップ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* メニューパネル */}
      {isOpen && (
        <div className="fixed bottom-[4.5rem] right-5 z-40 w-48 rounded-xl border border-volt-edge bg-volt-surface shadow-lg overflow-hidden">
          <nav className="py-1.5" aria-label="ページ内ナビゲーション">
            {JUMP_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                {item.label}
                <span className="text-volt-muted text-[10px]">→</span>
              </button>
            ))}
            <div className="h-px bg-volt-edge mx-3 my-0.5" />
            <button
              type="button"
              onClick={scrollToTop}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-volt-muted hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              ページ先頭へ
              <span className="text-[10px]">↑</span>
            </button>
          </nav>
        </div>
      )}

      {/* トグルボタン（フィードバックボタンの上） */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-[4.5rem] right-5 z-40 flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: isOpen ? "#fee023" : "#1a1a1a",
          border: isOpen ? "1.5px solid #fee023" : "1.5px solid rgba(67,217,191,0.45)",
          boxShadow: isOpen ? undefined : "0 0 10px rgba(67,217,191,0.2)",
        }}
        aria-label="セクション移動メニュー"
        aria-expanded={isOpen}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isOpen ? "#0e0c00" : "#8891a4"}
          strokeWidth="2"
          strokeLinecap="round"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}

/* ── Section: Countdown ────────────────────────────────────────────── */

function CountdownSection({
  phase,
  countdown,
  ready,
}: {
  phase: EventPhase;
  countdown: ReturnType<typeof calculateCountdown>;
  ready: boolean;
}) {
  // Glow intensity: softer base, stronger as event approaches
  const glowOpacity = countdown.days <= 1 ? 0.7 : countdown.days <= 3 ? 0.6 : 0.5;

  // JS-driven glow rotation synced to same Date.now() as flip timer.
  // CSS custom property --cg-angle drives ::before transform.
  const glowRef = useRef<HTMLDivElement>(null);
  const [glowReady, setGlowReady] = useState(false);
  useEffect(() => {
    const boot = setTimeout(() => setGlowReady(true), 0);
    let raf: number;
    const PERIOD = 2000; // ms per full rotation (2 flips per rotation)
    const OFFSET_DEG = 60; // sync bright spot with flip timing
    const tick = () => {
      const el = glowRef.current;
      if (el) {
        const angle = ((Date.now() % PERIOD) / PERIOD) * 360 + OFFSET_DEG;
        el.style.setProperty("--cg-angle", `${angle}deg`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { clearTimeout(boot); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="countdown" className="space-y-4 scroll-mt-16">
      {/* セクション背景: 音波ビジュアル */}
      <div
        className="relative -mx-4 px-4 py-5 rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url(/banners/live-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 暗幕オーバーレイ（コンテンツ可読性確保） */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)" }}
        />
        <div className="relative z-10 space-y-4">
      <SectionHeading>{EVENT_CONFIG.name}</SectionHeading>

      {/* イベント基本情報（カウントダウンとは分離） */}
      <div className="text-center space-y-1">
        <p className="text-xs text-white/70">
          3/20<span className="text-volt-muted">（金祝）</span>{" · "}
          3/21<span className="text-volt-muted">（土）</span>{" · "}
          3/22<span className="text-volt-muted">（日）</span>
        </p>
        <p className="text-xs text-volt-muted">{EVENT_CONFIG.venue}</p>
      </div>

      <div
        ref={glowRef}
        className="countdown-glow-wrap"
      >
        {/* Rotating glow layers — driven by JS rAF via CSS custom properties */}
        {phase !== "after" && glowReady && (
          <>
            <div className="cg-outer" style={{ opacity: glowOpacity }} />
          </>
        )}

        {/* Outer frame — transparent so glow shows in the gap */}
        <div className="relative z-[1] rounded-2xl border border-volt-edge/50 p-1.5 sm:p-2">
          {/* Inner frame — solid background, blocks glow */}
          <div className="rounded-xl border border-volt-edge bg-volt-surface p-4 sm:p-5 space-y-3 text-center">
            {/* フェーズ別表示 */}
            {phase === "before" && (
              <div className="space-y-3">
                <p className="text-xs text-volt-muted">開演まで</p>
                {ready ? (
                  <CountdownDisplay countdown={countdown} />
                ) : (
                  <CountdownSkeleton />
                )}
              </div>
            )}

            {phase === "today" && (
              <div className="space-y-3">
                <p className="text-lg font-bold text-volt-yellow animate-pulse">
                  本日開催！
                </p>
                {ready ? (
                  <CountdownDisplay countdown={countdown} />
                ) : (
                  <CountdownSkeleton />
                )}
              </div>
            )}

            {phase === "during" && (
              <div className="space-y-1">
                <p className="text-lg font-bold text-volt-yellow animate-pulse">
                  開催中！
                </p>
                <p className="text-xs text-volt-muted">楽しんで！！</p>
              </div>
            )}

            {phase === "after" && (
              <div className="space-y-1">
                <p className="text-base font-bold text-volt-cyan">
                  ありがとうございました！
                </p>
                <p className="text-xs text-volt-muted">
                  セトリ予想、当たった？
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
        </div>{/* /relative z-10 space-y-4 */}
      </div>{/* /background image wrapper */}
    </section>
  );
}

function CountdownDisplay({
  countdown,
}: {
  countdown: ReturnType<typeof calculateCountdown>;
}) {
  const units = [
    { value: countdown.days, label: "日" },
    { value: countdown.hours, label: "時間" },
    { value: countdown.minutes, label: "分" },
    { value: countdown.seconds, label: "秒" },
  ];

  return (
    <div
      className="flex items-start justify-center gap-1.5 sm:gap-2.5"
      aria-label={`LIVE まであと ${countdown.days}日 ${countdown.hours}時間 ${countdown.minutes}分 ${countdown.seconds}秒`}
    >
      {units.map((u, i) => (
        <Fragment key={u.label}>
          {/* Separator colon */}
          {i > 0 && (
            <span className="text-xl sm:text-3xl font-bold text-volt-muted/50 mt-2.5 sm:mt-3.5 select-none">
              :
            </span>
          )}

          {/* Flip card */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`flip-card ${countdownFont.className}`}>
              <div className="flip-card-inner">
                <span
                  key={u.value}
                  className="countdown-flip block tabular-nums text-white leading-none"
                >
                  {String(u.value).padStart(2, "0")}
                </span>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-volt-muted">
              {u.label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function CountdownSkeleton() {
  const labels = ["日", "時間", "分", "秒"];
  return (
    <div className="flex items-start justify-center gap-1.5 sm:gap-2.5" aria-label="読み込み中">
      {labels.map((label, i) => (
        <Fragment key={label}>
          {i > 0 && (
            <span className="text-xl sm:text-3xl font-bold text-volt-muted/50 mt-2.5 sm:mt-3.5 select-none">
              :
            </span>
          )}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flip-card">
              <div className="flip-card-inner">
                <span className="block w-full h-full rounded-lg bg-volt-edge/50 animate-pulse" />
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-volt-muted">{label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/* ── Section: Setlist Prediction ───────────────────────────────────── */

function SetlistSection({
  pred,
  update,
  songOptions,
}: {
  pred: SetlistPrediction;
  update: (field: keyof SetlistPrediction, value: string | null) => void;
  songOptions: { value: string; label: string }[];
}) {
  const shareText = buildSetlistShareText(
    pred.firstSong,
    pred.lastSong,
    pred.hypeSong,
    pred.freeComment,
    `${appConfig.baseUrl}/live`,
  );
  const hasPrediction = pred.firstSong || pred.lastSong || pred.hypeSong || pred.freeComment.trim();
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <section id="setlist" className="space-y-4 scroll-mt-16">
      <SectionHeading>セトリ予想</SectionHeading>

      <div className="rounded-2xl border border-volt-edge bg-volt-surface/60 p-5 sm:p-6 space-y-5">
        <p className="text-sm text-white/70">
          キミの予想を記録しておこう！ 公演後に答え合わせできるよ。
        </p>
        <p className="text-xs text-volt-muted">
          ※ 全27曲すべてが公演予定！
        </p>

        <div className="space-y-4">
          <SongSelect
            label="1曲目（オープニング）"
            value={pred.firstSong}
            onChange={(v) => update("firstSong", v)}
            options={songOptions}
          />
          <SongSelect
            label="ラスト（最後の曲）"
            value={pred.lastSong}
            onChange={(v) => update("lastSong", v)}
            options={songOptions}
          />
          <SongSelect
            label="最盛り上がり曲"
            value={pred.hypeSong}
            onChange={(v) => update("hypeSong", v)}
            options={songOptions}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="live-free-comment"
              className="block text-xs font-medium text-volt-muted"
            >
              自由記述（{FREE_COMMENT_MAX}文字まで）
            </label>
            <textarea
              id="live-free-comment"
              maxLength={FREE_COMMENT_MAX}
              rows={3}
              value={pred.freeComment}
              onChange={(e) => update("freeComment", e.target.value)}
              placeholder="例：アンコールあるのかな？ あるなら◯◯で決まりでしょ！"
              className="w-full rounded-xl border border-volt-edge bg-black/40 px-3 py-2 text-sm text-white placeholder:text-volt-muted/50 focus:border-volt-cyan focus:outline-none resize-none"
            />
            <p className="text-right text-[10px] text-volt-muted">
              {pred.freeComment.length}/{FREE_COMMENT_MAX}
            </p>
          </div>
        </div>

        {/* シェアプレビュー & ボタン */}
        {hasPrediction && (
          <div className="space-y-3 pt-1">
            <div className="rounded-xl bg-black/30 p-3 text-xs text-white/60 whitespace-pre-wrap break-words">
              {shareText}
            </div>
            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 btn-primary bg-volt-surface text-white border border-volt-cyan/50 hover:bg-volt-edge transition-colors w-full"
            >
              <XIcon />
              X で予想をシェア
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function SongSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: { value: string; label: string }[];
}) {
  const selectId = `live-song-${label.replace(/[^a-zA-Z]/g, "")}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-xs font-medium text-volt-muted">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full rounded-xl border border-volt-edge bg-black/40 px-3 py-2.5 pr-8 text-sm text-white focus:border-volt-cyan focus:outline-none appearance-none cursor-pointer"
        >
          <option value="">― 選択してください ―</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-volt-muted text-xs">
          ▼
        </span>
      </div>
    </div>
  );
}

/* ── Section: Checklist ────────────────────────────────────────────── */

function ChecklistSection({
  essentialItems,
  recommendedItems,
  checked,
  toggle,
  reset,
  checkedCount,
  totalCount,
  allChecked,
}: {
  essentialItems: typeof CHECKLIST_ITEMS;
  recommendedItems: typeof CHECKLIST_ITEMS;
  checked: Record<string, boolean>;
  toggle: (id: string) => void;
  reset: () => void;
  checkedCount: number;
  totalCount: number;
  allChecked: boolean;
}) {
  return (
    <section id="checklist" className="space-y-4 scroll-mt-16">
      <SectionHeading>持ち物チェックリスト</SectionHeading>

      <div className="rounded-2xl border border-volt-edge bg-volt-surface/60 p-5 sm:p-6 space-y-5">
        {/* 進捗バー */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-volt-muted">
            <span>
              {checkedCount}/{totalCount}
            </span>
            {allChecked && (
              <span className="text-volt-yellow font-bold">
                準備かんぺき！
              </span>
            )}
          </div>
          <div className="h-1.5 rounded-full bg-volt-edge overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(checkedCount / totalCount) * 100}%`,
                background: allChecked
                  ? "linear-gradient(90deg, #fee023, #43d9bf)"
                  : "#43d9bf",
              }}
            />
          </div>
        </div>

        {/* 必須 */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-volt-yellow tracking-wider">
            必須
          </p>
          {essentialItems.map((item) => (
            <ChecklistRow
              key={item.id}
              item={item}
              isChecked={!!checked[item.id]}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>

        {/* あると便利 */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-volt-cyan tracking-wider">
            あると便利
          </p>
          {recommendedItems.map((item) => (
            <ChecklistRow
              key={item.id}
              item={item}
              isChecked={!!checked[item.id]}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>

        {/* 補足 */}
        <p className="text-[10px] text-volt-muted leading-relaxed">
          ※ 入場時に手荷物検査が実施される場合があります。スムーズな入場のため、荷物は最小限に。
        </p>

        {/* リセット */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={reset}
            className="text-[10px] text-volt-muted border border-volt-edge rounded-lg px-3 py-1.5 hover:bg-white/5 hover:text-white/50 transition-colors"
          >
            リセット
          </button>
        </div>
      </div>
    </section>
  );
}

const ChecklistRow = memo(function ChecklistRow({
  item,
  isChecked,
  onToggle,
}: {
  item: (typeof CHECKLIST_ITEMS)[number];
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      onClick={onToggle}
      className={`flex items-center gap-3 w-full text-left rounded-xl px-3 py-2.5 border transition-colors ${
        isChecked
          ? "border-volt-cyan/30 bg-volt-cyan/5"
          : "border-volt-edge bg-transparent hover:bg-white/5"
      }`}
    >
      <span
        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
          isChecked
            ? "border-volt-cyan bg-volt-cyan/20 text-volt-cyan"
            : "border-volt-edge"
        }`}
        aria-hidden="true"
      >
        {isChecked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-base" aria-hidden="true">
        {item.emoji}
      </span>
      <span className="flex-1 min-w-0">
        <span
          className={`block text-sm ${
            isChecked ? "text-white/50 line-through" : "text-white"
          }`}
        >
          {item.label}
        </span>
        {item.hint && (
          <span className="block text-[10px] text-volt-muted mt-0.5">
            {item.hint}
          </span>
        )}
      </span>
    </button>
  );
})

/* ── Section: Guideline ───────────────────────────────────────────── */

function GuidelineSection() {
  return (
    <section id="guideline" className="space-y-4 scroll-mt-16">
      <SectionHeading>会場ガイドライン</SectionHeading>

      <div className="rounded-2xl border border-volt-edge bg-volt-surface/60 p-5 sm:p-6 space-y-4">
        <p className="text-xs text-white/60">
          公式ガイドラインから重要なポイントを抜粋しています。
        </p>

        <div className="space-y-3">
          {GUIDELINE_POINTS.map((point) => (
            <div
              key={point.id}
              className="rounded-xl bg-black/20 px-4 py-3 space-y-1.5"
            >
              <p className="text-sm font-medium text-white">
                <span className="mr-1.5" aria-hidden="true">
                  {point.emoji}
                </span>
                {point.title}
              </p>
              <ul className="space-y-0.5 pl-7">
                {point.details.map((d, i) => (
                  <li
                    key={i}
                    className="text-xs text-white/70 leading-relaxed before:content-['•'] before:mr-1.5 before:text-volt-muted"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <a
          href={EVENT_CONFIG.guidelineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs font-medium text-volt-cyan border border-volt-cyan/30 rounded-xl px-4 py-2.5 hover:bg-volt-cyan/10 transition-colors"
        >
          公式ガイドライン全文を見る ↗
        </a>
      </div>
    </section>
  );
}

/* ── Section: Venue & Nearby ──────────────────────────────────────── */

function VenueSection() {
  return (
    <section id="venue" className="space-y-4 scroll-mt-16">
      <SectionHeading>会場・周辺ガイド</SectionHeading>

      <div className="rounded-2xl border border-volt-edge bg-volt-surface/60 p-5 sm:p-6 space-y-5">

        {/* 会場名・住所 */}
        <div className="text-center space-y-1">
          <a
            href={VENUE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-lg font-bold text-white hover:text-volt-cyan transition-colors"
          >
            会場：{EVENT_CONFIG.venue}
          </a>
          <p className="text-xs text-volt-muted">{EVENT_CONFIG.venueAddress}</p>
        </div>

        {/* Google Maps 埋め込み */}
        <div className="rounded-xl overflow-hidden border border-volt-edge" style={{ aspectRatio: "16/10" }}>
          <iframe
            src={VENUE_MAP_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="LaLa arena TOKYO-BAY 会場マップ"
            className="block w-full h-full"
          />
        </div>

        {/* アクセス */}
        <div className="space-y-2">
          {ACCESS_POINTS.map((ap, i) => (
            <p key={i} className="text-xs text-white/70 leading-relaxed">
              <span className="mr-1.5" aria-hidden="true">{ap.emoji}</span>
              {ap.text}
            </p>
          ))}
          <a
            href={EVENT_CONFIG.accessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-volt-cyan hover:underline mt-1"
          >
            会場アクセス（公式） ↗
          </a>
        </div>

        {/* 周辺スポット */}
        <div className="space-y-3">
          <p className="text-xs text-white/60">
            周辺のおすすめスポット（一部のみ紹介。開発者の個人見解です）
          </p>

          <div className="space-y-2">
            {NEARBY_SPOTS.map((spot) => (
              <a
                key={spot.id}
                href={spot.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl bg-black/20 px-4 py-3 hover:bg-black/30 transition-colors group"
              >
                <span className="text-base mt-0.5 flex-shrink-0" aria-hidden="true">
                  {spot.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-volt-cyan transition-colors">
                    {spot.name}
                  </p>
                  <p className="text-xs text-white/60 leading-relaxed mt-0.5">
                    {spot.detail}
                  </p>
                  {spot.note && (
                    <p className="text-[10px] text-volt-yellow/80 mt-1">
                      ※ {spot.note}
                    </p>
                  )}
                </div>
                <span className="text-volt-muted text-xs flex-shrink-0 mt-1 group-hover:text-volt-cyan transition-colors">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* 駐車場・駐輪場（アコーディオン） */}
        <details className="group">
          <summary className="flex items-center gap-2 text-xs font-medium text-white/70 cursor-pointer select-none hover:text-white/90 transition-colors [&::-webkit-details-marker]:hidden list-none">
            <span className="details-arrow" aria-hidden="true">▶</span>
            駐車場・駐輪場について
          </summary>
          <div className="mt-3 space-y-3">
            {PARKING_INFO.map((info) => (
              <div
                key={info.title}
                className="rounded-xl bg-black/20 px-4 py-3 space-y-1.5"
              >
                <p className="text-sm font-medium text-white">
                  <span className="mr-1.5" aria-hidden="true">{info.emoji}</span>
                  {info.title}
                </p>
                <ul className="space-y-0.5 pl-7">
                  {info.details.map((d, i) => (
                    <li
                      key={i}
                      className="text-xs text-white/70 leading-relaxed before:content-['•'] before:mr-1.5 before:text-volt-muted"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

/* ── Section: Official Links ───────────────────────────────────────── */

function OfficialLinksSection() {
  return (
    <section id="links" className="space-y-4 scroll-mt-16">
      <SectionHeading>公式リンク</SectionHeading>

      <div className="rounded-2xl border border-volt-edge bg-volt-surface/60 p-5 sm:p-6 space-y-3">
        {OFFICIAL_LINKS.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-xl px-4 py-3 border border-volt-edge hover:border-volt-cyan/40 bg-black/20 hover:bg-white/5 transition-colors group"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-volt-cyan transition-colors truncate">
                {link.label}
              </p>
              {link.description && (
                <p className="text-[10px] text-volt-muted mt-0.5">
                  {link.description}
                </p>
              )}
            </div>
            <span className="text-volt-muted text-xs flex-shrink-0">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ── Shared UI ─────────────────────────────────────────────────────── */

const SectionHeading = memo(function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-bold text-volt-cyan uppercase tracking-wider">
        {children}
      </h2>
      <div className="h-px bg-linear-to-r from-volt-yellow via-volt-cyan to-transparent" />
    </div>
  );
})

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}
