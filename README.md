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
i18n.js           window.I18N: every visible string, per language (English, Romanian)
img/              page images
img/p/            product photos: <id>-<colour>-front.webp, <id>-<colour>-back.webp
img/hand/         handwritten phrases: <key>.png (English), ro/<key>.png (Romanian)
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
| Colours of the jacket and the glove | `shop-config.js`: `colors` (and rename the photo files) |
| Instagram, TikTok, contact email | `shop-config.js`: `contact` |
| Brand sentence, who makes the pieces, tender story, reserve price, closing date | `i18n.js`, in both languages |
| Checkout | `shop-config.js`: `checkoutUrl`. While it is `null`, "Check out" says orders are not open |
| Every image | `img/`. All current images are grey boxes with their file name on them |

## Images

The final images must be real photographs and real handwriting. No AI-generated images.

- `img/studio.webp` (2400 px wide) and `img/studio-mobile.webp` (1200 px wide, portrait):
  the empty room, with no barre. The barre is drawn by the page at 60% of the hero's height.
- Product photos: 1200 px tall, transparent, shot straight on, on a hanger. The top of the
  hanger hook must touch the top edge of the image at its centre. That is the point each
  piece hangs and swings from. Bench items (the glove) have no hanger and sit on their
  bottom edge.
- Handwriting: one transparent PNG per phrase at twice its display size. The file name is
  the i18n key; the string under that key is the alt text. Romanian versions go in
  `img/hand/ro/`. The logo is shared by both languages.

`python3 tools/placeholders.py` redraws every placeholder and overwrites `img/`.
Do not run it once real images are in place.

## Adding a product

Add an entry to `products` in `shop-config.js`. `where` is `barre`, `hooks` (long pieces on
the high hook rail) or `bench` (small items). One piece hangs for each colour. Add its
photos to `img/p/` and, for Romanian, `p.<id>.name` and `p.<id>.blurb` in `i18n.js`.

## Forms

Two Netlify forms, `tender-001` and `waitlist`, each with a honeypot field. They only
deliver on Netlify. Anywhere else the page shows "It did not send".

## Not in this version

Real checkout, accounts, stock levels, the sealed-bid mechanics, a blog, a lookbook.
There are no cookies, analytics or tracking pixels. The page stores two things in
localStorage: the bag and the chosen language.
