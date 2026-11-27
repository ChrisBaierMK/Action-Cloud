#!/usr/bin/env python3
"""Render props for the 45-second version. Run from reels/ after build.py:  python3 edit/gta6-45/make_props.py
The caption words sit on the beat grid: "This" on beat 1, then one word per beat."""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
E = ROOT / "edit" / "gta6-45"
seg = json.loads((E / "segments.json").read_text())
beat = seg["bar_seconds"] / 4
pub = ROOT / "remotion" / "public" / "gta6-45"
pub.mkdir(parents=True, exist_ok=True)
shutil.copy2(E / "final.mp4", pub / "video.mp4")

w = lambda text, t, seg_i: {"text": text, "start": round(t, 3), "end": round(t + beat * 0.8, 3), "seg": seg_i}
# one caption only ("500 kg" was taken out by Chris on 27 November); it stays to the last frame
words = [w("This", 0.10, 0), w("or", beat, 0), w("GTA", 2 * beat, 0), w("6?", 3 * beat, 0)]
spec = json.loads((E / "editorial.json").read_text())
props = {
    "video": "gta6-45/video.mp4",
    "captions": {"duration": seg["duration"], "segments": seg["segments"], "words": words},
    "brand": json.loads((ROOT / "remotion" / "src" / "brands" / "selftest.json").read_text()),
    "inserts": [], "subtitles": "none", "style": "marker", "hideSubtitles": [], "drift": True, "hook": None, "corner": False,
    "endCard": None, "subtitlesTop": 1290, "scenes": [], "sceneTone": "calm", "editorial": spec,
}
(E / "editorial-props.json").write_text(json.dumps(props, ensure_ascii=False))
print("props written | duration", seg["duration"], "| caption words:", " ".join(x["text"] for x in words))
