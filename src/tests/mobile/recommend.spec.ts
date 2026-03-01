import { test, expect } from '@playwright/test'

/**
 * レコメンド Q1 (/recommend) モバイルレイアウトテスト
 *
 * 確認ポイント:
 * - 感情選択肢（Feel ボタン）6件が 2×3 グリッドで収まる（横方向に見切れない）
 * - 「次へ →」ボタンが viewport 下端に見切れない
 * - 進捗「Q1 / 5」が表示される
 * - スクリーンショットで回帰検出
 *
 * Q1 の選択肢は静的定数のため、毎回同じ初期描画になる。
 */
test.describe('レコメンド Q1 (/recommend)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recommend')
    await page.waitForLoadState('domcontentloaded')
  })

  test('スクリーンショット（viewport）', async ({ page }) => {
    await expect(page).toHaveScreenshot('recommend-q1-viewport.png', {
      maxDiffPixelRatio: 0.05,
    })
  })

  test('感情選択肢 6 件すべてが viewport 内の幅に収まる', async ({ page }) => {
    const { width } = page.viewportSize()!
    const buttons = page.getByRole('button').filter({
      hasText: /感動|泣ける|懐かしい|かわいい|かっこいい|チル|癒し|疾走/,
    })
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(6)

    // 各ボタンが右端からはみ出していないか
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
    }
  })

  test('進捗テキスト「Q1 / 5」が表示される', async ({ page }) => {
    await expect(page.getByText(/Q1\s*\/\s*5/)).toBeVisible()
  })

  test('「次へ →」ボタンが viewport 幅内に収まる', async ({ page }) => {
    const { width } = page.viewportSize()!
    const btn = page.getByRole('button', { name: /次へ/ })
    await expect(btn).toBeVisible()
    const box = await btn.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
  })
})
