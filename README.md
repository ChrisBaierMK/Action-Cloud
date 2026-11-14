# Action Cloud

Static site for the Action Cloud merch shop: the "Live free. Take action." story plus hoodies, tees, caps and beanies.

- `index.html`, `styles.css`, `app.js`: the page. No build step; open `index.html` or serve the folder.
- `shop-config.js`: products, colours, sizes, **placeholder prices**, and `checkoutUrl`.

Checkout is intentionally not connected. While `checkoutUrl` is `null`, "Check out" tells shoppers to email their order. Set it to a real Shopify, Stripe or Printful checkout once fulfillment is decided.

Not deployed. actioncloud.co currently serves the MTB course funnel (Netlify site `chrisbaiermtb`), so do not point this repo at that domain without moving the course first.
