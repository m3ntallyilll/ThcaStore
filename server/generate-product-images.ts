import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Product image URL mappings - Updated to use more realistic low-grain quality images
export const productImageUrls = {
  // Pre-roll strains - realistic low-grain Android camera quality
  'sour-diesel-infused': '/attached_assets/generated_images/Hemp_pre-roll_joints_e0e992fe.png',
  'purple-koolaid-infused': '/attached_assets/generated_images/THCA_hemp_pre-rolls_56c5fd30.png',
  'sour-lemon-diesel': '/attached_assets/generated_images/THCA_hemp_pre-rolls_70e0ccf9.png',
  'too-tall': '/attached_assets/generated_images/Premium_hemp_flower_buds_568629db.png',
  'runtz': '/attached_assets/generated_images/Runtz_strain_close-up_a6f9eea1.png',

  // Flower strains - realistic low-grain Android camera quality
  'grape-popsicle': '/attached_assets/generated_images/Premium_hemp_flower_ee290031.png',
  'purple-koolaid-diamonds': '/attached_assets/generated_images/Purple_Koolaid_strain_buds_682334e7.png',
  'sour-diesel-flower': '/attached_assets/generated_images/Sour_Diesel_hemp_strain_5ff2c237.png',
  'blue-dream': '/attached_assets/generated_images/Blue_Dream_hemp_strain_ee2cf878.png',
  'green-crack': '/attached_assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png',
  'og-kush': '/attached_assets/generated_images/OG_Kush_hemp_strain_970f7637.png',
  'purple-punch': '/attached_assets/generated_images/Purple_Punch_hemp_strain_5a390f11.png',
  'sour-lemon-diesel-flower': '/attached_assets/generated_images/Sour_Lemon_Diesel_flower_c1f2a950.png',
  'sour-diesel-popcorn': '/attached_assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png',
  'wedding-cake': '/attached_assets/generated_images/Wedding_Cake_strain_buds_b1c7b8d7.png',
  'girl-scout-cookies': '/attached_assets/generated_images/Girl_Scout_Cookies_strain_a5a5b84e.png',
  'runtz-peppermint': '/attached_assets/generated_images/Runtz_THCA_flower_22bdedde.png',
  'gelato': '/attached_assets/generated_images/Gelato_hemp_strain_1a2aebbb.png',
  'granddaddy-purple': '/attached_assets/generated_images/Purple_Punch_strain_cb63660e.png',

  // Additional strains with realistic hemp quality
  'northern-lights': '/attached_assets/generated_images/Northern_Lights_hemp_strain_f76fb796.png',
  'jack-herer': '/attached_assets/generated_images/Jack_Herer_hemp_strain_bae15f39.png',
  'white-widow': '/attached_assets/generated_images/White_Widow_hemp_strain_1f35747f.png',
  'indica-strain': '/attached_assets/generated_images/Indica_hemp_flower_d4c0d165.png',
  'sativa-strain': '/attached_assets/generated_images/Sativa_hemp_flower_61fa5cdb.png',

  // Pre-roll packs - realistic low-grain quality
  'preroll-pack': '/attached_assets/generated_images/Hemp_pre-roll_joints_e0e992fe.png',
  'preroll-multi-pack': '/attached_assets/generated_images/THCA_hemp_pre-rolls_56c5fd30.png',
  
  // Variety packs - realistic low-grain quality
  'variety-pack': '/attached_assets/generated_images/Hemp_product_variety_showcase_667244b5.png',
  'starter-pack': '/attached_assets/generated_images/Hemp_starter_product_pack_c3d6c659.png',

  // Concentrates and extracts
  'diamond-concentrates': '/attached_assets/generated_images/THCA_diamond_concentrates_93d26771.png',
  'live-resin': '/attached_assets/generated_images/Hemp_live_resin_51ce0e4a.png',
  'rosin': '/attached_assets/generated_images/Hemp_rosin_concentrate_9d2bcb2d.png',
  'wax-concentrate': '/attached_assets/generated_images/Hemp_wax_concentrate_1309cfeb.png'
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