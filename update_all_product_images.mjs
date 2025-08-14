import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Product image URL mappings for your exact inventory
const productImageUrls = {
  // Pre-roll strains - realistic Android phone photos
  'sour-diesel-infused': '/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png',
  'purple-koolaid-infused': '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png',
  'sour-lemon-diesel': '/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png',
  'too-tall': '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png',
  'runtz': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png',

  // Flower strains - realistic Android phone photos
  'grape-popsicle': '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png',
  'purple-koolaid-diamonds': '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png',
  'sour-diesel-flower': '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png',
  'sour-lemon-diesel-flower': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png',
  'sour-diesel-popcorn': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png',
  'wedding-cake': '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png',
  'girl-scout-cookies': '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png',
  'runtz-peppermint': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png',

  // Pre-roll packs - realistic Android phone photos
  'preroll-pack': '/attached_assets/generated_images/Preroll_pack_Android_photo_934b8710.png',
  'preroll-multi-pack': '/attached_assets/generated_images/Preroll_pack_Android_photo_934b8710.png',
  
  // Variety packs
  'variety-pack': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png'
};

// Generate image URLs based on product name/category
function getProductImageUrl(productName, category) {
  const name = productName.toLowerCase();
  
  // Pre-rolls
  if (category === 'prerolls') {
    // Check for multi-packs (x4, x5, x6, x7, x8, x9, x10)
    if (name.includes('pack') && (name.includes('x4') || name.includes('x5') || name.includes('x6') || 
        name.includes('x7') || name.includes('x8') || name.includes('x9') || name.includes('x10') ||
        name.includes('4x') || name.includes('5x') || name.includes('6x') || 
        name.includes('7x') || name.includes('8x') || name.includes('9x') || name.includes('10x'))) {
      return '/attached_assets/generated_images/Preroll_pack_Android_photo_934b8710.png';
    }
    
    // Single pre-rolls by strain
    if (name.includes('sour diesel')) return '/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png';
    if (name.includes('purple koolaid')) return '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png';
    if (name.includes('too tall')) return '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png';
    if (name.includes('runtz')) return '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png';
    
    // Default for other pre-rolls
    return '/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png';
  }
  
  // Flower products
  if (category === 'flower') {
    if (name.includes('grape popsicle') || name.includes('purple koolaid')) {
      return '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png';
    }
    if (name.includes('sour diesel') || name.includes('wedding cake')) {
      return '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png';
    }
    if (name.includes('runtz') || name.includes('sour lemon diesel')) {
      return '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png';
    }
    
    // Default for other flower
    return '/attached_assets/generated_images/Cannabis_flower_jar_photo_874c1f39.png';
  }
  
  // Default fallback
  return '/attached_assets/generated_images/Cannabis_flower_jar_photo_874c1f39.png';
}

async function updateProductImages() {
  try {
    console.log('🔄 Starting product image update...');
    
    // Get all products
    const result = await pool.query('SELECT id, name, category, image_url FROM products');
    const allProducts = result.rows;
    console.log(`📦 Found ${allProducts.length} products to update`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const product of allProducts) {
      const newImageUrl = getProductImageUrl(product.name, product.category);
      
      if (product.image_url !== newImageUrl) {
        await pool.query(
          'UPDATE products SET image_url = $1 WHERE id = $2',
          [newImageUrl, product.id]
        );
        
        console.log(`✅ Updated ${product.name}: ${newImageUrl}`);
        updated++;
      } else {
        skipped++;
      }
    }
    
    console.log(`\n📊 Update Summary:`);
    console.log(`✅ Updated: ${updated} products`);
    console.log(`⏭️  Skipped: ${skipped} products (already current)`);
    console.log(`🎯 Total: ${allProducts.length} products processed`);
    
    if (updated > 0) {
      console.log('🎉 Product images successfully updated in database!');
    } else {
      console.log('ℹ️  All product images were already up to date');
    }
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  } finally {
    await pool.end();
  }
}

updateProductImages();