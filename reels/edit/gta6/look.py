#!/usr/bin/env python3
"""The look pass for the "This or GTA 6?" reel: base.mp4 (ungraded) -> final.mp4.

    python3 edit/gta6/look.py                 # the "vice" look on the whole video
    python3 edit/gta6/look.py --look cinematic
    python3 edit/gta6/look.py --stills 0.4 2.2 4.4 5.6 8.3     # test frames into look/proto/ instead of the video

"vice" is the look people mean by a GTA 6 filter: a hot pink-to-orange sunset sky, warm light, teal shadows, strong
saturation and a slight haze. No file from the game is used: the sky tint is a gradient drawn here, applied only to
the bright upper part of the frame (a brightness key times a top-to-bottom mask), so the truck keeps its colors.
"""
import argparse, subprocess, sys
from pathlib import Path

E = Path(__file__).resolve().parent
W, H = 1080, 1920

# sunset sky: color at the top, at 30% of the height and at the horizon; below that neutral gray (no effect in overlay)
SKY = [(0.00, (255, 52, 148)), (0.30, (255, 112, 64)), (0.50, (255, 176, 96)), (0.56, (128, 128, 128)), (1.0, (128, 128, 128))]
MASK = [(0.00, 255), (0.34, 255), (0.56, 0), (1.0, 0)]  # where the sky tint may act at all

LOOKS = {
    "cinematic": {"sky": 0.0, "grade": "eq=contrast=1.14:saturation=0.94:brightness=-0.015,"
                  "curves=master='0/0.015 0.22/0.17 0.5/0.5 0.78/0.83 1/0.97',"
                  "colorbalance=bs=0.035:gs=0.008:rh=0.03:bh=-0.03,vibrance=intensity=0.18", "bloom": 0.0, "vignette": "PI/5.2"},
    # true to the day it was shot: no tint, no vignette, no haze. A little contrast and color so it is not flat,
    # and a small correction of the phone's cool cast (measured on the asphalt, which should be neutral gray).
    "natural": {"sky": 0.0, "grade": "colorchannelmixer=rr=1.035:gg=1.0:bb=0.965,eq=contrast=1.06:saturation=1.10,"
                "curves=master='0/0 0.25/0.238 0.5/0.5 0.75/0.768 1/1'", "bloom": 0.0, "vignette": None},
    "vice": {"sky": 0.9, "grade": "eq=contrast=1.10:saturation=1.30:gamma=1.02,"
             "colorbalance=rs=-0.06:gs=0.0:bs=0.08:rm=0.05:gm=-0.015:bm=-0.03:rh=0.10:gh=0.01:bh=-0.07,"
             "vibrance=intensity=0.30,curves=master='0/0.01 0.25/0.21 0.5/0.52 0.78/0.84 1/0.985'", "bloom": 0.16, "vignette": "PI/5.6"},
}


def ramp_png(path, stops, gray=False):
    from PIL import Image
    im = Image.new("L" if gray else "RGB", (W, H))
    px = im.load()
    for y in range(H):
        t = y / (H - 1)
        for (a, ca), (b, cb) in zip(stops, stops[1:]):
            if a <= t <= b:
                k = 0 if b == a else (t - a) / (b - a)
                c = round(ca + (cb - ca) * k) if gray else tuple(round(ca[i] + (cb[i] - ca[i]) * k) for i in range(3))
                break
        for x in range(W):
            px[x, y] = c
    im.save(path)


def graph(look):
    L = LOOKS[look]
    g = []
    src = "[0:v]"
    if L["sky"] > 0:
        g += [f"{src}format=gbrp,split=3[b1][b2][b3]",
              # bright pixels only (sky, white walls), softened; then limited to the upper frame
              "[b2]format=gray,curves=all='0/0 0.40/0 0.60/1 1/1',gblur=sigma=14[lum]",
              "[2:v]format=gray[vm]", "[lum][vm]blend=all_mode=multiply[mask]",
              f"[1:v]format=gbrp[sky]", f"[b3][sky]blend=all_mode=overlay:all_opacity={L['sky']}[tint]",
              "[b1][tint][mask]maskedmerge[skyed]"]
        src = "[skyed]"
    g += [f"{src}format=yuv420p,{L['grade']}[gr]"]
    src = "[gr]"
    if L["bloom"] > 0:
        g += [f"{src}split[g1][g2]", "[g2]gblur=sigma=28[gl]", f"[g1][gl]blend=all_mode=screen:all_opacity={L['bloom']}[bl]"]
        src = "[bl]"
    g += [f"{src}vignette=angle={L['vignette']},format=yuv420p[out]" if L.get("vignette") else f"{src}format=yuv420p[out]"]
    return ";".join(g)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--look", default="natural", choices=sorted(LOOKS))
    ap.add_argument("--stills", nargs="*", type=float)
    a = ap.parse_args()
    ramp_png(E / "sky-tint.png", SKY)
    ramp_png(E / "sky-mask.png", MASK, gray=True)
    base = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"]
    imgs = ["-loop", "1", "-i", str(E / "sky-tint.png"), "-loop", "1", "-i", str(E / "sky-mask.png")]
    if a.stills:
        (E / "look" / "proto").mkdir(parents=True, exist_ok=True)
        for t in a.stills:
            out = E / "look" / "proto" / f"{a.look}-{t}.png"
            r = subprocess.run(base + ["-ss", str(t), "-i", str(E / "base.mp4"), *imgs, "-filter_complex", graph(a.look),
                                       "-map", "[out]", "-frames:v", "1", str(out)], capture_output=True, text=True)
            if r.returncode:
                sys.exit(r.stderr[-1200:])
        print("stills:", [f"{a.look}-{t}.png" for t in a.stills])
        return
    r = subprocess.run(base + ["-i", str(E / "base.mp4"), *imgs, "-filter_complex", graph(a.look), "-map", "[out]", "-map", "0:a",
                               "-shortest", "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", "30",
                               "-c:a", "copy", "-movflags", "+faststart", str(E / "final.mp4")], capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr[-1200:])
    print(f"final.mp4 graded with the '{a.look}' look")


if __name__ == "__main__":
    main()
