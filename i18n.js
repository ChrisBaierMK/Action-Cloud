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
      "meta.desc": "Ballerina. Clothes made by a person, for people who don\u2019t know what to believe.",

      "skip": "Skip to the clothes",
      "nav.lang": "Language",
      "logo": "Ballerina",

      "hero.line": "I am not a robot.",
      "hero.line2": "I think.",
      "hero.sub": "Clothes for people who aren\u2019t sure any more.",

      "rail.label": "The barre. Clothes hanging in the studio.",
      "rail.hint": "Drag the barre. Tap a piece.",
      "rail.prev": "Move the barre left",
      "rail.next": "Move the barre right",
      "rail.open": "{name}, {color}, {price}. Open.",


      "made.title": "Made by a person.",
      "made.lead": "I don\u2019t know what to believe. I know who made this.",
      "made.text": "[WHO MAKES THE PIECES, WHERE, AND HOW LONG ONE TAKES]",
      "made.alt": "Placeholder for a photograph of hands at work.",

      "tender.kicker": "Public tender",
      "tender.title": "Tender No. 001",
      "tender.intro": "One piece, made once, sold by sealed bid.",
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
      "form.privacy": "Your details are sent through Netlify Forms.",
      "form.privacy.tbd": "[PRIVACY NOTICE: WHO HOLDS YOUR DETAILS AND WHAT THEY ARE USED FOR]",
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
      "foot.legal": "[COMPANY NAME AND ADDRESS]",

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
      "p.edition": "Edition",
      "p.edition.n": "{n} pieces",
      "p.edition.tbd": "[EDITION SIZE]",
      "p.madeby": "Made by",
      "p.madeby.tbd": "[WHO MADE IT, WHERE, AND HOW LONG IT TOOK]",
      "p.care": "Care",
      "p.care.tbd": "[CARE INSTRUCTIONS]",
      "p.shipping": "Shipping and returns",
      "p.shipping.tbd": "[SHIPPING AND RETURNS]",
      "p.standin": "Stand-in picture. Not a photograph of the finished piece.",
      "price.tbd": "[PRICE]",
      "size.one": "One size",

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
      "bag.qty": "Quantity: {n}"

    }
  }
};
