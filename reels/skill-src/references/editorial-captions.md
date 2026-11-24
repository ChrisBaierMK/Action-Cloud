# The editorial caption system: writing `editorial.json`

The component is `remotion/src/editorial/Editorial.tsx`. It draws on top of the it-reelsmaker kit (which still
supplies footage, camera, inserts and end card) and replaces the kit's subtitles and hook. Its look was measured
from three reference reels; the numbers are in `style-sheet.md`, section 3.

Everything is addressed by **word index** into the cut's caption words, so text lands on the spoken word and no
timecode is typed by hand. List the indexes with:

```bash
python3 tools/editorial.py words edit/<id>
```

Run it again after any re-cut: the indexes move with the cut. `tools/editorial.py props edit/<id>` refuses a spec
that points at an index the cut does not have.

## The tiers

| Tier | What it is for | Spec field |
|---|---|---|
| Hook | the opening line, stacked in the middle of the frame, one beat per line | `hook` |
| Running captions | everything no other tier shows, 1-3 words at a time | automatic |
| Callout | a line that matters: a feature, the offer, the spoken call to action | `callouts` |
| Keyword pill | pairs with a spoken "comment X" call to action | `cta` |
| Light card | a number or a name on a clean field, covering the footage | `cards` |

## Fields

```json
{
 "accent": "#E64E4D",
 "shadow": 0.25,
 "emphasis": [11, 16, 25, 29, 32],
 "hook": {"lines": [[0, 1, 2], [3, 4], [5, 6], [7, 8]], "serifLines": [0, 3], "accentLines": [3]},
 "cards": [{"fromWord": 17, "toWord": 25, "label": "Step 2",
            "big": [{"t": "Cuts", "atWord": 19}, {"t": "every", "serif": true, "accent": true, "atWord": 24},
                    {"t": "silence.", "atWord": 25}]}],
 "callouts": [{"words": [26, 34]}],
 "cta": {"atWord": 29, "keyword": "reels", "then": "In your DMs", "thenAtWord": 33}
}
```

- `accent`: the one accent color of the video. Default is the brand's accent. The references use the color of
  whatever the video is about (a sponsor's brand color, for instance). One accent per video, never two.
- `shadow`: 0 to 1, a soft shadow under text over footage. 0.25 on bright phone footage; 0 on dark, graded footage.
- `emphasis`: word indexes set in the accent-colored italic serif. See "Choosing emphasis" below.
- `hook.lines`: word indexes per line. `serifLines` and `accentLines` are line numbers (starting at 0). Optional
  `hold` (seconds the block stays after its last word, default 0.45) and `y` (center, default 960).
- `callouts[].words`: first and last word index of the line. Optional `lines` (explicit line breaks as index lists),
  `size` (default 82 px, shrinks to fit), `y` (center, default 1180), `hold`.
- `cta`: `atWord` is the word the pill appears on, `keyword` is shown in capitals. `then` and `thenAtWord` switch
  the pill to a second state (a send icon and the promise). Optional `y` (center, default 603) and `untilWord`.
- `cards[]`: shown from `fromWord` to `toWord`. `big` and `sub` are token lists; a token is `{"t": text}` with
  optional `serif`, `accent` and `atWord` (the word it arrives on; without it tokens arrive in order).
- Optional top-level: `captionY` (default 1174), `captionSize` (default 48), `maxWords` (default 3),
  `maxChars` (default 18).

Words shown by the hook, a callout or a card are not repeated as running captions.

## Choosing emphasis

The serif is the loud element, so it has to be rare to mean anything. In the references it marks the product, the
number, or the result, and nothing else.

- At most one serif word (or one short phrase) per caption, and roughly one every 2-3 seconds.
- Pick the word a viewer with the sound off must not miss. Never a filler, a pronoun or a connective.
- In the hook, set one line in serif and give the accent color to the line that names the subject.
- A number reads better on a light card than as an emphasized caption.

## Writing the hook

One beat per line reads fastest: "This / is the / LiberNovo / Maxis / Airflow" is five lines of one or two words.
Lines with three words still work but build unevenly, because words reserve their space before they arrive.
The hook's text is the spoken line itself, taken from the captions; fix capitals and spelling with `fix` in
`cut.json`, not here. Keep the first sentence inside 2.5 seconds.

## The spoken call to action and the pill

Set the final spoken call to action as a callout so it is large, and add the pill when it asks for a comment
keyword. Say what the viewer receives ("comment MTB and I'll send you the full lesson"), not only what to type:
Instagram named "comment a specific word" as an example of content it may not recommend, while accepting comments
used for delivering something.

## Sizes and positions (1080 x 1920, measured from the references)

| Element | Size | Position |
|---|---|---|
| Hook | sans about 130 px, serif about 1.2x; shrinks so the longest line fits | block centered at y 960 |
| Running captions | 48 px semi-bold; emphasized word on its own serif line below | centered at y 1174 |
| Callout | 76-82 px, never wider than about 860 px | centered at y 1180 |
| Pill | 150 px tall, accent disc 132 px | centered at y 603 |
| Card | label 38 px caps, big line up to 148 px, second line 70 px | centered in the frame |

Keep all text above y 1330 and out of the right 120 px. If the video may run as an ad, all text has to end at
y 1248 or higher and stay within x 120-888, so raise `captionY` and callout `y` by about 80 px for those.

48 px running captions are what the references use and they are small; tool vendors recommend 60-75 px. Until
Chris has chosen, render a still at both sizes on real footage and show him.

## Checking the result

Render stills at the hook's last word, at one emphasized caption, at each callout and card, and at the pill's two
states, tile them into one sheet and look at it before the full render. Text over a face, a line wider than the
frame, or a word that appears before it is spoken are the three defects to look for.
