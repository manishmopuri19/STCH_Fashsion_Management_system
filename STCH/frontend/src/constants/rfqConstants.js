export const RFQ_OPTIONS = {
  seasons: [
    "Spring/Summer 2025",
    "Fall/Winter 2025",
    "Spring/Summer 2026",
    "Fall/Winter 2026",
    "Resort 2025",
    "Resort 2026",
    "Pre-Fall 2025",
    "Pre-Fall 2026",
  ],

  departments: ["Menswear", "Womenswear", "Kidswear", "Unisex", "Activewear", "Accessories"],

  categories: ["Tops", "Bottoms", "Outerwear", "Dresses", "Activewear", "Swimwear", "Loungewear"],

  priorities: ["Low", "Medium", "High", "Urgent"],

  garmentTypes: [
    "T-Shirt", "Polo", "Shirt", "Blouse", "Jacket", "Hoodie",
    "Sweater", "Pants", "Jeans", "Shorts", "Skirt", "Dress",
    "Jumpsuit", "Vest", "Coat",
  ],

  fabricTypes: [
    "Cotton", "Polyester", "Nylon", "Silk", "Wool", "Linen",
    "Rayon", "Viscose", "Denim", "Jersey", "Fleece", "Twill",
    "Satin", "Chiffon", "Organza",
  ],

  currencies: ["INR"],

  incoterms: ["FOB", "CIF", "CFR", "EXW", "DDP", "DAP"],

  washOptions: [
    "Normal Wash", "Enzyme Wash", "Stone Wash", "Acid Wash",
    "Bleach Wash", "Garment Dye", "Silicon Wash", "Sand Blast",
    "Laser Wash", "No Wash",
  ],

  compliance: [
    "OEKO-TEX", "GOTS", "GRS", "BSCI", "WRAP",
    "SA8000", "ISO 9001", "ISO 14001", "BCI", "Fair Trade",
  ],

  testingRequired: [
    "Shrinkage Test", "Color Fastness", "Tensile Strength", "Pilling Test",
    "GSM Test", "Seam Strength", "Dimensional Stability", "Chemical Test",
  ],
};

export const STEPS = [
  { id: 1, label: "Brand & Info",        short: "Brand" },
  { id: 2, label: "Garment Details",     short: "Garment" },
  { id: 3, label: "Order Details",       short: "Order" },
  { id: 4, label: "Trims & Accessories", short: "Trims" },
  { id: 5, label: "Wash & Finish",       short: "Wash" },
  { id: 6, label: "Compliance",          short: "Compliance" },
  { id: 7, label: "Additional Info",     short: "Additional" },
];

export const INITIAL_FORM_DATA = {
  // Step 1 – Brand Info
  brand: "",
  season: "",
  department: "",
  category: "",
  subCategory: "",
  priority: "Medium",

  // Step 2 – Garment Details
  garmentType: "",
  fabricType: "",
  fabricWeight: "",
  fabricComposition: "",
  construction: "",
  yarnCount: "",

  // Step 3 – Order Details
  quantity: "",
  targetPrice: "",
  currency: "INR",
  deliveryDate: "",
  incoterms: "FOB",

  // Step 4 – Trims
  trimsDetails: "",
  packagingType: "",
  labelType: "",

  // Step 5 – Wash & Finish
  garmentWash: [],
  dyeType: "",
  printType: "",
  embroideryType: "",
  specialFinish: "",

  // Step 6 – Compliance
  complianceStandards: [],
  testingRequired: [],
  socialCompliance: "",
  qualityStandards: "",

  // Step 7 – Additional
  techPackUrl: "",
  referenceImages: "",
  notes: "",
};