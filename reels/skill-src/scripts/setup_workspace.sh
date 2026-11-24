#!/usr/bin/env bash
# Build an editing workspace for Chris's videos inside a project folder.
#     bash setup_workspace.sh [folder]        (default folder: reels)
# Safe to run again: files already in the workspace are kept, missing ones are added.
# Needs: the it-reelsmaker plugin, ffmpeg, Node 22+, Python 3.9+, and network access to npm, PyPI and Hugging Face.
set -u

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
T="$SKILL_DIR/assets/workspace"
DEST="${1:-reels}"

# The Remotion project comes from the plugin's kit, so it always matches the plugin version that is installed.
KIT="${REELSMAKER_KIT:-}"
if [ -z "$KIT" ]; then
  KIT=$(find "$HOME/.claude" -path "*it-reelsmaker*/scripts/kit.py" -not -path "*/node_modules/*" 2>/dev/null | head -1)
fi
if [ -z "$KIT" ] || [ ! -f "$KIT" ]; then
  echo "  FAIL  the it-reelsmaker plugin is not installed (no kit.py under ~/.claude). Install it, then run this again."
  echo "        Or point to it: REELSMAKER_KIT=/path/to/it-reelsmaker/scripts/kit.py bash $0 $DEST"
  exit 1
fi

mkdir -p "$DEST" && cd "$DEST" || exit 1
mkdir -p sources assets/references assets/fonts edit brands refs models tools hf
echo "workspace: $(pwd)"

# Template files: copy what is missing, keep anything the project already has or changed.
copy_missing() {
  (cd "$1" && find . -type f) | while IFS= read -r f; do
    [ -e "$2/$f" ] || { mkdir -p "$2/$(dirname "$f")" && cp "$1/$f" "$2/$f"; }
  done
}
copy_missing "$T/tools" tools
copy_missing "$T/fonts" assets/fonts
copy_missing "$T/models" models
copy_missing "$T/hf" hf
[ -f .gitignore ] || cp "$T/gitignore" .gitignore
# The project's own copy of the rules: revisions from Chris are written here and win over the skill's copy.
[ -f style-sheet.md ] || cp "$SKILL_DIR/references/style-sheet.md" style-sheet.md
chmod +x tools/*.sh 2>/dev/null

if [ ! -f remotion/package.json ]; then
  python3 "$KIT" new remotion >/dev/null || { echo "  FAIL  kit.py new remotion"; exit 1; }
fi
mkdir -p remotion/src/editorial
copy_missing "$T/remotion-editorial" remotion/src/editorial
grep -q setBrowserExecutable remotion/remotion.config.ts 2>/dev/null || cp "$T/remotion.config.ts" remotion/remotion.config.ts

python3 - <<'EOF'
import json, os
p = "it-reelsmaker.json"
d = json.load(open(p)) if os.path.exists(p) else {}
d.setdefault("project_root", ".")
d.setdefault("remotion_dir", "remotion")
d.setdefault("face_model", "models/face_detection_yunet_2023mar.onnx")
json.dump(d, open(p, "w"), indent=1)
EOF

bash tools/bootstrap.sh || exit 1

# Our caption layer imports the kit's types: a kit version that changed them shows up here, not in the first render.
if (cd remotion && npx tsc --noEmit >/dev/null 2>&1); then
  echo "  ok    caption layer type-checks against the installed kit"
else
  echo "  FAIL  caption layer does not type-check against this kit version."
  echo "        Run 'npx tsc --noEmit' in $(pwd)/remotion and fix src/editorial/ to match."
  exit 1
fi
echo "workspace ready: $(pwd)"
echo "raw footage goes in: $(pwd)/sources"
