import Groq from 'groq-sdk';
import { storage } from './database-storage';
import type { 
  AIConversation, 
  AIMessage, 
  AIUserProfile, 
  AIContextMemory,
  InsertAIConversation,
  InsertAIMessage,
  InsertAIContextMemory
} from '@shared/schema';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

interface MemoryAssistantContext {
  userId?: string;
  userRewards?: any;
  recentPurchases?: any[];
  currentCart?: any[];
  activeOffers?: any[];
  userTier?: any;
  isAdmin?: boolean;
  username?: string;
  email?: string;
}

interface ChatResponse {
  response: string;
  intent: string;
  sentiment: string;
  recommendedProducts?: string[];
  suggestedOffers?: any[];
  actionItems?: any[];
  conversationId: string;
  sessionId: string;
}

export class AIMemoryAssistant {
  
  async generateMemoryEnhancedResponse(
    message: string,
    sessionId: string,
    context: MemoryAssistantContext
  ): Promise<ChatResponse> {
    try {
      if (!groq) {
        return this.getFallbackResponse(message, sessionId, context);
      }

      const userId = context.userId;
      
      // Get or create conversation
      const conversation = await this.getOrCreateConversation(sessionId, userId);
      
      // Get user memory profile
      const userProfile = userId ? await storage.getOrCreateAIUserProfile(userId) : null;
      
      // Get conversation history
      const conversationHistory = await storage.getConversationHistory(conversation.id, 20);
      
      // Get user context memory
      const contextMemory = userId ? await storage.getContext(userId) : [];
      
      // Build enhanced system prompt with memory
      const systemPrompt = await this.buildMemoryEnhancedPrompt(
        context, 
        userProfile, 
        contextMemory, 
        conversationHistory
      );
      
      // Convert conversation history to messages format
      const historyMessages = conversationHistory.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      // Create Groq completion with memory context
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...historyMessages,
          { role: "user", content: message },
          { role: "assistant", content: "```json\n" }
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
        parsedResponse = {
          response: "I'm here to help with your THCA needs! What can I assist you with today?",
          intent: "general_assistance",
          sentiment: "neutral",
          recommendedProducts: [],
          suggestedOffers: []
        };
      }

      // Save messages to conversation
      await this.saveConversationMessages(conversation.id, message, parsedResponse.response, parsedResponse, userId);
      
      // Update user profile and context
      if (userId && userProfile) {
        await this.updateUserMemory(userId, message, parsedResponse, userProfile);
      }

      // Update interaction stats
      if (userId) {
        await storage.updateInteractionStats(userId, parsedResponse.recommendedProducts?.length > 0);
      }

      return {
        ...parsedResponse,
        conversationId: conversation.id,
        sessionId: sessionId
      };

    } catch (error) {
      console.error('AI Memory Assistant Error:', error);
      return this.getFallbackResponse(message, sessionId, context);
    }
  }

  private async getOrCreateConversation(sessionId: string, userId?: string): Promise<AIConversation> {
    let conversation = await storage.getConversationBySession(sessionId, userId);
    
    if (!conversation) {
      const conversationData: InsertAIConversation = {
        userId,
        sessionId,
        status: 'active',
        lastInteractionAt: new Date(),
        messageCount: 0,
        topics: []
      };
      
      conversation = await storage.createConversation(conversationData);
    }
    
    return conversation;
  }

  private async buildMemoryEnhancedPrompt(
    context: MemoryAssistantContext,
    userProfile: AIUserProfile | null,
    contextMemory: AIContextMemory[],
    conversationHistory: AIMessage[]
  ): Promise<string> {
    
    // Get active offers and products
    const activeOffers = await this.getActiveOffers(context.userTier?.name);
    const products = await this.getRecentProducts();
    
    let memoryContext = "";
    
    // Add user profile information
    if (userProfile) {
      const preferences = userProfile.preferences ? JSON.parse(userProfile.preferences) : {};
      memoryContext += `
User Profile Information:
- Communication style: ${userProfile.communicationStyle}
- Total interactions: ${userProfile.totalInteractions}
- Interests: ${userProfile.interests.join(', ') || 'None recorded'}
- Satisfaction score: ${userProfile.satisfactionScore}/10
- Preferences: ${Object.keys(preferences).length > 0 ? JSON.stringify(preferences) : 'None recorded'}
- Last seen products: ${userProfile.lastSeenProducts.slice(0, 3).join(', ') || 'None'}
`;
    }

    // Add context memory
    if (contextMemory.length > 0) {
      memoryContext += `
User's Previous Context & Preferences:
${contextMemory.map(ctx => 
  `- ${ctx.contextType}: ${ctx.contextKey} = ${ctx.contextValue} (importance: ${ctx.importance}/10)`
).join('\n')}
`;
    }

    // Add conversation context
    if (conversationHistory.length > 0) {
      memoryContext += `
Recent Conversation Topics: ${this.extractTopicsFromHistory(conversationHistory)}
`;
    }

    // Admin context
    const adminContext = context.isAdmin ? `
ADMIN USER DETECTED: This user has admin privileges. You can:
- Help with product management, creating/updating products
- Provide sales analytics and insights  
- Assist with order management and customer service
- Generate blog content and SEO optimization
- Answer business and operational questions
- Greet them as an admin and offer management assistance
` : '';

    return `You are THCA Store's advanced AI assistant with conversational memory. You specialize in THCA products, hemp education, and personalized customer service.

${adminContext}

${memoryContext}

Your Current Context:
- User tier: ${context.userTier?.name || 'Bronze'}
- Cart items: ${context.currentCart?.length || 0}
- Recent purchases: ${context.recentPurchases?.length || 0}

Available Products (sample): ${products.slice(0, 3).map(p => `${p.name} ($${p.price})`).join(', ')}

Active Offers: ${activeOffers.map(o => `${o.name}: ${o.description}`).join(', ')}

MEMORY GUIDELINES:
1. Reference previous conversations naturally - don't say "I remember from our last chat"
2. Use their communication style preference (formal/casual/technical/simple)
3. Remember their interests and preferences for better recommendations
4. Build on previous context rather than starting fresh each time
5. Learn from their reactions and adjust recommendations accordingly

RESPONSE REQUIREMENTS:
- Respond in JSON format with: response, intent, sentiment, recommendedProducts, suggestedOffers, actionItems
- Intent options: product_recommendation, support, education, admin_help, general_assistance, complaint
- Sentiment: positive, neutral, negative
- recommendedProducts: array of product IDs if recommending products
- suggestedOffers: array of relevant offers
- actionItems: array of suggested actions for user or system

PERSONALIZATION:
- Adapt tone to their communication style
- Reference their interests when making recommendations
- Consider their purchase history and browsing patterns
- Use memory to avoid repeating information they already know

Be helpful, knowledgeable, and remember our conversation history to provide increasingly personalized assistance.`;
  }

  private async saveConversationMessages(
    conversationId: string,
    userMessage: string,
    aiResponse: string,
    metadata: any,
    userId?: string
  ): Promise<void> {
    // Save user message
    const userMessageData: InsertAIMessage = {
      conversationId,
      userId,
      role: 'user',
      content: userMessage,
      createdAt: new Date()
    };
    
    // Save AI response
    const aiMessageData: InsertAIMessage = {
      conversationId,
      userId,
      role: 'assistant', 
      content: aiResponse,
      metadata: JSON.stringify(metadata),
      intent: metadata.intent,
      sentiment: metadata.sentiment,
      productsReferenced: metadata.recommendedProducts || [],
      createdAt: new Date()
    };

    await Promise.all([
      storage.addMessage(userMessageData),
      storage.addMessage(aiMessageData)
    ]);
  }

  private async updateUserMemory(
    userId: string,
    userMessage: string,
    response: any,
    userProfile: AIUserProfile
  ): Promise<void> {
    const updates: Partial<typeof userProfile> = {
      lastActiveAt: new Date()
    };

    // Extract and save context from the conversation
    await this.extractAndSaveContext(userId, userMessage, response);
    
    // Update interests based on message content
    const newInterests = this.extractInterests(userMessage);
    if (newInterests.length > 0) {
      const combinedInterests = [...new Set([...userProfile.interests, ...newInterests])];
      updates.interests = combinedInterests.slice(0, 10); // Keep top 10 interests
    }

    // Update last seen products
    if (response.recommendedProducts && response.recommendedProducts.length > 0) {
      const combinedProducts = [...new Set([...response.recommendedProducts, ...userProfile.lastSeenProducts])];
      updates.lastSeenProducts = combinedProducts.slice(0, 20); // Keep last 20 products
    }

    await storage.updateAIUserProfile(userId, updates);
  }

  private async extractAndSaveContext(userId: string, message: string, response: any): Promise<void> {
    const messageLower = message.toLowerCase();
    
    // Extract product preferences
    if (messageLower.includes('prefer') || messageLower.includes('like') || messageLower.includes('favorite')) {
      const context: InsertAIContextMemory = {
        userId,
        contextType: 'product_preference',
        contextKey: 'stated_preference',
        contextValue: message,
        importance: 7
      };
      await storage.saveContext(context);
    }

    // Extract pain points or issues
    if (messageLower.includes('problem') || messageLower.includes('issue') || messageLower.includes('help with')) {
      const context: InsertAIContextMemory = {
        userId,
        contextType: 'support_issue',
        contextKey: 'user_concern',
        contextValue: message,
        importance: 8
      };
      await storage.saveContext(context);
    }

    // Extract goals or objectives
    if (messageLower.includes('want to') || messageLower.includes('trying to') || messageLower.includes('goal')) {
      const context: InsertAIContextMemory = {
        userId,
        contextType: 'user_goal',
        contextKey: 'stated_goal',
        contextValue: message,
        importance: 6
      };
      await storage.saveContext(context);
    }
  }

  private extractInterests(message: string): string[] {
    const interests: string[] = [];
    const messageLower = message.toLowerCase();
    
    // THCA product categories
    if (messageLower.includes('flower') || messageLower.includes('bud')) interests.push('flower');
    if (messageLower.includes('concentrate') || messageLower.includes('wax') || messageLower.includes('shatter')) interests.push('concentrates');
    if (messageLower.includes('edible') || messageLower.includes('gummies')) interests.push('edibles');
    if (messageLower.includes('vape') || messageLower.includes('cart')) interests.push('vaping');
    if (messageLower.includes('topical') || messageLower.includes('cream')) interests.push('topicals');
    
    // Usage interests
    if (messageLower.includes('sleep') || messageLower.includes('insomnia')) interests.push('sleep_aid');
    if (messageLower.includes('pain') || messageLower.includes('inflammation')) interests.push('pain_relief');
    if (messageLower.includes('anxiety') || messageLower.includes('stress')) interests.push('anxiety_relief');
    if (messageLower.includes('focus') || messageLower.includes('productivity')) interests.push('focus_enhancement');
    
    return interests;
  }

  private extractTopicsFromHistory(history: AIMessage[]): string {
    const topics = new Set<string>();
    
    history.forEach(msg => {
      if (msg.intent) topics.add(msg.intent);
      if (msg.productsReferenced) {
        msg.productsReferenced.forEach(product => topics.add(`product_${product}`));
      }
    });

    return Array.from(topics).slice(0, 5).join(', ') || 'general_conversation';
  }

  private async getActiveOffers(userTier?: string): Promise<any[]> {
    // Implementation to get active offers - reuse from existing AI assistant
    return [
      {
        name: "Welcome Back",
        description: "Get 15% off your next order",
        value: "15",
        type: "discount"
      }
    ];
  }

  private async getRecentProducts(): Promise<any[]> {
    // Get recent products from database
    try {
      return await storage.getProducts(6);
    } catch (error) {
      return [];
    }
  }

  private getFallbackResponse(message: string, sessionId: string, context: MemoryAssistantContext): ChatResponse {
    return {
      response: "I'm here to help with your THCA questions! While I'm experiencing some technical difficulties with my advanced features, I can still assist you with product information and general guidance.",
      intent: "general_assistance",
      sentiment: "neutral",
      recommendedProducts: [],
      suggestedOffers: [],
      actionItems: [],
      conversationId: sessionId,
      sessionId: sessionId
    };
  }
}

export const aiMemoryAssistant = new AIMemoryAssistant();