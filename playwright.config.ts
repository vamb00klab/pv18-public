import { defineConfig } from '@playwright/test'

/**
 * モバイルビューポートテスト設定
 *
 * ターゲットデバイス:
 *   mobile-375: iPhone SE（3rd gen）実機寸法（375×667px） — 最小幅基準
 *   mobile-393: iPhone 15 Pro 実機寸法（393×852px） — 標準基準
 *
 * ポート割り当て:
 *   3000: npm run dev（通常開発）
 *   3600: Playwright 専用テストサーバー（固定。3000/3001 系の衝突回避）
 *
 * 初回実行（ベースライン生成）:
 *   npm run test:e2e:update
 *
 * 回帰テスト（比較実行）:
 *   npm run test:e2e
 *
 * webServer.reuseExistingServer=true のため、ポート 3600 が起動済みの場合はそのまま流用する。
 * 通常は Playwright がテスト開始時に自動起動・終了する。
 */
export default defineConfig({
  testDir: './src/tests/mobile',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:3600',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'mobile-375',
      use: {
        // iPhone SE (3rd gen) 実機寸法
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'mobile-393',
      use: {
        // iPhone 15 Pro 実機寸法
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],

  webServer: {
    // Playwright 専用テストサーバー（ポート 3600 固定）
    command: 'next dev --hostname 0.0.0.0 --port 3600',
    url: 'http://localhost:3600',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
})
