import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./database-storage";
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

  app.post("/api/shipping/validate-state", async (req, res) => {
    try {
      const { state } = req.body;
      const isProhibited = await storage.isStateProhibited(state);

      if (isProhibited) {
        const prohibitedState = await storage.getProhibitedState(state);
        return res.status(400).json({ 
          message: `We cannot ship to ${prohibitedState?.stateName || state}. ${prohibitedState?.reason || 'This state restricts THCA products.'}`
        });
      }

      res.json({ valid: true });
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

  const httpServer = createServer(app);
  return httpServer;
}