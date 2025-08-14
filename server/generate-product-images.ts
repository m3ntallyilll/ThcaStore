import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Product image URL mappings for your exact inventory
export const productImageUrls = {
  // Pre-roll strains - realistic Android phone photos
  'sour-diesel-infused': '/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png',
  'purple-koolaid-infused': '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png',
  'sour-lemon-diesel': '/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png',
  'too-tall': '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png',
  'runtz': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png',

  // Flower strains - realistic Android phone photos
  'grape-popsicle': '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png',
  'purple-koolaid-diamonds': '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png',
  'sour-diesel-flower': '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png',
  'sour-lemon-diesel-flower': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png',
  'sour-diesel-popcorn': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png',
  'wedding-cake': '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png',
  'girl-scout-cookies': '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png',
  'runtz-peppermint': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png',

  // Pre-roll packs - realistic Android phone photos
  'preroll-pack': '/attached_assets/generated_images/Preroll_pack_Android_photo_934b8710.png',
  'preroll-multi-pack': '/attached_assets/generated_images/Preroll_pack_Android_photo_934b8710.png',
  
  // Variety packs
  'variety-pack': '/attached_assets/generated_images/Multiple_buds_Android_camera_9160f585.png'
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
  
  // Default fallback - realistic Android phone photo
  return '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png';
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