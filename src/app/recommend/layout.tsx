import type { Metadata } from "next"
import { appConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "ポケミクおすすめ曲",
  description: "今の気分に刺さるポケミク曲、探してみない？",
  openGraph: {
    title: `ポケミクおすすめ曲 | ${appConfig.displayName}`,
    description: "今の気分に刺さるポケミク曲、探してみない？",
  },
  twitter: {
    title: `ポケミクおすすめ曲 | ${appConfig.displayName}`,
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
