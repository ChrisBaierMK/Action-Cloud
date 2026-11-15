# Ballerina shop

A one-page shop for the clothing brand Ballerina. The page is one room: an old dance
studio. The clothes hang on the barre. Drag the barre sideways and tap a piece to open it.

No framework and no build step. Open `index.html` through any static server, for example
`python3 -m http.server`, or deploy the folder to Netlify as it is.

## Files

```
index.html        all markup, including the product dialog and the bag drawer
styles.css        all styling, CSS variables at the top
app.js            one IIFE, vanilla JS, no dependencies
shop-config.js    window.SHOP: currency, checkoutUrl, contact, specs, products
i18n.js           window.I18N: every visible string (English only for now)
img/              page images
img/p/            product photos: <id>-<colour>-front.webp, <id>-<colour>-back.webp
img/hand/         handwritten phrases: <key>.png
img/scraps/       blank paper scraps (not used by the page yet; scraps are drawn in CSS)
tools/            placeholders.py, which draws the placeholder images
netlify.toml      publish folder and headers
```

## What is still a placeholder

Everything in [SQUARE BRACKETS] on the page is a fact nobody has decided yet. It is drawn
with a dashed outline so it cannot be mistaken for real copy.

| What | Where to fill it in |
|---|---|
| Prices, currency | `shop-config.js`: `price`, `currency` |
| Materials, size charts | `shop-config.js`: `specs` |
| Instagram, TikTok, contact email | `shop-config.js`: `contact` |
| Brand sentence, who makes the pieces, tender story, reserve price, closing date | `i18n.js` |
| Checkout | `shop-config.js`: `checkoutUrl`. While it is `null`, "Check out" says orders are not open |
| Studio, hands and tender photographs, handwritten phrases | `img/`. Grey boxes with their file name on them |

## What is a stand-in

The product pictures in `img/p/` and the logo (`img/hand/logo.png`, `logo-dark.png`) are
AI-generated stand-ins. They are not photographs of finished pieces and not real handwriting.
While `standIn` is `true` in `shop-config.js`, the product panel says so under the picture.
Replace the files under the same names, then set `standIn` to `false`.

The blurbs describe the designs shown in the stand-in pictures. Check them against the real
garments before launch.

## Images

The final images must be real photographs and real handwriting. No AI-generated images.

- `img/studio.webp` (2400 px wide) and `img/studio-mobile.webp` (1200 px wide, portrait):
  the empty room, with no barre. The barre is drawn by the page at 60% of the hero's height.
- Product photos: 896 x 1120 px (4:5), transparent, shot straight on, on a hanger. The top of
  the hanger hook must sit at the top edge of the image, at its centre. That is the point each
  piece hangs and swings from. Bench items, if any are added, have no hanger and sit on their
  bottom edge.
- Handwriting: one transparent PNG per phrase at twice its display size. The file name is
  the i18n key; the string under that key is the alt text.

`python3 tools/placeholders.py` draws any placeholder that is missing. It leaves existing
files alone unless you name them, for example `python3 tools/placeholders.py img/hand/strip`.

## Adding a product

Add an entry to `products` in `shop-config.js`. `where` is `barre`, `hooks` (long pieces on
the high hook rail) or `bench` (small items). Each design has one colour. A design with a
front picture only gets `views: ["front"]`. Add its
photos to `img/p/`. Its name and blurb can also be set in `i18n.js` as `p.<id>.name` and
`p.<id>.blurb`.

## Languages

The site is English only. The language switch is built but hidden while `i18n.js` lists one
language. To add one, follow the note at the top of `i18n.js`.

## Forms

Two Netlify forms, `tender-001` and `waitlist`, each with a honeypot field. They only
deliver on Netlify. Anywhere else the page shows "It did not send".

## Not in this version

Real checkout, accounts, stock levels, the sealed-bid mechanics, a blog, a lookbook.
There are no cookies, analytics or tracking pixels. The page stores two things in
localStorage: the bag and the chosen language.
