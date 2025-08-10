import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Product image URL mappings for your exact inventory
export const productImageUrls = {
  // Pre-roll strains with embedded keywords
  'sour-diesel-infused': '/attached_assets/generated_images/Sour_Diesel_THCA_preroll_keyword_embedded.png',
  'purple-koolaid-infused': '/attached_assets/generated_images/Purple_Koolaid_THCA_preroll_keyword_embedded.png',
  'sour-lemon-diesel': '/attached_assets/generated_images/Sour_Lemon_Diesel_THCA_preroll_keyword_embedded.png',
  'too-tall': '/attached_assets/generated_images/Too_Tall_THCA_preroll_keyword_embedded.png',
  'runtz': '/attached_assets/generated_images/Runtz_THCA_preroll_keyword_embedded.png',

  // Flower strains with embedded keywords
  'grape-popsicle': '/attached_assets/generated_images/Grape_Popsicle_THCA_flower_keyword_embedded.png',
  'purple-koolaid-diamonds': '/attached_assets/generated_images/Purple_Koolaid_THCA_diamond_flower_keyword_embedded.png',
  'sour-diesel-flower': '/attached_assets/generated_images/Sour_Diesel_THCA_flower_keyword_embedded.png',
  'blue-dream': '/attached_assets/generated_images/Blue_Dream_THCA_flower_keyword_embedded.png',
  'green-crack': '/attached_assets/generated_images/Green_Crack_THCA_flower_keyword_embedded.png',
  'og-kush': '/attached_assets/generated_images/OG_Kush_THCA_flower_keyword_embedded.png',
  'purple-punch': '/attached_assets/generated_images/Purple_Punch_THCA_flower_keyword_embedded.png',
  'sour-lemon-diesel-flower': '/attached_assets/generated_images/Sour_Lemon_Diesel_THCA_flower_keyword_embedded.png',
  'sour-diesel-popcorn': '/attached_assets/generated_images/Sour_Diesel_Popcorn_THCA_flower_keyword_embedded.png',
  'wedding-cake': '/attached_assets/generated_images/Wedding_Cake_THCA_flower_keyword_embedded.png',
  'girl-scout-cookies': '/attached_assets/generated_images/Girl_Scout_Cookies_THCA_flower_keyword_embedded.png',
  'runtz-peppermint': '/attached_assets/generated_images/Runtz_Peppermint_THCA_flower_keyword_embedded.png',

  // Pre-roll packs with embedded keywords
  'preroll-pack': '/attached_assets/generated_images/THCA_preroll_pack_keyword_embedded.png',
  'preroll-multi-pack': '/attached_assets/generated_images/THCA_multi_preroll_pack_keyword_embedded.png',
  
  // Variety packs with embedded keywords
  'variety-pack': '/attached_assets/generated_images/THCA_variety_pack_keyword_embedded.png'
};

// Generate image URLs based on product name/category
export function getProductImageUrl(productName: string, category: string): string {
  const name = productName.toLowerCase();
  
  // Pre-rolls
  if (category === 'prerolls') {
    // Check for multi-packs (x4, x5, x6, x7, x8, x9, x10)
    if (name.includes('pack') && (name.includes('x4') || name.includes('x5') || name.includes('x6') || 
        name.includes('x7') || name.includes('x8') || name.includes('x9') || name.includes('x10') ||
        name.includes('4x') || name.includes('5x') || name.includes('6x') || 
        name.includes('7x') || name.includes('8x') || name.includes('9x') || name.includes('10x'))) {
      return productImageUrls['preroll-multi-pack'];
    }
    
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
    if (name.includes('blue dream')) return productImageUrls['blue-dream'];
    if (name.includes('green crack')) return productImageUrls['green-crack'];
    if (name.includes('og kush')) return productImageUrls['og-kush'];
    if (name.includes('purple punch')) return productImageUrls['purple-punch'];
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