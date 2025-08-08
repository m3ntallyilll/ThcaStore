import { db } from './db.ts';
import { products } from '../shared/schema.ts';
import { eq, like } from 'drizzle-orm';

// New image URL for Purple Koolaid products
const purpleKoolaidImage = '/attached_assets/generated_images/Gelato_hemp_strain_1a2aebbb.png';

async function updatePurpleKoolaidImages() {
  try {
    console.log('🔄 Updating Purple Koolaid product images...');
    
    // Find all Purple Koolaid products
    const purpleKoolaidProducts = await db
      .select()
      .from(products)
      .where(like(products.name, '%Purple Koolaid%'));
    
    console.log(`Found ${purpleKoolaidProducts.length} Purple Koolaid products`);
    
    if (purpleKoolaidProducts.length === 0) {
      console.log('No Purple Koolaid products found to update');
      return;
    }
    
    // Update each Purple Koolaid product
    let updatedCount = 0;
    for (const product of purpleKoolaidProducts) {
      console.log(`Updating: ${product.name}`);
      
      await db
        .update(products)
        .set({ 
          imageUrl: purpleKoolaidImage
        })
        .where(eq(products.id, product.id));
      
      updatedCount++;
    }
    
    console.log(`✅ Successfully updated ${updatedCount} Purple Koolaid products with new image`);
    console.log(`🖼️  New image path: ${purpleKoolaidImage}`);
    
  } catch (error) {
    console.error('❌ Error updating Purple Koolaid images:', error);
    process.exit(1);
  }
}

// Run the update
updatePurpleKoolaidImages()
  .then(() => {
    console.log('🎉 Purple Koolaid image update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Update failed:', error);
    process.exit(1);
  });