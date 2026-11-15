/*
 * Every visible string, per language.
 *
 * Text in [SQUARE BRACKETS] is a fact nobody has decided yet. It is shown on the
 * page as a visible placeholder. Replace it here when the fact exists.
 *
 * Handwritten phrases are images, one file per phrase:
 *   English:  img/hand/<key>.png
 *   Romanian: img/hand/ro/<key>.png
 * The string under the same key is the image's alt text. Keys listed in
 * handShared use the English file in every language.
 */
window.I18N = {
  fallback: "en",
  langs: { en: "English", ro: "Română" },
  handShared: ["logo"],

  strings: {
    en: {
      "meta.title": "Ballerina",
      "meta.desc": "Ballerina. Clothes made by a person.",

      "skip": "Skip to the clothes",
      "nav.lang": "Language",
      "logo": "Ballerina",

      "hero.line": "I am not a robot.",
      "hero.sub": "[ONE-SENTENCE DESCRIPTION OF THE BRAND]",

      "rail.label": "The barre. Clothes hanging in the studio.",
      "rail.hint": "Drag the barre. Tap a piece.",
      "rail.prev": "Move the barre left",
      "rail.next": "Move the barre right",
      "rail.open": "{name}, {color}, {price}. Open.",

      "strip.label": "In our own hand",
      "strip.1": "I am not a robot",
      "strip.2": "Unprompted",
      "strip.3": "Born, not trained",
      "strip.4": "Made by a person",
      "strip.pause": "Pause the strip",
      "strip.play": "Play the strip",

      "made.title": "Made by a person.",
      "made.text": "[WHO MAKES THE PIECES, WHERE, AND HOW LONG ONE TAKES]",
      "made.alt": "Placeholder for a photograph of hands at work.",

      "tender.kicker": "Public tender",
      "tender.title": "Tender No. 001",
      "tender.intro": "One-off pieces, sold by sealed bid.",
      "tender.story": "[THE STORY OF THE PIECE]",
      "tender.alt": "Placeholder for a photograph of the first one-off piece.",
      "tender.reserve": "Reserve price",
      "tender.reserve.v": "[RESERVE PRICE]",
      "tender.closes": "Closes",
      "tender.closes.v": "[CLOSING DATE]",
      "tender.form": "Register your interest",
      "tender.note": "This registers your interest. It is not a bid.",
      "tender.send": "Register interest",
      "tender.sent": "Sent. Your interest in Tender No. 001 is registered.",

      "wait.title": "Tell me when it opens.",
      "wait.send": "Tell me",
      "wait.sent": "Sent. You are on the list.",

      "form.name": "Name",
      "form.email": "Email",
      "form.message": "Message (optional)",
      "form.hp": "Leave this field empty",
      "form.sending": "Sending…",
      "form.fail": "It did not send. Check your connection and try again.",
      "err.name": "Write your name.",
      "err.email": "Write your email address.",
      "err.email.bad": "That address looks incomplete. It should look like name@example.com.",

      "foot.instagram": "Instagram",
      "foot.tiktok": "TikTok",
      "foot.handle": "[HANDLE]",
      "foot.email": "[EMAIL]",
      "foot.contact": "Contact",

      "close": "Close",
      "p.view": "Side",
      "p.front": "Front",
      "p.back": "Back",
      "p.color": "Colour",
      "p.size": "Size",
      "p.size.err": "Choose a size.",
      "p.add": "Add to bag",
      "p.added": "Added to your bag.",
      "p.materials": "Materials",
      "p.materials.tbd": "[MATERIALS]",
      "p.chart": "Size chart",
      "p.chart.tbd": "[SIZE CHART]",
      "p.photo": "{name}, {color}, {view}",
      "price.tbd": "[PRICE]",
      "size.one": "One size",
      "color.black": "Washed black",
      "color.grey": "Grey",
      "color.colour": "[COLOUR]",

      "bag.word": "Bag",
      "bag.open": "Open your bag. Pieces in it: {n}.",
      "bag.title": "Your bag",
      "bag.empty": "Your bag is empty. Take something off the barre.",
      "bag.total": "Total",
      "bag.checkout": "Check out",
      "bag.closed": "Orders are not open yet. Nothing has been charged.",
      "bag.remove": "Remove {name}",
      "bag.remove.word": "Remove",
      "bag.less": "One fewer of {name}",
      "bag.more": "One more of {name}",
      "bag.qty": "Quantity: {n}",

      "p.tee-patch.name": "Patch tee",
      "p.tee-patch.blurb": "Washed black, with a torn grey patch carrying the handwritten name.",
      "p.tee-unprompted.name": "Unprompted tee",
      "p.tee-unprompted.blurb": "Washed black, with a small handwritten “Unprompted” on the chest.",
      "p.tee-allegedly.name": "Allegedly tee",
      "p.tee-allegedly.blurb": "Grey, with a small handwritten “Allegedly”.",
      "p.hoodie-notarobot.name": "Not a Robot hoodie",
      "p.hoodie-notarobot.blurb": "Washed black, with “I am not a robot” across the back.",
      "p.blazer-minister.name": "Minister jacket",
      "p.blazer-minister.blurb": "A boxy blazer. The inside pockets are labelled “for envelopes”.",
      "p.glove-six.name": "Six-finger glove",
      "p.glove-six.blurb": "Knitted, with six fingers."
    },

    ro: {
      "meta.title": "Ballerina",
      "meta.desc": "Ballerina. Haine făcute de un om.",

      "skip": "Sari la haine",
      "nav.lang": "Limbă",
      "logo": "Ballerina",

      "hero.line": "Nu sunt robot.",
      "hero.sub": "[DESCRIEREA BRANDULUI ÎNTR-O PROPOZIȚIE]",

      "rail.label": "Bara de balet. Haine atârnate în studio.",
      "rail.hint": "Trage de bară. Atinge o piesă.",
      "rail.prev": "Mută bara spre stânga",
      "rail.next": "Mută bara spre dreapta",
      "rail.open": "{name}, {color}, {price}. Deschide.",

      "strip.label": "Cu scrisul nostru",
      "strip.1": "Nu sunt robot",
      "strip.2": "Fără prompt",
      "strip.3": "Născut, nu antrenat",
      "strip.4": "Făcut de un om",
      "strip.pause": "Oprește banda",
      "strip.play": "Pornește banda",

      "made.title": "Făcut de un om.",
      "made.text": "[CINE FACE PIESELE, UNDE ȘI CÂT DUREAZĂ UNA]",
      "made.alt": "Loc rezervat pentru o fotografie cu mâini la lucru.",

      "tender.kicker": "Licitație publică",
      "tender.title": "Licitația nr. 001",
      "tender.intro": "Piese unicat, vândute prin ofertă în plic închis.",
      "tender.story": "[POVESTEA PIESEI]",
      "tender.alt": "Loc rezervat pentru o fotografie a primei piese unicat.",
      "tender.reserve": "Preț de pornire",
      "tender.reserve.v": "[PREȚ DE PORNIRE]",
      "tender.closes": "Se închide",
      "tender.closes.v": "[DATA ÎNCHIDERII]",
      "tender.form": "Anunță-ți interesul",
      "tender.note": "Formularul îți înregistrează interesul. Nu este o ofertă.",
      "tender.send": "Trimite interesul",
      "tender.sent": "Trimis. Interesul tău pentru Licitația nr. 001 este înregistrat.",

      "wait.title": "Anunță-mă când se deschide.",
      "wait.send": "Anunță-mă",
      "wait.sent": "Trimis. Ești pe listă.",

      "form.name": "Nume",
      "form.email": "Email",
      "form.message": "Mesaj (opțional)",
      "form.hp": "Lasă acest câmp gol",
      "form.sending": "Se trimite…",
      "form.fail": "Nu s-a trimis. Verifică conexiunea și încearcă din nou.",
      "err.name": "Scrie-ți numele.",
      "err.email": "Scrie-ți adresa de email.",
      "err.email.bad": "Adresa pare incompletă. Ar trebui să arate ca nume@exemplu.ro.",

      "foot.instagram": "Instagram",
      "foot.tiktok": "TikTok",
      "foot.handle": "[CONT]",
      "foot.email": "[EMAIL]",
      "foot.contact": "Contact",

      "close": "Închide",
      "p.view": "Parte",
      "p.front": "Față",
      "p.back": "Spate",
      "p.color": "Culoare",
      "p.size": "Mărime",
      "p.size.err": "Alege o mărime.",
      "p.add": "Pune în geantă",
      "p.added": "E în geanta ta.",
      "p.materials": "Materiale",
      "p.materials.tbd": "[MATERIALE]",
      "p.chart": "Tabel de mărimi",
      "p.chart.tbd": "[TABEL DE MĂRIMI]",
      "p.photo": "{name}, {color}, {view}",
      "price.tbd": "[PREȚ]",
      "size.one": "Mărime unică",
      "color.black": "Negru spălăcit",
      "color.grey": "Gri",
      "color.colour": "[CULOARE]",

      "bag.word": "Geantă",
      "bag.open": "Deschide geanta. Piese în ea: {n}.",
      "bag.title": "Geanta ta",
      "bag.empty": "Geanta ta e goală. Ia ceva de pe bară.",
      "bag.total": "Total",
      "bag.checkout": "Finalizează comanda",
      "bag.closed": "Comenzile nu sunt deschise încă. Nu s-a încasat nimic.",
      "bag.remove": "Scoate {name}",
      "bag.remove.word": "Scoate",
      "bag.less": "Cu una mai puțin: {name}",
      "bag.more": "Încă una: {name}",
      "bag.qty": "Cantitate: {n}",

      "p.tee-patch.name": "Tricou Patch",
      "p.tee-patch.blurb": "Negru spălăcit, cu un petic gri rupt pe care e scris de mână numele.",
      "p.tee-unprompted.name": "Tricou Unprompted",
      "p.tee-unprompted.blurb": "Negru spălăcit, cu „Unprompted” scris mic, de mână, pe piept.",
      "p.tee-allegedly.name": "Tricou Allegedly",
      "p.tee-allegedly.blurb": "Gri, cu „Allegedly” scris mic, de mână.",
      "p.hoodie-notarobot.name": "Hanorac Not a Robot",
      "p.hoodie-notarobot.blurb": "Negru spălăcit, cu „I am not a robot” pe tot spatele.",
      "p.blazer-minister.name": "Sacou Ministru",
      "p.blazer-minister.blurb": "Un sacou cu croială dreaptă. Buzunarele interioare au eticheta „pentru plicuri”.",
      "p.glove-six.name": "Mănușă cu șase degete",
      "p.glove-six.blurb": "Tricotată, cu șase degete."
    }
  }
};
