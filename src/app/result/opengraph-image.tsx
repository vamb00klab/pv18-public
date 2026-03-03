/**
 * /result の OGP 画像
 * Next.js App Router のファイル規約により /result/opengraph-image として配信される。
 * og:image / twitter:image メタタグは Next.js が自動挿入する。
 *
 * 静的画像のため個人の診断タイプは反映されないが、
 * og:title は generateMetadata で動的に設定されるため、
 * シェア時に「キミは「◯◯タイプ」 | PersonaVOLT18」が表示される。
 */
import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"
import { fetchNotoSansJP } from "@/lib/ogFont"
import { HASHTAGS } from "@/lib/shareConfig"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const [fonts, logoBuffer] = await Promise.all([
    fetchNotoSansJP(),
    Promise.resolve(
      readFileSync(join(process.cwd(), "public/logos/pv18_logo_master_w2000.png"))
    ),
  ])

  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)",
          fontFamily: "NotoSansJP",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(to right, #fee023, #43d9bf)",
            display: "flex",
          }}
        />

        {/* Logo: 340 × (340/2000*416) ≈ 340×71 */}
        <img
          alt=""
          src={logoDataUrl}
          width={340}
          height={71}
          style={{ objectFit: "contain" }}
        />

        {/* Spark bar */}
        <div
          style={{
            display: "flex",
            height: 2,
            width: 280,
            background:
              "linear-gradient(to right, transparent, #fee023 30%, #43d9bf 70%, transparent)",
            marginTop: 16,
            marginBottom: 32,
          }}
        />

        {/* Main text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: 1,
            }}
          >
            キミのポケモンタイプは？
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 400,
              color: "#43d9bf",
            }}
          >
            15問の診断で、キミだけのタイプがわかる
          </div>
        </div>

        {/* Hashtag chips */}
        <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
          {HASHTAGS.result.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "8px 28px",
                borderRadius: 999,
                border: "1px solid rgba(254,224,35,0.55)",
                color: "rgba(254,224,35,0.85)",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom label */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 40,
            fontSize: 16,
            color: "rgba(255,255,255,0.28)",
            display: "flex",
          }}
        >
          非公式ファンサイト
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
