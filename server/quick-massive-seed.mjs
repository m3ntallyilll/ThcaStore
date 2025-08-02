import { bulkProductGenerator } from './bulk-product-generator.ts';

async function quickMassiveSeed() {
  console.log('🚀 QUICK MASSIVE SEED - FILLING INVENTORY FOR LAUNCH\n');

  // Optimized smaller batches for faster completion
  const quickSeedPlans = [
    // Core inventory - essential products for immediate launch
    { weight: '1.1g', strain: 'indica', count: 2000, price: [8, 12], infused: false },
    { weight: '1.1g', strain: 'sativa', count: 2000, price: [8, 12], infused: false },
    { weight: '1.1g', strain: 'hybrid', count: 1000, price: [9, 13], infused: false },
    
    { weight: '1.25g', strain: 'indica', count: 1500, price: [10, 15], infused: false },
    { weight: '1.25g', strain: 'sativa', count: 1500, price: [10, 15], infused: false },
    { weight: '1.25g', strain: 'hybrid', count: 800, price: [11, 16], infused: false },
    
    { weight: '1.25g', strain: 'indica', count: 800, price: [15, 25], infused: true },
    { weight: '1.25g', strain: 'sativa', count: 800, price: [15, 25], infused: true },
    { weight: '1.25g', strain: 'hybrid', count: 400, price: [16, 26], infused: true },
    
    { weight: '1.45g', strain: 'indica', count: 1000, price: [12, 18], infused: false },
    { weight: '1.45g', strain: 'sativa', count: 1000, price: [12, 18], infused: false },
    { weight: '1.45g', strain: 'hybrid', count: 500, price: [13, 19], infused: false },
    
    { weight: '1.45g', strain: 'indica', count: 500, price: [18, 30], infused: true },
    { weight: '1.45g', strain: 'sativa', count: 500, price: [18, 30], infused: true },
    { weight: '1.45g', strain: 'hybrid', count: 300, price: [19, 32], infused: true }
  ];

  let totalCreated = 0;
  const results = [];
  
  for (const [i, plan] of quickSeedPlans.entries()) {
    try {
      const progress = ((i + 1) / quickSeedPlans.length * 100).toFixed(1);
      const planName = `${plan.weight} ${plan.strain}${plan.infused ? ' infused' : ''}`;
      
      console.log(`[${progress}%] Creating ${planName}: ${plan.count} products...`);
      
      const products = await bulkProductGenerator.generateBulkProducts({
        productType: 'pre-roll',
        strainType: plan.strain,
        count: plan.count,
        priceRange: { min: plan.price[0], max: plan.price[1] },
        thcRange: { min: 18, max: 32 },
        preRollWeight: plan.weight,
        isInfused: plan.infused,
        includeDeals: false,
        includePackages: false
      });
      
      const saved = await bulkProductGenerator.saveBulkProducts(products);
      const successCount = saved.filter(r => !r.error).length;
      totalCreated += successCount;
      
      results.push({
        name: planName,
        created: successCount,
        requested: plan.count
      });
      
      console.log(`✅ Created ${successCount}/${plan.count} ${planName} products`);
      
    } catch (error) {
      console.error(`❌ Failed ${plan.weight} ${plan.strain}:`, error.message);
    }
  }
  
  console.log(`\n🎉 QUICK SEED COMPLETE: ${totalCreated.toLocaleString()} products created!`);
  return { totalCreated, results };
}

quickMassiveSeed()
  .then(result => {
    console.log(`🚀 LAUNCH READY: ${result.totalCreated.toLocaleString()} products in database!`);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Quick seed failed:', error);
    process.exit(1);
  });