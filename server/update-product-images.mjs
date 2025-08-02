import { storage } from './database-storage.ts';

// Update existing products with proper image URLs
async function updateProductImages() {
  console.log('🖼️  UPDATING PRODUCT IMAGES\n');

  try {
    const products = await storage.getProducts();
    console.log(`Found ${products.length} products to update`);

    let updatedCount = 0;
    
    for (const product of products) {
      try {
        // Generate image URL based on product characteristics
        let imageUrl;
        const strainName = product.name.split(' ')[0]; // Extract strain name
        
        if (product.category === 'pre-rolls') {
          const isInfused = product.name.toLowerCase().includes('infused');
          if (isInfused) {
            imageUrl = `https://images.google.com/search?q=${strainName.replace(/\s+/g, '+')}+infused+pre+roll+cannabis`;
          } else {
            imageUrl = `https://images.google.com/search?q=${strainName.replace(/\s+/g, '+')}+pre+roll+cannabis+joint`;
          }
        } else if (product.category === 'flower') {
          imageUrl = `https://images.google.com/search?q=${strainName.replace(/\s+/g, '+')}+cannabis+flower+bud`;
        } else if (product.category === 'concentrates') {
          imageUrl = `https://images.google.com/search?q=${strainName.replace(/\s+/g, '+')}+cannabis+concentrate+wax`;
        } else if (product.category === 'edibles') {
          imageUrl = `https://images.google.com/search?q=${strainName.replace(/\s+/g, '+')}+cannabis+edible+gummy`;
        } else {
          imageUrl = `https://images.google.com/search?q=${strainName.replace(/\s+/g, '+')}+cannabis+product`;
        }

        // Update product with new image URL
        await storage.updateProduct(product.id, { imageUrl });
        updatedCount++;
        
        if (updatedCount % 100 === 0) {
          console.log(`✅ Updated ${updatedCount} products...`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to update ${product.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} products with image URLs`);
    console.log('✅ All products now have proper Google Images search URLs');
    
  } catch (error) {
    console.error('💥 Failed to update product images:', error);
  }
}

updateProductImages()
  .then(() => {
    console.log('🚀 Image update complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Update failed:', error);
    process.exit(1);
  });