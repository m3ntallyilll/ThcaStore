#!/usr/bin/env node
import { storage } from "./storage";

// Database product seeding script
async function seedDatabaseProducts() {
  console.log("🌱 Starting database product seeding...");

  try {
    // Clear existing products first
    await storage.clearProducts();
    console.log("✅ Cleared existing products");

    // Sample THCA products for database seeding
    const thcaProducts = [
      // FLOWER PRODUCTS
      {
        name: "Blue Dream - Eighth (3.5g)",
        description: "Legendary sativa-dominant hybrid with uplifting cerebral effects and sweet berry aroma. Perfect for creativity and productivity. High-mids quality at competitive prices.",
        price: "45.00",
        category: "flower",
        imageUrl: "/attached_assets/generated_images/Blue_Dream_strain_flower_30991155.png",
        stock: 80,
        weight: "3.5g",
        featured: true,
        rating: "4.8",
        thcaContent: "22.5%",
        strainType: "sativa",
        effects: ["energetic", "creative", "uplifting", "focused"],
        subcategory: "premium",
        potency: "High"
      },
      {
        name: "OG Kush - Quarter (7g)",
        description: "Classic indica-dominant strain with heavy relaxation effects and earthy pine aroma. Perfect for evening use and stress relief.",
        price: "85.00",
        category: "flower",
        imageUrl: "/attached_assets/generated_images/OG_Kush_strain_flower_87654321.png",
        stock: 40,
        weight: "7g",
        featured: true,
        rating: "4.7",
        thcaContent: "24.2%",
        strainType: "indica",
        effects: ["relaxing", "sleepy", "euphoric", "pain-relief"],
        subcategory: "premium",
        potency: "High"
      },
      {
        name: "Green Crack - Half Ounce (14g)",
        description: "Energizing sativa with intense focus and motivation effects. Citrusy sweet flavor with tropical undertones.",
        price: "160.00",
        category: "flower",
        imageUrl: "/attached_assets/generated_images/Green_Crack_strain_flower_19876543.png",
        stock: 25,
        weight: "14g",
        featured: false,
        rating: "4.6",
        thcaContent: "21.8%",
        strainType: "sativa",
        effects: ["energetic", "focused", "creative", "uplifting"],
        subcategory: "premium",
        potency: "Medium"
      },
      
      // PRE-ROLL PRODUCTS
      {
        name: "Premium Pre-Roll - Blue Dream (1.1g)",
        description: "Hand-rolled premium pre-roll with Blue Dream flower. Perfect single serving for on-the-go convenience.",
        price: "12.00",
        category: "prerolls",
        imageUrl: "/attached_assets/generated_images/Blue_Dream_preroll_single_45123789.png",
        stock: 150,
        weight: "1.1g",
        featured: true,
        rating: "4.5",
        thcaContent: "22.5%",
        strainType: "sativa",
        effects: ["energetic", "creative", "uplifting"],
        subcategory: "single",
        potency: "High"
      },
      {
        name: "Indica Pre-Roll Pack (5-Pack)",
        description: "Five premium indica pre-rolls for deep relaxation. Mixed strains including OG Kush, Purple Punch, and Granddaddy Purple.",
        price: "45.00",
        category: "prerolls",
        imageUrl: "/attached_assets/generated_images/Indica_preroll_pack_5x_78965412.png",
        stock: 30,
        weight: "5.5g",
        featured: true,
        rating: "4.8",
        thcaContent: "24.0%",
        strainType: "indica",
        effects: ["relaxing", "sleepy", "pain-relief", "stress-relief"],
        subcategory: "pack",
        potency: "High"
      },
      
      // CONCENTRATES
      {
        name: "Live Resin - Wedding Cake (1g)",
        description: "Premium live resin concentrate with full spectrum terpenes. Extracted from fresh-frozen Wedding Cake flower.",
        price: "65.00",
        category: "concentrates",
        imageUrl: "/attached_assets/generated_images/Wedding_Cake_live_resin_1g_23456789.png",
        stock: 20,
        weight: "1g",
        featured: true,
        rating: "4.9",
        thcaContent: "78.5%",
        strainType: "hybrid",
        effects: ["euphoric", "relaxing", "happy", "creative"],
        subcategory: "live_resin",
        potency: "Extra High"
      },
      
      // EDIBLES
      {
        name: "THCA Gummies - Mixed Berry (10mg x 10)",
        description: "Delicious mixed berry gummies infused with high-quality THCA. Each gummy contains 10mg for precise dosing.",
        price: "35.00",
        category: "edibles",
        imageUrl: "/attached_assets/generated_images/Mixed_Berry_gummies_10mg_34567890.png",
        stock: 50,
        weight: "100mg",
        featured: false,
        rating: "4.4",
        thcaContent: "100mg",
        strainType: "hybrid",
        effects: ["relaxing", "euphoric", "happy", "sleepy"],
        subcategory: "gummies",
        potency: "Medium"
      }
    ];

    console.log(`🌿 Creating ${thcaProducts.length} THCA products...`);

    let createdCount = 0;
    for (const productData of thcaProducts) {
      try {
        const product = await storage.createProduct(productData);
        console.log(`✅ Created: ${product.name}`);
        createdCount++;
      } catch (error) {
        console.error(`❌ Failed to create ${productData.name}:`, error);
      }
    }

    console.log(`\n🎉 Database seeding complete!`);
    console.log(`📊 Successfully created ${createdCount}/${thcaProducts.length} products`);
    
    // Verify products were created
    const allProducts = await storage.getProducts();
    console.log(`🔍 Total products in database: ${allProducts.length}`);

  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabaseProducts()
    .then(() => {
      console.log("✅ Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabaseProducts };