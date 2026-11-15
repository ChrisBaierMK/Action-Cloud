# Action Cloud

Static shop for Action Cloud merch (actioncloud.ro). One page: a clothes rack you drag left and right, pieces that swing, a product panel and a bag.

- `index.html`, `styles.css`, `app.js`: the page. No build step.
- `i18n.js`: every visible text in English, Romanian, Hungarian and German. The language follows the browser; visitors switch it in the top bar.
- `shop-config.js`: products, colours, sizes, **placeholder prices**, **target specs and size charts** (not supplier data yet), and `checkoutUrl`.
- `img/`: logo and park photos from the Action Cloud partner deck (2023). `img/p/` holds the product images, which are AI-generated mock-ups (Higgsfield), not photos of real stock. Products with a front and a back have two files, `<id>-<colour>-front.webp` and `<id>-<colour>-back.webp`.

The product panel shows a front/back switch for products that list `views`, and materials plus a size chart for products that name a `spec`.

Checkout is not connected. While `checkoutUrl` is `null`, "Check out" tells shoppers to email their order.

Hosted on Netlify as `actioncloud-ro` (manual uploads, not linked to this repository).
