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
    sessionId: string
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
        return this.getFallbackResponse(message, context);
      }

      // Get user context and active offers
      const activeOffers = await this.getActiveOffers(context.userTier?.name);
      const products = await this.getProducts();

      // Create system prompt with context
      const systemPrompt = this.buildSystemPrompt(context, activeOffers, products);

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
      return this.getFallbackResponse(message, context);
    }
  }

  private getFallbackResponse(message: string, context: AIAssistantContext) {
    const lowerMessage = message.toLowerCase();

    // Simple intent detection for fallback
    let intent = "general_assistance";
    let response = "Hi! I'm here to help you with our premium THCA products. What can I assist you with today?";
    let recommendedProducts: string[] = [];

    if (lowerMessage.includes("product") || lowerMessage.includes("buy") || lowerMessage.includes("shop")) {
      intent = "product_recommendation";
      response = "I'd be happy to help you find the perfect THCA products! Our selection includes premium flower, concentrates, and edibles. What type of product interests you most?";
    } else if (lowerMessage.includes("reward") || lowerMessage.includes("point")) {
      intent = "rewards_inquiry";
      response = context.userId 
        ? `Great question about rewards! You currently have ${context.userRewards?.totalPoints || 0} points. You can earn more points with every purchase and referral!`
        : "Our rewards program lets you earn points with every purchase! Sign up to start earning points you can redeem for discounts.";
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("$")) {
      intent = "price_inquiry";
      response = "Our THCA products are competitively priced with frequent special offers! Check out our products page to see current prices and any active promotions.";
    }

    return {
      response,
      intent,
      sentiment: "positive",
      recommendedProducts,
      suggestedOffers: [],
      actionItems: []
    };
  }

  private buildSystemPrompt(
    context: AIAssistantContext, 
    activeOffers: any[], 
    products: any[]
  ): string {
    const userContext = context.userId ? `
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

    return `You are THCA Store's elite AI sales assistant, powered by advanced intelligence to maximize customer satisfaction and sales conversion. Your mission is to increase sales by providing exceptional, personalized service.

${userContext}
${offersContext}
${productsContext}

PERSONALITY: Enthusiastic, knowledgeable cannabis expert who's genuinely excited about THCA products. You're persuasive but never pushy, always focusing on benefits and value.

SALES STRATEGY:
1. Identify customer needs through smart questioning
2. Recommend perfect products based on their preferences and history
3. Highlight active promotions and rewards benefits
4. Create urgency with limited-time offers
5. Suggest complementary products for higher order values
6. Always mention rewards points and tier benefits

RESPONSE FORMAT - Always respond with valid JSON:
{
  "response": "Your conversational response to the customer",
  "intent": "product_recommendation|support|complaint|price_inquiry|rewards_inquiry|referral_question|general",
  "sentiment": "positive|neutral|negative",
  "recommendedProducts": ["product_id_1", "product_id_2"],
  "suggestedOffers": [{"name": "offer_name", "description": "offer_desc", "value": "X%"}],
  "actionItems": [{"type": "add_to_cart|apply_discount|show_rewards|generate_referral", "data": {}}]
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
}

export const aiAssistant = new AIAssistant();