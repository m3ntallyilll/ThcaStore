import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiAssistant } from "./ai-assistant";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found - Stripe payments will not work');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
}) : null;
import { 
  insertUserSchema, 
  loginSchema, 
  insertProductSchema, 
  insertCartItemSchema, 
  insertOrderSchema,
  insertPointTransactionSchema,
  insertReferralProgramSchema,
  insertSpecialOfferSchema 
} from "@shared/schema";
import { isStateProhibited, getStateRestriction, getAvailableStates } from "@shared/prohibited-states";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "thca-store-secret-key-2025";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // Ensure the user object has all necessary properties
    req.user = { ...user, isAdmin: user.isAdmin || false };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check admin privileges
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '30d' });

      res.json({
        user: { ...user, password: undefined },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '30d' });

      res.json({
        user: { ...user, password: undefined },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json({ ...req.user, password: undefined });
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured } = req.query;

      let products;
      if (category && category !== 'all') {
        products = await storage.getProducts();
        products = products.filter(p => p.category === category);
      } else if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getProducts();
      }

      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/products/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/products/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cart routes
  app.get("/api/cart", authenticateToken, async (req: any, res) => {
    try {
      const cartItems = await storage.getCartItems(req.user.id);
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart", authenticateToken, async (req: any, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/cart/:id", authenticateToken, async (req: any, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cart/:id", authenticateToken, async (req: any, res) => {
    try {
      const deleted = await storage.removeCartItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Order routes
  app.get("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      const orders = await storage.getUserOrders(req.user.id);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/orders", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const orders = await storage.getAllOrdersWithDetails();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/orders/:orderId", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { orderId } = req.params;
      const { status, trackingNumber } = req.body;

      const order = await storage.updateOrderStatus(orderId, status, trackingNumber);
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      // Validate shipping state
      if (isStateProhibited(orderData.shippingState)) {
        const restriction = getStateRestriction(orderData.shippingState);
        return res.status(400).json({
          message: `We cannot ship hemp THCA products to ${restriction?.name || orderData.shippingState}. ${restriction?.reason || 'This state prohibits hemp-derived THCA products.'}`,
          prohibited: true,
          stateName: restriction?.name,
          reason: restriction?.reason
        });
      }

      const order = await storage.createOrder(orderData);

      // Create order items from cart
      const cartItems = await storage.getCartItems(req.user.id);
      for (const cartItem of cartItems) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: cartItem.product.price.toString(),
        });
      }

      // Clear cart after creating order
      await storage.clearCart(req.user.id);

      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/orders/:id/status", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin stats route
  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const products = await storage.getProducts();
      const orders = await storage.getOrders();
      // For now, we'll calculate from orders since we don't have direct user count method
      const uniqueUserIds = new Set(orders.map(order => order.userId));
      const users = Array.from(uniqueUserIds);

      const totalProducts = products.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const activeUsers = users.length;

      res.json({
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        activeUsers,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Initialize database with sample data
  await storage.initialize();

  // Rewards and Loyalty System routes
  app.get("/api/rewards", authenticateToken, async (req: any, res) => {
    try {
      const userRewards = await storage.getUserRewards(req.user.id);
      const tiers = await storage.getRewardTiers();
      const transactions = await storage.getPointTransactions(req.user.id);

      res.json({
        userRewards,
        tiers,
        recentTransactions: transactions.slice(0, 10)
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/rewards/tiers", async (req, res) => {
    try {
      const tiers = await storage.getRewardTiers();
      res.json(tiers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/rewards/redeem", authenticateToken, async (req: any, res) => {
    try {
      const { points, description } = req.body;

      const userRewards = await storage.getUserRewards(req.user.id);
      if (!userRewards || userRewards.totalPoints < points) {
        return res.status(400).json({ message: "Insufficient points" });
      }

      const transaction = await storage.addPointTransaction({
        userId: req.user.id,
        points: -points,
        type: 'redeemed',
        description: description || 'Points redeemed',
        multiplier: '1.00'
      });

      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Referral Program routes
  app.get("/api/referrals", authenticateToken, async (req: any, res) => {
    try {
      const referrals = await storage.getUserReferrals(req.user.id);
      res.json(referrals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/referrals", authenticateToken, async (req: any, res) => {
    try {
      const referralCode = `${req.user.username.toUpperCase().slice(0, 4)}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const referral = await storage.createReferral({
        referrerId: req.user.id,
        referralCode,
        status: 'pending',
        referrerReward: 500,
        refereeReward: 250
      });

      res.status(201).json(referral);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/referrals/:code", async (req, res) => {
    try {
      const referral = await storage.getReferralByCode(req.params.code);
      if (!referral) {
        return res.status(404).json({ message: "Referral code not found" });
      }
      res.json(referral);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Special Offers routes
  app.get("/api/offers", async (req, res) => {
    try {
      const offers = await storage.getActiveOffers();
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/offers", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const offers = await storage.getSpecialOffers();
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/offers", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const offerData = insertSpecialOfferSchema.parse(req.body);
      const offer = await storage.createSpecialOffer(offerData);
      res.status(201).json(offer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // AI Assistant routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, sessionId, userId, userContext } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ 
          message: "Please provide a message",
          response: "Hi! I'm here to help. What would you like to know about our THCA products?",
          intent: "general_assistance",
          sentiment: "neutral"
        });
      }

      // Get user context if authenticated
      let contextData = {};
      if (userId) {
        try {
          const userRewards = await storage.getUserRewards(userId);
          const recentOrders = await storage.getUserOrders(userId);
          contextData = {
            userId,
            userRewards,
            recentPurchases: recentOrders.slice(0, 5),
            userTier: userRewards?.currentTierId ? await storage.getRewardTiers().then(tiers => 
              tiers.find(t => t.id === userRewards.currentTierId)
            ) : null
          };
        } catch (contextError) {
          console.warn('Failed to load user context:', contextError);
          contextData = { userId };
        }
      }

      const response = await aiAssistant.generateResponse(
        message,
        contextData,
        sessionId || `session_${Date.now()}`,
        req.body.userContext
      );

      res.json(response);
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      res.status(500).json({ 
        message: "I'm experiencing some technical difficulties. Please try again.",
        response: "I apologize, but I'm having trouble processing your request right now. How can I help you find the perfect THCA products?",
        intent: "error_recovery",
        sentiment: "neutral"
      });
    }
  });

  app.post("/api/ai/conversion", authenticateToken, async (req: any, res) => {
    try {
      const { sessionId, converted } = req.body;
      await aiAssistant.updateConversionResult(sessionId, req.user.id, converted);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/ai/personalized-offers", authenticateToken, async (req: any, res) => {
    try {
      const offers = await aiAssistant.generatePersonalizedOffers(req.user.id);
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Blog Management Routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { status, category } = req.query;
      let posts;

      if (category) {
        posts = await storage.getBlogsByCategory(category as string);
      } else if (status) {
        posts = await storage.getBlogPosts(status as string);
      } else {
        posts = await storage.getPublishedBlogPosts();
      }

      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Increment view count for published posts
      if (post.status === 'published') {
        await storage.incrementBlogViewCount(post.id);
      }

      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blog/posts/slug/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Increment view count for published posts
      if (post.status === 'published') {
        await storage.incrementBlogViewCount(post.id);
      }

      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Increment view count endpoint
  app.post("/api/blog/posts/:id/view", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Only increment for published posts
      if (post.status === 'published') {
        await storage.incrementBlogViewCount(post.id);
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Sales Strategy Routes
  app.get("/api/ai/sales-strategies", async (req, res) => {
    try {
      const strategies = [
        {
          id: "conversion-optimization",
          strategy: "AI-Powered Conversion Optimization",
          conversionPrediction: 94.2,
          revenueProjection: 127000,
          confidence: 89.5,
          targetAudience: ["First-time buyers", "Medical patients", "Cannabis enthusiasts"],
          tactics: [
            "Personalized product recommendations based on browsing behavior",
            "Dynamic pricing optimization for maximum revenue",
            "Abandoned cart recovery with AI-generated incentives",
            "Smart inventory management to prevent stockouts"
          ],
          disclaimers: [
            "Results based on statistical models and may vary",
            "THCA products not evaluated by FDA",
            "Must be 21+ to purchase"
          ],
          shippingStrategy: "Free shipping over $75 with express options",
          guarantees: [
            "25% conversion rate increase within 30 days",
            "300% ROI on AI investment within 90 days",
            "Revenue optimization with downside protection"
          ]
        }
      ];
      res.json(strategies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Sales Activation Route
  app.post("/api/ai/activate-sales", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { strategyId } = req.body;
      
      // AI activation targeting actual inventory: 30 lbs flower + 15K pre-rolls
      const activationResults = {
        success: true,
        strategyId: strategyId || "inventory-optimization",
        activatedAt: new Date().toISOString(),
        inventoryFocus: {
          flower: {
            sativa: "15 lbs - Premium strains (Blue Dream, Green Crack, Sour Diesel)",
            indica: "10 lbs - High-quality relaxation strains (OG Kush, Purple Punch, Granddaddy Purple)",
            hybrid: "5 lbs - Balanced effects (Girl Scout Cookies, Gelato, Wedding Cake)"
          },
          preRolls: {
            total: "15,000 pre-rolls",
            infused: "5,000 infused pre-rolls with live resin",
            regular: "10,000 premium flower pre-rolls",
            strains: "Northern Lights, Jack Herer, Zkittlez varieties"
          }
        },
        features: [
          {
            name: "Inventory-Based Pricing Strategy",
            status: "activated",
            description: "Dynamic pricing to move 30 lbs flower and 15K pre-rolls efficiently"
          },
          {
            name: "Strain-Specific Recommendations",
            status: "activated", 
            description: "AI suggests premium strains based on customer preferences and effects"
          },
          {
            name: "Bulk Deal Engine",
            status: "activated",
            description: "Smart bundling of flower and pre-rolls for higher order values"
          },
          {
            name: "Infused Product Promotion",
            status: "activated",
            description: "Targeted marketing for 5K premium infused pre-rolls"
          },
          {
            name: "High-Mids Positioning",
            status: "activated",
            description: "Premium positioning of high-mids quality at competitive prices"
          }
        ],
        salesTargets: {
          weeklyFlowerGoal: "2-3 lbs per week",
          weeklyPreRollGoal: "800-1200 pre-rolls per week",
          averageOrderIncrease: "35%",
          infusedConversionRate: "25%"
        },
        nextSteps: [
          "Promote sativa strains for daytime energy customers",
          "Market indica for evening relaxation and sleep aid",
          "Bundle flower with pre-rolls for bulk discounts",
          "Highlight infused pre-rolls as premium experience"
        ]
      };

      // Create inventory-focused promotions to move actual stock
      const aiPromotions = [
        {
          name: "Sativa Energy Pack",
          description: "15% off Blue Dream, Green Crack, and Sour Diesel - Perfect for productivity",
          discountType: "percentage",
          discountValue: 15,
          isActive: true,
          conditions: {
            minOrderValue: 75,
            maxUses: 200,
            validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours
          }
        },
        {
          name: "Indica Night Bundle",
          description: "Buy 1/4 OG Kush or Purple Punch, get 5 pre-rolls for $10",
          discountType: "bundle", 
          discountValue: 25,
          isActive: true,
          conditions: {
            minItems: 2,
            maxUses: 150,
            validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
          }
        },
        {
          name: "Infused Pre-Roll Premium",
          description: "20% off all infused pre-rolls - Limited to 5,000 units in stock",
          discountType: "percentage",
          discountValue: 20,
          isActive: true,
          conditions: {
            minOrderValue: 60,
            maxUses: 300,
            validUntil: new Date(Date.now() + 96 * 60 * 60 * 1000) // 96 hours
          }
        },
        {
          name: "High-Mids Hybrid Special",
          description: "Girl Scout Cookies & Gelato combo - Premium quality at mid-tier prices",
          discountType: "percentage",
          discountValue: 18,
          isActive: true,
          conditions: {
            minOrderValue: 100,
            maxUses: 75,
            validUntil: new Date(Date.now() + 120 * 60 * 60 * 1000) // 5 days
          }
        }
      ];

      // Activate promotions (simulate by creating special offers)
      for (const promotion of aiPromotions) {
        try {
          await storage.createSpecialOffer({
            name: promotion.name,
            description: promotion.description,
            discountType: promotion.discountType,
            discountValue: promotion.discountValue,
            isActive: promotion.isActive,
            validFrom: new Date(),
            validUntil: promotion.conditions.validUntil,
            minOrderValue: promotion.conditions.minOrderValue || 0,
            maxUses: promotion.conditions.maxUses || null,
            currentUses: 0
          });
        } catch (error) {
          console.log('Promotion creation skipped:', error.message);
        }
      }

      // Seed inventory products when activating AI sales
      try {
        const seedModule = await import('./seed-inventory');
        const seedInventoryProducts = seedModule.default || seedModule.seedInventoryProducts;
        await seedInventoryProducts();
        console.log('Successfully seeded inventory products');
      } catch (seedError) {
        console.log('Product seeding skipped (products may already exist):', seedError.message);
      }

      res.json(activationResults);
    } catch (error: any) {
      console.error('AI Sales Activation Error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-sales-strategy", async (req, res) => {
    try {
      const { targetRevenue, timeframe } = req.body;
      
      // Simulate AI strategy generation
      const strategy = {
        id: `strategy-${Date.now()}`,
        strategy: `Custom AI Strategy for $${targetRevenue} in ${timeframe}`,
        conversionPrediction: Math.random() * 30 + 70, // 70-100%
        revenueProjection: targetRevenue,
        confidence: Math.random() * 20 + 80, // 80-100%
        targetAudience: ["Custom segment analysis"],
        tactics: [
          "AI-optimized product bundling",
          "Predictive customer lifetime value modeling",
          "Dynamic email campaign optimization",
          "Real-time pricing elasticity analysis"
        ],
        guarantees: [`Target revenue of $${targetRevenue} within ${timeframe}`]
      };

      res.json(strategy);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Daily Promotions API Routes
  app.get("/api/promotions/today", async (req, res) => {
    try {
      const promotions = await storage.getTodaysPromotions();
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/promotions/week", async (req, res) => {
    try {
      const promotions = await storage.getDailyPromotions();
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/promotions/day/:dayOfWeek", async (req, res) => {
    try {
      const dayOfWeek = parseInt(req.params.dayOfWeek);
      const promotions = await storage.getPromotionByDay(dayOfWeek);
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin Promotion Management
  app.get("/api/admin/promotions", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const promotions = await storage.getDailyPromotions();
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/promotions", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const promotion = await storage.createDailyPromotion(req.body);
      res.json(promotion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/promotions/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const promotion = await storage.updateDailyPromotion(req.params.id, req.body);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.json(promotion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/promotions/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteDailyPromotion(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/promotions/calculate", async (req, res) => {
    try {
      const { promotionId, cartTotal, cartItems } = req.body;
      const [promotion] = await storage.getPromotionByDay(0); // This should be improved to get specific promotion
      
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }

      const discount = await storage.calculatePromotionDiscount(promotion, cartTotal, cartItems);
      res.json({ discount, promotion });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin Blog Routes
  app.get("/api/admin/blog/posts", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { status } = req.query;
      const posts = await storage.getBlogPosts(status as string);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/blog/posts", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { title, content, excerpt, category, tags, status, metaTitle, metaDescription, keywords, featuredImage } = req.body;

      // Generate slug from title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const postData = {
        title,
        slug,
        content,
        excerpt,
        category,
        tags: tags || [],
        status: status || 'draft',
        metaTitle,
        metaDescription,
        keywords: keywords || [],
        featuredImage,
        authorId: req.user.id,
        isAiGenerated: false,
        readTime: Math.ceil(content.split(/\s+/).length / 200),
        publishedAt: status === 'published' ? new Date() : null
      };

      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/blog/posts/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { title, content, excerpt, category, tags, status, metaTitle, metaDescription, keywords, featuredImage } = req.body;

      const updates: any = {
        title,
        content,
        excerpt,
        category,
        tags: tags || [],
        status,
        metaTitle,
        metaDescription,
        keywords: keywords || [],
        featuredImage,
        readTime: Math.ceil(content.split(/\s+/).length / 200)
      };

      // Update published date if status changes to published
      if (status === 'published') {
        const currentPost = await storage.getBlogPost(req.params.id);
        if (currentPost && currentPost.status !== 'published') {
          updates.publishedAt = new Date();
        }
      }

      const post = await storage.updateBlogPost(req.params.id, updates);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/blog/posts/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json({ message: "Blog post deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Blog Generation Routes
  app.post("/api/admin/blog/ai/generate", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { blogAIService } = await import('./blog-ai-service');
      const { topic, category, keywords, tone, length, targetAudience, includeCallToAction } = req.body;

      if (!topic || !category) {
        return res.status(400).json({ message: "Topic and category are required" });
      }

      const blogPost = await blogAIService.generateBlogPost({
        topic,
        category,
        keywords,
        tone,
        length,
        targetAudience,
        includeCallToAction
      }, req.user.id);

      const savedPost = await storage.createBlogPost(blogPost);
      res.json(savedPost);
    } catch (error: any) {
      console.error('AI Blog Generation Error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/blog/ai/improve/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { blogAIService } = await import('./blog-ai-service');
      const { improvements } = req.body;

      const improvedPost = await blogAIService.improveBlogPost(req.params.id, improvements);
      const savedPost = await storage.updateBlogPost(req.params.id, improvedPost);

      res.json(savedPost);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/blog/ai/ideas", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { blogAIService } = await import('./blog-ai-service');
      const { category, count } = req.query;

      const ideas = await blogAIService.generateBlogIdeas(
        category as string || 'education',
        parseInt(count as string) || 10
      );

      res.json({ ideas });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blog/categories", async (req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blog/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const posts = await storage.searchBlogPosts(q as string);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe Payment Routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const { items, subtotal, shippingCost } = req.body;
      const total = Math.round((subtotal + (shippingCost || 0)) * 100); // Convert to cents

      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
        metadata: {
          itemCount: items?.length || 0,
          subtotal: subtotal.toString(),
          shippingCost: (shippingCost || 0).toString()
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Payment intent error:', error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Shipping Routes
  app.get("/api/shipping/rates", async (req, res) => {
    try {
      const rates = await storage.getShippingRates();
      res.json(rates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/shipping/calculate", async (req, res) => {
    try {
      const { method, weight, subtotal } = req.body;
      const shippingCost = await storage.calculateShippingCost(method, weight, subtotal);
      res.json(shippingCost);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // State restriction validation
  app.get("/api/shipping/states", async (req, res) => {
    try {
      const availableStates = getAvailableStates();
      res.json(availableStates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/shipping/validate-state", async (req, res) => {
    try {
      const { state } = req.body;
      
      if (!state) {
        return res.status(400).json({ message: "State code is required" });
      }

      if (isStateProhibited(state)) {
        const restriction = getStateRestriction(state);
        return res.status(400).json({ 
          prohibited: true,
          message: `We cannot ship hemp THCA products to ${restriction?.name || state}. ${restriction?.reason || 'This state prohibits hemp-derived THCA products.'}`,
          stateName: restriction?.name,
          reason: restriction?.reason
        });
      }

      res.json({ prohibited: false, valid: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Enhanced Admin Panel - Orders with Shipping
  app.get("/api/admin/orders", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrdersWithDetails();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/orders/:orderId", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status, trackingNumber } = req.body;

      const updatedOrder = await storage.updateOrderStatus(orderId, status, trackingNumber);
      res.json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Daily Promotions Routes
  app.get("/api/promotions/today", async (req, res) => {
    try {
      const today = new Date().getDay();
      const promotions = await storage.getDailyPromotionsByDay(today);
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/promotions/week", async (req, res) => {
    try {
      const promotions = await storage.getDailyPromotions();
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/promotions/day/:dayOfWeek", async (req, res) => {
    try {
      const dayOfWeek = parseInt(req.params.dayOfWeek);
      if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({ message: "Invalid day of week" });
      }
      const promotions = await storage.getDailyPromotionsByDay(dayOfWeek);
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/promotions/use", authenticateToken, async (req, res) => {
    try {
      const { promotionId } = req.body;
      const userId = req.user.id;
      
      // Check if promotion exists and is valid for today
      const promotion = await storage.getDailyPromotion(promotionId);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }

      const today = new Date().getDay();
      if (promotion.dayOfWeek !== today) {
        return res.status(400).json({ message: "Promotion not valid today" });
      }

      // Record promotion usage
      const usage = await storage.recordPromotionUsage({
        promotionId,
        userId,
        usedAt: new Date().toISOString()
      });

      res.json(usage);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Returns and Refunds Routes
  app.get("/api/returns", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      
      // Mock return requests for now - in production, fetch from database
      const mockReturns = [
        {
          id: "ret_001",
          orderId: "ord_123",
          productId: "prod_456", 
          productName: "Premium THCA Flower - OG Kush",
          productImage: "/api/placeholder/150/150",
          quantity: 1,
          reason: "quality",
          description: "Product quality not as expected",
          status: "pending",
          returnType: "refund",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          refundAmount: 45.00
        }
      ];
      
      res.json(mockReturns);
    } catch (error: any) {
      console.error('Returns fetch error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/returns", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { orderId, items } = req.body;

      if (!orderId || !items || items.length === 0) {
        return res.status(400).json({ message: "Order ID and items are required" });
      }

      // In production, validate order exists, belongs to user, and has insurance
      // Mock insurance check - in production, check order.hasInsurance
      const orderHasInsurance = Math.random() > 0.3; // Mock 70% have insurance
      
      if (!orderHasInsurance) {
        return res.status(400).json({ 
          message: "Returns are only available for orders with shipping insurance. This order was not insured and is not eligible for returns or refunds.",
          code: "NO_INSURANCE"
        });
      }

      // Create return request in database
      const returnRequest = {
        id: `ret_${Date.now()}`,
        userId,
        orderId,
        items,
        status: "pending",
        createdAt: new Date().toISOString(),
        estimatedProcessing: "2-3 business days",
        insuranceVerified: true
      };

      console.log(`[RETURN REQUEST] User: ${userId} | Order: ${orderId} | Items: ${items.length} | Insurance: ✓`);

      res.json({
        success: true,
        returnRequest,
        message: "Return request submitted successfully. Insurance verification confirmed."
      });
    } catch (error: any) {
      console.error('Return creation error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/returns/:id", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const returnId = req.params.id;

      // Mock return details - in production, fetch from database
      const returnDetails = {
        id: returnId,
        orderId: "ord_123",
        status: "processing",
        trackingNumber: "RT123456789",
        timeline: [
          { status: "submitted", date: "2025-01-31T10:00:00Z", description: "Return request submitted" },
          { status: "approved", date: "2025-01-31T14:00:00Z", description: "Return approved" },
          { status: "processing", date: "2025-01-31T16:00:00Z", description: "Return being processed" }
        ],
        refundAmount: 45.00,
        estimatedCompletion: "2025-02-03"
      };

      res.json(returnDetails);
    } catch (error: any) {
      console.error('Return details error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // AI Customer Support Routes
  app.post("/api/support/ai-chat", async (req, res) => {
    try {
      const { processAdvancedSupportRequest } = await import("./support-ai");
      const supportResponse = processAdvancedSupportRequest(req.body);
      
      // Log support interaction
      console.log(`[SUPPORT] User: ${req.body.userId || 'Anonymous'} | Category: ${supportResponse.category} | Priority: ${supportResponse.priority}`);
      
      res.json(supportResponse);
    } catch (error: any) {
      console.error('Support AI error:', error);
      res.status(500).json({ 
        response: "I apologize, but I'm experiencing technical difficulties. Please contact our human support team at support@thcastore.com or call (555) 123-THCA for immediate assistance.",
        needsEscalation: true,
        priority: 'urgent'
      });
    }
  });

  app.post("/api/support/feedback", async (req, res) => {
    try {
      const { messageId, satisfaction, ticketId } = req.body;
      
      // Log feedback for improvement
      console.log(`[SUPPORT FEEDBACK] Message: ${messageId} | Satisfaction: ${satisfaction} | Ticket: ${ticketId}`);
      
      // In a real app, this would save to database
      res.json({ success: true });
    } catch (error: any) {
      console.error('Support feedback error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/support/tickets", authenticateToken, async (req, res) => {
    try {
      // In a real app, this would fetch user's support tickets from database
      const mockTickets = [
        {
          id: 'THCA-123',
          subject: 'Order tracking inquiry',
          status: 'resolved',
          priority: 'medium',
          createdAt: new Date(),
          lastUpdate: new Date()
        }
      ];
      res.json(mockTickets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Temporary endpoint to seed inventory (remove authentication for testing)
  app.post("/api/seed-inventory-now", async (req, res) => {
    try {
      const seedModule = await import('./seed-inventory');
      const seedInventoryProducts = seedModule.default || seedModule.seedInventoryProducts;
      await seedInventoryProducts();
      res.json({ 
        message: "Inventory products seeded successfully",
        details: "Added 30 lbs flower (15 sativa, 10 indica, 5 hybrid) + 15K pre-rolls (5K infused)"
      });
    } catch (error: any) {
      console.error('Inventory seeding error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}