import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, varchar, text, decimal, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Define products table schema
const products = pgTable('products', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  subcategory: varchar('subcategory', { length: 100 }),
  imageUrl: text('image_url'),
  featured: boolean('featured').default(false),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('4.5'),
  thcaContent: varchar('thca_content', { length: 50 }),
  strainType: varchar('strain_type', { length: 50 }),
  potency: varchar('potency', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow()
});

const newJointImages = [
  '/attached_assets/generated_images/Cannabis_joints_in_tubes_realistic.png',
  '/attached_assets/generated_images/Premium_cannabis_joints_pack.png',
  '/attached_assets/generated_images/Hand_rolled_joints_display.png',
  '/attached_assets/generated_images/Cannabis_joints_variety_pack.png',
  '/attached_assets/generated_images/Individual_cannabis_joint_closeup.png',
  '/attached_assets/generated_images/Joints_on_rolling_tray_realistic.png'
];

async function updatePrerollsToJoints() {
  try {
    console.log('🔄 Updating pre-roll products to use authentic joint images...');
    
    // Get all pre-roll products
    const prerollProducts = await db.select().from(products).where(eq(products.category, 'prerolls'));
    console.log(`🚬 Found ${prerollProducts.length} pre-roll products to update`);

    let updateCount = 0;
    
    for (const product of prerollProducts) {
      // Assign joint images based on product characteristics
      let imageUrl;
      
      if (product.name.toLowerCase().includes('variety') || product.name.toLowerCase().includes('pack')) {
        imageUrl = '/attached_assets/generated_images/Cannabis_joints_variety_pack.png';
      } else if (product.name.toLowerCase().includes('premium') || product.featured) {
        imageUrl = '/attached_assets/generated_images/Premium_cannabis_joints_pack.png';
      } else if (product.name.toLowerCase().includes('single') || product.name.toLowerCase().includes('individual')) {
        imageUrl = '/attached_assets/generated_images/Individual_cannabis_joint_closeup.png';
      } else {
        // Rotate between the main joint images
        const mainJointImages = [
          '/attached_assets/generated_images/Cannabis_joints_in_tubes_realistic.png',
          '/attached_assets/generated_images/Hand_rolled_joints_display.png',
          '/attached_assets/generated_images/Joints_on_rolling_tray_realistic.png'
        ];
        imageUrl = mainJointImages[updateCount % mainJointImages.length];
      }

      // Update the product
      await db.update(products)
        .set({ imageUrl })
        .where(eq(products.id, product.id));
        
      updateCount++;
      console.log(`✅ Updated "${product.name}" with joint image`);
    }

    console.log(`🎉 Successfully updated all ${updateCount} pre-roll products with authentic joint images!`);
    console.log(`🚬 All pre-rolls now display as realistic joints instead of commercial pre-rolls`);
    console.log(`📱 Using ${newJointImages.length} different joint images for variety`);
    
  } catch (error) {
    console.error('❌ Error updating pre-roll images:', error);
  }
}

updatePrerollsToJoints();