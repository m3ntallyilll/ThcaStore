import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, varchar, text, decimal, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Define complete schema
const products = pgTable('products', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  stock: integer('stock').default(10),
  weight: text('weight'),
  featured: boolean('featured').default(false),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('4.5'),
  thcaContent: text('thca_content'),
  strainType: text('strain_type'),
  effects: jsonb('effects'),
  variants: jsonb('variants'),
  subcategory: text('subcategory'),
  potency: text('potency'),
  priceRange: jsonb('price_range'),
  createdAt: timestamp('created_at').defaultNow()
});

const newProducts = [
  // Premium Flower Strains
  {
    name: "Wedding Cake THCA Flower",
    description: "Premium Wedding Cake strain with high THCA content. Sweet vanilla and earthy flavors with relaxing effects.",
    price: "45.00",
    category: "flower", 
    subcategory: "indica-hybrid",
    imageUrl: "/attached_assets/generated_images/Wedding_Cake_strain_buds_b1c7b8d7.png",
    stock: 25,
    weight: "3.5g",
    featured: true,
    rating: "4.8",
    thcaContent: "28.5%",
    strainType: "indica-hybrid",
    potency: "High",
    effects: ["relaxed", "euphoric", "sleepy", "happy"],
    variants: [
      { weight: "1g", price: 15.00, stock: 30 },
      { weight: "3.5g", price: 45.00, stock: 25 },
      { weight: "7g", price: 85.00, stock: 15 },
      { weight: "14g", price: 160.00, stock: 8 }
    ]
  },
  {
    name: "Blue Dream Premium THCA",
    description: "Classic Blue Dream with exceptional THCA levels. Balanced hybrid with sweet berry flavors and uplifting effects.",
    price: "42.00",
    category: "flower",
    subcategory: "sativa-hybrid", 
    imageUrl: "/attached_assets/generated_images/Blue_Dream_hemp_strain_ee2cf878.png",
    stock: 30,
    weight: "3.5g",
    featured: true,
    rating: "4.9",
    thcaContent: "26.8%",
    strainType: "sativa-hybrid",
    potency: "High",
    effects: ["euphoric", "creative", "energetic", "happy"],
    variants: [
      { weight: "1g", price: 14.00, stock: 35 },
      { weight: "3.5g", price: 42.00, stock: 30 },
      { weight: "7g", price: 80.00, stock: 18 },
      { weight: "28g", price: 280.00, stock: 5 }
    ]
  },
  {
    name: "Girl Scout Cookies THCA",
    description: "Premium GSC with potent THCA content. Sweet and earthy with powerful relaxing effects.",
    price: "48.00",
    category: "flower",
    subcategory: "hybrid",
    imageUrl: "/attached_assets/generated_images/Girl_Scout_Cookies_strain_79b13530.png", 
    stock: 20,
    weight: "3.5g",
    featured: true,
    rating: "4.7",
    thcaContent: "30.2%",
    strainType: "hybrid",
    potency: "Very High",
    effects: ["relaxed", "euphoric", "creative", "focused"],
    variants: [
      { weight: "1g", price: 16.00, stock: 25 },
      { weight: "3.5g", price: 48.00, stock: 20 },
      { weight: "7g", price: 90.00, stock: 12 }
    ]
  },
  
  // Premium Joints Collection
  {
    name: "OG Kush Joints (3-Pack)",
    description: "Hand-rolled OG Kush joints made with premium THCA flower. Classic earthy and pine flavors.",
    price: "35.00",
    category: "prerolls",
    subcategory: "multi-pack",
    imageUrl: "/attached_assets/generated_images/Cannabis_joints_variety_pack.png",
    stock: 40,
    weight: "3 x 1.2g",
    featured: false,
    rating: "4.6",
    thcaContent: "25.4%",
    strainType: "indica",
    potency: "High",
    effects: ["relaxed", "sleepy", "euphoric"],
    variants: [
      { weight: "3 x 1.2g", price: 35.00, stock: 40 },
      { weight: "5 x 1.2g", price: 55.00, stock: 25 },
      { weight: "10 x 1.2g", price: 100.00, stock: 15 }
    ]
  },
  {
    name: "Gelato Hand-Rolled Joints",
    description: "Artisan hand-rolled Gelato joints with premium hemp papers. Sweet dessert flavors with balanced effects.",
    price: "14.00", 
    category: "prerolls",
    subcategory: "single",
    imageUrl: "/attached_assets/generated_images/Individual_cannabis_joint_closeup.png",
    stock: 60,
    weight: "1.2g",
    featured: false,
    rating: "4.5",
    thcaContent: "27.1%",
    strainType: "hybrid",
    potency: "High",
    effects: ["happy", "relaxed", "creative"],
    variants: [
      { weight: "1.2g", price: 14.00, stock: 60 },
      { weight: "2 x 1.2g", price: 26.00, stock: 30 }
    ]
  },
  
  // Concentrates
  {
    name: "Live Rosin THCA Concentrate",
    description: "Premium solventless live rosin with exceptional terpene profile. Full-spectrum THCA concentrate.",
    price: "65.00",
    category: "concentrates",
    subcategory: "rosin",
    imageUrl: "/attached_assets/generated_images/Hemp_live_resin_51ce0e4a.png",
    stock: 15,
    weight: "1g",
    featured: true,
    rating: "4.9",
    thcaContent: "85.2%",
    strainType: "hybrid",
    potency: "Very High",
    effects: ["euphoric", "relaxed", "creative", "focused"],
    variants: [
      { weight: "0.5g", price: 35.00, stock: 20 },
      { weight: "1g", price: 65.00, stock: 15 }
    ]
  },
  {
    name: "Diamond THCA Crystals", 
    description: "Pure THCA diamonds with incredible potency. Perfect for dabbing or adding to flower.",
    price: "80.00",
    category: "concentrates",
    subcategory: "diamonds",
    imageUrl: "/attached_assets/generated_images/THCA_diamond_concentrates_93d26771.png",
    stock: 10,
    weight: "1g",
    featured: true,
    rating: "4.8",
    thcaContent: "95.8%",
    strainType: "various",
    potency: "Maximum",
    effects: ["intense", "euphoric", "cerebral"],
    variants: [
      { weight: "0.5g", price: 45.00, stock: 15 },
      { weight: "1g", price: 80.00, stock: 10 }
    ]
  },
  
  // Variety Packs
  {
    name: "THCA Sampler Variety Pack",
    description: "Mix of our top strains including flower, joints, and concentrates. Perfect for trying different products.",
    price: "120.00",
    category: "variety-packs",
    subcategory: "sampler",
    imageUrl: "/attached_assets/generated_images/Hemp_product_variety_showcase_667244b5.png",
    stock: 12,
    weight: "Mixed",
    featured: true,
    rating: "4.7",
    thcaContent: "Various",
    strainType: "mixed",
    potency: "Various",
    effects: ["various", "educational", "discovery"],
    variants: [
      { weight: "Starter Pack", price: 75.00, stock: 20 },
      { weight: "Full Sampler", price: 120.00, stock: 12 },
      { weight: "Premium Collection", price: 200.00, stock: 6 }
    ]
  },
  
  // Edibles
  {
    name: "THCA Gummies - Mixed Berry",
    description: "Delicious mixed berry gummies infused with premium THCA. 10mg per gummy, 20 count bottle.",
    price: "35.00",
    category: "edibles",
    subcategory: "gummies",
    imageUrl: "/attached_assets/generated_images/Hemp_gummy_edibles_4f465d60.png",
    stock: 25,
    weight: "200mg total",
    featured: false,
    rating: "4.4",
    thcaContent: "10mg per piece",
    strainType: "various",
    potency: "Medium",
    effects: ["relaxed", "happy", "sleepy"],
    variants: [
      { weight: "10-count", price: 20.00, stock: 30 },
      { weight: "20-count", price: 35.00, stock: 25 }
    ]
  },
  
  // Accessories
  {
    name: "Premium Hemp Grinder",
    description: "High-quality 4-piece grinder perfect for THCA flower. Sharp teeth and magnetic top.",
    price: "25.00",
    category: "accessories",
    subcategory: "grinders",
    imageUrl: "/attached_assets/generated_images/Premium_herb_grinder_c4439ae7.png",
    stock: 50,
    weight: "Standard",
    featured: false,
    rating: "4.6",
    thcaContent: "N/A",
    strainType: "N/A",
    potency: "N/A",
    effects: ["utility"],
    variants: [
      { weight: "2-piece", price: 15.00, stock: 40 },
      { weight: "4-piece", price: 25.00, stock: 50 }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with comprehensive THCA products...');
    
    let seededCount = 0;
    
    for (const productData of newProducts) {
      const productId = nanoid();
      
      await db.insert(products).values({
        id: productId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        imageUrl: productData.imageUrl,
        stock: productData.stock,
        weight: productData.weight,
        featured: productData.featured,
        rating: productData.rating,
        thcaContent: productData.thcaContent,
        strainType: productData.strainType,
        effects: productData.effects,
        variants: productData.variants,
        subcategory: productData.subcategory,
        potency: productData.potency,
        priceRange: {
          min: Math.min(...productData.variants.map(v => v.price)),
          max: Math.max(...productData.variants.map(v => v.price))
        }
      });
      
      seededCount++;
      console.log(`✅ Seeded: ${productData.name}`);
    }
    
    console.log(`🎉 Successfully seeded ${seededCount} new premium products!`);
    console.log('📦 Added premium flower strains, hand-rolled joints, concentrates, variety packs, edibles, and accessories');
    console.log('🌿 All products have realistic THCA content, authentic strain types, and detailed variant options');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();