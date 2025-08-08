import { db } from './db.ts';
import { products } from '../shared/schema.ts';
import { eq, like } from 'drizzle-orm';

// New image URL for pre-roll packs
const newPrerollPackImage = '/attached_assets/generated_images/attached_assets/generated_images/Hemp_pre-roll_variety_pack_7d836cbe.png';

async function updatePrerollPackImages() {
  try {
    console.log('🔄 Updating pre-roll pack images...');
    
    // Find all pre-roll products that contain "pack" in their name
    const prerollPacks = await db
      .select()
      .from(products)
      .where(like(products.name, '%pack%'));
    
    console.log(`Found ${prerollPacks.length} products with "pack" in the name`);
    
    if (prerollPacks.length === 0) {
      console.log('No pre-roll pack products found to update');
      return;
    }
    
    // Update each pre-roll pack product
    let updatedCount = 0;
    for (const product of prerollPacks) {
      console.log(`Updating: ${product.name}`);
      
      await db
        .update(products)
        .set({ 
          image: newPrerollPackImage,
          updatedAt: new Date()
        })
        .where(eq(products.id, product.id));
      
      updatedCount++;
    }
    
    console.log(`✅ Successfully updated ${updatedCount} pre-roll pack products with new image`);
    console.log(`🖼️  New image path: ${newPrerollPackImage}`);
    
  } catch (error) {
    console.error('❌ Error updating pre-roll pack images:', error);
    process.exit(1);
  }
}

// Run the update
updatePrerollPackImages()
  .then(() => {
    console.log('🎉 Pre-roll pack image update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Update failed:', error);
    process.exit(1);
  });