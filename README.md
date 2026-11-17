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
node tools/check.js "$PWD"          # behaviour: filters, arrows, forms, no-JS, small screens
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

## Before sending the link widely

- The pages carry `<meta name="robots" content="noindex">`. Remove it in `tools/build.py` when the site may be indexed.
- Opening date, building, funding target and Action Crew perks are not decided and are not stated on the page.

Fonts (Barlow, Barlow Semi Condensed) are self-hosted under the SIL Open Font License.
