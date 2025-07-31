import { storage } from "./database-storage";

// Seed script to create products matching actual inventory
// 15 lbs sativa, 10 lbs indica, 5 lbs hybrid + 15K pre-rolls (5K infused)

const inventoryProducts = [
  // SATIVA FLOWER (15 lbs total)
  {
    name: "Blue Dream - Premium Sativa",
    description: "Legendary sativa-dominant hybrid with uplifting cerebral effects and sweet berry aroma. Perfect for creativity and productivity. High-mids quality at competitive prices.",
    price: "45.00",
    category: "flower",
    imageUrl: "/products/blue-dream.jpg",
    stock: 240, // 15 lbs = 240 eighths
    weight: "0.25",
    featured: true,
    rating: "4.8",
    thcaContent: "22.5",
    strainType: "sativa",
    effects: ["energetic", "creative", "uplifting", "focused"]
  },
  {
    name: "Green Crack - Energizing Sativa",
    description: "Potent sativa strain delivering an invigorating mental buzz. Sharp focus and energy boost ideal for daytime activities. Premium outdoor-grown flower.",
    price: "42.00",
    category: "flower", 
    imageUrl: "/products/green-crack.jpg",
    stock: 160, // 10 lbs worth
    weight: "0.25",
    featured: true,
    rating: "4.7",
    thcaContent: "24.1",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "creative"]
  },
  {
    name: "Sour Diesel - Classic Sativa",
    description: "Iconic sativa with diesel aroma and fast-acting energetic effects. Stress relief without sedation. High-mids grade with exceptional terpene profile.",
    price: "48.00",
    category: "flower",
    imageUrl: "/products/sour-diesel.jpg",
    stock: 120, // 7.5 lbs worth
    weight: "0.25", 
    featured: false,
    rating: "4.6",
    thcaContent: "21.8",
    strainType: "sativa",
    effects: ["energetic", "focused", "euphoric", "stress-relief"]
  },

  // INDICA FLOWER (10 lbs total)
  {
    name: "OG Kush - Premium Indica",
    description: "Classic indica with earthy pine aroma and deeply relaxing effects. Perfect for evening use and sleep support. High-mids quality with robust terpenes.",
    price: "50.00",
    category: "flower",
    imageUrl: "/products/og-kush.jpg", 
    stock: 160, // 10 lbs = 160 eighths
    weight: "0.25",
    featured: true,
    rating: "4.9",
    thcaContent: "25.3",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },
  {
    name: "Purple Punch - Relaxing Indica",
    description: "Sweet grape and berry flavored indica perfect for nighttime relaxation. Smooth smoke with calming body effects and mental tranquility.",
    price: "47.00",
    category: "flower",
    imageUrl: "/products/purple-punch.jpg",
    stock: 120, // 7.5 lbs worth  
    weight: "0.25",
    featured: true,
    rating: "4.8",
    thcaContent: "23.7", 
    strainType: "indica",
    effects: ["relaxing", "sleepy", "euphoric", "stress-relief"]
  },
  {
    name: "Granddaddy Purple - Classic Indica", 
    description: "Legendary purple indica with grape and berry flavors. Deep physical relaxation and stress relief. Premium indoor-grown high-mids flower.",
    price: "45.00",
    category: "flower",
    imageUrl: "/products/granddaddy-purple.jpg",
    stock: 80, // 5 lbs worth
    weight: "0.25",
    featured: false,
    rating: "4.7",
    thcaContent: "22.9",
    strainType: "indica", 
    effects: ["relaxing", "sleepy", "euphoric", "pain-relief"]
  },

  // HYBRID FLOWER (5 lbs total)
  {
    name: "Girl Scout Cookies - Premium Hybrid",
    description: "Balanced hybrid with sweet and earthy flavors. Perfect combination of cerebral euphoria and physical relaxation. High-mids quality at mid-tier prices.",
    price: "52.00",
    category: "flower",
    imageUrl: "/products/girl-scout-cookies.jpg",
    stock: 80, // 5 lbs = 80 eighths
    weight: "0.25",
    featured: true,
    rating: "4.9",
    thcaContent: "26.1",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },
  {
    name: "Gelato - Dessert Hybrid",
    description: "Sweet dessert hybrid with fruity flavors and balanced effects. Uplifting mental high with gentle body relaxation. Premium craft cannabis.",
    price: "49.00", 
    category: "flower",
    imageUrl: "/products/gelato.jpg",
    stock: 60, // 3.75 lbs worth
    weight: "0.25",
    featured: true,
    rating: "4.8",
    thcaContent: "24.8",
    strainType: "hybrid",
    effects: ["balanced", "euphoric", "creative", "relaxing"]
  },
  {
    name: "Wedding Cake - Balanced Hybrid",
    description: "Rich vanilla and earthy hybrid with relaxing yet uplifting effects. Premium quality flower perfect for any time of day.",
    price: "46.00",
    category: "flower", 
    imageUrl: "/products/wedding-cake.jpg",
    stock: 40, // 2.5 lbs worth
    weight: "0.25",
    featured: false,
    rating: "4.7",
    thcaContent: "23.4",
    strainType: "hybrid",
    effects: ["balanced", "relaxing", "euphoric", "stress-relief"]
  },

  // PRE-ROLLS (15,000 total - 5,000 infused, 10,000 regular)
  {
    name: "Infused Pre-Rolls - Northern Lights",
    description: "Premium pre-rolls infused with live resin for enhanced potency and flavor. Classic indica strain perfect for relaxation and sleep.",
    price: "12.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-nl.jpg",
    stock: 1667, // 5000 infused / 3 strains
    weight: "0.06", // 1 gram each
    featured: true,
    rating: "4.9",
    thcaContent: "35.2", // Higher due to infusion
    strainType: "indica",
    effects: ["relaxing", "sleepy", "pain-relief", "euphoric"]
  },
  {
    name: "Infused Pre-Rolls - Jack Herer",
    description: "Sativa-dominant pre-rolls enhanced with live resin. Energizing and uplifting effects perfect for daytime use and creativity.",
    price: "12.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-jh.jpg", 
    stock: 1667, // 5000 infused / 3 strains
    weight: "0.06",
    featured: true,
    rating: "4.8",
    thcaContent: "34.7",
    strainType: "sativa",
    effects: ["energetic", "creative", "focused", "euphoric"]
  },
  {
    name: "Infused Pre-Rolls - Zkittlez",
    description: "Hybrid pre-rolls infused with live resin. Sweet fruity flavors with balanced effects for any time of day.",
    price: "12.00",
    category: "pre-rolls",
    imageUrl: "/products/infused-prerolls-zkittlez.jpg",
    stock: 1666, // 5000 infused / 3 strains  
    weight: "0.06",
    featured: true,
    rating: "4.8",
    thcaContent: "33.9",
    strainType: "hybrid", 
    effects: ["balanced", "euphoric", "relaxing", "creative"]
  },

  // REGULAR PRE-ROLLS (10,000 total)
  {
    name: "Premium Pre-Rolls - Sativa Mix",
    description: "High-quality pre-rolls made from premium sativa flower. Perfect for on-the-go energy and focus. Value pack available.",
    price: "6.00",
    category: "pre-rolls",
    imageUrl: "/products/prerolls-sativa.jpg",
    stock: 3334, // 10000 regular / 3 types
    weight: "0.06",
    featured: false,
    rating: "4.5",
    thcaContent: "22.1",
    strainType: "sativa", 
    effects: ["energetic", "focused", "uplifting", "creative"]
  },
  {
    name: "Premium Pre-Rolls - Indica Mix", 
    description: "Relaxing indica pre-rolls perfect for evening use and sleep support. Made from our high-mids flower selection.",
    price: "6.00",
    category: "pre-rolls",
    imageUrl: "/products/prerolls-indica.jpg",
    stock: 3333, // 10000 regular / 3 types
    weight: "0.06",
    featured: false, 
    rating: "4.6",
    thcaContent: "23.5",
    strainType: "indica",
    effects: ["relaxing", "sleepy", "stress-relief", "pain-relief"]
  },
  {
    name: "Premium Pre-Rolls - Hybrid Mix",
    description: "Balanced hybrid pre-rolls offering the best of both worlds. Perfect for any time of day with versatile effects.",
    price: "6.00",
    category: "pre-rolls", 
    imageUrl: "/products/prerolls-hybrid.jpg",
    stock: 3333, // 10000 regular / 3 types
    weight: "0.06",
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