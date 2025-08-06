// Simple test of city keyword generation without complex imports
import { writeFileSync } from 'fs';

// Sample city data for testing
const sampleCities = [
  { city: 'Los Angeles', state: 'California', population: 3898747 },
  { city: 'Denver', state: 'Colorado', population: 715522 },
  { city: 'Portland', state: 'Oregon', population: 650380 },
  { city: 'Seattle', state: 'Washington', population: 737015 },
  { city: 'Las Vegas', state: 'Nevada', population: 651319 }
];

function generateCityKeywords(city, state) {
  return {
    city,
    state,
    primaryKeywords: [
      `Buy THCA ${city}`,
      `THCA flower ${city}`,
      `THCA delivery ${city}`,
      `Legal THCA ${city}`,
      `THCA dispensary ${city}`,
      `THCA store ${city}`,
      `${city} THCA products`,
      `THCA ${city} ${state}`
    ],
    longTailKeywords: [
      `Where to buy THCA in ${city}`,
      `Best THCA dispensary ${city}`,
      `THCA flower delivery ${city}`,
      `Premium THCA ${city}`,
      `Lab tested THCA ${city}`,
      `THCA pre rolls ${city}`,
      `THCA gummies ${city}`,
      `High quality THCA ${city}`,
      `THCA vape ${city}`,
      `Organic THCA ${city}`,
      `THCA concentrates ${city}`,
      `Medical THCA ${city}`
    ],
    localVariations: [
      `THCA near me ${city}`,
      `${city} hemp dispensary`,
      `Cannabis ${city}`,
      `Hemp products ${city}`,
      `THC alternative ${city}`,
      `${city} marijuana dispensary`,
      `Weed delivery ${city}`,
      `${city} cannabis store`
    ],
    commercialKeywords: [
      `THCA deals ${city}`,
      `Cheap THCA ${city}`,
      `THCA coupons ${city}`,
      `THCA sale ${city}`,
      `Discount THCA ${city}`,
      `THCA specials ${city}`
    ],
    urgentKeywords: [
      `Same day THCA delivery ${city}`,
      `Fast THCA ${city}`,
      `24 hour THCA ${city}`,
      `Emergency THCA ${city}`
    ],
    seoTitle: `Buy THCA in ${city}, ${state} | Premium Hemp Products`,
    metaDescription: `Shop premium THCA products in ${city}, ${state}. Lab-tested flower, gummies & more. Fast delivery available. Legal hemp-derived THCA.`,
    h1Tag: `Premium THCA Products in ${city}, ${state}`,
    contentOutline: [
      `THCA Laws and Legality in ${city}`,
      `Best THCA Dispensaries Near ${city}`,
      `THCA Product Types Available in ${city}`,
      `THCA Delivery Options in ${city}`,
      `Why Choose Lab-Tested THCA Products`,
      `THCA vs THC: What ${city} Residents Need to Know`,
      `Customer Reviews from ${city} THCA Users`
    ]
  };
}

function generateAllKeywords() {
  console.log('🚀 Generating THCA keywords for sample cities...');
  
  const allKeywords = sampleCities.map(cityData => {
    const keywords = generateCityKeywords(cityData.city, cityData.state);
    console.log(`✓ Generated keywords for ${cityData.city}, ${cityData.state}`);
    return keywords;
  });

  // Calculate statistics
  const totalKeywords = allKeywords.reduce((total, set) => {
    return total + 
      set.primaryKeywords.length + 
      set.longTailKeywords.length + 
      set.localVariations.length + 
      set.commercialKeywords.length + 
      set.urgentKeywords.length;
  }, 0);

  const results = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalCities: allKeywords.length,
      totalKeywords: totalKeywords,
      averageKeywordsPerCity: Math.round(totalKeywords / allKeywords.length),
      states: [...new Set(allKeywords.map(k => k.state))]
    },
    keywordSets: allKeywords,
    summary: {
      keywordBreakdown: {
        primary: allKeywords.reduce((sum, set) => sum + set.primaryKeywords.length, 0),
        longTail: allKeywords.reduce((sum, set) => sum + set.longTailKeywords.length, 0),
        local: allKeywords.reduce((sum, set) => sum + set.localVariations.length, 0),
        commercial: allKeywords.reduce((sum, set) => sum + set.commercialKeywords.length, 0),
        urgent: allKeywords.reduce((sum, set) => sum + set.urgentKeywords.length, 0)
      }
    }
  };

  // Save results
  writeFileSync('sample_city_thca_keywords.json', JSON.stringify(results, null, 2));

  console.log('\n🎉 SAMPLE KEYWORD GENERATION COMPLETE!');
  console.log('═══════════════════════════════════════');
  console.log(`📊 Cities Processed: ${results.metadata.totalCities}`);
  console.log(`🎯 Total Keywords: ${results.metadata.totalKeywords}`);
  console.log(`⚡ Average per City: ${results.metadata.averageKeywordsPerCity}`);
  console.log(`🗺️ States: ${results.metadata.states.join(', ')}`);
  
  console.log('\n📈 Keyword Breakdown:');
  console.log(`   Primary Keywords: ${results.summary.keywordBreakdown.primary}`);
  console.log(`   Long-tail Keywords: ${results.summary.keywordBreakdown.longTail}`);
  console.log(`   Local Variations: ${results.summary.keywordBreakdown.local}`);
  console.log(`   Commercial Keywords: ${results.summary.keywordBreakdown.commercial}`);
  console.log(`   Urgent Keywords: ${results.summary.keywordBreakdown.urgent}`);
  
  console.log('\n💾 Results saved to: sample_city_thca_keywords.json');
  
  console.log('\n🎯 Sample Keywords for Los Angeles:');
  const laKeywords = allKeywords.find(k => k.city === 'Los Angeles');
  if (laKeywords) {
    console.log('   Primary:', laKeywords.primaryKeywords.slice(0, 3).join(', '));
    console.log('   Long-tail:', laKeywords.longTailKeywords.slice(0, 3).join(', '));
    console.log('   Local:', laKeywords.localVariations.slice(0, 3).join(', '));
  }

  return results;
}

// Run the generator
generateAllKeywords();