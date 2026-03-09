import type { Metadata } from "next"
import CallsClient from "./CallsClient"

export const metadata: Metadata = {
  title: "コール＆レスポンスまとめ",
  description:
    "VOLTAGE Live! で使えるコール＆レスポンス情報をアーティスト発信・ファン提案別にまとめています。",
}

export default function CallsPage() {
  return <CallsClient />
}
