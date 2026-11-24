# Reels workspace: how to edit for Chris

This folder turns raw footage into finished vertical videos, and measures reference videos to keep the style
honest. It lives on the branch `claude/cool-archimedes-h9y6sw` of the Action Cloud site repository and is not part of
the site (`_redirects` answers "not found" for `/reels/*`). Media, models and `node_modules` are not in git.

Standing instruction from Chris (24 November 2026): when a video arrives, start editing without asking for an
explanation. So: no style questions, no plan approval round. Go to a first cut and render, then show the result
together with the cut plan, and take revisions from there. Still ask first before anything that costs money,
before publishing anywhere, and when a fact shown on screen has no source.

## First thing in a fresh container

```bash
cd reels && bash tools/bootstrap.sh
```

It installs yt-dlp, faster-whisper and the speech model, the Remotion and HyperFrames packages, and copies the
fonts. It ends with a line per tool. The editing skill is the installed plugin `it-reelsmaker`; its scripts are run
from this folder (`it-reelsmaker.json` points them here).

## What is where

| Path | What |
|---|---|
| `style-sheet.md` | the rules, a number for each, with where the number comes from. Read it before every edit |
| `sources/` | raw footage (not in git) |
| `assets/fonts/` | Inter, Manrope, Montserrat, Instrument Serif with their Open Font License files |
| `assets/references/` | downloaded reference videos, one folder each (not in git; other people's content) |
| `refs/<id>/measure.json` | the measurements of each reference; sheets and frames next to it are not in git |
| `edit/<id>/` | one folder per video: `cut.json`, `editorial.json`, plans, the rough cut |
| `brands/<slug>/` | brand profiles of the editing skill |
| `remotion/` | render project: the skill's kit plus our caption system in `src/editorial/Editorial.tsx` |
| `hf/` | HyperFrames: its renderer and the `measure` and `audio` commands |
| `tools/watch.py` | measure a finished video: cuts, faces, speech, loudness, contact sheets |
| `tools/editorial.py` | list caption words with indexes; merge `editorial.json` into render props |
| `research_notes/`, `reports/` | the web research of 24 November 2026 and its report |

## A reference video arrives (a link or a file)

1. Get the file into `assets/references/<id>/` (its own new folder).
   Instagram: `yt-dlp` works anonymously for most public posts but hits a rate limit; wait 45 s between tries, stop
   after four. YouTube refuses cloud servers ("Sign in to confirm you're not a bot"): ask Chris for the file, or use
   Higgsfield's video analysis by link, which costs credits and needs his yes.
2. `python3 tools/watch.py assets/references/<id>/<file>.mp4 --id <id>`
3. Read the sheets in `refs/<id>/sheets/` from start to end. For an exact text size, threshold the text pixels in a
   full-resolution still, or on a flat background use `npx hyperframes measure ink` from `hf/`.
4. Change `style-sheet.md` only when Chris says the video is a style reference, and say what changed.

## Raw footage arrives

Follow the `it-reelsmaker` skill's pipeline with these choices already made:

1. `transcribe.py edit/<id> sources/<file>`; find retakes and slips (skill step 3).
2. Cut by audio: `speech_mask.py` for the ranges, `cut.json`, `cut.py`, then `speech_mask.py --edl` must be clean.
   Pacing and structure come from `style-sheet.md` sections 2 and 5.
3. `faces.py scan`, `visual_plan.py init`, `brand.py export`, `visual_plan.py export --subtitles none --props`.
4. Captions in our system: `python3 tools/editorial.py words edit/<id>`, write `edit/<id>/editorial.json`
   (hook lines, emphasis, callouts, cards, the keyword pill), `python3 tools/editorial.py props edit/<id>`.
5. `cd remotion && npx remotion render ReelEditorial out/<id>.mp4 --props=<absolute path>/edit/<id>/editorial-props.json`
6. `master_audio.py` (always), the checks in `style-sheet.md` section 6, then send the file with the cut plan and
   the numbers: length, cuts, silence left, loudness.

Music: only a track Chris has a license for, or leave the bed out and let him add one from the app's library at
upload. `master_audio.py --music <track> --duck A-B` mixes and ducks it.

## Things learned the hard way here

- The kit loads fonts from Google's servers by default. Brands must use local font files (`brand.py new --scan
  assets/fonts/<Family> ...`), and `Editorial.tsx` loads its own from `remotion/public/fonts/`.
- `remotion.config.ts` points Remotion at the container's pre-installed headless Chrome.
- HyperFrames compositions must load GSAP from `hf/node_modules/gsap/dist/gsap.min.js` copied next to them, not
  from the CDN the scaffold writes. Never run `hyperframes audio --quality best`, `reverse`, `share` or `publish`
  without Chris's yes: they upload to HeyGen and may bill.
- faster-whisper's own file decoder fails with the installed PyAV; pass it samples (see `watch.py`).
- A frame-difference cut detector misses a jump cut inside one locked-off framing. Cut counts are a floor.
- Whisper's word edges drift by up to 0.8 s. Cut edges come from the audio, never from the transcript.
