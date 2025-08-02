#!/usr/bin/env node
// Create a balanced product catalog of 100 items

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const strainImages = {
  'Purple Punch': '@assets/generated_images/Purple_Punch_hemp_strain_5a390f11.png',
  'Blue Dream': '@assets/generated_images/Blue_Dream_hemp_strain_ee2cf878.png',
  'OG Kush': '@assets/generated_images/OG_Kush_hemp_strain_970f7637.png',
  'Northern Lights': '@assets/generated_images/Northern_Lights_hemp_strain_f76fb796.png',
  'Sour Diesel': '@assets/generated_images/Sour_Diesel_hemp_strain_5ff2c237.png',
  'White Widow': '@assets/generated_images/White_Widow_hemp_strain_1f35747f.png',
  'Jack Herer': '@assets/generated_images/Jack_Herer_hemp_strain_bae15f39.png',
  'Green Crack': '@assets/generated_images/Green_Crack_hemp_strain_d16ab8e0.png',
  'Gelato': '@assets/generated_images/Gelato_hemp_strain_1a2aebbb.png',
  'Girl Scout Cookies': '@assets/generated_images/Girl_Scout_Cookies_strain_79b13530.png'
};

const categoryImages = {
  'flower': '@assets/generated_images/Premium_hemp_flower_buds_568629db.png',
  'pre-rolls': '@assets/generated_images/Hemp_pre-roll_joints_e0e992fe.png',
  'concentrates': '@assets/generated_images/Hemp_live_resin_51ce0e4a.png',
  'edibles': '@assets/generated_images/Hemp_gummy_edibles_4f465d60.png',
  'accessories': '@assets/generated_images/Premium_herb_grinder_c4439ae7.png',
  'topicals': '@assets/generated_images/Hemp_topical_cream_afa2ae1c.png'
};

function getStrainImage(productName) {
  for (const [strain, image] of Object.entries(strainImages)) {
    if (productName.toLowerCase().includes(strain.toLowerCase())) {
      return image;
    }
  }
  return null;
}

function generateProduct(category, name, price, weight, description, strainType = null) {
  const id = crypto.randomUUID();
  const imageUrl = getStrainImage(name) || categoryImages[category];
  
  return {
    id,
    name,
    description,
    price: price.toFixed(2),
    category,
    imageUrl,
    stock: Math.floor(Math.random() * 50) + 10,
    weight,
    featured: Math.random() > 0.8,
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
    thcaContent: category === 'flower' || category === 'pre-rolls' ? 
      (Math.random() * 20 + 15).toFixed(1) : null, // 15-35%
    strainType,
    effects: getRandomEffects(),
    flavorProfile: getRandomFlavors(),
    potency: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    subcategory: getSubcategory(category),
    createdAt: new Date().toISOString()
  };
}

function getRandomEffects() {
  const effects = ['Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Creative', 'Focused', 'Energetic', 'Sleepy', 'Hungry', 'Talkative'];
  return effects.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2);
}

function getRandomFlavors() {
  const flavors = ['Citrus', 'Pine', 'Berry', 'Diesel', 'Sweet', 'Earthy', 'Fruity', 'Spicy', 'Floral', 'Woody'];
  return flavors.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
}

function getSubcategory(category) {
  const subcategories = {
    'flower': ['Indoor', 'Outdoor', 'Greenhouse'],
    'pre-rolls': ['Single', 'Multi-pack', 'Infused'],
    'concentrates': ['Live Resin', 'Rosin', 'Wax', 'Diamonds'],
    'edibles': ['Gummies', 'Chocolate', 'Beverages'],
    'accessories': ['Grinders', 'Vaporizers', 'Storage'],
    'topicals': ['Creams', 'Balms', 'Lotions']
  };
  const options = subcategories[category] || [];
  return options[Math.floor(Math.random() * options.length)];
}

async function createBalancedCatalog() {
  console.log('🌿 Creating balanced hemp product catalog...');
  
  const products = [];
  const strains = Object.keys(strainImages);
  
  // FLOWER PRODUCTS (25 items)
  console.log('Creating flower products...');
  const flowerWeights = ['1g', '3.5g', '7g', '14g', '28g'];
  const flowerPrices = { '1g': [8, 15], '3.5g': [25, 45], '7g': [45, 85], '14g': [85, 160], '28g': [160, 320] };
  
  strains.forEach((strain, i) => {
    flowerWeights.forEach(weight => {
      const [minPrice, maxPrice] = flowerPrices[weight];
      const price = Math.random() * (maxPrice - minPrice) + minPrice;
      const strainType = i < 5 ? 'Indica' : 'Sativa';
      
      products.push(generateProduct(
        'flower',
        `${strain} Hemp Flower - ${weight}`,
        price,
        weight,
        `Premium ${strainType.toLowerCase()} hemp flower with rich ${strain.toLowerCase()} genetics. Lab-tested for purity and potency.`,
        strainType
      ));
    });
  });
  
  // Limit to 25 flower products
  products.splice(25);
  
  // PRE-ROLLS (30 items)
  console.log('Creating pre-roll products...');
  const prerollWeights = ['1.1g', '1.25g', '1.45g', '1.5g'];
  const prerollPrices = { '1.1g': [6, 12], '1.25g': [7, 14], '1.45g': [8, 16], '1.5g': [9, 18] };
  
  let prerollCount = 0;
  strains.forEach(strain => {
    prerollWeights.forEach(weight => {
      if (prerollCount >= 30) return;
      const [minPrice, maxPrice] = prerollPrices[weight];
      const price = Math.random() * (maxPrice - minPrice) + minPrice;
      
      products.push(generateProduct(
        'pre-rolls',
        `${strain} Premium Pre-Roll - ${weight}`,
        price,
        weight,
        `Hand-rolled premium pre-roll featuring ${strain} hemp flower. Perfect for on-the-go consumption.`
      ));
      prerollCount++;
    });
  });
  
  // CONCENTRATES (20 items)
  console.log('Creating concentrate products...');
  const concentrateTypes = ['Live Resin', 'Rosin', 'Wax', 'Diamonds', 'Shatter'];
  const concentrateWeights = ['0.5g', '1g', '2g', '3.5g'];
  const concentratePrices = { '0.5g': [25, 45], '1g': [45, 85], '2g': [85, 160], '3.5g': [150, 280] };
  
  let concentrateCount = 0;
  concentrateTypes.forEach(type => {
    strains.slice(0, 4).forEach(strain => {
      if (concentrateCount >= 20) return;
      const weight = concentrateWeights[Math.floor(Math.random() * concentrateWeights.length)];
      const [minPrice, maxPrice] = concentratePrices[weight];
      const price = Math.random() * (maxPrice - minPrice) + minPrice;
      
      products.push(generateProduct(
        'concentrates',
        `${strain} ${type} - ${weight}`,
        price,
        weight,
        `Premium ${type.toLowerCase()} concentrate extracted from ${strain} hemp flower. High potency and exceptional flavor.`
      ));
      concentrateCount++;
    });
  });
  
  // EDIBLES (15 items)
  console.log('Creating edible products...');
  const edibleTypes = [
    { name: 'Gummies', doses: ['10mg', '25mg', '50mg'], prices: [15, 35, 65] },
    { name: 'Chocolate', doses: ['20mg', '40mg', '100mg'], prices: [20, 45, 95] },
    { name: 'Beverages', doses: ['5mg', '10mg', '25mg'], prices: [8, 15, 28] }
  ];
  
  let edibleCount = 0;
  edibleTypes.forEach(type => {
    strains.slice(0, 5).forEach(strain => {
      if (edibleCount >= 15) return;
      const doseIndex = Math.floor(Math.random() * type.doses.length);
      const dose = type.doses[doseIndex];
      const price = type.prices[doseIndex] + (Math.random() * 10 - 5);
      
      products.push(generateProduct(
        'edibles',
        `${strain} ${type.name} - ${dose}`,
        Math.max(price, 5),
        dose,
        `Delicious ${type.name.toLowerCase()} infused with ${strain} hemp extract. Precisely dosed for consistent effects.`
      ));
      edibleCount++;
    });
  });
  
  // ACCESSORIES (7 items)
  console.log('Creating accessory products...');
  const accessories = [
    { name: 'Premium Herb Grinder', price: [25, 65], description: 'Professional-grade aluminum grinder with multiple chambers.' },
    { name: 'Hemp Vaporizer Kit', price: [85, 185], description: 'Complete vaporizer kit for hemp flower and concentrates.' },
    { name: 'Airtight Storage Jar', price: [15, 35], description: 'UV-resistant glass storage container with airtight seal.' },
    { name: 'Rolling Papers Pack', price: [5, 12], description: 'Premium hemp rolling papers, slow-burning and natural.' },
    { name: 'Concentrate Tool Set', price: [20, 45], description: 'Professional dab tools for handling concentrates safely.' },
    { name: 'Digital Scale', price: [35, 75], description: 'Precision digital scale for accurate measurements.' },
    { name: 'Smell-Proof Bag', price: [18, 38], description: 'Discreet storage bag with odor-blocking technology.' }
  ];
  
  accessories.forEach(item => {
    const price = Math.random() * (item.price[1] - item.price[0]) + item.price[0];
    products.push(generateProduct(
      'accessories',
      item.name,
      price,
      'N/A',
      item.description
    ));
  });
  
  // TOPICALS (3 items)  
  console.log('Creating topical products...');
  const topicals = [
    { name: 'Hemp Relief Cream', price: [28, 48], description: 'Soothing topical cream with hemp extract and natural ingredients.' },
    { name: 'Hemp Body Balm', price: [22, 42], description: 'Moisturizing balm infused with hemp extract and essential oils.' },
    { name: 'Hemp Roll-On', price: [18, 32], description: 'Convenient roll-on applicator with hemp extract for targeted relief.' }
  ];
  
  topicals.forEach(item => {
    const price = Math.random() * (item.price[1] - item.price[0]) + item.price[0];
    products.push(generateProduct(
      'topicals',
      item.name,
      price,
      '30ml',
      item.description
    ));
  });
  
  console.log(`\n📊 Catalog Summary:`);
  console.log(`Total Products: ${products.length}`);
  console.log(`Flower: ${products.filter(p => p.category === 'flower').length}`);
  console.log(`Pre-rolls: ${products.filter(p => p.category === 'pre-rolls').length}`);
  console.log(`Concentrates: ${products.filter(p => p.category === 'concentrates').length}`);
  console.log(`Edibles: ${products.filter(p => p.category === 'edibles').length}`);
  console.log(`Accessories: ${products.filter(p => p.category === 'accessories').length}`);
  console.log(`Topicals: ${products.filter(p => p.category === 'topicals').length}`);
  
  // Insert products into database
  console.log('\n💾 Inserting products into database...');
  for (const product of products) {
    await sql`
      INSERT INTO products (
        id, name, description, price, category, image_url, stock, weight,
        featured, rating, thca_content, strain_type, effects,
        potency, subcategory, created_at
      ) VALUES (
        ${product.id}, ${product.name}, ${product.description}, ${product.price},
        ${product.category}, ${product.imageUrl}, ${product.stock}, ${product.weight},
        ${product.featured}, ${product.rating}, ${product.thcaContent}, ${product.strainType},
        ${JSON.stringify(product.effects)},
        ${product.potency}, ${product.subcategory}, ${product.createdAt}
      )
    `;
  }
  
  console.log('✅ Balanced product catalog created successfully!');
  console.log(`Created ${products.length} products across 6 categories with authentic strain-specific images.`);
}

createBalancedCatalog().catch(console.error);