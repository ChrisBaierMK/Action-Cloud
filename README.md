# Action-Cloud

The Action Cloud Bucharest site: the story of the park, the Action Crew sign-up, the clothing shop and the sponsor packages. Romanian at `/`, English at `/en/`, the shop at `/shop/`. Static files, hosted on Netlify as `actioncloud-bucharest-sponsors`.

## Editing the pages

Every text on the two pages lives in `tools/build.py` as a Romanian / English pair, so the languages cannot drift apart. Change the text there, then run:

```
python3 tools/build.py
```

It writes `index.html`, `en/index.html`, `multumim.html` and `en/thanks.html`. Do not edit those four files by hand.

`styles.css` and `site.js` are written by hand. The page works without `site.js`; the script adds the progress line, deck arrows, the swinging clothes rack, the price chips and package pre-selection.

The page is a walk in twelve stops: the hero, two stops of proof from Brașov, the plan, four decks of zone cards (`DECKS` in `tools/build.py`), Action Crew, the shop, the sponsor packages (`TIERS`) and the contact form.

## Checking

```
node tools/check.js "$PWD"          # behaviour: the clickable plan, arrows, forms, no-JS, small screens
node tools/shots.js "$PWD" <out dir> # a screenshot of every slide, desktop and phone
```

Both need Playwright.

## Pictures

- `assets/img/concept-*.webp`, `tier-*.webp` and `plan-3d.webp` are computer-generated concept images (Higgsfield). The page tags each one "Imagine concept" / "Concept image".
- Every picture wider than 1,000 px has a 1,000 px copy in `assets/img/s/` for phones. After adding or replacing a picture run `python3 tools/thumbs.py` (needs Pillow).
- `park-brasov`, `build-2012-2023`, `action-camp`, `event-night`, `founder` and `rider-inverted` are real photos from Brașov, tagged as such.
- The to-scale plan is drawn by `tools/build.py` from the `ROOMS` table (metres, 100 × 60 m hall, 6,000 m² in total). `plan-3d.webp` was rendered from that drawing; if `ROOMS` changes, the 3D picture has to be regenerated.

## Shop

`shop/` is the Action Cloud clothing shop (the same files as the `actioncloud-ro` Netlify project). Products and prices are in `shop/shop-config.js`. Prices are placeholders and checkout is not connected: while `checkoutUrl` is `null` the shop tells people to email their order.

## Forms

Three Netlify forms: `sponsor` and `crew` on the main pages, `contact` in the shop. Set up email notifications for them in the Netlify dashboard.

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

`ROOMS` in `tools/build.py` is the plan to scale (100 × 60 m, 6,000 m²); the drawing, the floor-area list and the 3D picture all follow it. The changing rooms, toilets and showers (18) stand in the front right corner against the hostel (21), with one door onto the walkway and one straight into the hostel, so hostel guests reach them after closing without entering the park. A second toilet group (no showers) was added at the entrance (16): the owner asked only for the move, and this group was added because it is the nearest toilet for about 70% of the hall floor. If it stays, it is the park's everyday block, not a small one: an accessible cabin, baby changing, and doors on the park side of the ticket gates. Mini Action (11) and the caged pitch (10) are fenced, each with its own gate onto the walkway, so nobody walks through them to get somewhere else. Known weak spot: the trampolines (6) can only be reached on foot across the pumptrack (2); the next redraw should give them a fenced walking lane along the left wall. When rooms move, redraw `assets/img/plan-3d.webp` from the new drawing.

## Before sending the link widely

- The pages carry `<meta name="robots" content="noindex">`. Remove it in `tools/build.py` when the site may be indexed.
- Opening date, building, funding target and Action Crew perks are not decided and are not stated on the page.
- Package prices are in euro (100 to 200,000 a year). The currency of payment and the exchange rate are for the contract; the page only says so.

Fonts (Barlow, Barlow Semi Condensed) are self-hosted under the SIL Open Font License.
