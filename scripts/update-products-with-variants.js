import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { products } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Database connection
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

// Industry-standard cannabis weights and pricing
const CATEGORY_VARIANTS = {
  flower: {
    weights: ['1g', '3.5g', '7g', '14g', '28g'],
    priceMultipliers: { '1g': 1, '3.5g': 3.2, '7g': 6, '14g': 11, '28g': 20 }
  },
  prerolls: {
    weights: ['1.1g', '1.25g', '1.45g', '1.5g'],
    priceMultipliers: { '1.1g': 1, '1.25g': 1.15, '1.45g': 1.3, '1.5g': 1.4 }
  },
  concentrates: {
    weights: ['0.5g', '1g', '2g'],
    priceMultipliers: { '0.5g': 1, '1g': 1.8, '2g': 3.4 }
  },
  edibles: {
    weights: ['100mg', '250mg', '500mg', '1000mg'],
    priceMultipliers: { '100mg': 1, '250mg': 1.6, '500mg': 3, '1000mg': 5.5 }
  }
};

function generateVariants(basePrice, category, stock) {
  const categoryData = CATEGORY_VARIANTS[category];
  if (!categoryData) return [];

  return categoryData.weights.map((weight, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
    weight,
    price: Math.round(basePrice * categoryData.priceMultipliers[weight] * 100) / 100,
    stock: Math.floor(stock * (0.7 + Math.random() * 0.6)), // Randomize stock per variant
    isDefault: index === 0
  }));
}

function determineSubcategory(name, category) {
  const nameLower = name.toLowerCase();
  
  switch (category) {
    case 'flower':
      if (nameLower.includes('indica')) return 'indica';
      if (nameLower.includes('sativa')) return 'sativa';
      return 'hybrid';
    
    case 'prerolls':
      if (nameLower.includes('pack') || nameLower.includes('5-pack')) return 'pack';
      if (nameLower.includes('infused') || nameLower.includes('live resin')) return 'infused';
      return 'single';
    
    case 'concentrates':
      if (nameLower.includes('wax')) return 'wax';
      if (nameLower.includes('shatter')) return 'shatter';
      if (nameLower.includes('live resin')) return 'live_resin';
      if (nameLower.includes('rosin')) return 'rosin';
      return 'wax';
    
    case 'edibles':
      if (nameLower.includes('gummies') || nameLower.includes('gummy')) return 'gummies';
      if (nameLower.includes('chocolate')) return 'chocolates';
      if (nameLower.includes('drink') || nameLower.includes('beverage')) return 'beverages';
      return 'gummies';
    
    default:
      return null;
  }
}

function determinePotency(thcaContent) {
  if (!thcaContent) return 'Medium';
  
  const percentage = parseFloat(thcaContent.replace('%', ''));
  if (percentage >= 25) return 'High';
  if (percentage >= 18) return 'Medium';
  return 'Low';
}

async function updateProductsWithVariants() {
  console.log('🚀 Starting product variant update...');
  
  try {
    // Get all products
    const allProducts = await db.select().from(products);
    console.log(`📦 Found ${allProducts.length} products to update`);
    
    for (const product of allProducts) {
      // Skip if already has variants
      if (product.variants && product.variants.length > 0) {
        console.log(`⏭️ Skipping ${product.name} - already has variants`);
        continue;
      }
      
      const basePrice = parseFloat(product.price);
      const variants = generateVariants(basePrice, product.category, product.stock);
      const subcategory = determineSubcategory(product.name, product.category);
      const potency = determinePotency(product.thcaContent);
      
      // Calculate price range
      const prices = variants.map(v => v.price);
      const priceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
      
      // Update product
      await db.update(products)
        .set({
          variants,
          subcategory,
          potency,
          priceRange
        })
        .where(eq(products.id, product.id));
      
      console.log(`✅ Updated ${product.name} with ${variants.length} variants (${subcategory}, ${potency})`);
    }
    
    console.log('🎉 Product variant update complete!');
    
  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
}

// Run the update
updateProductsWithVariants();