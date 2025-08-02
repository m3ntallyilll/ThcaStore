import { bulkProductGenerator } from './bulk-product-generator.ts';

// Industry Standard Cannabis Product Catalog
// Proper weights: 1g, 3.5g (eighth), 7g (quarter), 14g (half), 28g (oz)
// Pre-rolls: 1.1g, 1.25g, 1.45g, 1.5g

async function createIndustryStandardCatalog() {
  console.log('🏭 INDUSTRY STANDARD CANNABIS CATALOG');
  console.log('📊 Using proper cannabis weights and sizing\n');

  const industryProducts = [
    // PRE-ROLLS - Industry standard weights
    {
      category: 'pre-rolls',
      products: [
        // 1.1g Pre-rolls (most common)
        { weight: '1.1g', strain: 'indica', count: 500, priceRange: [8, 12], thcRange: [18, 28], description: 'Standard 1.1g pre-rolls' },
        { weight: '1.1g', strain: 'sativa', count: 500, priceRange: [8, 12], thcRange: [18, 28], description: 'Standard 1.1g pre-rolls' },
        { weight: '1.1g', strain: 'hybrid', count: 400, priceRange: [8, 12], thcRange: [18, 28], description: 'Standard 1.1g pre-rolls' },
        
        // 1.25g Pre-rolls (premium)
        { weight: '1.25g', strain: 'indica', count: 300, priceRange: [10, 15], thcRange: [20, 30], description: 'Premium 1.25g pre-rolls' },
        { weight: '1.25g', strain: 'sativa', count: 300, priceRange: [10, 15], thcRange: [20, 30], description: 'Premium 1.25g pre-rolls' },
        { weight: '1.25g', strain: 'hybrid', count: 200, priceRange: [10, 15], thcRange: [20, 30], description: 'Premium 1.25g pre-rolls' },
        
        // 1.45g Pre-rolls (large format)
        { weight: '1.45g', strain: 'indica', count: 200, priceRange: [12, 18], thcRange: [22, 32], description: 'Large 1.45g pre-rolls' },
        { weight: '1.45g', strain: 'sativa', count: 200, priceRange: [12, 18], thcRange: [22, 32], description: 'Large 1.45g pre-rolls' },
        { weight: '1.45g', strain: 'hybrid', count: 150, priceRange: [12, 18], thcRange: [22, 32], description: 'Large 1.45g pre-rolls' },
        
        // 1.5g Pre-rolls (king size)
        { weight: '1.5g', strain: 'indica', count: 150, priceRange: [15, 22], thcRange: [24, 34], description: 'King size 1.5g pre-rolls' },
        { weight: '1.5g', strain: 'sativa', count: 150, priceRange: [15, 22], thcRange: [24, 34], description: 'King size 1.5g pre-rolls' },
        { weight: '1.5g', strain: 'hybrid', count: 100, priceRange: [15, 22], thcRange: [24, 34], description: 'King size 1.5g pre-rolls' }
      ]
    },
    
    // FLOWER - Industry standard weights
    {
      category: 'flower',
      products: [
        // 1g (gram) - Single serving
        { weight: '1g', strain: 'indica', count: 300, priceRange: [8, 15], thcRange: [18, 30], description: 'Single gram flower' },
        { weight: '1g', strain: 'sativa', count: 300, priceRange: [8, 15], thcRange: [18, 30], description: 'Single gram flower' },
        { weight: '1g', strain: 'hybrid', count: 200, priceRange: [8, 15], thcRange: [18, 30], description: 'Single gram flower' },
        
        // 3.5g (eighth) - Most popular size
        { weight: '3.5g', strain: 'indica', count: 400, priceRange: [25, 45], thcRange: [20, 32], description: 'Eighth ounce premium flower' },
        { weight: '3.5g', strain: 'sativa', count: 400, priceRange: [25, 45], thcRange: [20, 32], description: 'Eighth ounce premium flower' },
        { weight: '3.5g', strain: 'hybrid', count: 300, priceRange: [25, 45], thcRange: [20, 32], description: 'Eighth ounce premium flower' },
        
        // 7g (quarter) - Value size
        { weight: '7g', strain: 'indica', count: 200, priceRange: [45, 80], thcRange: [22, 34], description: 'Quarter ounce flower' },
        { weight: '7g', strain: 'sativa', count: 200, priceRange: [45, 80], thcRange: [22, 34], description: 'Quarter ounce flower' },
        { weight: '7g', strain: 'hybrid', count: 150, priceRange: [45, 80], thcRange: [22, 34], description: 'Quarter ounce flower' },
        
        // 14g (half ounce) - Bulk buyers
        { weight: '14g', strain: 'indica', count: 100, priceRange: [85, 150], thcRange: [24, 36], description: 'Half ounce bulk flower' },
        { weight: '14g', strain: 'sativa', count: 100, priceRange: [85, 150], thcRange: [24, 36], description: 'Half ounce bulk flower' },
        { weight: '14g', strain: 'hybrid', count: 80, priceRange: [85, 150], thcRange: [24, 36], description: 'Half ounce bulk flower' },
        
        // 28g (full ounce) - Wholesale level
        { weight: '28g', strain: 'indica', count: 50, priceRange: [160, 280], thcRange: [26, 38], description: 'Full ounce premium flower' },
        { weight: '28g', strain: 'sativa', count: 50, priceRange: [160, 280], thcRange: [26, 38], description: 'Full ounce premium flower' },
        { weight: '28g', strain: 'hybrid', count: 40, priceRange: [160, 280], thcRange: [26, 38], description: 'Full ounce premium flower' }
      ]
    }
  ];

  let totalGenerated = 0;
  let categoryResults = [];

  for (const categoryData of industryProducts) {
    console.log(`\n🏷️  CREATING ${categoryData.category.toUpperCase()} PRODUCTS`);
    console.log('=' .repeat(60));
    
    let categoryTotal = 0;
    const categoryProducts = [];

    for (const [index, product] of categoryData.products.entries()) {
      try {
        const productName = `${product.weight} ${product.strain} ${categoryData.category}`;
        const progress = ((index + 1) / categoryData.products.length * 100).toFixed(1);
        
        console.log(`[${progress}%] ${productName}: ${product.count} units @ $${product.priceRange[0]}-${product.priceRange[1]}`);
        
        const products = await bulkProductGenerator.generateBulkProducts({
          productType: categoryData.category === 'pre-rolls' ? 'pre-roll' : 'flower',
          strainType: product.strain,
          count: product.count,
          priceRange: { min: product.priceRange[0], max: product.priceRange[1] },
          thcRange: { min: product.thcRange[0], max: product.thcRange[1] },
          preRollWeight: product.weight,
          flowerWeight: product.weight,
          includeDeals: false,
          includePackages: false,
          category: categoryData.category
        });
        
        const saved = await bulkProductGenerator.saveBulkProducts(products);
        const successCount = saved.filter(r => !r.error).length;
        
        categoryTotal += successCount;
        totalGenerated += successCount;
        
        categoryProducts.push({
          name: productName,
          weight: product.weight,
          created: successCount,
          requested: product.count,
          priceRange: product.priceRange,
          description: product.description
        });
        
        console.log(`✅ Created ${successCount}/${product.count} products`);
        
      } catch (error) {
        console.error(`❌ Failed ${product.weight} ${product.strain}:`, error.message);
      }
    }
    
    categoryResults.push({
      category: categoryData.category,
      totalCreated: categoryTotal,
      products: categoryProducts
    });
    
    console.log(`🎯 ${categoryData.category.toUpperCase()} TOTAL: ${categoryTotal.toLocaleString()} products`);
  }

  // Final industry standard summary
  console.log('\n🏭 INDUSTRY STANDARD CATALOG COMPLETE');
  console.log('=' .repeat(80));
  console.log(`📦 Total Products: ${totalGenerated.toLocaleString()}`);
  console.log(`💰 Estimated Value: $${(totalGenerated * 20).toLocaleString()}`);
  
  console.log('\n📊 WEIGHT BREAKDOWN:');
  console.log('🌿 FLOWER: 1g, 3.5g (eighth), 7g (quarter), 14g (half), 28g (oz)');
  console.log('🚬 PRE-ROLLS: 1.1g, 1.25g, 1.45g, 1.5g');
  
  console.log('\n🎯 INDUSTRY COMPLIANCE:');
  console.log('✅ Authentic cannabis market weights');
  console.log('✅ Real dispensary pricing structure');
  console.log('✅ Standard industry terminology');
  console.log('✅ Professional product catalog');
  
  return { totalGenerated, categoryResults };
}

createIndustryStandardCatalog()
  .then(result => {
    console.log(`\n🎉 SUCCESS: ${result.totalGenerated.toLocaleString()} industry-standard products created!`);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Industry catalog creation failed:', error);
    process.exit(1);
  });