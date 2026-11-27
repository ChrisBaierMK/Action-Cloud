#!/usr/bin/env python3
"""Rough cut for the "This or GTA 6?" reel: five phone clips, tone-mapped to SDR, reframed, graded, joined.
Run from reels/:  python3 edit/gta6/build.py   ->  edit/gta6/base.mp4 (ungraded) and edit/gta6/segments.json;
then look.py grades it into final.mp4."""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "edit" / "gta6"
HLG = ("zscale=tin=arib-std-b67:min=bt2020nc:pin=bt2020:rin=tv:t=linear:npl=100,format=gbrpf32le,"
       "zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p")
# one look for every shot: deeper contrast, slightly muted color with the wrap's reds kept, cool shadows, warm lights
GRADE = ("eq=contrast=1.14:saturation=0.94:brightness=-0.015,"
         "curves=master='0/0.015 0.22/0.17 0.5/0.5 0.78/0.83 1/0.97',"
         "colorbalance=bs=0.035:gs=0.008:rh=0.03:bh=-0.03,vibrance=intensity=0.18,vignette=angle=PI/5.2")
# source seconds, zoom and the frame point kept in the center (shares of the source frame), speed (0.5 = slow motion)
SHOTS = [
    {"src": "IMG_1281.mov", "start": 1.00, "dur": 0.40, "speed": 0.5, "z": 1.15, "cx": 0.50, "cy": 0.50, "what": "front, lights off"},
    {"src": "IMG_1283.mov", "start": 1.55, "dur": 2.90, "speed": 1.0, "z": 1.15, "cx": 0.50, "cy": 0.50, "what": "lights on, drives past"},
    {"src": "IMG_1286.mov", "start": 3.20, "dur": 1.35, "speed": 1.0, "z": 1.22, "cx": 0.50, "cy": 0.47, "what": "rear three-quarter"},
    {"src": "IMG_1285.mov", "start": 9.00, "dur": 1.15, "speed": 1.0, "z": 1.10, "cx": 0.50, "cy": 0.47, "what": "side, full livery",
     "fix": "colorchannelmixer=rr=0.888:gg=0.975:bb=1.102,eq=gamma=1.28:saturation=0.9"},
    {"src": "IMG_1287.mov", "start": 4.90, "dur": 2.55, "speed": 1.0, "z": 1.00, "cx": 0.50, "cy": 0.50, "what": "rear, closing in"},
]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"failed: {' '.join(cmd[:6])} ...\n{r.stderr[-1500:]}")
    return r.stdout


def probe(f):
    j = json.loads(run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", str(f)]))
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    rot = 0
    for sd in v.get("side_data_list", []):
        rot = int(sd.get("rotation", rot) or rot)
    w, h = (v["height"], v["width"]) if abs(rot) in (90, 270) else (v["width"], v["height"])
    aac = [i for i, s in enumerate(x for x in j["streams"] if x["codec_type"] == "audio") if s.get("codec_name") == "aac"]
    return w, h, v.get("color_transfer"), (aac[0] if aac else None)


segs, t = [], 0.0
for n, s in enumerate(SHOTS):
    src = ROOT / "sources" / s["src"]
    w, h, transfer, aidx = probe(src)
    cw, ch = int(w / s["z"]) // 2 * 2, int(h / s["z"]) // 2 * 2
    x = min(max(int(s["cx"] * w - cw / 2), 0), w - cw)
    y = min(max(int(s["cy"] * h - ch / 2), 0), h - ch)
    vf = [HLG] if transfer == "arib-std-b67" else []
    if s.get("fix"):
        vf.append(s["fix"])
    out_dur = round(s["dur"] / s["speed"], 3)
    vf += [f"crop={cw}:{ch}:{x}:{y}", "scale=1080:1920:flags=lanczos", f"setpts={1 / s['speed']}*PTS", "fps=30"]
    af = f"atempo={s['speed']}," if s["speed"] != 1 else ""
    af += f"afade=t=in:d=0.03,afade=t=out:st={out_dur - 0.03:.3f}:d=0.03,aresample=48000"
    seg = OUT / f"seg-{n}.mp4"
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", str(s["start"]), "-t", str(s["dur"]), "-i", str(src),
           "-map", "0:v:0", "-vf", ",".join(vf)]
    cmd += (["-map", f"0:a:{aidx}", "-af", af, "-c:a", "aac", "-b:a", "256k", "-ac", "2"] if aidx is not None else ["-an"])
    cmd += ["-t", str(out_dur), "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", str(seg)]
    run(cmd)
    segs.append({"i": n, "source": s["src"], "what": s["what"], "src_start": s["start"], "src_end": round(s["start"] + s["dur"], 3),
                 "out_start": round(t, 3), "out_dur": out_dur, "speed": s["speed"]})
    t += out_dur
    print(f"shot {n}: {s['src']} {s['start']:.2f}+{s['dur']:.2f}s x{s['speed']} -> {segs[-1]['out_start']:.2f}-{t:.2f}  {s['what']}")

inputs = sum((["-i", str(OUT / f"seg-{n}.mp4")] for n in range(len(SHOTS))), [])
fc = "".join(f"[{n}:v][{n}:a]" for n in range(len(SHOTS))) + f"concat=n={len(SHOTS)}:v=1:a=1[v][a]"
run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
     "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "256k",
     "-movflags", "+faststart", str(OUT / "base.mp4")])
(OUT / "segments.json").write_text(json.dumps({"duration": round(t, 3), "segments": segs}, indent=1))
print(f"base.mp4 (ungraded): {t:.2f} s, {len(SHOTS)} shots, {len(SHOTS) - 1} cuts. Next: python3 edit/gta6/look.py")
