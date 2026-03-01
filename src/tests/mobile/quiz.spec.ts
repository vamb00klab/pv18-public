import { test, expect } from '@playwright/test'

/**
 * タイプ診断 (/quiz) モバイルレイアウトテスト
 *
 * 確認ポイント:
 * - 進捗バーが viewport 幅に収まる
 * - 選択肢（radio）が viewport 幅に収まる（テキスト折り返しで崩れない）
 * - 「次へ →」ボタンが viewport 幅に収まる
 *
 * 注意: 質問はランダム選出のためスクリーンショットテストは不適。
 *       レイアウト構造（ProgressBar・RadioGroup・NextButton）の幅のみ検証する。
 */
test.describe('タイプ診断 (/quiz)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz')
    await page.waitForLoadState('domcontentloaded')
  })

  // スクリーンショットなし: 質問ランダム選出のためテキスト内容が毎回変わり比較が不安定

  test('進捗バーが viewport 幅に収まる', async ({ page }) => {
    const { width } = page.viewportSize()!
    const bar = page.getByRole('progressbar')
    await expect(bar).toBeVisible()
    const box = await bar.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
  })

  test('選択肢（radio）が viewport 幅に収まる', async ({ page }) => {
    const { width } = page.viewportSize()!
    const radios = page.getByRole('radio')
    const count = await radios.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const box = await radios.nth(i).boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
    }
  })

  test('「次へ →」ボタンが表示されて viewport 幅に収まる', async ({ page }) => {
    const { width } = page.viewportSize()!
    const btn = page.getByRole('button', { name: /次へ/ })
    await expect(btn).toBeVisible()
    const box = await btn.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
  })
})
