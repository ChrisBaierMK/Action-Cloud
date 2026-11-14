// Shop configuration. Edit this file to change products, prices and checkout.
//
// PRICES ARE PLACEHOLDERS — set your real prices before going live.
//
// checkoutUrl: leave null until a real checkout exists. When it is null the
// "Check out" button tells shoppers checkout isn't open yet instead of
// pretending to take payment. Point it at a Shopify cart, a Stripe Payment
// Link or similar once fulfillment (print-on-demand or own stock) is decided.
window.SHOP = {
  currency: "EUR",
  checkoutUrl: null,
  products: [
    {
      id: "hoodie",
      name: "Drop In hoodie",
      kind: "hoodie",
      price: 65,
      blurb: "Heavyweight fleece, cloud mark on the chest, Live free. Take action. across the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Ink", hex: "#1B2A4A" },
        { name: "Sky", hex: "#9CC4DE" },
        { name: "Concrete", hex: "#8E949A" }
      ]
    },
    {
      id: "tee",
      name: "Commit tee",
      kind: "tee",
      price: 35,
      blurb: "Boxy fit, 220 gsm cotton. Small mark on the front, big decision on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", hex: "#F7F8FA" },
        { name: "Ink", hex: "#1B2A4A" },
        { name: "Signal", hex: "#FFC629" }
      ]
    },
    {
      id: "cap",
      name: "Coping cap",
      kind: "cap",
      price: 30,
      blurb: "Six-panel, curved brim, embroidered cloud. Adjustable strap.",
      sizes: ["One size"],
      colors: [
        { name: "Ink", hex: "#1B2A4A" },
        { name: "Sky", hex: "#9CC4DE" }
      ]
    },
    {
      id: "beanie",
      name: "Off-season beanie",
      kind: "beanie",
      price: 25,
      blurb: "Rib knit with a fold-up cuff and woven label. For the months the park is the only option.",
      sizes: ["One size"],
      colors: [
        { name: "Signal", hex: "#FFC629" },
        { name: "Ink", hex: "#1B2A4A" },
        { name: "Concrete", hex: "#8E949A" }
      ]
    }
  ]
};
