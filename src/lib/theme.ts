export interface ThemePreset {
  id: string;
  name: string;
  hex: string;
  gradient: string;
  category: "Classic" | "Modern" | "Artisanal" | "Luxury";
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "leather-amber",
    name: "Artisan Leather Amber",
    hex: "#854d0e",
    gradient: "from-amber-800 to-amber-950",
    category: "Artisanal",
    description: "Rich, warm tone ideal for leather goods, handicrafts, and rustic wares.",
  },
  {
    id: "royal-indigo",
    name: "Royal Indigo",
    hex: "#4338ca",
    gradient: "from-indigo-700 to-indigo-950",
    category: "Luxury",
    description: "Regal and refined, perfect for fashion boutiques, couture, and jewelry.",
  },
  {
    id: "emerald-luxury",
    name: "Emerald Jade",
    hex: "#047857",
    gradient: "from-emerald-700 to-emerald-950",
    category: "Luxury",
    description: "Lush green tone reflecting prestige, organic produce, Ayurveda, and elegance.",
  },
  {
    id: "sapphire-blue",
    name: "Sapphire Blue",
    hex: "#1d4ed8",
    gradient: "from-blue-700 to-blue-950",
    category: "Classic",
    description: "Trustworthy and professional, great for electronics, hardware, and retail.",
  },
  {
    id: "crimson-ruby",
    name: "Crimson Ruby",
    hex: "#b91c1c",
    gradient: "from-red-700 to-red-950",
    category: "Modern",
    description: "Bold and passionate, exceptional for bridal wear, sweets, and gift hampers.",
  },
  {
    id: "royal-purple",
    name: "Imperial Violet",
    hex: "#6d28d9",
    gradient: "from-purple-700 to-purple-950",
    category: "Luxury",
    description: "Sophisticated and creative, suited for perfumes, cosmetics, and accessories.",
  },
  {
    id: "midnight-noir",
    name: "Midnight Charcoal",
    hex: "#0f172a",
    gradient: "from-slate-800 to-slate-950",
    category: "Modern",
    description: "Ultra-modern minimalist dark aesthetic for luxury timepieces and bespoke goods.",
  },
  {
    id: "rose-gold",
    name: "Rose Quartz & Magenta",
    hex: "#be185d",
    gradient: "from-pink-700 to-pink-950",
    category: "Modern",
    description: "Chic and vibrant for cosmetics, accessories, kids wear, and lifestyle.",
  },
  {
    id: "warm-terracotta",
    name: "Sunset Terracotta",
    hex: "#c2410c",
    gradient: "from-orange-700 to-orange-950",
    category: "Artisanal",
    description: "Earthy and inviting for pottery, home decor, spices, and tea/coffee blenders.",
  },
  {
    id: "deep-peacock",
    name: "Peacock Teal",
    hex: "#0f766e",
    gradient: "from-teal-700 to-teal-950",
    category: "Classic",
    description: "Dynamic and balanced for silk fabrics, home furnishings, and wellness.",
  },
  {
    id: "boutique-maroon",
    name: "Velvet Burgundy",
    hex: "#881337",
    gradient: "from-rose-900 to-slate-950",
    category: "Luxury",
    description: "Opulent and traditional, famous for silk sarees, gold ornaments, and banquet wear.",
  },
  {
    id: "golden-ochre",
    name: "Imperial Gold & Ochre",
    hex: "#a16207",
    gradient: "from-yellow-700 to-amber-950",
    category: "Artisanal",
    description: "Radiant golden tone for brassware, jewelry, festive collections, and confectionery.",
  },
];
