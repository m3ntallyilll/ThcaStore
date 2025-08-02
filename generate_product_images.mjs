#!/usr/bin/env node
// Generate AI images for all products in the catalog

import { neon } from '@neondatabase/serverless';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const sql = neon(process.env.DATABASE_URL);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ensure images directory exists
const imagesDir = path.join(process.cwd(), 'attached_assets', 'generated_images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Image generation prompts by category
const imagePrompts = {
  flower: (name, strain) => `Professional product photography of premium ${strain} hemp flower buds in a clear glass jar. The buds are dense, frosty with trichomes, and show vibrant colors typical of ${strain}. Clean white background, studio lighting, commercial cannabis dispensary style. High quality, detailed, professional product shot.`,
  
  'pre-rolls': (name, strain) => `Professional product photo of a perfectly rolled ${strain} hemp pre-roll joint. Clean white paper, even roll, branded filter tip. Clean white background, studio lighting, commercial dispensary style photography. High quality, professional product shot.`,
  
  concentrates: (name, type) => {
    const concentratePrompts = {
      'Live Resin': `Professional macro photography of premium live resin concentrate. Golden amber color, crystalline texture, sitting in a small glass container. Clean white background, studio lighting, commercial dispensary product photography style.`,
      'Rosin': `Professional product photo of premium rosin concentrate. Light golden color, smooth consistency, in a small glass jar. Clean white background, studio lighting, commercial cannabis product photography.`,
      'Wax': `Professional product photo of premium wax concentrate. Opaque, waxy texture, light colored, in a small silicone container. Clean white background, studio lighting, commercial dispensary style.`
    };
    return concentratePrompts[type] || concentratePrompts['Live Resin'];
  },
  
  edibles: (name) => {
    if (name.includes('Gumm')) {
      return `Professional product photography of premium hemp gummy edibles. Colorful, translucent gummies in various shapes, professionally arranged. Clean white background, studio lighting, commercial edibles packaging style.`;
    } else if (name.includes('Chocolate')) {
      return `Professional product photography of premium hemp chocolate bar. Dark chocolate with clean scoring, elegant packaging visible. Clean white background, studio lighting, commercial edibles photography.`;
    } else {
      return `Professional product photography of premium hemp beverage bottle. Clear liquid, professional label design, condensation droplets. Clean white background, studio lighting, commercial product photography.`;
    }
  },
  
  accessories: (name) => {
    if (name.includes('Grinder')) {
      return `Professional product photography of premium 4-piece aluminum herb grinder. Matte black finish, precision machined, multiple chambers visible. Clean white background, studio lighting, commercial accessories photography.`;
    } else if (name.includes('Vaporizer')) {
      return `Professional product photography of sleek portable dry herb vaporizer. Modern design, digital display, charging cable included. Clean white background, studio lighting, commercial tech product photography.`;
    } else if (name.includes('Storage') || name.includes('Jar')) {
      return `Professional product photography of premium glass storage jars with airtight lids. Clear glass, UV protection, various sizes. Clean white background, studio lighting, commercial storage accessories.`;
    } else {
      return `Professional product photography of premium hemp accessories. High quality materials, professional finish, commercial dispensary accessories style. Clean white background, studio lighting.`;
    }
  },
  
  topicals: (name) => {
    if (name.includes('Cream') || name.includes('Lotion')) {
      return `Professional product photography of premium hemp topical cream jar. Clean white container, professional labeling, thick consistency visible. Clean white background, studio lighting, commercial cosmetics photography.`;
    } else if (name.includes('Balm')) {
      return `Professional product photography of hemp relief balm in small tin container. Natural ingredients, professional labeling, solid consistency. Clean white background, studio lighting, commercial topicals photography.`;
    } else {
      return `Professional product photography of hemp topical product. Professional packaging, clean design, commercial health and wellness product photography. Clean white background, studio lighting.`;
    }
  }
};

async function generateImage(prompt, filename) {
  try {
    console.log(`Generating image: ${filename}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    
    // Download and save the image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const imagePath = path.join(imagesDir, filename);
    fs.writeFileSync(imagePath, buffer);
    
    console.log(`✓ Saved: ${filename}`);
    return `@assets/generated_images/${filename}`;
    
  } catch (error) {
    console.error(`Error generating image ${filename}:`, error.message);
    return null;
  }
}

function extractStrainName(productName) {
  // Extract strain name from product names like "Purple Punch Hemp Flower" or "Blue Dream Pre-Roll"
  return productName
    .replace(/ Hemp Flower$/, '')
    .replace(/ Pre-Roll$/, '')
    .replace(/ Live Resin$/, '')
    .replace(/ Rosin$/, '')
    .replace(/ Wax$/, '')
    .trim();
}

function extractConcentrateType(productName) {
  if (productName.includes('Live Resin')) return 'Live Resin';
  if (productName.includes('Rosin')) return 'Rosin';
  if (productName.includes('Wax')) return 'Wax';
  return 'Live Resin';
}

function generateFilename(productName, category) {
  const cleanName = productName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
  
  const randomId = Math.random().toString(36).substring(2, 10);
  return `${cleanName}_${category}_${randomId}.png`;
}

async function generateAllProductImages() {
  console.log('🎨 Starting AI image generation for all products...');
  
  // Get all products from database
  const products = await sql`SELECT id, name, category, image_url FROM products ORDER BY category, name`;
  
  console.log(`Found ${products.length} products to generate images for`);
  
  let generatedCount = 0;
  const batchSize = 5; // Process in small batches to avoid rate limits
  
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)}`);
    
    const imagePromises = batch.map(async (product) => {
      // Check if product already has a generated image
      if (product.image_url && product.image_url.includes('@assets/generated_images/')) {
        console.log(`Skipping ${product.name} - already has generated image`);
        return null;
      }
      
      const strainName = extractStrainName(product.name);
      const concentrateType = extractConcentrateType(product.name);
      
      let prompt;
      switch (product.category) {
        case 'flower':
          prompt = imagePrompts.flower(product.name, strainName);
          break;
        case 'pre-rolls':
          prompt = imagePrompts['pre-rolls'](product.name, strainName);
          break;
        case 'concentrates':
          prompt = imagePrompts.concentrates(product.name, concentrateType);
          break;
        case 'edibles':
          prompt = imagePrompts.edibles(product.name);
          break;
        case 'accessories':
          prompt = imagePrompts.accessories(product.name);
          break;
        case 'topicals':
          prompt = imagePrompts.topicals(product.name);
          break;
        default:
          prompt = `Professional product photography of ${product.name}. Clean white background, studio lighting, commercial product photography.`;
      }
      
      const filename = generateFilename(product.name, product.category);
      const imagePath = await generateImage(prompt, filename);
      
      if (imagePath) {
        // Update product with new image path
        await sql`
          UPDATE products 
          SET image_url = ${imagePath}
          WHERE id = ${product.id}
        `;
        generatedCount++;
        return { product: product.name, image: imagePath };
      }
      
      return null;
    });
    
    await Promise.all(imagePromises);
    
    // Small delay between batches to respect rate limits
    if (i + batchSize < products.length) {
      console.log('Waiting 2 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n✅ Image generation complete!`);
  console.log(`Generated ${generatedCount} new product images`);
  console.log(`All products now have AI-generated images`);
  
  // Final summary
  const finalProducts = await sql`
    SELECT category, COUNT(*) as count
    FROM products 
    WHERE image_url LIKE '%@assets/generated_images/%'
    GROUP BY category
    ORDER BY count DESC
  `;
  
  console.log('\n📊 Products with AI-generated images:');
  finalProducts.forEach(row => {
    console.log(`${row.category}: ${row.count} products`);
  });
}

generateAllProductImages().catch(console.error);