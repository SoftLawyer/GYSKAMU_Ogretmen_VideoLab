#!/usr/bin/env bash
# Kullanım: gorsel_yogunluklu_video_tarzi/araclar/render.sh <composition-id> <cikti.mp4>
# Örn    : .../render.sh gy-001 gorsel_yogunluklu_video_tarzi/episodes/gy_001_aile_ici_hirsizlik/gy_001_aile_ici_hirsizlik.mp4
# macOS'ta Remotion'ın indirdiği chrome-headless-shell bazen SIGKILL ile ölür; sistem Chrome'u varsa onu kullanırız.
set -euo pipefail
cd "$(dirname "$0")/../.."
ID="${1:?composition id (ör. gy-001)}"; OUT="${2:?cikti.mp4}"
python3 gorsel_yogunluklu_video_tarzi/araclar/kaydet.py >/dev/null
EXTRA=()
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ -x "$CHROME" ]]; then EXTRA+=(--browser-executable="$CHROME"); fi
npx remotion render gorsel_yogunluklu_video_tarzi/motor/index.ts "$ID" "$OUT" --codec=h264 --crf=18 "${EXTRA[@]}"
