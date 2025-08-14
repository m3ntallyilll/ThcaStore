import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, varchar, text, decimal, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

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

async function verifyImages() {
  try {
    const allProducts = await db.select().from(products);
    console.log(`📦 Total products: ${allProducts.length}`);
    
    // Count unique images
    const imageCount = {};
    allProducts.forEach(product => {
      if (product.imageUrl) {
        imageCount[product.imageUrl] = (imageCount[product.imageUrl] || 0) + 1;
      }
    });
    
    console.log(`📸 Unique images used: ${Object.keys(imageCount).length}`);
    Object.entries(imageCount).forEach(([url, count]) => {
      console.log(`  ${url.split('/').pop()}: ${count} products`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyImages();