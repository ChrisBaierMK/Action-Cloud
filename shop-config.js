// Shop configuration. Edit this file to change products, prices and checkout.
//
// PRICES ARE PLACEHOLDERS — set your real prices before going live.
// The ramp-fund share per item is also undecided (the partner deck has it as [__ lei]).
//
// checkoutUrl: leave null until a real checkout exists. When it is null the
// "Check out" button tells shoppers checkout isn't open yet instead of
// pretending to take payment. Point it at a Shopify cart, a Stripe Payment
// Link or similar once fulfillment (print-on-demand or own stock) is decided.
//
// Product fields beyond the obvious ones:
//   views: the sides that have a photo, e.g. ["front", "back"]. The first one hangs on the
//          rail; the product panel lets shoppers switch. Photos are named
//          img/p/<id>-<colour>-front.webp and img/p/<id>-<colour>-back.webp.
//          Without `views` a product has one photo per colour: img/p/<id>-<colour>.webp.
//   spec:  a key in `specs` below. The product panel then shows materials and a size chart.
window.SHOP = {
  currency: "EUR",
  checkoutUrl: null,

  // TARGET SPECS, NOT SUPPLIER DATA. These are the fabric and measurements the designs were
  // drawn for. Replace them with the manufacturer's spec sheet and graded size chart before
  // taking orders; the page tells shoppers they are targets until then.
  // chart rows: [size, chest width, body length, sleeve length] in cm, garment laid flat.
  specs: {
    "oversized-hoodie": { material: "hoodie", chart: [["S", 64, 68, 58], ["M", 67, 70, 59], ["L", 70, 72, 60], ["XL", 73, 74, 61], ["XXL", 76, 76, 62]] },
    "oversized-crew": { material: "crewneck", chart: [["S", 64, 66, 58], ["M", 67, 68, 59], ["L", 70, 70, 60], ["XL", 73, 72, 61], ["XXL", 76, 74, 62]] },
    "oversized-tee": { material: "tee", chart: [["S", 58, 70, 24], ["M", 61, 72, 25], ["L", 64, 74, 26], ["XL", 67, 76, 27], ["XXL", 70, 78, 28]] }
  },

  products: [
    // Graphic tees (concept capsule). On the first five the print crosses seams, sleeves
    // or the hem, so they need panel printing before sewing, not a ready-made blank.
    {
      id: "tee-truck",
      name: "Truck tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized washed grey tee. A skateboard seen nose-on across the chest, with ACTION on the truck and the wheels at the sleeves. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Grey", hex: "#85827D" }],
      views: ["front", "back"],
      spec: "oversized-tee"
    },
    {
      id: "tee-sequence",
      name: "Sequence tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized washed black tee. A backflip in six sprayed frames, from one sleeve to the other. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Black", hex: "#2A2A2A" }],
      views: ["front", "back"],
      spec: "oversized-tee"
    },
    {
      id: "tee-bleach",
      name: "Bleach tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized washed black tee. A rider mid-tabletop, bleached out of the fabric and running off the seam. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Black", hex: "#2A2A2A" }],
      views: ["front", "back"],
      spec: "oversized-tee"
    },
    {
      id: "tee-ramp",
      name: "Ramp tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized ecru tee. The ramp rises from the hem; the rider is already in the air. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Ecru", hex: "#D9CAB5" }],
      views: ["front", "back"],
      spec: "oversized-tee"
    },
    {
      id: "tee-wheel",
      name: "Big Wheel tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized washed grey tee. One wheel, too big for the shirt, with our name on the tyre. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Grey", hex: "#85827D" }],
      views: ["front", "back"],
      spec: "oversized-tee"
    },
    {
      id: "tee-stencil",
      name: "Stencil tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized faded yellow tee. On the back, a two-layer spray stencil of a rider, drips included. Small logo on the chest.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Yellow", hex: "#D4A63C" }],
      views: ["back", "front"],
      spec: "oversized-tee"
    },

    // Washed, oversized print pieces.
    {
      id: "hoodie-bigmark",
      name: "Big Mark hoodie",
      kind: "hoodie",
      price: 99,
      blurb: "Oversized washed black hoodie. The Action Cloud mark across the whole chest in cracked yellow. Plain back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Black", hex: "#2A2A2A" }],
      views: ["front", "back"],
      spec: "oversized-hoodie"
    },
    {
      id: "hoodie-livefree",
      name: "Live Free hoodie",
      kind: "hoodie",
      price: 99,
      blurb: "Oversized washed black hoodie. \"Live free. Take action.\" sprayed across the back in yellow. Small logo on the chest.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Black", hex: "#2A2A2A" }],
      views: ["back", "front"],
      spec: "oversized-hoodie"
    },
    {
      id: "hoodie-split",
      name: "Split hoodie",
      kind: "hoodie",
      price: 99,
      blurb: "Oversized washed grey hoodie. ACTION across the chest; on the back, the mark and CLOUD in cracked black.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Grey", hex: "#85827D" }],
      views: ["back", "front"],
      spec: "oversized-hoodie"
    },
    {
      id: "hoodie-tape",
      name: "Tape hoodie",
      kind: "hoodie",
      price: 99,
      blurb: "Oversized washed grey hoodie. A logo tape runs down both sleeves from neck to cuff. Small logo on the chest.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Grey", hex: "#85827D" }],
      views: ["front", "back"],
      spec: "oversized-hoodie"
    },
    {
      id: "hoodie-monogram",
      name: "Monogram hoodie",
      kind: "hoodie",
      price: 99,
      blurb: "Oversized washed black hoodie. The mark repeated tone-on-tone over the sleeves and hood. Small logo on the chest.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Black", hex: "#2A2A2A" }],
      views: ["front", "back"],
      spec: "oversized-hoodie"
    },
    {
      id: "crew-sunfade",
      name: "Sunfade crewneck",
      kind: "crewneck",
      price: 79,
      blurb: "Oversized crewneck in sun-faded yellow. The Action Cloud mark large on the chest in cracked black.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Yellow", hex: "#D4A63C" }],
      views: ["front", "back"],
      spec: "oversized-crew"
    },
    {
      id: "tee-tyre",
      name: "Tyre Mark tee",
      kind: "tee",
      price: 49,
      blurb: "Oversized ecru tee. One tyre track across the front, hem to shoulder. Small logo below the collar on the back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Ecru", hex: "#D9CAB5" }],
      views: ["front", "back"],
      spec: "oversized-tee"
    },

    // The original pieces: one photo each, no spec yet.
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
