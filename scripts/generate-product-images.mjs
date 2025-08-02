#!/usr/bin/env node
// AI-Powered Product Image Generation for THCA Store
// Generates professional, authentic product images for all catalog items

import OpenAI from 'openai';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Product image prompts for different categories
const imagePrompts = {
  flower: (product) => {
    const strainType = product.strainType || 'hybrid';
    const thcaContent = product.thcaContent || '25';
    const effects = product.effects?.join(', ') || 'relaxing';
    
    return `Professional product photography of premium ${strainType} hemp flower buds in a glass jar. High-quality indoor grown hemp with visible trichomes and crystalline structures. The buds should look dense, frosty, and well-cured with natural ${getStrainColors(strainType)} tones. Clean white background, studio lighting, macro photography detail showing the natural texture and quality. Commercial dispensary grade presentation, 4K resolution, professional cannabis photography style.`;
  },
  
  'pre-rolls': (product) => {
    const count = product.name.toLowerCase().includes('pack') ? 'multiple pre-rolled joints in packaging' : 'single pre-rolled joint';
    return `Professional product photography of premium hemp pre-roll joints. ${count} with clean white paper, perfect roll consistency, and hemp flower visible at the tip. Placed on clean white background with soft studio lighting. Commercial dispensary packaging style, high-end cannabis product photography, crisp detail, 4K resolution.`;
  },
  
  concentrates: (product) => {
    const type = product.name.toLowerCase();
    if (type.includes('diamond')) {
      return `Professional product photography of premium THCA diamonds - crystalline hemp concentrate with clear, glass-like appearance. Displayed in a clean glass container showing the crystal structure and purity. White background, studio lighting, macro photography showing the faceted crystal details, dispensary-grade presentation.`;
    } else if (type.includes('wax') || type.includes('budder')) {
      return `Professional product photography of premium hemp wax concentrate with creamy, butter-like consistency. Golden amber color, displayed in clean glass container. Studio lighting, white background, showing texture and quality, dispensary-grade presentation.`;
    }
    return `Professional product photography of premium hemp concentrate with clean, pure appearance. Displayed in glass container, studio lighting, white background, commercial dispensary quality.`;
  },
  
  edibles: (product) => {
    if (product.name.toLowerCase().includes('gummies')) {
      return `Professional product photography of premium hemp gummies - colorful, translucent gummy candies with perfect consistency. Arranged artistically showing different fruit flavors, clean packaging visible. Studio lighting, white background, commercial food photography style, appetizing presentation.`;
    } else if (product.name.toLowerCase().includes('chocolate')) {
      return `Professional product photography of premium hemp-infused chocolate bars or pieces. Rich, dark chocolate with clean packaging and ingredient labeling visible. Studio lighting, white background, gourmet food photography style.`;
    }
    return `Professional product photography of premium hemp edible products with clean, appetizing presentation. Studio lighting, white background, commercial food photography quality.`;
  },
  
  accessories: (product) => {
    if (product.name.toLowerCase().includes('grinder')) {
      return `Professional product photography of premium aluminum herb grinder with magnetic closure and kief catcher. Precision machined metal finish, multiple pieces displayed showing the grinding chamber and screen. Studio lighting, white background, high-end accessory photography.`;
    } else if (product.name.toLowerCase().includes('vape') || product.name.toLowerCase().includes('pen')) {
      return `Professional product photography of sleek hemp vape pen with modern design. Clean lines, premium materials, charging cable and packaging visible. Studio lighting, white background, tech product photography style.`;
    }
    return `Professional product photography of premium hemp accessory with clean, modern design. Studio lighting, white background, high-quality commercial presentation.`;
  },
  
  topicals: (product) => {
    return `Professional product photography of premium hemp topical cream or balm in clean, modern packaging. Medical-grade presentation with clear labeling, studio lighting, white background, pharmaceutical product photography style.`;
  },
  
  tinctures: (product) => {
    return `Professional product photography of premium hemp tincture in amber glass dropper bottle. Clean labeling, precise measurement markings, studio lighting, white background, pharmaceutical-grade presentation.`;
  }
};

// Get strain-appropriate colors
function getStrainColors(strainType) {
  switch (strainType.toLowerCase()) {
    case 'indica': return 'deep purple and dark green';
    case 'sativa': return 'bright green and orange';
    case 'hybrid': return 'mixed green, purple, and orange';
    default: return 'natural green';
  }
}

// Generate image for a single product
async function generateProductImage(product) {
  try {
    const category = product.category || 'flower';
    const prompt = imagePrompts[category] ? imagePrompts[category](product) : imagePrompts.flower(product);
    
    console.log(`🎨 Generating image for: ${product.name}`);
    console.log(`   Category: ${category}`);
    console.log(`   Prompt: ${prompt.substring(0, 100)}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    if (response.data && response.data[0] && response.data[0].url) {
      console.log(`✅ Generated image for ${product.name}`);
      return response.data[0].url;
    } else {
      console.log(`❌ Failed to generate image for ${product.name}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error generating image for ${product.name}:`, error.message);
    return null;
  }
}

// Generate images for all products
async function generateAllProductImages() {
  console.log('🚀 Starting AI Product Image Generation System...');
  
  try {
    // Import products from database
    const { storage } = await import('../server/database-storage.js');
    const products = await storage.getProducts();
    
    console.log(`📦 Found ${products.length} products to generate images for`);
    
    const updatedProducts = [];
    let successCount = 0;
    let failCount = 0;
    
    // Process products in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      console.log(`\n🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)}`);
      
      const batchPromises = batch.map(async (product) => {
        const imageUrl = await generateProductImage(product);
        
        if (imageUrl) {
          // Update product with new image URL
          const updatedProduct = { ...product, imageUrl };
          await storage.updateProduct(product.id, { imageUrl });
          successCount++;
          return updatedProduct;
        } else {
          failCount++;
          return product;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      updatedProducts.push(...batchResults);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < products.length) {
        console.log('⏸️  Waiting 30 seconds between batches...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
    
    console.log('\n🎉 AI Product Image Generation Complete!');
    console.log(`✅ Successfully generated: ${successCount} images`);
    console.log(`❌ Failed to generate: ${failCount} images`);
    console.log(`📊 Success rate: ${Math.round((successCount / products.length) * 100)}%`);
    
    // Save results summary
    const summary = {
      timestamp: new Date().toISOString(),
      totalProducts: products.length,
      successCount,
      failCount,
      successRate: Math.round((successCount / products.length) * 100),
      generatedImages: updatedProducts.filter(p => p.imageUrl?.includes('oaidalleapi')).length
    };
    
    writeFileSync(
      join(__dirname, '..', 'image_generation_summary.json'), 
      JSON.stringify(summary, null, 2)
    );
    
    console.log('📄 Generation summary saved to image_generation_summary.json');
    
  } catch (error) {
    console.error('❌ Critical error in image generation:', error);
    throw error;
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllProductImages()
    .then(() => {
      console.log('🏁 Image generation process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Image generation process failed:', error);
      process.exit(1);
    });
}

export default generateAllProductImages;