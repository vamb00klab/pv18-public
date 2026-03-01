import type { Metadata } from "next"
import SongsClient from "./SongsClient"

export const metadata: Metadata = {
  title: "楽曲一覧",
  description: "Project VOLTAGE の全楽曲をエネルギー・雰囲気・キャラクター・世代で絞り込めます",
}

export default function SongsPage() {
  return <SongsClient />
}
