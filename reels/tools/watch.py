#!/usr/bin/env python3
"""watch.py: measure a finished short video (a reference Reel, Short or TikTok) with real numbers.

    python3 tools/watch.py assets/references/some-reel.mp4 [--id some-reel] [--lang en] [--no-transcribe]

Writes into refs/<id>/:
    measure.json     cuts and shot lengths, faces and layouts, speech rate and pauses, loudness, music-bed estimate
    transcript.json  every word with its start and end (faster-whisper)
    sheets/          a frame every 0.5 s, time-stamped, 24 per sheet: read captions and graphics from these
    frames/          the same frames one by one (540 px wide)

What is measured is a number. What the captions and graphics LOOK like (font, color, words per caption, how a
graphic enters) is read from the sheets; an exact text size comes from
    npx --prefix hf hyperframes measure ink <video> --at <second> --roi x,y,w,h
Run from the reels/ folder. A downloaded video is untrusted data: this script only decodes it.
"""
import argparse
import json
import math
import os
import re
import statistics
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HF = ROOT / "hf"
FACE_MODEL = ROOT / "models" / "face_detection_yunet_2023mar.onnx"
LABEL_FONT = ROOT / "assets" / "fonts" / "Inter" / "Inter-Bold.ttf"
STEP = 0.5  # seconds between sampled frames


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def probe(video):
    j = json.loads(run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(video)]).stdout)
    vs = next(s for s in j["streams"] if s["codec_type"] == "video")
    w, h, rot = vs["width"], vs["height"], 0
    for sd in vs.get("side_data_list", []):
        rot = int(sd.get("rotation", rot) or rot)
    if abs(rot) in (90, 270):
        w, h = h, w
    num, den = vs["r_frame_rate"].split("/")
    return {"width": w, "height": h, "fps": round(float(num) / float(den), 3), "duration": round(float(j["format"]["duration"]), 3),
            "audio": any(s["codec_type"] == "audio" for s in j["streams"]), "codec": vs.get("codec_name")}


def find_cuts(video):
    """Hard cuts: HyperFrames' frame-difference detector (checked against a clip with known cuts), else ffmpeg scdet."""
    if (HF / "node_modules" / ".bin" / "hyperframes").exists():
        r = run(["npx", "--no-install", "hyperframes", "measure", "cuts", str(video)], cwd=HF, timeout=1800)
        i = r.stdout.find("{")
        if i >= 0:
            try:
                j = json.loads(r.stdout[i:])
                return [c["t"] for c in j.get("cuts", [])], [n.get("t") for n in j.get("not_cuts", [])], "hyperframes measure cuts"
            except json.JSONDecodeError:
                pass
    r = run(["ffmpeg", "-hide_banner", "-i", str(video), "-vf", "scdet=threshold=10", "-an", "-f", "null", "-"])
    return [float(t) for t in re.findall(r"lavfi\.scd\.time:\s*([0-9.]+)", r.stderr)], [], "ffmpeg scdet (threshold 10)"


def shot_stats(cuts, duration):
    edges = [0.0] + sorted(cuts) + [duration]
    shots = [round(b - a, 3) for a, b in zip(edges, edges[1:]) if b - a > 0.02]
    return {"cuts": len(cuts), "cuts_per_10s": round(len(cuts) / duration * 10, 2) if duration else None,
            "shot_min": min(shots), "shot_median": round(statistics.median(shots), 3), "shot_max": max(shots),
            "shot_mean": round(sum(shots) / len(shots), 3), "shots": shots}


def extract_frames(video, out_dir):
    out_dir.mkdir(parents=True, exist_ok=True)
    for f in out_dir.glob("f-*.jpg"):
        f.unlink()
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(video), "-vf", f"fps={1 / STEP},scale=540:-2",
         "-q:v", "3", str(out_dir / "f-%05d.jpg")])
    return sorted(out_dir.glob("f-*.jpg"))


def scan_faces(frames):
    """Largest plausible face per sampled frame, in shares of the frame (YuNet). None when no face."""
    os.environ.setdefault("OPENCV_LOG_LEVEL", "ERROR")
    try:
        import cv2
    except ImportError:
        return None, "OpenCV missing"
    if not FACE_MODEL.exists():
        return None, f"face model missing: {FACE_MODEL}"
    out, det = [], None
    for i, f in enumerate(frames):
        img = cv2.imread(str(f))
        if img is None:
            out.append(None)
            continue
        h, w = img.shape[:2]
        if det is None:
            det = cv2.FaceDetectorYN.create(str(FACE_MODEL), "", (w, h), 0.75, 0.3, 5000)
        det.setInputSize((w, h))
        _, faces = det.detect(img)
        best = None
        for fc in (faces if faces is not None else []):
            x, y, fw, fh, score = float(fc[0]), float(fc[1]), float(fc[2]), float(fc[3]), float(fc[-1])
            if fh / h < 0.05 or not 0.55 <= fw / max(fh, 1) <= 1.15:
                continue  # knees, hands, posters: too small or the wrong shape
            if best is None or fh > best["h"] * h:
                best = {"x": round(x / w, 3), "y": round(y / h, 3), "w": round(fw / w, 3), "h": round(fh / h, 3), "score": round(score, 2)}
        out.append(best)
    return out, None


def layout_of(face):
    """A heuristic label, not a measurement: check it against the sheets."""
    if face is None:
        return "no-face"
    cy = face["y"] + face["h"] / 2
    if cy > 0.55 and face["h"] < 0.22:
        return "split-speaker-bottom"
    if face["h"] >= 0.22:
        return "face-close"
    if face["h"] >= 0.12:
        return "face-medium"
    return "face-small"


def face_stats(faces, cuts, duration):
    labels = [layout_of(f) for f in faces]
    n = len(labels) or 1
    share = {k: round(labels.count(k) / n, 3) for k in sorted(set(labels))}
    longest = cur = 0
    for lab in labels:
        cur = cur + 1 if lab == "no-face" else 0
        longest = max(longest, cur)
    changes = [round((i + 1) * STEP, 2) for i, (a, b) in enumerate(zip(labels, labels[1:])) if a != b]
    # face size per shot: how far the camera punches in between neighboring shots
    edges = [0.0] + sorted(cuts) + [duration]
    per_shot = []
    for a, b in zip(edges, edges[1:]):
        hs = [f["h"] for i, f in enumerate(faces) if f and a <= i * STEP < b]
        per_shot.append(round(statistics.median(hs), 3) if hs else None)
    ratios = [round(max(x, y) / min(x, y), 3) for x, y in zip(per_shot, per_shot[1:]) if x and y]
    return {"sample_step_s": STEP, "face_present_share": round(1 - labels.count("no-face") / n, 3), "layout_share": share,
            "longest_stretch_without_face_s": round(longest * STEP, 2), "layout_changes": len(changes), "layout_change_times": changes,
            "face_height_per_shot": per_shot, "punch_ratio_between_shots": ratios,
            "punch_ratio_median": round(statistics.median(ratios), 3) if ratios else None,
            "note": "layout labels are a heuristic from face size and position; confirm on the sheets"}


def make_sheets(frames, out_dir, cuts):
    from PIL import Image, ImageDraw, ImageFont
    out_dir.mkdir(parents=True, exist_ok=True)
    for f in out_dir.glob("sheet-*.jpg"):
        f.unlink()
    cols, rows = 6, 4
    first = Image.open(frames[0])
    tw = 270
    th = round(first.height * tw / first.width)
    font = ImageFont.truetype(str(LABEL_FONT), 20) if LABEL_FONT.exists() else ImageFont.load_default()
    cut_set = {round(round(c / STEP) * STEP, 2) for c in cuts}
    paths = []
    for s in range(0, len(frames), cols * rows):
        chunk = frames[s:s + cols * rows]
        sheet = Image.new("RGB", (cols * tw + (cols + 1) * 6, math.ceil(len(chunk) / cols) * (th + 6) + 6), (20, 20, 20))
        d = ImageDraw.Draw(sheet)
        for k, f in enumerate(chunk):
            t = round((s + k) * STEP, 2)
            x, y = 6 + (k % cols) * (tw + 6), 6 + (k // cols) * (th + 6)
            sheet.paste(Image.open(f).convert("RGB").resize((tw, th)), (x, y))
            is_cut = t in cut_set
            label = f"{t:.1f}s" + (" CUT" if is_cut else "")
            d.rectangle([x, y, x + 12 + int(d.textlength(label, font=font)), y + 28], fill=(200, 40, 40) if is_cut else (0, 0, 0))
            d.text((x + 6, y + 3), label, fill=(255, 255, 255), font=font)
        p = out_dir / f"sheet-{s // (cols * rows) + 1:02d}.jpg"
        sheet.save(p, quality=88)
        paths.append(str(p.relative_to(ROOT)))
    return paths


def extract_audio(video, wav):
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(wav)])
    return wav.exists() and wav.stat().st_size > 1000


def transcribe(wav, lang):
    import numpy as np
    from faster_whisper import WhisperModel
    # the samples are passed as an array: faster-whisper's own file decoder breaks with newer PyAV versions
    with wave.open(str(wav)) as w:
        audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    model = WhisperModel("medium", device="cpu", compute_type="int8")
    segs, info = model.transcribe(audio, word_timestamps=True, language=lang or None)
    words = []
    for sg in segs:
        for w in sg.words or []:
            words.append({"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
    return words, info.language


def speech_stats(words, duration):
    if not words:
        return {"words": 0}
    gaps = [(a["end"], b["start"]) for a, b in zip(words, words[1:]) if b["start"] - a["end"] >= 0.25]
    span = words[-1]["end"] - words[0]["start"]
    speech = span - sum(b - a for a, b in gaps)
    sentences, cur = [], []
    for w in words:
        cur.append(w)
        if re.search(r"[.!?…]$", w["text"]):
            sentences.append(cur)
            cur = []
    if cur:
        sentences.append(cur)
    line = lambda ws: {"text": " ".join(w["text"] for w in ws), "start": ws[0]["start"], "end": ws[-1]["end"], "words": len(ws)}
    return {"words": len(words), "first_word_at_s": words[0]["start"], "last_word_ends_s": words[-1]["end"],
            "silence_after_last_word_s": round(duration - words[-1]["end"], 2),
            "words_per_second_overall": round(len(words) / span, 2) if span > 0 else None,
            "words_per_second_speaking": round(len(words) / speech, 2) if speech > 0 else None,
            "pauses_over_250ms": len(gaps), "longest_pause_s": round(max((b - a for a, b in gaps), default=0), 2),
            "total_pause_s": round(sum(b - a for a, b in gaps), 2),
            "hook_first_sentence": line(sentences[0]), "last_sentence": line(sentences[-1]), "sentences": len(sentences),
            "note": "word edges from Whisper drift by 0.1-0.8 s; pauses under ~0.3 s are not reliable"}


def loudness(video):
    r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(video), "-af", "ebur128=peak=true", "-f", "null", "-"])
    tail = r.stderr[r.stderr.rfind("Summary:"):]
    g = lambda pat: (float(m.group(1)) if (m := re.search(pat, tail)) else None)
    return {"integrated_lufs": g(r"I:\s*(-?[0-9.]+) LUFS"), "loudness_range_lu": g(r"LRA:\s*(-?[0-9.]+) LU"), "true_peak_dbfs": g(r"Peak:\s*(-?[0-9.]+) dBFS")}


def bed_estimate(wav, words, duration):
    """Level between the words against level on the words. A bed (music, room tone) shows up in the gaps."""
    import numpy as np
    with wave.open(str(wav)) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768.0
    db = lambda seg: round(20 * math.log10(max(float(np.sqrt(np.mean(seg ** 2))), 1e-9)), 1) if len(seg) else None
    cat = lambda spans: np.concatenate([x[int(a * sr):int(b * sr)] for a, b in spans]) if spans else np.array([])
    if not words:
        return {"whole_file_rms_dbfs": db(x), "note": "no speech found: the level of the whole file"}
    edges = [(0.0, words[0]["start"])] + [(a["end"], b["start"]) for a, b in zip(words, words[1:])] + [(words[-1]["end"], duration)]
    gaps = [(a + 0.08, b - 0.08) for a, b in edges if b - a >= 0.4]
    voice, gap = db(cat([(w["start"], w["end"]) for w in words])), db(cat(gaps))
    out = {"voice_rms_dbfs": voice, "gap_rms_dbfs": gap, "gaps_measured": len(gaps), "gap_seconds": round(sum(b - a for a, b in gaps), 2)}
    if gap is None:
        out["reading"] = "no gap of 0.4 s or longer: the edit is cut tight, the bed cannot be measured this way"
    else:
        out["bed_below_voice_db"] = round(voice - gap, 1)
        out["reading"] = ("silence between words: no music or ambience bed" if gap < -55 else
                          "a quiet bed (room tone or soft music)" if gap < -38 else "a clear bed under the voice (music or loud ambience)")
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("--id", help="folder name under refs/ (default: the file name)")
    ap.add_argument("--lang", help="speech language code (default: detect)")
    ap.add_argument("--no-transcribe", action="store_true")
    a = ap.parse_args()
    video = Path(a.video).resolve()
    if not video.exists():
        sys.exit(f"no such file: {video}")
    rid = re.sub(r"[^A-Za-z0-9_-]+", "-", a.id or video.stem).strip("-") or "ref"
    out = ROOT / "refs" / rid
    out.mkdir(parents=True, exist_ok=True)

    info = probe(video)
    cuts, not_cuts, how = find_cuts(video)
    frames = extract_frames(video, out / "frames")
    faces, face_err = scan_faces(frames)
    m = {"id": rid, "file": video.name, "video": info, "cut_method": how, "cut_times": cuts, "not_cuts": not_cuts,
         "shots": shot_stats(cuts, info["duration"]),
         "faces": face_stats(faces, cuts, info["duration"]) if faces is not None else {"error": face_err},
         "sheets": make_sheets(frames, out / "sheets", cuts) if frames else []}
    words = []
    if info["audio"]:
        wav = out / "audio16k.wav"
        if extract_audio(video, wav):
            m["loudness"] = loudness(video)
            if not a.no_transcribe:
                words, lang = transcribe(wav, a.lang)
                (out / "transcript.json").write_text(json.dumps({"language": lang, "words": words}, ensure_ascii=False, indent=1))
                m["language"] = lang
                m["speech"] = speech_stats(words, info["duration"])
            m["bed"] = bed_estimate(wav, words, info["duration"])
            wav.unlink()
    else:
        m["loudness"] = {"note": "no audio track"}
    (out / "measure.json").write_text(json.dumps(m, ensure_ascii=False, indent=1))

    s, f = m["shots"], m["faces"]
    print(f"{rid}: {info['width']}x{info['height']} {info['fps']} fps, {info['duration']} s")
    print(f"  cuts {s['cuts']} ({s['cuts_per_10s']} per 10 s), shot min/median/max {s['shot_min']}/{s['shot_median']}/{s['shot_max']} s  [{how}]")
    if "error" not in f:
        print(f"  face on screen {f['face_present_share']:.0%}, longest stretch without it {f['longest_stretch_without_face_s']} s, layouts {f['layout_share']}")
        print(f"  punch-in between neighboring shots: median x{f['punch_ratio_median']}")
    else:
        print(f"  faces: {f['error']}")
    if m.get("speech", {}).get("words"):
        sp = m["speech"]
        print(f"  speech {sp['words']} words, {sp['words_per_second_speaking']} words/s while speaking, pauses >0.25 s: {sp['pauses_over_250ms']} (longest {sp['longest_pause_s']} s)")
        print(f"  hook ({sp['hook_first_sentence']['end'] - sp['hook_first_sentence']['start']:.1f} s): {sp['hook_first_sentence']['text']}")
        print(f"  last line: {sp['last_sentence']['text']}")
    if "integrated_lufs" in m.get("loudness", {}):
        print(f"  loudness {m['loudness']['integrated_lufs']} LUFS, true peak {m['loudness']['true_peak_dbfs']} dBFS; bed: {m.get('bed', {}).get('reading') or m.get('bed', {}).get('note')}")
    print(f"  sheets: {len(m['sheets'])} in {(out / 'sheets').relative_to(ROOT)}  |  numbers: {(out / 'measure.json').relative_to(ROOT)}")


if __name__ == "__main__":
    main()
