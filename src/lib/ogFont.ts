/**
 * NotoSansJP Bold フォント取得ユーティリティ（OGP 画像生成用）
 *
 * satori は woff1 のみサポートするため、IE11 UA で Google Fonts に問い合わせて
 * woff1 URL を取得し、全サブセットを並列 fetch する。
 * pkmn ブランチの scripts/generate-og.ts から移植。
 */
export async function fetchNotoSansJP() {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=block",
    {
      headers: {
        // IE11 UA → Google Fonts returns woff1 (satori-compatible)
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko",
      },
    }
  ).then((r) => r.text())

  const urls = Array.from(
    css.matchAll(/src: url\((.+?)\) format\('woff'\)/g)
  ).map((m) => m[1])

  const buffers = await Promise.all(
    urls.map((url) => fetch(url).then((r) => r.arrayBuffer()))
  )

  return buffers.map((data) => ({
    name: "NotoSansJP",
    data,
    weight: 700 as const,
    style: "normal" as const,
  }))
}
