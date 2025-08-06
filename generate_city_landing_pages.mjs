import { CityLandingGenerator } from './server/city-landing-generator.ts';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function generateAllCityLandingPages() {
  const generator = new CityLandingGenerator();
  
  console.log('🚀 Starting city landing page generation...');
  
  // Check if keyword file exists
  const keywordFile = 'city_thca_keywords_comprehensive.json';
  if (!existsSync(keywordFile)) {
    console.log('❌ Keyword file not found. Please run generate_city_keywords.mjs first.');
    console.log('   Run: node generate_city_keywords.mjs');
    return;
  }
  
  try {
    // Generate all landing pages
    const landingPages = await generator.generateBulkLandingPages(keywordFile);
    
    // Create pages directory if it doesn't exist
    const pagesDir = 'generated_city_pages';
    if (!existsSync(pagesDir)) {
      mkdirSync(pagesDir, { recursive: true });
    }
    
    // Save individual page files
    let savedPages = 0;
    for (const page of landingPages) {
      try {
        const fileName = `${page.slug}.html`;
        const filePath = join(pagesDir, fileName);
        
        // Create complete HTML file
        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.seoTitle}</title>
  <meta name="description" content="${page.metaDescription}">
  <link rel="canonical" href="${page.canonicalUrl}">
  <meta name="keywords" content="${page.keywords.slice(0, 20).join(', ')}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${page.seoTitle}">
  <meta property="og:description" content="${page.metaDescription}">
  <meta property="og:url" content="${page.canonicalUrl}">
  <meta property="og:type" content="website">
  
  <!-- Schema Markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mentally Chill - THCA Products ${page.city}",
    "description": "${page.metaDescription}",
    "url": "${page.canonicalUrl}",
    "areaServed": {
      "@type": "City",
      "name": "${page.city}",
      "addressRegion": "${page.state}"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "THCA Products",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "THCA Flower"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "THCA Pre-Rolls"
          }
        }
      ]
    }
  }
  </script>
  
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
    .hero-section { text-align: center; margin-bottom: 40px; }
    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
    .benefit { background: #f5f5f5; padding: 20px; border-radius: 8px; }
    .btn { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px; }
    .btn-secondary { background: #6b7280; }
    .faq-item { margin-bottom: 20px; }
    .faq-item h3 { color: #10b981; }
  </style>
</head>
<body>
  ${page.htmlContent}
  
  <!-- Analytics placeholder -->
  <script>
    // Google Analytics would go here
    console.log('Page view: ${page.canonicalUrl}');
  </script>
</body>
</html>`;

        writeFileSync(filePath, fullHTML);
        savedPages++;
        
        if (savedPages % 10 === 0) {
          console.log(`💾 Saved ${savedPages}/${landingPages.length} pages...`);
        }
        
      } catch (error) {
        console.error(`Failed to save page ${page.slug}:`, error);
      }
    }
    
    // Create index file with all pages
    const indexContent = `# Generated City THCA Landing Pages

Total Pages: ${landingPages.length}
Generated: ${new Date().toISOString()}

## Pages by State

${landingPages.reduce((acc, page) => {
  if (!acc[page.state]) acc[page.state] = [];
  acc[page.state].push(page);
  return acc;
}, {})}

${Object.entries(landingPages.reduce((acc, page) => {
  if (!acc[page.state]) acc[page.state] = [];
  acc[page.state].push(page);
  return acc;
}, {})).map(([state, pages]) => `
### ${state} (${pages.length} pages)
${pages.map(page => `- [${page.city}](${page.slug}.html) - ${page.wordCount} words`).join('\n')}
`).join('')}

## SEO Statistics
- Total words: ${landingPages.reduce((sum, page) => sum + page.wordCount, 0).toLocaleString()}
- Average words per page: ${Math.round(landingPages.reduce((sum, page) => sum + page.wordCount, 0) / landingPages.length)}
- Total unique keywords: ${[...new Set(landingPages.flatMap(page => page.keywords))].length.toLocaleString()}
`;

    writeFileSync(join(pagesDir, 'README.md'), indexContent);
    
    console.log('\n🎉 CITY LANDING PAGE GENERATION COMPLETE!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📄 Total Pages Generated: ${savedPages}`);
    console.log(`📝 Total Content: ${landingPages.reduce((sum, page) => sum + page.wordCount, 0).toLocaleString()} words`);
    console.log(`📊 Average per Page: ${Math.round(landingPages.reduce((sum, page) => sum + page.wordCount, 0) / landingPages.length)} words`);
    console.log(`📁 Pages Directory: ${pagesDir}/`);
    console.log(`📋 Index File: ${pagesDir}/README.md`);
    
    // Generate sitemap entries
    const sitemapEntries = landingPages.map(page => 
      `  <url>\n    <loc>${page.canonicalUrl}</loc>\n    <lastmod>${page.generatedAt.split('T')[0]}</lastmod>\n    <priority>0.8</priority>\n  </url>`
    ).join('\n');
    
    writeFileSync(join(pagesDir, 'sitemap_entries.xml'), sitemapEntries);
    console.log(`🗺️ Sitemap Entries: ${pagesDir}/sitemap_entries.xml`);
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Review generated pages in the generated_city_pages/ directory');
    console.log('2. Add sitemap entries to your main sitemap.xml');
    console.log('3. Implement routing for these pages in your application');
    console.log('4. Set up analytics tracking for each page');
    
  } catch (error) {
    console.error('❌ Error generating landing pages:', error);
  }
}

// Run the generator
generateAllCityLandingPages().catch(console.error);