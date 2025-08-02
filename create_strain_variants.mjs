#!/usr/bin/env node
// Create strain-based products with size variants

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const strains = [
  {
    name: 'Purple Punch',
    type: 'Indica',
    image: '@assets/generated_images/Purple_Punch_hemp_strain_5a390f11.png',
    description: 'A sweet and sedating indica strain with grape and berry flavors.',
    effects: ['Relaxed', 'Sleepy', 'Happy', 'Euphoric'],
    thca: '28.5'
  },
  {
    name: 'Blue Dream',
    type: 'Sativa',
    image: '@assets/generated_images/Blue_Dream_hemp_strain_ee2cf878.png',
    description: 'Popular sativa-dominant hybrid with sweet berry aroma and balanced effects.',
    effects: ['Happy', 'Euphoric', 'Relaxed', 'Creative'],
    thca: '24.2'
  },
  {
    name: 'OG Kush',
    type: 'Hybrid',
    image: '@assets/generated_images/OG_Kush_hemp_strain_970f7637.png',
    description: 'Legendary strain with complex aroma of fuel, skunk, and spice.',
    effects: ['Euphoric', 'Happy', 'Relaxed', 'Uplifted'],
    thca: '26.8'
  },
  {
    name: 'Northern Lights',
    type: 'Indica',
    image: '@assets/generated_images/Northern_Lights_hemp_strain_f76fb796.png',
    description: 'Classic indica known for its resinous buds and sweet spicy aroma.',
    effects: ['Relaxed', 'Sleepy', 'Happy', 'Euphoric'],
    thca: '22.1'
  },
  {
    name: 'Sour Diesel',
    type: 'Sativa',
    image: '@assets/generated_images/Sour_Diesel_hemp_strain_5ff2c237.png',
    description: 'Energizing sativa with pungent diesel aroma and uplifting effects.',
    effects: ['Energetic', 'Happy', 'Uplifted', 'Creative'],
    thca: '25.3'
  },
  {
    name: 'White Widow',
    type: 'Hybrid',
    image: '@assets/generated_images/White_Widow_hemp_strain_1f35747f.png',
    description: 'Balanced hybrid covered in white crystal resin with earthy flavors.',
    effects: ['Happy', 'Euphoric', 'Relaxed', 'Creative'],
    thca: '23.7'
  },
  {
    name: 'Jack Herer',
    type: 'Sativa',
    image: '@assets/generated_images/Jack_Herer_hemp_strain_bae15f39.png',
    description: 'Uplifting sativa with spicy pine scent and clear-headed effects.',
    effects: ['Happy', 'Uplifted', 'Creative', 'Energetic'],
    thca: '21.9'
  },
  {
    name: 'Green Crack',
    type: 'Sativa',
    image: '@assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png',
    description: 'Energizing sativa with sweet fruit flavors and mental buzz.',
    effects: ['Energetic', 'Happy', 'Uplifted', 'Focused'],
    thca: '24.8'
  },
  {
    name: 'Gelato',
    type: 'Hybrid',
    image: '@assets/generated_images/Gelato_hemp_strain_1a2aebbb.png',
    description: 'Sweet hybrid with dessert-like flavors and balanced effects.',
    effects: ['Happy', 'Relaxed', 'Euphoric', 'Creative'],
    thca: '27.2'
  },
  {
    name: 'Girl Scout Cookies',
    type: 'Hybrid',
    image: '@assets/generated_images/Girl_Scout_Cookies_strain_79b13530.png',
    description: 'Popular hybrid with sweet and earthy flavors and full-body effects.',
    effects: ['Happy', 'Euphoric', 'Relaxed', 'Creative'],
    thca: '26.4'
  }
];

// Flower size variants with authentic dispensary pricing
const flowerVariants = [
  { weight: '1g', basePrice: 12, name: 'Gram' },
  { weight: '3.5g', basePrice: 35, name: 'Eighth' },
  { weight: '7g', basePrice: 65, name: 'Quarter' },
  { weight: '14g', basePrice: 120, name: 'Half Ounce' },
  { weight: '28g', basePrice: 220, name: 'Ounce' }
];

// Pre-roll size variants
const prerollVariants = [
  { weight: '0.5g', basePrice: 8, name: 'Mini Pre-Roll' },
  { weight: '1g', basePrice: 12, name: 'Standard Pre-Roll' },
  { weight: '1.5g', basePrice: 18, name: 'King Size Pre-Roll' },
  { weight: '2g', basePrice: 24, name: 'Blunt' }
];

function createVariants(basePrice, variants, strain) {
  return variants.map((variant, index) => ({
    id: crypto.randomUUID(),
    weight: variant.weight,
    price: (basePrice * (variant.basePrice / variants[0].basePrice)).toFixed(2),
    stock: Math.floor(Math.random() * 50) + 20,
    isDefault: index === 1 // Make second variant (3.5g for flower, 1g for preroll) default
  }));
}

function calculatePriceRange(variants) {
  const prices = variants.map(v => parseFloat(v.price));
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

async function createStrainProducts() {
  console.log('🌿 Creating strain-based products with size variants...');
  
  const products = [];
  
  // Create flower products for each strain
  console.log('Creating flower products with variants...');
  for (const strain of strains) {
    const variants = createVariants(35, flowerVariants, strain); // Base price $35 for eighth
    const priceRange = calculatePriceRange(variants);
    
    const product = {
      id: crypto.randomUUID(),
      name: `${strain.name} Hemp Flower`,
      description: `${strain.description} Available in multiple sizes from gram to ounce.`,
      price: variants.find(v => v.isDefault).price,
      category: 'flower',
      imageUrl: strain.image,
      stock: Math.max(...variants.map(v => v.stock)),
      weight: variants.find(v => v.isDefault).weight,
      featured: Math.random() > 0.7,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      thcaContent: strain.thca,
      strainType: strain.type,
      effects: JSON.stringify(strain.effects),
      potency: strain.thca > 25 ? 'High' : strain.thca > 22 ? 'Medium' : 'Low',
      subcategory: 'Indoor',
      variants: JSON.stringify(variants),
      priceRange: JSON.stringify(priceRange),
      createdAt: new Date().toISOString()
    };
    
    products.push(product);
  }
  
  // Create pre-roll products for each strain
  console.log('Creating pre-roll products with variants...');
  for (const strain of strains) {
    const variants = createVariants(12, prerollVariants, strain); // Base price $12 for 1g
    const priceRange = calculatePriceRange(variants);
    
    const product = {
      id: crypto.randomUUID(),
      name: `${strain.name} Pre-Roll`,
      description: `Hand-rolled pre-rolls featuring ${strain.name} hemp flower. ${strain.description}`,
      price: variants.find(v => v.isDefault).price,
      category: 'pre-rolls',
      imageUrl: strain.image,
      stock: Math.max(...variants.map(v => v.stock)),
      weight: variants.find(v => v.isDefault).weight,
      featured: Math.random() > 0.8,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      thcaContent: strain.thca,
      strainType: strain.type,
      effects: JSON.stringify(strain.effects),
      potency: strain.thca > 25 ? 'High' : strain.thca > 22 ? 'Medium' : 'Low',
      subcategory: 'Single',
      variants: JSON.stringify(variants),
      priceRange: JSON.stringify(priceRange),
      createdAt: new Date().toISOString()
    };
    
    products.push(product);
  }
  
  // Add some concentrate products
  console.log('Creating concentrate products...');
  const concentrateTypes = ['Live Resin', 'Rosin', 'Wax', 'Diamonds'];
  for (let i = 0; i < 20; i++) {
    const strain = strains[i % strains.length];
    const type = concentrateTypes[i % concentrateTypes.length];
    const basePrice = Math.random() * 30 + 40; // $40-70
    
    const variants = [
      { id: crypto.randomUUID(), weight: '0.5g', price: (basePrice * 0.6).toFixed(2), stock: Math.floor(Math.random() * 20) + 10, isDefault: false },
      { id: crypto.randomUUID(), weight: '1g', price: basePrice.toFixed(2), stock: Math.floor(Math.random() * 25) + 15, isDefault: true },
      { id: crypto.randomUUID(), weight: '2g', price: (basePrice * 1.8).toFixed(2), stock: Math.floor(Math.random() * 15) + 8, isDefault: false }
    ];
    
    const priceRange = calculatePriceRange(variants);
    
    const product = {
      id: crypto.randomUUID(),
      name: `${strain.name} ${type}`,
      description: `Premium ${type.toLowerCase()} extracted from ${strain.name} hemp flower. ${strain.description}`,
      price: variants.find(v => v.isDefault).price,
      category: 'concentrates',
      imageUrl: '@assets/generated_images/Hemp_live_resin_51ce0e4a.png',
      stock: Math.max(...variants.map(v => v.stock)),
      weight: variants.find(v => v.isDefault).weight,
      featured: Math.random() > 0.85,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      thcaContent: (parseFloat(strain.thca) * 1.5).toFixed(1), // Concentrates are stronger
      strainType: strain.type,
      effects: JSON.stringify(strain.effects),
      potency: 'High',
      subcategory: type,
      variants: JSON.stringify(variants),
      priceRange: JSON.stringify(priceRange),
      createdAt: new Date().toISOString()
    };
    
    products.push(product);
  }
  
  // Add edibles, accessories, and topicals (without variants for simplicity)
  console.log('Creating other product categories...');
  
  // Edibles
  const edibles = [
    { name: 'Mixed Berry Gummies - 10mg', price: 25, weight: '10mg', image: '@assets/generated_images/Hemp_gummy_edibles_4f465d60.png' },
    { name: 'Chocolate Bar - 100mg', price: 45, weight: '100mg', image: '@assets/generated_images/Hemp_chocolate_edibles_8409225e.png' },
    { name: 'Tropical Gummies - 25mg', price: 35, weight: '25mg', image: '@assets/generated_images/Hemp_gummy_edibles_4f465d60.png' },
    { name: 'Dark Chocolate Bites - 50mg', price: 32, weight: '50mg', image: '@assets/generated_images/Hemp_chocolate_edibles_8409225e.png' },
    { name: 'Sour Gummy Worms - 20mg', price: 28, weight: '20mg', image: '@assets/generated_images/Hemp_gummy_edibles_4f465d60.png' }
  ];
  
  edibles.forEach(edible => {
    products.push({
      id: crypto.randomUUID(),
      name: edible.name,
      description: `Delicious hemp-infused ${edible.name.toLowerCase()} with precise dosing and consistent effects.`,
      price: edible.price.toFixed(2),
      category: 'edibles',
      imageUrl: edible.image,
      stock: Math.floor(Math.random() * 30) + 20,
      weight: edible.weight,
      featured: Math.random() > 0.8,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      thcaContent: null,
      strainType: null,
      effects: JSON.stringify(['Relaxed', 'Happy', 'Euphoric']),
      potency: 'Medium',
      subcategory: 'Gummies',
      variants: null,
      priceRange: null,
      createdAt: new Date().toISOString()
    });
  });
  
  // Accessories
  const accessories = [
    { name: 'Premium Herb Grinder', price: 45, description: 'Professional 4-piece aluminum grinder with kief catcher.' },
    { name: 'Hemp Vaporizer Kit', price: 125, description: 'Complete vaporizer kit for dry herbs and concentrates.' },
    { name: 'Glass Storage Jars Set', price: 28, description: 'UV-resistant glass jars with airtight seals.' },
    { name: 'Rolling Paper Bundle', price: 15, description: 'Premium hemp rolling papers with tips and lighter.' },
    { name: 'Concentrate Tool Kit', price: 35, description: 'Professional dab tools and silicone containers.' }
  ];
  
  accessories.forEach(accessory => {
    products.push({
      id: crypto.randomUUID(),
      name: accessory.name,
      description: accessory.description,
      price: accessory.price.toFixed(2),
      category: 'accessories',
      imageUrl: '@assets/generated_images/Premium_herb_grinder_c4439ae7.png',
      stock: Math.floor(Math.random() * 25) + 15,
      weight: 'N/A',
      featured: Math.random() > 0.85,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      thcaContent: null,
      strainType: null,
      effects: null,
      potency: null,
      subcategory: 'Tools',
      variants: null,
      priceRange: null,
      createdAt: new Date().toISOString()
    });
  });
  
  console.log(`\n📊 Product Summary:`);
  console.log(`Total Products: ${products.length}`);
  console.log(`Flower (with variants): ${products.filter(p => p.category === 'flower').length}`);
  console.log(`Pre-rolls (with variants): ${products.filter(p => p.category === 'pre-rolls').length}`);
  console.log(`Concentrates: ${products.filter(p => p.category === 'concentrates').length}`);
  console.log(`Edibles: ${products.filter(p => p.category === 'edibles').length}`);
  console.log(`Accessories: ${products.filter(p => p.category === 'accessories').length}`);
  
  // Insert products into database
  console.log('\n💾 Inserting products with variants...');
  for (const product of products) {
    await sql`
      INSERT INTO products (
        id, name, description, price, category, image_url, stock, weight,
        featured, rating, thca_content, strain_type, effects,
        potency, subcategory, variants, price_range, created_at
      ) VALUES (
        ${product.id}, ${product.name}, ${product.description}, ${product.price},
        ${product.category}, ${product.imageUrl}, ${product.stock}, ${product.weight},
        ${product.featured}, ${product.rating}, ${product.thcaContent}, ${product.strainType},
        ${product.effects}, ${product.potency}, ${product.subcategory}, 
        ${product.variants}, ${product.priceRange}, ${product.createdAt}
      )
    `;
  }
  
  console.log('✅ Strain-based product catalog with variants created!');
  console.log(`Each strain now available in multiple sizes with variant selection.`);
}

createStrainProducts().catch(console.error);