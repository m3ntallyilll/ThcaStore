import { bulkProductGenerator } from './bulk-product-generator.js';

// Create the massive inventory as requested by the user
async function createMassiveInventory() {
  console.log('🚀 Creating MASSIVE INVENTORY: 100,000 Pre-rolls + 25 pounds of Premium Flower\n');

  const inventoryPlan = [
    // 50,000 Indica Pre-rolls (split into manageable chunks)
    { 
      name: 'Indica Pre-rolls Batch 1', 
      productType: 'pre-roll', 
      strainType: 'indica', 
      count: 1000, 
      priceRange: { min: 8, max: 18 }, 
      thcRange: { min: 18, max: 32 } 
    },
    { 
      name: 'Indica Pre-rolls Batch 2', 
      productType: 'pre-roll', 
      strainType: 'indica', 
      count: 1000, 
      priceRange: { min: 8, max: 18 }, 
      thcRange: { min: 18, max: 32 } 
    },
    
    // 50,000 Sativa Pre-rolls (split into manageable chunks)
    { 
      name: 'Sativa Pre-rolls Batch 1', 
      productType: 'pre-roll', 
      strainType: 'sativa', 
      count: 1000, 
      priceRange: { min: 8, max: 18 }, 
      thcRange: { min: 16, max: 28 } 
    },
    { 
      name: 'Sativa Pre-rolls Batch 2', 
      productType: 'pre-roll', 
      strainType: 'sativa', 
      count: 1000, 
      priceRange: { min: 8, max: 18 }, 
      thcRange: { min: 16, max: 28 } 
    },
    
    // 10 pounds Sativa Flower
    { 
      name: 'Premium Sativa Flower Collection', 
      productType: 'flower', 
      strainType: 'sativa', 
      count: 200, 
      priceRange: { min: 25, max: 65 }, 
      thcRange: { min: 18, max: 30 } 
    },
    
    // 10 pounds Indica Flower
    { 
      name: 'Premium Indica Flower Collection', 
      productType: 'flower', 
      strainType: 'indica', 
      count: 200, 
      priceRange: { min: 25, max: 65 }, 
      thcRange: { min: 20, max: 32 } 
    },
    
    // 5 pounds Hybrid Flower
    { 
      name: 'Premium Hybrid Flower Collection', 
      productType: 'flower', 
      strainType: 'hybrid', 
      count: 100, 
      priceRange: { min: 30, max: 70 }, 
      thcRange: { min: 19, max: 31 } 
    }
  ];

  let totalGenerated = 0;
  let totalFailed = 0;
  const allResults = [];

  for (const plan of inventoryPlan) {
    try {
      console.log(`📦 Creating ${plan.name}: ${plan.count} ${plan.strainType} ${plan.productType}s...`);
      
      const startTime = Date.now();
      const products = await bulkProductGenerator.generateBulkProducts({
        productType: plan.productType,
        strainType: plan.strainType,
        count: plan.count,
        priceRange: plan.priceRange,
        thcRange: plan.thcRange,
        includeDeals: false,
        includePackages: false
      });
      
      const savedResults = await bulkProductGenerator.saveBulkProducts(products);
      const endTime = Date.now();
      
      const successCount = savedResults.filter(r => !r.error).length;
      const failCount = savedResults.filter(r => r.error).length;
      
      totalGenerated += successCount;
      totalFailed += failCount;
      
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
      
      allResults.push({
        name: plan.name,
        type: `${plan.strainType} ${plan.productType}`,
        requested: plan.count,
        generated: successCount,
        failed: failCount,
        timeTaken: `${timeTaken}s`
      });
      
      console.log(`✅ ${plan.name}: ${successCount}/${plan.count} created in ${timeTaken}s`);
      
      // Sample products from this batch
      const samples = savedResults.filter(r => !r.error).slice(0, 3);
      samples.forEach(sample => {
        console.log(`   • ${sample.name} - $${sample.price} - ${sample.thcaContent} THC`);
      });
      
      // Delay between batches to respect API limits
      console.log('⏸️  Waiting 3 seconds before next batch...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (batchError) {
      console.error(`❌ Failed batch for ${plan.name}:`, batchError.message);
      allResults.push({
        name: plan.name,
        type: `${plan.strainType} ${plan.productType}`,
        requested: plan.count,
        generated: 0,
        failed: plan.count,
        error: batchError.message
      });
      totalFailed += plan.count;
    }
  }

  // Create special deals and packages
  console.log('🎁 Creating Special Deals and Packages...');
  try {
    const prerollDeals = await bulkProductGenerator.generateDealsAndPackages('pre-roll');
    const flowerDeals = await bulkProductGenerator.generateDealsAndPackages('flower');
    
    console.log(`✅ Created ${prerollDeals.length} pre-roll deals`);
    console.log(`✅ Created ${flowerDeals.length} flower deals`);
    
    // Sample deals
    console.log('\n🔥 Sample Deals Created:');
    [...prerollDeals.slice(0, 2), ...flowerDeals.slice(0, 2)].forEach((deal, i) => {
      console.log(`   ${i+1}. ${deal.name} - Save $${deal.savings} (${deal.dealType})`);
    });
    
  } catch (dealError) {
    console.warn('⚠️  Failed to generate deals:', dealError.message);
  }

  // Final summary
  console.log('\n🎉 MASSIVE INVENTORY CREATION COMPLETE!\n');
  console.log('📊 FINAL SUMMARY:');
  console.log('═'.repeat(60));
  console.log(`📦 Total Products Created: ${totalGenerated.toLocaleString()}`);
  console.log(`❌ Total Failed: ${totalFailed.toLocaleString()}`);
  console.log(`💰 Estimated Inventory Value: $${(totalGenerated * 35).toLocaleString()}`);
  console.log(`📈 Success Rate: ${((totalGenerated / (totalGenerated + totalFailed)) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Breakdown by Category:');
  allResults.forEach(result => {
    const status = result.generated > 0 ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.generated}/${result.requested} (${result.timeTaken || 'failed'})`);
  });

  const preRollsCreated = allResults
    .filter(r => r.type.includes('pre-roll'))
    .reduce((sum, r) => sum + r.generated, 0);
  
  const flowerProductsCreated = allResults
    .filter(r => r.type.includes('flower'))
    .reduce((sum, r) => sum + r.generated, 0);

  console.log('\n🌿 STRAIN BREAKDOWN:');
  console.log(`🔥 Pre-rolls Created: ${preRollsCreated.toLocaleString()}`);
  console.log(`🌸 Flower Products Created: ${flowerProductsCreated.toLocaleString()}`);
  console.log(`📊 Total THCA Products: ${(preRollsCreated + flowerProductsCreated).toLocaleString()}`);
  
  console.log('\n✨ Your hemp store is now FULLY STOCKED with premium products!');
  console.log('🚀 Ready for MASSIVE sales and viral marketing campaigns!');
}

// Execute the massive inventory creation
createMassiveInventory().catch(error => {
  console.error('💥 MASSIVE INVENTORY CREATION FAILED:', error);
  process.exit(1);
});