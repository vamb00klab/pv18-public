import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.NEXT_PUBLIC_DISPLAY_NAME ?? "PersonaVOLT18",
    short_name: "PV18",
    description:
      process.env.NEXT_PUBLIC_TAGLINE ?? "キミの中に眠る「タイプ」を見つけよう",
    start_url: "/",
    display: "browser",
    background_color: "#0e0c00",
    theme_color: "#0e0c00",
    icons: [
      {
        src: "/icons/favicon/icon_w192b.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/favicon/icon_w512b.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
