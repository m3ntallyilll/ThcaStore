import { storage } from "./storage";

// Seed script to create products matching actual inventory
// 15 lbs sativa, 10 lbs indica, 5 lbs hybrid + 15K pre-rolls (5K infused)

const inventoryProducts = [
  // SATIVA FLOWER - Blue Dream (5 lbs total)
  {
    name: "Blue Dream - Eighth (3.5g)",
    description: "Legendary sativa-dominant hybrid with uplifting cerebral effects and sweet berry aroma. Perfect for creativity and productivity. High-mids quality at competitive prices.",
    price: "45.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Blue_Dream_strain_flower_30991155.png",
    stock: 80, // 5 lbs = 80 eighths
    weight: "3.5g",
    featured: true,
    rating: "4.8",
    thcaContent: "22.5",
    strainType: "sativa",
    effects: ["energetic", "creative", "uplifting", "focused"]
  },
  {
    name: "Blue Dream - Half (14g)",
    description: "Legendary sativa-dominant hybrid with uplifting cerebral effects and sweet berry aroma. Perfect for creativity and productivity. High-mids quality at competitive prices.",
    price: "160.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Blue_Dream_strain_flower_30991155.png",
    stock: 20, // 5 lbs = 20 halfs
    weight: "14g",
    featured: true,
    rating: "4.8",
    thcaContent: "22.5",
    strainType: "sativa",
    effects: ["energetic", "creative", "uplifting", "focused"]
  },
  {
    name: "Blue Dream - Quarter (7g)",
    description: "Legendary sativa-dominant hybrid with uplifting cerebral effects and sweet berry aroma. Perfect for creativity and productivity. High-mids quality at competitive prices.",
    price: "85.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Blue_Dream_strain_flower_30991155.png",
    stock: 40, // 5 lbs = 40 quarters
    weight: "7g",
    featured: false,
    rating: "4.8",
    thcaContent: "22.5",
    strainType: "sativa",
    effects: ["energetic", "creative", "uplifting", "focused"]
  },
  {
    name: "Blue Dream - Ounce (28g)",
    description: "Legendary sativa-dominant hybrid with uplifting cerebral effects and sweet berry aroma. Perfect for creativity and productivity. High-mids quality at competitive prices.",
    price: "300.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Blue_Dream_strain_flower_30991155.png",
    stock: 10, // 5 lbs = 10 ounces
    weight: "28g",
    featured: false,
    rating: "4.8",
    thcaContent: "22.5",
    strainType: "sativa",
    effects: ["energetic", "creative", "uplifting", "focused"]
  },
  // SATIVA FLOWER - Green Crack (5 lbs total)
  {
    name: "Green Crack - Eighth (3.5g)",
    description: "Potent sativa strain delivering an invigorating mental buzz. Sharp focus and energy boost ideal for daytime activities. Premium outdoor-grown flower.",
    price: "42.00",
    category: "flower", 
    imageUrl: "/attached_assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png",
    stock: 80, // 5 lbs = 80 eighths
    weight: "3.5g",
    featured: true,
    rating: "4.7",
    thcaContent: "24.1",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "euphoric"]
  },
  {
    name: "Green Crack - Quarter (7g)",
    description: "Potent sativa strain delivering an invigorating mental buzz. Sharp focus and energy boost ideal for daytime activities. Premium outdoor-grown flower.",
    price: "80.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png",
    stock: 40, // 5 lbs = 40 quarters
    weight: "7g",
    featured: false,
    rating: "4.7",
    thcaContent: "24.1",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "euphoric"]
  },
  {
    name: "Green Crack - Half (14g)",
    description: "Potent sativa strain delivering an invigorating mental buzz. Sharp focus and energy boost ideal for daytime activities. Premium outdoor-grown flower.",
    price: "155.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png",
    stock: 20, // 5 lbs = 20 halfs
    weight: "14g",
    featured: false,
    rating: "4.7",
    thcaContent: "24.1",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "euphoric"]
  },
  {
    name: "Green Crack - Ounce (28g)",
    description: "Potent sativa strain delivering an invigorating mental buzz. Sharp focus and energy boost ideal for daytime activities. Premium outdoor-grown flower.",
    price: "290.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png",
    stock: 10, // 5 lbs = 10 ounces
    weight: "28g",
    featured: false,
    rating: "4.7",
    thcaContent: "24.1",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "euphoric"]
  },
  // SATIVA FLOWER - Sour Diesel (5 lbs total)
  {
    name: "Sour Diesel - Eighth (3.5g)",
    description: "Classic sativa with diesel aroma and cerebral effects. Delivers energizing high perfect for daytime use. Fast-acting and long-lasting euphoria.",
    price: "44.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png",
    stock: 80, // 5 lbs = 80 eighths
    weight: "3.5g",
    featured: true,
    rating: "4.6",
    thcaContent: "21.8",
    strainType: "sativa",
    effects: ["energetic", "happy", "uplifting", "creative"]
  },
  {
    name: "Sour Diesel - Quarter (7g)",
    description: "Classic sativa with diesel aroma and cerebral effects. Delivers energizing high perfect for daytime use. Fast-acting and long-lasting euphoria.",
    price: "82.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png",
    stock: 40, // 5 lbs = 40 quarters
    weight: "7g",
    featured: false,
    rating: "4.6",
    thcaContent: "21.8",
    strainType: "sativa",
    effects: ["energetic", "happy", "uplifting", "creative"]
  },
  {
    name: "Sour Diesel - Half (14g)",
    description: "Classic sativa with diesel aroma and cerebral effects. Delivers energizing high perfect for daytime use. Fast-acting and long-lasting euphoria.",
    price: "158.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png",
    stock: 20, // 5 lbs = 20 halfs
    weight: "14g",
    featured: false,
    rating: "4.6",
    thcaContent: "21.8",
    strainType: "sativa",
    effects: ["energetic", "happy", "uplifting", "creative"]
  },
  {
    name: "Sour Diesel - Ounce (28g)",
    description: "Classic sativa with diesel aroma and cerebral effects. Delivers energizing high perfect for daytime use. Fast-acting and long-lasting euphoria.",
    price: "295.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png",
    stock: 10, // 5 lbs = 10 ounces
    weight: "28g",
    featured: false,
    rating: "4.6",
    thcaContent: "21.8",
    strainType: "sativa",
    effects: ["energetic", "happy", "uplifting", "creative"]
  },
  // INDICA FLOWER - OG Kush (3.5 lbs total)
  {
    name: "OG Kush - Eighth (3.5g)",
    description: "Premium indica with complex aroma and stress-relieving effects. Dense buds with heavy trichome coverage. Perfect for evening relaxation.",
    price: "48.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/OG_Kush_hemp_strain_970f7637.png",
    stock: 56, // 3.5 lbs = 56 eighths
    weight: "0.22",
    featured: true,
    rating: "4.9",
    thcaContent: "26.3",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "euphoric"]
  },
  {
    name: "OG Kush - Quarter (7g)",
    description: "Premium indica with complex aroma and stress-relieving effects. Dense buds with heavy trichome coverage. Perfect for evening relaxation.",
    price: "90.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/OG_Kush_hemp_strain_970f7637.png",
    stock: 28, // 3.5 lbs = 28 quarters
    weight: "0.44",
    featured: false,
    rating: "4.9",
    thcaContent: "26.3",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "euphoric"]
  },
  {
    name: "OG Kush - Half (14g)",
    description: "Premium indica with complex aroma and stress-relieving effects. Dense buds with heavy trichome coverage. Perfect for evening relaxation.",
    price: "170.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/OG_Kush_hemp_strain_970f7637.png",
    stock: 14, // 3.5 lbs = 14 halfs
    weight: "0.88",
    featured: false,
    rating: "4.9",
    thcaContent: "26.3",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "euphoric"]
  },
  {
    name: "OG Kush - Ounce (28g)",
    description: "Premium indica with complex aroma and stress-relieving effects. Dense buds with heavy trichome coverage. Perfect for evening relaxation.",
    price: "320.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/OG_Kush_hemp_strain_970f7637.png",
    stock: 7, // 3.5 lbs = 7 ounces
    weight: "1.75",
    featured: false,
    rating: "4.9",
    thcaContent: "26.3",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "euphoric"]
  },
  // INDICA FLOWER - Purple Punch (3.5 lbs total)
  {
    name: "Purple Punch - Eighth (3.5g)",
    description: "Sweet indica with grape and berry flavors. Delivers deep body relaxation and sedating effects. Beautiful purple hues with orange pistils.",
    price: "46.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png",
    stock: 56, // 3.5 lbs = 56 eighths
    weight: "0.22",
    featured: true,
    rating: "4.7",
    thcaContent: "23.4",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "calm"]
  },
  {
    name: "Purple Punch - Quarter (7g)",
    description: "Sweet indica with grape and berry flavors. Delivers deep body relaxation and sedating effects. Beautiful purple hues with orange pistils.",
    price: "88.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png",
    stock: 28, // 3.5 lbs = 28 quarters
    weight: "0.44",
    featured: false,
    rating: "4.7",
    thcaContent: "23.4",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "calm"]
  },
  {
    name: "Purple Punch - Half (14g)",
    description: "Sweet indica with grape and berry flavors. Delivers deep body relaxation and sedating effects. Beautiful purple hues with orange pistils.",
    price: "168.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png",
    stock: 14, // 3.5 lbs = 14 halfs
    weight: "0.88",
    featured: false,
    rating: "4.7",
    thcaContent: "23.4",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "calm"]
  },
  {
    name: "Purple Punch - Ounce (28g)",
    description: "Sweet indica with grape and berry flavors. Delivers deep body relaxation and sedating effects. Beautiful purple hues with orange pistils.",
    price: "315.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png",
    stock: 7, // 3.5 lbs = 7 ounces
    weight: "1.75",
    featured: false,
    rating: "4.7",
    thcaContent: "23.4",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "calm"]
  },
  // INDICA FLOWER - Granddaddy Purple (3 lbs total)
  {
    name: "Granddaddy Purple - Eighth (3.5g)",
    description: "Classic purple indica with grape and berry aroma. Deep relaxation and pain relief. Dense, frosty buds with rich purple coloration.",
    price: "50.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png",
    stock: 48, // 3 lbs = 48 eighths
    weight: "0.22",
    featured: true,
    rating: "4.8",
    thcaContent: "25.7",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Granddaddy Purple - Quarter (7g)",
    description: "Classic purple indica with grape and berry aroma. Deep relaxation and pain relief. Dense, frosty buds with rich purple coloration.",
    price: "95.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png",
    stock: 24, // 3 lbs = 24 quarters
    weight: "0.44",
    featured: false,
    rating: "4.8",
    thcaContent: "25.7",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Granddaddy Purple - Half (14g)",
    description: "Classic purple indica with grape and berry aroma. Deep relaxation and pain relief. Dense, frosty buds with rich purple coloration.",
    price: "180.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png",
    stock: 12, // 3 lbs = 12 halfs
    weight: "0.88",
    featured: false,
    rating: "4.8",
    thcaContent: "25.7",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Granddaddy Purple - Ounce (28g)",
    description: "Classic purple indica with grape and berry aroma. Deep relaxation and pain relief. Dense, frosty buds with rich purple coloration.",
    price: "340.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png",
    stock: 6, // 3 lbs = 6 ounces
    weight: "1.75",
    featured: false,
    rating: "4.8",
    thcaContent: "25.7",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "pain-relief"]
  },
  // HYBRID FLOWER - Girl Scout Cookies (2.5 lbs total)
  {
    name: "Girl Scout Cookies - Eighth (3.5g)",
    description: "Balanced hybrid with sweet and earthy flavors. Euphoric head high with full-body relaxation. Perfect for any time of day enjoyment.",
    price: "47.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Girl_Scout_Cookies_strain_a5a5b84e.png",
    stock: 40, // 2.5 lbs = 40 eighths
    weight: "3.5g",
    featured: true,
    rating: "4.8",
    thcaContent: "24.9",
    strainType: "hybrid",
    effects: ["happy", "relaxed", "euphoric", "creative"]
  },
  {
    name: "Girl Scout Cookies - Quarter (7g)",
    description: "Balanced hybrid with sweet and earthy flavors. Euphoric head high with full-body relaxation. Perfect for any time of day enjoyment.",
    price: "90.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Girl_Scout_Cookies_strain_a5a5b84e.png",
    stock: 20, // 2.5 lbs = 20 quarters
    weight: "7g",
    featured: false,
    rating: "4.8",
    thcaContent: "24.9",
    strainType: "hybrid",
    effects: ["happy", "relaxed", "euphoric", "creative"]
  },
  {
    name: "Girl Scout Cookies - Half (14g)",
    description: "Balanced hybrid with sweet and earthy flavors. Euphoric head high with full-body relaxation. Perfect for any time of day enjoyment.",
    price: "172.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Girl_Scout_Cookies_strain_a5a5b84e.png",
    stock: 10, // 2.5 lbs = 10 halfs
    weight: "14g",
    featured: false,
    rating: "4.8",
    thcaContent: "24.9",
    strainType: "hybrid",
    effects: ["happy", "relaxed", "euphoric", "creative"]
  },
  {
    name: "Girl Scout Cookies - Ounce (28g)",
    description: "Balanced hybrid with sweet and earthy flavors. Euphoric head high with full-body relaxation. Perfect for any time of day enjoyment.",
    price: "325.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Girl_Scout_Cookies_strain_a5a5b84e.png",
    stock: 5, // 2.5 lbs = 5 ounces
    weight: "28g",
    featured: false,
    rating: "4.8",
    thcaContent: "24.9",
    strainType: "hybrid",
    effects: ["happy", "relaxed", "euphoric", "creative"]
  },
  // HYBRID FLOWER - Gelato (2.5 lbs total)
  {
    name: "Gelato - Eighth (3.5g)",
    description: "Premium hybrid with sweet dessert flavors. Balanced cerebral and physical effects. Beautiful dense buds with vibrant colors and heavy resin.",
    price: "49.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Gelato_strain_buds_a0533ab9.png",
    stock: 40, // 2.5 lbs = 40 eighths
    weight: "3.5g",
    featured: true,
    rating: "4.9",
    thcaContent: "27.2",
    strainType: "hybrid",
    effects: ["euphoric", "relaxed", "creative", "uplifting"]
  },
  {
    name: "Gelato - Quarter (7g)",
    description: "Premium hybrid with sweet dessert flavors. Balanced cerebral and physical effects. Beautiful dense buds with vibrant colors and heavy resin.",
    price: "92.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Gelato_strain_buds_a0533ab9.png",
    stock: 20, // 2.5 lbs = 20 quarters
    weight: "7g",
    featured: false,
    rating: "4.9",
    thcaContent: "27.2",
    strainType: "hybrid",
    effects: ["euphoric", "relaxed", "creative", "uplifting"]
  },
  {
    name: "Gelato - Half (14g)",
    description: "Premium hybrid with sweet dessert flavors. Balanced cerebral and physical effects. Beautiful dense buds with vibrant colors and heavy resin.",
    price: "175.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Gelato_strain_buds_a0533ab9.png",
    stock: 10, // 2.5 lbs = 10 halfs
    weight: "14g",
    featured: false,
    rating: "4.9",
    thcaContent: "27.2",
    strainType: "hybrid",
    effects: ["euphoric", "relaxed", "creative", "uplifting"]
  },
  {
    name: "Gelato - Ounce (28g)",
    description: "Premium hybrid with sweet dessert flavors. Balanced cerebral and physical effects. Beautiful dense buds with vibrant colors and heavy resin.",
    price: "330.00",
    category: "flower",
    imageUrl: "/attached_assets/generated_images/Gelato_strain_buds_a0533ab9.png",
    stock: 5, // 2.5 lbs = 5 ounces
    weight: "28g",
    featured: false,
    rating: "4.9",
    thcaContent: "27.2",
    strainType: "hybrid",
    effects: ["euphoric", "relaxed", "creative", "uplifting"]
  },

  // INFUSED PRE-ROLLS - Northern Lights (1,667 total)
  {
    name: "Infused Pre-Roll - Northern Lights (Single)",
    description: "Premium 1g pre-roll infused with live resin. Pure indica genetics for deep relaxation and sleep aid. Hand-rolled with top-shelf flower and concentrate.",
    price: "18.00",
    category: "pre-rolls",
    imageUrl: "/attached_assets/generated_images/THCA_hemp_pre-rolls_56c5fd30.png",
    stock: 1000, // 1,000 singles
    weight: "0.06",
    featured: true,
    rating: "4.7",
    thcaContent: "32.1",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "calm", "pain-relief"]
  },
  {
    name: "Infused Pre-Roll - Northern Lights (2-Pack)",
    description: "Premium 2g total (1g each) pre-rolls infused with live resin. Pure indica genetics for deep relaxation and sleep aid. Hand-rolled with top-shelf flower.",
    price: "34.00",
    category: "pre-rolls",
    imageUrl: "/attached_assets/generated_images/THCA_hemp_pre-rolls_56c5fd30.png",
    stock: 334, // 668 pre-rolls = 334 2-packs
    weight: "0.13",
    featured: false,
    rating: "4.7",
    thcaContent: "32.1",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "calm", "pain-relief"]
  },
  {
    name: "Infused Pre-Roll - Northern Lights (5-Pack)",
    description: "Premium 5g total (1g each) pre-rolls infused with live resin. Pure indica genetics for deep relaxation and sleep aid. Bulk savings on premium product.",
    price: "80.00",
    category: "pre-rolls",
    imageUrl: "/attached_assets/generated_images/THCA_hemp_pre-rolls_56c5fd30.png",
    stock: 67, // 333 pre-rolls = 67 5-packs (rounded)
    weight: "0.31",
    featured: false,
    rating: "4.7",
    thcaContent: "32.1",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "calm", "pain-relief"]
  },

  // INFUSED PRE-ROLLS - Jack Herer (1,667 total)
  {
    name: "Infused Pre-Roll - Jack Herer (Single)",
    description: "Energizing sativa pre-roll enhanced with live resin. Clear-headed euphoria and creativity boost. Premium flower with concentrated terpenes.",
    price: "18.00",
    category: "pre-rolls",
    imageUrl: "/attached_assets/generated_images/THCA_hemp_pre-rolls_70e0ccf9.png",
    stock: 1000, // 1,000 singles
    weight: "0.06",
    featured: true,
    rating: "4.8",
    thcaContent: "30.5",
    strainType: "sativa",
    effects: ["energetic", "creative", "focused", "uplifting"]
  },
  {
    name: "Infused Pre-Roll - Jack Herer (3-Pack)",
    description: "Energizing sativa pre-rolls enhanced with live resin. Clear-headed euphoria and creativity boost. Perfect for daytime productivity.",
    price: "52.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-infused.svg",
    stock: 222, // 667 pre-rolls = 222 3-packs (rounded)
    weight: "0.19",
    featured: false,
    rating: "4.8",
    thcaContent: "30.5",
    strainType: "sativa",
    effects: ["energetic", "creative", "focused", "uplifting"]
  },

  // INFUSED PRE-ROLLS - Zkittlez (1,666 total)
  {
    name: "Infused Pre-Roll - Zkittlez (Single)",
    description: "Sweet hybrid pre-roll with live resin infusion. Fruity candy flavors with balanced effects. Premium quality flower and concentrate blend.",
    price: "18.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-infused.svg",
    stock: 1000, // 1,000 singles
    weight: "0.06",
    featured: true,
    rating: "4.6",
    thcaContent: "28.9",
    strainType: "hybrid",
    effects: ["happy", "relaxed", "euphoric", "creative"]
  },
  {
    name: "Infused Pre-Roll - Zkittlez (4-Pack)",
    description: "Sweet hybrid pre-rolls with live resin infusion. Fruity candy flavors with balanced effects. Great value on premium infused product.",
    price: "68.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-infused.svg",
    stock: 167, // 666 pre-rolls = 167 4-packs (rounded)
    weight: "0.25",
    featured: false,
    rating: "4.6",
    thcaContent: "28.9",
    strainType: "hybrid",
    effects: ["happy", "relaxed", "euphoric", "creative"]
  },

  // PREMIUM PRE-ROLLS - Sativa (3,400 total)
  {
    name: "Premium Pre-Roll - Sativa (Single)",
    description: "High-quality sativa flower in convenient pre-roll form. Energizing daytime effects with smooth burn. Perfect for on-the-go consumption.",
    price: "8.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 2000, // 2,000 singles
    weight: "0.06",
    featured: true,
    rating: "4.4",
    thcaContent: "19.5",
    strainType: "sativa",
    effects: ["energetic", "uplifting", "focused", "happy"]
  },
  {
    name: "Premium Pre-Roll - Sativa (5-Pack)",
    description: "High-quality sativa flower in convenient pre-roll form. Energizing daytime effects with smooth burn. Value pack for regular users.",
    price: "35.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 200, // 1,000 pre-rolls = 200 5-packs
    weight: "0.31",
    featured: false,
    rating: "4.4",
    thcaContent: "19.5",
    strainType: "sativa",
    effects: ["energetic", "uplifting", "focused", "happy"]
  },
  {
    name: "Premium Pre-Roll - Sativa (50-Pack)",
    description: "Bulk sativa pre-rolls for heavy users. High-quality flower with consistent effects. Maximum savings on premium product.",
    price: "320.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 8, // 400 pre-rolls = 8 50-packs
    weight: "3.13",
    featured: false,
    rating: "4.4",
    thcaContent: "19.5",
    strainType: "sativa",
    effects: ["energetic", "uplifting", "focused", "happy"]
  },

  // PREMIUM PRE-ROLLS - Indica (3,300 total)
  {
    name: "Premium Pre-Roll - Indica (Single)",
    description: "Premium indica flower pre-rolls for evening relaxation. Smooth burning with calming effects. Perfect for unwinding after long days.",
    price: "8.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 2000, // 2,000 singles
    weight: "0.06",
    featured: true,
    rating: "4.5",
    thcaContent: "21.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "calm", "happy"]
  },
  {
    name: "Premium Pre-Roll - Indica (10-Pack)",
    description: "Premium indica flower pre-rolls for evening relaxation. Smooth burning with calming effects. Great value for regular evening users.",
    price: "70.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 100, // 1,000 pre-rolls = 100 10-packs
    weight: "0.63",
    featured: false,
    rating: "4.5",
    thcaContent: "21.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "calm", "happy"]
  },
  {
    name: "Premium Pre-Roll - Indica (50-Pack)",
    description: "Bulk indica pre-rolls for maximum savings. Premium flower with consistent relaxing effects. Perfect for medical users.",
    price: "320.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 6, // 300 pre-rolls = 6 50-packs
    weight: "3.13",
    featured: false,
    rating: "4.5",
    thcaContent: "21.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "calm", "happy"]
  },

  // PREMIUM PRE-ROLLS - Hybrid (3,300 total)
  {
    name: "Premium Pre-Roll - Hybrid (Single)",
    description: "Balanced hybrid pre-rolls offering best of both worlds. Versatile effects suitable for any time. Quality flower with smooth burn.",
    price: "8.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 2000, // 2,000 singles
    weight: "0.06",
    featured: true,
    rating: "4.3",
    thcaContent: "20.7",
    strainType: "hybrid",
    effects: ["balanced", "happy", "relaxed", "uplifting"]
  },
  {
    name: "Premium Pre-Roll - Hybrid (3-Pack)",
    description: "Balanced hybrid pre-rolls offering best of both worlds. Versatile effects suitable for any time. Small pack for trying new strains.",
    price: "22.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 300, // 900 pre-rolls = 300 3-packs
    weight: "0.19",
    featured: false,
    rating: "4.3",
    thcaContent: "20.7",
    strainType: "hybrid",
    effects: ["balanced", "happy", "relaxed", "uplifting"]
  },
  {
    name: "Premium Pre-Roll - Hybrid (15-Pack)",
    description: "Balanced hybrid pre-rolls in convenient mid-size pack. Versatile effects with great value. Perfect for weekly supply.",
    price: "105.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 20, // 300 pre-rolls = 20 15-packs
    weight: "0.94",
    featured: false,
    rating: "4.3",
    thcaContent: "20.7",
    strainType: "hybrid",
    effects: ["balanced", "happy", "relaxed", "uplifting"]
  },
  {
    name: "Premium Pre-Roll - Hybrid (100-Pack)",
    description: "Bulk hybrid pre-rolls for maximum value. Balanced effects with premium flower quality. Best deal for heavy consumers.",
    price: "640.00",
    category: "pre-rolls",
    imageUrl: "/products/pre-roll-premium.svg",
    stock: 1, // 100 pre-rolls = 1 100-pack
    weight: "6.25",
    featured: false,
    rating: "4.3",
    thcaContent: "20.7",
    strainType: "hybrid",
    effects: ["balanced", "happy", "relaxed", "uplifting"]
  }
];

export async function seedInventoryProducts() {
  console.log("Seeding inventory products...");

  // Clear existing products first
  await storage.clearProducts();

  for (const product of inventoryProducts) {
    try {
      const createdProduct = await storage.createProduct(product);
      console.log(`Created product: ${product.name}`);
    } catch (error) {
      console.error(`Failed to create product ${product.name}:`, error);
    }
  }

  console.log("Inventory seeding complete!");
  console.log("Total inventory:");
  console.log("- Flower: 30 lbs (15 sativa, 10 indica, 5 hybrid)");
  console.log("- Pre-rolls: 15,000 (5,000 infused, 10,000 regular)");
}

export default seedInventoryProducts;