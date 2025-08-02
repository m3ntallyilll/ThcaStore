import Groq from 'groq-sdk';
import { db } from './db';
import { 
  specialOffers, 
  products, 
  aiInteractions, 
  userRewards, 
  orders 
} from '@shared/schema';
import { eq, and, gte, desc, lte } from 'drizzle-orm';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

interface AIAssistantContext {
  userId?: string;
  userRewards?: any;
  recentPurchases?: any[];
  currentCart?: any[];
  activeOffers?: any[];
  userTier?: any;
}

export class AIAssistant {

  async generateResponse(
    message: string, 
    context: AIAssistantContext,
    sessionId: string,
    userContext?: { username: string; email: string; isAdmin: boolean; }
  ): Promise<{
    response: string;
    intent: string;
    sentiment: string;
    recommendedProducts?: string[];
    suggestedOffers?: any[];
    actionItems?: any[];
  }> {
    try {
      // Check if Groq is available
      if (!groq) {
        return await this.getFallbackResponse(message, context);
      }

      // Get user context and active offers
      const activeOffers = await this.getActiveOffers(context.userTier?.name);
      const productsData = await this.getProducts();

      // Create system prompt with context
      const systemPrompt = this.buildSystemPrompt(context, activeOffers, productsData, userContext);

      // Use Groq with message prefilling for structured response
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          },
          {
            role: "assistant", 
            content: "```json\n"
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stop: ["```"]
      });

      const responseText = completion.choices[0]?.message?.content || "";
      let parsedResponse;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        parsedResponse = {
          response: "I'm here to help! Let me know what you're looking for.",
          intent: "general_assistance",
          sentiment: "neutral",
          recommendedProducts: [],
          suggestedOffers: [],
          actionItems: []
        };
      }

      // Log interaction for analytics
      await this.logInteraction({
        userId: context.userId,
        sessionId,
        message,
        response: parsedResponse.response,
        intent: parsedResponse.intent,
        sentiment: parsedResponse.sentiment,
        productsRecommended: parsedResponse.recommendedProducts || [],
        conversionResult: false // Will be updated later based on user actions
      });

      return parsedResponse;

    } catch (error) {
      console.error('AI Assistant Error:', error);
      return await this.getFallbackResponse(message, context);
    }
  }

  private async getEnhancedFallbackResponse(message: string, context: AIAssistantContext, products: any[]) {
    const lowerMessage = message.toLowerCase();

    // Get product recommendations
    const recommendedProducts = await this.analyzeForProductRecommendations(message, products, context);
    const recommendedProductDetails = products.filter(p => recommendedProducts.includes(p.id));

    // Simple intent detection for fallback
    let intent = "general_assistance";
    let response = "Hi! I'm here to help you with our premium THCA products. What can I assist you with today?";
    let actionItems: any[] = [];

    if (lowerMessage.includes("product") || lowerMessage.includes("buy") || lowerMessage.includes("shop")) {
      intent = "product_recommendation";
      response = `I'd be happy to help you find the perfect THCA products! Based on your interest, I recommend checking out these popular items:\n\n`;

      recommendedProductDetails.forEach(product => {
        response += `🌿 **${product.name}** - $${product.price}\n${product.description.substring(0, 100)}...\n\n`;
      });

      response += "Would you like to add any of these to your cart or learn more about them?";

      actionItems.push({
        type: "show_products",
        data: { productIds: recommendedProducts }
      });

    } else if (lowerMessage.includes("reward") || lowerMessage.includes("point")) {
      intent = "rewards_inquiry";
      response = context.userId 
        ? `Great question about rewards! You currently have ${context.userRewards?.totalPoints || 0} points. Check out these products to earn more points:\n\n`
        : "Our rewards program lets you earn points with every purchase! Sign up to start earning points. Here are some great products to get you started:\n\n";

      recommendedProductDetails.forEach(product => {
        const pointsEarned = Math.floor(parseFloat(product.price) * (context.userTier?.multiplier || 1));
        response += `🌿 **${product.name}** - Earn ${pointsEarned} points ($${product.price})\n`;
      });

      actionItems.push({
        type: "show_products", 
        data: { productIds: recommendedProducts }
      });

    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("$")) {
      intent = "price_inquiry";
      response = "Our THCA products are competitively priced with frequent special offers! Here are some great value options:\n\n";

      recommendedProductDetails.forEach(product => {
        response += `🌿 **${product.name}** - $${product.price} (${product.category})\n`;
      });

      response += "\nPlus you earn reward points on every purchase!";

      actionItems.push({
        type: "show_products",
        data: { productIds: recommendedProducts }
      });

    } else {
      // General greeting with product recommendations
      response = `Hi! I'm here to help you find the perfect THCA products. Based on our most popular items, I recommend:\n\n`;

      recommendedProductDetails.forEach(product => {
        response += `🌿 **${product.name}** - $${product.price}\n${product.description.substring(0, 80)}...\n\n`;
      });

      response += "What type of THCA product are you interested in today?";

      actionItems.push({
        type: "show_products",
        data: { productIds: recommendedProducts }
      });
    }

    return {
      response,
      intent,
      sentiment: "positive", 
      recommendedProducts,
      suggestedOffers: [],
      actionItems
    };
  }

  private async getFallbackResponse(message: string, context: AIAssistantContext) {
    const products = await this.getProducts();
    // This is now a simple wrapper that calls the enhanced version
    return this.getEnhancedFallbackResponse(message, context, products);
  }

  private buildSystemPrompt(
    context: AIAssistantContext, 
    activeOffers: any[], 
    products: any[],
    userContext?: { username: string; email: string; isAdmin: boolean; }
  ): string {
    const userProfile = context.userId ? `
User Profile:
- Reward Points: ${context.userRewards?.totalPoints || 0}
- Tier: ${context.userTier?.name || 'Bronze'} (${context.userTier?.multiplier || 1}x points)
- Lifetime Spent: $${context.userRewards?.lifetimeSpent || '0.00'}
- Monthly Purchases: ${context.userRewards?.monthlyPurchases || 0}
- Referral Code: ${context.userRewards?.referralCode || 'N/A'}
` : '';

    const offersContext = activeOffers.length > 0 ? `
Active Special Offers:
${activeOffers.map(offer => `- ${offer.name}: ${offer.description} (${offer.value}% ${offer.type})`).join('\n')}
` : '';

    const productsContext = `
Available Products:
${products.slice(0, 10).map(p => `- ${p.name}: $${p.price} (${p.category}) - ${p.description.substring(0, 100)}...`).join('\n')}
`;

    const adminCapabilities = userContext?.isAdmin ? `

ADMIN CAPABILITIES - You can manage products and store operations:
- Create new products with all details (name, description, price, category, stock, etc.)
- Update existing products (price, stock, description, features, etc.)
- Analyze sales data and suggest improvements
- Manage inventory and stock levels
- Handle administrative queries about orders and customers

When users request product updates or creation, respond with actionItems containing:
{
  "type": "product_update",
  "operation": "create" or "update", 
  "productId": "existing_id_for_updates",
  "productData": {
    "name": "Product Name",
    "description": "Detailed description",
    "price": "99.99",
    "category": "flower|concentrates|edibles|accessories",
    "imageUrl": "image_url",
    "stock": 50,
    "weight": "1.0",
    "featured": false,
    "thcaContent": "25.0",
    "strainType": "hybrid|indica|sativa",
    "effects": ["relaxing", "euphoric"]
  }
}

When users request blog creation or writing assistance, respond with actionItems containing:
{
  "type": "blog_creation",
  "operation": "create_draft",
  "blogData": {
    "title": "SEO-optimized blog title",
    "excerpt": "Compelling excerpt that summarizes the post",
    "content": "Full blog post content in markdown format with proper headings, sections, and SEO optimization",
    "category": "education|products|health|legal|lifestyle|news|guides",
    "tags": ["tag1", "tag2", "tag3"],
    "metaTitle": "SEO title for search engines",
    "metaDescription": "Meta description for SEO (155 chars max)",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "status": "draft",
    "isAiGenerated": true,
    "readTime": 5
  }
}
` : '';

    return `You are THCA Store's ${userContext?.isAdmin ? 'elite AI admin assistant' : 'elite AI sales assistant'}, powered by advanced intelligence to ${userContext?.isAdmin ? 'manage store operations efficiently' : 'maximize customer satisfaction and sales conversion'}. Your mission is to ${userContext?.isAdmin ? 'help admins run a successful hemp business' : 'increase sales by providing exceptional, personalized service'}.

${userProfile}
${offersContext}
${productsContext}
${adminCapabilities}

PERSONALITY: ${userContext?.isAdmin ? 'Professional, efficient store manager with deep hemp expertise. You understand business operations and can handle complex administrative tasks with precision.' : 'Enthusiastic, knowledgeable hemp expert who\'s genuinely excited about THCA products. You\'re persuasive but never pushy, always focusing on benefits and value.'}

SALES STRATEGY:
1. Identify customer needs through smart questioning
2. Recommend perfect products based on their preferences and history
3. Highlight active promotions and rewards benefits
4. Create urgency with limited-time offers
5. Suggest complementary products for higher order values
6. Always mention rewards points and tier benefits

RESPONSE FORMAT - Always respond with valid JSON:
{
  "response": "Your conversational response to the ${userContext?.isAdmin ? 'admin' : 'customer'}",
  "intent": "product_recommendation|support|complaint|price_inquiry|rewards_inquiry|referral_question|admin_product_management|admin_analytics|general",
  "sentiment": "positive|neutral|negative",
  "recommendedProducts": ["product_id_1", "product_id_2"],
  "suggestedOffers": [{"name": "offer_name", "description": "offer_desc", "value": "X%"}],
  "actionItems": [{"type": "add_to_cart|apply_discount|show_rewards|generate_referral|product_update", "data": {}}]
}

CONVERSATION RULES:
- Always be enthusiastic about THCA benefits and quality
- Mention rewards points earned with every purchase suggestion
- Highlight tier benefits and progression
- Suggest referral rewards when appropriate
- Create urgency with time-sensitive offers
- Use product knowledge to make perfect recommendations
- Ask clarifying questions to better assist
- Always push for higher cart values with complementary products

Remember: Every interaction should move toward a sale while providing genuine value!`;
  }

  private async getActiveOffers(userTier?: string): Promise<any[]> {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(); // mon, tue, wed, etc.

    return await db
      .select()
      .from(specialOffers)
      .where(
        and(
          eq(specialOffers.isActive, true),
          lte(specialOffers.startDate, now),
          gte(specialOffers.endDate, now)
        )
      );
  }

  private async getProducts(): Promise<any[]> {
    return await db.select().from(products).limit(20);
  }

  private async logInteraction(interaction: any): Promise<void> {
    try {
      await db.insert(aiInteractions).values(interaction);
    } catch (error) {
      console.error('Failed to log AI interaction:', error);
    }
  }

  async updateConversionResult(sessionId: string, userId: string, converted: boolean): Promise<void> {
    try {
      await db
        .update(aiInteractions)
        .set({ conversionResult: converted })
        .where(
          and(
            eq(aiInteractions.sessionId, sessionId),
            eq(aiInteractions.userId, userId)
          )
        );
    } catch (error) {
      console.error('Failed to update conversion result:', error);
    }
  }

  async generatePersonalizedOffers(userId: string): Promise<any[]> {
    try {
      // Get user's purchase history and preferences
      const userRewardsData = await db
        .select()
        .from(userRewards)
        .where(eq(userRewards.userId, userId))
        .limit(1);

      const recentOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt))
        .limit(5);

      // If Groq is not available, return default offers
      if (!groq) {
        return this.getDefaultOffers(userRewardsData[0], recentOrders.length);
      }

      // Generate AI-powered personalized offers
      const prompt = `Based on this customer data, generate 3 personalized special offers:

Customer Profile:
- Total Points: ${userRewardsData[0]?.totalPoints || 0}
- Lifetime Spent: $${userRewardsData[0]?.lifetimeSpent || '0.00'}
- Monthly Purchases: ${userRewardsData[0]?.monthlyPurchases || 0}
- Recent Orders: ${recentOrders.length}

Generate offers that would entice this customer to make another purchase. Include double points days, category discounts, and bundle deals.`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: "```json\n" }
        ],
        stop: ["```"]
      });

      const response = completion.choices[0]?.message?.content || "[]";
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate personalized offers:', error);
      return this.getDefaultOffers();
    }
  }

  private getDefaultOffers(userRewards?: any, orderCount: number = 0): any[] {
    const offers = [
      {
        name: "Welcome Back",
        description: "Get 15% off your next order",
        value: "15",
        type: "discount"
      },
      {
        name: "Double Points Weekend",
        description: "Earn 2x points on all purchases this weekend",
        value: "100",
        type: "points_multiplier"
      },
      {
        name: "Bundle Deal",
        description: "Buy 2 products, get 1 at 50% off",
        value: "50",
        type: "bundle_discount"
      }
    ];

    // Customize based on user activity
    if (userRewards?.totalPoints > 500) {
      offers[0] = {
        name: "VIP Discount",
        description: "Exclusive 20% off for loyal customers",
        value: "20",
        type: "discount"
      };
    }

    if (orderCount === 0) {
      offers[0] = {
        name: "First Purchase",
        description: "Get 25% off your first order",
        value: "25",
        type: "discount"
      };
    }

    return offers;
  }

  // Add product analysis and recommendation logic here. This is a placeholder.
  private async analyzeForProductRecommendations(message: string, products: any[], context:AIAssistantContext): Promise<string[]> {
    // Simple logic: Recommend the first 3 products.
    return products.slice(0, 3).map(p => p.id);
  }
}

export const aiAssistant = new AIAssistant();