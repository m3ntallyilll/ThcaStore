import Groq from 'groq-sdk';
import { storage } from './database-storage';
import type { InsertProduct } from '@shared/schema';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

interface BulkProductRequest {
  productType: 'pre-roll' | 'flower';
  strainType: 'indica' | 'sativa' | 'hybrid';
  count: number;
  priceRange: { min: number; max: number };
  thcRange: { min: number; max: number };
  includeDeals?: boolean;
  includePackages?: boolean;
  preRollWeight?: '1.1g' | '1.25g' | '1.45g';
  isInfused?: boolean;
}

interface StrainTemplate {
  name: string;
  type: 'indica' | 'sativa' | 'hybrid';
  genetics: string;
  effects: string[];
  flavors: string[];
  thcContent: number;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: 'legendary' | 'popular' | 'rising' | 'boutique';
}

export class BulkProductGenerator {
  
  // Premium high-mid tier strain genetics database
  private readonly premiumStrains = {
    indica: [
      'Granddaddy Purple', 'Purple Punch', 'Northern Lights', 'Bubba Kush', 'GDP',
      'Afghan Kush', 'Hindu Kush', 'Blueberry Kush', 'Critical Kush', 'Master Kush',
      'OG Kush', 'Skywalker OG', 'Tahoe OG', 'Fire OG', 'SFV OG',
      'Gelato #33', 'Wedding Cake', 'Do-Si-Dos', 'Purple Urkle', 'Grape Ape',
      'LA Confidential', 'Blackberry Kush', 'God\'s Gift', 'Pink Kush', 'Death Star',
      'Kosher Kush', 'Platinum Kush', 'Forbidden Fruit', 'Zkittlez', 'Sunset Sherbet',
      'Ice Cream Cake', 'Slurricane', 'Purple Sunset', 'Vanilla Kush', 'Cherry Pie',
      'Strawberry Banana', 'Gorilla Glue #4', 'Girl Scout Cookies', 'Sherbet', 'Gelato #41'
    ],
    sativa: [
      'Green Crack', 'Sour Diesel', 'Jack Herer', 'Durban Poison', 'Super Silver Haze',
      'Tangie', 'Blue Dream', 'Pineapple Express', 'Strawberry Cough', 'Maui Wowie',
      'Hawaiian Snow', 'Amnesia Haze', 'Ghost Train Haze', 'Lemon Haze', 'Silver Haze',
      'Trainwreck', 'White Widow', 'AK-47', 'Diesel', 'Chemdawg',
      'Mimosa', 'Tropicana Cookies', 'Clementine', 'Orange Creamsicle', 'Citrus Farmer',
      'Lemon Tree', 'Lemonnade', 'Tangie Dream', 'Sunrise', 'Morning Glory',
      'Cerebral Storm', 'Electric Lemonade', 'Pineapple Upside Down Cake', 'Tropical Punch', 'Island Sweet Skunk',
      'Acapulco Gold', 'Panama Red', 'Colombian Gold', 'Thai Stick', 'Red Congolese'
    ],
    hybrid: [
      'Gelato', 'Wedding Cake', 'Girl Scout Cookies', 'Blue Dream', 'OG Kush',
      'White Widow', 'Gorilla Glue #4', 'Zkittlez', 'Runtz', 'Cookies & Cream',
      'Sunset Sherbet', 'Purple Punch', 'Dosidos', 'Banana Split', 'Strawberry Shortcake',
      'Apple Fritter', 'Biscotti', 'Cereal Milk', 'Ice Cream Cake', 'Wedding Crasher',
      'Pink Runtz', 'White Runtz', 'Rainbow Belts', 'Jealousy', 'Permanent Marker',
      'Gushers', 'Candy Rain', 'Lava Cake', 'London Pound Cake', 'Jungle Boys',
      'MAC (Miracle Alien Cookies)', 'Fatso', 'Gary Payton', 'Pancakes', 'French Toast'
    ]
  };

  async generateBulkProducts(request: BulkProductRequest): Promise<InsertProduct[]> {
    if (!groq) {
      throw new Error('Groq AI service not configured. Please check GROQ_API_KEY environment variable.');
    }

    console.log(`🚀 Starting bulk generation of ${request.count} ${request.productType} products (${request.strainType})...`);
    
    try {
      const strainPool = this.premiumStrains[request.strainType];
      const batchSize = 10; // Process 10 products at a time
      const results: InsertProduct[] = [];
      
      for (let i = 0; i < request.count; i += batchSize) {
        const batchCount = Math.min(batchSize, request.count - i);
        console.log(`📝 Generating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(request.count/batchSize)}...`);
        
        const batchPromises = Array.from({ length: batchCount }, (_, index) => {
          const strainName = strainPool[Math.floor(Math.random() * strainPool.length)];
          return this.generateSingleProduct(strainName, request, i + index + 1);
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Small delay between batches to respect rate limits
        if (i + batchSize < request.count) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      console.log(`✅ Successfully generated ${results.length} products`);
      return results;
      
    } catch (error: any) {
      console.error('Bulk product generation error:', error);
      throw new Error('Failed to generate bulk products. Please try again with fewer products or check your API limits.');
    }
  }

  private async generateSingleProduct(
    strainName: string, 
    request: BulkProductRequest, 
    sequence: number
  ): Promise<InsertProduct> {
    if (!groq) {
      throw new Error('Groq AI service not configured.');
    }

    const weight = request.preRollWeight || '1.1g';
    const isInfused = request.isInfused || false;
    const productTypeName = isInfused ? 'infused pre-roll' : request.productType;

    const prompt = `Create premium THCA ${productTypeName} for ${strainName} strain.

Product: ${weight} ${productTypeName}${isInfused ? ' (THC-A infused)' : ''}
Strain: ${strainName} (${request.strainType})
Price: $${request.priceRange.min}-${request.priceRange.max}
THC: ${request.thcRange.min}-${request.thcRange.max}%

Return JSON:
{
  "name": "Short product name",
  "description": "Brief description (50 words max)",
  "price": ${request.priceRange.min + Math.floor(Math.random() * (request.priceRange.max - request.priceRange.min))},
  "thcContent": ${request.thcRange.min + Math.floor(Math.random() * (request.thcRange.max - request.thcRange.min))},
  "effects": ["${this.getDefaultEffects(request.strainType).slice(0, 3).join('", "')}"],
  "flavors": ["${this.getDefaultFlavors(strainName).slice(0, 2).join('", "')}"]
}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // the newest model is "llama-3.3-70b-versatile" which was released December 2024
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500
    });

    const content = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    // Calculate quantities based on product type
    const quantity = this.calculateQuantity(request.productType, request.strainType);
    const productWeight = this.calculateWeight(request.productType, request.preRollWeight);

    const productName = request.isInfused ? 
      `${productWeight} ${strainName} Infused Pre-Roll` : 
      `${productWeight} ${strainName} ${request.productType}`;

    const product: InsertProduct = {
      name: parsed.name || productName,
      description: parsed.description || `Premium ${productWeight} ${strainName} ${request.isInfused ? 'infused ' : ''}${request.productType}`,
      price: (parsed.price || this.randomPriceInRange(request.priceRange)).toString(),
      category: request.productType === 'pre-roll' ? 'pre-rolls' : 'flower',
      imageUrl: this.generateProductImageUrl(request.productType, strainName, request.isInfused),
      stock: quantity,
      weight: productWeight,
      featured: Math.random() < 0.1, // 10% chance of being featured
      rating: '4.5',
      thcaContent: `${parsed.thcContent || this.randomInRange(request.thcRange.min, request.thcRange.max)}%`,
      strainType: request.strainType,
      effects: parsed.effects || this.getDefaultEffects(request.strainType)
    };

    return product;
  }

  private generateProductImageUrl(productType: string, strainName: string, isInfused?: boolean): string {
    // Generate stable image URLs using strain name as seed for consistency
    const imageId = Math.abs(strainName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 1000;
    
    // Use Unsplash Source for reliable images
    if (productType === 'pre-roll') {
      if (isInfused) {
        return `https://source.unsplash.com/400x400/?cannabis,pre-roll,${imageId}`;
      } else {
        return `https://source.unsplash.com/400x400/?hemp,joint,${imageId}`;
      }
    } else if (productType === 'flower') {
      return `https://source.unsplash.com/400x400/?cannabis,flower,bud,${imageId}`;
    } else if (productType === 'concentrate') {
      return `https://source.unsplash.com/400x400/?cannabis,concentrate,${imageId}`;
    } else if (productType === 'edible') {
      return `https://source.unsplash.com/400x400/?edible,gummy,${imageId}`;
    } else {
      return `https://source.unsplash.com/400x400/?cannabis,product,${imageId}`;
    }
  }

  private calculateQuantity(productType: string, strainType: string): number {
    if (productType === 'pre-roll') {
      // 100,000 pre-rolls split 50/50 indica/sativa
      return strainType === 'hybrid' ? 
        Math.floor(Math.random() * 1000) + 500 : 
        Math.floor(Math.random() * 2000) + 1000;
    } else {
      // 25 pounds total: 10 sativa, 10 indica, 5 hybrid
      const baseAmount = strainType === 'hybrid' ? 
        Math.floor(Math.random() * 200) + 100 : // 5 pounds in grams
        Math.floor(Math.random() * 400) + 200;   // 10 pounds in grams
      return baseAmount;
    }
  }

  private calculateWeight(productType: string, preRollWeight?: string): string {
    if (productType === 'pre-roll') {
      return preRollWeight || '1g';
    } else {
      const weights = ['1g', '3.5g', '7g', '14g', '28g'];
      return weights[Math.floor(Math.random() * weights.length)];
    }
  }

  private randomPriceInRange(range: { min: number; max: number }): number {
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getDefaultEffects(strainType: string): string[] {
    const effects = {
      indica: ['relaxed', 'sleepy', 'happy', 'euphoric', 'hungry'],
      sativa: ['energetic', 'uplifted', 'creative', 'focused', 'happy'],
      hybrid: ['balanced', 'relaxed', 'happy', 'euphoric', 'creative']
    };
    return effects[strainType as keyof typeof effects] || effects.hybrid;
  }

  private getDefaultFlavors(strainName: string): string[] {
    const commonFlavors = ['earthy', 'sweet', 'citrus', 'pine', 'berry', 'diesel', 'spicy', 'floral'];
    return commonFlavors.slice(0, 3);
  }

  private getDefaultTerpenes(strainType: string): string[] {
    const terpenes = {
      indica: ['myrcene', 'linalool', 'caryophyllene'],
      sativa: ['limonene', 'pinene', 'terpinolene'],
      hybrid: ['myrcene', 'limonene', 'caryophyllene']
    };
    return terpenes[strainType as keyof typeof terpenes] || terpenes.hybrid;
  }

  private getDefaultFeatures(productType: string): string[] {
    const features = {
      'pre-roll': ['Lab tested', 'Premium flower', 'Perfectly rolled', 'Slow burning'],
      'flower': ['Premium buds', 'Hand trimmed', 'Properly cured', 'Lab tested']
    };
    return features[productType as keyof typeof features] || features.flower;
  }

  private generateLabResults(thc: number) {
    return {
      thc: `${thc}%`,
      cbd: `${(Math.random() * 2).toFixed(1)}%`,
      totalCannabinoids: `${(thc + Math.random() * 5).toFixed(1)}%`,
      terpenes: `${(Math.random() * 3 + 1).toFixed(1)}%`
    };
  }

  private generateSKU(strain: string, productType: string, sequence: number): string {
    const strainCode = strain.substring(0, 3).toUpperCase();
    const typeCode = productType === 'pre-roll' ? 'PR' : 'FL';
    return `${typeCode}-${strainCode}-${sequence.toString().padStart(6, '0')}`;
  }

  async saveBulkProducts(products: InsertProduct[]): Promise<any[]> {
    const results = [];
    
    for (const product of products) {
      try {
        const savedProduct = await storage.createProduct(product);
        results.push(savedProduct);
        console.log(`✅ Saved: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to save: ${product.name}`, error);
        results.push({ error: (error as any)?.message || 'Unknown error', name: product.name });
      }
    }
    
    return results;
  }

  // Generate special deals and packages
  async generateDealsAndPackages(productType: 'pre-roll' | 'flower'): Promise<any[]> {
    if (!groq) {
      throw new Error('Groq AI service not configured.');
    }

    const dealPrompt = `Create 20 attractive deals and packages for THCA ${productType} products.

Include various deal types:
- Bulk discounts (buy more, save more)
- Strain variety packs
- Beginner-friendly starter packs
- Premium collector editions
- Mix-and-match deals
- Loyalty rewards
- Limited-time offers
- Seasonal packages

Return ONLY a JSON array with this structure:
[
  {
    "name": "Deal name",
    "description": "Deal description",
    "originalPrice": "Original price (number)",
    "salePrice": "Sale price (number)",
    "savings": "Amount saved (number)",
    "products": ["product1", "product2", "product3"],
    "dealType": "bulk|variety|starter|premium|limited",
    "duration": "Deal duration",
    "features": ["feature1", "feature2", "feature3"]
  }
]

Make deals attractive and realistic for the cannabis market.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // the newest model is "llama-3.3-70b-versatile" which was released December 2024
      messages: [{ role: "user", content: dealPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content || '[]';
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : parsed.deals || [];
  }
}

export const bulkProductGenerator = new BulkProductGenerator();