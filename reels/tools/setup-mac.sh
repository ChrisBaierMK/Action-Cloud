#!/usr/bin/env bash
# Set up the video workspace on a Mac. Run once in Terminal:
#     bash setup-mac.sh
# Safe to run again. Uses Homebrew and a Python environment of its own; never asks for sudo.
#
# STATUS: written and syntax-checked on Linux on 24 November 2026. NOT yet run on a Mac.
# Whoever runs it first: read it, fix what macOS needs, and update this line.
set -u

ROOT="${REELS_HOME:-$HOME/Movies/Reels}"
REPO="https://github.com/ChrisBaierMK/Action-Cloud.git"
BRANCH="claude/cool-archimedes-h9y6sw"
say() { printf "\n== %s\n" "$1"; }

say "Folders in $ROOT"
mkdir -p "$ROOT/sources" "$ROOT/assets/logos" "$ROOT/assets/music" "$ROOT/finished" || exit 1
echo "sources   raw footage, one file per take"
echo "assets    logos, screenshots, music you hold a license for"
echo "finished  finished videos"

say "Programs (Homebrew)"
if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew is missing. Install it from https://brew.sh, then run this script again."
  exit 1
fi
need() { command -v "$1" >/dev/null 2>&1 && echo "have $1" || brew install "$2"; }
need git git
need ffmpeg ffmpeg
need node node
need python3 python
NODE_MAJOR=$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1)
if [ "${NODE_MAJOR:-0}" -lt 22 ]; then
  echo "! Node is version ${NODE_MAJOR:-none}; HyperFrames needs 22 or newer: brew upgrade node"
fi

say "Workspace (the editing tools) in $ROOT/workspace"
if [ -d "$ROOT/workspace/.git" ]; then
  git -C "$ROOT/workspace" pull --ff-only
else
  git clone --branch "$BRANCH" --single-branch "$REPO" "$ROOT/workspace" || exit 1
fi
W="$ROOT/workspace/reels"
[ -e "$W/sources" ] || ln -s "$ROOT/sources" "$W/sources"

say "Python environment in $ROOT/.venv"
[ -x "$ROOT/.venv/bin/python3" ] || python3 -m venv "$ROOT/.venv" || exit 1
# bootstrap.sh installs with "python3 -m pip": inside the environment that lands here, not in the system Python
# shellcheck disable=SC1091
. "$ROOT/.venv/bin/activate"

say "Packages, speech model, fonts"
bash "$W/tools/bootstrap.sh"
STATUS=$?

say "Done"
echo "Copy the footage you film into:   $ROOT/sources"
echo "Finished videos go to:            $ROOT/finished"
echo "Before running the editing scripts in a new Terminal window:   source \"$ROOT/.venv/bin/activate\""
echo "To let a Claude session in the cloud use this folder: Claude desktop app, Settings, Claude Code,"
echo "Remote Control, and add $ROOT there."
exit $STATUS
