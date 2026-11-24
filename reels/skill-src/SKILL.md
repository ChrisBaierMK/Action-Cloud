---
name: chris-video-editing
description: "Chris Baier's house style and working procedure for vertical videos (Instagram Reels, TikToks, YouTube Shorts): how his reels are cut, his caption system (heavy sans plus an accent-colored italic serif, word-timed), sound and music rules, hooks and calls to action, and the tools that render it. Use this skill whenever Chris sends raw footage or a clip to edit, sends a Reel, TikTok or Short as a style reference, asks to cut, caption, add music to, measure, review or post a short video, or asks about his caption style, cutting rules, fonts, hooks or calls to action, even if he only says 'edit this' or drops a file with no explanation. It builds on the it-reelsmaker plugin and should be loaded together with it."
---

# Editing vertical videos for Chris

Chris films tutorials and venue pieces and wants them edited without a briefing each time. This skill holds what
was learned from his own best reels and from the references he chose: the rules (with the number behind each one),
the caption system built to match his references, the tool that measures a finished video, and the procedure.

The cutting pipeline itself (transcribe, cut by audio, render, master) belongs to the **it-reelsmaker** plugin.
Load that skill too and follow its steps; this skill supplies the choices its questions would otherwise ask for,
plus two things it does not have: the "editorial" caption system and the reference-measuring script.

## How Chris wants to work

He said it plainly: when a video arrives, start editing with no further explanation. So skip the style questions
and the plan-approval round, go to a first cut and render, and show the result together with the cut plan and the
numbers. He then gives revisions.

Three things still need his yes first, because they cannot be undone or cost money: anything paid (credits,
subscriptions, downloads with a price), publishing anywhere, and a fact shown on screen that has no source in his
own words. Ask those once, plainly, and keep working on everything else meanwhile.

His accounts:
- **chris.baier**: English, mountain-bike tutorials. His reference reel for cutting is "How to do a J-turn".
- **mk.1930.events**: Romanian, an event venue, a business account. Speech recognition is noticeably worse in
  Romanian than in English, so send him the caption text to proofread before the final render.

Talk to him like an advisor, not an assistant: lead with what he needs to hear, say how sure you are, and do not
agree by reflex. He reads on a phone, so keep replies short and send files instead of describing them.

## Before the first edit in a folder: the workspace

Everything below runs inside a workspace folder. If the project already has one (a folder containing
`it-reelsmaker.json`, `remotion/src/editorial/` and `tools/watch.py`, in his repository it is `reels/`), use it and
run `bash tools/bootstrap.sh` there if the container is fresh. Otherwise build one:

```bash
bash "<this skill's folder>/scripts/setup_workspace.sh" reels
```

It needs the it-reelsmaker plugin installed, ffmpeg, Node 22 or newer and Python 3.9 or newer. It creates the
folders, a Remotion project with the plugin's kit and our caption layer, a pinned HyperFrames install for its
measuring commands, the fonts, the face model and the two helper scripts, and ends with one line per part. If a
line says FAIL, fix that before editing; `references/lessons.md` lists the failures already met and their fixes.

## Raw footage arrives

Read `references/style-sheet.md` first (or the project's own `style-sheet.md` when it exists: the project copy is
newer and wins). Then follow the it-reelsmaker pipeline with these choices already made:

1. **Transcribe and find retakes** (`transcribe.py`, the plugin's step 3).
2. **Cut by audio**: ranges from `speech_mask.py`, then `cut.json`, `cut.py`, and `speech_mask.py --edl` must come
   back clean. Pacing, structure and the opening come from the style sheet, sections 2 and 5. The pattern that
   earned his best result: the finished result on screen inside the first second, one step said to camera, then
   footage of exactly that step, and a new framing every time the speaker returns.
3. **Faces, plan, export**: `faces.py scan`, `visual_plan.py init`, `brand.py export`, then
   `visual_plan.py export edit/<id> --remotion remotion --props edit/<id>/reelkit-props.json --subtitles none`.
   The kit's own subtitles are off because ours replace them.
4. **Captions**: `python3 tools/editorial.py words edit/<id>` lists every word with its index. Write
   `edit/<id>/editorial.json` (read `references/editorial-captions.md` for the fields and how to choose emphasis),
   then `python3 tools/editorial.py props edit/<id>`.
5. **Render**, from `remotion/`:
   `npx remotion render src/editorial/index.ts ReelEditorial out/<id>.mp4 --props=<absolute path>/edit/<id>/editorial-props.json`
6. **Master and check**: `master_audio.py` every time, then the checks in the style sheet, section 6.
7. **Deliver**: send the file with the cut plan and measured results (length, cuts, silence left, loudness), and say
   what you were unsure about. A defect you noticed and he did not ask about still gets named and fixed.

Brand fonts must be local files: create brands with `brand.py new ... --scan assets/fonts/Inter` so nothing is
fetched from a font server at render time.

## A reference video arrives (a link or a file)

He sends these to teach a style. Measure, do not guess:

1. Put the file in `assets/references/<id>/`, a new folder of its own. For links, `yt-dlp` works for most public
   Instagram posts but hits an anonymous rate limit: wait 45 seconds between tries and stop after four. YouTube
   refuses cloud servers outright; ask him for the file.
2. `python3 tools/watch.py assets/references/<id>/<file>.mp4 --id <id>` gives cuts, shot lengths, faces and
   layouts, speech rate and pauses, loudness, a music-bed estimate, and contact sheets at two frames per second.
3. Read every sheet from start to end. Captions, graphics and how a shot was framed are read from frames; an exact
   text size comes from thresholding the text pixels in a full-resolution still.
4. Tell him what the video does in numbers, and how it differs from the current style sheet. Change the style
   sheet only when he says the video is a style reference, and say what changed.

A reference shows what that video does, not what performs. Say so when he treats a look as a reason for reach:
the caption references he chose had 40 to 241 likes, his own plainly captioned tutorial had 12,230.

## Music and sound

Both of his reference reels carry a music bed, and in both the cuts follow speech and action, not the beat. Use
music as a bed and a mood: 18 to 24 dB under the voice, lifted in stretches with no talking, down again just
before the next word. Only use a track he holds a license for; for a business account, platform libraries are
restricted and cleared for that platform only. With no licensed track, deliver without music and say so.
Details and levels: style sheet, section 4.

## Posting

Nothing is posted without his yes on that specific video. Before offering to post, check what is connected in
the session; do not assume. What was true when this skill was written (24 November 2026):
- TikTok can be published through the Higgsfield connector, where he confirms in a publish window himself. Send
  the first video of a newly connected account as a draft, because the connection does not show which account it is.
- Instagram needs a publishing connector such as Buffer, and automatic Reels publishing needs a professional
  Instagram account linked to a Facebook Page.
- A video posted through a connector cannot use a platform's in-app music. When a reel needs an in-app sound,
  deliver the file and let him post it by hand.

## Keeping this skill true

Rules change when he revises an edit. Write each revision into the project's `style-sheet.md` with its date and
his words, so the next edit in that project already follows it. The copy inside this skill only changes when the
skill is rebuilt and he saves the new file to his profile. The rebuild script is `tools/build_skill.sh` in the
`reels/` workspace of his Action Cloud site repository, which is where the skill's sources live. Offer a rebuild
after a batch of revisions.

## Reference files

| File | Read it when |
|---|---|
| `references/style-sheet.md` | before every edit: the rules with their numbers and sources |
| `references/editorial-captions.md` | writing `editorial.json`: fields, a worked example, choosing emphasis |
| `references/research-rule-sheet.md` | he asks why a rule exists or how solid it is; judging a rule not in the style sheet |
| `references/lessons.md` | setup or a render fails, a download is refused, or a tool behaves oddly |
