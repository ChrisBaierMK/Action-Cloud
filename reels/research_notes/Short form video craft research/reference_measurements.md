# First-hand measurements of reference videos (24 November 2026)

These notes are primary evidence: the files were downloaded and measured in this workspace with `tools/watch.py`
(cut detection by HyperFrames `measure cuts`, checked against a clip with known cuts; speech by faster-whisper medium;
loudness by ffmpeg ebur128; faces by YuNet; text sizes by thresholding pixels in full-resolution frames). Evidence
grade: **measured**, unless a line says "read from frames" (a visual reading) or "inferred".

Sample: 5 Instagram Reels and 1 YouTube Short's metadata. It is a tiny, hand-picked sample chosen by the account
owner as style references. It shows what these specific videos do; it is not evidence about what performs in general.

## The videos

| id | account | role given by the owner | length | likes | comments |
|---|---|---|---|---|---|
| DZ3Hwu9oBBP | chris.baier (the owner's own reel, MTB tutorial "How to do a J-turn") | cutting reference | 24.9 s | 12,230 | 495 |
| DSA-ilwjK07 | mk.1930.events (the owner's own venue, Romanian) | cutting reference | 96.8 s | 347 | 8 |
| DaCq7dmIIl8 | unknown | cutting reference | not downloaded: Instagram's anonymous rate limit / login wall on 5 attempts | | |
| DehuY5rM32a | nrth.media (office chair, sponsored) | caption reference | 36.1 s | 40 | 7 |
| DTarmMwkXqn | nrth.media (music library, sponsored) | caption reference | 26.4 s | 104 | 35 |
| DfFq-QZBIsl | nrth.media (ND filters, sponsored) | caption reference | 30.6 s | 241 | 17 |
| fTauJDVaUBw | YouTube Short, David Roberts, "How Claude edits all my Reels: the full system" | first reference | file not obtainable (YouTube bot wall); 8,848 views, 324 likes, 175 comments, 3 preview frames and the description read | | |

Like and comment counts are as returned by Instagram on the download date. Note the caption references have low
engagement (40-241 likes): they were picked for how they look, not for reach.

## Measured numbers

| id | cuts | cuts per 10 s | shot min / median / max (s) | face on screen | speech (words/s while speaking) | pauses > 0.25 s | first sentence length | loudness (LUFS / true peak dBFS) | fps |
|---|---|---|---|---|---|---|---|---|---|
| DZ3Hwu9oBBP | 10 | 4.01 | 0.60 / 2.70 / 4.60 | 42% | 3.40 | 5 (longest 2.88 s) | 1.4 s | -14.2 / -0.8 | 29.97 |
| DSA-ilwjK07 | 47 | 4.86 | 0.30 / 1.47 / 12.73 | 64% | 2.64 | 9 (longest 0.62 s) | 7.5 s | -14.8 / -0.6 | 30 |
| DehuY5rM32a | 13 | 3.60 | 0.33 / 2.15 / 8.42 | 24% | 4.06 | 2 (longest 0.38 s) | 2.1 s | -14.2 / -0.6 | 24 |
| DTarmMwkXqn | 11 | 4.16 | 0.08 / 1.71 / 7.51 | 51% | 3.69 | 2 (longest 0.30 s) | 3.3 s | -14.3 / -0.5 | 23.976 |
| DfFq-QZBIsl | 11 | 3.60 | 1.21 / 2.35 / 4.71 | 20% | 3.56 | 1 (longest 0.38 s) | 2.5 s | -14.2 / -0.3 | 24 |

- All five masters sit at -14.2 to -14.8 LUFS integrated with true peaks of -0.3 to -0.8 dBFS.
- Cut rate across all five: 3.6 to 4.9 cuts per 10 seconds; median shot 1.5 to 2.7 s.
- Both of the owner's reels have a clear music bed under the voice (level between words well above silence). In the
  three nrth.media reels speech is cut so tight (no gap of 0.4 s) that the bed cannot be measured by this method.
- Caveat on cut counts: the detector finds hard cuts by frame difference. A jump cut inside one locked-off framing
  with no reframing can be missed, so counts are a floor for talking-head sections.

## First and last lines (as transcribed)

- DZ3Hwu9oBBP: opens "How to do a J-turn." (1.4 s); ends "If you want to learn more stuff like this, comment MTB down below."
- DSA-ilwjK07: opens (Romanian) "A venit momentul să vă povestesc de la ce și de unde a început MK1930." (7.5 s); ends with an invitation to hold the event at the venue.
- DehuY5rM32a: opens "This is the LiberNovo Maxis Airflow." (2.1 s); ends "If you're tall and at your desk all day, comment the word Maxis and I'll send you the link."
- DTarmMwkXqn: opens "This is one of the best music and sound effects libraries out there." (3.3 s); ends "...there's only 500 spots available at their special launch price, so comment the word assets and I'll send you the link."
- DfFq-QZBIsl: opens "This is Kondor Blue's FullSpec ND." (2.5 s); ends "Comment the word FullSpec and I'll send you the link."
- All four English reels end on a comment-a-keyword call to action. All three nrth.media reels open with "This is <the thing>".

## Cutting pattern in the owner's own reels (read from frames, 2 frames per second)

- DZ3Hwu9oBBP (12,230 likes): the speaker says the title to camera for half a second, and the picture cuts at 0.5 s to
  the finished trick, so the payoff is on screen inside the first second. Then a strict alternation: one numbered
  step said to camera ("First...", "Second...", "Third...", with fingers held up), then a cut to the action that shows
  exactly that step, then back to the speaker in a NEW position and framing. No two speaker shots share a framing,
  so there are no visible jump cuts. Cuts fall on phrase boundaries. Small white sentence-case captions, one phrase
  of 4-6 words per line, at about two thirds of the frame height.
- DSA-ilwjK07: opens on action (the speaker chops wood while talking), moves to a seated talking section with cuts
  every 1-1.5 s and small reframings (median punch-in between neighboring shots x1.10), and inserts B-roll as a
  horizontal band across the middle of the frame while the speaker stays visible above and below. Small all-caps
  serif captions building word by word on one line at mid-frame.

## Caption system in the three nrth.media references (measured at 1080x1920 unless noted)

- Two typefaces. A heavy grotesque with tight tracking for almost everything, and a condensed italic serif for the
  words that carry the meaning. Rendered side by side with the reference frames, Inter Black (tracking about
  -0.045 em) and Instrument Serif Italic are close matches (inferred: a visual match, not a font-file identification).
  Both are SIL Open Font License and cover Romanian and German glyphs (checked in the font files).
- One accent color per video, used only on the serif words: red (median RGB 230,78,77 = #E64E4D) in the chair video,
  light blue in the ND-filter video, where it matches the sponsor's brand color. All other text is white over footage
  or near-black (#272428) on light cards.
- Hook: a stacked, centered block in the middle of the frame (measured y 690-1227, 5 lines, line pitch about 107 px,
  block about 676 px wide), one beat per line, sans and serif lines alternating, each word arriving as it is spoken.
  Sans about 130 px. The January 2026 reference uses the same stacked hook in sans only, on the speaker's chest.
- Running captions: 1 to 4 words at a time, sentence case, semi-bold sans about 48 px, centered at y about 1174
  (61% of the height). An emphasized word drops to its own line below in the accent serif.
- Callouts for key lines: 2-3 stacked lines, bold sans 76-82 px, never wider than about 860 px, centered at y about
  1180; the spoken call to action is set larger, about 104 px with a line pitch of about 115 px.
- Call-to-action pill: a black pill near the top third (center y about 603) with an accent disc 145 px across holding
  a comment icon, then the keyword in caps (cap height 54 px); it later switches to a send icon and "In your DMs".
- Light cards for a number or a product name: background #F2F0F3, a small caps label with wide tracking (cap height
  28 px), a big line (figures 108 px tall, about 148 px font size) and a second line (about 70 px).
- A spec list of five rows at the top (first row at y about 303, row pitch about 83 px), number in bold sans and label
  in italic serif, rows arriving one at a time.
- Motion: words arrive with a short blur that clears (visible as blurred words in single frames); blocks leave with a
  quick fade. No outlines, no boxes behind text, no bouncing.
- No text sits in the bottom quarter of the frame in any of the three.

## The first reference's stated system (from its public description and the creator's linked document)

The Short describes a "video factory": Claude Code plus Whisper (word timestamps), FFmpeg (cuts, joins, loudness),
HyperFrames (captions and motion graphics as code), yt-dlp (download reference videos) and Klint AI (the creator's
own paid product for finding viral posts). Steps: install the tools, make sources/assets/edit folders, teach the
style from 3-5 reference Reels measured with real numbers, find ideas among posts with at least double the creator's
normal views, write the script, film, then an edit that cuts silences, shows a numbered edit plan for approval before
rendering, and runs checks before delivery. The author is a co-founder of Klint AI: the free system is also marketing
for that product. Its three readable frames show a tight face shot with one-word white captions on the chest, and a
split layout with a light grid-paper graphic panel above the speaker.

## Toolchain verified in this workspace (each step run and its output checked)

- Transcription with word timings: faster-whisper medium, 17 s of speech in 13.6 s on 4 CPU cores.
- Cutting by audio: a 17.2 s spoken test clip cut to 11.0 s; all cut edges passed the audio edge check.
- Rendering: Remotion 4.0.526 rendered an 11 s 1080x1920 video in 38 s (about 9 frames per second); HyperFrames 0.9.88
  rendered a 3 s test in 8 s. Both needed two fixes to run in a cloud container: fonts and scripts stored locally
  instead of fetched from Google Fonts / a CDN, and the pre-installed headless Chrome instead of a downloaded one.
- Mastering: -16.9 LUFS in, -13.9 LUFS and -2.2 dBFS true peak out, confirmed with an independent ffmpeg measurement.
- Downloading references from a cloud server: YouTube refused every request ("Sign in to confirm you're not a bot");
  Instagram allowed 5 of 6 anonymous downloads after spaced retries and refused one persistently.
