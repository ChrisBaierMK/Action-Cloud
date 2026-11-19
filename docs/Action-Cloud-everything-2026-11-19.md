# Action Cloud: everything in one file

Written 19 November 2026. One file with every decision, number, text and link from this work, so any person or session can pick it up without the chat.

**Later the same day, in the site session:** the form page of section 8 is live, but not as a page of its own. At the owner's request it became part of the main page, the clothing shop was removed, and the three forms of the site were merged into one short form in the last stop (`#action`). The addresses of section 7 still work; `?tip=cunosc` now opens the same answer as `?tip=spatiu`. The field names and what was dropped are in `README.md`, "The one form". This file is not served by the site.

Confidence tags used here:

- **[Certain]** checked arithmetic, or something read from a source.
- **[Likely]** a solid inference from sources.
- **[Guessing]** a figure someone put in, to be replaced by a quote or a count. Most money figures in the feasibility plan are of this kind.

---

## 1. Where things stand

**Decision of 19 November 2026:** the park is planned at **6,000 m²** (21 places, a hall of about 100 × 60 m). It is to be found through **a partner who has the space and takes a cut of the revenue**, not through a lease.

**Nothing is signed.** There is no space, no partner, no operator, no sponsor and no opening date.

What exists:

- About 800 m² of ramps and a foam pit, owned by the non-profit association Rosenau Cycling.
- A budget of €50,000.
- About 50,000 followers on Instagram, and a tool that answers a comment with a DM.
- The site (draft), the feasibility plan, two decks, the reel script and the form page (built, not live yet).

The next three actions:

1. Put the form page live: in the site session, say "Merge the branch `claude/take-action-form` and deploy."
2. Get the ramps out of the Brașov hall as numbered modules, under a roof, and film it (section 9).
3. Film and post the reel, from the account the DM tool is connected to (sections 6 and 7).

---

## 2. Facts

| Item | Fact | Source |
|---|---|---|
| Who runs it | The non-profit association Rosenau Cycling runs Action Cloud | Site |
| First park | Action Cloud Brașov, closed. The closing reel was posted on 6 January 2025 | Instagram |
| Ramps | About 800 m², with a foam pit. Built on sponsorship money that went through the association, so the material can only be used for skate ramps | Chris |
| Brașov hall | The ramps should already be out. Waiting costs no money, "just stress" | Chris, 18 Nov |
| Budget | €50,000 for opening | Chris, 18 Nov |
| Audience | About 50,000 followers on Instagram; a comment-to-DM tool is connected | Chris |
| Contact | chris@actioncloud.co, @action.cloud on Instagram and TikTok | Site |
| Model park | Skills Park in Winterthur, Switzerland. Also compared with DOME Adrenaline Zone in Gävle, Sweden | Chris |
| Chris's running-cost view | Three staff at most; electricity about 4,000 lei a month (lighting only, little heating); accounting about 2,000 lei a month; marketing done by himself | Chris, 18 Nov |

---

## 3. The model

### Chris's model, 19 November

- **The partner with the space** brings a large building and takes a cut of the revenue. He becomes a partner in the business. No fixed rent.
- **Action Cloud** brings the ramps, the team that built them, the brand and the community, and builds and runs the park.
- **Businesses around the park** (crossfit, yoga, cycling, café, restaurant, parties and more) come in as partners and pay, like tenants in a mall.
- **The pitch:** "a park like Romania has never had", so that riders come from abroad. "Put Romania on the map."

### Advisor's notes

- **The owner's cut.** A share of revenue is the right ask [Likely]. It is the only version the numbers support: someone else brings the building.
- **Who that owner is.** At 6,000 m², a 10% cut pays the owner about a fifth of what the building rents for (section 5.2) [Guessing]. The realistic partner is someone whose building stands empty: a closed store, an empty mall floor, a public hall.
- **The trampolines.** "We build the trampolines and everything" does not fit €50,000. The plan prices a play zone of 976 m² at €634,400 [Guessing]. Each zone other than the ramps has to come with its operator and his money.
- **The operators.** Rent plus a share of profit is a double charge. One rule for everyone is easier to sell: a share of sales with a minimum [Guessing].
- **Who signs.** The plan's rule: the association never signs a lease, a guarantee or a loan. A company with assets, or the owner himself, holds the building.
- **"Pro bono."** The park belongs to a non-profit, but the restaurant, the party rooms and the other units are businesses. Say so openly wherever the public is asked for help.

---

## 4. The 6,000 m² plan: what is inside

From the site (`tools/build.py`, table `ROOMS`). Hall of about 100 × 60 m. Areas are approximate.

| # | Place | m² | Group |
|---|---|---|---|
| 1 | Send Room and Fun Room | 1,008 | On wheels |
| 2 | Pumptrack | 480 | On wheels |
| 3 | Big airbag jump | 360 | On wheels |
| 4 | Mega ramp | 460 | On wheels |
| 5 | Padel court | 280 | No wheels |
| 6 | Trampoline hall | 396 | No wheels |
| 7 | Parkour and street workout | 216 | No wheels |
| 8 | Functional training and cycling studio | 240 | No wheels |
| 9 | Climbing and ninja course | 240 | No wheels |
| 10 | Street soccer and basketball | 320 | No wheels |
| 11 | Mini Action (ages 2 to 6) | 240 | Families |
| 12 | 3 party rooms | 144 | Families |
| 13 | Gaming room | 80 | Families |
| 14 | Café for parents | 128 | Families |
| 15 | Burger bar | 112 | Families |
| 16 | Entrance, reception and toilets | 96 | Services |
| 17 | Shop, service and rentals | 112 | Services |
| 18 | Changing rooms, toilets and showers | 128 | Services |
| 19 | Green walkway | 360 | Services |
| 20 | Storage and ramp workshop | 80 | Services |
| 21 | Hostel | 520 | Services |

Group totals: on wheels 2,308 m², no wheels 1,692 m², families 704 m², services 1,296 m². Total 6,000 m².

**What happens in the park:** Action Camps (holiday camps), Action Cups (competitions in every discipline), a programme for schools, weekly courses, birthday parties.

**The size claim.** The site's wording is: "We are planning the biggest indoor action sports park in Romania*", with the note that this is by planned floor area (about 6,000 m²), against parks open or publicly announced in Romania, checked in November 2026. The words "planning" and "indoor" both carry the claim; it is false without either of them.

---

## 5. Numbers

### 5.1 6,000 m² at market rent (feasibility plan, 17 November 2026)

| What | Figure | Tag |
|---|---|---|
| Rent, services and energy in north Bucharest | €40,000–62,000 a month | [Likely] |
| Base rent alone | about €28,000 a month (€4.67 per m²) | [Likely] |
| Listings read on 17 Nov (Otopeni, Chitila, Mogoșoaia) | €4.30–4.90 per m² a month; service charge €1.30–1.50 per m² | [Likely] |
| Average industrial rent in Bucharest | €4.8 per m² a month (Cushman & Wakefield, Waypoint 2026) | [Likely] |
| A 5-year lease | about €1.6–1.7 million, plus a guarantee of €89,000–106,000 | [Likely] |
| Money needed before opening | €2.76 million (€3.69 million with a reserve) | [Guessing] |
| A year at 75,000 entries | income €741,542, costs €1,197,519, result −€455,977 | [Guessing] |
| Break-even | 97,000–100,000 entries a year, plus €350,000 from sponsors | [Guessing] |
| What a café and a bike or skate shop would pay | €1,700–2,800 a month, 6–10% of the base rent | [Likely] |
| Best case with a play operator on 976 m² | tenants cover about 35% of the base rent | [Guessing] |
| One square metre of ramps | sells about €85 a year, costs about €93 in rent, services and energy | [Guessing] |

75,000 entries a year is 300 a day on 250 open days. The plan's sources support about 6,300 paid entries a year for the ramp hall alone.

### 5.2 What a partner with the space changes

My arithmetic on the plan's totals. [Guessing]: it assumes the plan's cost total holds the building at about these mid values.

| Step | € a year |
|---|---|
| Plan result at market rent, 75,000 entries | −455,977 |
| No base rent (about €28,000 a month) | +336,000 |
| No service charge (about €1.40 per m² a month) | +100,800 |
| **Result before the owner's cut** | **−19,177** |
| Owner's cut at 10% of sales | −74,154 |
| **Result after a 10% cut** | **−93,331** |
| If energy is lighting only, as Chris expects (saves up to about €150,000) | about +57,000 |

What this means:

- With a free building and low energy, the 6,000 m² park sits around zero at 75,000 entries. It still needs those entries, and the €2.76 million of fit-out still has to come from operators and sponsors.
- A 10% cut gives the owner about €74,000 a year for a building that rents for about €336,000. That is 22% of market rent.
- To match market rent, the cut would have to be about 45% of sales.

### 5.3 Smaller sizes, for reference

**3,000 m²** (worked out on 17 and 18 Nov):

- Space: €24,100–26,500 a month in rent, service charge and energy [Likely].
- Who pays: a play operator, a café and a shop on 40% of the hall carry about €10,100 a month; the ramps about €450; about €177,000 a year has no payer [Guessing].
- Before opening: about €1 million, of which €299,155 for the ramp hall and about €636,000 for the operator's zone [Guessing].

**About 1,500 m², around the ramps:**

- About €16,000 a month all in, on Chris's cost figures: rent and service charge about €9,000, three staff about €5,000, the rest about €2,000 [Guessing].
- That is about €192,000 a year, against a planned ramp-hall income of €110,243 (base case) or €172,277 (good case).
- Break-even needs roughly 45 to 75 paid entries a day, against the 25 the plan's sources support [Guessing].
- Opening: the leanest version is about €75,000; the plan's figure for the same job is €299,155 [Guessing].
- Odds, as a judgment and not a calculation: breaks even about one in four; pays more than €50,000 a year about one in ten.

**The ramp hall alone, a settled year (plan):**

| | Weak | Base | Good |
|---|---|---|---|
| Paid entries a year | 3,995 | 6,300 | 9,225 |
| Earned income, € | 63,286 | 110,243 | 172,277 |
| Costs, € | 93,189 | 114,050 | 153,423 |
| Result, € | −29,903 | −3,807 | +18,854 |

Break-even at 6,737 entries, 27 a day on 250 open days. It costs €9,504 a month, €5,850 of it fixed. It pays about two average jobs (€65,700 a year). It does not pay for a building.

### 5.4 Sponsor packages (site)

| Package | € a year | Places |
|---|---|---|
| Main partner | 200,000 | one |
| Zone partner | 50,000 | 4 to 5 |
| Attraction partner | 20,000 | 4 |
| Programme partner | 10,000 | 3 |
| Ramp partner | 3,000 | open |
| Local partner | 1,000 | open |
| Supporter | 100 | open |

All limited packages sold: €510,000–560,000 a year [Certain, as arithmetic]. No sponsor is committed today.

How a company's money comes in: a gift goes by sponsorship contract to the association, which must be in the ANAF register of entities for tax deductions on the signing date. Anything beyond showing a name (naming, branded zones, exclusivity) goes by advertising contract with the association's company, with VAT. Companies that pay profit tax can deduct sponsorship up to the lower of 0.75% of turnover and 20% of profit tax.

---

## 6. The video

### The reference: the closing reel

`https://www.instagram.com/reel/DEfELVKN1eH/`, posted on 6 January 2025 by @action.cloud with @chris.baier.

- 28 seconds, Chris to camera in the park, word-by-word captions, fast archive cuts.
- 1,822 likes, 136 comments, 243 sends [Certain, read off the page].
- It says the park is „definitiv închis" and that it is time „să facem altceva". It ends by asking people to share.
- Comments asked „Când se deschide înapoi action cloud?" and „De ce s-a închis?".

### The new reel, as the sequel (about 50 seconds, same format)

| # | Shot | Spoken, captioned as in the old reel |
|---|---|---|
| 1 | The old reel, full screen, hard cut after the line | „Action Cloud este definitiv închis." |
| 2 | Chris today, same spot, same framing | „Asta v-am spus acum aproape doi ani. Rampele sunt tot aici." |
| 3 | Pan over the ramps | „Caut un partener cu un spațiu mare, în jur de 6.000 de metri pătrați, cu ISU, deschis să-l pună la bătaie." |
| 4 | Chris, walking through the park | „Eu vin cu 800 de metri pătrați de rampe, cu echipa și cu voi. Facem un parc cum n-a mai existat în România. Să vină străinii la noi să se dea." |
| 5 | Fast cuts of the concept pictures | „Cu tot ce-ți poți imagina: crossfit, yoga, cycling, cafenea, restaurant, petreceri. Caut parteneri pentru fiecare." |
| 6 | Chris, close, arms open as in the old ending | „Ai un spațiu sau vrei să ajuți? Comentează ACTION și îți trimit linkul. Nu ești tu omul? Trimite clipul celui care e." |

- **End card:** „Să punem România pe hartă."
- **Cover:** Chris in front of the ramps, with „CĂUTĂM O HALĂ" in the centre.
- **Audio:** his own voice, no trending track.
- If the park is already taken apart, film beat 2 in front of the stacked pieces.

### Caption

> Niciun proiect mare n-a fost făcut de un singur om. Caut un partener cu un spațiu de aproximativ 6.000 m², cu ISU. Rampele sunt ale asociației nonprofit Rosenau Cycling. Comentează ACTION și îți trimit linkul.
>
> Mesaj de dat mai departe: „Salut! Action Cloud caută un spațiu de aproximativ 6.000 m², cu ISU, pentru un parc indoor de action sports. Știi pe cineva?"
>
> #actioncloud #skatepark #bucuresti #bmx #trotineta

### Rules for the reel

- Ask for no money and name no opening date.
- Publish it from the account the DM tool is connected to. ManyChat's own help says a collab post only fires for the account that publishes it.
- Have a one-line answer ready for „De ce s-a închis?".
- Name a deadline only if it will be kept.
- Expect hundreds of sends, not thousands [Guessing]. Also send the reel directly to about twenty named people: owners of empty retail space, sport retailers, play operators, city sport departments.

---

## 7. The comment keyword and the DM

Keyword: **ACTION**. The DM that answers it:

```
Mersi! Alege ce ți se potrivește:
[Am un spațiu]          https://actioncloud-bucharest-sponsors.netlify.app/action/?tip=spatiu
[Știu pe cineva]        https://actioncloud-bucharest-sponsors.netlify.app/action/?tip=cunosc
[Vreau să ajut altfel]  https://actioncloud-bucharest-sponsors.netlify.app/action/
```

Each button opens the form with that answer already chosen. The links work once the page is live (section 8).

---

## 8. The form page

**Status: built and tested, on GitHub, not live.** This session's network blocks Netlify's upload host (`netlify-mcp.netlify.app`), so it could not be published from here.

- **To put it live:** in the site session, "Merge the branch `claude/take-action-form` and deploy."
- **Repository:** `https://github.com/ChrisBaierMK/Action-Cloud`, branch `claude/take-action-form`, commit `d3d2a60`. It sits on top of the site branch `claude/keen-wright-cxczb1`.
- **Addresses after the deploy:** `/action/` (Romanian), `/en/action/` (English), on `https://actioncloud-bucharest-sponsors.netlify.app`.

What it does:

- One question first, „Cum ne poți ajuta?", with five answers:
  - Am un spațiu
  - Știu pe cineva cu un spațiu
  - Vreau să-mi aduc afacerea în parc
  - Vreau să sponsorizez
  - Vreau să pun umărul
- Only the fields for the chosen answer follow, then name and phone, an optional email and Instagram name, and a consent box.
- It asks for about 6,000 m² and says smaller spaces are welcome, so the form turns no offer away.
- It states the offer to the owner: we build and run the park, you get a share of the takings.
- It works without JavaScript, and a link can arrive with the answer chosen (`?tip=spatiu`, `cunosc`, `afacere`, `sponsor`, `crew`).

Fields by answer:

| Answer | Fields |
|---|---|
| I have a space | town or area, floor area in m², clear height, ISU for the public (yes, no, don't know), notes |
| I know someone | who it is and what space they have, town |
| My business | what kind (crossfit, yoga, cycling, trampolines, climbing, café, restaurant, parties, shop, other), name, m² needed |
| Sponsor | company, how (money, products, services) |
| Lend a hand | what you can help with |

Technical notes: one Netlify form named `action`; a honeypot against spam; a thank-you page that asks people to pass the page on by WhatsApp. Checked on phone and desktop in both languages; the site's own 83 checks still pass.

Three things only Chris can do:

1. Turn on email notifications for the `action` form in Netlify. Until then the answers only sit in the dashboard.
2. Read the consent line on the page. It was written here and no lawyer has seen it.
3. Decide who answers every form within a day.

---

## 9. The ramps

The ramps should already be out of the Brașov hall. No hall with ISU can be found, signed and authorised in that time, so the ramps go into storage first, whatever happens next.

1. Get an exit date in writing. Ask for two or three weeks.
2. Take the park apart as modules, not as scrap. Number and photograph every piece.
3. Put it under a roof: one already available, a rented shed, or containers. Outside under tarps, the plywood is finished by spring [Likely].
4. Film the teardown. It happens once, and it is footage for the reel.

Storage costs a few hundred euros a month [Guessing]. A lease signed in a hurry costs tens of thousands a month for years.

If no partner is found, the fallback already on the site is the schoolyard plan: the park goes, piece by piece, to schoolyards as mini ramps. The first one is for Hărman.

---

## 10. Open decisions

- **The city.** The reel names none. The main site says north Bucharest.
- **The owner's cut.** The plan assumed 10% of sales. Market rent equals about 45% of sales.
- **Who signs for the building,** and through which company.
- **The terms for operators:** one rule, such as a share of sales with a minimum.
- **A deadline** for the search, and what happens to the ramps if it passes.
- **The line about riders from abroad:** a dream or a promise.
- **Brașov's real numbers:** best-year income and paid riders a day. They would replace most guesses in section 5.

---

## 11. Files and links

| What | Where | State |
|---|---|---|
| Site, draft | `https://actioncloud-bucharest-sponsors.netlify.app/` | 6,000 m², north Bucharest; not indexed by search engines |
| Site code | `https://github.com/ChrisBaierMK/Action-Cloud`, branch `claude/keen-wright-cxczb1` | Live version |
| Form page code | Same repository, branch `claude/take-action-form` | Waiting for merge and deploy |
| Feasibility plan | `https://claude.ai/artifact/4KWVXzufiieNpLxmfRaKbQ` | 17 Nov, in Romanian |
| Sponsor presentation, draft | `https://claude.ai/artifact/UV3TwVPcBkhqxhBqWFnuB3` | 17 Nov |
| `Action-Cloud-Bucharest-Partner-Presentation.pdf` | Sent in this chat, 17 Nov | English, 14 slides, 6,000 m². Its cover says "Romania's biggest action-sports park" without "planned" and "indoor": fix before sending |
| `Action-Cloud-Bucuresti-Proiect-complet-3000mp.pdf` | Sent in this chat, 17 Nov | Romanian, 34 slides, built on 3,000 m². Out of date since the 6,000 m² decision |
| Complete-project deck for 6,000 m², English, 40 slides | Built on 17 Nov, never sent | Can be finished if a full 6,000 m² deck is wanted |
| Closing reel | `https://www.instagram.com/reel/DEfELVKN1eH/` | The opening shot of the new reel |

---

## 12. How the direction has moved

| Date | Direction |
|---|---|
| 14–15 Nov | A movement and a clothing brand, not a place. The park goes to schoolyards in pieces |
| 17 Nov | A physical park in Bucharest, modelled on Skills Park, at 6,000 m². Later that day: 3,000 m² |
| 18 Nov | "As big as possible", a mall with operators, or buying a building. In the evening: smaller halls of 1,500–2,000 m², a €50,000 budget, then "a waste of time", then the idea of the video |
| 19 Nov | A partner with the space for a cut of revenue; a form page and a comment keyword. Then: 6,000 m² |
