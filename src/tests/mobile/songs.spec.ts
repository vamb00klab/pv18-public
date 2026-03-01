import { test, expect } from '@playwright/test'

/**
 * 全曲一覧 (/songs) モバイルレイアウトテスト
 *
 * 確認ポイント:
 * - フィルタバーが viewport 幅に収まる
 * - 楽曲カードが viewport 幅に収まる（横スクロールが発生しない）
 * - スクリーンショットで回帰検出
 *
 * YouTube iframe はネットワーク遮断してテストを安定させる。
 * （iframe 読み込みの成否はレイアウト検証と無関係のため）
 */
test.describe('全曲一覧 (/songs)', () => {
  test.beforeEach(async ({ page }) => {
    // YouTube への接続を遮断してテストを安定化
    await page.route('**/*youtube*', route => route.abort())
    await page.route('**/*ytimg.com*', route => route.abort())

    await page.goto('/songs')
    await page.waitForLoadState('domcontentloaded')
  })

  test('スクリーンショット（viewport）', async ({ page }) => {
    await expect(page).toHaveScreenshot('songs-viewport.png', {
      maxDiffPixelRatio: 0.05,
      // YouTube サムネイルは遮断済みだが念のため mask で除外
      mask: [page.locator('iframe')],
    })
  })

  test('ページ全体の横幅が viewport を超えない（横スクロール禁止）', async ({ page }) => {
    const { width } = page.viewportSize()!
    // document.documentElement.scrollWidth > viewport.width なら横スクロールが発生している
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(width + 1)
  })

  test('フィルタバーが viewport 幅内に収まる', async ({ page }) => {
    const { width } = page.viewportSize()!
    // フィルタバーはスティッキー領域内の最初の button を探す
    const firstFilterBtn = page.getByRole('button').first()
    await expect(firstFilterBtn).toBeVisible()
    const box = await firstFilterBtn.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
  })

  test('楽曲カードが 1 件以上表示される', async ({ page }) => {
    // 再生ボタン（aria-label: "○○ を再生"）が少なくとも 1 件表示される
    const playButtons = page.getByRole('button', { name: /を再生/ })
    const count = await playButtons.count()
    expect(count).toBeGreaterThan(0)
  })
})
