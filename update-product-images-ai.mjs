#!/usr/bin/env node

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import { products } from "./shared/schema.js";
import { eq, like } from 'drizzle-orm';
import 'dotenv/config';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

// AI-generated image mappings
const aiImageMap = {
  'sour diesel': '/src/assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png',
  'purple koolaid': '/src/assets/generated_images/Purple_Koolaid_THCA_flower_a7e52253.png', 
  'purple': '/src/assets/generated_images/Purple_Koolaid_THCA_flower_a7e52253.png',
  'runtz': '/src/assets/generated_images/Runtz_THCA_flower_22bdedde.png',
  'sour lemon': '/src/assets/generated_images/Sour_Lemon_Diesel_flower_c1f2a950.png',
  'lemon': '/src/assets/generated_images/Sour_Lemon_Diesel_flower_c1f2a950.png',
  'too tall': '/src/assets/generated_images/Too_Tall_THCA_flower_8b45913e.png'
};

// Category-specific defaults
const categoryDefaults = {
  'prerolls': '/src/assets/generated_images/THCA_hemp_pre-rolls_70e0ccf9.png',
  'variety-packs': '/src/assets/generated_images/THCA_variety_pack_dd4e2f15.png',
  'flower': '/src/assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png' // Default flower image
};

function getStrainImage(productName, category) {
  const nameLower = productName.toLowerCase();
  
  // Check for exact strain matches first
  for (const [strain, imageUrl] of Object.entries(aiImageMap)) {
    if (nameLower.includes(strain)) {
      return imageUrl;
    }
  }
  
  // Fall back to category defaults
  return categoryDefaults[category] || categoryDefaults['flower'];
}

async function updateProductImages() {
  try {
    console.log('🎨 Starting AI-generated product image update...');
    
    // Get all products
    const allProducts = await db.select().from(products);
    console.log(`Found ${allProducts.length} products to update`);
    
    let updatedCount = 0;
    
    for (const product of allProducts) {
      const newImageUrl = getStrainImage(product.name, product.category);
      
      // Only update if the image URL is different
      if (product.imageUrl !== newImageUrl) {
        await db.update(products)
          .set({ imageUrl: newImageUrl })
          .where(eq(products.id, product.id));
        
        console.log(`📸 Updated ${product.name} (${product.category}) -> ${newImageUrl.split('/').pop()}`);
        updatedCount++;
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} products with AI-generated images!`);
    
    // Show summary by category
    const summary = await db.select().from(products);
    const categoryCount = summary.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Product Summary by Category:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  } finally {
    await pool.end();
  }
}

updateProductImages();