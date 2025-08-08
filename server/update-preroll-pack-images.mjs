import { db } from './db.ts';
import { products } from '../shared/schema.ts';
import { eq, like } from 'drizzle-orm';

// New image URLs for pre-roll packs
const standardPackImage = '/attached_assets/generated_images/attached_assets/generated_images/Hemp_pre-roll_variety_pack_7d836cbe.png';
const multiPackImage = '/attached_assets/BCO.ee170353-be48-42c8-8726-f48463cd7ffd_1754085146155.png';

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
    
    // Update each pre-roll pack product based on quantity
    let updatedCount = 0;
    for (const product of prerollPacks) {
      const name = product.name.toLowerCase();
      
      // Determine which image to use based on pack size
      let imageUrl = standardPackImage; // default
      
      if (name.includes('x4') || name.includes('x5') || name.includes('x6') || 
          name.includes('x7') || name.includes('x8') || name.includes('x9') || name.includes('x10') ||
          name.includes('4x') || name.includes('5x') || name.includes('6x') || 
          name.includes('7x') || name.includes('8x') || name.includes('9x') || name.includes('10x')) {
        imageUrl = multiPackImage;
        console.log(`Updating multi-pack: ${product.name} -> ${imageUrl}`);
      } else {
        console.log(`Updating standard pack: ${product.name} -> ${imageUrl}`);
      }
      
      await db
        .update(products)
        .set({ 
          image: imageUrl,
          updatedAt: new Date()
        })
        .where(eq(products.id, product.id));
      
      updatedCount++;
    }
    
    console.log(`✅ Successfully updated ${updatedCount} pre-roll pack products with appropriate images`);
    console.log(`🖼️  Multi-pack image: ${multiPackImage}`);
    console.log(`🖼️  Standard pack image: ${standardPackImage}`);
    
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