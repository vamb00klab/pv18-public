import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "ポケモン feat. 初音ミク Project VOLTAGE ファンサイトの免責事項・著作権・お問い合わせ先",
}

const CONTACT_EMAIL: string = "vamb00klab@gmail.com"
const CONTACT_X: string = "https://x.com/vamb00klab"

export default function AboutPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
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
          <filter id="about-glow-cyan" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="about-glow-yellow" x="-80%" y="-80%" width="260%" height="260%">
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
            filter={f.color === "#43d9bf" ? "url(#about-glow-cyan)" : "url(#about-glow-yellow)"}
            style={{
              animation: `firefly-pulse ${f.dur}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </svg>

      {/* コンテンツ */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 space-y-12">

        {/* ヘッダ */}
        <div className="space-y-3">
          <Link
            href="/"
            className="text-xs text-volt-muted hover:text-white/60 transition-colors"
          >
            ← トップへ戻る
          </Link>
          <h1 className="text-2xl font-bold text-white">このサイトについて</h1>
          <div className="h-px bg-linear-to-r from-volt-yellow via-volt-cyan to-transparent" />
        </div>

        {/* このサイトについて */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-volt-cyan uppercase tracking-wider">
            このサイトについて
          </h2>
          <p className="text-sm text-white/75 leading-relaxed">
            本サイトは「ポケモン feat. 初音ミク Project VOLTAGE」を応援するための、
            個人制作による非公式ファンサイトです。任天堂・株式会社ポケモン・Crypton Future Media
            およびその関連各社とは一切関係がありません。
            商業目的での利用は一切行っておらず、非営利での運営を行っています。
          </p>
        </section>

        {/* 公式サイト */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-volt-cyan uppercase tracking-wider">
            公式サイト
          </h2>
          <div className="rounded-xl border border-volt-edge p-5 bg-volt-surface/40">
            <a
              href="https://www.project-voltage.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-volt-cyan hover:underline"
            >
              ポケモン feat. 初音ミク Project VOLTAGE 公式サイト ↗
            </a>
          </div>
        </section>

        {/* 著作権・商標について */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-volt-cyan uppercase tracking-wider">
            著作権・商標について
          </h2>
          <ul className="space-y-2 text-sm text-white/75 leading-relaxed list-none">
            <li className="pl-4 border-l border-volt-edge">
              「ポケモン」「Pokémon」は任天堂・クリーチャーズ・ゲームフリークの登録商標です。
              © Nintendo / Creatures Inc. / GAME FREAK inc.
            </li>
            <li className="pl-4 border-l border-volt-edge">
              「初音ミク」等のキャラクターは Crypton Future Media, INC. の著作物です。
              本サイトは Piapro キャラクター利用ガイドラインに基づき、非営利目的で運営しています。
            </li>
            <li className="pl-4 border-l border-volt-edge">
              「重音テト」は「あんてな」氏の創作キャラクターです。
            </li>
            <li className="pl-4 border-l border-volt-edge">
              掲載する楽曲名・アーティスト名は事実の引用として掲載しています。
            </li>
            <li className="pl-4 border-l border-volt-edge">
              動画は YouTube の公式チャンネルで公開されている動画を、YouTube 利用規約の範囲内で
              埋め込み表示しています。
            </li>
          </ul>
        </section>

        {/* コンテンツに関するお問い合わせ */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-volt-cyan uppercase tracking-wider">
            コンテンツに関するお問い合わせ
          </h2>
          <p className="text-sm text-white/75 leading-relaxed">
            著作権その他コンテンツに関するお問い合わせは、可能な範囲で速やかに対応いたします。
          </p>
        </section>

        {/* お問い合わせ */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-volt-cyan uppercase tracking-wider">
            お問い合わせ
          </h2>
          <div className="rounded-xl border border-volt-edge p-5 space-y-3 bg-volt-surface/40">
            {CONTACT_EMAIL ? (
              <p className="text-sm text-white/75">
                メール:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-volt-cyan hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            ) : null}
            {CONTACT_X ? (
              <p className="text-sm text-white/75">
                X (Twitter):{" "}
                <a
                  href={CONTACT_X}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-volt-cyan hover:underline"
                >
                  {CONTACT_X.replace("https://x.com/", "@")}
                </a>
              </p>
            ) : null}
            {!CONTACT_EMAIL && !CONTACT_X && (
              <p className="text-sm text-volt-muted">
                準備中です。しばらくお待ちください。
              </p>
            )}
            <p className="text-xs text-volt-muted leading-relaxed pt-1">
              ※ 余暇時間での趣味の個人開発につき、返答が遅くなる場合がございます。ご了承ください。
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}
