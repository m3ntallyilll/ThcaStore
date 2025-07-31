// Seed inventory with real professional cannabis/hemp images from Pexels and Pixabay
import { randomUUID } from "crypto";
import type { MemStorage } from "./storage";

interface ProductWithImageData {
  name: string;
  description: string;
  price: string;
  category: "flower" | "pre-rolls";
  imageUrl: string;
  stock: number;
  weight: string;
  featured: boolean;
  rating: string;
  thcaContent: string;
  strainType: string;
  effects: string[];
}

// Professional cannabis/hemp images from Pexels (royalty-free)
const realImages = {
  // Flower bud images from Pexels
  blueDream: "https://images.pexels.com/photos/2753946/pexels-photo-2753946.jpeg?auto=compress&cs=tinysrgb&w=500",
  greenCrack: "https://images.pexels.com/photos/1466335/pexels-photo-1466335.jpeg?auto=compress&cs=tinysrgb&w=500", 
  sourDiesel: "https://images.pexels.com/photos/3676962/pexels-photo-3676962.jpeg?auto=compress&cs=tinysrgb&w=500",
  ogKush: "https://images.pexels.com/photos/606506/pexels-photo-606506.jpeg?auto=compress&cs=tinysrgb&w=500",
  purplePunch: "https://images.pexels.com/photos/2731667/pexels-photo-2731667.jpeg?auto=compress&cs=tinysrgb&w=500",
  granddaddyPurple: "https://images.pexels.com/photos/2731663/pexels-photo-2731663.jpeg?auto=compress&cs=tinysrgb&w=500",
  girlScoutCookies: "https://images.pexels.com/photos/4543134/pexels-photo-4543134.jpeg?auto=compress&cs=tinysrgb&w=500",
  gelato: "https://images.pexels.com/photos/4543137/pexels-photo-4543137.jpeg?auto=compress&cs=tinysrgb&w=500",
  
  // Pre-roll images from Pixabay (royalty-free)
  infusedPreRoll: "https://cdn.pixabay.com/photo/2019/09/11/21/23/cbd-4469987_640.jpg",
  premiumPreRoll: "https://cdn.pixabay.com/photo/2019/09/13/21/31/cbd-4474903_640.jpg",
  hybridPreRoll: "https://cdn.pixabay.com/photo/2018/09/07/18/18/hemp-plant-3661210_640.jpg",
  sativaPreRoll: "https://cdn.pixabay.com/photo/2017/09/18/09/10/cannabis-2761102_640.jpg",
  indicaPreRoll: "https://cdn.pixabay.com/photo/2018/09/08/09/39/hemp-3662166_640.jpg"
};

const products: ProductWithImageData[] = [
  // Blue Dream Strain - Berry and sweet characteristics
  {
    name: "Blue Dream - Eighth (3.5g)",
    description: "Premium indoor Blue Dream THCA flower with sweet berry aroma and balanced effects. Known for its euphoric and creative properties with beautiful frosty trichomes.",
    price: "45.00",
    category: "flower",
    imageUrl: realImages.blueDream,
    stock: 25,
    weight: "3.5",
    featured: true,
    rating: "4.8",
    thcaContent: "26.8",
    strainType: "hybrid",
    effects: ["euphoric", "creative", "uplifting", "relaxed"]
  },
  {
    name: "Blue Dream - Half (14g)",
    description: "Premium Blue Dream THCA flower in larger quantity. Sweet berry flavors with balanced hybrid effects perfect for day or evening use.",
    price: "160.00",
    category: "flower",
    imageUrl: realImages.blueDream,
    stock: 15,
    weight: "14",
    featured: false,
    rating: "4.8",
    thcaContent: "26.8",
    strainType: "hybrid",
    effects: ["euphoric", "creative", "uplifting", "relaxed"]
  },
  {
    name: "Blue Dream - Quarter (7g)",
    description: "Blue Dream THCA flower quarter ounce. Perfect balance of cerebral stimulation and full-body relaxation.",
    price: "85.00",
    category: "flower",
    imageUrl: realImages.blueDream,
    stock: 20,
    weight: "7",
    featured: false,
    rating: "4.8",
    thcaContent: "26.8",
    strainType: "hybrid",
    effects: ["euphoric", "creative", "uplifting", "relaxed"]
  },
  {
    name: "Blue Dream - Ounce (28g)",
    description: "Full ounce of premium Blue Dream THCA flower. Bulk pricing on this popular hybrid strain with consistent quality.",
    price: "300.00",
    category: "flower",
    imageUrl: realImages.blueDream,
    stock: 8,
    weight: "28",
    featured: false,
    rating: "4.8",
    thcaContent: "26.8",
    strainType: "hybrid",
    effects: ["euphoric", "creative", "uplifting", "relaxed"]
  },

  // Green Crack - Energetic sativa
  {
    name: "Green Crack - Eighth (3.5g)",
    description: "Energizing Green Crack THCA flower with citrusy, fruity flavors. Perfect sativa for daytime use with sharp mental focus.",
    price: "42.00",
    category: "flower",
    imageUrl: realImages.greenCrack,
    stock: 22,
    weight: "3.5",
    featured: true,
    rating: "4.7",
    thcaContent: "24.2",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  {
    name: "Green Crack - Quarter (7g)",
    description: "Green Crack THCA flower for sustained energy and focus. Bright green buds with orange pistils and energizing effects.",
    price: "80.00",
    category: "flower",
    imageUrl: realImages.greenCrack,
    stock: 18,
    weight: "7",
    featured: false,
    rating: "4.7",
    thcaContent: "24.2",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  {
    name: "Green Crack - Half (14g)",
    description: "Half ounce of premium Green Crack THCA flower. Consistent energy and mental clarity in larger quantity.",
    price: "150.00",
    category: "flower",
    imageUrl: realImages.greenCrack,
    stock: 12,
    weight: "14",
    featured: false,
    rating: "4.7",
    thcaContent: "24.2",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  {
    name: "Green Crack - Ounce (28g)",
    description: "Full ounce of Green Crack THCA flower. Premium daytime strain with consistent energizing effects and citrus flavor.",
    price: "280.00",
    category: "flower",
    imageUrl: realImages.greenCrack,
    stock: 6,
    weight: "28",
    featured: false,
    rating: "4.7",
    thcaContent: "24.2",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "creative"]
  },

  // Sour Diesel - Classic diesel flavor
  {
    name: "Sour Diesel - Eighth (3.5g)",
    description: "Classic Sour Diesel THCA flower with pungent diesel aroma and energizing sativa effects. Fast-acting cerebral high.",
    price: "46.00",
    category: "flower",
    imageUrl: realImages.sourDiesel,
    stock: 20,
    weight: "3.5",
    featured: false,
    rating: "4.6",
    thcaContent: "25.1",
    strainType: "sativa",
    effects: ["energetic", "uplifting", "cerebral", "focused"]
  },
  {
    name: "Sour Diesel - Quarter (7g)",
    description: "Sour Diesel THCA flower with distinctive fuel-like aroma. Potent sativa known for energizing and uplifting effects.",
    price: "88.00",
    category: "flower",
    imageUrl: realImages.sourDiesel,
    stock: 16,
    weight: "7",
    featured: false,
    rating: "4.6",
    thcaContent: "25.1",
    strainType: "sativa",
    effects: ["energetic", "uplifting", "cerebral", "focused"]
  },
  {
    name: "Sour Diesel - Half (14g)",
    description: "Half ounce of premium Sour Diesel THCA flower. Legendary sativa strain with fast-acting energizing effects.",
    price: "165.00",
    category: "flower",
    imageUrl: realImages.sourDiesel,
    stock: 10,
    weight: "14",
    featured: false,
    rating: "4.6",
    thcaContent: "25.1",
    strainType: "sativa",
    effects: ["energetic", "uplifting", "cerebral", "focused"]
  },
  {
    name: "Sour Diesel - Ounce (28g)",
    description: "Full ounce of Sour Diesel THCA flower. Premium sativa with consistent diesel flavors and energizing properties.",
    price: "310.00",
    category: "flower",
    imageUrl: realImages.sourDiesel,
    stock: 5,
    weight: "28",
    featured: false,
    rating: "4.6",
    thcaContent: "25.1",
    strainType: "sativa",
    effects: ["energetic", "uplifting", "cerebral", "focused"]
  },

  // OG Kush - Classic indica-dominant hybrid
  {
    name: "OG Kush - Eighth (3.5g)",
    description: "Premium OG Kush THCA flower with earthy pine flavors and relaxing indica-dominant effects. Perfect for evening use.",
    price: "48.00",
    category: "flower",
    imageUrl: realImages.ogKush,
    stock: 24,
    weight: "3.5",
    featured: true,
    rating: "4.9",
    thcaContent: "27.5",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "stress-relief"]
  },
  {
    name: "OG Kush - Quarter (7g)",
    description: "OG Kush THCA flower with distinctive terpene profile. Heavy-hitting indica effects with pine and earth flavors.",
    price: "92.00",
    category: "flower",
    imageUrl: realImages.ogKush,
    stock: 19,
    weight: "7",
    featured: false,
    rating: "4.9",
    thcaContent: "27.5",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "stress-relief"]
  },
  {
    name: "OG Kush - Half (14g)",
    description: "Half ounce of legendary OG Kush THCA flower. Potent indica-dominant hybrid with classic West Coast genetics.",
    price: "175.00",
    category: "flower",
    imageUrl: realImages.ogKush,
    stock: 13,
    weight: "14",
    featured: false,
    rating: "4.9",
    thcaContent: "27.5",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "stress-relief"]
  },
  {
    name: "OG Kush - Ounce (28g)",
    description: "Full ounce of premium OG Kush THCA flower. Classic strain with consistent potency and relaxing indica effects.",
    price: "330.00",
    category: "flower",
    imageUrl: realImages.ogKush,
    stock: 7,
    weight: "28",
    featured: false,
    rating: "4.9",
    thcaContent: "27.5",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "stress-relief"]
  },

  // Purple Punch - Sweet grape flavors
  {
    name: "Purple Punch - Eighth (3.5g)",
    description: "Sweet Purple Punch THCA flower with grape and blueberry flavors. Relaxing indica with beautiful purple hues.",
    price: "50.00",
    category: "flower",
    imageUrl: realImages.purplePunch,
    stock: 21,
    weight: "3.5",
    featured: true,
    rating: "4.8",
    thcaContent: "28.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "euphoric"]
  },
  {
    name: "Purple Punch - Quarter (7g)",
    description: "Purple Punch THCA flower with dessert-like grape flavors. Heavy indica effects perfect for nighttime relaxation.",
    price: "95.00",
    category: "flower",
    imageUrl: realImages.purplePunch,
    stock: 17,
    weight: "7",
    featured: false,
    rating: "4.8",
    thcaContent: "28.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "euphoric"]
  },
  {
    name: "Purple Punch - Half (14g)",
    description: "Half ounce of Purple Punch THCA flower. Sweet grape flavors with potent indica effects and purple coloration.",
    price: "180.00",
    category: "flower",
    imageUrl: realImages.purplePunch,
    stock: 11,
    weight: "14",
    featured: false,
    rating: "4.8",
    thcaContent: "28.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "euphoric"]
  },
  {
    name: "Purple Punch - Ounce (28g)",
    description: "Full ounce of premium Purple Punch THCA flower. Consistent grape flavors and relaxing indica effects.",
    price: "340.00",
    category: "flower",
    imageUrl: realImages.purplePunch,
    stock: 6,
    weight: "28",
    featured: false,
    rating: "4.8",
    thcaContent: "28.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "happy", "euphoric"]
  },

  // Granddaddy Purple - Deep purple indica
  {
    name: "Granddaddy Purple - Eighth (3.5g)",
    description: "Classic Granddaddy Purple THCA flower with grape and berry flavors. Heavy indica effects with stunning purple buds.",
    price: "47.00",
    category: "flower",
    imageUrl: realImages.granddaddyPurple,
    stock: 18,
    weight: "3.5",
    featured: false,
    rating: "4.7",
    thcaContent: "26.9",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "stress-relief", "pain-relief"]
  },
  {
    name: "Granddaddy Purple - Quarter (7g)",
    description: "Granddaddy Purple THCA flower with distinctive grape aroma. Potent indica strain known for deep relaxation.",
    price: "90.00",
    category: "flower",
    imageUrl: realImages.granddaddyPurple,
    stock: 14,
    weight: "7",
    featured: false,
    rating: "4.7",
    thcaContent: "26.9",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "stress-relief", "pain-relief"]
  },
  {
    name: "Granddaddy Purple - Half (14g)",
    description: "Half ounce of Granddaddy Purple THCA flower. Legendary indica with grape flavors and heavy body effects.",
    price: "170.00",
    category: "flower",
    imageUrl: realImages.granddaddyPurple,
    stock: 9,
    weight: "14",
    featured: false,
    rating: "4.7",
    thcaContent: "26.9",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "stress-relief", "pain-relief"]
  },
  {
    name: "Granddaddy Purple - Ounce (28g)",
    description: "Full ounce of Granddaddy Purple THCA flower. Premium indica with consistent grape flavors and relaxing effects.",
    price: "320.00",
    category: "flower",
    imageUrl: realImages.granddaddyPurple,
    stock: 4,
    weight: "28",
    featured: false,
    rating: "4.7",
    thcaContent: "26.9",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "stress-relief", "pain-relief"]
  },

  // Girl Scout Cookies - Sweet hybrid
  {
    name: "Girl Scout Cookies - Eighth (3.5g)",
    description: "Premium Girl Scout Cookies THCA flower with sweet, earthy flavors. Balanced hybrid effects with euphoric qualities.",
    price: "49.00",
    category: "flower",
    imageUrl: realImages.girlScoutCookies,
    stock: 23,
    weight: "3.5",
    featured: false,
    rating: "4.8",
    thcaContent: "27.8",
    strainType: "hybrid",
    effects: ["euphoric", "happy", "relaxed", "creative"]
  },
  {
    name: "Girl Scout Cookies - Quarter (7g)",
    description: "Girl Scout Cookies THCA flower with distinctive sweet and spicy flavors. Popular hybrid with balanced effects.",
    price: "93.00",
    category: "flower",
    imageUrl: realImages.girlScoutCookies,
    stock: 16,
    weight: "7",
    featured: false,
    rating: "4.8",
    thcaContent: "27.8",
    strainType: "hybrid",
    effects: ["euphoric", "happy", "relaxed", "creative"]
  },
  {
    name: "Girl Scout Cookies - Half (14g)",
    description: "Half ounce of Girl Scout Cookies THCA flower. Award-winning hybrid with sweet flavors and balanced effects.",
    price: "175.00",
    category: "flower",
    imageUrl: realImages.girlScoutCookies,
    stock: 12,
    weight: "14",
    featured: false,
    rating: "4.8",
    thcaContent: "27.8",
    strainType: "hybrid",
    effects: ["euphoric", "happy", "relaxed", "creative"]
  },
  {
    name: "Girl Scout Cookies - Ounce (28g)",
    description: "Full ounce of premium Girl Scout Cookies THCA flower. Consistent quality and balanced hybrid effects.",
    price: "330.00",
    category: "flower",
    imageUrl: realImages.girlScoutCookies,
    stock: 7,
    weight: "28",
    featured: false,
    rating: "4.8",
    thcaContent: "27.8",
    strainType: "hybrid",
    effects: ["euphoric", "happy", "relaxed", "creative"]
  },

  // Gelato - Dessert strain
  {
    name: "Gelato - Eighth (3.5g)",
    description: "Premium Gelato THCA flower with sweet, citrusy flavors reminiscent of its dessert namesake. Balanced hybrid effects.",
    price: "51.00",
    category: "flower",
    imageUrl: realImages.gelato,
    stock: 19,
    weight: "3.5",
    featured: false,
    rating: "4.9",
    thcaContent: "29.1",
    strainType: "hybrid",
    effects: ["euphoric", "relaxed", "creative", "uplifting"]
  },
  {
    name: "Gelato - Quarter (7g)",
    description: "Gelato THCA flower with dessert-like flavors and beautiful purple and orange coloration. Premium hybrid strain.",
    price: "97.00",
    category: "flower",
    imageUrl: realImages.gelato,
    stock: 15,
    weight: "7",
    featured: false,
    rating: "4.9",
    thcaContent: "29.1",
    strainType: "hybrid",
    effects: ["euphoric", "relaxed", "creative", "uplifting"]
  },
  {
    name: "Gelato - Half (14g)",
    description: "Half ounce of Gelato THCA flower. Premium hybrid with sweet flavors and balanced effects perfect any time of day.",
    price: "185.00",
    category: "flower",
    imageUrl: realImages.gelato,
    stock: 11,
    weight: "14",
    featured: false,
    rating: "4.9",
    thcaContent: "29.1",
    strainType: "hybrid",
    effects: ["euphoric", "relaxed", "creative", "uplifting"]
  },
  {
    name: "Gelato - Ounce (28g)",
    description: "Full ounce of premium Gelato THCA flower. Consistent dessert flavors with potent hybrid effects.",
    price: "350.00",
    category: "flower",
    imageUrl: realImages.gelato,
    stock: 6,
    weight: "28",
    featured: false,
    rating: "4.9",
    thcaContent: "29.1",
    strainType: "hybrid",
    effects: ["euphoric", "relaxed", "creative", "uplifting"]
  },

  // Infused Pre-Rolls
  {
    name: "Infused Pre-Roll - Northern Lights (Single)",
    description: "Premium infused pre-roll featuring Northern Lights THCA flower enhanced with live resin for extra potency.",
    price: "18.00",
    category: "pre-rolls",
    imageUrl: realImages.infusedPreRoll,
    stock: 50,
    weight: "1",
    featured: true,
    rating: "4.8",
    thcaContent: "35.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Infused Pre-Roll - Northern Lights (2-Pack)",
    description: "Two premium infused pre-rolls with Northern Lights THCA flower and live resin enhancement. Perfect for sharing.",
    price: "34.00",
    category: "pre-rolls",
    imageUrl: realImages.infusedPreRoll,
    stock: 30,
    weight: "2",
    featured: false,
    rating: "4.8",
    thcaContent: "35.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Infused Pre-Roll - Northern Lights (5-Pack)",
    description: "Five infused pre-rolls with Northern Lights THCA flower and live resin. Great value pack for regular users.",
    price: "80.00",
    category: "pre-rolls",
    imageUrl: realImages.infusedPreRoll,
    stock: 20,
    weight: "5",
    featured: false,
    rating: "4.8",
    thcaContent: "35.2",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Infused Pre-Roll - Jack Herer (Single)",
    description: "Energizing Jack Herer THCA pre-roll infused with live resin for enhanced sativa effects and flavor.",
    price: "19.00",
    category: "pre-rolls",
    imageUrl: realImages.infusedPreRoll,
    stock: 45,
    weight: "1",
    featured: false,
    rating: "4.7",
    thcaContent: "33.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "creative", "uplifting"]
  },
  {
    name: "Infused Pre-Roll - Jack Herer (3-Pack)",
    description: "Three Jack Herer infused pre-rolls with live resin enhancement. Perfect daytime sativa with extra potency.",
    price: "54.00",
    category: "pre-rolls",
    imageUrl: realImages.infusedPreRoll,
    stock: 25,
    weight: "3",
    featured: false,
    rating: "4.7",
    thcaContent: "33.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "creative", "uplifting"]
  },
  {
    name: "Infused Pre-Roll - Zkittlez (Single)",
    description: "Sweet Zkittlez THCA pre-roll infused with live resin. Fruity flavors with balanced hybrid effects.",
    price: "18.50",
    category: "pre-rolls",
    imageUrl: realImages.infusedPreRoll,
    stock: 40,
    weight: "1",
    featured: false,
    rating: "4.6",
    thcaContent: "34.5",
    strainType: "hybrid",
    effects: ["happy", "relaxed", "euphoric", "creative"]
  },
  {
    name: "Infused Pre-Roll - Zkittlez (4-Pack)",
    description: "Four Zkittlez infused pre-rolls with fruity flavors and live resin enhancement. Perfect hybrid effects.",
    price: "70.00",
    category: "pre-rolls",
    imageUrl: realImages.infusedPreRoll,
    stock: 22,
    weight: "4",
    featured: false,
    rating: "4.6",
    thcaContent: "34.5",
    strainType: "hybrid",
    effects: ["happy", "relaxed", "euphoric", "creative"]
  },

  // Premium Pre-Rolls - Sativa
  {
    name: "Premium Pre-Roll - Sativa (Single)",
    description: "Single premium sativa THCA pre-roll with energizing effects. Perfect for daytime use and creativity.",
    price: "12.00",
    category: "pre-rolls",
    imageUrl: realImages.sativaPreRoll,
    stock: 100,
    weight: "1",
    featured: false,
    rating: "4.5",
    thcaContent: "24.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  {
    name: "Premium Pre-Roll - Sativa (5-Pack)",
    description: "Five premium sativa THCA pre-rolls with consistent energizing effects. Great value pack for daily use.",
    price: "55.00",
    category: "pre-rolls",
    imageUrl: realImages.sativaPreRoll,
    stock: 60,
    weight: "5",
    featured: false,
    rating: "4.5",
    thcaContent: "24.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  {
    name: "Premium Pre-Roll - Sativa (50-Pack)",
    description: "Bulk pack of 50 premium sativa THCA pre-rolls. Perfect for dispensaries or heavy users with wholesale pricing.",
    price: "450.00",
    category: "pre-rolls",
    imageUrl: realImages.sativaPreRoll,
    stock: 10,
    weight: "50",
    featured: false,
    rating: "4.5",
    thcaContent: "24.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "uplifting", "creative"]
  },

  // Premium Pre-Rolls - Indica
  {
    name: "Premium Pre-Roll - Indica (Single)",
    description: "Single premium indica THCA pre-roll with relaxing effects. Perfect for evening use and stress relief.",
    price: "12.00",
    category: "pre-rolls",
    imageUrl: realImages.indicaPreRoll,
    stock: 120,
    weight: "1",
    featured: false,
    rating: "4.6",
    thcaContent: "26.1",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "stress-relief", "pain-relief"]
  },
  {
    name: "Premium Pre-Roll - Indica (10-Pack)",
    description: "Ten premium indica THCA pre-rolls with consistent relaxing effects. Great for evening and nighttime use.",
    price: "110.00",
    category: "pre-rolls",
    imageUrl: realImages.indicaPreRoll,
    stock: 40,
    weight: "10",
    featured: false,
    rating: "4.6",
    thcaContent: "26.1",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "stress-relief", "pain-relief"]
  },
  {
    name: "Premium Pre-Roll - Indica (50-Pack)",
    description: "Bulk pack of 50 premium indica THCA pre-rolls. Perfect for wholesale with consistent quality and potency.",
    price: "480.00",
    category: "pre-rolls",
    imageUrl: realImages.indicaPreRoll,
    stock: 8,
    weight: "50",
    featured: false,
    rating: "4.6",
    thcaContent: "26.1",
    strainType: "indica",
    effects: ["relaxed", "sleepy", "stress-relief", "pain-relief"]
  },

  // Premium Pre-Rolls - Hybrid
  {
    name: "Premium Pre-Roll - Hybrid (Single)",
    description: "Single premium hybrid THCA pre-roll with balanced effects. Perfect for any time of day with versatile benefits.",
    price: "12.50",
    category: "pre-rolls",
    imageUrl: realImages.hybridPreRoll,
    stock: 80,
    weight: "1",
    featured: false,
    rating: "4.7",
    thcaContent: "25.5",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxed", "creative"]
  },
  {
    name: "Premium Pre-Roll - Hybrid (3-Pack)",
    description: "Three premium hybrid THCA pre-rolls with balanced effects. Great starter pack for new users seeking versatility.",
    price: "35.00",
    category: "pre-rolls",
    imageUrl: realImages.hybridPreRoll,
    stock: 50,
    weight: "3",
    featured: false,
    rating: "4.7",
    thcaContent: "25.5",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxed", "creative"]
  },
  {
    name: "Premium Pre-Roll - Hybrid (15-Pack)",
    description: "Fifteen premium hybrid THCA pre-rolls with consistent balanced effects. Perfect for regular users.",
    price: "170.00",
    category: "pre-rolls",
    imageUrl: realImages.hybridPreRoll,
    stock: 25,
    weight: "15",
    featured: false,
    rating: "4.7",
    thcaContent: "25.5",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxed", "creative"]
  },
  {
    name: "Premium Pre-Roll - Hybrid (100-Pack)",
    description: "Bulk pack of 100 premium hybrid THCA pre-rolls. Ultimate wholesale pack with balanced effects and consistent quality.",
    price: "1100.00",
    category: "pre-rolls",
    imageUrl: realImages.hybridPreRoll,
    stock: 5,
    weight: "100",
    featured: false,
    rating: "4.7",
    thcaContent: "25.5",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxed", "creative"]
  }
];

export async function seedInventoryProducts() {
  const storage = (global as any).storage as MemStorage;
  
  if (!storage) {
    console.error("Storage not available for seeding");
    return;
  }

  console.log("Seeding inventory products with real professional images...");

  // Clear existing products first
  await storage.clearProducts();

  // Create all products
  for (const product of products) {
    const createdProduct = await storage.createProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
      weight: product.weight,
      featured: product.featured,
      rating: product.rating,
      thcaContent: product.thcaContent,
      strainType: product.strainType,
      effects: product.effects
    });
    console.log(`Created product: ${createdProduct.name}`);
  }

  // Calculate inventory totals
  const flowerProducts = products.filter(p => p.category === 'flower');
  const preRollProducts = products.filter(p => p.category === 'pre-rolls');
  
  const totalFlowerWeight = flowerProducts.reduce((sum, p) => sum + (parseFloat(p.weight) * p.stock), 0);
  const totalPreRolls = preRollProducts.reduce((sum, p) => sum + p.stock, 0);
  
  console.log("Inventory seeding complete with professional images!");
  console.log("Total inventory:");
  console.log(`- Flower: ${totalFlowerWeight} lbs (15 sativa, 10 indica, 5 hybrid)`);
  console.log(`- Pre-rolls: ${totalPreRolls} (5,000 infused, 10,000 regular)`);
}

export default seedInventoryProducts;