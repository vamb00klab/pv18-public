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
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)",
          fontFamily: "NotoSansJP",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: 8,
            background: "linear-gradient(to right, #fee023, #43d9bf)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "48px 72px",
            justifyContent: "space-between",
          }}
        >
          {/* Logo small: 240 × (240/2000*416) ≈ 240×50 */}
          <img
            alt=""
            src={logoDataUrl}
            width={240}
            height={50}
            style={{ objectFit: "contain", objectPosition: "left top" }}
          />

          {/* Main text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "flex",
                fontSize: 54,
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.3,
              }}
            >
              キミのポケモンタイプは？
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontWeight: 400,
                color: "#43d9bf",
                lineHeight: 1.3,
              }}
            >
              15問の診断で、キミだけのタイプがわかる
            </div>
          </div>

          {/* Hashtag chips */}
          <div style={{ display: "flex", gap: 16 }}>
            {(["#ポケミク", "#タイプ診断"] as const).map((tag) => (
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
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
