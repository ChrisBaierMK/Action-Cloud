// Shop configuration. Edit this file to change products, prices and checkout.
//
// PRICES ARE PLACEHOLDERS — set your real prices before going live.
// The ramp-fund share per item is also undecided (the partner deck has it as [__ lei]).
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
      blurb: "Heavyweight fleece, Action Cloud mark on the chest, \"Live free. Take action.\" across the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Black", hex: "#141414" },
        { name: "Yellow", hex: "#FFD100" },
        { name: "Grey", hex: "#7A7A7A" }
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
        { name: "Black", hex: "#141414" },
        { name: "White", hex: "#F4F4F4" },
        { name: "Yellow", hex: "#FFD100" }
      ]
    },
    {
      id: "cap",
      name: "Coping cap",
      kind: "cap",
      price: 30,
      blurb: "Six-panel, curved brim, embroidered Action Cloud mark. Adjustable strap.",
      sizes: ["One size"],
      colors: [
        { name: "Black", hex: "#141414" },
        { name: "Yellow", hex: "#FFD100" }
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
        { name: "Yellow", hex: "#FFD100" },
        { name: "Black", hex: "#141414" },
        { name: "Grey", hex: "#7A7A7A" }
      ]
    }
  ]
};
