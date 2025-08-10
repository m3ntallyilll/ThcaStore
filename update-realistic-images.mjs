import { storage } from './server/database-storage.js';

// Realistic Android-quality product images with child-proof packaging
const realisticProductImages = {
  flower: [
    'https://images.unsplash.com/photo-1583912267550-3888c9bc53da?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1571167530149-ba87c2aab8b9?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1582538885592-e70a5d7ab3d3?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1587985124042-3e4dc0c6c761?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1585609241917-7a32a8be6a0a?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1587985058438-5eaa6b2c9e45?w=600&h=600&fit=crop&auto=format&q=75'
  ],
  prerolls: [
    'https://images.unsplash.com/photo-1571167530149-ba87c2aab8b9?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1582538885592-e70a5d7ab3d3?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1585609241917-7a32a8be6a0a?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1587985124042-3e4dc0c6c761?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&auto=format&q=75'
  ],
  concentrates: [
    'https://images.unsplash.com/photo-1587985124042-3e4dc0c6c761?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1585609241917-7a32a8be6a0a?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1571167530149-ba87c2aab8b9?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1582538885592-e70a5d7ab3d3?w=600&h=600&fit=crop&auto=format&q=75'
  ],
  edibles: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1587985058438-5eaa6b2c9e45?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1585609241917-7a32a8be6a0a?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=600&fit=crop&auto=format&q=75',
    'https://images.unsplash.com/photo-1571167530149-ba87c2aab8b9?w=600&h=600&fit=crop&auto=format&q=75'
  ]
};

async function updateAllProductsWithRealisticImages() {
  try {
    console.log('📱 Starting realistic product image update...');
    const products = await storage.getProducts();
    
    let updateCount = 0;
    
    for (const product of products) {
      try {
        // Get category-specific realistic images
        const categoryImages = realisticProductImages[product.category] || realisticProductImages.flower;
        
        // Select a random image from the category
        const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];
        
        // Update the product with realistic Android-quality image
        await storage.updateProduct(product.id, {
          imageUrl: randomImage
        });
        
        updateCount++;
        console.log(`✓ Updated ${product.name} with realistic image`);
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        console.error(`❌ Failed to update ${product.name}:`, error);
      }
    }
    
    console.log(`🎉 Successfully updated ${updateCount} products with realistic Android-quality images!`);
    return updateCount;
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
    throw error;
  }
}

// Run the update
updateAllProductsWithRealisticImages()
  .then((count) => {
    console.log(`📱 Completed! Updated ${count} products with realistic images.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Update failed:', error);
    process.exit(1);
  });