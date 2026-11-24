#!/usr/bin/env bash
# Set up the reels workspace in a fresh container. Safe to run again: every step checks before it works.
# Run from anywhere:  bash reels/tools/bootstrap.sh
set -u
cd "$(dirname "$0")/.."
ok() { printf "  ok    %s\n" "$1"; }
bad() { printf "  FAIL  %s\n" "$1"; FAILED=1; }
FAILED=0

python3 -m pip install -q --upgrade "yt-dlp[default]" faster-whisper opencv-python-headless Pillow numpy >/dev/null 2>&1
python3 -c "import yt_dlp, faster_whisper, cv2, PIL, numpy" 2>/dev/null && ok "python packages (yt-dlp, faster-whisper, OpenCV, Pillow)" || bad "python packages"

command -v ffmpeg >/dev/null && ok "ffmpeg $(ffmpeg -version | head -1 | cut -d' ' -f3)" || bad "ffmpeg is missing"

python3 -c "from faster_whisper import download_model; download_model('medium')" >/dev/null 2>&1 && ok "speech model (faster-whisper medium)" || bad "speech model download"

[ -s models/face_detection_yunet_2023mar.onnx ] && ok "face model" || bad "face model missing from models/"

(cd remotion && { [ -d node_modules/remotion ] || npm ci --no-audit --no-fund >/dev/null 2>&1 || npm install --no-audit --no-fund >/dev/null 2>&1; })
[ -d remotion/node_modules/remotion ] && ok "Remotion packages" || bad "Remotion packages"

(cd hf && { [ -d node_modules/hyperframes ] || PUPPETEER_SKIP_DOWNLOAD=1 npm ci --no-audit --no-fund >/dev/null 2>&1 || PUPPETEER_SKIP_DOWNLOAD=1 npm install --no-audit --no-fund >/dev/null 2>&1; })
if [ -d hf/node_modules/hyperframes ]; then (cd hf && npx --no-install hyperframes telemetry disable >/dev/null 2>&1); ok "HyperFrames packages (telemetry off)"; else bad "HyperFrames packages"; fi

mkdir -p remotion/public/fonts sources assets/references edit brands
cp -n assets/fonts/Inter/Inter-SemiBold.ttf assets/fonts/Inter/Inter-Bold.ttf assets/fonts/Inter/Inter-Black.ttf \
      assets/fonts/InstrumentSerif/InstrumentSerif-Italic.ttf remotion/public/fonts/ 2>/dev/null
[ -s remotion/public/fonts/Inter-Black.ttf ] && [ -s remotion/public/fonts/InstrumentSerif-Italic.ttf ] && ok "caption fonts in the render project" || bad "caption fonts"

[ "$FAILED" = 0 ] && echo "ready" || { echo "not ready: see FAIL lines"; exit 1; }
