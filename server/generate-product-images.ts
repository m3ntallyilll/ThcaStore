import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Product image URL mappings for your exact inventory
export const productImageUrls = {
  // Pre-roll strains
  'sour-diesel-infused': '/attached_assets/generated_images/Sour_Diesel_preroll_joint_f03dfc66.png',
  'purple-koolaid-infused': '/attached_assets/generated_images/Purple_Koolaid_infused_flower_jar_30067145.png',
  'sour-lemon-diesel': '/attached_assets/generated_images/Sour_Diesel_preroll_joint_f03dfc66.png',
  'too-tall': '/attached_assets/generated_images/Sour_Diesel_preroll_joint_f03dfc66.png',
  'runtz': '/attached_assets/generated_images/Sour_Diesel_preroll_joint_f03dfc66.png',

  // Flower strains  
  'grape-popsicle': '/attached_assets/generated_images/Grape_Popsicle_flower_baggie_8d86f41d.png',
  'purple-koolaid-diamonds': '/attached_assets/generated_images/Purple_Koolaid_infused_flower_jar_30067145.png',
  'sour-diesel-flower': '/attached_assets/generated_images/Sour_Diesel_flower_container_02c12524.png',
  'blue-dream': '/attached_assets/generated_images/Blue_Dream_flower_jar_05b30a27.png',
  'green-crack': '/attached_assets/generated_images/Green_Crack_flower_baggie_7c187adb.png',
  'og-kush': '/attached_assets/generated_images/OG_Kush_flower_jar_6fb8e90e.png',
  'purple-punch': '/attached_assets/generated_images/Purple_Punch_flower_container_5eafd532.png',
  'sour-lemon-diesel-flower': '/attached_assets/generated_images/Sour_Diesel_flower_container_02c12524.png',
  'sour-diesel-popcorn': '/attached_assets/generated_images/Sour_Diesel_flower_container_02c12524.png',
  'wedding-cake': '/attached_assets/generated_images/Purple_Punch_flower_container_5eafd532.png',
  'girl-scout-cookies': '/attached_assets/generated_images/Green_Crack_flower_baggie_7c187adb.png',
  'runtz-peppermint': '/attached_assets/generated_images/Purple_Punch_flower_container_5eafd532.png',

  // Pre-roll packs
  'preroll-pack': '/attached_assets/generated_images/Hemp_flower_sample_baggie_e951c218.png',
  'preroll-multi-pack': '/attached_assets/BCO.ee170353-be48-42c8-8726-f48463cd7ffd_1754085146155.png',
  
  // Variety packs
  'variety-pack': '/attached_assets/generated_images/Hemp_flower_sample_baggie_e951c218.png'
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