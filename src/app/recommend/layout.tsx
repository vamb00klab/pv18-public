import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "楽曲レコメンド",
  description: "今の気分に刺さるポケミク曲、探してみない？",
  openGraph: {
    title: "楽曲レコメンド",
    description: "今の気分に刺さるポケミク曲、探してみない？",
  },
  twitter: {
    title: "楽曲レコメンド",
    description: "今の気分に刺さるポケミク曲、探してみない？",
  },
}

export default function RecommendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
