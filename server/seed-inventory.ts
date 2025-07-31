import { storage } from "./database-storage";

// Seed script to create products matching actual inventory
// 15 lbs sativa, 10 lbs indica, 5 lbs hybrid + 15K pre-rolls (5K infused)

const inventoryProducts = [
  // SATIVA FLOWER - Blue Dream (5 lbs total)
  {
    name: "Blue Dream - Eighth (3.5g)",
    description: "Legendary sativa-dominant hybrid with uplifting cerebral effects and sweet berry aroma. Perfect for creativity and productivity. High-mids quality at competitive prices.",
    price: "45.00",
    category: "flower",
    imageUrl: "/products/blue-dream.jpg",
    stock: 80, // 5 lbs = 80 eighths
    weight: "0.22",
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
    imageUrl: "/products/blue-dream.jpg",
    stock: 20, // 5 lbs = 20 halfs
    weight: "0.88",
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
    imageUrl: "/products/blue-dream.jpg",
    stock: 40, // 5 lbs = 40 quarters
    weight: "0.44",
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
    imageUrl: "/products/blue-dream.jpg",
    stock: 10, // 5 lbs = 10 ounces
    weight: "1.75",
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
    imageUrl: "/products/green-crack.jpg",
    stock: 80, // 5 lbs = 80 eighths
    weight: "0.22",
    featured: true,
    rating: "4.7",
    thcaContent: "24.1",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "creative"]
  },
  {
    name: "Green Crack - Quarter (7g)",
    description: "Potent sativa strain delivering an invigorating mental buzz. Sharp focus and energy boost ideal for daytime activities. Premium outdoor-grown flower.",
    price: "80.00",
    category: "flower", 
    imageUrl: "/products/green-crack.jpg",
    stock: 40, // 5 lbs = 40 quarters
    weight: "0.44",
    featured: false,
    rating: "4.7",
    thcaContent: "24.1",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "creative"]
  },
  {
    name: "Green Crack - Half (14g)",
    description: "Potent sativa strain delivering an invigorating mental buzz. Sharp focus and energy boost ideal for daytime activities. Premium outdoor-grown flower.",
    price: "155.00",
    category: "flower", 
    imageUrl: "/products/green-crack.jpg",
    stock: 20, // 5 lbs = 20 halfs
    weight: "0.88",
    featured: false,
    rating: "4.7",
    thcaContent: "24.1",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "creative"]
  },
  {
    name: "Green Crack - Ounce (28g)",
    description: "Potent sativa strain delivering an invigorating mental buzz. Sharp focus and energy boost ideal for daytime activities. Premium outdoor-grown flower.",
    price: "285.00",
    category: "flower", 
    imageUrl: "/products/green-crack.jpg",
    stock: 10, // 5 lbs = 10 ounces
    weight: "1.75",
    featured: false,
    rating: "4.7",
    thcaContent: "24.1",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "creative"]
  },
  // SATIVA FLOWER - Sour Diesel (5 lbs total)
  {
    name: "Sour Diesel - Eighth (3.5g)",
    description: "Iconic sativa with diesel aroma and fast-acting energetic effects. Stress relief without sedation. High-mids grade with exceptional terpene profile.",
    price: "48.00",
    category: "flower",
    imageUrl: "/products/sour-diesel.jpg",
    stock: 80, // 5 lbs = 80 eighths
    weight: "0.22", 
    featured: false,
    rating: "4.6",
    thcaContent: "21.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "stress-relief"]
  },
  {
    name: "Sour Diesel - Quarter (7g)",
    description: "Iconic sativa with diesel aroma and fast-acting energetic effects. Stress relief without sedation. High-mids grade with exceptional terpene profile.",
    price: "90.00",
    category: "flower",
    imageUrl: "/products/sour-diesel.jpg",
    stock: 40, // 5 lbs = 40 quarters
    weight: "0.44", 
    featured: false,
    rating: "4.6",
    thcaContent: "21.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "stress-relief"]
  },
  {
    name: "Sour Diesel - Half (14g)",
    description: "Iconic sativa with diesel aroma and fast-acting energetic effects. Stress relief without sedation. High-mids grade with exceptional terpene profile.",
    price: "170.00",
    category: "flower",
    imageUrl: "/products/sour-diesel.jpg",
    stock: 20, // 5 lbs = 20 halfs
    weight: "0.88", 
    featured: false,
    rating: "4.6",
    thcaContent: "21.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "stress-relief"]
  },
  {
    name: "Sour Diesel - Ounce (28g)",
    description: "Iconic sativa with diesel aroma and fast-acting energetic effects. Stress relief without sedation. High-mids grade with exceptional terpene profile.",
    price: "320.00",
    category: "flower",
    imageUrl: "/products/sour-diesel.jpg",
    stock: 10, // 5 lbs = 10 ounces
    weight: "1.75", 
    featured: false,
    rating: "4.6",
    thcaContent: "21.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "stress-relief"]
  },

  // INDICA FLOWER - OG Kush (4 lbs total)
  {
    name: "OG Kush - Eighth (3.5g)",
    description: "Classic indica with earthy pine aroma and deeply relaxing effects. Perfect for evening use and sleep support. High-mids quality with robust terpenes.",
    price: "50.00",
    category: "flower",
    imageUrl: "/products/og-kush.jpg", 
    stock: 64, // 4 lbs = 64 eighths
    weight: "0.22",
    featured: true,
    rating: "4.9",
    thcaContent: "25.3",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "OG Kush - Quarter (7g)",
    description: "Classic indica with earthy pine aroma and deeply relaxing effects. Perfect for evening use and sleep support. High-mids quality with robust terpenes.",
    price: "95.00",
    category: "flower",
    imageUrl: "/products/og-kush.jpg", 
    stock: 32, // 4 lbs = 32 quarters
    weight: "0.44",
    featured: false,
    rating: "4.9",
    thcaContent: "25.3",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "OG Kush - Half (14g)",
    description: "Classic indica with earthy pine aroma and deeply relaxing effects. Perfect for evening use and sleep support. High-mids quality with robust terpenes.",
    price: "180.00",
    category: "flower",
    imageUrl: "/products/og-kush.jpg", 
    stock: 16, // 4 lbs = 16 halfs
    weight: "0.88",
    featured: true,
    rating: "4.9",
    thcaContent: "25.3",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "OG Kush - Ounce (28g)",
    description: "Classic indica with earthy pine aroma and deeply relaxing effects. Perfect for evening use and sleep support. High-mids quality with robust terpenes.",
    price: "340.00",
    category: "flower",
    imageUrl: "/products/og-kush.jpg", 
    stock: 8, // 4 lbs = 8 ounces
    weight: "1.75",
    featured: false,
    rating: "4.9",
    thcaContent: "25.3",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },
  // INDICA FLOWER - Purple Punch (3 lbs total)
  {
    name: "Purple Punch - Eighth (3.5g)",
    description: "Sweet grape and berry flavored indica perfect for nighttime relaxation. Smooth smoke with calming body effects and mental tranquility.",
    price: "47.00",
    category: "flower",
    imageUrl: "/products/purple-punch.jpg",
    stock: 48, // 3 lbs = 48 eighths  
    weight: "0.22",
    featured: true,
    rating: "4.8",
    thcaContent: "23.7", 
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "stress-relief"]
  },
  {
    name: "Purple Punch - Quarter (7g)",
    description: "Sweet grape and berry flavored indica perfect for nighttime relaxation. Smooth smoke with calming body effects and mental tranquility.",
    price: "88.00",
    category: "flower",
    imageUrl: "/products/purple-punch.jpg",
    stock: 24, // 3 lbs = 24 quarters  
    weight: "0.44",
    featured: false,
    rating: "4.8",
    thcaContent: "23.7", 
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "stress-relief"]
  },
  {
    name: "Purple Punch - Half (14g)",
    description: "Sweet grape and berry flavored indica perfect for nighttime relaxation. Smooth smoke with calming body effects and mental tranquility.",
    price: "165.00",
    category: "flower",
    imageUrl: "/products/purple-punch.jpg",
    stock: 12, // 3 lbs = 12 halfs  
    weight: "0.88",
    featured: false,
    rating: "4.8",
    thcaContent: "23.7", 
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "stress-relief"]
  },
  {
    name: "Purple Punch - Ounce (28g)",
    description: "Sweet grape and berry flavored indica perfect for nighttime relaxation. Smooth smoke with calming body effects and mental tranquility.",
    price: "310.00",
    category: "flower",
    imageUrl: "/products/purple-punch.jpg",
    stock: 6, // 3 lbs = 6 ounces  
    weight: "1.75",
    featured: false,
    rating: "4.8",
    thcaContent: "23.7", 
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "stress-relief"]
  },
  // INDICA FLOWER - Granddaddy Purple (3 lbs total)
  {
    name: "Granddaddy Purple - Eighth (3.5g)", 
    description: "Legendary purple indica with grape and berry flavors. Deep physical relaxation and stress relief. Premium indoor-grown high-mids flower.",
    price: "45.00",
    category: "flower",
    imageUrl: "/products/granddaddy-purple.jpg",
    stock: 48, // 3 lbs = 48 eighths
    weight: "0.22",
    featured: false,
    rating: "4.7",
    thcaContent: "22.9",
    strainType: "indica", 
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Granddaddy Purple - Quarter (7g)", 
    description: "Legendary purple indica with grape and berry flavors. Deep physical relaxation and stress relief. Premium indoor-grown high-mids flower.",
    price: "85.00",
    category: "flower",
    imageUrl: "/products/granddaddy-purple.jpg",
    stock: 24, // 3 lbs = 24 quarters
    weight: "0.44",
    featured: false,
    rating: "4.7",
    thcaContent: "22.9",
    strainType: "indica", 
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Granddaddy Purple - Half (14g)", 
    description: "Legendary purple indica with grape and berry flavors. Deep physical relaxation and stress relief. Premium indoor-grown high-mids flower.",
    price: "160.00",
    category: "flower",
    imageUrl: "/products/granddaddy-purple.jpg",
    stock: 12, // 3 lbs = 12 halfs
    weight: "0.88",
    featured: false,
    rating: "4.7",
    thcaContent: "22.9",
    strainType: "indica", 
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Granddaddy Purple - Ounce (28g)", 
    description: "Legendary purple indica with grape and berry flavors. Deep physical relaxation and stress relief. Premium indoor-grown high-mids flower.",
    price: "300.00",
    category: "flower",
    imageUrl: "/products/granddaddy-purple.jpg",
    stock: 6, // 3 lbs = 6 ounces
    weight: "1.75",
    featured: false,
    rating: "4.7",
    thcaContent: "22.9",
    strainType: "indica", 
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },

  // HYBRID FLOWER - Girl Scout Cookies (2.5 lbs total)
  {
    name: "Girl Scout Cookies - Eighth (3.5g)",
    description: "Balanced hybrid with sweet and earthy flavors. Perfect combination of cerebral euphoria and physical relaxation. High-mids quality at mid-tier prices.",
    price: "52.00",
    category: "flower",
    imageUrl: "/products/girl-scout-cookies.jpg",
    stock: 40, // 2.5 lbs = 40 eighths
    weight: "0.22",
    featured: true,
    rating: "4.9",
    thcaContent: "26.1",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  {
    name: "Girl Scout Cookies - Quarter (7g)",
    description: "Balanced hybrid with sweet and earthy flavors. Perfect combination of cerebral euphoria and physical relaxation. High-mids quality at mid-tier prices.",
    price: "98.00",
    category: "flower",
    imageUrl: "/products/girl-scout-cookies.jpg",
    stock: 20, // 2.5 lbs = 20 quarters
    weight: "0.44",
    featured: false,
    rating: "4.9",
    thcaContent: "26.1",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  {
    name: "Girl Scout Cookies - Half (14g)",
    description: "Balanced hybrid with sweet and earthy flavors. Perfect combination of cerebral euphoria and physical relaxation. High-mids quality at mid-tier prices.",
    price: "185.00",
    category: "flower",
    imageUrl: "/products/girl-scout-cookies.jpg",
    stock: 10, // 2.5 lbs = 10 halfs
    weight: "0.88",
    featured: true,
    rating: "4.9",
    thcaContent: "26.1",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  {
    name: "Girl Scout Cookies - Ounce (28g)",
    description: "Balanced hybrid with sweet and earthy flavors. Perfect combination of cerebral euphoria and physical relaxation. High-mids quality at mid-tier prices.",
    price: "350.00",
    category: "flower",
    imageUrl: "/products/girl-scout-cookies.jpg",
    stock: 5, // 2.5 lbs = 5 ounces
    weight: "1.75",
    featured: false,
    rating: "4.9",
    thcaContent: "26.1",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  // HYBRID FLOWER - Gelato (2.5 lbs total)
  {
    name: "Gelato - Eighth (3.5g)",
    description: "Sweet dessert hybrid with fruity flavors and balanced effects. Uplifting mental high with gentle body relaxation. Premium craft cannabis.",
    price: "49.00", 
    category: "flower",
    imageUrl: "/products/gelato.jpg",
    stock: 40, // 2.5 lbs = 40 eighths
    weight: "0.22",
    featured: true,
    rating: "4.8",
    thcaContent: "24.8",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "creative", "relaxing"]
  },
  {
    name: "Gelato - Quarter (7g)",
    description: "Sweet dessert hybrid with fruity flavors and balanced effects. Uplifting mental high with gentle body relaxation. Premium craft cannabis.",
    price: "92.00", 
    category: "flower",
    imageUrl: "/products/gelato.jpg",
    stock: 20, // 2.5 lbs = 20 quarters
    weight: "0.44",
    featured: false,
    rating: "4.8",
    thcaContent: "24.8",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "creative", "relaxing"]
  },
  {
    name: "Gelato - Half (14g)",
    description: "Sweet dessert hybrid with fruity flavors and balanced effects. Uplifting mental high with gentle body relaxation. Premium craft cannabis.",
    price: "175.00", 
    category: "flower",
    imageUrl: "/products/gelato.jpg",
    stock: 10, // 2.5 lbs = 10 halfs
    weight: "0.88",
    featured: false,
    rating: "4.8",
    thcaContent: "24.8",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "creative", "relaxing"]
  },
  {
    name: "Gelato - Ounce (28g)",
    description: "Sweet dessert hybrid with fruity flavors and balanced effects. Uplifting mental high with gentle body relaxation. Premium craft cannabis.",
    price: "330.00", 
    category: "flower",
    imageUrl: "/products/gelato.jpg",
    stock: 5, // 2.5 lbs = 5 ounces
    weight: "1.75",
    featured: false,
    rating: "4.8",
    thcaContent: "24.8",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "creative", "relaxing"]
  },
  // INFUSED PRE-ROLLS - Northern Lights (Indica)
  {
    name: "Infused Pre-Roll - Northern Lights (Single)",
    description: "Premium pre-roll infused with live resin for enhanced potency and flavor. Classic indica strain perfect for relaxation and sleep.",
    price: "12.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-nl.jpg",
    stock: 1000, // 1000 singles
    weight: "0.06", // 1 gram each
    featured: true,
    rating: "4.9",
    thcaContent: "35.2", // Higher due to infusion
    strainType: "indica",
    effects: ["relaxing", "sleepy", "pain-relief", "euphoric"]
  },
  {
    name: "Infused Pre-Roll - Northern Lights (2-Pack)",
    description: "Two premium infused pre-rolls with live resin enhancement. Perfect for sharing or extended relaxation sessions.",
    price: "22.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-nl.jpg",
    stock: 150, // 300 total joints in 2-packs
    weight: "0.12",
    featured: false,
    rating: "4.9",
    thcaContent: "35.2",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "pain-relief", "euphoric"]
  },
  {
    name: "Infused Pre-Roll - Northern Lights (5-Pack)",
    description: "Five premium infused pre-rolls with live resin. Best value for regular users seeking premium indica effects.",
    price: "55.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-nl.jpg",
    stock: 100, // 500 total joints in 5-packs
    weight: "0.30",
    featured: true,
    rating: "4.9",
    thcaContent: "35.2",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "pain-relief", "euphoric"]
  },
  {
    name: "Infused Pre-Roll - Northern Lights (10-Pack)",
    description: "Ten premium infused pre-rolls with live resin. Bulk discount for serious indica enthusiasts.",
    price: "105.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-nl.jpg",
    stock: 50, // 500 total joints in 10-packs
    weight: "0.60",
    featured: false,
    rating: "4.9",
    thcaContent: "35.2",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "pain-relief", "euphoric"]
  },
  // INFUSED PRE-ROLLS - Jack Herer (Sativa)
  {
    name: "Infused Pre-Roll - Jack Herer (Single)",
    description: "Sativa-dominant pre-roll enhanced with live resin. Energizing and uplifting effects perfect for daytime use and creativity.",
    price: "12.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-jh.jpg", 
    stock: 1000, // 1000 singles
    weight: "0.06",
    featured: true,
    rating: "4.8",
    thcaContent: "34.7",
    strainType: "sativa",
    effects: ["energetic", "creative", "focused", "euphoric"]
  },
  {
    name: "Infused Pre-Roll - Jack Herer (3-Pack)",
    description: "Three premium infused sativa pre-rolls with live resin. Perfect for productive daytime sessions.",
    price: "34.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-jh.jpg", 
    stock: 100, // 300 total joints in 3-packs
    weight: "0.18",
    featured: false,
    rating: "4.8",
    thcaContent: "34.7",
    strainType: "sativa",
    effects: ["energetic", "creative", "focused", "euphoric"]
  },
  {
    name: "Infused Pre-Roll - Jack Herer (8-Pack)",
    description: "Eight premium infused sativa pre-rolls with live resin. Great value for daily energy boosters.",
    price: "88.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-jh.jpg", 
    stock: 50, // 400 total joints in 8-packs
    weight: "0.48",
    featured: true,
    rating: "4.8",
    thcaContent: "34.7",
    strainType: "sativa",
    effects: ["energetic", "creative", "focused", "euphoric"]
  },
  // INFUSED PRE-ROLLS - Zkittlez (Hybrid)
  {
    name: "Infused Pre-Roll - Zkittlez (Single)",
    description: "Hybrid pre-roll infused with live resin. Sweet fruity flavors with balanced effects for any time of day.",
    price: "12.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-zkittlez.jpg",
    stock: 1000, // 1000 singles
    weight: "0.06",
    featured: true,
    rating: "4.8",
    thcaContent: "33.9",
    strainType: "hybrid", 
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  {
    name: "Infused Pre-Roll - Zkittlez (4-Pack)",
    description: "Four premium infused hybrid pre-rolls with live resin. Perfect balance for versatile use throughout the day.",
    price: "45.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-zkittlez.jpg",
    stock: 75, // 300 total joints in 4-packs
    weight: "0.24",
    featured: false,
    rating: "4.8",
    thcaContent: "33.9",
    strainType: "hybrid", 
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  {
    name: "Infused Pre-Roll - Zkittlez (15-Pack)",
    description: "Fifteen premium infused hybrid pre-rolls with live resin. Ultimate value pack for balanced effects.",
    price: "160.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-zkittlez.jpg",
    stock: 20, // 300 total joints in 15-packs
    weight: "0.90",
    featured: true,
    rating: "4.8",
    thcaContent: "33.9",
    strainType: "hybrid", 
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },

  // REGULAR PRE-ROLLS - Sativa Mix
  {
    name: "Premium Pre-Roll - Sativa (Single)",
    description: "High-quality pre-roll made from premium sativa flower. Perfect for on-the-go energy and focus.",
    price: "6.00",
    category: "pre-rolls",
    imageUrl: "/products/prerolls-sativa.jpg",
    stock: 2000, // 2000 singles
    weight: "0.06",
    featured: false,
    rating: "4.5",
    thcaContent: "22.1",
    strainType: "sativa", 
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  {
    name: "Premium Pre-Roll - Sativa (5-Pack)",
    description: "Five premium sativa pre-rolls for extended energy and creativity sessions. Great value pack.",
    price: "28.00",
    category: "pre-rolls",
    imageUrl: "/products/prerolls-sativa.jpg",
    stock: 400, // 2000 total joints in 5-packs
    weight: "0.30",
    featured: true,
    rating: "4.5",
    thcaContent: "22.1",
    strainType: "sativa", 
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  {
    name: "Premium Pre-Roll - Sativa (50-Pack)",
    description: "Fifty premium sativa pre-rolls. Bulk pricing for dispensaries and heavy users.",
    price: "250.00",
    category: "pre-rolls",
    imageUrl: "/products/prerolls-sativa.jpg",
    stock: 13, // 650 total joints in 50-packs
    weight: "3.00",
    featured: false,
    rating: "4.5",
    thcaContent: "22.1",
    strainType: "sativa", 
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  {
    name: "Premium Pre-Roll - Sativa (100-Pack)",
    description: "One hundred premium sativa pre-rolls. Ultimate bulk discount for commercial buyers.",
    price: "480.00",
    category: "pre-rolls",
    imageUrl: "/products/prerolls-sativa.jpg",
    stock: 7, // 700 total joints in 100-packs
    weight: "6.00",
    featured: false,
    rating: "4.5",
    thcaContent: "22.1",
    strainType: "sativa", 
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  // REGULAR PRE-ROLLS - Indica Mix  
  {
    name: "Premium Pre-Roll - Indica (Single)", 
    description: "Relaxing indica pre-roll perfect for evening use and sleep support. Made from our high-mids flower selection.",
    price: "6.00",
    category: "pre-rolls",
    imageUrl: "/products/prerolls-indica.jpg",
    stock: 2000, // 2000 singles
    weight: "0.06",
    featured: false, 
    rating: "4.6",
    thcaContent: "23.5",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "stress-relief", "pain-relief"]
  },
  {
    name: "Premium Pre-Roll - Indica (10-Pack)", 
    description: "Ten relaxing indica pre-rolls perfect for evening wind-down sessions. Great value for sleep support.",
    price: "55.00",
    category: "pre-rolls",
    imageUrl: "/products/prerolls-indica.jpg",
    stock: 200, // 2000 total joints in 10-packs
    weight: "0.60",
    featured: true, 
    rating: "4.6",
    thcaContent: "23.5",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "stress-relief", "pain-relief"]
  },
  {
    name: "Premium Pre-Roll - Indica (50-Pack)", 
    description: "Fifty relaxing indica pre-rolls. Bulk discount for sleep aid and evening relaxation.",
    price: "270.00",
    category: "pre-rolls",
    imageUrl: "/products/prerolls-indica.jpg",
    stock: 12, // 600 total joints in 50-packs
    weight: "3.00",
    featured: false, 
    rating: "4.6",
    thcaContent: "23.5",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "stress-relief", "pain-relief"]
  },
  // REGULAR PRE-ROLLS - Hybrid Mix
  {
    name: "Premium Pre-Roll - Hybrid (Single)",
    description: "Balanced hybrid pre-roll offering the best of both worlds. Perfect for any time of day with versatile effects.",
    price: "6.00",
    category: "pre-rolls", 
    imageUrl: "/products/prerolls-hybrid.jpg",
    stock: 2000, // 2000 singles
    weight: "0.06",
    featured: false,
    rating: "4.4",
    thcaContent: "21.8",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  {
    name: "Premium Pre-Roll - Hybrid (3-Pack)",
    description: "Three balanced hybrid pre-rolls perfect for versatile daily use. Best of both sativa and indica effects.",
    price: "17.00",
    category: "pre-rolls", 
    imageUrl: "/products/prerolls-hybrid.jpg",
    stock: 500, // 1500 total joints in 3-packs
    weight: "0.18",
    featured: false,
    rating: "4.4",
    thcaContent: "21.8",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  {
    name: "Premium Pre-Roll - Hybrid (15-Pack)",
    description: "Fifteen balanced hybrid pre-rolls. Ultimate versatility pack for all-day use.",
    price: "80.00",
    category: "pre-rolls", 
    imageUrl: "/products/prerolls-hybrid.jpg",
    stock: 67, // 1005 total joints in 15-packs
    weight: "0.90",
    featured: true,
    rating: "4.4",
    thcaContent: "21.8",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  {
    name: "Premium Pre-Roll - Hybrid (100-Pack)",
    description: "One hundred balanced hybrid pre-rolls. Ultimate bulk value for dispensaries and heavy users.",
    price: "520.00",
    category: "pre-rolls", 
    imageUrl: "/products/prerolls-hybrid.jpg",
    stock: 5, // 500 total joints in 100-packs
    weight: "6.00",
    featured: false,
    rating: "4.4",
    thcaContent: "21.8",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  }
];

export async function seedInventoryProducts() {
  console.log("Seeding inventory products...");
  
  for (const product of inventoryProducts) {
    try {
      await storage.createProduct(product);
      console.log(`Created product: ${product.name}`);
    } catch (error) {
      console.log(`Product ${product.name} already exists or error:`, error.message);
    }
  }
  
  console.log("Inventory seeding complete!");
  console.log("Total inventory:");
  console.log("- Flower: 30 lbs (15 sativa, 10 indica, 5 hybrid)");
  console.log("- Pre-rolls: 15,000 (5,000 infused, 10,000 regular)");
}

// Export for use in routes
export default seedInventoryProducts;