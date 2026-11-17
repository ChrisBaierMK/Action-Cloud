#!/usr/bin/env python3
"""Builds the Action Cloud pages from one source of content.

Run:  python3 tools/build.py            (writes index.html, en/index.html and the two thank-you pages)

Every visible text lives in this file as a (Romanian, English) pair, so the two pages cannot drift apart.
The pages are plain HTML; styles.css and site.js are hand-written and not generated.
"""
import html
import os
import sys

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
    "bowl": ("concept-bowl.webp", 1600, 1195, "concept"),
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
    "plan-3d": ("plan-3d.webp", 2000, 1131, "concept"),
    "huddle": ("concept-huddle.webp", 1600, 1195, "concept"),
    "tier-naming": ("tier-naming.webp", 1600, 1195, "concept"),
    "tier-zone": ("tier-zone.webp", 1600, 1195, "concept"),
    "tier-attraction": ("tier-attraction.webp", 1600, 1195, "concept"),
    "tier-programme": ("tier-programme.webp", 1600, 1195, "concept"),
    "tier-feature": ("tier-feature.webp", 1600, 1195, "concept"),
    "tier-local": ("tier-local.webp", 1600, 1195, "concept"),
    "tier-supporter": ("tier-supporter.webp", 1600, 1195, "concept"),
    "park-brasov": ("park-brasov.webp", 989, 900, "real"),
    "build": ("build-2012-2023.webp", 1600, 901, "real"),
    "action-camp": ("action-camp.webp", 1600, 720, "real"),
    "event-night": ("event-night.webp", 1229, 922, "real"),
    "founder": ("founder.webp", 1600, 1067, "real"),
    "rider": ("rider-inverted.webp", 989, 900, "real"),
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

    def img(self, key, alt, eager=False, kind=None, sizes="(max-width: 60rem) 82vw, 26rem"):
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

    def rail(self, rid, items, cls="", count=None):
        """items: list of (li attributes, inner html)."""
        lis = "".join(f"<li{a}>{inner}</li>" for a, inner in items)
        cnt = ""
        if count:
            n = len(items)
            one, few, many = count
            txt = (one if n == 1 else many if n >= 20 else few).replace("{n}", str(n))
            cnt = f'<p class="rail-count" aria-live="polite" data-one="{esc(one)}" data-few="{esc(few)}" data-many="{esc(many)}">{txt}</p>'
        prev = self.t(T("Înapoi", "Back"))
        nxt = self.t(T("Înainte", "Forward"))
        return (f'<div id="{rid}" data-rail>\n<ul class="rail{" " + cls if cls else ""}">{lis}</ul>\n'
                f'<div class="wrap rail-tools">{cnt}<div class="arrows"><button type="button" data-prev aria-label="{prev}">←</button>'
                f'<button type="button" data-next aria-label="{nxt}">→</button></div></div>\n</div>')

    def head(self, h, sub=None, level=2):
        s = f"<p>{self.t(sub)}</p>" if sub else ""
        return f'<div class="head"><h{level}>{self.t(h)}</h{level}>{s}</div>'


# ---------------------------------------------------------------- content
# One name per zone, used on the cards and on the plan. Keyed by the number on the plan.
NAMES = {
    1: T("Send Room și Fun Room", "Send Room and Fun Room"),
    2: T("Pumptrack", "Pumptrack"),
    3: T("Săritura pe airbag", "Big airbag jump"),
    4: T("Mega rampa", "Mega ramp"),
    5: T("Bowl", "Bowl"),
    6: T("Sala de trambuline", "Trampoline hall"),
    7: T("Parkour și street workout", "Parkour and street workout"),
    8: T("Antrenament funcțional și studio de cycling", "Functional training and cycling studio"),
    9: T("Cățărat și traseu ninja", "Climbing and ninja course"),
    10: T("Street soccer și baschet", "Street soccer and streetball"),
    11: T("Mini Action", "Mini Action"),
    12: T("3 săli de petreceri", "3 party rooms"),
    13: T("Sală de gaming", "Gaming room"),
    14: T("Cafenea pentru părinți", "Café for parents"),
    15: T("Burgeri", "Burger bar"),
    16: T("Intrare și recepție", "Entrance and reception"),
    17: T("Magazin, service și închirieri", "Shop, service and rentals"),
    18: T("Vestiare, toalete și dușuri", "Changing rooms, toilets and showers"),
    19: T("Promenada verde", "The green walkway"),
    20: T("Depozit și atelier de rampe", "Storage and ramp workshop"),
    21: T("Hostel", "Hostel"),
}
# Zone cards in walking order: picture, number on the plan, title (None = the plan name), labels, filter tags.
# Tags: a2 = ages 2–6, a7 = 7–12, a13 = 13–18, ad = adults; sc scooter, bmx, mtb, sk skate, nw no wheels.
ZONES = [
    ("entrance", 16, None, T(["Bilet online", "Acordul părinților, online", "Vezi pe site cât e de aglomerat"],
                             ["Online ticket", "Parental consent online", "See online how busy it is"]), "a2 a7 a13 ad sc bmx mtb sk nw"),
    ("service", 17, None, T(["Service pentru biciclete și trotinete", "Loc pentru bicicleta ta", "Închiriezi tot ce-ți trebuie"],
                            ["Bike and scooter service", "Storage for your own bike", "Rent everything you need"]), "a7 a13 ad sc bmx mtb sk"),
    ("send-room", 1, None, T(["Fun Room: începători", "Send Room: avansați", "Groapă cu bureți"],
                             ["Fun Room: beginners", "Send Room: advanced", "Foam pit"]), "a7 a13 ad sc bmx mtb sk"),
    ("pumptrack", 2, None, T(["Prinzi viteză fără să pedalezi", "Orice are roți"], ["Build speed without pedalling", "Anything on wheels"]), "a7 a13 ad sc bmx mtb sk"),
    ("big-airbag", 3, None, T(["Biciclete, schiuri, snowboard", "Trucuri cu aterizare moale"], ["Bikes, skis, snowboards", "Tricks with a soft landing"]), "a13 ad bmx mtb"),
    ("mega-ramp", 4, None, T(["Pentru profesioniști", "Show-uri și Action Cups"], ["For pros", "Shows and Action Cups"]), "a13 ad bmx mtb"),
    ("bowl", 5, None, T(["Skate, trotinetă, BMX"], ["Skate, scooter, BMX"]), "a7 a13 ad sk sc bmx"),
    ("trampolines", 6, None, T(["Salturi și rotații", "Aterizare pe airbag"], ["Flips and spins", "Airbag landing"]), "a7 a13 nw"),
    ("parkour", 7, None, T(["Cutii, ziduri, bare"], ["Boxes, walls, bars"]), "a13 ad nw"),
    ("climbing-ninja", 9, None, T(["Și pentru cei care nu se dau pe roți"], ["Also for kids who don't ride"]), "a7 a13 nw"),
    ("street-soccer", 10, None, T(["Teren în cușcă", "Perete cu ținte"], ["Caged pitch", "Target wall"]), "a7 a13 ad nw"),
    ("mini-action", 11, None, T(["2–6 ani", "Biciclete fără pedale", "Loc de joacă moale"], ["Ages 2–6", "Balance bikes", "Soft play"]), "a2"),
    ("training", 8, T("Antrenament funcțional", "Functional training"), T(["Pentru rideri și părinți"], ["For riders and parents"]), "a13 ad nw"),
    ("cycling", 8, T("Studio de cycling", "Cycling studio"), T(["Părinții se antrenează cât timp copiii sunt în parc"], ["Parents train while the kids ride"]), "ad"),
    ("bistro", 14, None, T(["Vedere spre Mini Action și rampe"], ["Looks onto Mini Action and the ramps"]), "a2 ad"),
    ("walkway", 19, None, T(["Plante de-a lungul promenadei", "Bănci cu vedere spre rampe"], ["Plants all along the walkway", "Benches facing the ramps"]), "a2 ad"),
    ("burgers", 15, None, T(["Meniu de prânz", "Vedere spre parc"], ["Lunch menu", "View of the park"]), "a7 a13 ad"),
    ("gaming", 13, None, T(["Console și ecrane mari", "Pauză între sesiuni"], ["Consoles and big screens", "A break between sessions"]), "a7 a13"),
    ("birthday", 12, None, T(["Petreceri de ziua copiilor", "Perete de sticlă spre parc"], ["Kids' birthday parties", "Glass wall onto the park"]), "a2 a7"),
    ("hostel", 21, None, T(["Cazare în aceeași clădire", "Pentru tabere și competiții"], ["A place to stay in the same building", "For camps and competitions"]), "a7 a13 ad"),
]
FILTERS = [
    ("all", T("Toate", "All")), ("a2", T("2–6 ani", "Ages 2–6")), ("a7", T("7–12 ani", "Ages 7–12")),
    ("a13", T("13–18 ani", "Ages 13–18")), ("ad", T("Adulți", "Adults")), None,
    ("sc", T("Trotinetă", "Scooter")), ("bmx", T("BMX", "BMX")), ("mtb", T("Mountain bike", "Mountain bike")),
    ("sk", T("Skate", "Skate")), ("nw", T("Fără roți", "No wheels")),
]
TIERS = [
    # picture, name, price ro, price en, places, labels (what the sponsor gets)
    ("tier-naming", T("Partener principal", "Main partner"), "1.000.000", "1,000,000", T("1 loc", "1 place"),
     T(["Parcul îți poartă numele", "Logo pe fațadă și la intrare", "În tot conținutul și la evenimente"],
       ["The park carries your name", "Logo on the façade and entrance", "In all content and at events"])),
    ("tier-zone", T("Partener de zonă", "Zone partner"), "250.000", "250,000", T("4–5 locuri", "4–5 places"),
     T(["O zonă îți poartă numele", "Logo pe rampele ei", "Reels filmate în zonă"],
       ["A zone carries your name", "Logo on its ramps", "Reels shot in the zone"])),
    ("tier-attraction", T("Partener de atracție", "Attraction partner"), "100.000", "100,000", T("4 locuri", "4 places"),
     T(["Mega rampă, airbag, bowl sau cățărat", "Logo pe atracție", "Clipuri filmate acolo"],
       ["Mega ramp, airbag, bowl or climbing", "Logo on the attraction", "Clips shot there"])),
    ("tier-programme", T("Partener de program", "Programme partner"), "50.000", "50,000", T("3 locuri", "3 places"),
     T(["Tabere, Action Cups sau școli", "Un program cu brandul tău", "Mostre și produse la fața locului"],
       ["Camps, Action Cups or schools", "A programme with your brand", "Samples and products on site"])),
    ("tier-feature", T("Partener de rampă", "Ramp partner"), "15.000", "15,000", None,
     T(["Logo pe o rampă sau un obstacol", "Mențiuni pe rețelele sociale"], ["Logo on a ramp or obstacle", "Social media mentions"])),
    ("tier-local", T("Partener local", "Local partner"), "5.000", "5,000", None,
     T(["Logo pe peretele susținătorilor", "Logo pe site, cu link"], ["Logo on the supporter wall", "Logo on the website, with a link"])),
    ("tier-supporter", T("Susținător", "Supporter"), "500", "500", None,
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

# ---------------------------------------------------------------- plan drawn to scale (10 units per metre)
ROOMS = [
    # number, x, y, width, depth (metres), colour group, open to the hall?, name
    (1, 22, 10, 56, 18, "w", 1),
    (2, 0, 28, 24, 20, "w", 1),
    (3, 0, 0, 36, 10, "w", 1),
    (4, 36, 0, 46, 10, "w", 1),
    (5, 24, 28, 14, 20, "w", 1),
    (6, 0, 10, 22, 18, "j", 1),
    (7, 78, 10, 12, 18, "j", 1),
    (8, 66, 28, 12, 20, "j", 0),
    (9, 78, 28, 12, 20, "j", 1),
    (10, 50, 28, 16, 20, "j", 1),
    (11, 38, 28, 12, 20, "f", 1),
    (12, 82, 52, 18, 8, "f", 0),
    (13, 72, 52, 10, 8, "f", 0),
    (14, 42, 52, 16, 8, "f", 0),
    (15, 58, 52, 14, 8, "f", 0),
    (16, 30, 52, 12, 8, "s", 0),
    (17, 16, 52, 14, 8, "s", 0),
    (18, 0, 52, 16, 8, "s", 0),
    (19, 0, 48, 90, 4, "s", 1),
    (20, 82, 0, 8, 10, "s", 0),
    (21, 90, 0, 10, 52, "h", 0),
]
assert sum(r[3] * r[4] for r in ROOMS) == 6000
CATS = [("w", T("Pe roți", "On wheels")), ("j", T("Fără roți", "No wheels")), ("f", T("Pentru familii", "For families")),
        ("s", T("Servicii", "Services")), ("h", T("Cazare", "Accommodation"))]


def plan_svg(p):
    # doors and gates: front rooms onto the walkway, three gates from the walkway into the hall, outside doors
    doors = [(65, 520, 95, 520), (215, 520, 245, 520), (335, 520, 405, 520), (485, 520, 515, 520), (635, 520, 665, 520),
             (755, 520, 785, 520), (850, 520, 880, 520), (900, 486, 900, 514), (845, 100, 875, 100), (700, 480, 740, 480),
             (45, 480, 85, 480), (420, 480, 460, 480), (800, 480, 840, 480), (345, 600, 395, 600), (1000, 250, 1000, 280), (835, 0, 885, 0)]
    glass = [(425, 520, 480, 520), (520, 520, 575, 520), (585, 520, 630, 520), (670, 520, 715, 520), (725, 520, 750, 520),
             (790, 520, 815, 520), (825, 520, 845, 520), (885, 520, 897, 520)]

    def lines(cls, seg):
        return "".join(f'<path class="{cls}" d="M{a} {b}L{x} {y}"/>' for a, b, x, y in seg)

    label = p.t(T("Planul parcului la scară: rampele în mijloc, încăperile pe margine, uși, promenadă și trasee",
                  "Park plan to scale: ramps in the middle, rooms along the edges, doors, walkway and routes"))
    o = (f'<svg class="plan-svg" viewBox="-6 -6 1012 668" role="img" aria-label="{esc(label)}"><defs><marker id="ah" viewBox="0 0 10 10" '
         f'refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs>')
    for n, x, y, w, h, c, op in ROOMS:
        o += f'<rect class="r-{c}{" open" if op else ""}" x="{x * 10}" y="{y * 10}" width="{w * 10}" height="{h * 10}"/>'
    o += '<rect class="outer" x="0" y="0" width="1000" height="600"/><path class="rail-line" d="M0 480H900"/>'
    o += lines("glass", glass) + lines("door", doors)
    for cls, ds in (("route", ["M345 590V545", "M330 500H65V440"]), ("route2", ["M410 500H820"])):
        o += "".join(f'<path class="{cls}" d="{d}" marker-end="url(#ah)"/>' for d in ds)
    for n, x, y, w, h, c, op in ROOMS:
        cx, cy = x * 10 + w * 5, y * 10 + h * 5 + 10
        if n == 19:
            cx, cy = 865, 508
        if n == 16:
            cx += 25
        o += f'<text class="n n-{c}{" sm" if n == 19 else ""}" x="{cx}" y="{cy}" text-anchor="middle">{n}</text>'
    o += f'<text class="lbl" x="405" y="640">{p.t(T("Intrare", "Entrance"))}</text>'
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
def s_hero(p):
    img, _ = p.img("crew", p.t(T("Imagine concept: copii, adolescenți și părinți în hanorace Action Cloud, văzuți din spate, privind parcul plin de rampe și plante",
                               "Concept image: kids, teenagers and parents in Action Cloud hoodies, seen from behind, looking out over a park full of ramps and plants")), eager=True, sizes="100vw")
    return f'''<section class="slide hero" id="top">
  {img}
  <div class="wrap hero-top">
    <h1>{p.t(T("Un loc al lor, în București.", "A place of their own, in Bucharest."))}</h1>
    <p class="sub">{p.t(T("După Brașov, construim în nordul Bucureștiului: aproximativ 6.000 m², deschis tot anul.", "After Brașov, we're building in north Bucharest: about 6,000 m², open all year."))}</p>
  </div>
  <div class="wrap hero-bottom">
    <p class="actions">
      <a class="btn btn-yellow" href="#sponsors">{p.t(T("Devino sponsor", "Become a sponsor"))}</a>
      <a class="btn btn-line" href="#crew">{p.t(T("Intră în Action Crew", "Join the Action Crew"))}</a>
    </p>
    <span class="tag">{p.t(TAG["concept"])}</span>
  </div>
</section>'''


def s_why(p):
    cards = [
        ("event-night", T("Un loc de întâlnire", "A meeting point"),
         T(["Vii pentru rampe", "Rămâi pentru prieteni"], ["Come for the ramps", "Stay for the friends"]),
         T("Seară de eveniment la Brașov: un rider cu capul în jos deasupra rampei, publicul filmează de la balcon", "Event night in Brașov: a rider inverted above the ramp, the crowd filming from the balcony")),
        ("action-camp", T("Action Camps", "Action Camps"),
         T(["Tabere de bicicletă și trotinetă", "De la începător la competiție"], ["Bike and scooter camps", "From beginner to competition"]),
         T("Action Camp la Brașov: copii făcând încălzirea pe rampe", "Action Camp in Brașov: kids warming up on the ramps")),
        ("rider", T("În siguranță, tot anul", "Safe, all year round"),
         T(["În interior, și iarna, și pe ploaie", "Cască obligatorie pe roți"], ["Indoors, in winter and in the rain", "Helmets required on wheels"]),
         T("Un rider cu cască, cu capul în jos deasupra rampei, sub sigla Action Cloud din Brașov", "A rider in a helmet, upside down above the ramp, under the Action Cloud sign in Brașov")),
    ]
    grid = "\n      ".join(p.card(k, p.t(t), p.t(l), alt=p.t(a)) for k, t, l, a in cards)
    return f'''<section class="slide" id="why" data-chapter="proof">
  <div class="wrap">
    {p.head(T("Mișcare, prieteni, un loc sigur.", "Movement, friends, a safe place."), T("Așa arată deja la Action Cloud Brașov.", "This is what it already looks like at Action Cloud Brașov."))}
    <div class="grid grid-3">
      {grid}
    </div>
  </div>
</section>'''


def s_proof(p):
    tiles = [("2022", T("deschis la Brașov", "opened in Brașov")),
             ("1.000+" if p.lang == "ro" else "1,000+", T("rideri antrenați în tabere și cursuri", "riders coached at camps and courses")),
             ("20M+", T("vizualizări pe Instagram și TikTok", "views on Instagram and TikTok"))]
    th = "".join(f'<li class="tile"><b>{b}</b><span>{p.t(s)}</span></li>' for b, s in tiles)
    cards = [
        ("park-brasov", T("Construit de echipa noastră", "Built by our own team"),
         T(["La standarde europene", "Cu sprijinul sponsorilor"], ["To European standards", "With sponsors' support"]),
         T("Parcul Action Cloud din Brașov: rampe din placaj sub pereți galben cu negru, cu bannere pe perete", "The Action Cloud park in Brașov: plywood ramps under yellow and black walls, with banners along the wall"), {}),
        ("build", T("De la o rampă într-un hambar", "From one ramp in a barn"),
         T(["2012: prima rampă", "2022: deschidem la Brașov", "2023: parcul, terminat"], ["2012: the first ramp", "2022: we open in Brașov", "2023: the park, finished"]),
         T("Fotografii din 2012 până în 2023: o rampă într-un hambar, rampe în curte, structuri de lemn în hală și parcul terminat", "Photos from 2012 to 2023: a ramp in a barn, backyard ramps, timber frames in the hall and the finished park"), {"kind": "photos"}),
        ("founder", T("Christoph Baier, fondator", "Christoph Baier, founder"),
         T(["Fost campion național la downhill", "Românii au talent", "Rider, constructor, antrenor"], ["Former national downhill champion", "Romania's Got Talent", "Rider, builder, coach"]),
         T("Christoph Baier cu bicicleta pe o rampă, sub sigla Action Cloud", "Christoph Baier with his bike on a ramp, under the Action Cloud sign"), {}),
    ]
    grid = "\n      ".join(p.card(k, p.t(t), p.t(l), alt=p.t(a), **kw) for k, t, l, a, kw in cards)
    return f'''<section class="slide dark" id="proof" data-chapter="proof">
  <div class="wrap duo">
    {p.head(T("Am mai construit unul.", "We've built one before."), T("Action Cloud Brașov: cel mai mare bikepark indoor din România.", "Action Cloud Brașov: Romania's largest indoor bikepark."))}
    <ul class="tiles">{th}</ul>
  </div>
  <div class="wrap">
    <div class="grid grid-3">
      {grid}
    </div>
    <p class="note">{p.t(T("Parcul este administrat de asociația non-profit Rosenau Cycling. Parteneri la Brașov: Techno Pro, Skates.ro.", "The park is run by the non-profit Rosenau Cycling association. Partners in Brașov: Techno Pro, Skates.ro."))}</p>
  </div>
</section>'''


def s_park(p):
    facts = p.labels(p.t(T(["Căutăm clădirea, în nordul Bucureștiului", "Zonă cu mii de familii tinere", "Data deschiderii: încă neanunțată"],
                           ["We're looking for the building, in north Bucharest", "An area with thousands of young families", "Opening date: not announced yet"])))
    alt = p.t(T("Imagine concept: parcul văzut de sus, fără acoperiș. Rampele umplu mijlocul halei, încăperile numerotate sunt pe margine, intrarea e în față.",
                "Concept image: the park seen from above with the roof removed. Ramps fill the middle of the hall, numbered rooms sit along the edges, the entrance is at the front."))
    return f'''<section class="slide" id="park" data-chapter="park">
  <div class="wrap duo duo-wide">
    <div>
      {p.head(T("Planul pentru București.", "The plan for Bucharest."), T("Aproximativ 6.000 m²: rampele în mijloc, cafeneaua și magazinul pe margine, cu vedere spre parc.", "About 6,000 m²: ramps in the middle, café and shop along the edge, facing the park."))}
      {facts}
    </div>
    <a class="plan-link" href="{p.pre}assets/img/plan-3d.webp" aria-label="{p.t(T("Deschide planul mare", "Open the large plan"))}">{p.media("plan-3d", alt, cls="plan-pic", sizes="(max-width: 60rem) 100vw, 46rem")}</a>
  </div>
  <div class="wrap">
    <details class="more">
      <summary>{p.t(T("Planul la scară și suprafețele", "The plan to scale, with areas"))}</summary>
      <div class="more-body">
        <div class="plan-scroll" tabindex="0">{plan_svg(p)}</div>
        {plan_legend(p)}
        <p class="note">{p.t(T("Plan orientativ pentru o hală de 100 × 60 m, cu suprafețe aproximative. Se adaptează la clădirea pe care o vom alege.", "Indicative plan for a 100 × 60 m hall, with approximate areas. It will adapt to the building we choose."))}</p>
      </div>
    </details>
  </div>
</section>'''


def s_zones(p):
    chips = ""
    for f in FILTERS:
        if f is None:
            chips += '<span class="gap" aria-hidden="true"></span>'
        else:
            chips += f'<button type="button" data-tag="{f[0]}" aria-pressed="{"true" if f[0] == "all" else "false"}">{p.t(f[1])}</button>'
    plan_word = p.t(T("Pe plan: numărul {n}", "On the plan: number {n}"))
    items = []
    for key, num, title, labels, tags in ZONES:
        name = p.t(title or NAMES[num])
        m = p.media(key, p.t(TAG["concept"]) + ": " + name)
        m = m[:-len("</div>")] + f'<span class="pin" title="{esc(plan_word.replace("{n}", str(num)))}"><span class="vh">{plan_word.replace("{n}", "")}</span>{num}</span></div>'
        items.append((f' data-tags="{tags}"', f'<div class="card">{m}<div class="card-body"><h3>{name}</h3>{p.labels(p.t(labels))}</div></div>'))
    count = (p.t(T("1 zonă", "1 zone")), p.t(T("{n} zone", "{n} zones")), p.t(T("{n} de zone", "{n} zones")))
    return f'''<section class="slide ply" id="zones" data-chapter="park">
  <div class="wrap">
    {p.head(T("Loc pentru fiecare.", "Room for everyone."), T("Alege o vârstă sau o disciplină. Numerele sunt cele de pe plan.", "Pick an age or a discipline. The numbers match the plan."))}
  </div>
  <div class="filters" data-filters="zone-rail" role="group" aria-label="{p.t(T("Filtrează zonele", "Filter the zones"))}">{chips}</div>
  {p.rail("zone-rail", items, count=count)}
</section>'''


def s_crew(p):
    rides = [T("Trotinetă", "Scooter"), T("BMX", "BMX"), T("Mountain bike", "Mountain bike"), T("Skate", "Skate"), T("Altceva", "Something else"), T("Sunt părinte", "I'm a parent")]
    opts = "".join(f"<option>{p.t(r)}</option>" for r in rides)
    action = "/multumim.html" if p.lang == "ro" else "/en/thanks.html"
    pic = p.media("huddle", p.t(T("Imagine concept: mâini strânse la mijloc, într-un cerc de rideri în hanorace Action Cloud", "Concept image: hands stacked in the middle of a circle of riders in Action Cloud hoodies")))
    return f'''<section class="slide yellow" id="crew" data-chapter="crew">
  <div class="wrap split">
    <div>
      {p.head(T("Intră în Action Crew.", "Join the Action Crew."), T("Afli primul când deschidem și când sunt tabere și evenimente.", "Be first to hear when we open and when camps and events happen."))}
      {p.labels(p.t(T(["Gratuit", "Pentru rideri și părinți", "Te retragi oricând"], ["Free", "For riders and parents", "Leave whenever you like"])))}
      <div class="after crew-pic">{pic}</div>
    </div>
    <form name="crew" method="POST" action="{action}" data-netlify="true" netlify-honeypot="website">
      <input type="hidden" name="form-name" value="crew">
      <input type="hidden" name="language" value="{p.lang}">
      <p class="hp"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></p>
      <div class="field"><label for="c-name">{p.t(T("Prenume", "First name"))}</label><input id="c-name" name="name" autocomplete="given-name" required></div>
      <div class="field"><label for="c-email">{p.t(T("E-mail", "Email"))}</label><input id="c-email" name="email" type="email" autocomplete="email" required aria-describedby="c-help">
        <p class="help" id="c-help">{p.t(T("Ai sub 16 ani? Folosește e-mailul unui părinte.", "Under 16? Use a parent's email."))}</p></div>
      <div class="field"><label for="c-ride">{p.t(T("Cu ce te dai?", "What do you ride?"))}</label><select id="c-ride" name="rides">{opts}</select></div>
      <label class="check"><input type="checkbox" name="consent" value="yes" required> <span>{p.t(T("Vreau să primesc pe e-mail noutăți despre Action Cloud.", "I want to get Action Cloud news by email."))}</span></label>
      <p class="actions">
        <button class="btn btn-dark" type="submit">{p.t(T("Intră în Action Crew", "Join the Action Crew"))}</button>
        <a class="btn btn-line" href="https://www.instagram.com/action.cloud/" rel="noopener">{p.t(T("Urmărește @action.cloud", "Follow @action.cloud"))}</a>
      </p>
    </form>
  </div>
</section>'''


def s_shop(p):
    """The clothes rail from the shop: pieces hang from a steel bar, you drag it and they swing (site.js)."""
    shop = f"{p.pre}shop/?lang={p.lang}"
    mock = p.t(TAG["mock"])
    hang = ""
    for f, name, kind in RACK:
        hang += (f'<li class="hang"><a class="piece" href="{shop}" draggable="false"><span class="cloth"><img src="{p.pre}shop/img/p/{f}.webp" width="760" height="1001" loading="lazy" draggable="false" alt="{esc(mock)}: {esc(name)}"></span>'
                 f'<span class="piece-label"><b>{name}</b><span>{p.t(kind)}</span></span></a></li>')
    prev = p.t(T("Mută bara spre stânga", "Move the rail left"))
    nxt = p.t(T("Mută bara spre dreapta", "Move the rail right"))
    return f'''<section class="slide dark" id="shop" data-chapter="shop">
  <div class="wrap duo">
    {p.head(T("Poartă Action Cloud.", "Wear Action Cloud."), T("Fiecare produs construiește o rampă în curtea unei școli. Prima ajunge la Hărman.", "Every piece builds a ramp in a schoolyard. The first one goes to Hărman."))}
    <div class="side">
      <p class="actions"><a class="btn btn-yellow" href="{shop}">{p.t(T("Vezi magazinul", "See the shop"))}</a></p>
      <p class="note">{p.t(T("Hanorace, tricouri, șepci și căciuli. Comenzile online se deschid în curând, iar prețurile nu sunt încă finale.", "Hoodies, tees, caps and beanies. Online orders open soon and prices are not final yet."))}</p>
    </div>
  </div>
  <div class="rack" data-rack>
    <div class="rack-bar" aria-hidden="true"></div>
    <ul class="rack-track" aria-label="{p.t(T("Bara cu haine: hanorace, bluze și tricouri", "Clothes rail: hoodies, crewnecks and tees"))}">{hang}</ul>
    <div class="wrap rail-tools">
      <p class="rail-count">{p.t(T("Trage de bară. Imaginile sunt machete.", "Drag the rail. The pictures are mock-ups."))}</p>
      <div class="arrows"><button type="button" data-prev aria-label="{prev}">←</button><button type="button" data-next aria-label="{nxt}">→</button></div>
    </div>
  </div>
</section>'''


def s_sponsors(p):
    per = p.t(T("lei / an", "lei / year"))
    choose = p.t(T("Alege", "Choose"))
    items = []
    for key, name, pr_ro, pr_en, places, labels in TIERS:
        price = pr_ro if p.lang == "ro" else pr_en
        pl = f'<p class="places">{p.t(places)}</p>' if places else ""
        alt = p.t(TAG["concept"]) + ": " + p.t(name)
        body = (f'<h3>{p.t(name)}</h3><p class="price">{price} <small>{per}</small></p>{pl}{p.labels(p.t(labels))}'
                f'<a class="btn btn-dark btn-small" href="#contact" data-pick="{esc(p.t(name))}">{choose}<span class="vh">: {p.t(name)}</span></a>')
        items.append(("", f'<div class="card tier">{p.media(key, alt)}<div class="card-body">{body}</div></div>'))
    return f'''<section class="slide ply" id="sponsors" data-chapter="sponsors">
  <div class="wrap duo">
    {p.head(T("Devino sponsor.", "Become a sponsor."), T("Tu susții parcul, noi îți dăm vizibilitate. Șapte pachete pe an.", "You back the park, we give you visibility. Seven yearly packages."))}
    <div class="side">
    <p class="note">{p.t(T("Toate pachetele includ invitații la evenimente și la Action Cups. De la Partener de rampă în sus, și plasare de produs în clipurile Action Cloud.", "Every package includes invitations to events and Action Cups. From Ramp partner up, also product placement in Action Cloud clips."))}</p>
    </div>
  </div>
  {p.rail("tier-rail", items, cls="tiers")}
  <div class="wrap">
    <details class="more">
      <summary>{p.t(T("Avantaj fiscal pentru firme", "Tax advantage for companies"))}</summary>
      <div class="more-body"><p class="note">{p.t(T("În România, firmele plătitoare de impozit pe profit pot scădea din impozit sponsorizările către asociațiile înscrise în Registrul entităților pentru care se acordă deduceri fiscale, în limita legii: cea mai mică valoare dintre 0,75% din cifra de afaceri și 20% din impozitul datorat. Verifică regulile actuale și înscrierea asociației cu contabilul tău.", "In Romania, companies that pay profit tax can deduct sponsorships to associations listed in the register of entities eligible for tax deductions, within the legal limit: the lower of 0.75% of turnover or 20% of the tax owed. Check the current rules and the association's listing with your accountant."))}</p></div>
    </details>
  </div>
</section>'''


def s_contact(p):
    opts = f'<option>{p.t(T("Încă nu știu", "Not sure yet"))}</option>' + "".join(f"<option>{p.t(t[1])}</option>" for t in TIERS)
    action = "/multumim.html" if p.lang == "ro" else "/en/thanks.html"
    optional = p.t(T("(opțional)", "(optional)"))
    steps = p.t(T(["Alegi pachetul", "Ne scrii", "Semnăm contractul de sponsorizare cu asociația Rosenau Cycling"],
                  ["Choose a package", "Write to us", "We sign the sponsorship contract with the Rosenau Cycling association"]))
    st = "".join(f"<li>{s}</li>" for s in steps)
    return f'''<section class="slide dark" id="contact" data-chapter="sponsors">
  <div class="wrap split">
    <div>
      {p.head(T("Hai să vorbim.", "Let's talk."), T("Christoph Baier, fondatorul Action Cloud, îți răspunde personal.", "Christoph Baier, founder of Action Cloud, will reply personally."))}
      <ol class="steps">{st}</ol>
      <p class="actions after"><a class="btn btn-line" href="mailto:{MAIL}">{MAIL}</a></p>
    </div>
    <form name="sponsor" method="POST" action="{action}" data-netlify="true" netlify-honeypot="website">
      <input type="hidden" name="form-name" value="sponsor">
      <input type="hidden" name="language" value="{p.lang}">
      <p class="hp"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></p>
      <div class="field"><label for="f-name">{p.t(T("Nume", "Name"))}</label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-company">{p.t(T("Companie", "Company"))} <span>{optional}</span></label><input id="f-company" name="company" autocomplete="organization"></div>
      <div class="field"><label for="f-email">{p.t(T("E-mail", "Email"))}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-package">{p.t(T("Pachetul care te interesează", "Package you are interested in"))}</label><select id="f-package" name="package">{opts}</select></div>
      <div class="field"><label for="f-message">{p.t(T("Mesaj", "Message"))} <span>{optional}</span></label><textarea id="f-message" name="message" rows="3"></textarea></div>
      <button class="btn btn-yellow" type="submit">{p.t(T("Trimite mesajul", "Send message"))}</button>
      <p class="help">{p.t(T("Folosim datele doar ca să îți răspundem.", "We use your details only to reply to you."))}</p>
    </form>
  </div>
</section>'''


SECTIONS = (s_hero, s_why, s_proof, s_park, s_zones, s_crew, s_shop, s_sponsors, s_contact)
CHAPTERS = [("proof", "why", T("Brașov", "Brașov")), ("park", "park", T("Planul", "The plan")), ("crew", "crew", T("Action Crew", "Action Crew")),
            ("shop", "shop", T("Magazin", "Shop")), ("sponsors", "sponsors", T("Sponsori", "Sponsors"))]


def page(lang):
    p = Page(lang)
    title = p.t(T("Action Cloud București | Un loc al lor", "Action Cloud Bucharest | A place of their own"))
    desc = p.t(T("În 2022 am deschis la Brașov cel mai mare bikepark indoor din România. Acum plănuim un parc de aproximativ 6.000 m² în nordul Bucureștiului. Intră în Action Crew sau devino sponsor.",
                 "In 2022 we opened Romania's largest indoor bikepark in Brașov. Now we are planning a park of about 6,000 m² in north Bucharest. Join the Action Crew or become a sponsor."))
    self_url = SITE if lang == "ro" else SITE + "en/"
    other = ('<a class="lang" href="en/" lang="en" hreflang="en">English</a>' if lang == "ro"
             else '<a class="lang" href="../" lang="ro" hreflang="ro">Română</a>')
    nav = "".join(f'<a href="#{target}" data-for="{k}">{p.t(t)}</a>' for k, target, t in CHAPTERS)
    body = "\n\n".join(f(p) for f in SECTIONS)
    foot_note = p.t(T("Action Cloud este administrat de asociația Rosenau Cycling. Imaginile marcate „Imagine concept” sunt generate pe calculator și arată planul pentru București. Fotografiile sunt din Brașov.",
                      "Action Cloud is run by the Rosenau Cycling association. Pictures marked \"Concept image\" are computer-generated and show the plan for Bucharest. The photos are from Brașov."))
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
<meta property="og:image" content="{SITE}assets/img/concept-crew.webp">
<meta property="og:url" content="{self_url}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="{p.pre}assets/fonts/barlow-semi-condensed-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{p.pre}styles.css">
</head>
<body>

<a class="skip" href="#main">{p.t(T("Sari la conținut", "Skip to content"))}</a>

<header class="bar">
  <a class="brand" href="#top" aria-label="{p.t(T("Action Cloud București, înapoi sus", "Action Cloud Bucharest, back to top"))}"><img src="{p.pre}assets/img/logo-yellow.webp" width="472" height="256" alt="Action Cloud"></a>
  <nav class="chapters" aria-label="{p.t(T("Capitole", "Chapters"))}">{nav}</nav>
  {other}
  <a class="btn btn-yellow btn-small" href="#sponsors">{p.t(T("Devino sponsor", "Become a sponsor"))}</a>
</header>
<div class="progress" aria-hidden="true"></div>

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
<main class="thanks">
  <div class="wrap">
    <h1>{p.t(T("Am primit mesajul.", "Message received."))}</h1>
    <p>{p.t(T("Mulțumim. Îți scriem în curând.", "Thank you. We'll write to you soon."))}</p>
    <p class="actions"><a class="btn btn-yellow" href="./">{p.t(T("Înapoi la pagină", "Back to the page"))}</a></p>
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


if __name__ == "__main__":
    write("index.html", page("ro"))
    write("en/index.html", page("en"))
    write("multumim.html", thanks("ro"))
    write("en/thanks.html", thanks("en"))
