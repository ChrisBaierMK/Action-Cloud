# Style sheet (draft 1, 24 November 2026: not yet approved by Chris)

Every rule has a number and says where the number comes from:
**measured** = measured in a reference file in this workspace (`refs/<id>/measure.json`, method in
`research_notes/Short form video craft research/reference_measurements.md`);
**research** = from the web research notes, which rest on search summaries and are mostly vendor or practitioner
claims; **choice** = my decision where nothing better exists. A revision from Chris becomes a rule here, with its date.

References: cutting from Chris's own reels (chris.baier `DZ3Hwu9oBBP`, 12,230 likes; mk.1930.events `DSA-ilwjK07`);
captions from three nrth.media reels (`DehuY5rM32a`, `DTarmMwkXqn`, `DfFq-QZBIsl`). A sixth link (`DaCq7dmIIl8`)
could not be downloaded. Five videos are a style sample, not proof of what performs.

## 1. Format

| Rule | Value | Source |
|---|---|---|
| Canvas | 1080 x 1920, H.264, AAC 48 kHz | measured (all five) |
| Frame rate | 30 fps (the render kit's rate); Chris's own reels are 30, the caption references 24 | measured / choice |
| Length | tutorial 20-35 s; story or venue piece up to 90 s | measured: 24.9-36.1 s and 96.8 s |

## 2. Cutting

| Rule | Value | Source |
|---|---|---|
| Cut rate | 3.6 to 4.9 cuts per 10 s | measured (all five) |
| Median shot | 1.5 to 2.7 s | measured |
| Longest speaker shot, tutorial | 4.6 s | measured `DZ3Hwu9oBBP` |
| Longest shot, story piece | 12.7 s, once | measured `DSA-ilwjK07` |
| Silence left between phrases | 0.3 s at most, unless action footage and music fill the gap | measured: longest pauses 0.30-0.62 s; the one 2.88 s gap is covered by action |
| Speaking rate after the edit | 3.4-4.1 words/s English, about 2.6 words/s Romanian; no speed-up beyond x1.15 | measured / choice |
| Reframe between neighboring speaker shots | x1.05 to x1.10 | measured medians 1.052-1.099 |
| Face on screen | 20-64% of the time; never hidden longer than 9.5 s | measured |

Structure for a tutorial, read from `DZ3Hwu9oBBP` frame by frame:
1. Title line to camera in 1.5 s or less. The finished result is on screen by 0.5 s.
2. One step said to camera, then a cut to footage that shows exactly that step, then back to the speaker.
3. Every return to the speaker uses a new position or framing. Two speaker shots with the same framing never sit
   next to each other, which is why there are no visible jump cuts.
4. Steps are numbered out loud. Cuts fall on phrase boundaries.

Structure for a story piece, read from `DSA-ilwjK07`: open on an action while talking, then a seated section with a
cut every 1-1.5 s and small reframes; B-roll as a horizontal band across the middle of the frame with the speaker
still visible above and below.

## 3. Captions: the "editorial" system (`remotion/src/editorial/Editorial.tsx`)

| Element | Value | Source |
|---|---|---|
| Main face | Inter, Black 900, tracking -0.045 em, sentence case | measured sizes; font is a visual match, not a file identification |
| Accent face | Instrument Serif Italic, set about 1.2x the sans beside it | same |
| Accent color | one per video, on serif words only. Reference red #E64E4D; the references switch it to the sponsor's brand color | measured |
| Other colors | white over footage; ink #272428 on light cards; card field #F2F0F3; pill #0E0E0F | measured |
| Hook | stacked centered block, middle of frame (y 690-1227), one beat per line, sans and serif lines mixed, sans about 130 px, line pitch about 107 px, block about 676 px wide | measured |
| Running captions | 1-3 words (4 at most), semi-bold 600, 48 px, centered at y 1174 (61%). An emphasized word drops to its own serif line below | measured |
| Callout for a key line | 2-3 stacked lines, 76-82 px, at most 860 px wide, centered at y 1180 | measured |
| Spoken call to action | about 104 px, line pitch about 115 px | measured |
| Keyword pill | black pill, center y 603, accent disc 145 px with a comment icon, keyword in caps (cap height 54 px); switches to a send icon and "In your DMs" | measured |
| Light card | small caps label (cap height 28 px, tracking 0.16 em), big line about 148 px, second line about 70 px | measured |
| Motion | each word arrives on its spoken time with a blur that clears in 5-7 frames; blocks leave with a 4-5 frame fade. No outline, no box behind text, no bounce | read from frames / choice for the frame counts |
| Where text may sit | nothing below y 1330; nothing in the right 120 px; lists start at y 303 or lower | measured: no reference puts text in the bottom quarter |

Open point for Chris: 48 px running captions are what the references use, and they are small. Tool vendors
recommend 60-75 px (research). First real edit: render both and pick.

Emphasis rule (choice, from how the references use it): at most one serif word per caption and about one per 2-3
seconds; pick the word that carries the meaning (the product, the number, the result), never a filler word.

## 4. Sound

| Rule | Value | Source |
|---|---|---|
| Master loudness | -14 LUFS integrated | measured: references -14.2 to -14.8; research: only YouTube documents -14 |
| True peak | -1 dBFS at most | choice; references peak at -0.3 to -0.8 |
| Music bed under speech | 18-24 dB below the voice | research (practitioner range); both of Chris's reels carry a clear bed |
| Music where nobody speaks | may rise to 6-9 dB below the voice level for an action passage, back down 0.3 s before the next word | choice |
| Sound effects | at most one per 2-3 s, 12-18 dB below voice peaks, on a visible event only | choice (editing skill default); research found nothing measured |
| Music source | licensed only: the platform's own library added at upload, or a paid library whose license covers commercial use | research: TikTok and Instagram both restrict business accounts |

Measured on both of Chris's reels: the beat detector finds no steady beat in the mix. The cuts follow speech and
action, not the music. Music is a bed and a mood, plus lifts in the gaps.

## 5. Opening and ending

| Rule | Value | Source |
|---|---|---|
| First sentence | 2.5 s or less | measured: 1.4-3.3 s in the four English references; the 7.5 s opening is the outlier |
| Result or product on screen | inside the first second | measured `DZ3Hwu9oBBP` (0.5 s) and all three caption references |
| On-screen hook | the spoken line itself, stacked; no second headline | measured |
| Call to action | one, spoken as the last sentence, plus the keyword pill when it is a comment keyword | measured: all four English references |
| Risk on comment-keyword calls to action | Instagram said in June 2024 that posts asking for a specific word in comments may not be recommended, and also that using comments and messages for leads is not engagement bait. Unresolved | research, relayed by search, not read on the page |

## 6. Checks before anything is shown

Size 1080x1920 and duration equal on audio and video; loudness -14 +/- 0.7 LUFS and true peak at most -1 dBFS;
every cut edge passes the audio edge check; captions match the transcript word for word; no text in the zones above;
no text over a face (render audit); a contact sheet at 2 frames per second read once from start to end.

## 7. Revisions from Chris

| Date | His words | What it changes |
|---|---|---|
| 27 November 2026 | "Stop, just make some cinematic cuts and write a caption on the clip this or gta 6" | For a quick trend montage: do not research the trend at length and do not narrate. Cut, grade, put the one caption on, deliver. Keep trend research to what can be measured in a few minutes. |

| 27 November 2026 | "Search for a gta6 color filter and make it that way and 500 kg" | The "vice" look in `edit/gta6/look.py`: pink-to-orange sunset sky applied only to the bright upper frame, warm highlights, teal shadows, saturation up, slight haze. No official filter or published values exist; this is the look people mean. "500 kg" is shown as given, with no label, from the first rear view on. The accent moved from the wrap's orange to cyan, which holds against a pink sky. |

| 27 November 2026 | "Make a 45 second clip", with a Spotify link to "Flower In A Hurricane" (Justice, GTA VI score) | A long music montage is cut on the song's bar grid: tempo measured on the public preview (125.9 BPM, taken as 126, confirmed by one listing), 24 bars = 45.7 s, shots of half a bar, one bar or two bars. The song is never put into the file: it is a commercial recording and is added in the app. Footage that is too short for the length is stretched with detail framings cropped from the 4K frames, not with repeats of the same framing. |

| 27 November 2026 | "Take 500 kg out. Take out the first clip with the headlights off" | The 45-second reel carries one caption only. Every shot from the lights-off clip is gone and the reel opens on the lit headlights. My reading, not his words: open on the strongest live frame, without a build-up shot before it. |

| 27 November 2026 | "You made it look like shit. Make the colors more natural." (about the pink-sky "vice" look) | Natural color is the default from now on: the `natural` look in `edit/gta6/look.py` (no tint, no vignette, no haze; contrast 1.06, saturation 1.10, a small correction of the phone's cool cast measured on the asphalt). A stylized look is never applied on my own reading of a request: show two or three test frames first and let him pick. The darkening behind a caption stays at 0.2 or less, so it does not change the sky. |

## 8. Trend montage without speech (first made 27 November 2026, "This or GTA 6?")

| Rule | Value | Source |
|---|---|---|
| Length | 5 to 9 s | measured: two launch-week trend examples run 5.8 s and 7.8 s (19.6M and 6.8M views); this reel 8.8 s |
| Text | one line, on screen from the first second to the last frame | measured: both examples |
| Cuts | 1-2 in the examples; 4 in ours, one shot per clip he sent | measured / choice |
| Sound | the footage's own sound, mastered to -14 LUFS; a platform sound is added by him in the app | measured: both examples use original sound |
| Caption place | top of the frame (center y about 440) over a top shade when the subject fills the middle and lower frame | choice, checked on stills |
| Accent | the subject's own color on the one emphasized word (here the wrap's orange, brightened to #FF6B0F) | measured from the footage / choice |
| Color | natural (see the revision of 27 November); never a stylized filter without showing test frames first | his revision |
