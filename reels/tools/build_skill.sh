#!/usr/bin/env bash
# Assemble and package the "chris-video-editing" skill from this workspace.
#     bash tools/build_skill.sh        ->  dist/chris-video-editing.skill
# The workspace is the single source: the rules come from style-sheet.md, the caption layer from
# remotion/src/editorial/, the scripts from tools/. Only SKILL.md, three reference files and the setup script live
# in skill-src/. After a rebuild, Chris saves the new .skill file to his profile so every session gets it.
set -eu
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
NAME=chris-video-editing
OUT="$ROOT/dist/$NAME"
W="$OUT/assets/workspace"

rm -rf "$OUT"
mkdir -p "$OUT/references" "$OUT/scripts" "$W/tools" "$W/remotion-editorial" "$W/hf" "$W/models" \
         "$W/fonts/Inter" "$W/fonts/InstrumentSerif"

cp skill-src/SKILL.md "$OUT/"
cp skill-src/references/*.md "$OUT/references/"
cp style-sheet.md "$OUT/references/style-sheet.md"
cp skill-src/scripts/setup_workspace.sh "$OUT/scripts/"

cp tools/watch.py tools/editorial.py tools/bootstrap.sh tools/editorial.example.json "$W/tools/"
cp remotion/src/editorial/Editorial.tsx remotion/src/editorial/Root.tsx remotion/src/editorial/index.ts "$W/remotion-editorial/"
cp remotion/remotion.config.ts "$W/"
cp hf/package.json hf/package-lock.json "$W/hf/"
cp models/face_detection_yunet_2023mar.onnx "$W/models/"
for w in Regular Medium SemiBold Bold Black; do cp "assets/fonts/Inter/Inter-$w.ttf" "$W/fonts/Inter/"; done
cp assets/fonts/Inter/OFL.txt "$W/fonts/Inter/"
cp assets/fonts/InstrumentSerif/InstrumentSerif-Italic.ttf assets/fonts/InstrumentSerif/OFL.txt "$W/fonts/InstrumentSerif/"
cp .gitignore "$W/gitignore"

SC=$(find "$HOME/.claude" -type d -name skill-creator -not -path "*/node_modules/*" 2>/dev/null | head -1)
if [ -z "$SC" ]; then
  echo "skill folder assembled at $OUT (the skill-creator packager was not found, so no .skill file was made)"
  exit 0
fi
(cd "$SC" && python3 -m scripts.package_skill "$OUT" "$ROOT/dist")
ls -la "$ROOT/dist/$NAME.skill"
