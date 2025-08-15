#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];
const OUTPUT_DIR = 'client/public/optimized-images';

async function optimizeImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Optimizing: ${inputPath} (${metadata.width}x${metadata.height})`);
    
    // Create WebP version with optimal compression
    await image
      .webp({ 
        quality: 85, 
        effort: 6,
        lossless: false 
      })
      .resize(800, 600, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .toFile(outputPath.replace(extname(outputPath), '.webp'));
      
    // Create optimized JPEG fallback
    await image
      .jpeg({ 
        quality: 85, 
        progressive: true 
      })
      .resize(800, 600, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .toFile(outputPath.replace(extname(outputPath), '.jpg'));
      
    console.log(`✅ Optimized: ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputPath}:`, error.message);
  }
}

async function processDirectory(dir) {
  try {
    const files = await readdir(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const fileStat = await stat(filePath);
      
      if (fileStat.isDirectory()) {
        await processDirectory(filePath);
      } else if (SUPPORTED_FORMATS.includes(extname(file).toLowerCase())) {
        const outputPath = join(OUTPUT_DIR, file);
        await optimizeImage(filePath, outputPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message);
  }
}

// Start optimization
console.log('🚀 Starting image optimization for SEO...\n');

await processDirectory('client/src/assets');

console.log('\n✅ Image optimization complete! WebP and optimized JPEG versions created.');
console.log('💡 Update your img tags to use the optimized versions for better page speed scores.');