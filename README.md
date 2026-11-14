# Action Cloud

Static shop for Action Cloud merch (actioncloud.ro). One page: a clothes rack you drag left and right, pieces that swing, a product panel and a bag.

- `index.html`, `styles.css`, `app.js`: the page. No build step.
- `shop-config.js`: products, colours, sizes, **placeholder prices**, and `checkoutUrl`.
- `img/`: logo and park photos from the Action Cloud partner deck (2023). `img/p/` holds the product images, which are AI-generated mock-ups (Higgsfield), not photos of real stock.

Checkout is not connected. While `checkoutUrl` is `null`, "Check out" tells shoppers to email their order.

Hosted on Netlify as `actioncloud-ro` (manual uploads, not linked to this repository).
