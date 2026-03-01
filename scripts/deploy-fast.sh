#!/bin/bash
# deploy-fast.sh — Mac ビルド済みの .next/ を Pi に rsync して pm2 restart するだけ
# （Pi 側のビルドを排除して高速デプロイ）
#
# 使い方: npm run deploy:fast
#   または手動で: npm run build && bash scripts/deploy-fast.sh
#
# 前提:
#   - npm run build（Mac 側）が完了して .next/ が存在すること
#   - Pi への SSH 接続が可能なこと
#   - Pi 上で pm2 が "pv18" という名前で起動済みであること

set -e

PI_HOST="bambookpi@bamb00kpi.local"
PI_APP_DIR="/home/bambookpi/app/pv18"

# .next/ が存在するか確認
if [ ! -d ".next" ]; then
  echo "Error: .next/ が見つかりません。先に npm run build を実行してください。" >&2
  exit 1
fi

echo "[1/2] .next/ を Pi に同期中..."
rsync -avz --delete .next/ "${PI_HOST}:${PI_APP_DIR}/.next/"

echo "[2/2] Pi 上で pm2 を再起動中..."
ssh "${PI_HOST}" "pm2 restart pv18"

echo "デプロイ完了（fast mode: Mac build → rsync → pm2 restart）"
