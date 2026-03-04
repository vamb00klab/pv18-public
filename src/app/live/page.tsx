import type { Metadata } from "next"
import LiveClient from "./LiveClient"

export const metadata: Metadata = {
  title: "LIVE 特設ページ",
  description:
    "ポケモン feat. 初音ミク VOLTAGE Live! カウントダウン・セトリ予想・持ち物チェックリスト",
}

/**
 * /live — Server Component.
 * Time is computed on the client to satisfy React purity rules.
 */
export default function LivePage() {
  return <LiveClient />
}
