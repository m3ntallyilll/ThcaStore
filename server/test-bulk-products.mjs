import { bulkProductGenerator } from './bulk-product-generator.ts';

// Test the bulk product generation system
async function testBulkProducts() {
  console.log('🧪 Testing Bulk Product Generation System...\n');

  try {
    // Test 1: Small batch of indica pre-rolls
    console.log('Test 1: Generating 5 Indica Pre-rolls...');
    const indicaPreRolls = await bulkProductGenerator.generateBulkProducts({
      productType: 'pre-roll',
      strainType: 'indica',
      count: 5,
      priceRange: { min: 8, max: 15 },
      thcRange: { min: 20, max: 30 },
      includeDeals: false,
      includePackages: false
    });
    
    console.log(`✅ Generated ${indicaPreRolls.length} indica pre-rolls`);
    indicaPreRolls.forEach((product, i) => {
      console.log(`  ${i+1}. ${product.name} - $${product.price} - ${product.thcaContent} THC`);
    });

    // Test 2: Sativa flower products
    console.log('\nTest 2: Generating 3 Sativa Flower Products...');
    const sativaFlower = await bulkProductGenerator.generateBulkProducts({
      productType: 'flower',
      strainType: 'sativa',
      count: 3,
      priceRange: { min: 25, max: 60 },
      thcRange: { min: 18, max: 28 },
      includeDeals: true,
      includePackages: true
    });
    
    console.log(`✅ Generated ${sativaFlower.length} sativa flower products`);
    sativaFlower.forEach((product, i) => {
      console.log(`  ${i+1}. ${product.name} - $${product.price} - ${product.effects.join(', ')}`);
    });

    // Test 3: Generate deals and packages
    console.log('\nTest 3: Generating Deals and Packages...');
    const deals = await bulkProductGenerator.generateDealsAndPackages('pre-roll');
    console.log(`✅ Generated ${deals.length} deals and packages`);
    deals.slice(0, 3).forEach((deal, i) => {
      console.log(`  ${i+1}. ${deal.name} - Was $${deal.originalPrice}, Now $${deal.salePrice} (Save $${deal.savings})`);
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Indica Pre-rolls: ${indicaPreRolls.length}`);
    console.log(`- Sativa Flower: ${sativaFlower.length}`);
    console.log(`- Deals Generated: ${deals.length}`);
    console.log(`- Total Products: ${indicaPreRolls.length + sativaFlower.length}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testBulkProducts();