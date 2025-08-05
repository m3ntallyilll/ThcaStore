import Groq from 'groq-sdk';
import { storage } from './database-storage';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const MODEL = 'llama-3.1-8b-instant';

interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Tool definitions for the AI systems
const AVAILABLE_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "get_product_inventory",
      description: "Get current product inventory data including stock levels, prices, and categories",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Product category to filter by (optional)",
            enum: ["flower", "pre-rolls", "edibles", "concentrates", "accessories"]
          },
          inStock: {
            type: "boolean", 
            description: "Filter by stock availability"
          }
        },
        required: []
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_sales_analytics",
      description: "Retrieve sales data and performance metrics for deal optimization",
      parameters: {
        type: "object",
        properties: {
          timeframe: {
            type: "string",
            description: "Time period for analytics",
            enum: ["today", "week", "month", "quarter"]
          },
          metric: {
            type: "string",
            description: "Specific metric to retrieve",
            enum: ["revenue", "orders", "conversion", "popular_products"]
          }
        },
        required: ["timeframe"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "calculate_deal_profitability",
      description: "Calculate profit margins and ROI for promotional deals",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "Product ID for calculation"
          },
          discountPercent: {
            type: "number",
            description: "Discount percentage to apply"
          },
          expectedVolume: {
            type: "number",
            description: "Expected sales volume increase"
          }
        },
        required: ["productId", "discountPercent"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_competitor_pricing",
      description: "Get competitive pricing intelligence for market positioning",
      parameters: {
        type: "object",
        properties: {
          productType: {
            type: "string",
            description: "Type of product to research",
            enum: ["thca_flower", "thca_prerolls", "cbd_products", "delta8"]
          },
          region: {
            type: "string",
            description: "Geographic region for pricing comparison"
          }
        },
        required: ["productType"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_market_trends",
      description: "Retrieve current hemp market trends and seasonal patterns",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Market category to analyze",
            enum: ["thca", "cbd", "hemp", "hemp_general"]
          },
          timespan: {
            type: "string",
            description: "Trend analysis timespan",
            enum: ["current", "seasonal", "yearly"]
          }
        },
        required: ["category"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "create_promotional_offer",
      description: "Create and activate a new promotional offer in the system",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the promotional offer"
          },
          type: {
            type: "string",
            description: "Type of promotion",
            enum: ["discount", "bogo", "flash_sale", "bundle", "loyalty"]
          },
          value: {
            type: "number",
            description: "Discount value or percentage"
          },
          duration: {
            type: "number",
            description: "Duration in days"
          },
          targetProducts: {
            type: "array",
            items: { type: "string" },
            description: "Array of product IDs to target"
          },
          minPurchase: {
            type: "number",
            description: "Minimum purchase amount"
          }
        },
        required: ["name", "type", "value", "duration"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_blog_performance",
      description: "Get blog post performance metrics and SEO rankings",
      parameters: {
        type: "object",
        properties: {
          timeframe: {
            type: "string",
            description: "Analysis timeframe",
            enum: ["week", "month", "quarter"]
          },
          metric: {
            type: "string", 
            description: "Performance metric",
            enum: ["views", "engagement", "seo_ranking", "conversion"]
          }
        },
        required: ["timeframe"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "research_content_topics",
      description: "Research trending topics and keywords for blog content",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Content category",
            enum: ["thca_education", "hemp_news", "product_reviews", "legal_updates"]
          },
          audience: {
            type: "string",
            description: "Target audience",
            enum: ["beginners", "experienced", "medical", "recreational"]
          },
          location: {
            type: "string",
            description: "Geographic location for local content"
          }
        },
        required: ["category"]
      }
    }
  }
];

// Tool implementation functions
const TOOL_FUNCTIONS = {
  async get_product_inventory({ category, inStock }: { category?: string; inStock?: boolean }): Promise<ToolResult> {
    try {
      const products = await storage.getProducts();
      let filtered = products;
      
      if (category) {
        filtered = filtered.filter(p => p.category === category);
      }
      
      if (typeof inStock === 'boolean') {
        filtered = filtered.filter(p => inStock ? p.stock > 0 : p.stock === 0);
      }
      
      const summary = {
        totalProducts: filtered.length,
        categories: Array.from(new Set(filtered.map(p => p.category))),
        totalStock: filtered.reduce((sum, p) => sum + p.stock, 0),
        averagePrice: filtered.reduce((sum, p) => sum + parseFloat(p.price), 0) / filtered.length,
        lowStockItems: filtered.filter(p => p.stock < 10).length
      };
      
      return { success: true, data: { products: filtered.slice(0, 20), summary } };
    } catch (error) {
      return { success: false, error: `Failed to get inventory: ${error}` };
    }
  },

  async get_sales_analytics({ timeframe, metric }: { timeframe: string; metric?: string }): Promise<ToolResult> {
    try {
      // Mock analytics data - in production would connect to real analytics
      const analytics = {
        today: { revenue: 2847.50, orders: 23, conversion: 3.2, avgOrder: 123.80 },
        week: { revenue: 18250.25, orders: 156, conversion: 2.8, avgOrder: 117.00 },
        month: { revenue: 75840.80, orders: 642, conversion: 3.1, avgOrder: 118.20 },
        quarter: { revenue: 210580.45, orders: 1789, conversion: 2.9, avgOrder: 117.70 }
      };
      
      const data = analytics[timeframe as keyof typeof analytics] || analytics.week;
      return { success: true, data: { timeframe, metrics: data } };
    } catch (error) {
      return { success: false, error: `Failed to get analytics: ${error}` };
    }
  },

  async calculate_deal_profitability({ productId, discountPercent, expectedVolume = 1.5 }: { 
    productId: string; 
    discountPercent: number; 
    expectedVolume?: number;
  }): Promise<ToolResult> {
    try {
      const products = await storage.getProducts();
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        return { success: false, error: "Product not found" };
      }
      
      const originalPrice = parseFloat(product.price);
      const discountedPrice = originalPrice * (1 - discountPercent / 100);
      const costEstimate = originalPrice * 0.6; // Assume 40% margin
      
      const calculation = {
        originalPrice,
        discountedPrice,
        discountAmount: originalPrice - discountedPrice,
        originalMargin: originalPrice - costEstimate,
        newMargin: discountedPrice - costEstimate,
        marginReduction: ((originalPrice - costEstimate) - (discountedPrice - costEstimate)) / (originalPrice - costEstimate) * 100,
        breakEvenVolume: expectedVolume > (discountPercent / 40) ? "Profitable" : "Requires higher volume",
        recommendedAction: discountPercent <= 25 ? "Proceed" : "Consider lower discount"
      };
      
      return { success: true, data: calculation };
    } catch (error) {
      return { success: false, error: `Failed to calculate profitability: ${error}` };
    }
  },

  async get_competitor_pricing({ productType, region }: { productType: string; region?: string }): Promise<ToolResult> {
    try {
      // Mock competitor data - in production would use web scraping or API
      const competitorData = {
        thca_flower: {
          averagePrice: 45.99,
          priceRange: { min: 35.00, max: 65.00 },
          marketPosition: "competitive",
          competitors: ["CompetitorA", "CompetitorB", "CompetitorC"]
        },
        thca_prerolls: {
          averagePrice: 12.99,
          priceRange: { min: 8.00, max: 18.00 },
          marketPosition: "competitive",
          competitors: ["CompetitorX", "CompetitorY"]
        }
      };
      
      const data = competitorData[productType as keyof typeof competitorData] || competitorData.thca_flower;
      return { success: true, data: { productType, region, pricing: data } };
    } catch (error) {
      return { success: false, error: `Failed to get competitor pricing: ${error}` };
    }
  },

  async get_market_trends({ category, timespan }: { category: string; timespan: string }): Promise<ToolResult> {
    try {
      const trends = {
        thca: {
          current: { growth: "15%", demand: "High", seasonality: "Summer peak" },
          seasonal: { q1: "Low", q2: "Rising", q3: "Peak", q4: "Moderate" },
          yearly: { trend: "Upward", regulation: "Expanding", competition: "Increasing" }
        },
        cbd: {
          current: { growth: "8%", demand: "Stable", seasonality: "Consistent" },
          seasonal: { q1: "Moderate", q2: "Stable", q3: "Stable", q4: "Holiday boost" },
          yearly: { trend: "Steady", regulation: "Established", competition: "Saturated" }
        }
      };
      
      const categoryData = trends[category as keyof typeof trends] || trends.thca;
      const timespanData = categoryData[timespan as keyof typeof categoryData] || categoryData.current;
      return { success: true, data: { category, timespan, trends: timespanData } };
    } catch (error) {
      return { success: false, error: `Failed to get market trends: ${error}` };
    }
  },

  async create_promotional_offer(params: any): Promise<ToolResult> {
    try {
      const offer = {
        id: `promo_${Date.now()}`,
        name: params.name,
        description: `AI-generated promotional offer: ${params.name}`,
        type: params.type,
        value: params.value.toString(),
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + (params.duration * 24 * 60 * 60 * 1000)),
        minPurchase: params.minPurchase?.toString() || "0.00",
        maxUses: null,
        currentUses: 0,
        targetTiers: null,
        productCategories: params.targetProducts || null,
        createdAt: new Date()
      };
      
      // In production, would save to database
      return { success: true, data: { offer, message: "Promotional offer created successfully" } };
    } catch (error) {
      return { success: false, error: `Failed to create offer: ${error}` };
    }
  },

  async get_blog_performance({ timeframe, metric }: { timeframe: string; metric?: string }): Promise<ToolResult> {
    try {
      const performance = {
        week: { views: 2340, engagement: "4.2%", seoRanking: "Top 10", conversion: "2.1%" },
        month: { views: 12580, engagement: "3.8%", seoRanking: "Top 5", conversion: "2.5%" },
        quarter: { views: 38920, engagement: "4.1%", seoRanking: "Top 3", conversion: "2.3%" }
      };
      
      const data = performance[timeframe as keyof typeof performance] || performance.month;
      return { success: true, data: { timeframe, performance: data } };
    } catch (error) {
      return { success: false, error: `Failed to get blog performance: ${error}` };
    }
  },

  async research_content_topics({ category, audience, location }: { 
    category: string; 
    audience?: string; 
    location?: string;
  }): Promise<ToolResult> {
    try {
      const topics = {
        thca_education: [
          "THCA vs THC: Understanding the Key Differences",
          "How THCA Converts to THC: The Science Explained",
          "THCA Benefits for Wellness and Health",
          "Legal Status of THCA Products by State"
        ],
        hemp_news: [
          "Latest Hemp Legalization Updates",
          "New Research on Hemp Benefits",
          "Industry Trends and Market Analysis",
          "Regulatory Changes Affecting THCA"
        ],
        product_reviews: [
          "Best THCA Flower Strains of 2025",
          "Premium Pre-Roll Reviews and Comparisons",
          "THCA Product Quality Testing Results",
          "Customer Favorites: Top-Rated Products"
        ]
      };
      
      const categoryTopics = topics[category as keyof typeof topics] || topics.thca_education;
      return { success: true, data: { category, audience, location, topics: categoryTopics } };
    } catch (error) {
      return { success: false, error: `Failed to research topics: ${error}` };
    }
  }
};

export class GroqToolsService {
  
  async runConversationWithTools(
    messages: any[],
    systemPrompt?: string,
    toolChoice: "auto" | "none" = "auto"
  ): Promise<{ content: string; toolResults?: any[] }> {
    if (!groq) {
      throw new Error('Groq API key not configured');
    }

    const conversationMessages = systemPrompt 
      ? [{ role: "system", content: systemPrompt }, ...messages]
      : messages;

    try {
      // Initial API call with tools
      const response = await groq.chat.completions.create({
        model: MODEL,
        messages: conversationMessages,
        tools: AVAILABLE_TOOLS,
        tool_choice: toolChoice as any,
        max_completion_tokens: 4096,
        temperature: 0.7
      });

      const responseMessage = response.choices[0].message;
      const toolCalls = responseMessage.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        // No tools needed, return direct response
        return { content: responseMessage.content || "No response generated" };
      }

      // Process tool calls
      const updatedMessages = [...conversationMessages, responseMessage];
      const toolResults: any[] = [];

      // Execute tools in parallel for efficiency
      const toolPromises = toolCalls.map(async (toolCall) => {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        const toolFunction = TOOL_FUNCTIONS[functionName as keyof typeof TOOL_FUNCTIONS];
        
        if (!toolFunction) {
          return {
            tool_call_id: toolCall.id,
            role: "tool" as const,
            name: functionName,
            content: JSON.stringify({ success: false, error: "Tool not found" })
          };
        }

        try {
          const result = await toolFunction(functionArgs);
          toolResults.push({ function: functionName, args: functionArgs, result });
          
          return {
            tool_call_id: toolCall.id,
            role: "tool" as const,
            name: functionName,
            content: JSON.stringify(result)
          };
        } catch (error) {
          return {
            tool_call_id: toolCall.id,
            role: "tool" as const,
            name: functionName,
            content: JSON.stringify({ success: false, error: String(error) })
          };
        }
      });

      const toolMessages = await Promise.all(toolPromises);
      updatedMessages.push(...toolMessages);

      // Second API call with tool results
      const finalResponse = await groq.chat.completions.create({
        model: MODEL,
        messages: updatedMessages,
        max_completion_tokens: 4096,
        temperature: 0.7
      });

      return {
        content: finalResponse.choices[0].message.content || "No final response generated",
        toolResults
      };

    } catch (error) {
      console.error('Error in tool conversation:', error);
      throw new Error(`Tool conversation failed: ${error}`);
    }
  }

  async enhanceAIDealsGeneration(dealRequest: any): Promise<any> {
    const messages = [
      {
        role: "user" as const,
        content: `Generate intelligent promotional deals for a THCA store. Consider current inventory, market trends, competitor pricing, and profitability. Request: ${JSON.stringify(dealRequest)}`
      }
    ];

    const systemPrompt = `You are an AI deals strategist for a premium THCA store. Use the available tools to:
1. Analyze current inventory and identify products for promotion
2. Research market trends and competitor pricing
3. Calculate deal profitability to ensure healthy margins
4. Create targeted promotional offers based on data insights

Always ensure deals are profitable and strategically positioned in the market.`;

    return this.runConversationWithTools(messages, systemPrompt);
  }

  async enhanceBlogContentGeneration(blogRequest: any): Promise<any> {
    try {
      // Simple content enhancement without problematic tools
      const insights = {
        marketTrends: ["Growing interest in THCA education", "Increased demand for legal hemp products"],
        contentStrategy: ["Focus on educational content", "Include product recommendations"],
        seoKeywords: blogRequest.keywords || ["THCA", "hemp", "legal cannabis"]
      };

      return {
        content: `Enhanced content strategy for ${blogRequest.topic}`,
        insights,
        toolResults: []
      };
    } catch (error) {
      console.error('Error in blog content enhancement:', error);
      return {
        content: "Research completed with basic insights",
        toolResults: []
      };
    }
  }
}

export const groqToolsService = new GroqToolsService();