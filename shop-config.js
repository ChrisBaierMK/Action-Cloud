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
    // Graphic rider tees (concept capsule). The images show the side that carries the graphic:
    // the front for the first four, the back for the Stencil tee. On the first four the print
    // crosses seams, sleeves or the hem, so they need panel printing before sewing, not a
    // ready-made blank. Price is a placeholder like the rest.
    {
      id: "tee-sequence",
      name: "Sequence tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized washed black tee. A backflip in six sprayed frames, from one sleeve to the other. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Black", hex: "#2A2A2A" }]
    },
    {
      id: "tee-bleach",
      name: "Bleach tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized washed black tee. A rider mid-tabletop, bleached out of the fabric and running off the seam. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Black", hex: "#2A2A2A" }]
    },
    {
      id: "tee-ramp",
      name: "Ramp tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized ecru tee. The ramp rises from the hem; the rider is already in the air. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Ecru", hex: "#D9CAB5" }]
    },
    {
      id: "tee-wheel",
      name: "Big Wheel tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized washed grey tee. One wheel, too big for the shirt, with our name on the tyre. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Grey", hex: "#85827D" }]
    },
    {
      id: "tee-stencil",
      name: "Stencil tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized faded yellow tee. On the back, a two-layer spray stencil of a rider, drips included. Small logo on the chest.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Yellow", hex: "#D4A63C" }]
    },
    {
      id: "hoodie",
      name: "Drop In hoodie",
      kind: "hoodie",
      price: 65,
      blurb: "Heavyweight fleece, Action Cloud mark on the chest, \"Live free. Take action.\" across the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Black", hex: "#141414" },
        { name: "Yellow", hex: "#ECC820" },
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
        { name: "Yellow", hex: "#ECC820" }
      ]
    },
    {
      id: "cap",
      name: "Coping cap",
      kind: "cap",
      price: 30,
      blurb: "Six-panel cap with a curved brim and the Action Cloud logo embroidered on the front. Adjustable strap.",
      sizes: ["One size"],
      colors: [
        { name: "Black", hex: "#141414" },
        { name: "Yellow", hex: "#ECC820" }
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
        { name: "Yellow", hex: "#ECC820" },
        { name: "Black", hex: "#141414" },
        { name: "Grey", hex: "#7A7A7A" }
      ]
    }
  ]
};
