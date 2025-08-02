#!/usr/bin/env node
// Update existing products with generated images
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Map of generated images to product categories and types
const generatedImages = {
  // Flower strains
  'attached_assets/generated_images/Premium_hemp_flower_buds_568629db.png': {
    category: 'flower',
    strains: ['generic', 'hybrid'],
    weight: ['3.5', '7', '14', '28']
  },
  'attached_assets/generated_images/Blue_Dream_hemp_strain_ee2cf878.png': {
    category: 'flower',
    strains: ['blue dream'],
    weight: ['1', '3.5', '7', '14', '28']
  },
  'attached_assets/generated_images/OG_Kush_hemp_strain_970f7637.png': {
    category: 'flower',
    strains: ['og kush', 'kush'],
    weight: ['1', '3.5', '7', '14', '28']
  },
  'attached_assets/generated_images/Purple_Punch_hemp_strain_5a390f11.png': {
    category: 'flower',
    strains: ['purple punch', 'purple', 'granddaddy purple'],
    weight: ['1', '3.5', '7', '14', '28']
  },
  'attached_assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png': {
    category: 'flower',
    strains: ['green crack', 'green'],
    weight: ['1', '3.5', '7', '14', '28']
  },
  'attached_assets/generated_images/Sour_Diesel_hemp_strain_5ff2c237.png': {
    category: 'flower',
    strains: ['sour diesel', 'diesel'],
    weight: ['1', '3.5', '7', '14', '28']
  },
  'attached_assets/generated_images/Girl_Scout_Cookies_strain_79b13530.png': {
    category: 'flower',
    strains: ['girl scout cookies', 'cookies', 'gsc'],
    weight: ['1', '3.5', '7', '14', '28']
  },
  'attached_assets/generated_images/Gelato_hemp_strain_1a2aebbb.png': {
    category: 'flower',
    strains: ['gelato'],
    weight: ['1', '3.5', '7', '14', '28']
  },
  'attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png': {
    category: 'flower',
    strains: ['indica'],
    weight: ['1', '3.5', '7', '14', '28']
  },
  'attached_assets/generated_images/Sativa_hemp_flower_61fa5cdb.png': {
    category: 'flower',
    strains: ['sativa'],
    weight: ['1', '3.5', '7', '14', '28']
  },
  
  // Pre-rolls
  'attached_assets/generated_images/Hemp_pre-roll_joints_e0e992fe.png': {
    category: 'pre-rolls',
    strains: ['all'],
    weight: ['0.5', '1', '1.1', '1.25', '1.45', '1.5', '2']
  },
  
  // Concentrates
  'attached_assets/generated_images/THCA_diamond_concentrates_93d26771.png': {
    category: 'concentrates',
    types: ['diamond', 'diamonds', 'thca'],
    weight: ['0.5', '1']
  },
  'attached_assets/generated_images/Hemp_wax_concentrate_1309cfeb.png': {
    category: 'concentrates',
    types: ['wax', 'budder', 'shatter'],
    weight: ['0.5', '1']
  },
  'attached_assets/generated_images/Hemp_live_resin_51ce0e4a.png': {
    category: 'concentrates',
    types: ['live resin', 'resin', 'sauce'],
    weight: ['0.5', '1']
  },
  
  // Edibles
  'attached_assets/generated_images/Hemp_gummy_edibles_4f465d60.png': {
    category: 'edibles',
    types: ['gummies', 'gummy'],
    weight: ['pack', 'bottle']
  },
  'attached_assets/generated_images/Hemp_chocolate_edibles_8409225e.png': {
    category: 'edibles',
    types: ['chocolate', 'bar'],
    weight: ['bar', 'piece']
  },
  
  // Accessories
  'attached_assets/generated_images/Premium_herb_grinder_c4439ae7.png': {
    category: 'accessories',
    types: ['grinder'],
    weight: ['piece']
  },
  'attached_assets/generated_images/Hemp_vaporizer_device_f055420e.png': {
    category: 'accessories',
    types: ['vaporizer', 'vape'],
    weight: ['device']
  },
  
  // Topicals
  'attached_assets/generated_images/Hemp_topical_cream_afa2ae1c.png': {
    category: 'topicals',
    types: ['cream', 'lotion', 'balm'],
    weight: ['jar', 'tube']
  },
  
  // Tinctures
  'attached_assets/generated_images/Hemp_tincture_bottle_1ef40153.png': {
    category: 'tinctures',
    types: ['tincture', 'oil'],
    weight: ['bottle', '30ml', '60ml']
  }
};

// Function to match product to appropriate image
function findBestImageMatch(product) {
  const name = product.name.toLowerCase();
  const category = product.category.toLowerCase();
  
  for (const [imagePath, imageData] of Object.entries(generatedImages)) {
    // Check category match
    if (imageData.category !== category) continue;
    
    // For flower products, check strain match
    if (category === 'flower' && imageData.strains) {
      const strainMatch = imageData.strains.some(strain => 
        strain === 'all' || name.includes(strain) || 
        (strain === 'generic' && !imageData.strains.some(s => s !== 'generic' && name.includes(s)))
      );
      if (strainMatch) return imagePath;
    }
    
    // For other categories, check type match
    if (imageData.types) {
      const typeMatch = imageData.types.some(type => name.includes(type));
      if (typeMatch) return imagePath;
    }
    
    // Fallback to category match
    if (imageData.strains?.includes('all') || imageData.types?.includes('all')) {
      return imagePath;
    }
  }
  
  // Final fallback - return first image of matching category
  for (const [imagePath, imageData] of Object.entries(generatedImages)) {
    if (imageData.category === category) return imagePath;
  }
  
  return null;
}

async function updateProductImages() {
  try {
    console.log('🖼️  Starting product image updates...');
    
    // Import the storage module
    const { storage } = await import('./server/database-storage.js');
    const products = await storage.getProducts();
    
    console.log(`📦 Found ${products.length} products to update`);
    
    let updatedCount = 0;
    const updates = [];
    
    for (const product of products) {
      const imageMatch = findBestImageMatch(product);
      
      if (imageMatch && imageMatch !== product.imageUrl) {
        try {
          await storage.updateProduct(product.id, { imageUrl: imageMatch });
          updates.push({
            id: product.id,
            name: product.name,
            category: product.category,
            oldImage: product.imageUrl,
            newImage: imageMatch
          });
          updatedCount++;
          console.log(`✅ Updated: ${product.name} → ${imageMatch.split('/').pop()}`);
        } catch (error) {
          console.error(`❌ Failed to update ${product.name}:`, error.message);
        }
      } else if (!imageMatch) {
        console.log(`⚠️  No image match found for: ${product.name} (${product.category})`);
      }
    }
    
    console.log(`\n🎉 Image update complete!`);
    console.log(`✅ Updated ${updatedCount} products`);
    console.log(`📊 Success rate: ${Math.round((updatedCount / products.length) * 100)}%`);
    
    // Save update summary
    const summary = {
      timestamp: new Date().toISOString(),
      totalProducts: products.length,
      updatedCount,
      generatedImages: Object.keys(generatedImages).length,
      updates
    };
    
    console.log('\n📄 Update summary:', summary);
    
  } catch (error) {
    console.error('💥 Error updating product images:', error);
    throw error;
  }
}

// Run the update
updateProductImages()
  .then(() => {
    console.log('🏁 Product image update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Update failed:', error);
    process.exit(1);
  });