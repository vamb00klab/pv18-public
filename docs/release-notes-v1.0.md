# PersonaVOLT18 v1.0 リリースノート

**リリース日**: 2026-02-25
**ブランチ**: `develop` → `master`
**タグ**: `v1.0`

---

## 概要

18種類のパーソナリティタイプに分類する性格診断 Web アプリの初回完成リリース。
Raspberry Pi + Tailscale 構成での個人サーバー稼働を確認済み。

---

## 主要機能

### 診断エンジン
- 15問の質問に回答し、18タイプのうち最も一致するパーソナリティタイプを判定
- 7軸スコア（action / empathy / logic / creativity / endurance / autonomy / depth）による多次元分析
- カテゴリ別ランダム出題（Fisher-Yates シャッフル）

### コンテンツパック
- **neutral パック**（公開用）: IP 非依存の世界観・ラベルで実装
- `NEXT_PUBLIC_CONTENT_PACK` 環境変数でパック切り替え可能
- 将来の pkmn / neutral 二層運用に対応したアーキテクチャ

### 結果表示
- タイプ名・説明・特性・strengths / weaknesses の表示
- 7軸 SVG レーダーチャート（`RadarChart.tsx`）
- 18タイプ × 7軸スコアに基づく個性の可視化

### URL シェア
- コンパクト URL エンコード（3文字/回答）で URL サイズを 97% 削減
- X（旧 Twitter）シェア + URL コピーボタン
- 旧 btoa 形式との後方互換デコード対応

### デザインシステム（volt）
- ダークベース + `volt-yellow (#fee023)` / `volt-cyan (#43d9bf)` アクセント
- CSS アニメーション: スパーク走査・シマー・フェードアップ入場

### アクセシビリティ
- ARIA radiogroup パターン
- キーボード操作（方向キーで選択肢移動）

### その他
- OGP メタデータ + SVG favicon
- `/dev` + `/dev/types` 開発確認ページ
- グローバルエラーバウンダリ・カスタム 404
- `sessionStorage` による回答セッション保持

---

## デプロイ構成

| 項目 | 内容 |
|------|------|
| サーバー | Raspberry Pi（自宅） |
| アクセス | Tailscale VPN 経由（Tailscale IP:3000） |
| プロセス管理 | PM2 |
| デプロイ方法 | `git push pi develop` → post-receive hook 自動ビルド |

---

## 既知の未実装項目（v1.0 時点）

| 項目 | 備考 |
|------|------|
| タイプアイコン | プレースホルダのまま（Phase 6） |
| OGP 画像 | 未生成（Phase 7） |
| HTTPS | Tailscale 内 HTTP 運用（将来対応可） |
| 診断ロジックの拡張性 | 重み付け・複合ルール未対応（改善点 #5） |

---

## コミット範囲

`f7ff7db`（initial scaffold）→ `0ad3ce2`（develop HEAD）
