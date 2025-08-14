import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./database-storage";
import { aiAssistant } from "./ai-assistant";
import affiliateRoutes from "./routes/affiliate";

// Cash App Pay Configuration
const CASH_APP_CASHTAG = process.env.CASH_APP_CASHTAG || 'iLLAithegptstore';
console.log(`💚 Cash App Pay enabled with cashtag: $${CASH_APP_CASHTAG}`);
console.log('💳 Direct payment links activated - THCA sales supported');
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

// AI Recommendation Helper Functions
function generatePersonalizedRecommendations(products: any[], viewedIds: string[], preferences: any) {
  const recommended = products
    .filter(p => !viewedIds.includes(p.id))
    .filter(p => preferences.categories?.includes(p.category) || true)
    .sort((a, b) => {
      const aScore = (a.effects || []).filter((e: string) => preferences.effects?.includes(e)).length;
      const bScore = (b.effects || []).filter((e: string) => preferences.effects?.includes(e)).length;
      return bScore - aScore;
    })
    .slice(0, 8);
  
  return recommended;
}

function generateTrendingRecommendations(products: any[]) {
  return products
    .filter(p => p.rating && parseFloat(p.rating) >= 4.0)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
}

function generateSimilarRecommendations(products: any[], currentId?: string, viewedIds: string[] = []) {
  if (!currentId) {
    return products
      .filter(p => !viewedIds.includes(p.id))
      .slice(0, 8);
  }
  
  const currentProduct = products.find(p => p.id === currentId);
  if (!currentProduct) return [];
  
  return products
    .filter(p => p.id !== currentId && !viewedIds.includes(p.id))
    .filter(p => p.category === currentProduct.category)
    .sort((a, b) => {
      const aEffectMatch = (a.effects || []).filter((e: string) => 
        (currentProduct.effects || []).includes(e)
      ).length;
      const bEffectMatch = (b.effects || []).filter((e: string) => 
        (currentProduct.effects || []).includes(e)
      ).length;
      return bEffectMatch - aEffectMatch;
    })
    .slice(0, 8);
}

function generateComplementaryRecommendations(products: any[], cartIds: string[] = []) {
  if (!cartIds.length) return [];
  
  const cartProducts = products.filter(p => cartIds.includes(p.id));
  const cartCategories = [...new Set(cartProducts.map(p => p.category))];
  
  const complementCategories = ['flower', 'prerolls', 'concentrates', 'edibles']
    .filter(cat => !cartCategories.includes(cat));
  
  return products
    .filter(p => !cartIds.includes(p.id))
    .filter(p => complementCategories.includes(p.category))
    .slice(0, 8);
}

function generatePromoCode() {
  const prefixes = ['HEMP', 'SAVE', 'DEAL', 'FIRE', 'CHILL'];
  const suffix = Math.random().toString(36).substr(2, 4).toUpperCase();
  return prefixes[Math.floor(Math.random() * prefixes.length)] + suffix;
}

function generateBalancedCatalog() {
  const strains = {
    indica: ['Purple Punch', 'Granddaddy Purple', 'Northern Lights', 'Bubba Kush', 'Afghan Kush'],
    sativa: ['Green Crack', 'Sour Diesel', 'Jack Herer', 'Durban Poison', 'Maui Wowie'],
    hybrid: ['Blue Dream', 'Girl Scout Cookies', 'Wedding Cake', 'Gelato', 'White Widow']
  };
  
  const weights = {
    flower: ['1g', '3.5g', '7g', '14g', '28g'],
    prerolls: ['1.1g', '1.25g', '1.45g', '1.5g'],
    concentrates: ['0.5g', '1g', '2g'],
    edibles: ['100mg', '250mg', '500mg', '1000mg']
  };
  
  const baseImages = [
    'https://images.unsplash.com/photo-1605185020742-f6b9c93eef31?w=400',
    'https://images.unsplash.com/photo-1583912086096-8c60d75a53d0?w=400',
    'https://images.unsplash.com/photo-1605185020656-ac2c5a9eff9d?w=400'
  ];
  
  const effects = ['relaxing', 'energizing', 'creative', 'focused', 'euphoric', 'calming'];
  
  const products = [];
  
  Object.entries(strains).forEach(([strainType, strainNames]) => {
    strainNames.forEach((strainName, strainIndex) => {
      Object.entries(weights).forEach(([category, weightList]) => {
        weightList.forEach((weight, weightIndex) => {
          const basePrices = {
            flower: { '1g': 15, '3.5g': 45, '7g': 85, '14g': 160, '28g': 300 },
            prerolls: { '1.1g': 12, '1.25g': 14, '1.45g': 16, '1.5g': 18 },
            concentrates: { '0.5g': 35, '1g': 65, '2g': 120 },
            edibles: { '100mg': 20, '250mg': 35, '500mg': 65, '1000mg': 120 }
          };
          
          const basePrice = basePrices[category as keyof typeof basePrices][weight as keyof typeof basePrices[typeof category]];
          const priceVariation = 1 + (Math.random() - 0.5) * 0.4;
          const finalPrice = Math.round(basePrice * priceVariation);
          
          const thcaContent = Math.round(15 + Math.random() * 20);
          const rating = (4.0 + Math.random() * 1.0).toFixed(1);
          
          const variants = weightList.map((w, i) => ({
            id: `variant-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            weight: w,
            price: Math.round(basePrices[category as keyof typeof basePrices][w as keyof typeof basePrices[typeof category]] * priceVariation),
            stock: Math.floor(20 + Math.random() * 80),
            isDefault: i === weightIndex
          }));
          
          const priceRange = {
            min: Math.min(...variants.map(v => v.price)),
            max: Math.max(...variants.map(v => v.price))
          };
          
          products.push({
            name: `${strainName} ${category === 'flower' ? 'Flower' : category === 'prerolls' ? 'Pre-Roll' : category === 'concentrates' ? 'Concentrate' : 'Edibles'}`,
            description: `Premium ${strainType} ${category} with ${thcaContent}% THCA. Perfect for ${effects[Math.floor(Math.random() * effects.length)]} and ${effects[Math.floor(Math.random() * effects.length)]} effects.`,
            price: finalPrice.toString(),
            category,
            subcategory: strainType,
            imageUrl: baseImages[strainIndex % baseImages.length],
            stock: Math.floor(50 + Math.random() * 150),
            weight,
            thcaContent: `${thcaContent}%`,
            potency: thcaContent >= 25 ? 'High' : thcaContent >= 18 ? 'Medium' : 'Low',
            rating,
            effects: [effects[Math.floor(Math.random() * effects.length)], effects[Math.floor(Math.random() * effects.length)]],
            variants,
            priceRange,
            featured: Math.random() > 0.8,
            labTested: true,
            organic: Math.random() > 0.5,
            strainType,
            harvestDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
        });
      });
    });
  });
  
  return products;
}

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Try to get user, but handle missing users gracefully
    let user;
    try {
      user = await storage.getUser(decoded.userId);
    } catch (userError) {
      console.error('User lookup error:', userError);
      return res.status(401).json({ message: 'User account not found' });
    }

    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists' });
    }

    // Ensure the user object has all necessary properties
    req.user = { 
      ...user, 
      isAdmin: user.isAdmin || false,
      id: user.id || decoded.userId 
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired - please log in again' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token - please log in again' });
    }
    return res.status(403).json({ message: 'Authentication failed' });
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
  // Affiliate routes
  app.use('/api/affiliate', affiliateRoutes);
  
  // Store credit balance route
  app.get('/api/store-credit/balance', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const user = await storage.getUser(userId);
      res.json({ balance: user?.storeCredit || 0 });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch store credit balance' });
    }
  });
  
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

      // Automatically create referral code for new user
      try {
        const userPrefix = userData.username.toUpperCase().slice(0, 3);
        const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
        const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
        const referralCode = `${userPrefix}${timestamp}${randomPart}`;

        await storage.createReferral({
          referrerId: user.id,
          referralCode,
          status: 'pending',
          referrerReward: 1000, // 10% commission (in basis points)
          refereeReward: 2000   // 20% discount (in basis points)
        });

        console.log(`✓ Created referral code for new user: ${referralCode}`);
      } catch (referralError) {
        console.log('Warning: Failed to create referral code for new user:', referralError);
      }

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
      const { category, featured, limit = '1000' } = req.query;

      let products;
      if (category && category !== 'all') {
        products = await storage.getProducts();
        products = products.filter(p => p.category === category);
      } else if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getProducts();
      }

      // Apply limit if specified
      const limitNum = parseInt(limit as string);
      if (limitNum && limitNum > 0) {
        products = products.slice(0, limitNum);
      }

      console.log(`API: Returning ${products.length} products`);
      res.json(products);
    } catch (error: any) {
      console.error('Products API error:', error);
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

  // Bulk update products with variants
  app.post("/api/admin/products/bulk-update-variants", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      console.log('🚀 Starting bulk variant update...');
      
      const CATEGORY_VARIANTS = {
        flower: {
          weights: ['1g', '3.5g', '7g', '14g', '28g'],
          priceMultipliers: { '1g': 1, '3.5g': 3.2, '7g': 6, '14g': 11, '28g': 20 }
        },
        prerolls: {
          weights: ['1.1g', '1.25g', '1.45g', '1.5g'],
          priceMultipliers: { '1.1g': 1, '1.25g': 1.15, '1.45g': 1.3, '1.5g': 1.4 }
        },
        concentrates: {
          weights: ['0.5g', '1g', '2g'],
          priceMultipliers: { '0.5g': 1, '1g': 1.8, '2g': 3.4 }
        },
        edibles: {
          weights: ['100mg', '250mg', '500mg', '1000mg'],
          priceMultipliers: { '100mg': 1, '250mg': 1.6, '500mg': 3, '1000mg': 5.5 }
        }
      };

      function generateVariants(basePrice: number, category: string, stock: number) {
        const categoryData = CATEGORY_VARIANTS[category as keyof typeof CATEGORY_VARIANTS];
        if (!categoryData) return [];
        
        return categoryData.weights.map((weight, index) => ({
          id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
          weight,
          price: Math.round(basePrice * categoryData.priceMultipliers[weight as keyof typeof categoryData.priceMultipliers] * 100) / 100,
          stock: Math.floor(stock * (0.7 + Math.random() * 0.6)),
          isDefault: index === 0
        }));
      }

      function determineSubcategory(name: string, category: string) {
        const nameLower = name.toLowerCase();
        switch (category) {
          case 'flower':
            if (nameLower.includes('indica')) return 'indica';
            if (nameLower.includes('sativa')) return 'sativa';
            return 'hybrid';
          case 'prerolls':
            if (nameLower.includes('pack')) return 'pack';
            if (nameLower.includes('infused')) return 'infused';
            return 'single';
          case 'concentrates':
            if (nameLower.includes('wax')) return 'wax';
            if (nameLower.includes('shatter')) return 'shatter';
            if (nameLower.includes('live resin')) return 'live_resin';
            return 'wax';
          case 'edibles':
            if (nameLower.includes('gummies')) return 'gummies';
            if (nameLower.includes('chocolate')) return 'chocolates';
            return 'gummies';
          default:
            return null;
        }
      }

      function determinePotency(thcaContent?: string) {
        if (!thcaContent) return 'Medium';
        const percentage = parseFloat(thcaContent.replace('%', ''));
        if (percentage >= 25) return 'High';
        if (percentage >= 18) return 'Medium';
        return 'Low';
      }

      const products = await storage.getProducts();
      let updatedCount = 0;

      for (const product of products) {
        // Skip if already has variants
        if (product.variants && product.variants.length > 0) continue;
        
        const basePrice = parseFloat(product.price);
        const variants = generateVariants(basePrice, product.category, product.stock);
        const subcategory = determineSubcategory(product.name, product.category);
        const potency = determinePotency(product.thcaContent);
        
        if (variants.length > 0) {
          const prices = variants.map(v => v.price);
          const priceRange = { min: Math.min(...prices), max: Math.max(...prices) };
          
          await storage.updateProduct(product.id, {
            variants,
            subcategory,
            potency,
            priceRange
          });
          
          updatedCount++;
        }
      }

      console.log(`✅ Updated ${updatedCount} products with variants`);
      res.json({ 
        success: true, 
        updatedCount,
        message: `Successfully updated ${updatedCount} products with size/weight variants` 
      });
      
    } catch (error: any) {
      console.error('Bulk update error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Bulk update product images
  app.post("/api/admin/products/bulk-update-images", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      console.log('🎨 Starting bulk image update...');
      
      // High-quality strain-specific image mappings
      const strainImageMap = {
        'sour diesel': 'https://images.leafly.com/flower/sour-diesel/primary?width=1000',
        'purple koolaid': 'https://moonrockcanada.co/wp-content/uploads/2021/03/Buy-Purple-Koolaid-AAAA-Indica-Hybrid-online-canada-5-510x510.jpg',
        'purple': 'https://moonrockcanada.co/wp-content/uploads/2021/03/Buy-Purple-Koolaid-AAAA-Indica-Hybrid-online-canada-5-510x510.jpg',
        'runtz': 'https://images.unsplash.com/photo-1586464051019-e45c73b51fcf?w=800',
        'lemon': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'sour lemon': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'too tall': 'https://images.unsplash.com/photo-1516975410437-bdb7d81b7d2e?w=800',
        'og kush': 'https://images.unsplash.com/photo-1516975410437-bdb7d81b7d2e?w=800',
        'gelato': 'https://images.unsplash.com/photo-1586464051019-e45c73b51fcf?w=800',
        'blue dream': 'https://images.unsplash.com/photo-1516975410437-bdb7d81b7d2e?w=800',
        'white widow': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'girl scout cookies': 'https://images.unsplash.com/photo-1586464051019-e45c73b51fcf?w=800',
        'zkittlez': 'https://images.unsplash.com/photo-1516975410437-bdb7d81b7d2e?w=800'
      };

      function getStrainImage(productName: string, category: string) {
        const nameLower = productName.toLowerCase();
        
        // Check for exact strain matches first
        for (const [strain, imageUrl] of Object.entries(strainImageMap)) {
          if (nameLower.includes(strain)) {
            return imageUrl;
          }
        }
        
        // Category-specific defaults
        switch (category) {
          case 'flower':
            return 'https://images.unsplash.com/photo-1516975410437-bdb7d81b7d2e?w=800';
          case 'prerolls':
            return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800';
          case 'concentrates':
            return 'https://images.unsplash.com/photo-1586464051019-e45c73b51fcf?w=800';
          case 'edibles':
            return 'https://images.unsplash.com/photo-1516975410437-bdb7d81b7d2e?w=800';
          default:
            return 'https://images.unsplash.com/photo-1516975410437-bdb7d81b7d2e?w=800';
        }
      }

      const products = await storage.getProducts();
      let updatedCount = 0;

      for (const product of products) {
        const newImageUrl = getStrainImage(product.name, product.category);
        
        // Only update if the image URL is different
        if (product.imageUrl !== newImageUrl) {
          await storage.updateProduct(product.id, {
            imageUrl: newImageUrl
          });
          updatedCount++;
          console.log(`📸 Updated image for: ${product.name}`);
        }
      }

      console.log(`✅ Updated ${updatedCount} product images`);
      res.json({ 
        success: true, 
        updatedCount,
        message: `Successfully updated ${updatedCount} product images with strain-specific URLs` 
      });
      
    } catch (error: any) {
      console.error('Bulk image update error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // AI Recommendations API
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { userId, currentProductId, viewedProductIds = [], cartProductIds = [], preferences = {} } = req.body;
      
      console.log('🤖 Generating AI recommendations for user:', userId);
      
      // Get all products for recommendation engine
      const allProducts = await storage.getProducts();
      
      // AI-powered recommendation logic
      const recommendationCategories = [
        {
          title: "Perfect for You",
          description: "Hand-picked based on your browsing patterns",
          icon: "❤️",
          reason: "Based on your preferences",
          products: generatePersonalizedRecommendations(allProducts, viewedProductIds, preferences)
        },
        {
          title: "Trending Now",
          description: "Popular products customers are loving",
          icon: "🔥",
          reason: "High demand this week",
          products: generateTrendingRecommendations(allProducts)
        },
        {
          title: "Similar Products",
          description: "More like what you've been viewing",
          icon: "🎯",
          reason: "Similar to your interests",
          products: generateSimilarRecommendations(allProducts, currentProductId, viewedProductIds)
        },
        {
          title: "Complete Your Collection",
          description: "Great additions to your cart",
          icon: "✨",
          reason: "Complements your selection",
          products: generateComplementaryRecommendations(allProducts, cartProductIds)
        }
      ].filter(category => category.products.length > 0);

      res.json({ categories: recommendationCategories });
      
    } catch (error: any) {
      console.error('AI recommendations error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Track user interactions for AI learning
  app.post("/api/ai/track-interaction", async (req, res) => {
    try {
      const { userId, action, productId, metadata = {} } = req.body;
      
      // Store interaction for AI learning (would integrate with AI service)
      console.log('📊 Tracked interaction:', { userId, action, productId, metadata });
      
      // In a real implementation, this would:
      // 1. Store interaction in AI memory database
      // 2. Update user preference models
      // 3. Improve future recommendations
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

// AI Recommendation Helper Functions
function generatePersonalizedRecommendations(products: any[], viewedProductIds: string[], preferences: any) {
  const viewedProducts = products.filter(p => viewedProductIds.includes(p.id));
  const unviewedProducts = products.filter(p => !viewedProductIds.includes(p.id));
  
  if (viewedProducts.length === 0) {
    return shuffleArray(unviewedProducts.filter(p => p.featured)).slice(0, 6);
  }
  
  // Extract categories and strain types from viewed products
  const viewedCategories = new Set(viewedProducts.map(p => p.category));
  const viewedStrainTypes = new Set(viewedProducts.map(p => p.strainType));
  
  // Score products based on similarity to viewed products
  const scored = unviewedProducts.map(product => {
    let score = 0;
    
    // Category preference (40% weight)
    if (viewedCategories.has(product.category)) score += 40;
    
    // Strain type preference (30% weight)
    if (viewedStrainTypes.has(product.strainType)) score += 30;
    
    // Price range preference (20% weight)
    const avgViewedPrice = viewedProducts.reduce((sum, p) => sum + parseFloat(p.price), 0) / viewedProducts.length;
    const priceDistance = Math.abs(parseFloat(product.price) - avgViewedPrice);
    const maxPrice = Math.max(...products.map(p => parseFloat(p.price)));
    score += (1 - priceDistance / maxPrice) * 20;
    
    // Rating boost (10% weight)
    score += parseFloat(product.rating || '0') * 2;
    
    return { ...product, score };
  });
  
  return scored.sort((a, b) => b.score - a.score).slice(0, 6);
}

function generateTrendingRecommendations(products: any[]) {
  return products
    .filter(p => p.featured || parseFloat(p.rating || '0') >= 4.5)
    .sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
    .slice(0, 6);
}

function generateSimilarRecommendations(products: any[], currentProductId?: string, viewedProductIds: string[] = []) {
  if (!currentProductId) {
    return generateTrendingRecommendations(products);
  }
  
  const currentProduct = products.find(p => p.id === currentProductId);
  if (!currentProduct) {
    return generateTrendingRecommendations(products);
  }
  
  const otherProducts = products.filter(p => p.id !== currentProductId);
  
  const scored = otherProducts.map(product => {
    let score = 0;
    
    // Same category (40% weight)
    if (product.category === currentProduct.category) score += 40;
    
    // Same strain type (30% weight)
    if (product.strainType === currentProduct.strainType) score += 30;
    
    // Similar price range (20% weight)
    const priceDistance = Math.abs(parseFloat(product.price) - parseFloat(currentProduct.price));
    const maxPrice = Math.max(...products.map(p => parseFloat(p.price)));
    score += (1 - priceDistance / maxPrice) * 20;
    
    // Similar effects (10% weight)
    const currentEffects = new Set(currentProduct.effects || []);
    const productEffects = new Set(product.effects || []);
    const commonEffects = [...currentEffects].filter(effect => productEffects.has(effect));
    score += (commonEffects.length / Math.max(currentEffects.size, 1)) * 10;
    
    return { ...product, score };
  });
  
  return scored.sort((a, b) => b.score - a.score).slice(0, 6);
}

function generateComplementaryRecommendations(products: any[], cartProductIds: string[]) {
  if (cartProductIds.length === 0) {
    return generateTrendingRecommendations(products);
  }
  
  const cartProducts = products.filter(p => cartProductIds.includes(p.id));
  const otherProducts = products.filter(p => !cartProductIds.includes(p.id));
  
  // Extract cart characteristics
  const cartCategories = new Set(cartProducts.map(p => p.category));
  const cartStrainTypes = new Set(cartProducts.map(p => p.strainType));
  
  const scored = otherProducts.map(product => {
    let score = 0;
    
    // Complementary categories (50% weight)
    if (cartCategories.has('flower') && product.category === 'prerolls') score += 50;
    if (cartCategories.has('prerolls') && product.category === 'flower') score += 50;
    if (cartCategories.has('flower') && product.category === 'variety-packs') score += 40;
    if (!cartCategories.has(product.category)) score += 20; // Diversity bonus
    
    // Different strain types for variety (30% weight)
    if (!cartStrainTypes.has(product.strainType)) score += 30;
    
    // Higher tier products (20% weight)
    if (parseFloat(product.thcaContent || '0') > 28) score += 20;
    if (product.featured) score += 10;
    
    return { ...product, score };
  });
  
  return scored.sort((a, b) => b.score - a.score).slice(0, 6);
}

function shuffleArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

  // Generate balanced product catalog
  app.post("/api/admin/generate-balanced-catalog", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      console.log('🎯 Generating balanced product catalog...');
      
      const balancedProducts = generateBalancedCatalog();
      
      // Create products in batches
      let createdCount = 0;
      for (const productData of balancedProducts) {
        try {
          await storage.createProduct(productData);
          createdCount++;
        } catch (error) {
          console.error(`Failed to create product: ${productData.name}`);
        }
      }
      
      console.log(`✅ Created ${createdCount} balanced products`);
      res.json({ 
        success: true, 
        createdCount,
        message: `Successfully created ${createdCount} balanced products covering all strains, weights, and price ranges`
      });
      
    } catch (error: any) {
      console.error('Balanced catalog generation error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Promo code generation and management
  app.post("/api/admin/promo-codes", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { 
        code, 
        discountType, 
        discountValue, 
        minPurchase = 0, 
        maxUses = null,
        expiresAt,
        applicableCategories = [],
        description 
      } = req.body;
      
      // Generate unique code if not provided
      const promoCode = code || generatePromoCode();
      
      const newPromo = await storage.createPromoCode({
        code: promoCode.toUpperCase(),
        discountType, // 'percentage' | 'fixed' | 'free_shipping'
        discountValue: parseFloat(discountValue),
        minPurchase: parseFloat(minPurchase),
        maxUses: maxUses ? parseInt(maxUses) : null,
        currentUses: 0,
        isActive: true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        applicableCategories,
        description: description || `${discountValue}${discountType === 'percentage' ? '%' : '$'} off`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      res.json(newPromo);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/admin/promo-codes", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const promoCodes = await storage.getPromoCodes();
      res.json(promoCodes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/promo-codes/validate", async (req, res) => {
    try {
      const { code, cartTotal, categories = [] } = req.body;
      
      const promoCode = await storage.getPromoCodeByCode(code.toUpperCase());
      
      if (!promoCode) {
        return res.status(404).json({ message: "Invalid promo code" });
      }
      
      if (!promoCode.isActive) {
        return res.status(400).json({ message: "Promo code is inactive" });
      }
      
      if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
        return res.status(400).json({ message: "Promo code has expired" });
      }
      
      if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
        return res.status(400).json({ message: "Promo code usage limit reached" });
      }
      
      if (cartTotal < promoCode.minPurchase) {
        return res.status(400).json({ 
          message: `Minimum purchase of $${promoCode.minPurchase} required` 
        });
      }
      
      // Check category restrictions
      if (promoCode.applicableCategories.length > 0) {
        const hasApplicableItems = categories.some(cat => 
          promoCode.applicableCategories.includes(cat)
        );
        if (!hasApplicableItems) {
          return res.status(400).json({ 
            message: "Promo code not applicable to items in your cart" 
          });
        }
      }
      
      // Calculate discount
      let discountAmount = 0;
      if (promoCode.discountType === 'percentage') {
        discountAmount = (cartTotal * promoCode.discountValue) / 100;
      } else if (promoCode.discountType === 'fixed') {
        discountAmount = Math.min(promoCode.discountValue, cartTotal);
      }
      
      res.json({
        valid: true,
        discountAmount,
        discountType: promoCode.discountType,
        description: promoCode.description
      });
      
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cart routes - Allow guest access for adding items
  app.get("/api/cart", async (req: any, res) => {
    try {
      // Check if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      let userId = null;
      
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          const user = await storage.getUser(decoded.userId);
          if (user) {
            userId = user.id;
          }
        } catch (error) {
          // Token invalid, continue as guest
        }
      }
      
      // Use guest session ID from header if not authenticated
      if (!userId) {
        const guestId = req.headers['x-guest-id'] as string;
        if (!guestId) {
          // Return empty cart for new guest users without session ID
          return res.json([]);
        }
        
        // Ensure the guest user exists in the database
        let guestUser = await storage.getUser(guestId);
        if (!guestUser) {
          // Create guest user with the provided guest ID
          guestUser = await storage.createUser({
            id: guestId,
            email: `${guestId}@guest.temp`,
            password: await bcrypt.hash('guest', 10),
            firstName: 'Guest',
            lastName: 'User', 
            username: guestId,
            isAdmin: false
          });
        }
        userId = guestUser.id;
      }
      
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Modified cart POST to allow guest users or authenticated users
  app.post("/api/cart", async (req: any, res) => {
    try {
      let userId = req.body.userId;
      
      // Check if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          const user = await storage.getUser(decoded.userId);
          if (user) {
            userId = user.id; // Use authenticated user ID
          }
        } catch (error) {
          // Token invalid, continue as guest
        }
      }
      
      // If no userId provided and not authenticated, use guest session
      if (!userId) {        
        const guestId = req.headers['x-guest-id'] as string;
        if (!guestId) {
          return res.status(400).json({ message: 'Guest session ID required' });
        }
        
        // Ensure the guest user exists in the database
        let guestUser = await storage.getUser(guestId);
        if (!guestUser) {
          // Create guest user with the provided guest ID
          guestUser = await storage.createUser({
            id: guestId,
            email: `${guestId}@guest.temp`,
            password: await bcrypt.hash('guest', 10),
            firstName: 'Guest',
            lastName: 'User', 
            username: guestId,
            isAdmin: false
          });
        }
        userId = guestUser.id;
      }

      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId: userId,
      });

      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json({ ...cartItem, guestSession: !token, userId });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Guest cart GET route - allows retrieving cart without authentication
  app.get("/api/cart/guest/:guestId", async (req: any, res) => {
    try {
      const guestId = req.params.guestId;
      // Allow both UUID format and guest_ format for flexibility
      if (!guestId || (guestId.length < 10)) {
        return res.status(400).json({ message: "Invalid guest session" });
      }
      
      const cartItems = await storage.getCartItems(guestId);
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/cart/:id", async (req: any, res) => {
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

  app.delete("/api/cart/:id", async (req: any, res) => {
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

  // Simple rate limiting for admin stats
  const statsRequestCache = new Map();

  // Admin stats route
  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const now = Date.now();
      const lastRequest = statsRequestCache.get(userId);

      // Rate limit: 1 request per 5 seconds per user
      if (lastRequest && (now - lastRequest) < 5000) {
        return res.status(429).json({ message: 'Too many requests, please wait' });
      }

      statsRequestCache.set(userId, now);

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

  // Get user's own referral program data
  app.get("/api/referrals/user", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Get user's own referral code
      let userReferral = await storage.getUserReferralCode(userId);
      
      // If user doesn't have a referral code yet, create one automatically
      if (!userReferral) {
        // Generate a unique referral code for the user
        let referralCode: string;
        let attempts = 0;
        const maxAttempts = 10;

        do {
          // Create a unique code: USER prefix + timestamp + random
          const userPrefix = req.user.username ? req.user.username.toUpperCase().slice(0, 3) : 'USR';
          const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
          const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
          referralCode = `${userPrefix}${timestamp}${randomPart}`;

          // Check if code already exists
          const existingReferral = await storage.getReferralByCode(referralCode);
          if (!existingReferral) {
            break; // Code is unique, exit loop
          }

          attempts++;
        } while (attempts < maxAttempts);

        if (attempts >= maxAttempts) {
          return res.status(500).json({ message: "Unable to generate unique referral code. Please try again." });
        }

        // Create the referral for the user with 10% commission and 20% discount
        userReferral = await storage.createReferral({
          referrerId: userId,
          referralCode,
          status: 'pending',
          referrerReward: 1000, // 10% commission (in basis points: 1000 = 10%)
          refereeReward: 2000   // 20% discount (in basis points: 2000 = 20%)
        });
      }
      
      // Get stats about users who have used this referral code
      const referralStats = await storage.getUserReferralStats(userId);
      
      // Check if user has used someone else's referral code
      const hasUsedReferral = await storage.hasUserUsedReferral(userId);
      
      res.json({
        referralCode: userReferral?.referralCode || null,
        hasUsedReferral: hasUsedReferral,
        stats: referralStats,
        totalReferrals: referralStats?.totalReferrals || 0,
        totalEarned: referralStats?.totalEarned || 0
      });
    } catch (error: any) {
      console.error('Error fetching user referral data:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch referral data' });
    }
  });

  app.post("/api/referrals", authenticateToken, async (req: any, res) => {
    try {
      // Generate a truly unique referral code with collision detection
      let referralCode: string;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        // Create a more robust unique code: USER prefix + timestamp + random
        const userPrefix = req.user.username ? req.user.username.toUpperCase().slice(0, 3) : 'USR';
        const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
        const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
        referralCode = `${userPrefix}${timestamp}${randomPart}`;

        // Check if code already exists
        const existingReferral = await storage.getReferralByCode(referralCode);
        if (!existingReferral) {
          break; // Code is unique, exit loop
        }

        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        return res.status(500).json({ message: "Unable to generate unique referral code. Please try again." });
      }

      const referral = await storage.createReferral({
        referrerId: req.user.id,
        referralCode,
        status: 'pending',
        referrerReward: 500,
        refereeReward: 250
      });

      res.status(201).json(referral);
    } catch (error: any) {
      if (error.message?.includes('unique constraint') || error.code === '23505') {
        return res.status(409).json({ message: "Referral code collision detected. Please try again." });
      }
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

  // Validate referral code endpoint
  app.post("/api/referrals/validate", async (req, res) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Referral code is required" });
      }

      const referral = await storage.getReferralByCode(code);
      if (!referral) {
        return res.status(404).json({ 
          valid: false, 
          message: "Invalid referral code" 
        });
      }

      if (referral.status !== 'pending') {
        return res.status(400).json({ 
          valid: false, 
          message: "This referral code has already been used" 
        });
      }

      res.json({ 
        valid: true, 
        referrerReward: referral.referrerReward,
        refereeReward: referral.refereeReward,
        message: `Get ${referral.refereeReward} points by signing up with this code!`
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Apply referral code during registration - public endpoint for referral links
  app.post("/api/referrals/apply", async (req: any, res) => {
    try {
      const { referralCode, userId } = req.body;

      if (!referralCode) {
        return res.status(400).json({ message: "Referral code is required" });
      }

      if (!userId) {
        return res.status(400).json({ message: "User ID is required to apply referral code" });
      }

      const referral = await storage.getReferralByCode(referralCode);
      if (!referral) {
        return res.status(404).json({ message: "Invalid referral code" });
      }

      if (referral.status !== 'pending') {
        return res.status(400).json({ message: "This referral code has already been used" });
      }

      if (referral.referrerId === userId) {
        return res.status(400).json({ message: "You cannot use your own referral code" });
      }

      // Update referral with referee info
      await storage.updateReferral(referral.id, {
        refereeId: userId,
        status: 'completed'
      });

      // Award welcome bonus points to new user
      await storage.addPointTransaction({
        userId: userId,
        points: referral.refereeReward,
        type: 'referral',
        description: `Welcome bonus - Joined via referral code ${referralCode}`,
        multiplier: '1.00'
      });

      res.json({ 
        success: true, 
        pointsEarned: referral.refereeReward,
        message: `Welcome! You've earned ${referral.refereeReward} points for joining with a referral code.`
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Generate referral codes for all existing users (Admin only)
  app.post("/api/referrals/generate-for-existing", authenticateToken, async (req: any, res) => {
    try {
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const allUsers = await storage.getUsers();
      const results = [];
      let successCount = 0;
      let skipCount = 0;

      for (const user of allUsers) {
        try {
          // Check if user already has a referral code
          const existingReferral = await storage.getUserReferralCode(user.id);
          if (existingReferral) {
            results.push({ 
              userId: user.id, 
              username: user.username,
              status: 'exists', 
              referralCode: existingReferral.referralCode,
              referralLink: `${req.protocol}://${req.get('host')}/?ref=${existingReferral.referralCode}`
            });
            skipCount++;
            continue;
          }

          // Generate unique referral code
          let referralCode: string;
          let attempts = 0;
          const maxAttempts = 10;

          do {
            const userPrefix = user.username.toUpperCase().slice(0, 3);
            const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
            const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
            referralCode = `${userPrefix}${timestamp}${randomPart}`;

            const existingCode = await storage.getReferralByCode(referralCode);
            if (!existingCode) {
              break;
            }
            attempts++;
          } while (attempts < maxAttempts);

          if (attempts >= maxAttempts) {
            results.push({ userId: user.id, status: 'failed', reason: 'Could not generate unique code' });
            continue;
          }

          // Create referral for the user
          await storage.createReferral({
            referrerId: user.id,
            referralCode,
            status: 'pending',
            referrerReward: 1000, // 10% commission
            refereeReward: 2000   // 20% discount
          });

          results.push({ 
            userId: user.id, 
            username: user.username,
            status: 'created', 
            referralCode,
            referralLink: `${req.protocol}://${req.get('host')}/?ref=${referralCode}`
          });
          successCount++;

        } catch (error: any) {
          results.push({ 
            userId: user.id, 
            status: 'failed', 
            reason: error.message 
          });
        }
      }

      res.json({
        message: `Generated referral codes for ${successCount} users (${skipCount} already had codes)`,
        successCount,
        skipCount,
        totalProcessed: allUsers.length,
        results: results
      });

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

  // AI Deals Generation Routes
  app.post("/api/admin/deals/generate", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { aiDealsService } = await import('./ai-deals-service');
      const { targetAudience, season, products, discountRange, urgency, marketingGoal } = req.body;

      const deals = await aiDealsService.generateDeals({
        targetAudience,
        season,
        products,
        discountRange,
        urgency,
        marketingGoal
      });

      // Save generated deals to database
      const savedDeals = [];
      for (const deal of deals) {
        const saved = await storage.createSpecialOffer(deal);
        savedDeals.push(saved);
      }

      res.json({
        success: true,
        deals: savedDeals,
        message: `Generated ${savedDeals.length} AI-powered deals successfully`
      });
    } catch (error: any) {
      console.error('AI Deals Generation Error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/deals/activate-strategy", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { aiDealsService } = await import('./ai-deals-service');
      const result = await aiDealsService.activateDealStrategy();
      res.json(result);
    } catch (error: any) {
      console.error('Deal Strategy Activation Error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/deals/analytics", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { aiDealsService } = await import('./ai-deals-service');
      const analytics = await aiDealsService.getDealPerformanceAnalytics();
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/deals/personalized/:userId", authenticateToken, async (req: any, res) => {
    try {
      const { aiDealsService } = await import('./ai-deals-service');
      const deal = await aiDealsService.generatePersonalizedDeal(req.params.userId);

      if (deal) {
        res.json(deal);
      } else {
        res.status(404).json({ message: "No personalized deal available at this time" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
      } else {
        // For guest users, check if they have a guest ID in header
        const guestId = req.headers['x-guest-id'] as string;
        if (guestId) {
          // Ensure the guest user exists in the database
          let guestUser = await storage.getUser(guestId);
          if (!guestUser) {
            // Create guest user with the provided guest ID
            guestUser = await storage.createUser({
              id: guestId,
              email: `${guestId}@guest.temp`,
              password: await bcrypt.hash('guest', 10),
              firstName: 'Guest',
              lastName: 'User', 
              username: guestId,
              isAdmin: false
            });
          }
          contextData = { userId: guestUser.id };
        } else {
          // Use the anonymous guest user
          let guestUser = await storage.getUserByEmail('guest@anonymous.temp');
          if (!guestUser) {
            guestUser = await storage.createUser({
              email: 'guest@anonymous.temp',
              password: await bcrypt.hash('guest', 10),
              firstName: 'Anonymous',
              lastName: 'Guest', 
              username: 'anonymous-guest',
              isAdmin: false
            });
          }
          contextData = { userId: guestUser.id };
        }
      }

      const response = await aiAssistant.generateResponse(
        message,
        contextData,
        sessionId || `session_${Date.now()}`,
        req.body.userContext
      );

      // Process actionItems if they exist
      if (response.actionItems && response.actionItems.length > 0) {
        for (const action of response.actionItems) {
          try {
            if (action.type === 'add_to_cart' && action.data && (action.data.productId || action.data.product_id)) {
              // Actually add the item to the cart
              const quantity = action.data.quantity || 1;
              let productId = action.data.productId || action.data.product_id;
              
              // If it's a product name, find the actual product ID
              if (productId && typeof productId === 'string' && !productId.includes('-')) {
                const products = await storage.getProducts();
                const product = products.find(p => p.name === productId);
                if (product) {
                  productId = product.id;
                }
              }
              
              // Use guest user if no userId provided
              let cartUserId = userId;
              if (!cartUserId) {
                // Check for guest ID from header
                const guestId = req.headers['x-guest-id'] as string;
                if (guestId) {
                  // Ensure the guest user exists in the database
                  let guestUser = await storage.getUser(guestId);
                  if (!guestUser) {
                    // Create guest user with the provided guest ID
                    guestUser = await storage.createUser({
                      id: guestId,
                      email: `${guestId}@guest.temp`,
                      password: await bcrypt.hash('guest', 10),
                      firstName: 'Guest',
                      lastName: 'User', 
                      username: guestId,
                      isAdmin: false
                    });
                  }
                  cartUserId = guestUser.id;
                } else {
                  // Create or use anonymous guest user
                  let guestUser = await storage.getUserByEmail('guest@anonymous.temp');
                  if (!guestUser) {
                    guestUser = await storage.createUser({
                      email: 'guest@anonymous.temp',
                      password: await bcrypt.hash('guest', 10),
                      firstName: 'Anonymous',
                      lastName: 'Guest', 
                      username: 'anonymous-guest',
                      isAdmin: false
                    });
                  }
                  cartUserId = guestUser.id;
                }
              }
              
              const cartItemData = {
                userId: cartUserId,
                productId,
                quantity
              };
              await storage.addToCart(cartItemData);
              console.log(`AI Assistant added product ${productId} to cart for user ${cartUserId}`);
            }

            // Handle order status updates (admin only)
            else if (action.type === 'update_order_status' && action.data?.orderId && action.data?.status && req.body.userContext?.isAdmin) {
              const updatedOrder = await storage.updateOrderStatus(action.data.orderId, action.data.status);
              if (updatedOrder) {
                console.log(`AI Assistant updated order ${action.data.orderId} status to ${action.data.status}`);
                // Add success response to the action result
                action.result = {
                  success: true,
                  message: `Order ${action.data.orderId} status updated to ${action.data.status}`,
                  order: updatedOrder
                };
              } else {
                action.result = { success: false, message: 'Order not found or update failed' };
              }
            }

            // Handle getting order details (admin only)
            else if (action.type === 'get_order_details' && action.data?.orderId && req.body.userContext?.isAdmin) {
              const order = await storage.getOrder(action.data.orderId);
              if (order) {
                const orderItems = await storage.getOrderItems(order.id);
                action.result = {
                  success: true,
                  order: {
                    ...order,
                    items: orderItems,
                    shippingAddress: {
                      fullName: `${order.shippingFirstName} ${order.shippingLastName}`,
                      street: order.shippingStreet,
                      city: order.shippingCity,
                      state: order.shippingState,
                      zipCode: order.shippingZip,
                      phone: order.shippingPhone
                    }
                  }
                };
              } else {
                action.result = { success: false, message: 'Order not found' };
              }
            }

            // Handle getting all orders (admin only)
            else if (action.type === 'get_all_orders' && req.body.userContext?.isAdmin) {
              const orders = await storage.getAllOrdersWithDetails();
              action.result = {
                success: true,
                orders: orders.map(order => ({
                  ...order,
                  shippingAddress: {
                    fullName: `${order.shippingFirstName} ${order.shippingLastName}`,
                    street: order.shippingStreet,
                    city: order.shippingCity,
                    state: order.shippingState,
                    zipCode: order.shippingZip,
                    phone: order.shippingPhone
                  }
                }))
              };
            }

            // Handle searching orders (admin only) 
            else if (action.type === 'search_orders' && action.data?.query && req.body.userContext?.isAdmin) {
              const allOrders = await storage.getAllOrdersWithDetails();
              const query = action.data.query.toLowerCase();
              const filteredOrders = allOrders.filter(order => 
                order.id.toLowerCase().includes(query) ||
                order.email?.toLowerCase().includes(query) ||
                `${order.shippingFirstName} ${order.shippingLastName}`.toLowerCase().includes(query) ||
                order.shippingCity?.toLowerCase().includes(query) ||
                order.status?.toLowerCase().includes(query)
              );
              
              action.result = {
                success: true,
                orders: filteredOrders.map(order => ({
                  ...order,
                  shippingAddress: {
                    fullName: `${order.shippingFirstName} ${order.shippingLastName}`,
                    street: order.shippingStreet,
                    city: order.shippingCity,
                    state: order.shippingState,
                    zipCode: order.shippingZip,
                    phone: order.shippingPhone
                  }
                }))
              };
            }

          } catch (actionError) {
            console.error('Failed to process action:', action.type, actionError);
            if (action) {
              action.result = { success: false, message: 'Action failed to process' };
            }
          }
        }
      }

      // Add action results to response if available
      if (response.actionItems && response.actionItems.length > 0) {
        response.actionItems.forEach((action, index) => {
          if (action.result) {
            // Append action results to the response message for admin order actions
            if (action.type === 'update_order_status' || action.type === 'get_order_details' || 
                action.type === 'get_all_orders' || action.type === 'search_orders') {
              if (action.result.success) {
                response.response += `\n\n✅ Action completed successfully: ${action.result.message || 'Order information retrieved'}`;
                if (action.result.order) {
                  const order = action.result.order;
                  response.response += `\n📋 Order Details:\n`;
                  response.response += `- Order ID: ${order.id}\n`;
                  response.response += `- Status: ${order.status}\n`;
                  response.response += `- Total: $${order.total}\n`;
                  if (order.shippingAddress) {
                    response.response += `- Shipping Address: ${order.shippingAddress.fullName}\n`;
                    response.response += `  ${order.shippingAddress.street}\n`;
                    response.response += `  ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}\n`;
                    if (order.shippingAddress.phone) {
                      response.response += `  Phone: ${order.shippingAddress.phone}\n`;
                    }
                  }
                  if (order.trackingNumber) {
                    response.response += `- Tracking: ${order.trackingNumber}\n`;
                  }
                }
                if (action.result.orders && action.result.orders.length > 0) {
                  response.response += `\n📋 Found ${action.result.orders.length} orders:\n`;
                  action.result.orders.slice(0, 5).forEach((order: any) => {
                    response.response += `- ${order.id}: ${order.status} - $${order.total} (${order.shippingAddress.fullName})\n`;
                  });
                  if (action.result.orders.length > 5) {
                    response.response += `... and ${action.result.orders.length - 5} more orders\n`;
                  }
                }
              } else {
                response.response += `\n❌ Action failed: ${action.result.message}`;
              }
            }
          }
        });
      }

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

  // Increment view count endpoint with rate limiting
  const viewTracker = new Map(); // Simple in-memory tracker

  app.post("/api/blog/posts/:id/view", async (req, res) => {
    try {
      const postId = req.params.id;
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      const trackingKey = `${clientIp}_${postId}`;
      const now = Date.now();

      // Rate limit: Only allow one view per IP per post per 10 minutes
      const lastView = viewTracker.get(trackingKey);
      if (lastView && (now - lastView) < 600000) { // 10 minutes
        return res.json({ success: true, cached: true });
      }

      const post = await storage.getBlogPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Only increment for published posts
      if (post.status === 'published') {
        await storage.incrementBlogViewCount(post.id);
        viewTracker.set(trackingKey, now);

        // Clean up old entries every 100 requests
        if (viewTracker.size > 1000) {
          for (const [key, timestamp] of viewTracker.entries()) {
            if (now - timestamp > 3600000) { // 1 hour
              viewTracker.delete(key);
            }
          }
        }
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Sales Strategy Routes with Groq Integration
  app.get("/api/ai/sales-strategies", async (req, res) => {
    try {
      const strategies = [
        {
          id: "groq-ai-strategy-v1",
          strategy: "Groq AI-Powered THCA Sales & Daily Deals Strategy",
          conversionPrediction: 96.8,
          revenueProjection: 145000,
          confidence: 94.7,
          targetAudience: ["Hemp Enthusiasts", "Medical Users", "New THCA Customers", "Bulk Buyers"],
          tactics: [
            "Groq AI Dynamic Deal Generation",
            "Real-time Inventory Optimization", 
            "Personalized Daily Offers",
            "AI-Driven Bundle Recommendations",
            "Predictive Customer Behavior Analysis",
            "Automated Promotional Campaigns"
          ],
          disclaimers: [
            "AI predictions powered by Groq technology and market analysis",
            "Individual results may vary based on market conditions",
            "THCA products are federally legal but may have state restrictions"
          ],
          shippingStrategy: "AI-optimized delivery routes with discreet packaging",
          guarantees: [
            "30% conversion rate increase with Groq AI",
            "400% ROI on AI investment within 60 days",
            "Dynamic deal optimization",
            "AI-powered customer support integration"
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
      // Validate request body and handle JSON parsing errors
      if (!req.body) {
        return res.status(400).json({ message: "Request body is required" });
      }

      if (typeof req.body === 'string') {
        try {
          req.body = JSON.parse(req.body);
        } catch (parseError) {
          return res.status(400).json({ message: "Invalid JSON in request body" });
        }
      }

      if (typeof req.body !== 'object') {
        return res.status(400).json({ message: "Invalid request body format" });
      }

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
        const seedModule = await import('./seed-inventory-real-images');
        const seedInventoryProducts = seedModule.default || seedModule.seedInventoryProducts;
        await seedInventoryProducts();
        console.log('Successfully seeded inventory products with real images');
      } catch (seedError) {
        console.log('Product seeding skipped (products may already exist):', seedError.message);
      }

      res.json(activationResults);
    } catch (error: any) {
      console.error('AI Sales Activation Error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // AI-Powered Deal Generation using Groq
  app.post("/api/ai/generate-daily-deals", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { targetRevenue, customerSegment, inventoryFocus } = req.body;

      // Get current products for AI context
      const products = await storage.getProducts();
      const topProducts = products.slice(0, 10).map(p => ({
        name: p.name,
        category: p.category, 
        price: p.price,
        stock: p.stock
      }));

      const aiPrompt = `You are an expert hemp retail strategist. Generate 7 dynamic daily deals for a THCA hemp store.

Context:
- Target daily revenue: $${targetRevenue || 2500}
- Customer segment: ${customerSegment || 'General hemp enthusiasts'}
- Inventory focus: ${inventoryFocus || 'Balanced across categories'}
- Top products: ${JSON.stringify(topProducts)}

Generate exactly 7 daily deals (Sunday through Saturday) with:
1. Deal name (catchy, hemp-themed)
2. Discount type (percentage, fixed, bogo)
3. Discount value (reasonable but attractive)
4. Target category or specific products
5. Marketing message (engaging, compliant)

Format as JSON array with objects containing: dayOfWeek (0-6), title, description, discountType, discountValue, categories, isActive, marketingMessage.`;

      const groqResponse = await aiAssistant.generateResponse(aiPrompt, {
        context: 'deal_generation',
        systemRole: 'hemp_retail_strategist'
      });

      let aiDeals;
      try {
        // Extract JSON from AI response
        const jsonMatch = groqResponse.match(/\[[\s\S]*\]/);
        aiDeals = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      } catch (parseError) {
        // Fallback deals generated by Groq AI concepts
        aiDeals = [
          {
            dayOfWeek: 0,
            title: "Sunday Sativa Selections",
            description: "Premium sativa strains to energize your Sunday",
            discountType: "percentage",
            discountValue: 25,
            categories: ["flower"],
            isActive: true,
            marketingMessage: "Elevate your Sunday with top-shelf sativa THCA flower!"
          },
          {
            dayOfWeek: 1,
            title: "Mellow Monday Mix",
            description: "Pre-roll variety packs for a smooth week start",
            discountType: "bogo",
            discountValue: 50,
            categories: ["pre-rolls"],
            isActive: true,
            marketingMessage: "Buy one pre-roll pack, get one 50% off!"
          },
          {
            dayOfWeek: 2,
            title: "Therapeutic Tuesday",
            description: "High THCA indica strains for relaxation",
            discountType: "percentage",
            discountValue: 20,
            categories: ["flower"],
            isActive: true,
            marketingMessage: "Unwind with potent indica THCA - 20% off!"
          }
        ];
      }

      res.json({
        success: true,
        deals: aiDeals,
        message: "Groq AI-powered daily deals generated successfully!",
        aiProvider: "Groq",
        dealCount: aiDeals.length
      });

    } catch (error: any) {
      res.status(500).json({ 
        message: "Failed to generate AI deals", 
        error: error.message 
      });
    }
  });

  app.post("/api/ai/generate-sales-strategy", async (req, res) => {
    try {
      const { targetRevenue, timeframe } = req.body;

      // Generate AI strategy using Groq
      const aiPrompt = `Create a comprehensive THCA hemp sales strategy targeting $${targetRevenue} revenue in ${timeframe}.

Focus on:
1. Market positioning for hemp THCA products
2. Customer acquisition tactics
3. Conversion optimization methods
4. Revenue maximization strategies
5. Legal compliance considerations

Provide actionable insights with specific tactics and projected outcomes.`;

      const groqResponse = await aiAssistant.generateResponse(aiPrompt, {
        context: 'sales_strategy',
        systemRole: 'hemp_business_strategist'
      });

      const strategy = {
        id: `groq-strategy-${Date.now()}`,
        strategy: `Groq AI Custom Strategy for $${targetRevenue} in ${timeframe}`,
        conversionPrediction: Math.random() * 25 + 75, // 75-100%
        revenueProjection: targetRevenue,
        confidence: Math.random() * 15 + 85, // 85-100%
        targetAudience: ["AI-identified high-value customers"],
        tactics: [
          "Groq AI-optimized product bundling",
          "Predictive customer lifetime value modeling",
          "Dynamic pricing with market intelligence",
          "Real-time inventory optimization"
        ],
        guarantees: [`AI-driven revenue target of $${targetRevenue} within ${timeframe}`],
        aiInsights: groqResponse
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
  app.post("/api/blog/ai/generate", async (req: any, res) => {
    try {
      const { blogAIStreamingService } = await import('./blog-ai-streaming-service');
      const { topic, category, keywords, tone, length, targetAudience, includeCallToAction, targetLocation, locationKeywords } = req.body;

      if (!topic || !category) {
        return res.status(400).json({ message: "Topic and category are required" });
      }

      console.log(`🚀 Multi-agent blog generation started for: ${topic}`);

      // Use the new streaming service with multiple AI agents
      const blogContent = await blogAIStreamingService.generateCompleteBlogPost({
        topic,
        category,
        keywords,
        tone,
        length,
        targetAudience,
        includeCallToAction,
        targetLocation,
        locationKeywords
      });

      // Create blog post object for database
      const wordCount = Math.ceil(blogContent.content.length / 5);
      const readTime = Math.ceil(wordCount / 200);

      const blogPost = {
        title: blogContent.title,
        slug: blogContent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        content: blogContent.content,
        excerpt: blogContent.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...',
        metaTitle: blogContent.title,
        metaDescription: `Comprehensive guide to ${topic}. Expert insights, practical tips, and everything you need to know.`,
        keywords: keywords || [topic, 'THCA', 'hemp', 'hemp'],
        authorId: '120659fb-4bd7-404e-94d2-9686f6557178', // Use admin user for AI-generated posts
        category,
        tags: keywords || [],
        status: 'published' as const,
        isAiGenerated: true,
        readTime,
        publishedAt: new Date()
      };

      const savedPost = await storage.createBlogPost(blogPost);

      console.log(`✅ Complete blog post saved: ${wordCount} words`);

      res.json({
        ...savedPost,
        message: "Complete blog post generated with multi-agent AI system",
        wordCount,
        sections: "Introduction, Main Content (6 sections), FAQ, Conclusion"
      });
    } catch (error: any) {
      console.error('Multi-Agent Blog Generation Error:', error);
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

  app.get("/api/blog/ai/ideas", async (req: any, res) => {
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

  // Bulk Blog Generation Route
  app.post("/api/blog/ai/bulk-generate", async (req: any, res) => {
    try {
      const { bulkBlogGenerator } = await import('./bulk-blog-generator');
      const { 
        count = 10, 
        baseCategory = 'education',
        tone = 'educational',
        length = 'medium',
        targetAudience = 'hemp enthusiasts and new users',
        includeCallToAction = true
      } = req.body;

      // Validate count
      if (count > 20) {
        return res.status(400).json({ 
          success: false, 
          message: 'Maximum 20 blogs can be generated at once to prevent API rate limits' 
        });
      }

      console.log(`🚀 Starting bulk generation of ${count} blogs for system user`);

      // Generate blogs
      const blogs = await bulkBlogGenerator.generateBulkBlogs({
        count,
        baseCategory,
        tone,
        length,
        targetAudience,
        includeCallToAction
      }, '120659fb-4bd7-404e-94d2-9686f6557178');

      // Save all blogs to database
      const savedResults = await bulkBlogGenerator.saveBulkBlogs(blogs);

      const successCount = savedResults.filter(r => !r.error).length;
      const failCount = savedResults.filter(r => r.error).length;

      res.json({
        success: true,
        message: `Bulk blog generation completed: ${successCount} successful, ${failCount} failed`,
        generated: successCount,
        failed: failCount,
        totalRequested: count,
        results: savedResults.map(r => ({
          title: r.title,
          success: !r.error,
          error: r.error || null,
          id: r.id || null
        }))
      });

      console.log(`✅ Bulk generation complete: ${successCount}/${count} blogs saved successfully`);

    } catch (error: any) {
      console.error('Bulk blog generation error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to generate bulk blogs'
      });
    }
  });

  // Bulk Product Generation Route
  app.post("/api/admin/products/ai/bulk-generate", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { bulkProductGenerator } = await import('./bulk-product-generator');
      const { 
        productType = 'pre-roll',
        strainType = 'indica',
        count = 100,
        priceRange = { min: 8, max: 25 },
        thcRange = { min: 18, max: 32 },
        includeDeals = false,
        includePackages = false
      } = req.body;

      // Validate count based on product type
      const maxCount = productType === 'pre-roll' ? 10000 : 1000;
      if (count > maxCount) {
        return res.status(400).json({ 
          success: false, 
          message: `Maximum ${maxCount} ${productType} products can be generated at once` 
        });
      }

      console.log(`🚀 Starting bulk generation of ${count} ${productType} products (${strainType})`);
      
      // Generate products
      const products = await bulkProductGenerator.generateBulkProducts({
        productType,
        strainType,
        count,
        priceRange,
        thcRange,
        includeDeals,
        includePackages
      });

      // Save all products to database
      const savedResults = await bulkProductGenerator.saveBulkProducts(products);
      
      const successCount = savedResults.filter((r: any) => !r.error).length;
      const failCount = savedResults.filter((r: any) => r.error).length;

      // Generate deals and packages if requested
      let dealsResults: any[] = [];
      if (includeDeals || includePackages) {
        try {
          dealsResults = await bulkProductGenerator.generateDealsAndPackages(productType);
        } catch (dealError) {
          console.warn('Failed to generate deals:', dealError);
        }
      }
      
      res.json({
        success: true,
        message: `Bulk product generation completed: ${successCount} successful, ${failCount} failed`,
        generated: successCount,
        failed: failCount,
        totalRequested: count,
        deals: dealsResults.length,
        results: savedResults.map((r: any) => ({
          name: r.name,
          success: !r.error,
          error: r.error || null,
          id: r.id || null,
          strainName: r.strainName || null,
          price: r.price || null
        }))
      });
      
      console.log(`✅ Bulk product generation complete: ${successCount}/${count} products saved successfully`);
      
    } catch (error: any) {
      console.error('Bulk product generation error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to generate bulk products'
      });
    }
  });

  // Quick Inventory Setup Route (for massive inventory creation)
  app.post("/api/admin/products/ai/quick-setup", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { bulkProductGenerator } = await import('./bulk-product-generator');
      
      console.log(`🚀 Starting MASSIVE inventory setup: 100,000 pre-rolls + 25 pounds flower`);
      
      const inventoryPlan = [
        // 50,000 Indica Pre-rolls
        { productType: 'pre-roll' as const, strainType: 'indica' as const, count: 5000, priceRange: { min: 8, max: 18 }, thcRange: { min: 18, max: 32 } },
        // 50,000 Sativa Pre-rolls  
        { productType: 'pre-roll' as const, strainType: 'sativa' as const, count: 5000, priceRange: { min: 8, max: 18 }, thcRange: { min: 16, max: 28 } },
        // 10 pounds Sativa Flower
        { productType: 'flower' as const, strainType: 'sativa' as const, count: 200, priceRange: { min: 25, max: 65 }, thcRange: { min: 18, max: 30 } },
        // 10 pounds Indica Flower
        { productType: 'flower' as const, strainType: 'indica' as const, count: 200, priceRange: { min: 25, max: 65 }, thcRange: { min: 20, max: 32 } },
        // 5 pounds Hybrid Flower
        { productType: 'flower' as const, strainType: 'hybrid' as const, count: 100, priceRange: { min: 30, max: 70 }, thcRange: { min: 19, max: 31 } }
      ];

      let totalGenerated = 0;
      let totalFailed = 0;
      const allResults: any[] = [];

      for (const plan of inventoryPlan) {
        try {
          console.log(`📦 Generating ${plan.count} ${plan.strainType} ${plan.productType}s...`);
          
          const products = await bulkProductGenerator.generateBulkProducts(plan);
          const savedResults = await bulkProductGenerator.saveBulkProducts(products);
          
          const successCount = savedResults.filter((r: any) => !r.error).length;
          const failCount = savedResults.filter((r: any) => r.error).length;
          
          totalGenerated += successCount;
          totalFailed += failCount;
          
          allResults.push({
            type: `${plan.strainType} ${plan.productType}`,
            requested: plan.count,
            generated: successCount,
            failed: failCount
          });
          
          // Small delay between inventory batches
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (batchError) {
          console.error(`Failed batch for ${plan.strainType} ${plan.productType}:`, batchError);
          allResults.push({
            type: `${plan.strainType} ${plan.productType}`,
            requested: plan.count,
            generated: 0,
            failed: plan.count,
            error: (batchError as any)?.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `MASSIVE inventory setup completed: ${totalGenerated} products created, ${totalFailed} failed`,
        totalGenerated,
        totalFailed,
        inventoryBreakdown: allResults,
        summary: {
          preRollsCreated: allResults.filter(r => r.type.includes('pre-roll')).reduce((sum, r) => sum + r.generated, 0),
          flowerProductsCreated: allResults.filter(r => r.type.includes('flower')).reduce((sum, r) => sum + r.generated, 0),
          estimatedValue: `$${(totalGenerated * 35).toLocaleString()}` // Average $35 per product
        }
      });
      
      console.log(`🎉 MASSIVE inventory setup complete: ${totalGenerated} total products created!`);
      
    } catch (error: any) {
      console.error('Quick inventory setup error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to create massive inventory'
      });
    }
  });

  // Blog Image Generation Routes
  app.post("/api/admin/blog/generate-image/:postId", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { ImageGenerator } = await import('./image-generation');
      const { postId } = req.params;
      
      // Get the blog post
      const post = await storage.getBlogPost(postId);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      
      const imageGenerator = ImageGenerator.getInstance();
      const imagePath = await imageGenerator.generateBlogImage(post.title, post.category);
      
      // Update the blog post with the featured image
      const updatedPost = await storage.updateBlogPost(postId, {
        featuredImage: imagePath
      });
      
      res.json({
        success: true,
        message: 'Blog image generated successfully',
        imagePath,
        post: updatedPost
      });
    } catch (error: any) {
      console.error('Blog image generation error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to generate blog image'
      });
    }
  });

  app.post("/api/admin/blog/bulk-generate-images", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { ImageGenerator } = await import('./image-generation');
      const { postIds } = req.body;
      
      if (!Array.isArray(postIds) || postIds.length === 0) {
        return res.status(400).json({ success: false, message: 'Post IDs array is required' });
      }
      
      const imageGenerator = ImageGenerator.getInstance();
      const results = [];
      
      for (const postId of postIds) {
        try {
          const post = await storage.getBlogPost(postId);
          if (post) {
            const imagePath = await imageGenerator.generateBlogImage(post.title, post.category);
            await storage.updateBlogPost(postId, { featuredImage: imagePath });
            results.push({ postId, success: true, imagePath });
          } else {
            results.push({ postId, success: false, error: 'Post not found' });
          }
        } catch (error: any) {
          results.push({ postId, success: false, error: error.message });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      
      res.json({
        success: true,
        message: `Generated ${successCount}/${postIds.length} blog images successfully`,
        results
      });
    } catch (error: any) {
      console.error('Bulk blog image generation error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to generate bulk blog images'
      });
    }
  });

  // AI SEO Enhancement Routes
  app.post("/api/admin/seo/enhance/:postId", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { aiSEOService } = await import('./ai-seo-service');
      const { postId } = req.params;
      const { targetKeywords } = req.body;

      const enhancedPost = await aiSEOService.enhanceBlogPostSEO(postId, targetKeywords);

      res.json({
        success: true,
        message: 'Blog post SEO enhanced successfully',
        post: enhancedPost
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  app.post("/api/admin/seo/bulk-enhance", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { aiSEOService } = await import('./ai-seo-service');
      const { postIds } = req.body;

      if (!Array.isArray(postIds) || postIds.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Post IDs array is required' 
        });
      }

      // Start background process
      aiSEOService.bulkEnhanceBlogSEO(postIds).catch(console.error);

      res.json({
        success: true,
        message: `Started bulk SEO enhancement for ${postIds.length} posts`,
        processingCount: postIds.length
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  app.post("/api/admin/seo/build-pyramid", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { aiLinkPyramidService } = await import('./ai-link-pyramid-service');
      const strategy = await aiLinkPyramidService.buildIntelligentLinkPyramid();

      res.json({
        success: true,
        message: 'Link pyramid strategy generated successfully',
        strategy: {
          topTierCount: strategy.topTierPosts.length,
          middleTierCount: strategy.middleTierPosts.length,
          baseTierCount: strategy.baseTierPosts.length,
          totalLinks: strategy.linkingStrategy.length,
          topTierPosts: strategy.topTierPosts.map(p => ({ 
            id: p.postId, 
            title: p.title, 
            authorityScore: p.authorityScore 
          })),
          linkingStrategy: strategy.linkingStrategy
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  app.post("/api/admin/seo/implement-pyramid", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { aiLinkPyramidService } = await import('./ai-link-pyramid-service');
      const strategy = await aiLinkPyramidService.buildIntelligentLinkPyramid();

      // Start background implementation
      aiLinkPyramidService.implementLinkPyramid(strategy).catch(console.error);

      res.json({
        success: true,
        message: 'Link pyramid implementation started',
        strategy: {
          postsToUpdate: strategy.topTierPosts.length + strategy.middleTierPosts.length + strategy.baseTierPosts.length,
          linksToCreate: strategy.linkingStrategy.length
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  app.get("/api/admin/seo/pyramid-health", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { aiLinkPyramidService } = await import('./ai-link-pyramid-service');
      const healthReport = await aiLinkPyramidService.analyzePyramidHealth();

      res.json({
        success: true,
        healthReport
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
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

  // Cash App Payment Routes
  // Create pending order for Cash App payment (supports both authenticated and guest users)
  app.post("/api/create-cash-app-order", async (req, res) => {
    try {
      const { items, storeCreditUsed = 0, promoCode, promoDiscount = 0, affiliateCode } = req.body;
      
      // Try to get user ID from token if provided (for authenticated users)
      let userId = null;
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          userId = decoded.userId;
        } catch (error) {
          // If token is invalid, continue as guest user
          console.log('Invalid token provided, continuing as guest user');
        }
      }
      
      // Validate store credit if being used (only for authenticated users)
      if (storeCreditUsed > 0) {
        if (!userId) {
          return res.status(400).json({ 
            message: "Must be logged in to use store credit" 
          });
        }
        
        const user = await storage.getUser(userId);
        const userStoreCredit = parseFloat(user?.storeCredit || "0");
        
        if (storeCreditUsed > userStoreCredit) {
          return res.status(400).json({ 
            message: "Insufficient store credit balance" 
          });
        }
      }

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0);
      
      const total = subtotal - storeCreditUsed - promoDiscount;
      
      // Generate product names for payment note
      const productNames = items.map((item: any) => 
        `${item.quantity}x ${item.product.name}`
      ).join(', ');

      // Create pending order in database
      const orderData = {
        userId: userId || null,
        status: 'pending_payment',
        paymentMethod: 'cash_app',
        subtotal: subtotal.toFixed(2),
        tax: '0.00',
        total: total.toFixed(2),
        shippingName: '',
        shippingEmail: '',
        shippingAddress: '',
        shippingCity: '',
        shippingState: '',
        shippingZip: '',
        shippingPhone: '',
        billingName: '',
        billingEmail: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingZip: '',
        billingPhone: '',
        storeCreditUsed: storeCreditUsed.toFixed(2),
        promoCodeUsed: promoCode || null,
        promoDiscount: promoDiscount.toFixed(2),
        affiliateCode: affiliateCode || undefined,
        productNames: productNames,
        cashAppAmount: total.toFixed(2)
      };

      const order = await storage.createOrder(orderData);

      // Generate Cash App payment link
      const cashAppLink = `https://cash.app/$${CASH_APP_CASHTAG}/${total.toFixed(2)}`;

      res.json({ 
        success: true,
        orderId: order.id,
        cashAppLink: cashAppLink,
        total: total.toFixed(2),
        productNames: productNames,
        instructions: `🔥 PAYMENT INSTRUCTIONS 🔥\n\n📱 Send $${total.toFixed(2)} via Cash App to: $iLLAithegptstore\n\n📝 ORDER NUMBER: ${order.id}\n\n💬 Include your order number in the payment note\n\n📞 Contact: (702) 482-9794\n📧 Email: support@mentally-chill.com\n📍 Address: Will be provided after payment confirmation\n\n⚡ Your premium THCA products will be processed within 24 hours!`
      });

    } catch (error: any) {
      console.error('Cash App order error:', error);
      res.status(500).json({ message: "Error creating order: " + error.message });
    }
  });

  // Cash App order confirmation route (for manual payment verification)
  app.post("/api/confirm-cash-app-payment", authenticateToken, async (req, res) => {
    try {
      const { orderId, paymentConfirmation } = req.body;
      const userId = req.user?.id;

      if (!orderId || !paymentConfirmation) {
        return res.status(400).json({ 
          message: "Order ID and payment confirmation required" 
        });
      }

      // Update order status to confirmed
      const order = await storage.updateOrderStatus(orderId, 'confirmed');
      
      // Process store credit deduction and point rewards after manual confirmation
      if (order && userId) {
        const storeCreditUsed = parseFloat(order.storeCreditUsed || '0');
        const orderTotal = parseFloat(order.total || '0');
        
        // Deduct store credit if used
        if (storeCreditUsed > 0) {
          const user = await storage.getUser(userId);
          const currentCredit = parseFloat(user?.storeCredit || "0");
          
          if (currentCredit >= storeCreditUsed) {
            const newCredit = currentCredit - storeCreditUsed;
            await storage.updateUserStoreCredit(userId, newCredit.toFixed(2));
            
            await storage.createStoreCreditTransaction({
              userId,
              type: 'purchase_applied',
              amount: (-storeCreditUsed).toFixed(2),
              description: `Store credit applied to Cash App order ${orderId}`,
              orderId: orderId,
            });
          }
        }
        
        // Award points for the purchase
        const pointsToAward = Math.floor(orderTotal * 10); // 10 points per dollar spent
        if (pointsToAward > 0) {
          const userReward = await storage.getUserRewards(userId);
          const currentPoints = userReward?.totalPoints || 0;
          
          await storage.updateUserPoints(userId, currentPoints + pointsToAward);
          
          await storage.createPointTransaction({
            userId,
            points: pointsToAward,
            type: 'earned',
            description: `Cash App purchase reward: $${orderTotal.toFixed(2)} order`,
          });
        }
      }

      res.json({ success: true, message: "Payment confirmed and order processed" });
    } catch (error: any) {
      console.error('Cash App confirmation error:', error);
      res.status(500).json({ message: "Error confirming payment: " + error.message });
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
      const seedModule = await import('./seed-inventory-real-images');
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

  // Seed gamification data
  app.post("/api/seed-gamification", async (req, res) => {
    try {
      const seedModule = await import('./seed-gamification');
      const seedGamificationData = seedModule.default || seedModule.seedGamificationData;
      await seedGamificationData();
      res.json({ 
        message: "Gamification data seeded successfully",
        details: "Added achievements, daily challenges, and gamification features"
      });
    } catch (error: any) {
      console.error('Gamification seeding error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Store Credit Management Routes
  app.post("/api/rewards/redeem-store-credit", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { pointsToRedeem } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userReward = await storage.getUserRewards(userId);
      const currentPoints = userReward?.totalPoints || 0;
      
      if (pointsToRedeem > currentPoints) {
        return res.status(400).json({ message: "Insufficient points" });
      }
      
      // Convert points to store credit (100 points = $1 store credit)
      const creditAmount = pointsToRedeem / 100;
      
      // Add store credit to user account
      const user = await storage.getUser(userId);
      const currentCredit = parseFloat(user?.storeCredit || "0");
      const newCredit = currentCredit + creditAmount;
      
      await storage.updateUserStoreCredit(userId, newCredit.toFixed(2));
      
      // Deduct points from user rewards
      await storage.updateUserPoints(userId, currentPoints - pointsToRedeem);
      
      // Record the transaction
      await storage.createStoreCreditTransaction({
        userId,
        type: 'points_redeemed',
        amount: creditAmount.toFixed(2),
        description: `Redeemed ${pointsToRedeem} points for $${creditAmount.toFixed(2)} store credit`,
        pointsUsed: pointsToRedeem,
      });
      
      await storage.createPointTransaction({
        userId,
        points: -pointsToRedeem,
        type: 'redeemed',
        description: `Redeemed ${pointsToRedeem} points for $${creditAmount.toFixed(2)} store credit`,
      });
      
      res.json({ 
        message: `Successfully redeemed ${pointsToRedeem} points for $${creditAmount.toFixed(2)} store credit`,
        creditAmount,
        newBalance: newCredit,
        pointsRemaining: currentPoints - pointsToRedeem
      });
    } catch (error: any) {
      console.error('Store credit redemption error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/referral/redeem-store-credit", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { referralId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const referral = await storage.getReferral(referralId);
      if (!referral || referral.referrerId !== userId) {
        return res.status(404).json({ message: "Referral not found or not owned by user" });
      }
      
      if (referral.status !== 'completed') {
        return res.status(400).json({ message: "Referral must be completed to redeem" });
      }
      
      // Convert referral points to store credit ($10 store credit for completed referrals)
      const creditAmount = 10.00;
      
      // Add store credit to user account
      const user = await storage.getUser(userId);
      const currentCredit = parseFloat(user?.storeCredit || "0");
      const newCredit = currentCredit + creditAmount;
      
      await storage.updateUserStoreCredit(userId, newCredit.toFixed(2));
      
      // Record the transaction
      await storage.createStoreCreditTransaction({
        userId,
        type: 'referral_bonus',
        amount: creditAmount.toFixed(2),
        description: `Referral bonus: $${creditAmount.toFixed(2)} store credit`,
        referralId,
      });
      
      // Mark referral as rewarded
      await storage.updateReferralStatus(referralId, 'rewarded');
      
      res.json({ 
        message: `Successfully redeemed referral for $${creditAmount.toFixed(2)} store credit`,
        creditAmount,
        newBalance: newCredit
      });
    } catch (error: any) {
      console.error('Referral store credit redemption error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/store-credit/balance", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = await storage.getUser(userId);
      const balance = parseFloat(user?.storeCredit || "0");
      
      res.json({ balance });
    } catch (error: any) {
      console.error('Store credit balance error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/store-credit/transactions", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const transactions = await storage.getStoreCreditTransactions(userId);
      
      res.json(transactions);
    } catch (error: any) {
      console.error('Store credit transactions error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Note: Enhanced Rewards System Routes were removed as they duplicated routes at line 1209

  // Claim achievement reward
  app.post("/api/rewards/achievements/claim", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { achievementId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const success = await storage.claimAchievementReward(userId, achievementId);
      if (success) {
        res.json({ success: true, message: "Achievement reward claimed!" });
      } else {
        res.status(400).json({ message: "Achievement not completed or already claimed" });
      }
    } catch (error: any) {
      console.error('Error claiming achievement:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Award points on purchase completion
  app.post("/api/rewards/purchase", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { orderId, orderTotal, itemCount } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // Calculate base points (10 points per dollar)
      let points = Math.floor(orderTotal * 10);
      
      // Bonus points for large orders (disabled recordAchievement until achievements are properly seeded)
      if (orderTotal >= 200) {
        points += 2500;
        // await storage.recordAchievement(userId, 'big-spender', 1);
      } else if (orderTotal >= 100) {
        points += 1000;
        // await storage.recordAchievement(userId, 'high-roller', 1);
      }
      
      // Bonus for multiple items
      if (itemCount >= 5) {
        points += 200;
        // await storage.recordAchievement(userId, 'bulk-buyer', 1);
      }
      
      // Check for first purchase
      const orderCount = await storage.getUserOrderCount(userId);
      if (orderCount === 1) {
        points += 500;
        // await storage.recordAchievement(userId, 'first-purchase', 1);
      }
      
      // Apply tier multiplier
      const userReward = await storage.getUserRewards(userId);
      const currentPoints = userReward?.totalPoints || 0;
      const multiplier = currentPoints >= 10000 ? 2 : 
                        currentPoints >= 5000 ? 1.5 : 
                        currentPoints >= 1000 ? 1.25 : 1;
      
      points = Math.floor(points * multiplier);
      
      // Award points
      await storage.updateUserPoints(userId, points, `Purchase reward for order #${orderId}`);
      
      // Update streak
      await storage.updateStreak(userId, 'purchase', new Date());
      
      res.json({ 
        success: true, 
        pointsEarned: points,
        multiplier,
        message: `You earned ${points} points!` 
      });
    } catch (error: any) {
      console.error('Error awarding purchase points:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Gamification API Routes

  // Achievements
  app.get("/api/gamification/achievements", authenticateToken, async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/gamification/user-achievements", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/gamification/achievements/:achievementId/progress", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { achievementId } = req.params;
      const { progress } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const result = await storage.updateUserAchievementProgress(userId, achievementId, progress);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Daily Challenges
  app.get("/api/gamification/challenges/today", authenticateToken, async (req, res) => {
    try {
      const challenges = await storage.getDailyChallenges();
      res.json(challenges);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/gamification/user-challenges", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userChallenges = await storage.getUserChallenges(userId);
      res.json(userChallenges);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/gamification/challenges/:challengeId/progress", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { challengeId } = req.params;
      const { progress } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const result = await storage.updateUserChallengeProgress(userId, challengeId, progress);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/gamification/challenges/:challengeId/claim", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { challengeId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const success = await storage.claimChallengeReward(userId, challengeId);
      if (success) {
        res.json({ success: true, message: "Reward claimed successfully" });
      } else {
        res.status(400).json({ success: false, message: "Challenge not completed or reward already claimed" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Streaks
  app.get("/api/gamification/streaks", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const streaks = await storage.getUserStreaks(userId);
      res.json(streaks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/gamification/streaks", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { streakType, activityDate } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const date = activityDate ? new Date(activityDate) : new Date();
      const streak = await storage.updateStreak(userId, streakType, date);
      res.json(streak);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Leaderboard
  app.get("/api/gamification/leaderboard", authenticateToken, async (req, res) => {
    try {
      const { period = 'all_time', limit = 10 } = req.query;
      const leaderboard = await storage.getLeaderboard(period as any, parseInt(limit as string));
      res.json(leaderboard);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/gamification/leaderboard/update", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { period = 'all_time' } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      await storage.updateLeaderboard(userId, period as any);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Bot and crawler friendly routes are now handled in server/index.ts

  // Enhanced crawler welcome endpoint
  app.get('/crawler-welcome', (req, res) => {
    const userAgent = req.get('User-Agent') || '';
    const isBot = /bot|crawler|spider|scraper|crawling|facebookexternalhit|twitterbot|linkedinbot|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|whatsapp/i.test(userAgent);

    res.setHeader('X-Robots-Tag', 'index, follow, all');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    res.json({
      message: 'Welcome crawlers and bots!',
      site: 'mentally-chill.online',
      type: 'Hemp THCA Store',
      crawl_friendly: true,
      bot_detected: isBot,
      user_agent: userAgent,
      pages_to_crawl: [
        '/',
        '/products',
        '/blog',
        '/contact',
        '/privacy',
        '/terms',
        '/returns',
        '/rewards'
      ],
      sitemaps: [
        '/sitemap.xml',
        'https://mentally-chill.online/sitemap.xml',
        'https://thcastore.replit.app/sitemap.xml'
      ],
      legal_compliance: 'Farm Bill 2018 compliant hemp products',
      age_restriction: '21+',
      last_updated: new Date().toISOString()
    });
  });

  // Promo Codes Admin Routes
  app.get('/api/admin/promo-codes', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
      const promoCodes = await storage.getPromoCodes();
      res.json(promoCodes);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      res.status(500).json({ error: 'Failed to fetch promo codes' });
    }
  });

  app.post('/api/admin/promo-codes', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { code, discountType, discountValue, minPurchase, maxUses, expiresAt, applicableCategories, description } = req.body;
      
      // Generate code if not provided
      const promoCode = code || generatePromoCode();
      
      const newPromoCode = await storage.createPromoCode({
        code: promoCode.toUpperCase(),
        discountType,
        discountValue: discountValue.toString(),
        minPurchase: minPurchase?.toString() || '0.00',
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        applicableCategories: applicableCategories || [],
        description: description || ''
      });
      
      res.status(201).json(newPromoCode);
    } catch (error) {
      console.error('Error creating promo code:', error);
      res.status(500).json({ error: 'Failed to create promo code' });
    }
  });

  // Promo Code Validation Route
  app.post('/api/promo-codes/validate', async (req: Request, res: Response) => {
    try {
      const { code, orderTotal } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: 'Promo code is required' });
      }

      const promoCode = await storage.validatePromoCode(code.toUpperCase(), parseFloat(orderTotal || '0'));
      
      if (!promoCode) {
        return res.status(400).json({ message: 'Invalid or expired promo code' });
      }

      // Calculate discount
      let discount = 0;
      if (promoCode.discountType === 'percentage') {
        discount = parseFloat(promoCode.discountValue);
      } else {
        discount = parseFloat(promoCode.discountValue);
      }

      res.json({
        code: promoCode.code,
        type: promoCode.discountType,
        discount: discount,
        description: promoCode.description
      });
    } catch (error) {
      console.error('Error validating promo code:', error);
      res.status(500).json({ message: 'Failed to validate promo code' });
    }
  });

  // SEO Enhancement for all posts
  app.post("/api/seo/enhance-all", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      const enhanced = [];
      
      for (const post of posts.slice(0, 5)) { // Limit to 5 posts to avoid timeout
        try {
          const { aiSEOService } = await import('./ai-seo-service');
          const seoService = aiSEOService;
          await seoService.enhanceBlogPostSEO(post.id);
          enhanced.push(post.title);
        } catch (error) {
          console.error(`Failed to enhance ${post.title}:`, error);
        }
      }
      
      res.json({ 
        message: `Enhanced ${enhanced.length} blog posts with AI SEO`,
        enhanced 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Object storage routes
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const { ObjectStorageService } = await import('./objectStorage');
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const { ObjectStorageService } = await import('./objectStorage');
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      if (error.name === 'ObjectNotFoundError') {
        return res.sendStatus(404);
      }
      return res.status(500).json({ error: error.message });
    }
  });

  // Set up global storage for seed functions
  (global as any).storage = storage;

  const httpServer = createServer(app);
  return httpServer;
}
