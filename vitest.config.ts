import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // jsdom はブラウザ API をエミュレートする。
    // 既存のロジックテスト（diagnose, recommend 等）はどちらでも動作する。
    // UI コンポーネントテスト（QuizFlow, RecommendPage）には jsdom が必要。
    environment: "jsdom",
    // Playwright の spec ファイルは Vitest の対象外（playwright.config.ts で管理）
    exclude: ["src/tests/mobile/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // React 17 以降の新 JSX Transform。@vitejs/plugin-react なしで .tsx を変換できる。
    jsx: "automatic",
    jsxImportSource: "react",
  },
});
