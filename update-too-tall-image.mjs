
#!/usr/bin/env node

import { storage } from './server/database-storage.js';

async function updateTooTallProductImages() {
  try {
    console.log('🔄 Updating Too Tall product images...');
    
    const products = await storage.getProducts();
    console.log(`Found ${products.length} products to check`);
    
    const newImageUrl = '/attached_assets/generated_images/Hemp_pre-roll_variety_pack_7d836cbe.png';
    let updatedCount = 0;
    
    for (const product of products) {
      // Check if product name contains "Too Tall" (case insensitive)
      if (product.name.toLowerCase().includes('too tall')) {
        try {
          await storage.updateProduct(product.id, { imageUrl: newImageUrl });
          console.log(`✅ Updated: ${product.name}`);
          updatedCount++;
        } catch (error) {
          console.error(`❌ Failed to update ${product.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} Too Tall products with new image!`);
    console.log(`📸 New image: ${newImageUrl.split('/').pop()}`);
    
  } catch (error) {
    console.error('💥 Error updating product images:', error);
  }
}

updateTooTallProductImages()
  .then(() => {
    console.log('🚀 Image update complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Update failed:', error);
    process.exit(1);
  });
