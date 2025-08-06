const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

neonConfig.webSocketConstructor = ws;

// AI-generated image mappings using @assets import paths
const aiImageMap = {
  'sour diesel': '/src/assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png',
  'purple koolaid': '/src/assets/generated_images/Purple_Koolaid_THCA_flower_a7e52253.png', 
  'purple': '/src/assets/generated_images/Purple_Koolaid_THCA_flower_a7e52253.png',
  'runtz': '/src/assets/generated_images/Runtz_THCA_flower_22bdedde.png',
  'sour lemon': '/src/assets/generated_images/Sour_Lemon_Diesel_flower_c1f2a950.png',
  'lemon': '/src/assets/generated_images/Sour_Lemon_Diesel_flower_c1f2a950.png',
  'too tall': '/src/assets/generated_images/Too_Tall_THCA_flower_8b45913e.png'
};

// Category-specific defaults
const categoryDefaults = {
  'prerolls': '/src/assets/generated_images/Hemp_pre-rolls_in_tubes_eff785cb.png',
  'variety-packs': '/src/assets/generated_images/THCA_variety_pack_dd4e2f15.png',
  'flower': '/src/assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png'
};

function getStrainImage(productName, category) {
  const nameLower = productName.toLowerCase();
  
  // Check for exact strain matches first
  for (const [strain, imageUrl] of Object.entries(aiImageMap)) {
    if (nameLower.includes(strain)) {
      return imageUrl;
    }
  }
  
  // Fall back to category defaults
  return categoryDefaults[category] || categoryDefaults['flower'];
}

async function updateProductImages() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🎨 Starting AI-generated product image update...');
    
    // Get all products
    const result = await pool.query('SELECT id, name, category, image_url FROM products ORDER BY name');
    const products = result.rows;
    
    console.log(`Found ${products.length} products to update`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let newImageUrl = getStrainImage(product.name, product.category);
      
      // Force update all pre-rolls to use the new tube image
      if (product.category === 'prerolls') {
        newImageUrl = '/src/assets/generated_images/Hemp_pre-rolls_in_tubes_eff785cb.png';
      }
      
      // Only update if the image URL is different
      if (product.image_url !== newImageUrl) {
        await pool.query(
          'UPDATE products SET image_url = $1 WHERE id = $2',
          [newImageUrl, product.id]
        );
        
        console.log(`📸 Updated ${product.name} (${product.category}) -> ${newImageUrl.split('/').pop()}`);
        updatedCount++;
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} products with AI-generated images!`);
    
    // Show summary by category
    const summaryResult = await pool.query('SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY category');
    
    console.log('\n📊 Product Summary by Category:');
    summaryResult.rows.forEach(row => {
      console.log(`  ${row.category}: ${row.count} products`);
    });
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  } finally {
    await pool.end();
  }
}

updateProductImages();