/*
 * Ballerina shop configuration.
 *
 * PLACEHOLDERS. Nothing below marked null has been decided yet:
 *   - every price is null and shows on the page as [PRICE]
 *   - currency is null (set an ISO code such as "RON" or "EUR" when prices exist)
 *   - materials and size charts are null and show as [MATERIALS] / [SIZE CHART]
 *   - colours with hex: null are undecided and show as [COLOUR]
 *   - contact details are null and show as [HANDLE] / [EMAIL]
 * The swatch hex values that are filled in are screen approximations, not
 * measured fabric colours.
 *
 * Product photos live in img/p/ and are named
 *   <id>-<colour id>-front.webp and <id>-<colour id>-back.webp
 *
 * Visible product text (name, blurb) can be translated in i18n.js under
 * "p.<id>.name" and "p.<id>.blurb". The values here are the fallback.
 */
window.SHOP = {
  brand: "Ballerina",

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
    jacket: { materials: null, chart: null },
    glove:  { materials: null, chart: null }
  },

  /* where: "barre" (hangs on the barre), "hooks" (long pieces, high hook rail),
            "bench" (small items on the bench under the barre) */
  products: [
    {
      id: "tee-patch",
      name: "Patch tee",
      kind: "tee",
      where: "barre",
      price: null,
      blurb: "Washed black, with a torn grey patch carrying the handwritten name.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "black", name: "Washed black", hex: "#2f2d2c" }],
      views: ["front", "back"],
      spec: "tee"
    },
    {
      id: "tee-unprompted",
      name: "Unprompted tee",
      kind: "tee",
      where: "barre",
      price: null,
      blurb: "Washed black, with a small handwritten “Unprompted” on the chest.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "black", name: "Washed black", hex: "#2f2d2c" }],
      views: ["front", "back"],
      spec: "tee"
    },
    {
      id: "tee-allegedly",
      name: "Allegedly tee",
      kind: "tee",
      where: "barre",
      price: null,
      blurb: "Grey, with a small handwritten “Allegedly”.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "grey", name: "Grey", hex: "#8d8b87" }],
      views: ["front", "back"],
      spec: "tee"
    },
    {
      id: "hoodie-notarobot",
      name: "Not a Robot hoodie",
      kind: "hoodie",
      where: "barre",
      price: null,
      blurb: "Washed black, with “I am not a robot” across the back.",
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
      blurb: "A boxy blazer. The inside pockets are labelled “for envelopes”.",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ id: "colour", name: "[COLOUR]", hex: null }],
      views: ["front", "back"],
      spec: "jacket"
    },
    {
      id: "glove-six",
      name: "Six-finger glove",
      kind: "glove",
      where: "bench",
      price: null,
      blurb: "Knitted, with six fingers.",
      sizes: ["One size"],
      colors: [{ id: "colour", name: "[COLOUR]", hex: null }],
      views: ["front", "back"],
      spec: "glove"
    }
  ]
};
