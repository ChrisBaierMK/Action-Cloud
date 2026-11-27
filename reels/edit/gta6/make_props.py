#!/usr/bin/env python3
"""Render props for the "This or GTA 6?" reel: the rough cut plus one caption that builds in the first second and stays.
Run from reels/ after build.py:  python3 edit/gta6/make_props.py"""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
E = ROOT / "edit" / "gta6"
seg = json.loads((E / "segments.json").read_text())
pub = ROOT / "remotion" / "public" / "gta6"
pub.mkdir(parents=True, exist_ok=True)
shutil.copy2(E / "final.mp4", pub / "video.mp4")

# no speech in this reel: the four caption "words" get times by hand; the last one lands on the first cut (0.80 s)
words = [{"text": "This", "start": 0.12, "end": 0.40, "seg": 0}, {"text": "or", "start": 0.42, "end": 0.58, "seg": 0},
         {"text": "GTA", "start": 0.60, "end": 0.78, "seg": 0}, {"text": "6?", "start": 0.80, "end": 1.00, "seg": 1}]
spec = json.loads((E / "editorial.json").read_text())
props = {
    "video": "gta6/video.mp4",
    "captions": {"duration": seg["duration"], "segments": seg["segments"], "words": words},
    "brand": json.loads((ROOT / "remotion" / "src" / "brands" / "selftest.json").read_text()),
    "inserts": [], "subtitles": "none", "style": "marker", "hideSubtitles": [], "drift": True, "hook": None, "corner": False,
    "endCard": None, "subtitlesTop": 1290, "scenes": [], "sceneTone": "calm", "editorial": spec,
}
(E / "editorial-props.json").write_text(json.dumps(props, ensure_ascii=False))
print("props written:", E / "editorial-props.json", "| duration", seg["duration"])
