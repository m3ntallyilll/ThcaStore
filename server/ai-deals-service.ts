import Groq from 'groq-sdk';
import { storage } from './database-storage';
import type { InsertSpecialOffer } from '@shared/schema';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

interface DealGenerationRequest {
  targetAudience?: string;
  season?: string;
  products?: string[];
  discountRange?: { min: number; max: number };
  urgency?: 'low' | 'medium' | 'high';
  marketingGoal?: 'acquisition' | 'retention' | 'upsell' | 'clearance';
}

interface GeneratedDeal {
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount' | 'bogo' | 'bundle';
  discountValue: number;
  minPurchase?: number;
  validDays: number;
  urgencyLevel: number;
  marketingCopy: string;
  targetProducts: string[];
}

export class AIDealsService {
  
  async generateDeals(request: DealGenerationRequest = {}): Promise<InsertSpecialOffer[]> {
    if (!groq) {
      throw new Error('Groq AI service not configured. Please check GROQ_API_KEY environment variable.');
    }

    try {
      // Get current products for context
      const products = await storage.getProducts();
      const productCategories = Array.from(new Set(products.map(p => p.category)));
      
      // Generate multiple deals with AI
      const deals = await this.generateAIDeals(request, products.slice(0, 20)); // Use first 20 products for context
      
      // Convert to database format
      const specialOffers: InsertSpecialOffer[] = deals.map(deal => ({
        name: deal.title,
        description: deal.description,
        type: this.mapDiscountTypeToOfferType(deal.discountType),
        value: deal.discountValue.toString(),
        startDate: new Date(),
        endDate: new Date(Date.now() + deal.validDays * 24 * 60 * 60 * 1000),
        isActive: true,
        usageLimit: this.calculateUsageLimit(deal.urgencyLevel),
        minPurchase: deal.minPurchase || 0,
        applicableProducts: deal.targetProducts.length > 0 ? deal.targetProducts : undefined
      }));

      return specialOffers;
    } catch (error) {
      console.error('Error generating AI deals:', error);
      throw new Error('Failed to generate deals. Please try again.');
    }
  }

  private async generateAIDeals(request: DealGenerationRequest, products: any[]): Promise<GeneratedDeal[]> {
    const systemPrompt = `You are an expert e-commerce marketing strategist specializing in THCA and cannabis product promotions. 

Create compelling, profitable special offers that:
- Drive sales and customer acquisition
- Build brand loyalty and repeat purchases  
- Clear inventory strategically
- Maximize profit margins while providing real value
- Comply with cannabis marketing regulations
- Create urgency and FOMO (fear of missing out)

Available product categories: ${Array.from(new Set(products.map(p => p.category))).join(', ')}
Sample products: ${products.map(p => `${p.name} ($${p.price})`).slice(0, 10).join(', ')}

Generate 3-5 strategic deals with different approaches:
1. New customer acquisition offer
2. High-value customer retention deal  
3. Bundle/upsell promotion
4. Limited-time flash sale
5. Seasonal/trending promotion

Marketing Goals: ${request.marketingGoal || 'balanced acquisition and retention'}
Target Audience: ${request.targetAudience || 'cannabis enthusiasts and newcomers'}
Urgency Level: ${request.urgency || 'medium'}
Season/Context: ${request.season || 'current market trends'}

For each deal, consider:
- Psychological triggers (scarcity, social proof, authority)
- Profit margins and business impact
- Customer lifetime value optimization
- Competitive positioning
- Legal compliance for cannabis marketing

Return JSON array with this structure:
[
  {
    "title": "Compelling deal title (max 60 chars)",
    "description": "Detailed description with benefits and terms",
    "discountType": "percentage|fixed_amount|bogo|bundle", 
    "discountValue": number,
    "minPurchase": number (optional),
    "validDays": number,
    "urgencyLevel": number (1-10),
    "marketingCopy": "Persuasive marketing copy for promotion",
    "targetProducts": ["product1", "product2"] (or empty for all)
  }
]`;

    const completion = await groq!.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate strategic promotional deals for our THCA store. Focus on maximizing both customer value and business profitability.` },
        { role: "assistant", content: "```json\n" }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      stop: ["```"]
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    try {
      const parsed = JSON.parse(responseText);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (parseError) {
      return this.getFallbackDeals();
    }
  }

  private getFallbackDeals(): GeneratedDeal[] {
    return [
      {
        title: "New Customer Welcome: 25% Off First Order",
        description: "Welcome to Mentally-Chill! Get 25% off your first order of premium THCA products. Minimum $50 purchase required.",
        discountType: "percentage",
        discountValue: 25,
        minPurchase: 50,
        validDays: 7,
        urgencyLevel: 7,
        marketingCopy: "Start your premium THCA journey with 25% savings! Limited time for new customers only.",
        targetProducts: []
      },
      {
        title: "Flash Sale: 30% Off Premium Flower",
        description: "Limited 48-hour flash sale on all premium THCA flower products. Stock up on your favorites!",
        discountType: "percentage", 
        discountValue: 30,
        validDays: 2,
        urgencyLevel: 9,
        marketingCopy: "⚡ FLASH SALE ALERT: 30% off premium flower for 48 hours only! Don't miss out!",
        targetProducts: ["flower"]
      },
      {
        title: "Buy 2 Get 1 Free - Pre-Rolls",
        description: "Stock up and save! Buy any 2 pre-rolls and get the 3rd one absolutely free. Mix and match allowed.",
        discountType: "bogo",
        discountValue: 33,
        validDays: 10,
        urgencyLevel: 6,
        marketingCopy: "Triple the value! Buy 2 pre-rolls, get 1 FREE. Perfect for trying new strains!",
        targetProducts: ["pre-rolls"]
      },
      {
        title: "VIP Bundle: Premium Sampler Pack",
        description: "Curated selection of our top 5 THCA products at 35% off retail value. Perfect for exploring premium quality.",
        discountType: "bundle",
        discountValue: 35,
        minPurchase: 150,
        validDays: 14,
        urgencyLevel: 5,
        marketingCopy: "Discover premium quality with our VIP sampler bundle. 35% savings on top-shelf products!",
        targetProducts: []
      }
    ];
  }

  private calculateUsageLimit(urgencyLevel: number): number {
    // Higher urgency = lower usage limit to create scarcity
    if (urgencyLevel >= 8) return 50;   // High urgency
    if (urgencyLevel >= 6) return 100;  // Medium urgency  
    return 200; // Low urgency
  }

  private mapDiscountTypeToOfferType(discountType: string): 'discount' | 'bogo' | 'free_shipping' | 'double_points' | 'flash_sale' {
    switch (discountType) {
      case 'percentage':
      case 'fixed_amount':
        return 'discount';
      case 'bogo':
        return 'bogo';
      case 'bundle':
        return 'flash_sale';
      default:
        return 'discount';
    }
  }

  async activateDealStrategy(): Promise<{ success: boolean; deals: any[]; message: string }> {
    try {
      // Generate comprehensive deal strategy
      const strategies = [
        { targetAudience: 'new customers', marketingGoal: 'acquisition', urgency: 'high' },
        { targetAudience: 'returning customers', marketingGoal: 'retention', urgency: 'medium' },
        { targetAudience: 'high-value customers', marketingGoal: 'upsell', urgency: 'low' }
      ];

      const allDeals: InsertSpecialOffer[] = [];
      
      for (const strategy of strategies) {
        const deals = await this.generateDeals(strategy as DealGenerationRequest);
        allDeals.push(...deals);
      }

      // Save deals to database
      const savedDeals = [];
      for (const deal of allDeals) {
        const saved = await storage.createSpecialOffer(deal);
        savedDeals.push(saved);
      }

      return {
        success: true,
        deals: savedDeals,
        message: `Successfully activated ${savedDeals.length} AI-generated deals targeting different customer segments`
      };
    } catch (error) {
      console.error('Error activating deal strategy:', error);
      return {
        success: false,
        deals: [],
        message: 'Failed to activate deal strategy. Please try again.'
      };
    }
  }

  async generatePersonalizedDeal(userId: string): Promise<InsertSpecialOffer | null> {
    try {
      // Get user purchase history and preferences
      const orders = await storage.getUserOrders(userId);
      const rewards = await storage.getUserRewards(userId);
      
      // Analyze user behavior for personalization
      const userProfile = this.analyzeUserProfile(orders, rewards);
      
      // Generate personalized deal based on user data
      const dealRequest: DealGenerationRequest = {
        targetAudience: userProfile.segment,
        marketingGoal: userProfile.suggestedGoal,
        urgency: userProfile.urgencyPreference,
        products: userProfile.preferredCategories
      };

      const deals = await this.generateDeals(dealRequest);
      
      if (deals.length > 0) {
        // Customize for individual user
        const personalizedDeal = {
          ...deals[0],
          name: `Exclusive for You: ${deals[0].name}`,
          description: `${deals[0].description} This personalized offer is based on your shopping preferences.`
        };
        
        return await storage.createSpecialOffer(personalizedDeal);
      }

      return null;
    } catch (error) {
      console.error('Error generating personalized deal:', error);
      return null;
    }
  }

  private analyzeUserProfile(orders: any[], rewards: any): any {
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
    
    // Categorize user
    let segment = 'new';
    let suggestedGoal: DealGenerationRequest['marketingGoal'] = 'acquisition';
    let urgencyPreference: DealGenerationRequest['urgency'] = 'medium';
    
    if (totalSpent > 500) {
      segment = 'high-value';
      suggestedGoal = 'retention';
      urgencyPreference = 'low';
    } else if (orderCount > 3) {
      segment = 'regular';
      suggestedGoal = 'upsell';
      urgencyPreference = 'medium';
    }

    return {
      segment,
      suggestedGoal,
      urgencyPreference,
      preferredCategories: ['flower', 'pre-rolls'], // Could be extracted from order history
      totalSpent,
      avgOrderValue
    };
  }

  async getDealPerformanceAnalytics(): Promise<any> {
    try {
      const offers = await storage.getSpecialOffers();
      const activeOffers = offers.filter(offer => offer.isActive);
      
      return {
        totalActiveDeals: activeOffers.length,
        totalDeals: offers.length,
        averageDiscount: activeOffers.reduce((sum, offer) => sum + parseFloat(offer.value), 0) / activeOffers.length,
        expiringToday: activeOffers.filter(offer => {
          const today = new Date();
          const endDate = new Date(offer.endDate);
          return endDate.toDateString() === today.toDateString();
        }).length,
        byDiscountType: activeOffers.reduce((acc, offer) => {
          acc[offer.type] = (acc[offer.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      console.error('Error getting deal analytics:', error);
      return null;
    }
  }
}

export const aiDealsService = new AIDealsService();