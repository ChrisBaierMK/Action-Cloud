#!/usr/bin/env python3
"""Draw the grey placeholder images the site ships with until real photographs
and real handwriting exist. Each one has its own file name written on it.

Run from the repository root:   python3 tools/placeholders.py [path prefix ...]
Needs Pillow and Node (Node reads shop-config.js and i18n.js).

It only draws files that do not exist yet, so real images and stand-ins are
safe. To redraw existing placeholders, name them by path prefix, for example
    python3 tools/placeholders.py img/hand/hero img/hands
"""
import sys
import json
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

DUMP = """
global.window = {};
require('./shop-config.js'); require('./i18n.js');
process.stdout.write(JSON.stringify({shop: window.SHOP, i18n: window.I18N}));
"""
data = json.loads(subprocess.check_output(["node", "-e", DUMP], cwd=ROOT))
SHOP, I18N = data["shop"], data["i18n"]


def font(size):
    try:
        return ImageFont.truetype(FONT, size)
    except OSError:
        return ImageFont.load_default()


def fit(draw, text, max_w, start):
    size = start
    while size > 9:
        f = font(size)
        if draw.textlength(text, font=f) <= max_w:
            return f
        size -= 1
    return font(9)


def label(draw, box, lines, fill, start=40):
    x0, y0, x1, y1 = box
    w = x1 - x0
    fonts = [fit(draw, t, w * 0.9, start) for t in lines]
    heights = [f.size * 1.35 for f in fonts]
    y = y0 + ((y1 - y0) - sum(heights)) / 2
    for t, f, h in zip(lines, fonts, heights):
        tw = draw.textlength(t, font=f)
        draw.text((x0 + (w - tw) / 2, y), t, font=f, fill=fill)
        y += h


REDRAW = sys.argv[1:]


def save(img, rel):
    path = os.path.join(ROOT, rel)
    if os.path.exists(path) and not any(rel.startswith(p) for p in REDRAW):
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if rel.endswith(".webp"):
        img.save(path, "WEBP", quality=70, method=6)
    else:
        img.save(path, optimize=True)
    print(f"{os.path.getsize(path):>7}  {rel}")


def dashed_rect(draw, box, colour, width=4, dash=22):
    x0, y0, x1, y1 = box
    for x in range(int(x0), int(x1), dash * 2):
        draw.line([(x, y0), (min(x + dash, x1), y0)], fill=colour, width=width)
        draw.line([(x, y1), (min(x + dash, x1), y1)], fill=colour, width=width)
    for y in range(int(y0), int(y1), dash * 2):
        draw.line([(x0, y), (x0, min(y + dash, y1))], fill=colour, width=width)
        draw.line([(x1, y), (x1, min(y + dash, y1))], fill=colour, width=width)


def room(rel, w, h):
    """The studio: dark greys so light text stays readable on top."""
    img = Image.new("RGB", (w, h), "#3a3733")
    d = ImageDraw.Draw(img)
    floor_y = int(h * 0.78)
    d.rectangle([0, floor_y, w, h], fill="#57504a")
    mirror = [int(w * 0.06), int(h * 0.10), int(w * 0.94), int(h * 0.72)]
    d.rectangle(mirror, fill="#494643")
    dashed_rect(d, mirror, "#7d7972")
    label(d, [int(w * 0.40), int(h * 0.12), mirror[2], int(h * 0.30)],
          ["PLACEHOLDER  " + rel, "mirror wall goes here, no barre in the photo"],
          "#a8a39b", start=int(w / 46))
    label(d, [0, int(h * 0.79), w, int(h * 0.86)], ["floorboards go here"], "#a8a39b", start=int(w / 60))
    save(img, rel)


def photo(rel, w, h, what):
    img = Image.new("RGB", (w, h), "#8f8b85")
    d = ImageDraw.Draw(img)
    dashed_rect(d, [20, 20, w - 20, h - 20], "#5f5b56")
    label(d, [0, 0, w, h], ["PLACEHOLDER", rel, what], "#1f1e1c", start=int(w / 26))
    save(img, rel)


def product(rel, hanger):
    """Transparent cut-out. With a hanger, the hook's top sits at the top centre,
    which is the point every piece hangs from."""
    w, h = 896, 1120
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    grey, line = (143, 139, 133, 255), (40, 38, 36, 255)
    top = 150 if hanger else 20
    if hanger:
        cx = w // 2
        d.arc([cx - 26, 4, cx + 26, 56], start=180, end=90, fill=line, width=8)
        d.line([(cx, 56), (cx, 96)], fill=line, width=8)
        d.line([(cx, 96), (70, top + 26)], fill=line, width=8)
        d.line([(cx, 96), (w - 70, top + 26)], fill=line, width=8)
    box = [40, top, w - 40, h - 20]
    d.rectangle(box, fill=grey)
    dashed_rect(d, box, (70, 67, 63, 255))
    name = os.path.basename(rel)
    label(d, box, ["PLACEHOLDER", "img/p/", name], (25, 24, 22, 255), start=44)
    save(img, rel)


def hand(rel, w, h, phrase):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    box = [3, 3, w - 4, h - 4]
    d.rectangle(box, fill=(154, 150, 143, 255))
    dashed_rect(d, box, (60, 57, 54, 255), width=3, dash=14)
    label(d, box, [rel, "“" + phrase + "”"], (22, 21, 20, 255), start=int(h / 3.4))
    save(img, rel)


def scrap(rel):
    img = Image.new("RGB", (600, 400), "#a39f98")
    d = ImageDraw.Draw(img)
    dashed_rect(d, [12, 12, 588, 388], "#5f5b56")
    label(d, [0, 0, 600, 400], ["PLACEHOLDER", rel, "blank paper scrap"], "#1f1e1c", start=30)
    save(img, rel)


HAND = {
    "logo": (560, 190),
    "hero.line": (1120, 240),
    "hero.line2": (440, 120),
    "rail.hint": (640, 80),
    "made.title": (880, 160), "tender.title": (880, 160), "wait.title": (880, 160),
}

room("img/studio.webp", 2400, 1500)
room("img/studio-mobile.webp", 1200, 2000)
photo("img/hands.webp", 1600, 1067, "hands sewing or tearing a patch")
photo("img/tender-001.webp", 1600, 1067, "the first one-off piece")

for p in SHOP["products"]:
    for c in p["colors"]:
        for v in p["views"]:
            product(f"img/p/{p['id']}-{c['id']}-{v}.webp", hanger=p["where"] != "bench")

for lang, strings in I18N["strings"].items():
    for key, (w, h) in HAND.items():
        if lang != I18N["fallback"] and key in I18N["handShared"]:
            continue
        sub = "" if lang == I18N["fallback"] else lang + "/"
        hand(f"img/hand/{sub}{key}.png", w, h, strings[key])

for n in range(1, 9):
    scrap(f"img/scraps/scrap-{n:02d}.webp")
