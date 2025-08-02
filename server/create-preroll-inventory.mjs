import { bulkProductGenerator } from './bulk-product-generator.ts';

// Create comprehensive pre-roll inventory with different weights
async function createPreRollInventory() {
  console.log('🚀 Creating Comprehensive Pre-Roll Inventory\n');

  const preRollPlans = [
    // 1.1g Pre-rolls
    { weight: '1.1g', strainType: 'indica', count: 500, priceRange: { min: 8, max: 12 }, thcRange: { min: 18, max: 28 }, isInfused: false },
    { weight: '1.1g', strainType: 'sativa', count: 500, priceRange: { min: 8, max: 12 }, thcRange: { min: 16, max: 26 }, isInfused: false },
    
    // 1.25g Pre-rolls (Regular)
    { weight: '1.25g', strainType: 'indica', count: 400, priceRange: { min: 10, max: 15 }, thcRange: { min: 20, max: 30 }, isInfused: false },
    { weight: '1.25g', strainType: 'sativa', count: 400, priceRange: { min: 10, max: 15 }, thcRange: { min: 18, max: 28 }, isInfused: false },
    
    // 1.25g Infused Pre-rolls
    { weight: '1.25g', strainType: 'indica', count: 200, priceRange: { min: 15, max: 25 }, thcRange: { min: 25, max: 35 }, isInfused: true },
    { weight: '1.25g', strainType: 'sativa', count: 200, priceRange: { min: 15, max: 25 }, thcRange: { min: 23, max: 33 }, isInfused: true },
    
    // 1.45g Pre-rolls (Regular)
    { weight: '1.45g', strainType: 'indica', count: 300, priceRange: { min: 12, max: 18 }, thcRange: { min: 22, max: 32 }, isInfused: false },
    { weight: '1.45g', strainType: 'sativa', count: 300, priceRange: { min: 12, max: 18 }, thcRange: { min: 20, max: 30 }, isInfused: false },
    
    // 1.45g Infused Pre-rolls
    { weight: '1.45g', strainType: 'indica', count: 150, priceRange: { min: 18, max: 30 }, thcRange: { min: 28, max: 40 }, isInfused: true },
    { weight: '1.45g', strainType: 'sativa', count: 150, priceRange: { min: 18, max: 30 }, thcRange: { min: 26, max: 38 }, isInfused: true },
    
    // Hybrid Pre-rolls
    { weight: '1.25g', strainType: 'hybrid', count: 200, priceRange: { min: 12, max: 20 }, thcRange: { min: 20, max: 30 }, isInfused: false },
    { weight: '1.25g', strainType: 'hybrid', count: 100, priceRange: { min: 16, max: 28 }, thcRange: { min: 24, max: 34 }, isInfused: true }
  ];

  let totalGenerated = 0;
  let totalFailed = 0;
  const allResults = [];

  for (const plan of preRollPlans) {
    try {
      const planName = `${plan.weight} ${plan.strainType}${plan.isInfused ? ' Infused' : ''} Pre-rolls`;
      console.log(`📦 Creating ${planName}: ${plan.count} units...`);
      
      const startTime = Date.now();
      const products = await bulkProductGenerator.generateBulkProducts({
        productType: 'pre-roll',
        strainType: plan.strainType,
        count: plan.count,
        priceRange: plan.priceRange,
        thcRange: plan.thcRange,
        preRollWeight: plan.weight,
        isInfused: plan.isInfused,
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
        name: planName,
        weight: plan.weight,
        strainType: plan.strainType,
        isInfused: plan.isInfused,
        requested: plan.count,
        generated: successCount,
        failed: failCount,
        timeTaken: `${timeTaken}s`
      });
      
      console.log(`✅ ${planName}: ${successCount}/${plan.count} created in ${timeTaken}s`);
      
      // Sample products from this batch
      const samples = savedResults.filter(r => !r.error).slice(0, 2);
      samples.forEach(sample => {
        console.log(`   • ${sample.name} - $${sample.price} - ${sample.thcaContent} THC`);
      });
      
      // Small delay between batches
      console.log('⏸️  Waiting 2 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (batchError) {
      console.error(`❌ Failed batch for ${plan.weight} ${plan.strainType}:`, batchError.message);
      allResults.push({
        name: `${plan.weight} ${plan.strainType}${plan.isInfused ? ' Infused' : ''} Pre-rolls`,
        weight: plan.weight,
        strainType: plan.strainType,
        isInfused: plan.isInfused,
        requested: plan.count,
        generated: 0,
        failed: plan.count,
        error: batchError.message
      });
      totalFailed += plan.count;
    }
  }

  // Final summary
  console.log('\n🎉 PRE-ROLL INVENTORY CREATION COMPLETE!\n');
  console.log('📊 FINAL SUMMARY:');
  console.log('═'.repeat(60));
  console.log(`📦 Total Pre-rolls Created: ${totalGenerated.toLocaleString()}`);
  console.log(`❌ Total Failed: ${totalFailed.toLocaleString()}`);
  console.log(`💰 Estimated Inventory Value: $${(totalGenerated * 15).toLocaleString()}`);
  console.log(`📈 Success Rate: ${((totalGenerated / (totalGenerated + totalFailed)) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Breakdown by Weight & Type:');
  allResults.forEach(result => {
    const status = result.generated > 0 ? '✅' : '❌';
    const infusedTag = result.isInfused ? ' (INFUSED)' : '';
    console.log(`${status} ${result.weight} ${result.strainType}${infusedTag}: ${result.generated}/${result.requested} (${result.timeTaken || 'failed'})`);
  });

  // Weight breakdown
  const weights = ['1.1g', '1.25g', '1.45g'];
  console.log('\n🌿 WEIGHT BREAKDOWN:');
  weights.forEach(weight => {
    const weightResults = allResults.filter(r => r.weight === weight);
    const total = weightResults.reduce((sum, r) => sum + r.generated, 0);
    const regular = weightResults.filter(r => !r.isInfused).reduce((sum, r) => sum + r.generated, 0);
    const infused = weightResults.filter(r => r.isInfused).reduce((sum, r) => sum + r.generated, 0);
    console.log(`🔥 ${weight}: ${total} total (${regular} regular, ${infused} infused)`);
  });
  
  console.log('\n✨ Your pre-roll inventory is now FULLY STOCKED!');
  console.log('🚀 Ready for massive sales with multiple weight options!');
}

// Execute the pre-roll inventory creation
createPreRollInventory().catch(error => {
  console.error('💥 PRE-ROLL INVENTORY CREATION FAILED:', error);
  process.exit(1);
});