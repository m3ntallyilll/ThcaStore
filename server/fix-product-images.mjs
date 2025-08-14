import { storage } from './database-storage.ts';

// Image mappings using existing generated images from attached_assets
const imageUrls = {
  // Flower strains - using existing generated images
  'grape-popsicle': '/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png',
  'purple-koolaid': '/attached_assets/generated_images/Purple_Koolaid_THCA_flower_a7e52253.png',
  'sour-diesel': '/attached_assets/generated_images/Sour_Diesel_THCA_flower_218b58ff.png',
  'sour-lemon-diesel': '/attached_assets/generated_images/Sour_Lemon_Diesel_flower_c1f2a950.png',
  'wedding-cake': '/attached_assets/generated_images/Wedding_Cake_strain_buds_b1c7b8d7.png',
  'girl-scout-cookies': '/attached_assets/generated_images/Girl_Scout_Cookies_strain_79b13530.png',
  'runtz': '/attached_assets/generated_images/Runtz_THCA_flower_22bdedde.png',
  'too-tall': '/attached_assets/generated_images/Too_Tall_THCA_flower_8b45913e.png',
  'blue-dream': '/attached_assets/generated_images/Blue_Dream_strain_465d3e5c.png',
  'og-kush': '/attached_assets/generated_images/OG_Kush_hemp_strain_970f7637.png',
  'white-widow': '/attached_assets/generated_images/White_Widow_hemp_strain_1f35747f.png',
  'gelato': '/attached_assets/generated_images/Gelato_strain_buds_a20df8c2.png',
  'northern-lights': '/attached_assets/generated_images/Northern_Lights_hemp_strain_f76fb796.png',
  'jack-herer': '/attached_assets/generated_images/Jack_Herer_hemp_strain_bae15f39.png',
  'green-crack': '/attached_assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png',
  'purple-punch': '/attached_assets/generated_images/Purple_Punch_hemp_strain_5a390f11.png',

  // Pre-rolls - using existing generated images
  'pre-roll': '/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png',
  'pre-roll-pack': '/attached_assets/generated_images/Preroll_pack_Android_photo_934b8710.png',
  'thca-pre-rolls': '/attached_assets/generated_images/THCA_hemp_pre-rolls_70e0ccf9.png',

  // Default fallbacks by category
  'flower': '/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png',
  'pre-rolls': '/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png'
};

function getImageUrl(product) {
  const name = product.name.toLowerCase();
  const category = product.category.toLowerCase();

  // Only process flower and pre-roll categories
  if (!['flower', 'pre-rolls'].includes(category)) {
    return null; // Skip non-flower/pre-roll products
  }

  // Check for specific strain names first
  for (const [strain, url] of Object.entries(imageUrls)) {
    if (name.includes(strain)) {
      return url;
    }
  }

  // Special handling for pre-roll packs
  if (category === 'pre-rolls') {
    if (name.includes('pack') || name.includes('variety')) {
      return imageUrls['pre-roll-pack'];
    }
    return imageUrls['pre-roll'];
  }

  // Fall back to category defaults
  return imageUrls[category] || imageUrls['flower'];
}

// Fix existing products with working image URLs
async function fixProductImages() {
  console.log('🖼️  FIXING FLOWER & PRE-ROLL PRODUCT IMAGES\n');

  try {
    // Only get flower and pre-roll products
    const products = await storage.getProducts({
      categories: ['flower', 'pre-rolls']
    });
    console.log(`Found ${products.length} flower/pre-roll products to fix`);

    let updatedCount = 0;

    for (const product of products) {
      try {
        const newImageUrl = getImageUrl(product);

        if (newImageUrl && product.imageUrl !== newImageUrl) {
          await storage.updateProduct(product.id, { imageUrl: newImageUrl });

          updatedCount++;
          console.log(`✅ Updated ${product.name}: ${newImageUrl}`);
        } else if (!newImageUrl) {
          console.log(`⏭️  Skipped ${product.name} - not flower/pre-roll category`);
        }

      } catch (error) {
        console.error(`❌ Failed to update ${product.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} flower/pre-roll products`);
    console.log('✅ All flower and pre-roll products now have generated image URLs');

  } catch (error) {
    console.error('💥 Failed to fix product images:', error);
  }
}

fixProductImages()
  .then(() => {
    console.log('🚀 Image fix complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fix failed:', error);
    process.exit(1);
  });