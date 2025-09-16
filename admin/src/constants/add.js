// Constants - Move to separate config file in production
const PRODUCT_CONFIG = {
  MAX_IMAGES: 4,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

const OPTIONS = {
  SIZES: ["Small", "Medium", "Large"],
  LENGTHS: ["10 inch", "12 inch", "14 inch", "16 inch", "18 inch"],
  COLORS: [
    { name: "Black", hexCode: "#000000", colorFamily: "Black" },
    { name: "Brown", hexCode: "#8B4513", colorFamily: "Brunette" },
    { name: "Blonde", hexCode: "#FAF0BE", colorFamily: "Blonde" },
    { name: "Red", hexCode: "#FF0000", colorFamily: "Red" }
  ],
  TEXTURES: ["Straight", "Wavy", "Curly", "Kinky"],
  WEIGHTS: ["100g", "150g", "200g"],
  CATEGORIES: ["Wigs", "Hair Extensions", "Braiding Extensions", "Crotchet"],
  SUB_CATEGORIES: {
    "Hair Extensions": [
      "Tape-in", "Wefts", "Halo Weft", "Toppers", "Claw Ponytail", "Ponytails", "I-tip", "K-tip"
    ],
    "Braiding Extensions": [
      "Pre-stretched Braiding Hair", "Passion Twist", "French Curls", "Kinky",
      "Marley Twist", "3 Colored Ombré Braiding Hair", "Boho Human Hair Curls", "Boho Fiber Curls"
    ],
    "Crotchet": [
      "Butterfly Locs", "Hand Made Butterfly Locs", "Crotchet Twist", "Crotchet Braids",
      "Faux Locs (Curly End)", "Faux Locs (Straight End)"
    ],
    "Wigs": ["Human Hair Wigs", "Fiber Hair Wigs"]
  },
  HAIR_GRADES: ["7A", "8A", "9A", "10A", "11A"],
  DENSITIES: ["130%", "150%", "180%", "200%"],
  ORIGINS: ["Brazilian", "Peruvian", "Malaysian", "Indian", "Chinese"],
  MATERIALS: ["Human Hair", "Synthetic", "Blend"]
};