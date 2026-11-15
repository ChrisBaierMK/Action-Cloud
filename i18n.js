/*
 * Every visible string, per language.
 *
 * Text in [SQUARE BRACKETS] is a fact nobody has decided yet. It is shown on the
 * page as a visible placeholder. Replace it here when the fact exists.
 *
 * The site is English only. The language switch stays hidden while "langs"
 * has one entry. To add a language later: add it to "langs", add a block of
 * strings under its code, and put its handwriting in img/hand/<code>/<key>.png.
 *
 * Handwritten phrases are images, one file per phrase: img/hand/<key>.png.
 * The string under the same key is the image's alt text. Keys listed in
 * handShared use the same file in every language.
 */
window.I18N = {
  fallback: "en",
  langs: { en: "English" },
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
      "p.blazer-minister.blurb": "A boxy blazer. The inside pockets are labelled “for envelopes”."
    }
  }
};
