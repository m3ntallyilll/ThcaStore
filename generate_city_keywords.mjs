import { CityTHCAGenerator } from './server/city-thca-generator.ts';
import { writeFileSync } from 'fs';

async function generateComprehensiveCityKeywords() {
  const generator = new CityTHCAGenerator();
  
  console.log('🚀 Starting comprehensive city THCA keyword generation...');
  
  // Get all legal cities
  const allCities = generator.getAllLegalCities();
  console.log(`📊 Found ${allCities.length} legal cities across all states`);
  
  // Generate keywords for cities with 50k+ population (high ROI targets)
  console.log('🎯 Generating keywords for major cities (50k+ population)...');
  const majorCityKeywords = await generator.generateBulkCityKeywords(undefined, 50000);
  
  // Generate keywords for medium cities (25k+ population)
  console.log('🏘️ Generating keywords for medium cities (25k+ population)...');
  const mediumCityKeywords = await generator.generateBulkCityKeywords(undefined, 25000);
  
  // Generate keywords for smaller cities (10k+ population)
  console.log('🏘️ Generating keywords for smaller cities (10k+ population)...');
  const smallerCityKeywords = await generator.generateBulkCityKeywords(undefined, 10000);
  
  // Combine all results
  const allKeywords = [...majorCityKeywords, ...mediumCityKeywords, ...smallerCityKeywords];
  
  // Calculate totals
  const totalKeywords = generator.getTotalKeywordCount(allKeywords);
  const uniqueCities = allKeywords.length;
  
  // Save results
  const results = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalCities: uniqueCities,
      totalKeywords: totalKeywords,
      averageKeywordsPerCity: Math.round(totalKeywords / uniqueCities),
      states: [...new Set(allKeywords.map(k => k.state))],
      cityDistribution: {
        major: majorCityKeywords.length,
        medium: mediumCityKeywords.length - majorCityKeywords.length,
        smaller: smallerCityKeywords.length - mediumCityKeywords.length
      }
    },
    keywordSets: allKeywords,
    summary: {
      topCitiesByKeywords: allKeywords
        .map(set => ({
          city: `${set.city}, ${set.state}`,
          totalKeywords: set.primaryKeywords.length + set.longTailKeywords.length + 
                        set.localVariations.length + set.commercialKeywords.length + 
                        set.urgentKeywords.length
        }))
        .sort((a, b) => b.totalKeywords - a.totalKeywords)
        .slice(0, 10)
    }
  };
  
  // Save to file
  writeFileSync('city_thca_keywords_comprehensive.json', JSON.stringify(results, null, 2));
  
  console.log('\n🎉 COMPREHENSIVE CITY KEYWORD GENERATION COMPLETE!');
  console.log('═══════════════════════════════════════════════════');
  console.log(`📈 Total Cities Covered: ${uniqueCities}`);
  console.log(`🎯 Total Keywords Generated: ${totalKeywords.toLocaleString()}`);
  console.log(`⚡ Average Keywords per City: ${Math.round(totalKeywords / uniqueCities)}`);
  console.log(`🗺️ States Covered: ${results.metadata.states.join(', ')}`);
  console.log('\n📊 City Distribution:');
  console.log(`   🏙️ Major Cities (50k+): ${results.metadata.cityDistribution.major}`);
  console.log(`   🏘️ Medium Cities (25k+): ${results.metadata.cityDistribution.medium}`);
  console.log(`   🏡 Smaller Cities (10k+): ${results.metadata.cityDistribution.smaller}`);
  console.log('\n💾 Results saved to: city_thca_keywords_comprehensive.json');
  
  console.log('\n🔥 TOP 10 CITIES BY KEYWORD COUNT:');
  results.summary.topCitiesByKeywords.forEach((city, index) => {
    console.log(`   ${index + 1}. ${city.city}: ${city.totalKeywords} keywords`);
  });
  
  return results;
}

// State-specific generation function
async function generateStateKeywords(stateName) {
  const generator = new CityTHCAGenerator();
  
  console.log(`🎯 Generating THCA keywords for all cities in ${stateName}...`);
  
  const keywords = await generator.generateBulkCityKeywords(stateName, 5000);
  const totalKeywords = generator.getTotalKeywordCount(keywords);
  
  const results = {
    state: stateName,
    generatedAt: new Date().toISOString(),
    totalCities: keywords.length,
    totalKeywords: totalKeywords,
    keywordSets: keywords
  };
  
  writeFileSync(`${stateName.toLowerCase()}_thca_keywords.json`, JSON.stringify(results, null, 2));
  
  console.log(`\n✅ ${stateName} keyword generation complete!`);
  console.log(`📊 Cities: ${keywords.length} | Keywords: ${totalKeywords}`);
  console.log(`💾 Saved to: ${stateName.toLowerCase()}_thca_keywords.json`);
  
  return results;
}

// Run based on command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  // Generate for all cities
  generateComprehensiveCityKeywords().catch(console.error);
} else if (args[0] === 'state' && args[1]) {
  // Generate for specific state
  generateStateKeywords(args[1]).catch(console.error);
} else {
  console.log('Usage:');
  console.log('  node generate_city_keywords.mjs                    # Generate all cities');
  console.log('  node generate_city_keywords.mjs state California   # Generate specific state');
}