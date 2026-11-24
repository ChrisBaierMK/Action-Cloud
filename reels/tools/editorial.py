#!/usr/bin/env python3
"""editorial.py: the two small steps between the kit's export and a render in our caption style.

    python3 tools/editorial.py words edit/<id>     # every caption word with its index and time: write the spec from these
    python3 tools/editorial.py props edit/<id>     # reelkit-props.json + editorial.json -> editorial-props.json

edit/<id>/editorial.json holds the spec (fields: remotion/src/editorial/Editorial.tsx, EditorialSpec). It addresses words
by index, so text lands on the spoken word. Run `words` again after any re-cut: the indexes move with the cut.
Then: cd remotion && npx remotion render ReelEditorial out/<name>.mp4 --props=<absolute path>/edit/<id>/editorial-props.json
"""
import json
import sys
from pathlib import Path


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ("words", "props"):
        sys.exit(__doc__)
    edit = Path(sys.argv[2])
    if sys.argv[1] == "words":
        cap = json.loads((edit / "captions.json").read_text())
        seg = None
        for i, w in enumerate(cap["words"]):
            if w.get("seg") != seg:
                seg = w.get("seg")
                print(f"--- segment {seg}")
            print(f"{i:4d}  {w['start']:7.2f}-{w['end']:<7.2f} {w['text']}")
        return
    props = json.loads((edit / "reelkit-props.json").read_text())
    spec_file = edit / "editorial.json"
    spec = json.loads(spec_file.read_text()) if spec_file.exists() else {}
    n = len(props["captions"]["words"])
    used = list(spec.get("emphasis", []))
    used += [i for line in spec.get("hook", {}).get("lines", []) for i in line]
    used += [i for c in spec.get("callouts", []) for i in c["words"]]
    used += [i for c in spec.get("cards", []) for i in (c["fromWord"], c["toWord"])]
    if "cta" in spec:
        used += [spec["cta"][k] for k in ("atWord", "thenAtWord", "untilWord") if k in spec["cta"]]
    bad = sorted({i for i in used if not 0 <= i < n})
    if bad:
        sys.exit(f"editorial.json points at word indexes that do not exist (the cut has {n} words): {bad}. Run `words` again.")
    props["editorial"] = spec
    props["subtitles"] = "none"
    props["hook"] = None
    out = edit / "editorial-props.json"
    out.write_text(json.dumps(props, ensure_ascii=False))
    print(f"{out}: {n} words, spec keys {sorted(spec)}")


if __name__ == "__main__":
    main()
