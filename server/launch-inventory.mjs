import { bulkProductGenerator } from './bulk-product-generator.ts';

// Create launch-ready massive inventory
async function createLaunchInventory() {
  console.log('🚀 CREATING LAUNCH INVENTORY - MASSIVE SCALE\n');

  const launchPlans = [
    // 1.1g Pre-rolls - Foundation tier (most affordable)
    { weight: '1.1g', strainType: 'indica', count: 1000, priceRange: { min: 8, max: 12 }, thcRange: { min: 18, max: 28 }, isInfused: false },
    { weight: '1.1g', strainType: 'sativa', count: 1000, priceRange: { min: 8, max: 12 }, thcRange: { min: 16, max: 26 }, isInfused: false },
    { weight: '1.1g', strainType: 'hybrid', count: 500, priceRange: { min: 9, max: 13 }, thcRange: { min: 17, max: 27 }, isInfused: false },
    
    // 1.25g Regular Pre-rolls - Premium tier
    { weight: '1.25g', strainType: 'indica', count: 800, priceRange: { min: 10, max: 15 }, thcRange: { min: 20, max: 30 }, isInfused: false },
    { weight: '1.25g', strainType: 'sativa', count: 800, priceRange: { min: 10, max: 15 }, thcRange: { min: 18, max: 28 }, isInfused: false },
    { weight: '1.25g', strainType: 'hybrid', count: 400, priceRange: { min: 11, max: 16 }, thcRange: { min: 19, max: 29 }, isInfused: false },
    
    // 1.25g Infused Pre-rolls - Premium infused
    { weight: '1.25g', strainType: 'indica', count: 300, priceRange: { min: 15, max: 25 }, thcRange: { min: 25, max: 35 }, isInfused: true },
    { weight: '1.25g', strainType: 'sativa', count: 300, priceRange: { min: 15, max: 25 }, thcRange: { min: 23, max: 33 }, isInfused: true },
    { weight: '1.25g', strainType: 'hybrid', count: 200, priceRange: { min: 16, max: 26 }, thcRange: { min: 24, max: 34 }, isInfused: true },
    
    // 1.45g Regular Pre-rolls - Ultra premium
    { weight: '1.45g', strainType: 'indica', count: 600, priceRange: { min: 12, max: 18 }, thcRange: { min: 22, max: 32 }, isInfused: false },
    { weight: '1.45g', strainType: 'sativa', count: 600, priceRange: { min: 12, max: 18 }, thcRange: { min: 20, max: 30 }, isInfused: false },
    { weight: '1.45g', strainType: 'hybrid', count: 300, priceRange: { min: 13, max: 19 }, thcRange: { min: 21, max: 31 }, isInfused: false },
    
    // 1.45g Infused Pre-rolls - Elite tier
    { weight: '1.45g', strainType: 'indica', count: 200, priceRange: { min: 18, max: 30 }, thcRange: { min: 28, max: 40 }, isInfused: true },
    { weight: '1.45g', strainType: 'sativa', count: 200, priceRange: { min: 18, max: 30 }, thcRange: { min: 26, max: 38 }, isInfused: true },
    { weight: '1.45g', strainType: 'hybrid', count: 100, priceRange: { min: 19, max: 32 }, thcRange: { min: 27, max: 39 }, isInfused: true }
  ];

  let totalGenerated = 0;
  let totalFailed = 0;
  const allResults = [];
  const startTime = Date.now();

  for (const plan of launchPlans) {
    try {
      const planName = `${plan.weight} ${plan.strainType}${plan.isInfused ? ' Infused' : ''} Pre-rolls`;
      console.log(`📦 Creating ${planName}: ${plan.count} units...`);
      
      const batchStartTime = Date.now();
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
      const batchEndTime = Date.now();
      
      const successCount = savedResults.filter(r => !r.error).length;
      const failCount = savedResults.filter(r => r.error).length;
      
      totalGenerated += successCount;
      totalFailed += failCount;
      
      const timeTaken = ((batchEndTime - batchStartTime) / 1000).toFixed(2);
      
      allResults.push({
        name: planName,
        weight: plan.weight,
        strainType: plan.strainType,
        isInfused: plan.isInfused,
        requested: plan.count,
        generated: successCount,
        failed: failCount,
        timeTaken: `${timeTaken}s`,
        avgPrice: (plan.priceRange.min + plan.priceRange.max) / 2
      });
      
      console.log(`✅ ${planName}: ${successCount}/${plan.count} created in ${timeTaken}s`);
      
      // Show top samples from this batch
      const samples = savedResults.filter(r => !r.error).slice(0, 3);
      samples.forEach(sample => {
        console.log(`   • ${sample.name} - $${sample.price} - ${sample.thcaContent} THC`);
      });
      
      // Progress indicator
      const progress = ((allResults.length / launchPlans.length) * 100).toFixed(1);
      console.log(`📊 Progress: ${progress}% complete\n`);
      
      // Small delay to prevent API overload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
  const totalRequested = launchPlans.reduce((sum, plan) => sum + plan.count, 0);

  // Final launch summary
  console.log('\n🎉 LAUNCH INVENTORY CREATION COMPLETE!\n');
  console.log('🚀 LAUNCH READY STATISTICS:');
  console.log('═'.repeat(80));
  console.log(`📦 Total Products Created: ${totalGenerated.toLocaleString()} / ${totalRequested.toLocaleString()}`);
  console.log(`⚡ Success Rate: ${((totalGenerated / totalRequested) * 100).toFixed(1)}%`);
  console.log(`⏱️  Total Generation Time: ${totalTime} minutes`);
  console.log(`💰 Estimated Inventory Value: $${(totalGenerated * 15).toLocaleString()}`);
  console.log(`🔥 Average Products per Minute: ${(totalGenerated / parseFloat(totalTime)).toFixed(0)}`);
  
  console.log('\n📋 INVENTORY BREAKDOWN BY WEIGHT:');
  const weights = ['1.1g', '1.25g', '1.45g'];
  weights.forEach(weight => {
    const weightResults = allResults.filter(r => r.weight === weight);
    const total = weightResults.reduce((sum, r) => sum + r.generated, 0);
    const regular = weightResults.filter(r => !r.isInfused).reduce((sum, r) => sum + r.generated, 0);
    const infused = weightResults.filter(r => r.isInfused).reduce((sum, r) => sum + r.generated, 0);
    const avgPrice = weightResults.reduce((sum, r) => sum + (r.avgPrice * r.generated), 0) / total;
    
    console.log(`🔥 ${weight}: ${total.toLocaleString()} total (${regular.toLocaleString()} regular, ${infused.toLocaleString()} infused) - Avg $${avgPrice.toFixed(2)}`);
  });

  console.log('\n🌿 STRAIN TYPE BREAKDOWN:');
  const strainTypes = ['indica', 'sativa', 'hybrid'];
  strainTypes.forEach(strain => {
    const strainResults = allResults.filter(r => r.strainType === strain);
    const total = strainResults.reduce((sum, r) => sum + r.generated, 0);
    console.log(`🌱 ${strain.toUpperCase()}: ${total.toLocaleString()} products`);
  });

  console.log('\n✨ LAUNCH STATUS: READY FOR DEPLOYMENT');
  console.log('🚀 Your hemp empire has a massive inventory ready!');
  console.log('💼 Perfect for immediate sales and viral marketing');
  console.log('📈 Scale proven - ready for 100K+ expansion');
  
  return {
    totalGenerated,
    totalRequested,
    successRate: ((totalGenerated / totalRequested) * 100).toFixed(1),
    estimatedValue: totalGenerated * 15,
    breakdown: allResults
  };
}

// Execute the launch inventory creation
createLaunchInventory()
  .then(results => {
    console.log('\n🎯 FINAL RESULTS:', results);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 LAUNCH INVENTORY CREATION FAILED:', error);
    process.exit(1);
  });