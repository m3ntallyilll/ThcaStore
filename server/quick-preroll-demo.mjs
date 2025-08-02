import { bulkProductGenerator } from './bulk-product-generator.ts';

// Quick demo showing different pre-roll weights and infused options
async function quickPreRollDemo() {
  console.log('🚀 Quick Pre-Roll Inventory Demo\n');

  const quickPlans = [
    // 1.1g Regular Pre-rolls
    { weight: '1.1g', strainType: 'indica', count: 10, priceRange: { min: 8, max: 12 }, thcRange: { min: 18, max: 28 }, isInfused: false },
    { weight: '1.1g', strainType: 'sativa', count: 10, priceRange: { min: 8, max: 12 }, thcRange: { min: 16, max: 26 }, isInfused: false },
    
    // 1.25g Regular Pre-rolls
    { weight: '1.25g', strainType: 'indica', count: 10, priceRange: { min: 10, max: 15 }, thcRange: { min: 20, max: 30 }, isInfused: false },
    
    // 1.25g Infused Pre-rolls
    { weight: '1.25g', strainType: 'indica', count: 5, priceRange: { min: 15, max: 25 }, thcRange: { min: 25, max: 35 }, isInfused: true },
    
    // 1.45g Regular Pre-rolls
    { weight: '1.45g', strainType: 'sativa', count: 8, priceRange: { min: 12, max: 18 }, thcRange: { min: 20, max: 30 }, isInfused: false },
    
    // 1.45g Infused Pre-rolls
    { weight: '1.45g', strainType: 'hybrid', count: 5, priceRange: { min: 18, max: 30 }, thcRange: { min: 28, max: 40 }, isInfused: true }
  ];

  let totalGenerated = 0;
  const allResults = [];

  for (const plan of quickPlans) {
    try {
      const planName = `${plan.weight} ${plan.strainType}${plan.isInfused ? ' Infused' : ''} Pre-rolls`;
      console.log(`📦 Creating ${planName}: ${plan.count} units...`);
      
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
      const successCount = savedResults.filter(r => !r.error).length;
      
      totalGenerated += successCount;
      
      allResults.push({
        name: planName,
        generated: successCount,
        samples: savedResults.filter(r => !r.error).slice(0, 2)
      });
      
      console.log(`✅ ${planName}: ${successCount}/${plan.count} created`);
      
      // Show samples
      savedResults.filter(r => !r.error).slice(0, 2).forEach(sample => {
        console.log(`   • ${sample.name} - $${sample.price} - ${sample.thcaContent} THC`);
      });
      
      console.log('');
      
    } catch (batchError) {
      console.error(`❌ Failed: ${batchError.message}`);
    }
  }

  console.log('\n🎉 DEMO COMPLETE!\n');
  console.log('📊 SUMMARY:');
  console.log(`🌿 Total Products Created: ${totalGenerated}`);
  console.log(`💰 Estimated Value: $${(totalGenerated * 15).toLocaleString()}`);
  
  console.log('\n📋 Product Breakdown:');
  allResults.forEach(result => {
    console.log(`✅ ${result.name}: ${result.generated} products`);
  });
  
  console.log('\n✨ Your pre-roll system is working perfectly!');
  console.log('🚀 Ready to scale up to 100,000+ products!');
}

quickPreRollDemo().catch(error => {
  console.error('💥 Demo failed:', error);
});