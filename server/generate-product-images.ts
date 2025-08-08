import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Product image URL mappings for your exact inventory
export const productImageUrls = {
  // Pre-roll strains
  'sour-diesel-infused': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format',
  'purple-koolaid-infused': 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format',
  'sour-lemon-diesel': 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format',
  'too-tall': 'https://images.unsplash.com/photo-1585288766827-c1a1bb3c6b0e?w=400&h=400&fit=crop&auto=format',
  'runtz': 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format',

  // Flower strains  
  'grape-popsicle': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format',
  'purple-koolaid-diamonds': 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format',
  'sour-diesel-flower': 'https://images.unsplash.com/photo-1585288766827-c1a1bb3c6b0e?w=400&h=400&fit=crop&auto=format',
  'sour-lemon-diesel-flower': 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format',
  'sour-diesel-popcorn': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format',
  'wedding-cake': 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format',
  'girl-scout-cookies': 'https://images.unsplash.com/photo-1585288766827-c1a1bb3c6b0e?w=400&h=400&fit=crop&auto=format',
  'runtz-peppermint': 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format',

  // Pre-roll packs
  'preroll-pack': '/attached_assets/generated_images/attached_assets/generated_images/Hemp_pre-roll_variety_pack_7d836cbe.png',
  
  // Variety packs
  'variety-pack': 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format'
};

// Generate image URLs based on product name/category
export function getProductImageUrl(productName: string, category: string): string {
  const name = productName.toLowerCase();
  
  // Pre-rolls
  if (category === 'prerolls') {
    if (name.includes('sour diesel infused')) return productImageUrls['sour-diesel-infused'];
    if (name.includes('purple koolaid infused')) return productImageUrls['purple-koolaid-infused'];
    if (name.includes('sour lemon diesel')) return productImageUrls['sour-lemon-diesel'];
    if (name.includes('too tall')) return productImageUrls['too-tall'];
    if (name.includes('runtz')) return productImageUrls['runtz'];
    if (name.includes('pack')) return productImageUrls['preroll-pack'];
  }
  
  // Flower
  if (category === 'flower') {
    if (name.includes('grape popsicle')) return productImageUrls['grape-popsicle'];
    if (name.includes('purple koolaid')) return productImageUrls['purple-koolaid-diamonds'];
    if (name.includes('sour diesel') && name.includes('popcorn')) return productImageUrls['sour-diesel-popcorn'];
    if (name.includes('sour diesel')) return productImageUrls['sour-diesel-flower'];
    if (name.includes('sour lemon diesel')) return productImageUrls['sour-lemon-diesel-flower'];
    if (name.includes('wedding cake')) return productImageUrls['wedding-cake'];
    if (name.includes('girl scout cookies')) return productImageUrls['girl-scout-cookies'];
    if (name.includes('runtz')) return productImageUrls['runtz-peppermint'];
  }
  
  // Variety packs
  if (category === 'variety-packs') {
    return productImageUrls['variety-pack'];
  }
  
  // Default fallback
  return productImageUrls['sour-diesel-infused'];
}

// Create image endpoint list for user
export function generateImageEndpointList(): string[] {
  const endpoints: string[] = [];
  
  Object.entries(productImageUrls).forEach(([key, url]) => {
    endpoints.push(`${key}: ${url}`);
  });
  
  return endpoints;
}

// Save endpoints to file for easy access
export function saveImageEndpoints() {
  const endpoints = generateImageEndpointList();
  const content = `# Product Image Endpoints\n\n${endpoints.join('\n')}\n\n## Usage\nThese URLs can be used directly in your product catalog for professional hemp/THCA product images.\n`;
  
  if (!existsSync('image-endpoints')) {
    mkdirSync('image-endpoints');
  }
  
  writeFileSync(join('image-endpoints', 'product-images.md'), content);
  console.log('Image endpoints saved to image-endpoints/product-images.md');
  
  return endpoints;
}

// Run if called directly
if (require.main === module) {
  const endpoints = saveImageEndpoints();
  console.log('Generated image endpoints:');
  endpoints.forEach(endpoint => console.log(`  ${endpoint}`));
}