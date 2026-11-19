# Action-Cloud

The Action Cloud Bucharest site: the story of the park, the Action Crew sign-up, the clothing shop and the sponsor packages. Romanian at `/`, English at `/en/`, the shop at `/shop/`. Static files, hosted on Netlify as `actioncloud-bucharest-sponsors`.

## Editing the pages

Every text on the two pages lives in `tools/build.py` as a Romanian / English pair, so the languages cannot drift apart. Change the text there, then run:

```
python3 tools/build.py
```

It writes `index.html`, `en/index.html`, `multumim.html` and `en/thanks.html`. Do not edit those four files by hand.

`styles.css` and `site.js` are written by hand. The page works without `site.js`; the script adds the progress line, deck arrows, the swinging clothes rack, the price chips and package pre-selection.

The page is a walk in eight stops: the hero, the clickable plan (in `tools/build.py` the places are `PLACES`, the number discs `SPOTS` and the tappable floor of each room `AREAS`; the build stops if they do not fit together; with a mouse, resting on a room for a moment brings up its card, a tap or click does the same on any device), the community stop, the take-action stop, Action Crew, the shop, the sponsor packages (`TIERS`) and the contact form.

## Checking

```
node tools/check.js "$PWD"          # behaviour: the clickable plan, arrows, forms, no-JS, small screens
node tools/shots.js "$PWD" <out dir> # a screenshot of every slide, desktop and phone
```

Both need Playwright.

## Pictures

- `assets/img/concept-*.webp`, `tier-*.webp` and `plan-3d.webp` are computer-generated concept images (Higgsfield). The page tags each one "Imagine concept" / "Concept image".
- Every picture wider than 1,000 px has a 1,000 px copy in `assets/img/s/` for phones. After adding or replacing a picture run `python3 tools/thumbs.py` (needs Pillow).
- `action-camp`, `event-night` and `rider-inverted` are real photos from the first park, in Brașov, tagged as such. `story-2012` and `story-build` are cut from the `build-2012-2023` collage. `park-brasov` is the picture in the take-action stop; `founder` is no longer on any page. `og-action.jpg` is the link preview of the short address `/action/`, cut from `action-camp`.
- The to-scale plan is drawn by `tools/build.py` from the `ROOMS` table (metres, 100 × 60 m hall, 6,000 m² in total). `plan-3d.webp` was rendered from that drawing; if `ROOMS` changes, the 3D picture has to be regenerated.

## Shop

`shop/` is the Action Cloud clothing shop (the same files as the `actioncloud-ro` Netlify project). Products and prices are in `shop/shop-config.js`. Prices are placeholders and checkout is not connected: while `checkoutUrl` is `null` the shop tells people to email their order.

## Take-action stop

The take-action form is one stop of the main page (`#action`, between the community stop and Action Crew, "Căutăm spațiu" in the top bar). It is not a page of its own: the owner asked for an add-on to the site, not a second site. It asks one question first, "how can you help?", with five answers: I have a space, I know someone with a space, I want to bring my business into the park, I want to sponsor, I want to lend a hand. Only the fields for the chosen answer follow, then name and phone. The answers and their texts are `HELP` in `tools/build.py`; the stop is written by `s_action` and the form by `action_form`.

`/action/` (Romanian) and `/en/action/` (English) are the short addresses given out in videos and DMs. They are small files that send the visitor on to the stop and keep the chosen answer: `/action/?tip=spatiu` lands on `/?tip=spatiu#action` with "Am un spațiu" chosen (also `cunosc`, `afacere`, `sponsor`, `crew`). They keep their own link-preview tags and picture (`og-action.jpg`), because a messenger reads those from the address it was given. Use these as the buttons of the Instagram DM that answers a comment keyword. The thank-you pages stay at `/action/multumim/` and `/en/action/thanks/` (`action_thanks`).

`action.js` hides the groups that were not chosen; it is loaded by the main pages. Without it every group is shown and the form still sends. The stop asks for a space of about 6,000 m² and says smaller ones are welcome too, so no offer is turned away by the form. It states the offer to someone with a space (we build and run the park, they get a share of the takings); change both in `HELP` and `action_form` if they change. The stop says "800 m² of ramps"; the feasibility plan was built on 1,000 m², so one of the two has to be corrected once the ramps are measured.

## Forms

Four Netlify forms: `sponsor` and `crew` on the main pages, `contact` in the shop, `action` in the take-action stop of the main page. Set up email notifications for them in the Netlify dashboard; until then submissions only show in the dashboard. The `action` form sends its answers under Romanian field names in both languages (`ajutor`, `spatiu-oras`, `spatiu-mp`, ...), so the inbox reads the same.

## The size claim

The line above the headline says the park is *planned* as the biggest *indoor* action sports park in Romania. Both words carry the claim; it is false without either of them. The wording is `CLAIM` in `tools/build.py`.

What it rests on (web search results read on 17 November 2026; the pages themselves could not be opened, so treat the figures as leads to re-check, not as proof):

| Venue | Kind | Reported area |
| --- | --- | --- |
| RideMore Center, Miercurea Ciuc | indoor skate, trampolines, climbing | 1,600 m² (whole centre) |
| Municipal indoor skatepark, Cluj-Napoca (contract signed, not built) | indoor skatepark | about 1,060 to 1,410 m² |
| Indoor trampoline parks in Bucharest | indoor trampolines | about 2,300 to 3,000 m² each |
| Skatepark Fartec, Brașov | outdoor, under road overpasses | about 10,200 m² |
| Skate Park Obor, Sibiu | outdoor | over 10,000 m² (whole plot) |
| Gravity Park, Constanța | outdoor | about 8,500 m² |
| Superland, Brașov | indoor children's amusement park, not action sports | about 17,000 m² |

So: no indoor action sports venue found comes near 6,000 m², three outdoor ones are bigger, and one indoor park of another kind is far bigger. Not checked: projects announced for 2026 and 2027. Re-check the list before the claim goes on anything printed or paid for, and keep the proof on file: Romanian advertising rules expect an advertiser to be able to back a superlative.

## The plan

`ROOMS` in `tools/build.py` is the plan to scale (100 × 60 m, 6,000 m²); the drawing, the floor-area list and the 3D picture all follow it. The changing rooms, toilets and showers (18) stand in the front right corner against the hostel (21), with one door onto the walkway and one straight into the hostel, so hostel guests reach them after closing without entering the park. A second toilet group (no showers) was added at the entrance (16): the owner asked only for the move, and this group was added because it is the nearest toilet for about 70% of the hall floor. If it stays, it is the park's everyday block, not a small one: an accessible cabin, baby changing, and doors on the park side of the ticket gates. Mini Action (11) and the caged pitch (10) are fenced, each with its own gate onto the walkway, so nobody walks through them to get somewhere else. Room 5 (14 × 20 m) is one padel court of 20 × 10 m with 2 m along each long side; it replaced the bowl at the owner's request and belongs to the "no wheels" group, so the groups now run 1 to 4, 5 to 10, 11 to 15 and 16 to 21. A padel court needs at least 6 m of clear height. Known weak spot: the trampolines (6) can only be reached on foot across the pumptrack (2); the next redraw should give them a fenced walking lane along the left wall. When rooms move, redraw `assets/img/plan-3d.webp` from the new drawing, then measure `SPOTS` and trace `AREAS` again on the new picture.

## Before sending the link widely

- The Brașov park is closed. The page speaks of it only in the past tense and says so twice in plain words (community stop, footer). Do not write about it as if it were open and do not use it as proof of demand: the owner excluded it from the visitor estimate.
- The pages carry `<meta name="robots" content="noindex">`. Remove it in `tools/build.py` when the site may be indexed.
- Opening date, building, funding target and Action Crew perks are not decided and are not stated on the page.
- The visitor estimate in the sponsor stop (`CROWD` and `crowd()` in `tools/build.py`) is the corrected estimate of the visitor study for the planned hall of about 6,000 m²: about 50,000 entries in the first year (32,000 to 77,000) and about 75,000 a year from the third (45,000 to 110,000), a little over six in ten under 18. Entries means everyone through the door, parents included; paying participants are about four fifths. Nothing is counted: the hall is not built, no comparable hall exists in Romania and nobody has measured how many people ride. Keep the word "estimate", the range and the note with the figures; do not add reach, impressions, media value or "different people", and do not use a third-year figure in a first-year contract. If the hall gets smaller than 6,000 m², these figures are wrong and must be redone before the page is shown to a sponsor. The line "once open, we report the entries counted at the door" is a promise: it needs a door counter in the budget.
- Package prices are in euro (100 to 200,000 a year). The currency of payment and the exchange rate are for the contract; the page only says so.

Fonts (Barlow, Barlow Semi Condensed) are self-hosted under the SIL Open Font License.
