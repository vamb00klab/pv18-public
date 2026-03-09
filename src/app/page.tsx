import Link from "next/link";
import Image from "next/image";
import { appConfig } from "@/lib/config";
import { GradientBorderLink } from "@/components/GradientButton";

/**
 * Landing page ("/")
 */
export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-start px-4 pt-8 pb-12 sm:pt-10 sm:pb-16"
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
          <filter id="lp-glow-cyan" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="lp-glow-yellow" x="-80%" y="-80%" width="260%" height="260%">
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
          { x: 50, y: 2,  r: 1.5, color: "#43d9bf", dur: 16, delay: -7.1 },
          { x: 50, y: 98, r: 1,   color: "#fee023", dur: 11, delay: -9.8 },
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
          { x: 10, y: 82, r: 3,   color: "#43d9bf", dur: 6,  delay: -5.8 },
          { x: 89, y: 85, r: 2.5, color: "#fee023", dur: 9,  delay: -3.2 },
        ] as const).map((f, i) => (
          <circle
            key={`ff-${i}`}
            className="svg-particle"
            cx={`${f.x}%`}
            cy={`${f.y}%`}
            r={f.r}
            fill={f.color}
            filter={f.color === "#43d9bf" ? "url(#lp-glow-cyan)" : "url(#lp-glow-yellow)"}
            style={{
              animation: `firefly-pulse ${f.dur}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </svg>

      {/* コンテンツ */}
      <div className="relative z-10 max-w-lg w-full text-center space-y-6 sm:space-y-8 page-enter">

        {/* Brand header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logos/pv18_logo_web_w800.png"
              alt={appConfig.displayName}
              width={360}
              height={75}
              priority
            />
          </div>
          <p className="text-base sm:text-lg text-volt-muted">{appConfig.tagline}</p>
          <p className="text-xs text-volt-muted/70 tracking-wide">〜 ポケミクファンのための応援サイト 〜</p>
          {/* スパークバー */}
          <div
            className="volt-spark-bar mx-auto"
            style={{
              height: "1px",
              width: "80%",
              background: "linear-gradient(to right, transparent, #fee023 8%, #43d9bf 92%, transparent)",
            }}
          />
        </div>

        {/* 非公式表記（上部に配置 — 公式誤認防止） */}
        <p className="text-xs text-volt-muted text-center">
          ※ 非公式ファンサイトです（<a
            href="https://www.project-voltage.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-volt-cyan hover:underline"
          >公式サイト ↗</a>）
        </p>

        {/* Project VOLTAGE 説明（初めて来たユーザー向け） */}
        <details className="w-full text-left">
          <summary className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl bg-volt-surface border border-volt-edge text-sm font-medium text-white cursor-pointer select-none hover:border-white/20 transition-colors [&::-webkit-details-marker]:hidden list-none">
            <span className="details-arrow" aria-hidden="true">▶</span>
            「ポケミク」とは？
          </summary>
          <div className="mt-2 p-4 rounded-2xl bg-volt-surface border border-volt-edge text-sm text-white/80 leading-relaxed space-y-3">
            <p>ポケミク（ポケモン feat. 初音ミク Project VOLTAGE）とは、「ポケモン」と「初音ミク（ボーカロイド）」がコラボした音楽プロジェクトです。さまざまなクリエイターによる楽曲やMVを通して、ポケモンの世界観を新しい形で表現しています。</p>
            <a
              href="https://www.project-voltage.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-volt-cyan hover:underline font-medium"
            >
              👉 詳細は公式サイトへ
            </a>
          </div>
        </details>

        {/* LIVE バナー */}
        <Link
          href="/live"
          className="live-banner block w-full rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <div
            className="relative flex items-center justify-between gap-3 px-5 py-5"
            style={{
              backgroundImage: "url(/banners/live-bg.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "right center",
            }}
          >
            {/* 左テキスト読みやすさ用の暗幕グラデーション */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.55) 30%, transparent 80%)" }}
            />
            <div className="relative z-10 space-y-1 min-w-0 text-left">
              <p
                className="text-sm font-black text-volt-yellow tracking-[0.3em] uppercase"
                style={{ textShadow: "0 0 24px rgba(254,224,35,0.8), 0 0 8px rgba(254,224,35,0.5)" }}
              >LIVE EVENT</p>
              <p className="text-base font-bold text-white leading-snug">3/20〜22 ポケミク初 LIVE！</p>
              <p className="text-xs text-white/60">セトリ予想・持ち物チェック →</p>
            </div>
            <span className="relative z-10 text-volt-cyan text-lg flex-shrink-0">→</span>
          </div>
        </Link>

        {/* コール＆レスポンスバナー */}
        <Link
          href="/live/calls"
          className="live-banner block w-full rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <div
            className="relative flex items-center justify-between gap-3 px-5 py-5"
            style={{
              backgroundImage: "url(/banners/call-banner.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.6) 35%, transparent 85%)" }}
            />
            <div className="relative z-10 space-y-1 min-w-0 text-left">
              <p
                className="text-sm font-black text-volt-cyan tracking-[0.3em] uppercase"
                style={{ textShadow: "0 0 24px rgba(67,217,191,0.8), 0 0 8px rgba(67,217,191,0.5)" }}
              >CALL &amp; RESPONSE</p>
              <p className="text-base font-bold text-white leading-snug">コール＆レスポンスまとめ</p>
              <p className="text-xs text-white/60">アーティスト公認のコールガイド →</p>
            </div>
            <span className="relative z-10 text-volt-cyan text-lg flex-shrink-0">→</span>
          </div>
        </Link>

        {/* Feature cards — 対等な 2 本柱 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-left">

          {/* タイプ診断 */}
          <div className="bg-volt-surface rounded-2xl p-4 sm:p-5 border border-volt-yellow/30 flex flex-col gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-volt-yellow uppercase tracking-wider">タイプ診断</p>
              <p className="text-white font-semibold text-sm leading-snug">
                キミの個性を<br />18タイプに分類
              </p>
            </div>
            <ul className="text-xs text-volt-muted space-y-1.5 flex-1">
              <li className="flex items-start gap-1.5">
                <span className="text-volt-yellow mt-0.5" aria-hidden="true">▸</span>
                全15問・約2〜5分
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-volt-yellow mt-0.5" aria-hidden="true">▸</span>
                結果をURLでシェア
              </li>
            </ul>
            <Link
              href="/quiz"
              className="block text-center btn-primary bg-volt-yellow hover:bg-volt-yellow/90 text-black transition-colors"
            >
              診断する →
            </Link>
          </div>

          {/* 楽曲レコメンド */}
          <div className="bg-volt-surface rounded-2xl p-4 sm:p-5 border border-volt-cyan/30 flex flex-col gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-volt-cyan uppercase tracking-wider">楽曲レコメンド</p>
              <p className="text-white font-semibold text-sm leading-snug">
                今の気分に合う<br />ポケミク曲を発見
              </p>
            </div>
            <ul className="text-xs text-volt-muted space-y-1.5 flex-1">
              <li className="flex items-start gap-1.5">
                <span className="text-volt-cyan mt-0.5" aria-hidden="true">▸</span>
                5問・約1〜3分
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-volt-cyan mt-0.5" aria-hidden="true">▸</span>
                YouTubeで試聴OK
              </li>
            </ul>
            <Link
              href="/recommend"
              className="block text-center btn-primary bg-volt-cyan hover:bg-volt-cyan/90 text-black transition-colors"
            >
              曲を探す →
            </Link>
          </div>

        </div>

        {/* 楽曲一覧（グラデーション枠ボタン） */}
        <GradientBorderLink href="/songs">全曲一覧から探す →</GradientBorderLink>

      </div>
    </main>
  );
}
