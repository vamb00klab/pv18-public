/**
 * LP (/) の OGP 画像
 * Next.js App Router のファイル規約により /opengraph-image として配信される。
 * og:image / twitter:image メタタグは Next.js が自動挿入する。
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

  // pv18_logo_master_w2000.png: 2000×416px
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

        {/* Logo: 440 × (440/2000*416) ≈ 440×92 */}
        <img
          src={logoDataUrl}
          width={440}
          height={92}
          style={{ objectFit: "contain" }}
        />

        {/* Spark bar */}
        <div
          style={{
            display: "flex",
            height: 2,
            width: 320,
            background:
              "linear-gradient(to right, transparent, #fee023 30%, #43d9bf 70%, transparent)",
            marginTop: 20,
            marginBottom: 40,
          }}
        />

        {/* Main text — 2 lines (tagline) */}
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
            {'キミだけの「ポケミク」を'}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 700,
              color: "#43d9bf",
              letterSpacing: 1,
            }}
          >
            探そう
          </div>
        </div>

        {/* Hashtag chips */}
        <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
          {(["#ポケミク", "#ポケミクライブ"] as const).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "10px 32px",
                borderRadius: 999,
                border: "1px solid rgba(67,217,191,0.55)",
                color: "rgba(67,217,191,0.85)",
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
