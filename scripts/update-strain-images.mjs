#!/usr/bin/env node

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Simple products schema for this script
const products = {
  id: 'id',
  name: 'name', 
  imageUrl: 'image_url'
};

// Database setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { products } });

// Strain-specific image mapping
const strainImageMap = {
  'sour diesel': '/src/assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png',
  'purple koolaid': '/src/assets/generated_images/Purple_Koolaid_THCA_flower_a7e52253.png',
  'purple': '/src/assets/generated_images/Purple_Koolaid_THCA_flower_a7e52253.png',
  'runtz': '/src/assets/generated_images/Runtz_THCA_flower_22bdedde.png',
  'sour lemon': '/src/assets/generated_images/Sour_Lemon_Diesel_flower_c1f2a950.png',
  'lemon': '/src/assets/generated_images/Sour_Lemon_Diesel_flower_c1f2a950.png',
  'too tall': '/src/assets/generated_images/Too_Tall_THCA_flower_8b45913e.png',
  'blue dream': '/src/assets/generated_images/Blue_Dream_hemp_strain_ee2cf878.png',
  'gelato': '/src/assets/generated_images/Gelato_hemp_strain_1a2aebbb.png',
  'girl scout': '/src/assets/generated_images/Girl_Scout_Cookies_strain_79b13530.png',
  'gsc': '/src/assets/generated_images/Girl_Scout_Cookies_strain_79b13530.png',
  'green crack': '/src/assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png',
  'jack herer': '/src/assets/generated_images/Jack_Herer_hemp_strain_bae15f39.png',
  'northern lights': '/src/assets/generated_images/Northern_Lights_hemp_strain_f76fb796.png',
  'og kush': '/src/assets/generated_images/OG_Kush_hemp_strain_970f7637.png',
  'og': '/src/assets/generated_images/OG_Kush_hemp_strain_970f7637.png',
  'purple punch': '/src/assets/generated_images/Purple_Punch_hemp_strain_5a390f11.png',
  'white widow': '/src/assets/generated_images/White_Widow_hemp_strain_1f35747f.png',
  'indica': '/src/assets/generated_images/Indica_hemp_flower_d4c0d165.png',
  'sativa': '/src/assets/generated_images/Sativa_hemp_flower_61fa5cdb.png',
  'pre-roll': '/src/assets/generated_images/THCA_hemp_pre-rolls_70e0ccf9.png',
  'preroll': '/src/assets/generated_images/THCA_hemp_pre-rolls_70e0ccf9.png',
  'variety': '/src/assets/generated_images/THCA_variety_pack_dd4e2f15.png',
  'pack': '/src/assets/generated_images/THCA_variety_pack_dd4e2f15.png'
};

const defaultImage = '/src/assets/generated_images/Premium_hemp_flower_buds_568629db.png';

function getStrainImage(productName) {
  const name = productName.toLowerCase();
  
  // Check for specific strain matches
  for (const [strain, imagePath] of Object.entries(strainImageMap)) {
    if (name.includes(strain)) {
      return imagePath;
    }
  }
  
  return defaultImage;
}

async function updateProductImages() {
  try {
    console.log('🌿 Starting strain-specific image update...');
    
    // Get all products
    const allProducts = await db.select().from(products);
    console.log(`Found ${allProducts.length} products to update`);
    
    let updatedCount = 0;
    
    for (const product of allProducts) {
      const newImageUrl = getStrainImage(product.name);
      
      // Only update if the image is different
      if (product.imageUrl !== newImageUrl) {
        await db
          .update(products)
          .set({ imageUrl: newImageUrl })
          .where(eq(products.id, product.id));
        
        console.log(`✓ Updated "${product.name}" with strain-specific image`);
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with strain-specific images!`);
    console.log('\nStrain images assigned:');
    
    // Show summary of strain assignments
    const strainSummary = {};
    const updatedProducts = await db.select().from(products);
    
    updatedProducts.forEach(product => {
      const imageName = product.imageUrl.split('/').pop().split('_')[0];
      strainSummary[imageName] = (strainSummary[imageName] || 0) + 1;
    });
    
    Object.entries(strainSummary).forEach(([strain, count]) => {
      console.log(`  ${strain}: ${count} products`);
    });
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  } finally {
    await pool.end();
  }
}

updateProductImages();