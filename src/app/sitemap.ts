import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`,          changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/quiz`,      changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/result`,    changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/recommend`, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/songs`,     changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/about`,     changeFrequency: "monthly", priority: 0.5 },
  ]
}
