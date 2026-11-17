#!/usr/bin/env python3
"""Writes an 800 px wide copy of every picture in assets/img to assets/img/s (used by srcset on phones).

Run after adding or replacing a picture:  python3 tools/thumbs.py     (needs Pillow)
"""
import glob
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "img")
OUT = os.path.join(SRC, "s")
os.makedirs(OUT, exist_ok=True)
for path in sorted(glob.glob(os.path.join(SRC, "*.webp"))):
    name = os.path.basename(path)
    if name.startswith("logo-"):
        continue
    im = Image.open(path).convert("RGB")
    im.resize((800, round(800 * im.size[1] / im.size[0])), Image.LANCZOS).save(os.path.join(OUT, name), quality=78, method=6)
    print("wrote", os.path.join("assets", "img", "s", name))
