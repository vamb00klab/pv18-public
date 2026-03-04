# pv18 — PersonaVOLT18

> **プロジェクトコード名**: `pv18`
> **表示名（暫定）**: PersonaVOLT18

ポケモン feat. 初音ミク Project VOLTAGE を応援するファンサイト。
15問の診断で18種類のパーソナリティタイプに分類し、楽曲をレコメンドします。

非公式ファンサイト・非営利・個人開発。任天堂・株式会社ポケモン・Crypton Future Media とは一切関係ありません。

---

## 主要機能

| 機能 | 概要 |
|------|------|
| タイプ診断 | 15問の質問に回答 → 18タイプに分類 |
| 楽曲レコメンド | 4問のアンケート → Project VOLTAGE 楽曲を推薦 |
| 楽曲DB | 全曲一覧・タグ絞り込み・ソート・YouTube 視聴・楽曲紹介・カラオケ配信リンク |
| 結果シェア | X(Twitter)シェア + URL コピー |
| 結果再現 | 回答を URL (`?a=...`) にシリアライズ → リロードでも復元可能 |
| コンテンツ差し替え | タイプ名・質問・ブランド名を env/データファイルのみで変更可 |
| LIVE 特設 | カウントダウン・セトリ予想・持ち物チェック・会場ガイド |
| フィードバック | 右下フロートモーダルでフィードバックを送信 |

---

## ローカル起動

```bash
# 1. 依存インストール
npm install

# 2. 環境変数を設定（任意 — デフォルトで動作する）
cp .env.local.example .env.local

# 3. 開発サーバ起動
npm run dev
# → http://localhost:3000
```

その他のコマンド:

```bash
npm run type-check   # TypeScript 型チェック
npm run lint         # ESLint
npm test             # ユニットテスト（Vitest）
npm run build        # 本番ビルド
```

---

## 技術スタック

| 技術 | 採用理由 |
|------|---------|
| **Next.js 16 (App Router)** | SSR/SSG + CSR 混在が容易、Turbopack デフォルト |
| **TypeScript** | コンテンツ差し替え時の型ミス防止 |
| **Tailwind CSS 4** | 高速 UI 開発。CSS `@theme` でデザイントークン定義 |
| **Vitest** | Next.js との相性が良く `@/` パスエイリアスも使える |

---

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx               # LP (/)
│   ├── globals.css            # ダークベース + volt アニメーション + ボタンサイズトークン
│   ├── quiz/page.tsx          # 診断フロー (/quiz)
│   ├── result/
│   │   ├── page.tsx           # 診断結果 (/result)
│   │   └── ResultClient.tsx
│   ├── recommend/
│   │   ├── page.tsx           # 楽曲レコメンド (/recommend)
│   │   └── opengraph-image.tsx
│   ├── songs/
│   │   ├── page.tsx           # 楽曲DB (/songs)
│   │   ├── SongsClient.tsx    # クライアント部（フィルタ・ソート・楽曲紹介・カラオケ）
│   │   └── songsConstants.ts  # フィルタ・ソート定数定義
│   ├── live/
│   │   ├── page.tsx           # LIVE イベント特設ページ (/live)
│   │   ├── LiveClient.tsx     # 6セクション Client Component
│   │   └── liveData.ts        # EVENT_CONFIG・カウントダウン・ガイドライン
│   ├── about/page.tsx         # このサイトについて (/about)
│   └── dev/                   # 開発専用（本番 404）
│       ├── page.tsx           # リリース確認ダッシュボード
│       ├── DevHealthClient.tsx
│       ├── DevOgpPreview.tsx  # OGP 画像・メタ・シェア文プレビュー
│       ├── types/             # 全タイプ結果カード一覧
│       ├── bg-effects/        # 背景エフェクト比較
│       ├── high-effects/      # High エネルギーエフェクト比較
│       └── hover-anim/        # ホバーアニメーション比較
│
├── components/
│   ├── PageHeader.tsx         # 全ページ共通ヘッダー（ロゴ + サブテキスト + スパークバー）
│   ├── QuizFlow.tsx           # 診断フロー管理
│   ├── ResultCard.tsx         # 結果カード + レーダーチャート
│   ├── RadarChart.tsx         # SVG レーダーチャート（7軸）
│   ├── GradientButton.tsx     # グラデーション CTA ボタン（3バリアント）
│   ├── ShareButton.tsx        # X共有 / URLコピー
│   ├── SongIntro.tsx          # 楽曲紹介（details/summary 開閉式）
│   ├── SongKaraoke.tsx        # カラオケ配信リンク（JOYSOUND / DAM）
│   ├── SongDetailsGroup.tsx   # 排他アコーディオン（曲紹介・カラオケ）
│   ├── SongLinkButtons.tsx    # YouTube / ニコニコ / ポケミク リンクボタン
│   ├── ParticleBackground.tsx # パーティクル背景（/songs, /live 共通）
│   ├── SiteFooter.tsx         # グローバルフッター
│   └── FeedbackButton.tsx     # 右下フロートフィードバックモーダル
│
├── content/
│   └── pokemon/               # コンテンツパック（ポケモンタイプ診断）
│       ├── types.ts           # 18タイプ定義
│       ├── questions.ts       # 15問の質問・選択肢・scoreMap
│       ├── axes.ts            # 7軸定義
│       ├── typeScores.ts      # 18タイプ × 7軸スコアマッピング
│       └── integrity.test.ts  # データ整合性テスト
│
├── data/
│   └── songs.ts               # Project VOLTAGE 楽曲データ
│
├── lib/
│   ├── config.ts              # appConfig
│   ├── contentPack.ts         # パックレジストリ + getContentPack()
│   ├── diagnose.ts            # 診断ロジック
│   ├── recommend.ts           # レコメンドスコアリング
│   ├── selectQuestions.ts     # カテゴリ別ランダム選出
│   ├── answerSession.ts       # sessionStorage アダプター
│   ├── answerUrl.ts           # URL encode/decode
│   ├── shareConfig.ts         # シェア文・ハッシュタグ設定（single source of truth）
│   ├── songUtils.ts           # 楽曲フィルタ・ソートユーティリティ
│   ├── vocaloidLabels.ts      # ボーカロイド表示ラベル
│   └── ogFont.ts              # OGP 画像用フォントローダー
│
└── types/
    ├── persona.ts             # PersonaType インターフェース
    ├── quiz.ts                # Question / Answer / ScoreMap 型
    ├── axis.ts                # Axis / TypeAxisScores 型
    └── song.ts                # Song / SongTag 型
```

---

## コンテンツ差し替え

> タイプ名・説明文・質問はコンテンツパック単位で差し替えられます。
> ロジック層・UI層の変更は不要です。

### ブランド名のみ変える

`.env.local` を編集するだけ:

```bash
NEXT_PUBLIC_DISPLAY_NAME="NewBrandName"
NEXT_PUBLIC_TAGLINE="新しいキャッチコピー"
NEXT_PUBLIC_CONTENT_PACK="pokemon"
```

### 別コンテンツパックを作る

```bash
cp -r src/content/pokemon src/content/my-pack
# my-pack/types.ts, questions.ts, axes.ts, typeScores.ts を編集
```

`src/lib/contentPack.ts` の `registry` に追記後、`.env.local` で `NEXT_PUBLIC_CONTENT_PACK=my-pack` を設定。

---

## 診断ロジック

1. **スコア集計** (`calculateScores`): 各回答の `scoreMap` を加算 → `Record<type_id, score>`
2. **タイプ判定** (`determineResult`): 最高スコアのタイプを返す
3. **タイブレーク**: `types` 配列の先頭側が優先（安定・決定的）

---

## URL シリアライズ

- フォーマット: `?a=01a02b0fc...`（3文字/回答 = q_id hex2 + 選択肢 char）
- 旧 base64 形式との後方互換デコード対応

---

## 状態管理

| 場面 | 手段 |
|------|------|
| 診断中の回答 | React state (QuizFlow 内) |
| 診断完了後の一時保存 | sessionStorage (`answerSession.ts`) |
| 結果の共有・再現 | URL クエリ `?a=` (`answerUrl.ts`) |

---

## ⚠️ 権利関係

- コード・ロジック・UI はすべてオリジナルです。
- 楽曲名・アーティスト名は事実の引用として掲載しています。
- YouTube 埋め込みは公式チャンネルの公開動画を YouTube 利用規約の範囲内で使用しています。
- ポケモン・初音ミク等の公式画像・スプライトは使用していません。
- 「ポケモン」「Pokémon」は任天堂・クリーチャーズ・ゲームフリークの登録商標です。
- 「初音ミク」等は Crypton Future Media, INC. の著作物です。

---

## ライセンス

個人開発プロジェクト。公開ライセンスは別途検討予定。
