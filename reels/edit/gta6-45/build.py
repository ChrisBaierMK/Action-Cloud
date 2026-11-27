#!/usr/bin/env python3
"""The 45-second version of the "This or GTA 6?" reel, cut on the beat of the song Chris chose.

    python3 edit/gta6-45/build.py      ->  edit/gta6-45/final.mp4 and segments.json   (run from reels/)

Song: "Flower In A Hurricane" (Justice, from the GTA VI score). Tempo measured on its public 15 s preview: 125.9 BPM,
taken as 126. One bar = 4 beats = 1.905 s; the reel is 24 bars = 45.71 s. The song itself is NOT in the file: it is a
commercial recording and gets added in the app when posting, starting on a beat.

Five clips hold 38.9 s of footage, so 45 s needs every angle more than once: wide shots plus detail framings cropped
out of the 4K frames (a 2x crop is still full resolution). Each shot lasts half a bar, one bar or two bars.
"""
import json, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "edit" / "gta6-45"
sys.path.insert(0, str(ROOT / "edit" / "gta6"))
import look as LOOK  # the same "vice" look as the short version

BPM, FPS = 126.0, 30
BAR_FRAMES = 4 * 60.0 / BPM * FPS  # 57.14 frames
HLG = ("zscale=tin=arib-std-b67:min=bt2020nc:pin=bt2020:rin=tv:t=linear:npl=100,format=gbrpf32le,"
       "zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p")
FIX_1285 = "colorchannelmixer=rr=0.888:gg=0.975:bb=1.102,eq=gamma=1.28:saturation=0.9"

# (clip, source start s, bars, zoom, center x, center y, speed, sky tint on?, what)
S = [
    ("1281", 0.50, 1.0, 1.15, 0.50, 0.50, 0.5, True,  "front, lights off, slow motion"),
    ("1283", 0.10, 1.0, 1.15, 0.50, 0.50, 1.0, True,  "lights on"),
    ("1283", 0.90, 0.5, 2.00, 0.42, 0.61, 1.0, False, "detail: lit headlight"),
    ("1281", 1.50, 0.5, 1.90, 0.76, 0.47, 0.5, True,  "detail: sleds from the front"),
    ("1283", 2.30, 1.0, 1.15, 0.50, 0.50, 1.0, True,  "drives past"),
    ("1286", 0.20, 1.0, 1.25, 0.50, 0.56, 1.0, True,  "rear three-quarter"),
    ("1286", 2.20, 0.5, 2.00, 0.62, 0.44, 1.0, True,  "detail: sleds from behind"),
    ("1286", 3.20, 0.5, 2.00, 0.58, 0.58, 1.0, False, "detail: tail light"),
    ("1287", 0.30, 1.0, 1.35, 0.52, 0.50, 1.0, True,  "rear side, far"),
    ("1285", 0.80, 1.0, 1.10, 0.42, 0.56, 1.0, True,  "side, full livery"),
    ("1283", 3.05, 1.0, 1.70, 0.55, 0.58, 1.0, False, "detail: side graphics passing"),
    ("1287", 4.40, 0.5, 1.80, 0.40, 0.60, 1.0, False, "detail: 24 badge and tail light"),
    ("1287", 5.60, 0.5, 1.70, 0.58, 0.80, 1.0, False, "detail: rear wheel"),
    ("1286", 4.40, 1.0, 1.10, 0.50, 0.54, 1.0, True,  "rear, closer"),
    ("1287", 1.80, 1.0, 1.15, 0.50, 0.52, 1.0, True,  "rear side, approaching"),
    ("1283", 1.15, 2.0, 1.00, 0.50, 0.50, 1.0, True,  "the whole move: lights on, pull away, pass (full frame)"),
    ("1281", 0.10, 0.5, 1.90, 0.30, 0.62, 0.5, False, "detail: grille, slow motion"),
    ("1281", 2.30, 0.5, 1.90, 0.62, 0.64, 0.5, False, "detail: front wheel and door, slow motion"),
    ("1285", 13.0, 1.0, 1.12, 0.42, 0.56, 1.0, True,  "side, later"),
    ("1286", 2.40, 1.0, 1.60, 0.50, 0.52, 1.0, True,  "rear, tight"),
    ("1286", 5.20, 0.5, 1.90, 0.62, 0.40, 1.0, True,  "detail: sleds, top"),
    ("1287", 6.60, 0.5, 1.50, 0.40, 0.40, 1.0, True,  "detail: sleds close"),
    ("1283", 1.90, 1.0, 1.50, 0.40, 0.60, 1.0, False, "cab and headlight passing, tight"),
    ("1285", 6.00, 1.0, 1.15, 0.45, 0.56, 1.0, True,  "side, middle"),
    ("1287", 2.60, 1.0, 1.50, 0.45, 0.55, 1.0, True,  "rear side, tighter"),
    ("1287", 6.50, 0.5, 1.60, 0.72, 0.66, 1.0, False, "detail: moto24 lettering"),
    ("1287", 5.00, 0.5, 2.00, 0.30, 0.62, 1.0, False, "detail: tail light close"),
    ("1287", 3.76, 2.0, 1.00, 0.50, 0.50, 1.0, True,  "finale: closing in, ends on the lettering"),
]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"failed: {' '.join(cmd[:8])} ...\n{r.stderr[-1500:]}")
    return r.stdout


def probe(f):
    j = json.loads(run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(f)]))
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    rot = 0
    for sd in v.get("side_data_list", []):
        rot = int(sd.get("rotation", rot) or rot)
    w, h = (v["height"], v["width"]) if abs(rot) in (90, 270) else (v["width"], v["height"])
    aac = [i for i, s in enumerate(x for x in j["streams"] if x["codec_type"] == "audio") if s.get("codec_name") == "aac"]
    return w, h, v.get("color_transfer"), (aac[0] if aac else None), float(j["format"]["duration"])


def main():
    LOOK.ramp_png(OUT / "sky-tint.png", LOOK.SKY)
    LOOK.ramp_png(OUT / "sky-mask.png", LOOK.MASK, gray=True)
    info = {c: probe(ROOT / "sources" / f"IMG_{c}.mov") for c in {s[0] for s in S}}
    jobs, segs, bars = [], [], 0.0
    for n, (clip, start, nb, z, cx, cy, speed, sky, what) in enumerate(S):
        f0, f1 = round(bars * BAR_FRAMES), round((bars + nb) * BAR_FRAMES)
        frames = f1 - f0
        out_dur = frames / FPS
        src_dur = out_dur * speed
        w, h, transfer, aidx, total = info[clip]
        if start + src_dur > total + 0.02:
            sys.exit(f"shot {n} ({what}) runs past the end of IMG_{clip}: {start + src_dur:.2f} > {total:.2f}")
        cw, ch = int(w / z) // 2 * 2, int(h / z) // 2 * 2
        x = min(max(int(cx * w - cw / 2), 0), w - cw)
        y = min(max(int(cy * h - ch / 2), 0), h - ch)
        # crop and scale first: tone mapping then works on a 1080x1920 frame, not on 4K (several times faster)
        pre = [f"crop={cw}:{ch}:{x}:{y}", "scale=1080:1920:flags=lanczos"]
        pre += ([HLG] if transfer == "arib-std-b67" else []) + ([FIX_1285] if clip == "1285" else [])
        pre += [f"setpts={1 / speed}*PTS", f"fps={FPS}"]
        L = dict(LOOK.LOOKS["vice"])
        if not sky:
            L["sky"] = 0.0
        LOOK.LOOKS[f"_s{n}"] = L
        graph = f"[0:v]{','.join(pre)}[pre];" + LOOK.graph(f"_s{n}").replace("[0:v]", "[pre]", 1)
        af = (f"atempo={speed}," if speed != 1 else "") + f"afade=t=in:d=0.03,afade=t=out:st={out_dur - 0.03:.3f}:d=0.03,aresample=48000,apad=whole_dur={out_dur:.4f}"
        seg = OUT / f"seg-{n:02d}.mp4"
        src = ROOT / "sources" / f"IMG_{clip}.mov"
        cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{start}", "-t", f"{src_dur + 0.2:.3f}", "-i", str(src),
               "-loop", "1", "-i", str(OUT / "sky-tint.png"), "-loop", "1", "-i", str(OUT / "sky-mask.png"),
               "-filter_complex", graph, "-map", "[out]", "-map", f"0:a:{aidx}", "-af", af, "-c:a", "aac", "-b:a", "256k", "-ac", "2",
               "-frames:v", str(frames), "-t", f"{out_dur:.4f}", "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", str(seg)]
        jobs.append(cmd)
        segs.append({"i": n, "source": f"IMG_{clip}.mov", "what": what, "src_start": start, "src_end": round(start + src_dur, 3),
                     "out_start": round(f0 / FPS, 4), "out_dur": round(out_dur, 4), "speed": speed, "bars": nb, "bar": round(bars + 1, 2)})
        bars += nb
    if "--join-only" not in sys.argv:
        with ThreadPoolExecutor(max_workers=3) as ex:
            list(ex.map(run, jobs))
    inputs = sum((["-i", str(OUT / f"seg-{n:02d}.mp4")] for n in range(len(S))), [])
    # Picture and sound are joined separately. Joined as pairs, each segment is stretched to its longer stream (AAC pads
    # a few milliseconds), which added 9 frames over 28 segments and would pull the cuts off the beat.
    fc = "".join(f"[{n}:a]atrim=0:{segs[n]['out_dur']:.4f},asetpts=PTS-STARTPTS[a{n}];" for n in range(len(S)))
    fc += "".join(f"[{n}:v]" for n in range(len(S))) + f"concat=n={len(S)}:v=1:a=0[v];"
    fc += "".join(f"[a{n}]" for n in range(len(S))) + f"concat=n={len(S)}:v=0:a=1[a]"
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(FPS), "-c:a", "aac", "-b:a", "256k",
         "-movflags", "+faststart", str(OUT / "final.mp4")])
    total = round(bars * BAR_FRAMES) / FPS
    (OUT / "segments.json").write_text(json.dumps({"duration": round(total, 4), "bpm": BPM, "bar_seconds": round(BAR_FRAMES / FPS, 4), "segments": segs}, indent=1))
    print(f"final.mp4: {total:.2f} s = {bars:g} bars at {BPM:g} BPM, {len(S)} shots, {len(S) - 1} cuts")


if __name__ == "__main__":
    main()
