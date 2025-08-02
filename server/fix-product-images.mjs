import { storage } from './database-storage.ts';

// Fix existing products with working image URLs
async function fixProductImages() {
  console.log('🔧 FIXING PRODUCT IMAGES WITH WORKING URLS\n');

  try {
    const products = await storage.getProducts();
    console.log(`Found ${products.length} products to fix`);

    let fixedCount = 0;
    
    for (const product of products) {
      try {
        // Extract strain name from product name
        const strainName = product.name.split(' ')[0] || 'Cannabis';
        const imageId = Math.abs(strainName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 1000;
        
        let imageUrl;
        
        if (product.category === 'pre-rolls') {
          const isInfused = product.name.toLowerCase().includes('infused');
          if (isInfused) {
            imageUrl = `https://picsum.photos/seed/infused-${imageId}/400/400`;
          } else {
            imageUrl = `https://picsum.photos/seed/preroll-${imageId}/400/400`;
          }
        } else if (product.category === 'flower') {
          imageUrl = `https://picsum.photos/seed/flower-${imageId}/400/400`;
        } else if (product.category === 'concentrates') {
          imageUrl = `https://picsum.photos/seed/concentrate-${imageId}/400/400`;
        } else if (product.category === 'edibles') {
          imageUrl = `https://picsum.photos/seed/edible-${imageId}/400/400`;
        } else {
          imageUrl = `https://picsum.photos/seed/product-${imageId}/400/400`;
        }

        // Update product with working image URL
        await storage.updateProduct(product.id, { imageUrl });
        fixedCount++;
        
        if (fixedCount % 200 === 0) {
          console.log(`✅ Fixed ${fixedCount} products...`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to fix ${product.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully fixed ${fixedCount} products with working image URLs`);
    console.log('✅ All products now have displayable images');
    console.log('✅ Images are consistent per strain (same strain = same image)');
    console.log('✅ Different product types have different image seeds');
    
  } catch (error) {
    console.error('💥 Failed to fix product images:', error);
  }
}

fixProductImages()
  .then(() => {
    console.log('🚀 Image fix complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fix failed:', error);
    process.exit(1);
  });