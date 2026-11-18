#!/usr/bin/env python3
"""Builds the Action Cloud pages from one source of content.

Run:  python3 tools/build.py            (writes index.html, en/index.html and the two thank-you pages)

Every visible text lives in this file as a (Romanian, English) pair, so the two pages cannot drift apart.
The pages are plain HTML; styles.css and site.js are hand-written and not generated.
"""
import html
import os
import sys
from urllib.parse import quote

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://actioncloud-bucharest-sponsors.netlify.app/"
MAIL = "chris@actioncloud.co"
LANGS = ("ro", "en")


def T(ro, en):
    return {"ro": ro, "en": en}


def esc(s):
    return html.escape(s, quote=True)


# ---------------------------------------------------------------- pictures
# name: (file, width, height, kind)   kind: concept | real | mock | none
PICS = {
    "crew": ("concept-crew.webp", 1600, 1195, "concept"),
    "walkway": ("concept-walkway.webp", 1600, 1195, "concept"),
    "entrance": ("concept-entrance.webp", 1600, 1195, "concept"),
    "service": ("concept-service.webp", 1600, 1195, "concept"),
    "send-room": ("concept-send-room.webp", 1600, 1195, "concept"),
    "pumptrack": ("concept-pumptrack.webp", 1600, 1195, "concept"),
    "big-airbag": ("concept-big-airbag.webp", 1600, 1195, "concept"),
    "mega-ramp": ("concept-mega-ramp.webp", 1600, 1195, "concept"),
    "padel": ("concept-padel.webp", 1600, 1195, "concept"),
    "trampolines": ("concept-trampolines.webp", 1600, 1195, "concept"),
    "parkour": ("concept-parkour.webp", 1600, 1195, "concept"),
    "climbing-ninja": ("concept-climbing-ninja.webp", 1600, 1195, "concept"),
    "street-soccer": ("concept-street-soccer.webp", 1600, 1195, "concept"),
    "mini-action": ("concept-mini-action.webp", 1600, 1195, "concept"),
    "training": ("concept-training.webp", 1600, 1195, "concept"),
    "cycling": ("concept-cycling.webp", 1600, 1195, "concept"),
    "bistro": ("concept-bistro.webp", 1600, 1195, "concept"),
    "burgers": ("concept-burgers.webp", 1600, 1195, "concept"),
    "gaming": ("concept-gaming.webp", 1600, 1195, "concept"),
    "birthday": ("concept-birthday.webp", 1600, 1195, "concept"),
    "hostel": ("concept-hostel.webp", 1600, 1195, "concept"),
    "wash": ("concept-wash.webp", 1600, 1195, "concept"),
    "workshop": ("concept-workshop.webp", 1600, 1195, "concept"),
    "plan-3d": ("plan-3d.webp", 2000, 1131, "concept"),
    "huddle": ("concept-huddle.webp", 1600, 1195, "concept"),
    "tier-naming": ("tier-naming.webp", 1600, 1195, "concept"),
    "tier-zone": ("tier-zone.webp", 1600, 1195, "concept"),
    "tier-attraction": ("tier-attraction.webp", 1600, 1195, "concept"),
    "tier-programme": ("tier-programme.webp", 1600, 1195, "concept"),
    "tier-feature": ("tier-feature.webp", 1600, 1195, "concept"),
    "tier-local": ("tier-local.webp", 1600, 1195, "concept"),
    "tier-supporter": ("tier-supporter.webp", 1600, 1195, "concept"),
    "tier-supporter-en": ("tier-supporter-en.webp", 1600, 1195, "concept"),
    "park-brasov": ("park-brasov.webp", 989, 900, "real"),
    "build": ("build-2012-2023.webp", 1600, 901, "real"),
    "action-camp": ("action-camp.webp", 1600, 720, "real"),
    "event-night": ("event-night.webp", 1229, 922, "real"),
    "founder": ("founder.webp", 1600, 1067, "real"),
    "rider": ("rider-inverted.webp", 989, 900, "real"),
    # small squares for the story strip; the two photos are cut from the 2012-2023 collage, which is all we have of them
    "story-2012": ("story-2012.webp", 216, 216, "real"),
    "story-build": ("story-build.webp", 250, 250, "real"),
    "story-next": ("story-next.webp", 400, 400, "concept"),
}
TAG = {
    "concept": T("Imagine concept", "Concept image"),
    "real": T("Fotografie din Brașov", "Photo from Brașov"),
    "photos": T("Fotografii reale", "Real photos"),
    "mock": T("Machetă", "Mock-up"),
}


class Page:
    """One language version. `pre` is the path prefix back to the site root."""

    def __init__(self, lang):
        self.lang = lang
        self.pre = "" if lang == "ro" else "../"

    def t(self, pair):
        return pair[self.lang]

    def img(self, key, alt, eager=False, kind=None, sizes="(max-width: 30rem) 75vw, 25rem"):
        """Every picture exists twice: full size in assets/img and 1,000 px wide in assets/img/s (see tools/thumbs.py)."""
        f, w, h, k = PICS[key]
        kind = kind or k
        full, small = f"{self.pre}assets/img/{f}", f"{self.pre}assets/img/s/{f}"
        load = ' fetchpriority="high"' if eager else ' loading="lazy"'
        # pictures that are already 1,000 px wide or less have no smaller copy
        pick = f' srcset="{small} 1000w, {full} {w}w" sizes="{sizes}"' if w > 1000 else ""
        return f'<img src="{full}"{pick} width="{w}" height="{h}" alt="{esc(alt)}"{load}>', kind

    def media(self, key, alt, cls="", **kw):
        tag_html, kind = self.img(key, alt, **kw)
        tag = f'<span class="tag{" real" if kind in ("real", "photos") else ""}">{self.t(TAG[kind])}</span>' if kind in TAG else ""
        return f'<div class="media{" " + cls if cls else ""}">{tag_html}{tag}</div>'

    def labels(self, items):
        return '<ul class="labels">' + "".join(f"<li>{x}</li>" for x in items) + "</ul>" if items else ""

    def card(self, key, title, labels=(), alt=None, cls="", extra="", **kw):
        return (f'<div class="card{" " + cls if cls else ""}">{self.media(key, alt or title, **kw)}'
                f'<div class="card-body"><h3>{title}</h3>{self.labels(labels)}{extra}</div></div>')

    def rail(self, rid, items, cls="", label=""):
        """A deck you swipe sideways. items: list of (li attributes, inner html); label names it for screen readers."""
        lis = "".join(f"<li{a}>{inner}</li>" for a, inner in items)
        prev = self.t(T("Cardul anterior", "Previous card"))
        nxt = self.t(T("Cardul următor", "Next card"))
        swipe = self.t(T("Glisează pentru mai multe", "Swipe for more"))
        return (f'<div id="{rid}" data-rail>\n<ul class="rail{" " + cls if cls else ""}" tabindex="0" role="list" aria-label="{esc(label)}">{lis}</ul>\n'
                f'<div class="wrap rail-tools"><p class="rail-count"><span class="swipe">{swipe}</span></p>'
                f'<div class="arrows"><button type="button" data-prev aria-label="{esc(prev)}">←</button>'
                f'<button type="button" data-next aria-label="{esc(nxt)}">→</button></div></div>\n</div>')

    def head(self, h, sub=None, level=2):
        s = f"<p>{self.t(sub)}</p>" if sub else ""
        return f'<div class="head"><h{level}>{self.t(h)}</h{level}>{s}</div>'


# ---------------------------------------------------------------- content
# One name per zone, used on the cards and on the plan. Keyed by the number on the plan.
NAMES = {
    1: T("Send Room și Fun Room", "Send Room and Fun Room"),
    2: T("Pumptrack", "Pumptrack"),
    3: T("Săritură mare pe airbag", "Big airbag jump"),
    4: T("Mega rampă", "Mega ramp"),
    5: T("Teren de padel", "Padel court"),
    6: T("Sală de trambuline", "Trampoline hall"),
    7: T("Parkour și street workout", "Parkour and street workout"),
    8: T("Antrenament funcțional și studio de cycling", "Functional training and cycling studio"),
    9: T("Cățărat și traseu ninja", "Climbing and ninja course"),
    10: T("Street soccer și baschet", "Street soccer and basketball"),
    11: T("Mini Action", "Mini Action"),
    12: T("3 săli de petreceri", "3 party rooms"),
    13: T("Sală de gaming", "Gaming room"),
    14: T("Cafenea pentru părinți", "Café for parents"),
    15: T("Burger bar", "Burger bar"),
    16: T("Intrare, recepție și toalete", "Entrance, reception and toilets"),
    17: T("Magazin, service și închirieri", "Shop, service and rentals"),
    18: T("Vestiare, toalete și dușuri", "Changing rooms, toilets and showers"),
    19: T("Promenadă verde", "Green walkway"),
    20: T("Depozit și atelier de rampe", "Storage and ramp workshop"),
    21: T("Hostel", "Hostel"),
}

# The places in the park, in the order of their numbers on the plan. "Next" follows this order.
# Each card: picture, number on the plan, title (None = the plan name), up to three labels.
# Ages other than Mini Action's 2–6 are our working assumption and are easy to change here.
PLACES = [
    ("send-room", 1, None, T(["Fun Room: începători", "Send Room: avansați", "Trotinetă, BMX, MTB, skate"],
                             ["Fun Room: beginners", "Send Room: advanced", "Scooter, BMX, MTB, skateboard"])),
    ("pumptrack", 2, None, T(["De la 7 ani", "Orice are roți", "Prinzi viteză fără să pedalezi"], ["Ages 7 and up", "Anything on wheels", "Build speed without pedalling"])),
    ("big-airbag", 3, None, T(["De la 13 ani", "Bicicletă, schiuri, snowboard", "Trucuri cu aterizare moale"],
                              ["Ages 13 and up", "Bike, skis, snowboard", "Tricks with a soft landing"])),
    ("mega-ramp", 4, None, T(["Pentru profesioniști", "Show-uri și Action Cups"], ["For pros", "Shows and Action Cups"])),
    ("padel", 5, None, T(["Teren cu pereți de sticlă", "Se joacă în patru", "Rachete de închiriat"], ["Glass-walled court", "Played in fours", "Rackets to rent"])),
    ("trampolines", 6, None, T(["De la 7 ani", "Salturi și rotații", "Aterizare pe airbag"], ["Ages 7 and up", "Flips and spins", "Airbag landing"])),
    ("parkour", 7, None, T(["De la 13 ani", "Cutii, ziduri, bare"], ["Ages 13 and up", "Boxes, walls, bars"])),
    ("cycling", 8, T("Studio de cycling", "Cycling studio"), T(["Te antrenezi cât copiii sunt în parc"], ["Train while the kids are in the park"])),
    ("training", 8, T("Antrenament funcțional", "Functional training"), T(["Pentru rideri și părinți"], ["For riders and parents"])),
    ("climbing-ninja", 9, None, T(["De la 7 ani", "Perete de cățărat", "Traseu cu obstacole"], ["Ages 7 and up", "Climbing wall", "Obstacle course"])),
    ("street-soccer", 10, None, T(["Teren în cușcă", "Perete cu ținte"], ["Caged pitch", "Target wall"])),
    ("mini-action", 11, None, T(["2–6 ani", "Biciclete fără pedale", "Loc de joacă tip soft play"], ["Ages 2–6", "Balance bikes", "Soft play"])),
    ("birthday", 12, None, T(["Aniversări pentru copii"], ["Kids' birthday parties"])),
    ("gaming", 13, None, T(["Console și ecrane mari", "Pauză între sesiuni"], ["Consoles and big screens", "A break between sessions"])),
    ("bistro", 14, None, T(["Vedere spre Mini Action", "Plină de plante"], ["Looks onto Mini Action", "Full of plants"])),
    ("burgers", 15, None, T(["Vedere spre street soccer și baschet"], ["Looks onto street soccer and basketball"])),
    ("entrance", 16, None, T(["Bilet și acordul părinților, online", "Aglomerația live, pe site", "Masă de înfășat pentru bebeluși"],
                             ["Ticket and parental consent, online", "Live crowd level on the website", "Baby changing table"])),
    ("service", 17, None, T(["Service pentru biciclete și trotinete", "Dulapuri și loc pentru bicicleta ta", "Închiriezi tot ce-ți trebuie"],
                            ["Bike and scooter service", "Lockers and storage for your own bike", "Rent everything you need"])),
    ("wash", 18, None, T(["Ușă direct din hostel", "Dulapuri pentru echipament"], ["A door straight from the hostel", "Lockers for your gear"])),
    ("walkway", 19, None, T(["Bănci cu vedere spre rampe"], ["Benches facing the ramps"])),
    ("workshop", 20, None, T(["Aici se construiesc și se repară rampele"], ["Where the ramps are built and repaired"])),
    ("hostel", 21, None, T(["Cazare în aceeași clădire", "Pentru tabere și competiții"], ["A place to stay in the same building", "For camps and competitions"])),
]

# Where each number sits on the 3D picture, in percent of its width and height (measured from the white discs on it).
# Redraw the picture and these move: measure again.
SPOTS = {1: (48.6, 26.2), 2: (14.05, 47.75), 3: (20.1, 7.2), 4: (59.05, 7.2), 5: (31.1, 47.75), 6: (13.4, 26.2), 7: (81.65, 26.2),
         8: (69.2, 47.75), 9: (81.2, 47.75), 10: (54.75, 47.75), 11: (42.3, 47.75), 12: (75.55, 75.0), 13: (7.15, 75.0), 14: (48.0, 75.05),
         15: (62.55, 75.0), 16: (33.8, 74.55), 17: (19.85, 75.05), 18: (90.45, 75.0), 19: (81.15, 64.7), 20: (83.35, 8.05), 21: (93.35, 38.1)}
# The floor of each room on the picture: rectangles x1, y1, x2, y2 in percent. A tap anywhere in a room chooses it; the disc is only its label.
# Traced on the picture itself (the 3D drawing is not a projection of ROOMS). Together they cover the whole picture once.
AREAS = {1: [(22.1, 16.5, 73.9, 36.0)], 2: [(0, 36.0, 24.0, 59.8)], 3: [(0, 0, 38.2, 16.5)], 4: [(38.2, 0, 79.4, 16.5)], 5: [(24.0, 36.0, 37.6, 59.8)],
         6: [(0, 16.5, 22.1, 36.0)], 7: [(73.9, 16.5, 87.6, 36.0)], 8: [(63.7, 36.0, 74.7, 59.8)], 9: [(74.7, 36.0, 89.6, 59.8)], 10: [(47.1, 36.0, 63.7, 59.8)],
         11: [(37.6, 36.0, 47.1, 59.8)], 12: [(68.6, 69.8, 82.9, 100)], 13: [(0, 69.8, 12.1, 100)], 14: [(39.1, 69.8, 55.9, 100)], 15: [(55.9, 69.8, 68.6, 100)],
         16: [(28.3, 69.8, 39.1, 100)], 17: [(12.1, 69.8, 28.3, 100)], 18: [(82.9, 69.8, 100, 100)], 19: [(0, 59.8, 90.4, 69.8)], 20: [(79.4, 0, 87.2, 16.5)],
         21: [(87.2, 0, 100, 16.5), (87.6, 16.5, 100, 36.0), (89.6, 36.0, 100, 59.8), (90.4, 59.8, 100, 69.8)]}


def check_plan():
    """Stop the build if the plan cannot be tapped properly: a disc outside its room, rooms that overlap or leave a hole, a room too small for a thumb."""
    bad = []
    for n, (x, y) in SPOTS.items():
        if not any(a <= x <= c and b <= y <= d for a, b, c, d in AREAS[n]):
            bad.append(f"disc {n} lies outside its room")
    step = 0.25
    for iy in range(400):
        for ix in range(400):
            x, y = (ix + .5) * step, (iy + .5) * step
            hit = [n for n, rects in AREAS.items() if any(a <= x < c and b <= y < d for a, b, c, d in rects)]
            if len(hit) != 1:
                bad.append(f"point {x:.1f}%, {y:.1f}% belongs to {hit or 'no room'}")
                break
        else:
            continue
        break
    for n, rects in AREAS.items():
        w = max(c for _, _, c, _ in rects) - min(a for a, _, _, _ in rects)
        h = max(d for _, _, _, d in rects) - min(b for _, b, _, _ in rects)
        if n != 19 and (w < 7.5 or h < 13.3):    # 24 px on a 320 px wide phone
            bad.append(f"room {n} is too small to tap: {w:.1f}% x {h:.1f}%")
    if sorted(AREAS) != sorted(SPOTS) or sorted(SPOTS) != sorted(NAMES) or sorted({n for _, n, _, _ in PLACES}) != sorted(NAMES):
        bad.append("every number needs a name, a disc, a room and a card")
    if bad:
        sys.exit("Plan problems:\n  " + "\n  ".join(bad))


# What each concept picture shows, for people who cannot see it (checked against the pictures).
ALT = {
    "service": T("Un mecanic repară o bicicletă pe stand, lângă rafturi cu biciclete, trotinete și căști", "A mechanic works on a bike in a repair stand, beside racks of bikes, scooters and helmets"),
    "entrance": T("Recepție din placaj, cu plante; un vizitator cu rucsac trece prin turnicheți, lângă rafturi cu căști și trotinete", "A plywood reception desk with plants; a visitor with a backpack walks through the ticket gates, beside racks of helmets and scooters"),
    "burgers": T("Tejghea de burgeri cu meniu luminos; rideri la coadă și la mese înalte", "A burger counter with a lit menu; riders queueing and sitting at high tables"),
    "mini-action": T("Copii mici cu căști, pe biciclete fără pedale, pe rampe joase; un părinte stă ghemuit lângă ei", "Small children in helmets on balance bikes on low ramps; a parent crouches beside them"),
    "pumptrack": T("Rideri pe un pumptrack din placaj, cu valuri și viraje în jurul unor jardiniere", "Riders on a plywood pumptrack with rollers and banked turns around planters"),
    "send-room": T("Rampe de sărituri din placaj și o groapă cu bureți, într-o hală plină de plante", "Plywood jump ramps and a foam pit in a hall full of plants"),
    "padel": T("Un teren de padel în sală, cu gazon albastru și pereți de sticlă; patru jucători la dublu, iar în spate sigla Action Cloud", "An indoor padel court with blue turf and glass walls; four players in a doubles rally, the Action Cloud sign behind them"),
    "big-airbag": T("O rampă înaltă de start și un rider pe bicicletă, în aer, deasupra unui airbag mare, negru cu galben", "A tall start ramp and a rider on a bike in the air above a large black and yellow airbag"),
    "mega-ramp": T("Două rampe foarte înalte, un rider în aer între ele și public la balustradă", "Two very tall ramps, a rider in the air between them and spectators at the railing"),
    "trampolines": T("Copii sărind pe trambuline negre cu margini galbene; unul face un salt, iar în spate e un airbag", "Kids jumping on black trampolines with yellow edges; one is mid-flip, with an airbag behind"),
    "climbing-ninja": T("Perete de cățărat cu prize colorate și un traseu ninja cu inele și plasă", "A climbing wall with coloured holds and a ninja course with rings and a net"),
    "parkour": T("Un tânăr sare peste o cutie din placaj; în spate, bare de street workout", "A young man vaults a plywood box; street workout bars behind him"),
    "street-soccer": T("Copii jucând fotbal pe un teren mic, împrejmuit, cu gazon sintetic, perete cu ținte și coș de baschet", "Kids playing football on a small caged pitch with artificial turf, a target wall and a basketball hoop"),
    "gaming": T("Cameră cu ecrane mari, canapele și fotolii puf; copii joacă pe console", "A room with big screens, sofas and beanbags; kids playing on consoles"),
    "birthday": T("Copii la o masă lungă cu tort, baloane și stegulețe; o fereastră mare dă spre rampe", "Kids at a long table with a cake, balloons and bunting; a large window looks onto the ramps"),
    "cycling": T("Clasă de cycling văzută din spate; printr-un perete de sticlă se văd rampele", "An indoor cycling class seen from behind; the ramps are visible through a glass wall"),
    "training": T("Sală cu cadru de tracțiuni, greutăți și cutii din placaj; câțiva oameni se antrenează", "A gym with a pull-up rig, weights and plywood boxes; a few people training"),
    "bistro": T("Cafenea plină de plante; părinți la mese, lângă un perete de sticlă cu vedere spre rampe", "A café full of plants; parents at tables beside a glass wall overlooking the ramps"),
    "walkway": T("Promenadă cu copaci și plante; un părinte și un copil mic privesc rampele de la balustradă", "A walkway lined with trees and plants; a parent and a small child watch the ramps from the railing"),
    "hostel": T("Cameră cu paturi supraetajate din lemn, dulapuri, două biciclete și o trotinetă; doi copii își desfac bagajele", "A room with wooden bunk beds, lockers, two bikes and a scooter; two kids unpacking"),
    "wash": T("Vestiar cu dulapuri din placaj și bănci; în spate, două cabine de duș și chiuvete; doi rideri își lasă echipamentul", "A changing room with plywood lockers and benches; two shower cubicles and wash basins at the back; two riders put away their gear"),
    "workshop": T("Atelier: un constructor prinde o foaie de placaj pe scheletul curbat al unei rampe; în jur, stive de placaj și scule, iar prin ușa mare se văd rampele", "Workshop: a builder fixes a plywood sheet to the curved frame of a ramp; stacks of plywood and tools around, and the ramps visible through the big door"),
    "tier-naming": T("Fațada parcului seara, cu firma „Action Cloud by LOGO” și steaguri LOGO la intrare", "The park façade at dusk with an \"Action Cloud by LOGO\" sign and LOGO flags at the entrance"),
    "tier-zone": T("Poarta unei zone, cu LOGO mare deasupra și bannere LOGO în interior", "The gateway to a zone with a large LOGO above it and LOGO banners inside"),
    "tier-attraction": T("Mega rampa, cu panouri LOGO pe laterale", "The mega ramp with LOGO panels on its sides"),
    "tier-programme": T("Un antrenor și un șir de copii în veste galbene cu LOGO, lângă un banner LOGO", "A coach and a row of kids in yellow LOGO bibs next to a LOGO banner"),
    "tier-feature": T("Un copil pe trotinetă urcă o rampă cu un autocolant LOGO", "A kid on a scooter rides up a ramp carrying a LOGO sticker"),
    "tier-local": T("Perete cu plăcuțe din placaj; una, luminată, poartă un LOGO, iar un părinte și un copil o privesc", "A wall of plywood plaques; one lit plaque carries a LOGO while a parent and child look at it"),
    "tier-supporter": T("O mână prinde pe perete o plăcuță din placaj gravată cu „TU”, lângă plăcuțe cu prenume", "A hand fixes a plywood plaque engraved \"YOU\" to the wall, next to plaques with first names"),
}

TIERS = [
    # id, picture, name, price in euro (Romanian and English number style), how many partners, labels (what the sponsor gets)
    ("pachet-principal", "tier-naming", T("Partener principal", "Main partner"), "200.000", "200,000", T("Un singur partener", "One partner only"),
     T(["„Action Cloud by brandul tău”", "Logo la intrarea principală", "Apari în tot ce publicăm și la evenimente"],
       ["\"Action Cloud by your brand\"", "Logo at the main entrance", "In everything we publish and at events"])),
    ("pachet-zona", "tier-zone", T("Partener de zonă", "Zone partner"), "50.000", "50,000", T("4–5 parteneri", "4–5 partners"),
     T(["O zonă îți poartă numele", "Logo la intrarea și pe rampele zonei", "Clipuri filmate în zonă"],
       ["A zone carries your name", "Logo at the zone's entrance and on its ramps", "Clips shot in the zone"])),
    ("pachet-atractie", "tier-attraction", T("Partener de atracție", "Attraction partner"), "20.000", "20,000", T("4 parteneri", "4 partners"),
     T(["Mega rampă, airbag, padel sau cățărat", "Logo pe atracție", "Clipuri filmate acolo"],
       ["Mega ramp, airbag, padel or climbing", "Logo on the attraction", "Clips shot there"])),
    ("pachet-program", "tier-programme", T("Partener de program", "Programme partner"), "10.000", "10,000", T("3 parteneri", "3 partners"),
     T(["Tabere, Action Cups sau programul pentru școli", "Programul îți poartă numele", "Mostre la tabere și evenimente"],
       ["Camps, Action Cups or the school programme", "The programme carries your name", "Samples at camps and events"])),
    ("pachet-rampa", "tier-feature", T("Partener de rampă", "Ramp partner"), "3.000", "3,000", None,
     T(["Logo pe o rampă, un perete sau un obstacol", "Mențiuni pe rețelele sociale", "Plasare de produs în clipuri"],
       ["Logo on a ramp, a wall or an obstacle", "Social media mentions", "Product placement in clips"])),
    ("pachet-local", "tier-local", T("Partener local", "Local partner"), "1.000", "1,000", None,
     T(["Logo pe peretele susținătorilor", "Logo pe site, cu link"], ["Logo on the supporter wall", "Logo on the website, with a link"])),
    ("pachet-sustinator", "tier-supporter", T("Susținător", "Supporter"), "100", "100", None,
     T(["Numele tău pe peretele susținătorilor", "Numele tău pe site"], ["Your name on the supporter wall", "Your name on the website"])),
]

HOODIE, TEE, CREWNECK = T("Hanorac", "Hoodie"), T("Tricou", "Tee"), T("Bluză", "Crewneck")
RACK = [
    # the pieces that hang on the rail: file in shop/img/p (these photos include the hanger), name (same in every language), kind
    ("hoodie-bigmark-black-front", "Big Mark hoodie", HOODIE),
    ("tee-cutout-black-front", "Cutout tee", TEE),
    ("crew-sunfade-yellow-front", "Sunfade crewneck", CREWNECK),
    ("tee-ramp-ecru-front", "Ramp tee", TEE),
    ("hoodie-split-grey-front", "Split hoodie", HOODIE),
    ("tee-sequence-black-front", "Sequence tee", TEE),
    ("hoodie-livefree-black-back", "Live Free hoodie", HOODIE),
    ("tee-tbar-ecru-front", "T-Bar tee", TEE),
    ("tee-stencil-yellow-back", "Stencil tee", TEE),
    ("hoodie-tape-grey-front", "Tape hoodie", HOODIE),
    ("tee-bleach-black-front", "Bleach tee", TEE),
    ("tee-truck-grey-front", "Truck tee", TEE),
]
# real height in px of each 760 px wide photo on the rail
RACK_H = {"hoodie-bigmark-black-front": 1021, "tee-cutout-black-front": 1004, "crew-sunfade-yellow-front": 1001, "tee-ramp-ecru-front": 1002,
          "hoodie-split-grey-front": 1067, "tee-sequence-black-front": 1011, "hoodie-livefree-black-back": 1030, "tee-tbar-ecru-front": 1006,
          "tee-stencil-yellow-back": 1026, "hoodie-tape-grey-front": 1033, "tee-bleach-black-front": 1007, "tee-truck-grey-front": 996}

# ---------------------------------------------------------------- plan drawn to scale (10 units per metre)
ROOMS = [
    # number, x, y, width, depth (metres), colour group, open to the hall?, name
    (1, 22, 10, 56, 18, "w", 1),
    (2, 0, 28, 24, 20, "w", 1),
    (3, 0, 0, 36, 10, "w", 1),
    (4, 36, 0, 46, 10, "w", 1),
    (5, 24, 28, 14, 20, "j", 1),   # one padel court, 20 x 10 m, with 2 m on each long side
    (6, 0, 10, 22, 18, "j", 1),
    (7, 78, 10, 12, 18, "j", 1),
    (8, 66, 28, 12, 20, "j", 0),
    (9, 78, 28, 12, 20, "j", 1),
    (10, 50, 28, 16, 20, "j", 0),
    (11, 38, 28, 12, 20, "f", 0),
    (12, 66, 52, 18, 8, "f", 0),
    (13, 0, 52, 10, 8, "f", 0),
    (14, 36, 52, 16, 8, "f", 0),
    (15, 52, 52, 14, 8, "f", 0),
    (16, 24, 52, 12, 8, "s", 0),
    (17, 10, 52, 14, 8, "s", 0),
    (18, 84, 52, 16, 8, "s", 0),
    (19, 0, 48, 90, 4, "s", 1),
    (20, 82, 0, 8, 10, "s", 0),
    (21, 90, 0, 10, 52, "s", 0),
]
assert sum(r[3] * r[4] for r in ROOMS) == 6000
# Four groups, used by the chips above the cards, the legend and the colours of the drawing. They follow the numbers: 1-4, 5-10, 11-15, 16-21.
CATS = [("w", T("Pe roți", "On wheels")), ("j", T("Fără roți", "No wheels")), ("f", T("Familii", "Families")), ("s", T("Servicii", "Services"))]
GROUP = {r[0]: r[5] for r in ROOMS}


def plan_svg(p):
    # doors and gates: front rooms onto the walkway (one door per party room), four gates from the walkway into the hall
    # (pumptrack, Mini Action, the caged pitch, climbing; Mini Action and the pitch are fenced, so nobody cuts through them),
    # the wash block opening both onto the walkway and straight into the hostel, the training room, the workshop, outside doors
    doors = [(35, 520, 65, 520), (155, 520, 185, 520), (265, 520, 335, 520), (425, 520, 455, 520), (575, 520, 605, 520),
             (680, 520, 700, 520), (740, 520, 760, 520), (800, 520, 820, 520), (855, 520, 885, 520), (935, 520, 965, 520),
             (900, 486, 900, 514), (845, 100, 875, 100), (700, 480, 740, 480),
             (45, 480, 85, 480), (420, 480, 460, 480), (560, 480, 600, 480), (800, 480, 840, 480), (275, 600, 325, 600), (1000, 250, 1000, 280), (835, 0, 885, 0)]
    glass = [(8, 520, 30, 520), (70, 520, 94, 520), (365, 520, 420, 520), (460, 520, 515, 520), (525, 520, 570, 520),
             (610, 520, 655, 520), (664, 520, 676, 520), (704, 520, 716, 520), (724, 520, 736, 520), (764, 520, 776, 520),
             (784, 520, 796, 520), (824, 520, 836, 520)]

    def lines(cls, seg):
        return "".join(f'<path class="{cls}" d="M{a} {b}L{x} {y}"/>' for a, b, x, y in seg)

    label = p.t(T("Planul parcului la scară: rampele în mijloc, încăperile pe margine, uși, promenadă și trasee",
                  "Park plan to scale: ramps in the middle, rooms along the edges, doors, walkway and routes"))
    o = (f'<svg class="plan-svg" viewBox="-6 -6 1012 668" role="img" aria-label="{esc(label)}"><defs><marker id="ah" viewBox="0 0 10 10" '
         f'refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs>')
    for n, x, y, w, h, c, op in ROOMS:
        o += f'<rect class="r-{c}{" open" if op else ""}" x="{x * 10}" y="{y * 10}" width="{w * 10}" height="{h * 10}"/>'
    o += '<rect class="outer" x="0" y="0" width="1000" height="600"/><path class="rail-line" d="M0 480H900"/><path class="rail-line" d="M720 520V600M780 520V600"/>'
    o += lines("glass", glass) + lines("door", doors)
    for cls, ds in (("route", ["M300 590V545", "M260 500H65V440"]), ("route2", ["M340 500H820"])):
        o += "".join(f'<path class="{cls}" d="{d}" marker-end="url(#ah)"/>' for d in ds)
    for n, x, y, w, h, c, op in ROOMS:
        cx, cy = x * 10 + w * 5, y * 10 + h * 5 + 10
        if n == 19:
            cx, cy = 865, 508
        if n == 16:
            cx += 34
        o += f'<text class="n n-{c}{" sm" if n == 19 else ""}" x="{cx}" y="{cy}" text-anchor="middle">{n}</text>'
    o += f'<text class="lbl" x="335" y="640">{p.t(T("Intrare", "Entrance"))}</text>'
    o += '<path class="scale" d="M880 636H980M880 628V644M980 628V644"/><text class="lbl" x="930" y="626" text-anchor="middle">10 m</text></svg>'
    return o


def plan_legend(p):
    sep = "." if p.lang == "ro" else ","
    out = ""
    for c, name in CATS:
        items = "".join(f'<li><span>{r[0]}</span><span>{p.t(NAMES[r[0]])}</span><span class="m2">{format(r[3] * r[4], ",").replace(",", sep)} m²</span></li>'
                        for r in ROOMS if r[5] == c)
        out += f'<div><h3><span class="sw r-{c}"></span>{p.t(name)}</h3><ul>{items}</ul></div>'
    keys = [("k-door", T("Ușă sau poartă", "Door or gate")), ("k-glass", T("Perete de sticlă spre parc", "Glass wall facing the park")),
            ("k-route", T("Traseul riderilor", "Riders' route")),
            ("k-route2", T("Traseul părinților", "Parents' route"))]
    ks = "".join(f'<li><span class="key {k}"></span>{p.t(t)}</li>' for k, t in keys)
    return f'<ul class="keys">{ks}</ul><div class="legend">{out}</div>'


# ---------------------------------------------------------------- sections
def aliases(*ids):
    """Empty anchors that keep links to earlier versions of the page working."""
    return "".join(f'<span id="{i}"></span>' for i in ids)


# The size claim. It is worded as a plan because the park is not built; see README, "The size claim".
CLAIM = T("Plănuim cel mai mare parc indoor de action sports din România", "We are planning the biggest indoor action sports park in Romania")
CLAIM_NOTE = T("* După suprafața totală planificată a halei (aproximativ 6.000 m²), față de parcurile indoor de action sports deschise sau anunțate public în România, după datele publice consultate în noiembrie 2026.",
               "* By the planned total floor area of the hall (about 6,000 m²), compared with indoor action sports parks open or publicly announced in Romania, from public information checked in November 2026.")


def s_hero(p):
    img, _ = p.img("crew", p.t(T("Imagine concept: copii, adolescenți și părinți în hanorace, tricouri, șepci și o căciulă Action Cloud, văzuți din spate, privind parcul plin de rampe și plante",
                               "Concept image: kids, teenagers and parents in Action Cloud hoodies, tees, caps and a beanie, seen from behind, looking out over a park full of ramps and plants")),
                   eager=True, sizes="100vw")
    return f'''<section class="slide hero" id="top">
  {img}
  <div class="wrap hero-top">
    <p class="kicker">{p.t(CLAIM)}<a class="star" href="#despre-marime" aria-label="{esc(p.t(T("Vezi nota despre comparație", "See the note on the comparison")))}">*</a></p>
    <h1>{p.t(T("Un loc al lor.<br>Hai să-l construim.", "A place of their own.<br>Let's build it."))}</h1>
    <p class="sub">{p.t(T("Aproximativ 6.000 m², în nordul Bucureștiului. Încă nu e deschis.", "About 6,000 m², in north Bucharest. Not open yet."))}</p>
  </div>
  <div class="wrap hero-bottom">
    <div>
      <p class="by">{p.t(T("De la o echipă care construiește rampe din 2012", "From a team that has been building ramps since 2012"))}</p>
      <p class="actions">
        <a class="btn btn-white" href="#park">{p.t(T("Vezi parcul", "See the park"))}</a>
        <a class="btn btn-line" href="#crew">{p.t(T("Intră în Action Crew", "Join the Action Crew"))}</a>
      </p>
    </div>
    <span class="tag">{p.t(TAG["concept"])}</span>
  </div>
</section>'''


def s_why(p):
    """Why it matters, shown with photos from the first park, in Brașov. That park is CLOSED: everything about it is in the past tense
    and the stop says so once. One stop, about the community, not about any one person."""
    cards = [
        ("event-night", T("Un loc de întâlnire", "A place to meet"),
         T(["Seri de eveniment cu balconul plin"], ["Event nights with a full balcony"]),
         T("Eveniment de seară la Brașov: un rider cu capul în jos deasupra rampei, iar publicul filmează de la balcon", "Event night in Brașov: a rider inverted above the ramp while the crowd films from the balcony")),
        ("action-camp", T("Cresc împreună", "Growing up together"),
         T(["Action Camps: tabere de bicicletă și trotinetă"], ["Action Camps: bike and scooter camps"]),
         T("Action Camp la Brașov: copii care fac încălzirea pe rampe", "Action Camp in Brașov: kids warming up on the ramps")),
        ("rider", T("Un loc al lor, tot anul", "A place of their own, all year"),
         T(["Și iarna, și pe ploaie", "Pe roți, casca e obligatorie"], ["In winter and in the rain", "Helmets are required on wheels"]),
         T("Un rider cu cască, cu capul în jos deasupra rampei, sub sigla Action Cloud din Brașov", "A rider in a helmet, upside down above the ramp, under the Action Cloud sign in Brașov")),
    ]
    grid = "\n      ".join(p.card(k, p.t(t), p.t(l), alt=p.t(a)) for k, t, l, a in cards)
    # how it got here, in three small steps: where it started, how it was built, where it goes now
    steps = [
        ("story-2012", "2012", T("Primele sărituri, în fân", "The first jumps, into hay"), T("Fotografie reală", "Real photo"),
         T("Un rider sare cu bicicleta într-un hambar, peste o rampă de lemn, cu fân pe jos", "A rider jumps a bike in a barn, over a wooden ramp, with hay on the floor")),
        ("story-build", "Brașov", T("L-am construit noi, rampă cu rampă", "We built it ourselves, ramp by ramp"), T("Fotografie reală", "Real photo"),
         T("Scheletul din lemn al unei rampe mari, în construcție, cu doi oameni lucrând sus pe el", "The timber frame of a large ramp under construction, with two people working at the top")),
        ("story-next", p.t(T("Acum", "Now")), T("Următorul nivel: București", "The next level: Bucharest"), TAG["concept"],
         T("Planul parcului din București, văzut de sus", "The plan of the Bucharest park, seen from above")),
    ]
    story = ""
    for key, when, what, kind, alt in steps:
        img, _ = p.img(key, p.t(alt))
        story += f"<li>{img}<p><b>{when}</b>{p.t(what)}<small>{p.t(kind)}</small></p></li>"
    return f'''<section class="slide dark" id="why" data-chapter="proof">
  {aliases("impact", "story", "proof")}
  <div class="wrap">
    {p.head(T("Vin pentru rampe.<br>Rămân pentru comunitate.", "Come for the ramps.<br>Stay for the community."), T("Am văzut asta la primul nostru parc, la Brașov.", "We saw it at our first park, in Brașov."))}
    <div class="grid grid-3">
      {grid}
    </div>
    <ol class="story" aria-label="{esc(p.t(T("Cum am ajuns aici", "How we got here")))}">{story}</ol>
    <p class="note">{p.t(T("Parcul din Brașov s-a închis între timp. Fotografiile sunt de acolo.", "The Brașov park has since closed. The photos were taken there."))}</p>
  </div>
</section>'''


def s_map(p):
    """The centre of the site: the 3D plan. A tap anywhere in a room brings up that room's card; the number disc is its label.
    Without the script the rooms are plain links to the cards, which sit in a row you can scroll."""
    alt = p.t(T("Imagine concept: parcul văzut de sus, fără acoperiș. Rampele umplu mijlocul halei, încăperile numerotate sunt pe margine, intrarea e în față.",
                "Concept image: the park seen from above with the roof removed. Ramps fill the middle of the hall, numbered rooms sit along the edges, the entrance is at the front."))
    on_plan = p.t(T("Numărul de pe plan: ", "Number on the plan: "))
    cards, seen, first = [], {}, {}
    for key, num, title, labels in PLACES:
        name = p.t(title or NAMES[num])
        seen[num] = seen.get(num, 0) + 1
        cid = f"loc-{num}" if seen[num] == 1 else f"loc-{num}-{seen[num]}"
        first.setdefault(GROUP[num], cid)
        cards.append(f'<li id="{cid}" data-n="{num}" data-group="{GROUP[num]}"><div class="card">{p.media(key, p.t(ALT[key]))}<div class="card-body">'
                     f'<h3><span class="num"><span class="vh">{on_plan}</span>{num}</span> {name}</h3>{p.labels(p.t(labels))}</div></div></li>')
    spots = ""
    for num in sorted(SPOTS):
        x, y = SPOTS[num]
        hits = "".join(f'<span class="hit" style="left:{a}%;top:{b}%;width:{round(c - a, 2)}%;height:{round(d - b, 2)}%"></span>' for a, b, c, d in AREAS[num])
        spots += (f'<li><a class="spot{" long" if num == 19 else ""}" href="#loc-{num}" data-spot="{num}">{hits}'
                  f'<span class="disc" style="left:{x}%;top:{y}%">{num}</span><span class="vh">, {p.t(NAMES[num])}</span></a></li>')
    chips = "".join(f'<li><a href="#{first[c]}" data-group="{c}">{p.t(name)}</a></li>' for c, name in CATS)
    img, _ = p.img("plan-3d", alt, sizes="(max-width: 60rem) 100vw, 56rem")
    img = img.replace(' loading="lazy"', "")   # the plan is the stop: it is never lazy
    return f'''<section class="slide" id="park" data-chapter="park">
  {aliases("inside", "zones", "visit", "arrive", "wheels", "more", "parents")}
  <div class="wrap map" data-map>
    <div class="map-head">
      {p.head(T("Intră în parc.", "Step inside."), T('<span class="by-tap">Apasă pe un număr</span><span class="by-mouse">Treci cu mouse-ul peste un număr</span> și vezi ce e acolo.',
                                                         '<span class="by-tap">Tap a number</span><span class="by-mouse">Point at a number</span> to see what is there.'))}
      <a class="skip" href="#locuri">{p.t(T("Sari peste plan", "Skip the plan"))}</a>
    </div>
    <div class="map-pic">
      {img}
      <ol class="spots" aria-label="{esc(p.t(T("Locurile din parc, după numărul de pe plan", "The places in the park, by their number on the plan")))}">{spots}</ol>
      <span class="tag">{p.t(TAG["concept"])}</span>
    </div>
    <div class="map-side" data-rail>
      <ul class="chips" aria-label="{esc(p.t(T("Sari la", "Jump to")))}">{chips}</ul>
      <ul class="rail map-rail" id="locuri" tabindex="0" role="list" aria-label="{esc(p.t(T("Locurile din parc", "The places in the park")))}">{"".join(cards)}</ul>
      <div class="rail-tools"><p class="rail-count"><span class="swipe">{p.t(T("Glisează pentru mai multe", "Swipe for more"))}</span></p>
        <div class="arrows"><button type="button" data-prev aria-label="{esc(p.t(T("Locul anterior", "Previous place")))}">←</button><button type="button" data-next aria-label="{esc(p.t(T("Locul următor", "Next place")))}">→</button></div></div>
      <p class="vh" aria-live="polite" data-say></p>
    </div>
    <div class="map-foot">
      <p class="note">{p.t(T("Plan orientativ: se adaptează la clădirea finală. Locația și data deschiderii nu sunt încă anunțate.", "Indicative plan: it will be adapted to the final building. The location and the opening date are not announced yet."))}</p>
      <p class="actions"><a class="btn btn-dark btn-small" href="#crew">{p.t(T("Intră în Action Crew", "Join the Action Crew"))}</a><a class="btn btn-line btn-small" href="#sponsors">{p.t(T("Devino sponsor", "Become a sponsor"))}</a></p>
    </div>
  </div>
  <div class="wrap">
    <details class="more">
      <summary>{p.t(T("Planul la scară și suprafețele", "Scale plan and floor areas"))}</summary>
      <div class="more-body">
        <div class="plan-scroll" tabindex="0" role="group" aria-label="{esc(p.t(T("Planul la scară, se derulează în lateral", "Scale plan, scrolls sideways")))}">{plan_svg(p)}</div>
        {plan_legend(p)}
        <p class="note">{p.t(T("Plan orientativ pentru o hală de 100 × 60 m, cu suprafețe aproximative.", "Indicative plan for a 100 × 60 m hall, with approximate floor areas."))}</p>
      </div>
    </details>
  </div>
</section>'''


def s_crew(p):
    rides = [T("Trotinetă", "Scooter"), T("BMX", "BMX"), T("Mountain bike", "Mountain bike"), T("Skate", "Skateboard"), T("Altceva", "Something else"), T("Sunt părinte", "I'm a parent")]
    opts = "".join(f"<option>{p.t(r)}</option>" for r in rides)
    action = "/multumim.html" if p.lang == "ro" else "/en/thanks.html"
    pic = p.media("huddle", p.t(T("Imagine concept: mâini strânse la mijloc, într-un cerc de rideri în hanorace Action Cloud", "Concept image: hands stacked in the middle of a circle of riders in Action Cloud hoodies")))
    share_text = p.t(T("Vreau să intru în Action Crew, e gratuit. Mă înscrii? ", "I want to join the Action Crew, it's free. Will you sign me up? ")) + (SITE if p.lang == "ro" else SITE + "en/") + "#crew"
    return f'''<section class="slide" id="crew" data-chapter="crew">
  {aliases("join")}
  <div class="wrap split">
    <div class="split-head">
      {p.head(T("Intră în Action Crew.", "Join the Action Crew."), T("Gratuit. Când anunțăm locația și data deschiderii, tu afli primul.", "Free. When we announce the location and the opening date, you hear first."))}
    </div>
    <form name="crew" method="POST" action="{action}" data-netlify="true" data-netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="crew">
      <input type="hidden" name="language" value="{p.lang}">
      <p class="hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="field"><label for="c-name">{p.t(T("Prenume", "First name"))}</label><input id="c-name" name="name" autocomplete="given-name" required></div>
      <div class="field"><label for="c-email">{p.t(T("E-mail", "Email"))}</label><input id="c-email" name="email" type="email" autocomplete="email" required aria-describedby="c-help">
        <p class="help" id="c-help">{p.t(T("Ai sub 16 ani? Roagă un părinte să te înscrie.", "Under 16? Ask a parent to sign you up."))}</p></div>
      <div class="field"><label for="c-ride">{p.t(T("Cu ce te dai?", "What do you ride?"))}</label><select id="c-ride" name="rides">{opts}</select></div>
      <label class="check"><input type="checkbox" name="consent" value="yes" required> <span>{p.t(T("Vreau să primesc pe e-mail noutăți de la Action Cloud. Mă pot dezabona oricând.", "I want to get Action Cloud news by email. I can unsubscribe at any time."))}</span></label>
      <p class="actions">
        <button class="btn btn-dark" type="submit">{p.t(T("Intră în Action Crew", "Join the Action Crew"))}</button>
        <a class="btn btn-line" href="https://wa.me/?text={quote(share_text)}" rel="noopener">{p.t(T("Trimite unui părinte pe WhatsApp", "Send to a parent on WhatsApp"))}</a>
      </p>
    </form>
    <div class="split-after">
      {p.labels(p.t(T(["Datele Action Camps", "Anunț când se deschid comenzile din magazin"], ["Action Camp dates", "A heads-up when shop orders open"])))}
      <div class="crew-pic">{pic}</div>
    </div>
  </div>
</section>'''


def s_shop(p):
    """The clothes rail from the shop: pieces hang from a steel bar, you drag it and they swing (site.js)."""
    shop = f"{p.pre}shop/?lang={p.lang}"
    mock = p.t(TAG["mock"])
    hang = ""
    for f, name, kind in RACK:
        tall = RACK_H[f]
        # in English the product name already says what it is ("Big Mark hoodie")
        kind_label = f"<span>{p.t(kind)}</span>" if p.lang == "ro" else ""
        hang += (f'<li class="hang"><a class="piece" href="{shop}" draggable="false"><span class="cloth"><img src="{p.pre}shop/img/p/{f}.webp" width="760" height="{tall}" loading="lazy" draggable="false" alt="{esc(mock)}: {esc(name)}"></span>'
                 f'<span class="piece-label"><b>{name}</b>{kind_label}</span></a></li>')
    prev = p.t(T("Mută bara spre stânga", "Move the rail left"))
    nxt = p.t(T("Mută bara spre dreapta", "Move the rail right"))
    return f'''<section class="slide dark" id="shop" data-chapter="shop">
  <div class="wrap">
    {p.head(T("Poartă Action Cloud.", "Wear Action Cloud."), T("O parte din fiecare comandă merge către mini rampe în curțile școlilor. Prima e pentru Hărman.", "Part of every order goes into mini ramps for schoolyards. The first one is for Hărman."))}
  </div>
  <div class="rack" data-rack>
    <div class="rack-bar" aria-hidden="true"></div>
    <ul class="rack-track" tabindex="0" aria-label="{esc(p.t(T("Bara cu haine: hanorace, bluze și tricouri", "Clothes rail: hoodies, crewnecks and tees")))}">{hang}</ul>
    <div class="wrap rail-tools">
      <p class="rail-count">{p.t(T("Trage de bară. Imaginile sunt machete, iar comenzile online se deschid în curând.", "Drag the rail. The pictures are mock-ups and online orders open soon."))}</p>
      <a class="btn btn-white" href="{shop}">{p.t(T("Vezi magazinul", "See the shop"))}</a>
      <div class="arrows"><button type="button" data-prev aria-label="{esc(prev)}">←</button><button type="button" data-next aria-label="{esc(nxt)}">→</button></div>
    </div>
  </div>
</section>'''


# The visitor estimate shown to sponsors: entries through the door, parents included, for the planned hall of about
# 6,000 m². These are the corrected figures of the visitor study (a skeptic's review of two estimates), not a count.
# They always appear with the word "estimate", their range and the note below; never as reach, impressions or
# "different people". See "The visitor estimate" in the README before changing a figure.
CROWD = [
    (T("50.000", "50,000"), T("intrări în primul an", "entries in the first year"),
     T("între 32.000 și 77.000", "between 32,000 and 77,000")),
    (T("75.000", "75,000"), T("intrări pe an, din anul 3", "entries a year, from year 3"),
     T("între 45.000 și 110.000", "between 45,000 and 110,000")),
]
CROWD_MIX = (T("6 din 10", "6 in 10"), T("au sub 18 ani", "are under 18"),
             T("restul: părinți și rideri adulți", "the rest: parents and adult riders"))


def crowd(p):
    about = p.t(T("circa", "about"))
    rows = "".join(f'<li><strong><span aria-hidden="true">≈&nbsp;</span><span class="vh">{about} </span>{p.t(n)}</strong>'
                   f'<span>{p.t(what)}<small>{p.t(span)}</small></span></li>' for n, what, span in CROWD)
    n, what, span = CROWD_MIX
    rows += f'<li><strong>{p.t(n)}</strong><span>{p.t(what)}<small>{p.t(span)}</small></span></li>'
    return f'''<div class="crowd" id="estimare">
      <h3><span class="est">{p.t(T("Estimare", "Estimate"))}</span> {p.t(T("Câți oameni intră pe ușă", "How many people come through the door"))}</h3>
      <ul>{rows}</ul>
      <p>{p.t(T("Parcul e în plan, nu construit: sunt estimări, nu numărători. O intrare înseamnă oricine trece de ușă, inclusiv părinții. După deschidere îți raportăm intrările numărate la ușă.", "The park is planned, not built: these are estimates, not counts. An entry is anyone who comes through the door, parents included. Once open, we report the entries counted at the door."))}</p>
      <details>
        <summary>{p.t(T("Cum am estimat", "How we estimated"))}</summary>
        <p>{p.t(T("Am pornit de la câte vizite pe metru pătrat raportează parcurile indoor de action sports din străinătate și am aplicat cifra prudentă la planul nostru de aproximativ 6.000 m². În România nu există o sală comparabilă și nimeni nu a numărat câți oameni practică aceste sporturi. Primul an e socotit la circa 70% dintr-un an așezat. Cam patru din cinci intrări sunt participanți plătitori; restul sunt adulți însoțitori. Împărțirea pe vârste e o presupunere, pe care o înlocuim cu date din bilete la șase luni după deschidere.", "We started from the visits per square metre that indoor action sports parks abroad report, and applied the cautious figure to our plan of about 6,000 m². There is no comparable hall in Romania, and nobody has counted how many people here ride. The first year is taken at about 70% of a settled year. About four in five entries are paying participants; the rest are accompanying adults. The split by age is an assumption, which we replace with ticket data six months after opening."))}</p>
      </details>
    </div>'''


def s_sponsors(p):
    per = p.t(T("/ an", "/ year"))
    per_said = p.t(T("pe an", "a year"))
    choose = p.t(T("Alege pachetul", "Choose this package"))
    example = p.t(T("Imagine concept: exemplu de amplasare", "Concept image: example placement"))
    items, ladder = [], ""
    for tid, key, name, pr_ro, pr_en, places, labels in TIERS:
        price = f"{pr_ro}&nbsp;€" if p.lang == "ro" else f"€{pr_en}"
        pl = f'<p class="places">{p.t(places)}</p>' if places else ""
        alt = p.t(ALT[key])
        if p.lang == "en" and key + "-en" in PICS:  # a picture with words in it has an English twin
            key += "-en"
        img, _ = p.img(key, alt)
        media = f'<div class="media">{img}<span class="tag">{example}</span></div>'
        body = (f'<h3>{p.t(name)}</h3><p class="price">{price} <small>{per}</small></p>{pl}{p.labels(p.t(labels))}'
                f'<a class="btn btn-dark btn-small" href="#contact" data-pick="{esc(p.t(name))}">{choose}<span class="vh">: {p.t(name)}</span></a>')
        items.append((f' id="{tid}"', f'<div class="card tier">{media}<div class="card-body">{body}</div></div>'))
        ladder += f'<li><a href="#{tid}" data-jump><span class="vh">{p.t(name)}: </span>{price}<span class="vh"> {per_said}</span></a></li>'
    return f'''<section class="slide yellow" id="sponsors" data-chapter="sponsors">
  {aliases("packages")}
  <div class="wrap">
    <div class="sp-top">
      {p.head(T("Unde apare brandul tău.", "Where your brand appears."), T("Tu susții parcul, noi îți dăm vizibilitate. De la 100 la 200.000 € pe an.", "You back the park, we give you visibility. From €100 to €200,000 a year."))}
      {crowd(p)}
    </div>
    <ul class="ladder" aria-label="{esc(p.t(T("Pachetele, după preț", "The packages, by price")))}">{ladder}</ul>
  </div>
  {p.rail("tier-rail", items, cls="tiers", label=p.t(T("Pachetele de sponsorizare", "The sponsorship packages")))}
  <div class="wrap">
    <dl class="facts">
      <div><dt>{p.t(T("În toate pachetele", "In every package"))}</dt><dd>{p.t(T("Invitații la evenimente și la Action Cups. De la „Partener de rampă” în sus, primești și plasare de produs în clipuri.", "Invitations to events and Action Cups. From \"Ramp partner\" up, you also get product placement in clips."))}</dd></div>
      <div><dt>{p.t(T("Până la deschidere", "Until it opens"))}</dt><dd>{p.t(T("Parcul din București este încă în plan. Vizibilitatea din parc începe la deschidere, iar ce primești până atunci stabilim împreună.", "The Bucharest park is still a plan. Visibility in the park starts when it opens, and we agree together what you get until then."))}</dd></div>
    </dl>
    <details class="more">
      <summary>{p.t(T("Avantaj fiscal pentru firme", "Tax advantage for companies"))}</summary>
      <div class="more-body"><p class="note">{p.t(T("În România, firmele care plătesc impozit pe profit pot scădea din impozit sponsorizările către asociațiile înscrise în Registrul entităților pentru care se acordă deduceri fiscale. Limita legală: cea mai mică valoare dintre 0,75% din cifra de afaceri și 20% din impozitul pe profit datorat. Verifică împreună cu contabilul tău regulile actuale și înscrierea asociației în registru.", "In Romania, companies that pay profit tax can deduct sponsorships from the tax they owe, provided the association is listed in the register of entities eligible for tax deductions. The legal limit is the lower of 0.75% of turnover and 20% of the profit tax owed. Check the current rules and the association's listing with your accountant."))}</p></div>
    </details>
  </div>
</section>'''


def s_contact(p):
    opts = f'<option>{p.t(T("Încă nu știu", "Not sure yet"))}</option>' + "".join(f"<option>{p.t(t[2])}</option>" for t in TIERS)
    action = "/multumim.html" if p.lang == "ro" else "/en/thanks.html"
    optional = p.t(T("(opțional)", "(optional)"))
    return f'''<section class="slide dark" id="contact" data-chapter="sponsors">
  <div class="wrap split">
    <div class="split-head">
      {p.head(T("Hai să vorbim.", "Let's talk."), T("Christoph Baier, fondatorul Action Cloud, îți răspunde personal.", "Christoph Baier, founder of Action Cloud, will reply personally."))}
    </div>
    <form name="sponsor" method="POST" action="{action}" data-netlify="true" data-netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="sponsor">
      <input type="hidden" name="language" value="{p.lang}">
      <p class="hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="field"><label for="f-package">{p.t(T("Pachetul care te interesează", "Package you are interested in"))}</label><select id="f-package" name="package">{opts}</select></div>
      <div class="field"><label for="f-name">{p.t(T("Nume", "Name"))}</label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-company">{p.t(T("Companie", "Company"))} <span>{optional}</span></label><input id="f-company" name="company" autocomplete="organization"></div>
      <div class="field"><label for="f-email">{p.t(T("E-mail", "Email"))}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-message">{p.t(T("Mesaj", "Message"))} <span>{optional}</span></label><textarea id="f-message" name="message" rows="3"></textarea></div>
      <button class="btn btn-yellow" type="submit">{p.t(T("Trimite mesajul", "Send message"))}</button>
      <p class="help">{p.t(T("Folosim datele doar ca să îți răspundem.", "We use your details only to reply to you."))}</p>
    </form>
    <div class="split-after">
      <p class="note">{p.t(T("Contractul de sponsorizare se semnează cu asociația nonprofit Rosenau Cycling. Perioada și moneda de plată le stabilim împreună; prețurile sunt în euro.", "The sponsorship contract is signed with the non-profit Rosenau Cycling association. We agree the contract period and the payment currency together; prices are in euro."))}</p>
      <p class="actions after"><a class="btn btn-line" href="mailto:{MAIL}">{MAIL}</a></p>
    </div>
  </div>
</section>'''


def sections(p):
    return [s_hero(p), s_map(p), s_why(p), s_crew(p), s_shop(p), s_sponsors(p), s_contact(p)]


# chapter key, id it links to, name in the top bar
CHAPTERS = [("park", "park", T("Parcul", "The park")), ("proof", "why", T("Comunitatea", "Community")), ("crew", "crew", T("Action Crew", "Action Crew")),
            ("shop", "shop", T("Magazin", "Shop"))]


def page(lang):
    p = Page(lang)
    title = p.t(T("Action Cloud București | Un loc al lor", "Action Cloud Bucharest | A place of their own"))
    desc = p.t(T("Plănuim cel mai mare parc indoor de action sports din România: aproximativ 6.000 m², în nordul Bucureștiului. Intră în Action Crew sau devino sponsor.",
                 "We are planning the biggest indoor action sports park in Romania: about 6,000 m², in north Bucharest. Join the Action Crew or become a sponsor."))
    self_url = SITE if lang == "ro" else SITE + "en/"
    other = ('<a class="lang" href="en/" lang="en" hreflang="en">English</a>' if lang == "ro"
             else '<a class="lang" href="../" lang="ro" hreflang="ro">Română</a>')
    nav = "".join(f'<a href="#{target}" data-for="{k}">{p.t(t)}</a>' for k, target, t in CHAPTERS)
    body = "\n\n".join(sections(p))
    foot_note = p.t(T("Action Cloud este administrat de asociația Rosenau Cycling. Imaginile marcate „Imagine concept” sunt generate pe calculator și arată planul pentru București. Fotografiile sunt de la primul nostru parc, cel din Brașov, care s-a închis între timp.",
                      "Action Cloud is run by the Rosenau Cycling association. Pictures marked \"Concept image\" are computer-generated and show the plan for Bucharest. The photos are from our first park, in Brașov, which has since closed."))
    return f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{esc(desc)}">
<!-- Draft: noindex -->
<meta name="robots" content="noindex">
<meta name="theme-color" content="#262626">
<link rel="icon" href="{p.pre}assets/favicon.svg" type="image/svg+xml">
<link rel="alternate" hreflang="ro" href="{SITE}">
<link rel="alternate" hreflang="en" href="{SITE}en/">
<meta property="og:type" content="website">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{SITE}assets/img/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Action Cloud">
<meta property="og:locale" content="{"ro_RO" if lang == "ro" else "en_GB"}">
<meta property="og:url" content="{self_url}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="{p.pre}assets/fonts/barlow-semi-condensed-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{p.pre}styles.css">
</head>
<body>

<a class="skip" href="#main">{p.t(T("Sari la conținut", "Skip to content"))}</a>

<header class="bar">
  <a class="brand" href="#top" aria-label="{esc(p.t(T("Action Cloud București, înapoi sus", "Action Cloud Bucharest, back to top")))}"><img src="{p.pre}assets/img/logo-yellow.webp" width="472" height="256" alt="Action Cloud"></a>
  <nav class="chapters" aria-label="{esc(p.t(T("Capitole", "Chapters")))}">{nav}</nav>
  {other}
  <a class="btn btn-yellow btn-small" href="#sponsors">{p.t(T("Devino sponsor", "Become a sponsor"))}</a>
</header>

<main id="main">

{body}

</main>

<footer class="foot">
  <div class="wrap">
    <img src="{p.pre}assets/img/logo-yellow.webp" width="472" height="256" alt="Action Cloud" loading="lazy">
    <ul>
      <li><a href="https://www.instagram.com/action.cloud/" rel="noopener">Instagram</a></li>
      <li><a href="https://www.tiktok.com/@action.cloud" rel="noopener">TikTok</a></li>
      <li><a href="mailto:{MAIL}">{MAIL}</a></li>
      <li><a href="{p.pre}shop/?lang={lang}">{p.t(T("Magazin", "Shop"))}</a></li>
    </ul>
    <p>{foot_note}</p>
    <p id="despre-marime">{p.t(CLAIM_NOTE)}</p>
  </div>
</footer>

<script src="{p.pre}site.js" defer></script>
</body>
</html>
'''


def thanks(lang):
    p = Page(lang)
    t = p.t(T("Mulțumim | Action Cloud București", "Thank you | Action Cloud Bucharest"))
    return f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t}</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="{p.pre}styles.css">
</head>
<body>
<main class="thanks dark">
  <div class="wrap">
    <h1>{p.t(T("Mulțumim!", "Thank you!"))}</h1>
    <p>{p.t(T("Am primit datele tale. Îți scriem în curând.", "We've got your details. We'll write to you soon."))}</p>
    <p class="actions">
      <a class="btn btn-yellow" href="./">{p.t(T("Înapoi la site", "Back to the site"))}</a>
      <a class="btn btn-line" href="https://www.instagram.com/action.cloud/" rel="noopener">{p.t(T("Urmărește @action.cloud", "Follow @action.cloud"))}</a>
    </p>
  </div>
</main>
</body>
</html>
'''


def write(rel, text):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("wrote", rel, len(text))


def check_pictures():
    """Stop with a clear message instead of publishing a page with a missing picture."""
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    missing = []
    for key, (f, w, h, _) in PICS.items():
        if not os.path.exists(os.path.join(here, "assets", "img", f)):
            missing.append(f"assets/img/{f}")
        if w > 1000 and not os.path.exists(os.path.join(here, "assets", "img", "s", f)):
            missing.append(f"assets/img/s/{f} (run tools/thumbs.py)")
    for f in RACK_H:
        if not os.path.exists(os.path.join(here, "shop", "img", "p", f + ".webp")):
            missing.append(f"shop/img/p/{f}.webp")
    if missing:
        sys.exit("Missing pictures:\n  " + "\n  ".join(missing))


if __name__ == "__main__":
    check_pictures()
    check_plan()
    write("index.html", page("ro"))
    write("en/index.html", page("en"))
    write("multumim.html", thanks("ro"))
    write("en/thanks.html", thanks("en"))
