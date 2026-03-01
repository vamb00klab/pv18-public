import { test, expect } from '@playwright/test'

/**
 * LP (/) モバイルレイアウトテスト
 *
 * 確認ポイント:
 * - 「診断する」「曲を探す」2枚のカードが viewport 内に収まる
 * - 「全曲一覧から探す」リンクが見切れない
 * - スクリーンショットで回帰検出
 */
test.describe('LP (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('スクリーンショット（viewport）', async ({ page }) => {
    await expect(page).toHaveScreenshot('lp-viewport.png', {
      maxDiffPixelRatio: 0.05,
    })
  })

  test('「診断する →」CTA が viewport 内に収まる', async ({ page }) => {
    const { width, height } = page.viewportSize()!
    const link = page.getByRole('link', { name: '診断する →' })
    await expect(link).toBeVisible()
    const box = await link.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
    expect(box!.y + box!.height).toBeLessThanOrEqual(height * 2) // スクロール圏内
  })

  test('「曲を探す →」CTA が viewport 内に収まる', async ({ page }) => {
    const { width } = page.viewportSize()!
    const link = page.getByRole('link', { name: '曲を探す →' })
    await expect(link).toBeVisible()
    const box = await link.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
  })

  test('「全曲一覧から探す →」リンクが表示される', async ({ page }) => {
    const link = page.getByRole('link', { name: '全曲一覧から探す →' })
    await expect(link).toBeVisible()
  })
})
