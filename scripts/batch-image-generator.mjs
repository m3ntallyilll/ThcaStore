#!/usr/bin/env node
// Batch Product Image Generation with Progress Tracking
// Generates professional product images for THCA store inventory

import OpenAI from 'openai';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  console.log('💡 Set your OpenAI API key: export OPENAI_API_KEY=your_key_here');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Enhanced prompts for different product categories
const categoryPrompts = {
  flower: {
    base: "Professional studio photograph of premium hemp flower buds",
    details: "Dense, frosty trichomes, well-cured, glass jar display, white background, macro detail",
    style: "commercial dispensary photography, 4K, studio lighting"
  },
  'pre-rolls': {
    base: "Professional studio photograph of premium hemp pre-roll joints",
    details: "Clean white rolling paper, perfect consistency, hemp visible at tip, dispensary packaging",
    style: "commercial cannabis photography, white background, studio lighting"
  },
  concentrates: {
    base: "Professional studio photograph of premium hemp concentrate",
    details: "Glass container, crystalline structure, pure appearance, laboratory quality",
    style: "macro photography, white background, pharmaceutical presentation"
  },
  edibles: {
    base: "Professional studio photograph of premium hemp edibles",
    details: "Food-safe presentation, appetizing colors, clean packaging visible",
    style: "commercial food photography, studio lighting, gourmet presentation"
  },
  accessories: {
    base: "Professional studio photograph of premium hemp accessory",
    details: "Precision manufacturing, modern design, all components visible",
    style: "tech product photography, white background, commercial presentation"
  },
  topicals: {
    base: "Professional studio photograph of premium hemp topical product",
    details: "Medical-grade packaging, clean labeling, pharmaceutical quality",
    style: "healthcare product photography, studio lighting, clinical presentation"
  },
  tinctures: {
    base: "Professional studio photograph of premium hemp tincture",
    details: "Amber glass dropper bottle, precise measurements, pharmaceutical labeling",
    style: "medical product photography, studio lighting, clinical quality"
  }
};

// Generate strain-specific visual characteristics
function getStrainVisuals(product) {
  const name = product.name.toLowerCase();
  const strainType = product.strainType?.toLowerCase() || 'hybrid';
  
  // Color patterns for different strains
  const strainColors = {
    indica: 'deep purple, dark green, rich amber trichomes',
    sativa: 'bright green, orange hairs, golden trichomes', 
    hybrid: 'mixed green and purple, varied orange hairs, frosty white trichomes'
  };
  
  // Specific strain characteristics
  const strainSpecifics = {
    'blue dream': 'blueish-green buds with orange hairs',
    'green crack': 'bright lime green with dense orange pistils',
    'sour diesel': 'light green with heavy trichome coverage',
    'og kush': 'dense olive green with purple undertones',
    'purple punch': 'deep purple and green with bright orange hairs',
    'granddaddy purple': 'royal purple with heavy crystal coating',
    'girl scout cookies': 'mixed green and purple with orange accents',
    'gelato': 'dark purple and green with heavy frost coverage'
  };
  
  // Find specific strain match
  for (const [strain, description] of Object.entries(strainSpecifics)) {
    if (name.includes(strain)) {
      return description;
    }
  }
  
  return strainColors[strainType] || strainColors.hybrid;
}

// Generate detailed prompt for product
function generatePrompt(product) {
  const category = product.category || 'flower';
  const template = categoryPrompts[category] || categoryPrompts.flower;
  
  let prompt = `${template.base}. `;
  
  // Add category-specific details
  if (category === 'flower') {
    const visuals = getStrainVisuals(product);
    prompt += `${visuals}, ${template.details}. `;
  } else {
    prompt += `${template.details}. `;
  }
  
  // Add product-specific details
  if (product.thcaContent) {
    prompt += `High-potency ${product.thcaContent}% THCA content. `;
  }
  
  if (product.effects && product.effects.length > 0) {
    prompt += `Known for ${product.effects.slice(0, 3).join(', ')} effects. `;
  }
  
  // Add weight information for flower
  if (category === 'flower' && product.weight) {
    const weight = parseFloat(product.weight);
    if (weight >= 28) prompt += 'Full ounce display in large glass jar. ';
    else if (weight >= 14) prompt += 'Half ounce in medium glass jar. ';
    else if (weight >= 7) prompt += 'Quarter ounce in glass container. ';
    else if (weight >= 3.5) prompt += 'Eighth ounce in small glass jar. ';
    else prompt += 'Single gram in small container. ';
  }
  
  prompt += `${template.style}. Professional commercial quality, no text overlays, clean composition.`;
  
  return prompt;
}

// Generate image with retry logic
async function generateImageWithRetry(product, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const prompt = generatePrompt(product);
      
      console.log(`🎨 Attempt ${attempt}/${maxRetries} - Generating: ${product.name}`);
      if (attempt === 1) {
        console.log(`   📝 Prompt: ${prompt.substring(0, 120)}...`);
      }
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "natural"
      });

      if (response.data && response.data[0] && response.data[0].url) {
        console.log(`✅ Success: ${product.name}`);
        return {
          success: true,
          imageUrl: response.data[0].url,
          prompt: prompt
        };
      }
    } catch (error) {
      console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`⏳ Waiting ${delay/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return { success: false, error: `Failed after ${maxRetries} attempts` };
}

// Main batch generation function
async function batchGenerateImages() {
  console.log('🚀 Starting Batch Product Image Generation...');
  
  try {
    // Load products from database
    const { storage } = await import('../server/database-storage.js');
    const products = await storage.getProducts();
    
    console.log(`📦 Found ${products.length} products in catalog`);
    
    // Load existing progress if available
    const progressFile = join(__dirname, '..', 'image_generation_progress.json');
    let progress = { completed: [], failed: [], remaining: products.map(p => p.id) };
    
    if (existsSync(progressFile)) {
      progress = JSON.parse(readFileSync(progressFile, 'utf8'));
      console.log(`📄 Resuming from progress: ${progress.completed.length} completed, ${progress.failed.length} failed`);
    }
    
    const results = {
      timestamp: new Date().toISOString(),
      total: products.length,
      completed: progress.completed.length,
      failed: progress.failed.length,
      newlyGenerated: 0,
      details: []
    };
    
    // Process remaining products
    const remainingProducts = products.filter(p => 
      !progress.completed.includes(p.id) && !progress.failed.includes(p.id)
    );
    
    console.log(`🔄 Processing ${remainingProducts.length} remaining products...`);
    
    // Process in small batches with delays
    const batchSize = 3; // Smaller batches to respect rate limits
    
    for (let i = 0; i < remainingProducts.length; i += batchSize) {
      const batch = remainingProducts.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(remainingProducts.length / batchSize);
      
      console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batch.length} products)`);
      
      for (const product of batch) {
        const result = await generateImageWithRetry(product);
        
        if (result.success) {
          // Update product in database
          await storage.updateProduct(product.id, { imageUrl: result.imageUrl });
          progress.completed.push(product.id);
          results.newlyGenerated++;
          
          results.details.push({
            id: product.id,
            name: product.name,
            category: product.category,
            success: true,
            imageUrl: result.imageUrl
          });
        } else {
          progress.failed.push(product.id);
          results.details.push({
            id: product.id,
            name: product.name,
            category: product.category,
            success: false,
            error: result.error
          });
        }
        
        // Update progress file
        writeFileSync(progressFile, JSON.stringify(progress, null, 2));
        
        // Small delay between individual requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Longer delay between batches
      if (i + batchSize < remainingProducts.length) {
        console.log('⏸️  Cooling down for 45 seconds...');
        await new Promise(resolve => setTimeout(resolve, 45000));
      }
    }
    
    // Final results
    results.completed = progress.completed.length;
    results.failed = progress.failed.length;
    results.successRate = Math.round((results.completed / results.total) * 100);
    
    // Save final results
    const resultsFile = join(__dirname, '..', 'batch_image_generation_results.json');
    writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    
    console.log('\n🎉 Batch Generation Complete!');
    console.log(`✅ Total completed: ${results.completed}/${results.total}`);
    console.log(`🆕 Newly generated: ${results.newlyGenerated}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📊 Overall success rate: ${results.successRate}%`);
    console.log(`📄 Results saved to: ${resultsFile}`);
    
  } catch (error) {
    console.error('💥 Critical error in batch generation:', error);
    throw error;
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  batchGenerateImages()
    .then(() => {
      console.log('🏁 Batch image generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Batch generation failed:', error);
      process.exit(1);
    });
}

export default batchGenerateImages;