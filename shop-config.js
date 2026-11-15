/*
 * Ballerina shop configuration.
 *
 * PLACEHOLDERS. Nothing below marked null has been decided yet:
 *   - every price is null and shows on the page as [PRICE]
 *   - currency is null (set an ISO code such as "RON" or "EUR" when prices exist)
 *   - materials and size charts are null and show as [MATERIALS] / [SIZE CHART]
 *   - contact details are null and show as [HANDLE] / [EMAIL]
 *
 * STAND-INS. The product pictures in img/p/ and the logo in img/hand/ are
 * AI-generated stand-ins, not photographs of finished pieces. While standIn is
 * true the product panel says so under the picture. Replace the files with real
 * photographs and real handwriting, then set standIn to false.
 * The swatch hex values are read off the stand-in pictures, not off fabric.
 *
 * Product pictures are named
 *   <id>-<colour id>-front.webp and <id>-<colour id>-back.webp
 * 896 x 1120 px, transparent, on a hanger, hook at the top centre.
 *
 * Visible product text can be overridden per language in i18n.js under
 * "p.<id>.name" and "p.<id>.blurb". The values here are the default.
 */
window.SHOP = {
  brand: "Ballerina",

  /* true while img/p/ holds stand-in pictures instead of real photographs. */
  standIn: true,

  /* ISO 4217 code, or null while prices are undecided. */
  currency: null,

  /* null = orders are not open. The Check out button says so and takes no payment.
     When a real checkout exists, put its URL here; the bag is sent to it as
     ?items=<id>:<colour>:<size>:<qty>,... */
  checkoutUrl: null,

  contact: {
    email: null,       /* "name@example.com" */
    instagram: null,   /* handle without @ */
    tiktok: null       /* handle without @ */
  },

  /* One entry per kind of garment. chart example:
     { unit: "cm", measures: ["Chest", "Length"], rows: { S: [50, 68], M: [53, 70] } } */
  specs: {
    tee:    { materials: null, chart: null },
    hoodie: { materials: null, chart: null },
    jacket: { materials: null, chart: null }
  },

  /* where: "barre" (hangs on the barre), "hooks" (long pieces, high hook rail),
            "bench" (small items on the bench under the barre)
     Each design exists in one colour. */
  products: [
    {
      id: "tee-patch",
      name: "Patch tee",
      kind: "tee",
      where: "barre",
      price: null,
      blurb: "Washed black. A torn grey patch across the chest, with the name written by hand.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "black", name: "Washed black", hex: "#2f2d2c" }],
      views: ["front", "back"],
      spec: "tee"
    },
    {
      id: "tee-ransom",
      name: "Ransom tee",
      kind: "tee",
      where: "barre",
      price: null,
      blurb: "The name in nine cut-out letters, each a different typeface and colour, stitched on one by one.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "ecru", name: "Ecru", hex: "#e6d9c0" }],
      views: ["front"],
      spec: "tee"
    },
    {
      id: "tee-unprompted",
      name: "Unprompted tee",
      kind: "tee",
      where: "barre",
      price: null,
      blurb: "Washed black. One word on the chest, small: Unprompted. Nobody asked for it.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "black", name: "Washed black", hex: "#2f2d2c" }],
      views: ["front", "back"],
      spec: "tee"
    },
    {
      id: "tee-clipping",
      name: "Clipping tee",
      kind: "tee",
      where: "barre",
      price: null,
      blurb: "The name as a headline cut from a newspaper with scissors, sewn across the chest.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "red", name: "Faded brick red", hex: "#a8483c" }],
      views: ["front"],
      spec: "tee"
    },
    {
      id: "tee-allegedly",
      name: "Allegedly tee",
      kind: "tee",
      where: "barre",
      price: null,
      blurb: "Grey. One word in pencil: Allegedly. For everything you’re not sure about.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "grey", name: "Grey", hex: "#8d8b87" }],
      views: ["front", "back"],
      spec: "tee"
    },
    {
      id: "tee-torn",
      name: "Torn page tee",
      kind: "tee",
      where: "barre",
      price: null,
      blurb: "The name on a page ripped out by hand, torn edges and all.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "pink", name: "Dusty pink", hex: "#d9a3a6" }],
      views: ["front"],
      spec: "tee"
    },
    {
      id: "hoodie-notarobot",
      name: "Not a Robot hoodie",
      kind: "hoodie",
      where: "barre",
      price: null,
      blurb: "Washed black. On the front, small: I am not a robot. On the back, large: I think.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "black", name: "Washed black", hex: "#2f2d2c" }],
      views: ["front", "back"],
      spec: "hoodie"
    },
    {
      id: "blazer-minister",
      name: "Minister jacket",
      kind: "jacket",
      where: "hooks",
      price: null,
      blurb: "A boxy charcoal blazer with envelope pockets sewn on the outside, each one labelled “for envelopes”.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "charcoal", name: "Charcoal", hex: "#3a3a3c" }],
      views: ["front", "back"],
      spec: "jacket"
    }
  ]
};
