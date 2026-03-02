/**
 * /recommend の OGP 画像
 * Next.js App Router のファイル規約により /recommend/opengraph-image として配信される。
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
            background: "linear-gradient(to right, #43d9bf, #fee023)",
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
              今の気分に刺さるポケミク曲、
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 54,
                fontWeight: 700,
                color: "#43d9bf",
                lineHeight: 1.3,
              }}
            >
              探してみない？
            </div>
          </div>

          {/* Hashtag chips */}
          <div style={{ display: "flex", gap: 16 }}>
            {(["#ポケミク", "#ポケミクライブ"] as const).map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "8px 28px",
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
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
