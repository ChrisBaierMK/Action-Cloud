#!/usr/bin/env python3
"""Render props for the 45-second version. Run from reels/ after build.py:  python3 edit/gta6-45/make_props.py
The caption words sit on the beat grid: "This" on beat 1, then one word per beat; "500 kg" on the first rear view."""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
E = ROOT / "edit" / "gta6-45"
seg = json.loads((E / "segments.json").read_text())
beat = seg["bar_seconds"] / 4
pub = ROOT / "remotion" / "public" / "gta6-45"
pub.mkdir(parents=True, exist_ok=True)
shutil.copy2(E / "final.mp4", pub / "video.mp4")

rear = next(s for s in seg["segments"] if s["what"].startswith("rear three-quarter"))  # bar 5: the load in full view
w = lambda text, t, seg_i: {"text": text, "start": round(t, 3), "end": round(t + beat * 0.8, 3), "seg": seg_i}
words = [w("This", 0.10, 0), w("or", beat, 0), w("GTA", 2 * beat, 0), w("6?", 3 * beat, 0),
         w("500", rear["out_start"] + 0.04, rear["i"]), w("kg", rear["out_start"] + beat / 2, rear["i"])]
spec = json.loads((E / "editorial.json").read_text())
# "500 kg" stays for four bars, then leaves; the main caption stays to the last frame
spec["callouts"][1]["hold"] = round(4 * seg["bar_seconds"] - (words[5]["end"] - rear["out_start"]), 3)
props = {
    "video": "gta6-45/video.mp4",
    "captions": {"duration": seg["duration"], "segments": seg["segments"], "words": words},
    "brand": json.loads((ROOT / "remotion" / "src" / "brands" / "selftest.json").read_text()),
    "inserts": [], "subtitles": "none", "style": "marker", "hideSubtitles": [], "drift": True, "hook": None, "corner": False,
    "endCard": None, "subtitlesTop": 1290, "scenes": [], "sceneTone": "calm", "editorial": spec,
}
(E / "editorial-props.json").write_text(json.dumps(props, ensure_ascii=False))
print("props written | duration", seg["duration"], "| 500 kg from", rear["out_start"], "for", 4 * seg["bar_seconds"], "s")
