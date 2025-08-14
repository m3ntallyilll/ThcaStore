import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, varchar, text, decimal, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

// Define products table schema - simplified to just what we need
const products = pgTable('products', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  subcategory: varchar('subcategory', { length: 100 }),
  imageUrl: text('image_url'),
  featured: boolean('featured').default(false),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('4.5'),
  thcaContent: varchar('thca_content', { length: 50 }),
  strainType: varchar('strain_type', { length: 50 }),
  potency: varchar('potency', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow()
});

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const newRealisticImages = [
  '/attached_assets/generated_images/Cannabis_flower_jar_photo_874c1f39.png',
  '/attached_assets/generated_images/THCA_pre-rolls_tubes_32b6db8a.png', 
  '/attached_assets/generated_images/Cannabis_concentrate_shatter_eaa57847.png',
  '/attached_assets/generated_images/Premium_THCA_flower_buds_749c5443.png',
  '/attached_assets/generated_images/Pre-roll_variety_pack_box_af13a98e.png',
  '/attached_assets/generated_images/Cannabis_flower_on_scale_86fac261.png',
  // Previous realistic images
  '/attached_assets/generated_images/Hemp_pre-rolls_in_tubes_eff785cb.png',
  '/attached_assets/generated_images/Premium_THCA_flower_realistic_a8b2f1d4.png',
  '/attached_assets/generated_images/Cannabis_variety_pack_realistic_c3e5a7b9.png',
  '/attached_assets/generated_images/THCA_flower_close-up_realistic_f2d8c4e1.png',
  '/attached_assets/generated_images/Indoor_cannabis_flower_realistic_9a7e3f2c.png',
  '/attached_assets/generated_images/Premium_cannabis_pre-rolls_realistic_b5d9c8a4.png',
  '/attached_assets/generated_images/Mixed_cannabis_products_realistic_e7f1a3d8.png'
];

async function updateAllProductImages() {
  try {
    console.log('🔄 Updating all products with new realistic images...');
    
    // Get all products
    const allProducts = await db.select().from(products);
    console.log(`📦 Found ${allProducts.length} products to update`);

    let updateCount = 0;
    
    for (const product of allProducts) {
      // Assign images based on category and product type
      let imageUrl;
      
      if (product.category === 'prerolls' || product.name.toLowerCase().includes('pre-roll')) {
        // Use pre-roll specific images
        const prerollImages = [
          '/attached_assets/generated_images/THCA_pre-rolls_tubes_32b6db8a.png',
          '/attached_assets/generated_images/Hemp_pre-rolls_in_tubes_eff785cb.png',
          '/attached_assets/generated_images/Premium_cannabis_pre-rolls_realistic_b5d9c8a4.png',
          '/attached_assets/generated_images/Pre-roll_variety_pack_box_af13a98e.png'
        ];
        imageUrl = prerollImages[updateCount % prerollImages.length];
      } else if (product.category === 'concentrates' || product.name.toLowerCase().includes('shatter')) {
        // Use concentrate specific images  
        imageUrl = '/attached_assets/generated_images/Cannabis_concentrate_shatter_eaa57847.png';
      } else if (product.name.toLowerCase().includes('variety') || product.name.toLowerCase().includes('pack')) {
        // Use variety pack images
        const varietyImages = [
          '/attached_assets/generated_images/Pre-roll_variety_pack_box_af13a98e.png',
          '/attached_assets/generated_images/Cannabis_variety_pack_realistic_c3e5a7b9.png',
          '/attached_assets/generated_images/Mixed_cannabis_products_realistic_e7f1a3d8.png'
        ];
        imageUrl = varietyImages[updateCount % varietyImages.length];
      } else {
        // Use flower images for everything else
        const flowerImages = [
          '/attached_assets/generated_images/Cannabis_flower_jar_photo_874c1f39.png',
          '/attached_assets/generated_images/Premium_THCA_flower_buds_749c5443.png',
          '/attached_assets/generated_images/Cannabis_flower_on_scale_86fac261.png',
          '/attached_assets/generated_images/Premium_THCA_flower_realistic_a8b2f1d4.png',
          '/attached_assets/generated_images/THCA_flower_close-up_realistic_f2d8c4e1.png',
          '/attached_assets/generated_images/Indoor_cannabis_flower_realistic_9a7e3f2c.png'
        ];
        imageUrl = flowerImages[updateCount % flowerImages.length];
      }

      // Update the product
      await db.update(products)
        .set({ imageUrl })
        .where(eq(products.id, product.id));
        
      updateCount++;
      
      if (updateCount % 20 === 0) {
        console.log(`✅ Updated ${updateCount}/${allProducts.length} products...`);
      }
    }

    console.log(`🎉 Successfully updated all ${updateCount} products with new realistic images!`);
    console.log(`📸 Using ${newRealisticImages.length} unique realistic cannabis images`);
    console.log('✨ All products now have authentic Android phone camera quality photos');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

updateAllProductImages();