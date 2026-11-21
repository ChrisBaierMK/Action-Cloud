# Action-Cloud

The Action Cloud Bucharest site: the story of the park, the sponsor packages and one form for everyone who wants in. Romanian at `/`, English at `/en/`. Live at https://actioncloud.ro (Netlify project `actioncloud-bucharest-sponsors`; the domain is registered at GlobeHosting and its nameservers point to Netlify DNS, dns1–dns4.p09.nsone.net, so all DNS records live in Netlify). `SITE` in `tools/build.py` holds that address for links and previews. Static files, hosted on Netlify as `actioncloud-bucharest-sponsors`.

## Publishing

`main` is the live site. Every push to `main` runs `.github/workflows/site.yml`: it rebuilds the pages and fails if the committed HTML differs from `tools/build.py`, runs `tools/check.js` in Chromium, and, if all checks pass, publishes to Netlify with the Netlify CLI. Publishing needs the repository secret `NETLIFY_AUTH_TOKEN` (a Netlify personal access token); without it the checks still run and the deploy job only leaves a warning. Pull requests get the checks but are not published.

## The board ("Cine e deja în joc")

Above the form, a crowdfunding-style board without money: for each kind of sign-up (Action Crew, spaces, sponsors, businesses, investors, helping hands) a live count against a goal (`BOARD` in `tools/build.py`). Below a row's minimum (`BOARD_MIN`, 25 for the Action Crew, 1 for the rest) the row says "fii primul" instead of a small number. On sending, `action.js` calls `ac_inscrie(tip, fp)` in the Supabase project MK1930 (`ygpmfswujykahqlkzqfg`; the free-project limit was used up), waits at most 2 seconds, then sends the Netlify form as before. Only the type and a SHA-256 fingerprint of the contact are stored (`ac_interes`), so one person counts once per type and no personal data sits in Supabase. `ac_contoare()` returns the counts: site sign-ups plus `ac_manual`, the real commitments added by hand (3 sponsors: Rosenau Cycling, Techno Pro, Skates.ro). Visitors can call only those two functions; the tables are closed to them. To add a real commitment by hand: `update ac_manual set n = n + 1, nota = nota || ', <name>' where tip = 'sponsor';` (insert a row for a new type).

## Action Crew and Kit

Choosing "Vreau noutăți: Action Crew" and sending the form also sends the email address and name to the Kit form "Action Crew București (actioncloud.ro)", id 10220859 (`toKit` in `action.js`). Kit sends a confirmation mail in Romanian (double opt-in) and, after confirming, sends the visitor to `/action/multumim/`. The Netlify form still receives every answer as before, and its notification mail goes to chris@actioncloud.co. `tools/check.js` checks that only the Action Crew answer reaches Kit.

## Editing the pages

Every text on the two pages lives in `tools/build.py` as a Romanian / English pair, so the languages cannot drift apart. Change the text there, then run:

```
python3 tools/build.py
```

It writes `index.html`, `en/index.html`, the short addresses `action/index.html` and `en/action/index.html`, and the thank-you pages under them. Do not edit those files by hand.

`styles.css`, `site.js` and `action.js` are written by hand. The page works without the scripts: `site.js` adds the clickable plan, the rail arrows and the price chips; `action.js` runs the form (see "The one form").

The page is a walk in five stops: the hero, the clickable plan (in `tools/build.py` the places are `PLACES`, the number discs `SPOTS` and the tappable floor of each room `AREAS`; the build stops if they do not fit together; with a mouse, resting on a room for a moment brings up its card, a tap or click does the same on any device), the community stop, the sponsor packages (`TIERS`) and the one form (see below).

## Checking

```
node tools/check.js "$PWD"          # behaviour: the clickable plan, arrows, forms, no-JS, small screens
node tools/shots.js "$PWD" <out dir> # a screenshot of every slide, desktop and phone
```

Both need Playwright.

## Pictures

- `assets/img/concept-*.webp`, `tier-*.webp` and `plan-3d.webp` are computer-generated concept images (Higgsfield). The page tags each one "Imagine concept" / "Concept image".
- Every picture wider than 1,000 px has a 1,000 px copy in `assets/img/s/` for phones. After adding or replacing a picture run `python3 tools/thumbs.py` (needs Pillow).
- `action-camp`, `event-night` and `rider-inverted` are real photos from the first park, in Brașov, tagged as such. `story-2012` and `story-build` are cut from the `build-2012-2023` collage. `park-brasov` is the picture beside the form; `founder` is no longer on any page. `og-action.jpg` is the link preview of the short address `/action/`, cut from `action-camp`.
- The to-scale plan is drawn by `tools/build.py` from the `ROOMS` table (metres, 100 × 60 m hall, 6,000 m² in total). `plan-3d.webp` was rendered from that drawing; if `ROOMS` changes, the 3D picture has to be regenerated.

## Shop

The clothing shop was taken out of this site on 19 November 2026 at the owner's request: the "Magazin" stop with the clothes rail, its link in the top bar and the footer, the "shop orders" promise in the Action Crew stop, and the `/shop/` folder. The shop itself is a separate Netlify project (`actioncloud-ro`), which this site no longer links to and which was not touched. Everything removed is in the git history (the commit before "Remove the clothing shop"). Room 17 on the plan, "Shop, service and rentals", is the park's own bike and skate shop and stays.

## Files that are not served

The whole repository is published, so `_redirects` answers "not found" (`404.html`, written by the build) for `README.md`, `docs/` and `tools/`: they hold working notes, budgets and estimates that are not for visitors. Add a line there for any new working file or folder.

## The one form

The site has one form, in the last stop of the main page (`#action`, "Căutăm spațiu" in the top bar). On 19 November 2026 the owner asked for the three forms (take action, Action Crew sign-up, sponsor contact) to become one, simpler and with few details. It asks one question, "Cum intri în joc?", with five answers (`HELP` in `tools/build.py`): I have or know of a space, I want to sponsor, I want to bring my business in, I want to lend a hand, keep me posted (Action Crew). Choosing an answer shows one short optional line for it (the sponsor answer shows company and package), then name and "phone or email", and Send. No answer asks for more than four fields. The stop is written by `s_action`, the form by `action_form`.

Every button that used to lead to a form of its own now leads here with its answer chosen (`data-tip` on the link, read by `action.js`): "Join the Action Crew" in the hero and under the plan, "I have a space" under the plan, "Căutăm spațiu" in the top bar, and "Choose this package" on a sponsor card (`data-pick`, which also fills in the package). The old anchors `#crew`, `#join` and `#contact` still land on the stop.

`/action/` (Romanian) and `/en/action/` (English) are the short addresses given out in videos and DMs. They are small files that send the visitor on to the form and keep the chosen answer: `/action/?tip=spatiu` lands on `/?tip=spatiu#action` with "Am sau știu un spațiu" chosen (also `sponsor`, `afacere`, `crew` for lending a hand, `stiri` for news; the older `cunosc` now means `spatiu`, and the old anchors `#crew` and `#join` open the news answer, `#contact` the sponsor answer). They keep their own link-preview tags and picture (`og-action.jpg`), because a messenger reads those from the address it was given. The thank-you pages are at `/action/multumim/` and `/en/action/thanks/` (`action_thanks`).

`action.js` hides the lines that were not chosen and, once an answer is chosen by a tap, a button or a link, folds the list down to that one row with "Schimbă răspunsul" under it, so the row, its line and Send fit one phone screen. It checks nothing itself: the browser refuses a contact that is neither a phone number nor an email address (the `pattern` on the field), and for the news answer the field becomes an email field. Lines that are not shown are switched off only at the moment of sending. It is loaded by the main pages. Without it every line is shown and the form still sends. What was dropped on purpose, to keep the form short: the separate Action Crew questions (what you ride, the newsletter tick box: choosing the news answer is the opt-in), the space details (height, fire permit, notes), the business type list, the free message, the consent tick box (the line under Send says what the details are used for) and the Instagram field. The "send to a parent on WhatsApp" link lives in the news line, for visitors under 16. No lawyer has read the consent wording, and the site has no privacy note yet: the line under Send names the association and what the details are used for. The stop says "800 m² of ramps"; the feasibility plan was built on 1,000 m², so one of the two has to be corrected once the ramps are measured.

## Forms

One Netlify form, `action`, on the main pages. Its fields: `ajutor` (the chosen answer, in Romanian in both languages), one of `spatiu`, `sponsor-firma` with `pachet` (the package under its Romanian name), `afacere` or `ajutor-cum`, then `name` and `contact` (a phone number or an email address; an email address for the news answer), plus `language`. The subject of the notification mail carries the answer (SPAȚIU, SPONSOR, AFACERE, AJUTOR, noutăți), so one mail filter keeps news sign-ups apart from offers. Set up email notifications for the `action` form in the Netlify dashboard; until then submissions only show in the dashboard. The older forms `crew` and `sponsor` no longer exist on the site; what they collected earlier stays in the dashboard.

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
