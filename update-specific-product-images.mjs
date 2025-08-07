
#!/usr/bin/env node

import { storage } from './server/database-storage.js';

const imageMap = {
  // Specific image mappings
  'sativa': '/attached_assets/generated_images/Sativa_hemp_flower_61fa5cdb.png',
  'indica': '/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png', 
  'og kush': '/attached_assets/generated_images/OG_Kush_hemp_strain_970f7637.png',
  'premium': '/attached_assets/BCO.ee170353-be48-42c8-8726-f48463cd7ffd_1754085146155.png'
};

async function updateProductImages() {
  try {
    console.log('🎨 Updating products with specific attached asset images...');
    
    const products = await storage.getProducts();
    console.log(`Found ${products.length} products to update`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      const productName = product.name.toLowerCase();
      let newImageUrl = null;
      
      // Determine which image to use based on product characteristics
      if (productName.includes('og kush')) {
        newImageUrl = imageMap['og kush'];
      } else if (product.strainType === 'sativa' || productName.includes('sativa')) {
        newImageUrl = imageMap['sativa'];
      } else if (product.strainType === 'indica' || productName.includes('indica')) {
        newImageUrl = imageMap['indica'];
      } else if (productName.includes('premium') || product.featured) {
        newImageUrl = imageMap['premium'];
      } else {
        // Default based on strain type
        switch(product.strainType) {
          case 'sativa':
            newImageUrl = imageMap['sativa'];
            break;
          case 'indica':
            newImageUrl = imageMap['indica'];
            break;
          case 'hybrid':
            newImageUrl = imageMap['premium'];
            break;
          default:
            newImageUrl = imageMap['premium'];
        }
      }
      
      if (newImageUrl && product.imageUrl !== newImageUrl) {
        await storage.updateProduct(product.id, { imageUrl: newImageUrl });
        console.log(`✅ Updated ${product.name} → ${newImageUrl.split('/').pop()}`);
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with high-quality images!`);
    console.log('\n📊 Image assignments:');
    console.log(`  🌿 Sativa products: ${imageMap.sativa.split('/').pop()}`);
    console.log(`  🍇 Indica products: ${imageMap.indica.split('/').pop()}`);
    console.log(`  💎 OG Kush products: ${imageMap['og kush'].split('/').pop()}`);
    console.log(`  ⭐ Premium/Featured: ${imageMap.premium.split('/').pop()}`);
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

updateProductImages()
  .then(() => {
    console.log('🚀 Product image update complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Update failed:', error);
    process.exit(1);
  });
