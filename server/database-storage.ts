import { db } from './db';
import { eq, and, desc, sql, or } from 'drizzle-orm';
import type { 
  User, 
  InsertUser, 
  Product, 
  InsertProduct, 
  CartItem, 
  InsertCartItem, 
  Order, 
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  UserReward,
  InsertUserReward,
  RewardTier,
  InsertRewardTier,
  PointTransaction,
  InsertPointTransaction,
  ReferralProgram,
  InsertReferralProgram,
  SpecialOffer,
  InsertSpecialOffer,
  BlogPost,
  InsertBlogPost,
  AIConversation,
  InsertAIConversation,
  AIMessage,
  InsertAIMessage,
  AIUserProfile,
  InsertAIUserProfile,
  AIContextMemory,
  InsertAIContextMemory,
  DailyPromotion,
  InsertDailyPromotion,
  PromotionUsage,
  InsertPromotionUsage,
  Achievement,
  InsertAchievement,
  UserAchievement,
  InsertUserAchievement,
  DailyChallenge,
  InsertDailyChallenge,
  UserChallenge,
  InsertUserChallenge,
  LoyaltyStreak,
  InsertLoyaltyStreak,
  LoyaltyLeaderboard,
  InsertLoyaltyLeaderboard,
  PromoCode,
  InsertPromoCode
} from '@shared/schema';
import { 
  users, 
  products, 
  cartItems, 
  orders, 
  orderItems, 
  userRewards, 
  rewardTiers, 
  pointTransactions, 
  referralProgram, 
  specialOffers,
  shippingRates,
  prohibitedStates,
  blogPosts,
  aiConversations,
  aiMessages,
  aiUserProfiles,
  aiContextMemory,
  dailyPromotions,
  promotionUsage,
  achievements,
  userAchievements,
  dailyChallenges,
  userChallenges,
  loyaltyStreaks,
  promoCodes,
  loyaltyLeaderboard,
  storeCreditTransactions
} from '@shared/schema';

export class DatabaseStorage {
  
  // Initialize default data
  async initialize(): Promise<void> {
    await this.initializeRewardTiers();
    await this.initializeShippingRates();
    await this.initializeProhibitedStates();
    await this.initializeSampleProducts();
    await this.initializeSpecialOffers();
    await this.initializeAchievements();
    await this.initializeDailyChallenges();
  }

  private async initializeRewardTiers(): Promise<void> {
    const existingTiers = await db.select().from(rewardTiers).limit(1);
    if (existingTiers.length > 0) return;

    const tiers: InsertRewardTier[] = [
      {
        name: 'Bronze',
        minPoints: 0,
        multiplier: '1.00',
        benefits: ['Free shipping on orders over $75', 'Birthday rewards'],
        color: '#CD7F32'
      },
      {
        name: 'Silver',
        minPoints: 500,
        multiplier: '1.25',
        benefits: ['Free shipping on orders over $50', 'Early access to sales', '25% bonus points'],
        color: '#C0C0C0'
      },
      {
        name: 'Gold',
        minPoints: 1500,
        multiplier: '1.50',
        benefits: ['Free shipping on all orders', 'Exclusive products', '50% bonus points', 'Priority support'],
        color: '#FFD700'
      },
      {
        name: 'Platinum',
        minPoints: 3000,
        multiplier: '2.00',
        benefits: ['Free express shipping', 'VIP customer service', 'Double points', 'Exclusive events'],
        color: '#E5E4E2'
      },
      {
        name: 'Diamond',
        minPoints: 7500,
        multiplier: '2.50',
        benefits: ['Unlimited free shipping', 'Personal shopper', '2.5x points', 'Lifetime discounts'],
        color: '#B9F2FF'
      }
    ];

    await db.insert(rewardTiers).values(tiers);
  }

  private async initializeShippingRates(): Promise<void> {
    const existingRates = await db.select().from(shippingRates).limit(1);
    if (existingRates.length > 0) return;

    const rates = [
      {
        method: 'standard',
        name: 'Standard Shipping',
        description: 'Standard ground shipping via USPS/UPS',
        baseRate: '8.99',
        perPoundRate: '2.50',
        freeShippingThreshold: '75.00',
        estimatedDays: '5-7 business days',
        trackingIncluded: true,
        isActive: true
      },
      {
        method: 'express',
        name: 'Express Shipping',
        description: 'Expedited shipping for faster delivery',
        baseRate: '19.99',
        perPoundRate: '4.00',
        freeShippingThreshold: '150.00',
        estimatedDays: '2-3 business days',
        trackingIncluded: true,
        isActive: true
      },
      {
        method: 'tracked',
        name: 'Priority Tracked',
        description: 'Premium tracked shipping with signature confirmation',
        baseRate: '29.99',
        perPoundRate: '6.00',
        freeShippingThreshold: '200.00',
        estimatedDays: '1-2 business days',
        trackingIncluded: true,
        isActive: true
      }
    ];

    await db.insert(shippingRates).values(rates);
  }

  private async initializeProhibitedStates(): Promise<void> {
    const existingStates = await db.select().from(prohibitedStates).limit(1);
    if (existingStates.length > 0) return;

    const prohibited = [
      {
        stateCode: 'ID',
        stateName: 'Idaho',
        reason: 'Hemp products including THCA are prohibited under state law',
        isActive: true
      },
      {
        stateCode: 'SD',
        stateName: 'South Dakota',
        reason: 'THCA products not permitted under current state regulations',
        isActive: true
      },
      {
        stateCode: 'KS',
        stateName: 'Kansas',
        reason: 'Hemp-derived THCA products prohibited',
        isActive: true
      },
      {
        stateCode: 'WY',
        stateName: 'Wyoming',
        reason: 'Hemp derivatives including THCA not permitted',
        isActive: true
      }
    ];

    await db.insert(prohibitedStates).values(prohibited);
  }

  private async initializeSampleProducts(): Promise<void> {
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length > 0) return;

    // Pre-rolls
    const preRolls = [
      {
        name: "Sour Diesel Infused Pre-Roll",
        description: "Premium Sour Diesel flower infused with THCA diamonds for maximum potency and flavor.",
        price: "15.99",
        category: "prerolls",
        imageUrl: "/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png",
        stock: 25,
        weight: "1.25g",
        featured: true,
        rating: "4.8",
        thcaContent: "32.5",
        strainType: "Sativa",
        effects: ["energizing", "uplifting", "focused"] as string[]
      },
      {
        name: "Purple Koolaid Infused Pre-Roll",
        description: "Sweet Purple Koolaid strain infused with THCA diamonds for a flavorful and potent experience.",
        price: "17.99",
        category: "prerolls",
        imageUrl: "/attached_assets/generated_images/Purple_bud_phone_photo_49b8133a.png",
        stock: 20,
        weight: "1.45g",
        featured: true,
        rating: "4.9",
        thcaContent: "34.2",
        strainType: "Indica",
        effects: ["relaxing", "sweet", "potent"] as string[]
      },
      {
        name: "Sour Lemon Diesel Pre-Roll",
        description: "Zesty Sour Lemon Diesel strain with citrus terpenes and energizing effects.",
        price: "12.99",
        category: "prerolls",
        imageUrl: "/attached_assets/generated_images/Android_preroll_photo_grainy_f4a96edf.png",
        stock: 30,
        weight: "1.25g",
        featured: false,
        rating: "4.7",
        thcaContent: "28.9",
        strainType: "Sativa",
        effects: ["citrusy", "energizing", "creative"] as string[]
      },
      {
        name: "Too Tall Pre-Roll",
        description: "Premium Too Tall strain known for its towering effects and smooth smoke.",
        price: "13.99",
        category: "prerolls",
        imageUrl: "/attached_assets/generated_images/Android_phone_cannabis_bud_photo_93611cde.png",
        stock: 22,
        weight: "1.25g",
        featured: false,
        rating: "4.6",
        thcaContent: "29.3",
        strainType: "Hybrid",
        effects: ["balanced", "smooth", "uplifting"] as string[]
      },
      {
        name: "Runtz Pre-Roll",
        description: "Sweet and fruity Runtz strain with candy-like flavors and balanced effects.",
        price: "16.99",
        category: "prerolls",
        imageUrl: "https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format",
        stock: 18,
        weight: "1.45g",
        featured: true,
        rating: "4.8",
        thcaContent: "31.7",
        strainType: "Hybrid",
        effects: ["sweet", "fruity", "euphoric"] as string[]
      }
    ];

    // Flower strains with multiple weights
    const flowerStrains = [
      {
        name: "Grape Popsicle",
        description: "Sweet grape flavors with relaxing effects and beautiful purple hues.",
        strainType: "Indica",
        thcaContent: "26.8",
        effects: ["relaxing", "sweet", "grape"],
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format"
      },
      {
        name: "Purple Koolaid Infused with THCA Diamonds",
        description: "Premium Purple Koolaid flower infused with pure THCA diamonds for maximum potency.",
        strainType: "Indica",
        thcaContent: "38.5",
        effects: ["potent", "relaxing", "sweet"],
        imageUrl: "https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format"
      },
      {
        name: "Sour Diesel",
        description: "Classic energizing sativa with diesel fuel aroma and uplifting effects.",
        strainType: "Sativa",
        thcaContent: "27.3",
        effects: ["energizing", "diesel", "uplifting"],
        imageUrl: "https://images.unsplash.com/photo-1585288766827-c1a1bb3c6b0e?w=400&h=400&fit=crop&auto=format"
      },
      {
        name: "Sour Lemon Diesel",
        description: "Citrusy sativa blend with sour lemon flavors and energizing properties.",
        strainType: "Sativa",
        thcaContent: "28.9",
        effects: ["citrusy", "energizing", "sour"],
        imageUrl: "https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format"
      },
      {
        name: "Sour Diesel Popcorn Buds",
        description: "Premium Sour Diesel popcorn buds offering the same quality at a better value.",
        strainType: "Sativa",
        thcaContent: "26.1",
        effects: ["energizing", "diesel", "value"],
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format"
      },
      {
        name: "Wedding Cake",
        description: "Sweet and earthy hybrid with vanilla and cake-like flavors.",
        strainType: "Hybrid",
        thcaContent: "29.7",
        effects: ["sweet", "relaxing", "vanilla"],
        imageUrl: "https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format"
      },
      {
        name: "Girl Scout Cookies",
        description: "Popular hybrid with sweet and earthy flavors and balanced effects.",
        strainType: "Hybrid",
        thcaContent: "28.4",
        effects: ["sweet", "balanced", "earthy"],
        imageUrl: "https://images.unsplash.com/photo-1585288766827-c1a1bb3c6b0e?w=400&h=400&fit=crop&auto=format"
      },
      {
        name: "Runtz x Peppermint",
        description: "Unique cross combining sweet Runtz with refreshing peppermint flavors.",
        strainType: "Hybrid",
        thcaContent: "30.2",
        effects: ["sweet", "minty", "refreshing"],
        imageUrl: "https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format"
      }
    ];

    const weights = [
      { weight: "1g", basePrice: 12, label: "Gram" },
      { weight: "3.5g", basePrice: 35, label: "Eighth" },
      { weight: "7g", basePrice: 65, label: "Quarter" },
      { weight: "14g", basePrice: 120, label: "Half" },
      { weight: "112g", basePrice: 800, label: "QP" },
      { weight: "448g", basePrice: 2800, label: "Pound" }
    ];

    const sampleProducts: InsertProduct[] = [...preRolls];

    // Generate flower products for each strain and weight combination
    flowerStrains.forEach((strain, strainIndex) => {
      weights.forEach((weightOption, weightIndex) => {
        const priceMultiplier = strain.name.includes('Infused') ? 1.5 : strain.name.includes('Popcorn') ? 0.8 : 1.0;
        const price = (weightOption.basePrice * priceMultiplier).toFixed(2);
        
        sampleProducts.push({
          name: `${strain.name} - ${weightOption.label}`,
          description: strain.description,
          price: price,
          category: "flower",
          imageUrl: strain.imageUrl,
          stock: Math.floor(Math.random() * 20) + 10,
          weight: weightOption.weight,
          featured: strain.name.includes('Infused') || weightOption.weight === '3.5g',
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          thcaContent: strain.thcaContent,
          strainType: strain.strainType,
          effects: strain.effects as string[]
        });
      });
    });

    // Pre-roll packs
    const packSizes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 15];
    const preRollStrains = ['Sour Diesel Infused', 'Purple Koolaid Infused', 'Sour Lemon Diesel', 'Too Tall', 'Runtz'];
    
    preRollStrains.forEach((strain, strainIndex) => {
      packSizes.forEach((packSize, packIndex) => {
        const basePrice = strain.includes('Infused') ? 16 : 13;
        const discountRate = packSize >= 10 ? 0.15 : packSize >= 5 ? 0.10 : 0.05;
        const totalPrice = (basePrice * packSize * (1 - discountRate)).toFixed(2);
        
        const packImageUrl = strain.includes('Sour Diesel') ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format' :
                             strain.includes('Purple Koolaid') ? 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format' :
                             strain.includes('Lemon') ? 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format' :
                             strain.includes('Too Tall') ? 'https://images.unsplash.com/photo-1585288766827-c1a1bb3c6b0e?w=400&h=400&fit=crop&auto=format' :
                             'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format';
        
        sampleProducts.push({
          name: `${strain} Pre-Roll Pack (${packSize}x)`,
          description: `Pack of ${packSize} premium ${strain} pre-rolls with ${Math.round(discountRate * 100)}% bulk discount.`,
          price: totalPrice,
          category: "prerolls",
          imageUrl: packImageUrl,
          stock: Math.floor(Math.random() * 15) + 5,
          weight: `${packSize} pre-rolls`,
          featured: packSize === 5 || packSize === 10,
          rating: (4.6 + Math.random() * 0.4).toFixed(1),
          thcaContent: strain.includes('Infused') ? '33.0' : '29.0',
          strainType: strain.includes('Diesel') ? 'Sativa' : strain.includes('Koolaid') ? 'Indica' : 'Hybrid',
          effects: ['bulk', 'value', 'variety'] as string[]
        });
      });
    });

    // Variety packs (3g flower + 3 pre-rolls)
    const varietyPacks = [
      {
        name: "Indica Variety Pack",
        description: "3g of premium indica flower plus 3 indica pre-rolls for the perfect relaxing experience.",
        price: "89.99"
      },
      {
        name: "Sativa Variety Pack", 
        description: "3g of energizing sativa flower plus 3 sativa pre-rolls for daytime enjoyment.",
        price: "84.99"
      },
      {
        name: "Hybrid Variety Pack",
        description: "3g of balanced hybrid flower plus 3 hybrid pre-rolls for versatile effects.",
        price: "87.99"
      },
      {
        name: "Premium Variety Pack",
        description: "3g of top-shelf flower plus 3 infused pre-rolls for the ultimate cannabis experience.",
        price: "124.99"
      }
    ];

    varietyPacks.forEach((pack, packIndex) => {
      const varietyImageUrl = pack.name.includes('Indica') ? 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format' :
                             pack.name.includes('Sativa') ? 'https://images.unsplash.com/photo-1585288766827-c1a1bb3c6b0e?w=400&h=400&fit=crop&auto=format' :
                             pack.name.includes('Hybrid') ? 'https://images.unsplash.com/photo-1574780191071-15ad7b40bc72?w=400&h=400&fit=crop&auto=format' :
                             'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format';
      
      sampleProducts.push({
        name: pack.name,
        description: pack.description,
        price: pack.price,
        category: "variety-packs",
        imageUrl: varietyImageUrl,
        stock: Math.floor(Math.random() * 10) + 3,
        weight: "3g + 3 pre-rolls",
        featured: pack.name.includes('Premium'),
        rating: (4.7 + Math.random() * 0.3).toFixed(1),
        thcaContent: pack.name.includes('Premium') ? '35.0' : '28.5',
        strainType: pack.name.includes('Indica') ? 'Indica' : pack.name.includes('Sativa') ? 'Sativa' : 'Hybrid',
        effects: ['variety', 'mixed', 'sampler'] as string[]
      });
    });

    for (const product of sampleProducts) {
      await db.insert(products).values([product]);
    }
  }

  private async initializeSpecialOffers(): Promise<void> {
    const existingOffers = await db.select().from(specialOffers).limit(1);
    if (existingOffers.length > 0) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const offers: InsertSpecialOffer[] = [
      {
        name: "Double Points Friday",
        description: "Earn double points on all purchases every Friday!",
        type: "double_points",
        value: "100.00", // 100% bonus = double points
        isActive: true,
        startDate: now,
        endDate: nextMonth,
        daysOfWeek: ['friday'],
        minPurchase: null,
        maxUses: null,
        currentUses: 0,
        targetTiers: [],
        productCategories: []
      },
      {
        name: "New Customer Welcome",
        description: "25% off your first order plus 500 bonus points!",
        type: "discount",
        value: "25.00",
        isActive: true,
        startDate: now,
        endDate: nextMonth,
        daysOfWeek: [],
        minPurchase: "50.00",
        maxUses: 1000,
        currentUses: 0,
        targetTiers: ['Bronze'],
        productCategories: []
      },
      {
        name: "Weekend Flash Sale",
        description: "30% off all flower products this weekend only!",
        type: "flash_sale",
        value: "30.00",
        isActive: true,
        startDate: now,
        endDate: tomorrow,
        daysOfWeek: ['saturday', 'sunday'],
        minPurchase: null,
        maxUses: 500,
        currentUses: 0,
        targetTiers: [],
        productCategories: ['flower']
      },
      {
        name: "VIP Triple Points",
        description: "Gold+ members earn 3x points on concentrates!",
        type: "double_points",
        value: "200.00", // 200% bonus = triple points
        isActive: true,
        startDate: now,
        endDate: nextWeek,
        daysOfWeek: [],
        minPurchase: null,
        maxUses: null,
        currentUses: 0,
        targetTiers: ['Gold', 'Platinum', 'Diamond'],
        productCategories: ['concentrates']
      }
    ];

    await db.insert(specialOffers).values(offers);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    
    // Create user rewards profile
    const bronzeTier = await db.select().from(rewardTiers).where(eq(rewardTiers.name, 'Bronze')).limit(1);
    if (bronzeTier.length > 0) {
      await db.insert(userRewards).values({
        userId: user.id,
        currentTierId: bronzeTier[0].id,
        totalPoints: 0,
        lifetimeSpent: '0.00',
        monthlyPurchases: 0
      });
    }

    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values([insertProduct]).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    // Clean up the updates object to ensure proper types
    const cleanUpdates: any = { ...updates };
    
    // Handle effects array properly
    if (cleanUpdates.effects !== undefined) {
      cleanUpdates.effects = Array.isArray(cleanUpdates.effects) ? cleanUpdates.effects : null;
    }
    
    // Convert numeric strings to proper types
    if (cleanUpdates.price !== undefined) {
      cleanUpdates.price = cleanUpdates.price.toString();
    }
    if (cleanUpdates.stock !== undefined) {
      cleanUpdates.stock = parseInt(cleanUpdates.stock.toString());
    }
    if (cleanUpdates.weight !== undefined) {
      cleanUpdates.weight = cleanUpdates.weight.toString();
    }
    if (cleanUpdates.thcaContent !== undefined && cleanUpdates.thcaContent !== null) {
      cleanUpdates.thcaContent = cleanUpdates.thcaContent.toString();
    }
    if (cleanUpdates.rating !== undefined && cleanUpdates.rating !== null) {
      cleanUpdates.rating = cleanUpdates.rating.toString();
    }

    const [product] = await db.update(products).set(cleanUpdates).where(eq(products.id, id)).returning();
    return product || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Cart methods
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    const result = await db.select({
      id: cartItems.id,
      userId: cartItems.userId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
      product: products
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));

    return result.map(item => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      quantity: item.quantity,
      createdAt: item.createdAt,
      product: item.product
    }));
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, insertCartItem.userId),
          eq(cartItems.productId, insertCartItem.productId)
        )
      );

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + (insertCartItem.quantity || 1) })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    // Create new cart item
    const [cartItem] = await db.insert(cartItems).values(insertCartItem).returning();
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem || undefined;
  }

  async removeCartItem(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return result.rowCount ? result.rowCount >= 0 : true;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    
    // Points will be awarded only after admin approval
    // See updateOrderStatus method for point awarding logic
    
    return order;
  }

  async updateOrderStatus(id: string, status: string, trackingNumber?: string): Promise<Order | undefined> {
    const updateData: any = { status };
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }
    
    const [order] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    
    // Award points only when admin approves payment (status: approved, completed, or shipped)
    if (order && (status === 'approved' || status === 'completed' || status === 'shipped')) {
      const existingPointTransaction = await db.select().from(pointTransactions)
        .where(eq(pointTransactions.orderId, order.id));
      
      // Only award points if not already awarded for this order
      if (existingPointTransaction.length === 0) {
        await this.awardPointsForOrder(order);
      }
    }
    
    return order || undefined;
  }

  // Order items methods
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }

  // Rewards methods
  async getUserRewards(userId: string): Promise<UserReward | undefined> {
    const [reward] = await db.select().from(userRewards).where(eq(userRewards.userId, userId));
    return reward || undefined;
  }

  async getUserPoints(userId: string): Promise<number> {
    const userReward = await this.getUserRewards(userId);
    return userReward ? userReward.totalPoints : 0;
  }

  async getRewardTiers(): Promise<RewardTier[]> {
    return await db.select().from(rewardTiers).orderBy(rewardTiers.minPoints);
  }

  async updateUserRewards(userId: string, updates: Partial<InsertUserReward>): Promise<UserReward | undefined> {
    const [reward] = await db.update(userRewards).set(updates).where(eq(userRewards.userId, userId)).returning();
    return reward || undefined;
  }

  async addPointTransaction(transaction: InsertPointTransaction): Promise<PointTransaction> {
    const [pointTransaction] = await db.insert(pointTransactions).values(transaction).returning();
    
    // Update user's total points
    const currentReward = await this.getUserRewards(transaction.userId);
    if (currentReward) {
      const newTotal = currentReward.totalPoints + transaction.points;
      await this.updateUserRewards(transaction.userId, { totalPoints: newTotal });
      
      // Check for tier upgrade
      await this.checkTierUpgrade(transaction.userId, newTotal);
    }
    
    return pointTransaction;
  }

  async getPointTransactions(userId: string): Promise<PointTransaction[]> {
    return await db.select().from(pointTransactions).where(eq(pointTransactions.userId, userId)).orderBy(desc(pointTransactions.createdAt));
  }

  private async awardPointsForOrder(order: Order): Promise<void> {
    const userReward = await this.getUserRewards(order.userId || '');
    if (!userReward || !userReward.currentTierId) return;

    const [tier] = await db.select().from(rewardTiers).where(eq(rewardTiers.id, userReward.currentTierId));
    if (!tier) return;

    // Calculate points: $1 = 1 point, multiplied by tier multiplier
    const basePoints = Math.floor(parseFloat(order.total));
    const multiplier = parseFloat(tier.multiplier);
    const pointsEarned = Math.floor(basePoints * multiplier);

    await this.addPointTransaction({
      userId: order.userId || '',
      orderId: order.id,
      points: pointsEarned,
      type: 'earned',
      description: `Points earned from order #${order.id.slice(-8)}`,
      multiplier: tier.multiplier
    });

    // Update monthly purchases and lifetime spent
    await this.updateUserRewards(order.userId || '', {
      monthlyPurchases: userReward.monthlyPurchases + 1,
      lifetimeSpent: (parseFloat(userReward.lifetimeSpent) + parseFloat(order.total)).toFixed(2),
      lastPurchaseDate: new Date()
    });
  }

  private async checkTierUpgrade(userId: string, totalPoints: number): Promise<void> {
    const tiers = await this.getRewardTiers();
    const eligibleTier = tiers.reverse().find(tier => totalPoints >= tier.minPoints);
    
    if (eligibleTier) {
      const currentReward = await this.getUserRewards(userId);
      if (currentReward && currentReward.currentTierId !== eligibleTier.id) {
        await this.updateUserRewards(userId, { currentTierId: eligibleTier.id });
        
        // Award bonus points for tier upgrade
        const bonusPoints = eligibleTier.minPoints * 0.1; // 10% of threshold as bonus
        await this.addPointTransaction({
          userId,
          points: Math.floor(bonusPoints),
          type: 'bonus',
          description: `Tier upgrade bonus - Welcome to ${eligibleTier.name}!`,
          multiplier: '1.00'
        });
      }
    }
  }

  // Referral methods
  async createReferral(referral: InsertReferralProgram): Promise<ReferralProgram> {
    const [newReferral] = await db.insert(referralProgram).values(referral).returning();
    return newReferral;
  }

  async getReferralByCode(code: string): Promise<ReferralProgram | undefined> {
    const [referral] = await db.select().from(referralProgram).where(eq(referralProgram.referralCode, code));
    return referral || undefined;
  }

  async getUserReferrals(userId: string): Promise<ReferralProgram[]> {
    return await db.select().from(referralProgram).where(eq(referralProgram.referrerId, userId));
  }

  async getUserReferralCode(userId: string): Promise<ReferralProgram | undefined> {
    const [referral] = await db.select().from(referralProgram)
      .where(eq(referralProgram.referrerId, userId))
      .limit(1);
    return referral || undefined;
  }

  async getUserReferralStats(userId: string): Promise<any> {
    const userReferrals = await db.select().from(referralProgram)
      .where(eq(referralProgram.referrerId, userId));
    
    const completedReferrals = userReferrals.filter(r => r.status === 'completed' || r.status === 'rewarded');
    const totalEarned = completedReferrals.reduce((sum, r) => sum + r.referrerReward, 0);
    
    return {
      totalReferrals: completedReferrals.length,
      pendingReferrals: userReferrals.filter(r => r.status === 'pending').length,
      totalEarned: totalEarned
    };
  }

  async hasUserUsedReferral(userId: string): Promise<boolean> {
    const [referral] = await db.select().from(referralProgram)
      .where(eq(referralProgram.refereeId, userId))
      .limit(1);
    return !!referral;
  }

  async updateReferral(referralId: string, updates: Partial<InsertReferralProgram>): Promise<ReferralProgram | undefined> {
    const [referral] = await db.update(referralProgram)
      .set({ ...updates, completedAt: updates.status === 'completed' ? new Date() : undefined })
      .where(eq(referralProgram.id, referralId))
      .returning();
    return referral || undefined;
  }

  async completeReferral(referralId: string, firstOrderId: string): Promise<void> {
    const [referral] = await db
      .update(referralProgram)
      .set({ 
        status: 'completed', 
        firstOrderId, 
        completedAt: new Date() 
      })
      .where(eq(referralProgram.id, referralId))
      .returning();

    if (referral) {
      // Award points to referrer
      await this.addPointTransaction({
        userId: referral.referrerId,
        points: referral.referrerReward,
        type: 'referral',
        description: `Referral bonus - Friend joined!`,
        multiplier: '1.00'
      });

      // Award points to referee if they exist
      if (referral.refereeId) {
        await this.addPointTransaction({
          userId: referral.refereeId,
          points: referral.refereeReward,
          type: 'referral',
          description: `Welcome bonus - Joined via referral!`,
          multiplier: '1.00'
        });
      }

      // Mark as rewarded
      await db
        .update(referralProgram)
        .set({ status: 'rewarded' })
        .where(eq(referralProgram.id, referralId));
    }
  }

  // Special offers methods
  async getActiveOffers(): Promise<SpecialOffer[]> {
    const now = new Date();
    return await db
      .select()
      .from(specialOffers)
      .where(
        and(
          eq(specialOffers.isActive, true),
          sql`${specialOffers.startDate} <= ${now}`,
          sql`${specialOffers.endDate} >= ${now}`
        )
      );
  }

  async getSpecialOffers(): Promise<SpecialOffer[]> {
    return await db.select().from(specialOffers).orderBy(desc(specialOffers.createdAt));
  }

  async createSpecialOffer(offer: InsertSpecialOffer): Promise<SpecialOffer> {
    const [newOffer] = await db.insert(specialOffers).values(offer).returning();
    return newOffer;
  }

  // Shipping Methods
  async getShippingRates() {
    return await db.select().from(shippingRates).where(eq(shippingRates.isActive, true));
  }

  async calculateShippingCost(method: string, weight: number, subtotal: number) {
    const [rate] = await db.select().from(shippingRates)
      .where(and(eq(shippingRates.method, method), eq(shippingRates.isActive, true)));
    
    if (!rate) {
      throw new Error('Shipping method not found');
    }

    const baseRate = parseFloat(rate.baseRate);
    const perPoundRate = parseFloat(rate.perPoundRate || '0');
    const freeThreshold = rate.freeShippingThreshold ? parseFloat(rate.freeShippingThreshold) : null;

    // Check if qualifies for free shipping
    const isFree = freeThreshold && subtotal >= freeThreshold;
    
    if (isFree) {
      return { cost: 0, isFree: true, method: rate.method };
    }

    const totalCost = baseRate + (weight * perPoundRate);
    return { cost: Math.max(totalCost, 0), isFree: false, method: rate.method };
  }

  async isStateProhibited(stateCode: string): Promise<boolean> {
    const [state] = await db.select().from(prohibitedStates)
      .where(and(eq(prohibitedStates.stateCode, stateCode.toUpperCase()), eq(prohibitedStates.isActive, true)));
    return !!state;
  }

  async getProhibitedState(stateCode: string) {
    const [state] = await db.select().from(prohibitedStates)
      .where(eq(prohibitedStates.stateCode, stateCode.toUpperCase()));
    return state;
  }

  // Enhanced Order Management
  async getAllOrdersWithDetails() {
    return await db.select({
      id: orders.id,
      userId: orders.userId,
      status: orders.status,
      subtotal: orders.subtotal,
      shippingCost: orders.shippingCost,
      tax: orders.tax,
      total: orders.total,
      shippingMethod: orders.shippingMethod,
      trackingNumber: orders.trackingNumber,
      estimatedDelivery: orders.estimatedDelivery,
      shippingName: orders.shippingName,
      shippingEmail: orders.shippingEmail,
      shippingPhone: orders.shippingPhone,
      shippingAddress: orders.shippingAddress,
      shippingAddress2: orders.shippingAddress2,
      shippingCity: orders.shippingCity,
      shippingState: orders.shippingState,
      shippingZip: orders.shippingZip,
      shippingCountry: orders.shippingCountry,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt
    }).from(orders).orderBy(desc(orders.createdAt));
  }



  async updateSpecialOffer(id: string, updates: Partial<InsertSpecialOffer>): Promise<SpecialOffer | undefined> {
    const [offer] = await db.update(specialOffers).set(updates).where(eq(specialOffers.id, id)).returning();
    return offer || undefined;
  }

  // Blog Management Methods
  async getBlogPosts(status?: string): Promise<BlogPost[]> {
    if (status) {
      return await db.select().from(blogPosts)
        .where(eq(blogPosts.status, status as 'draft' | 'published' | 'archived'))
        .orderBy(desc(blogPosts.createdAt));
    }
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return post || undefined;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const updateData: any = { ...updates, updatedAt: new Date() };
    const [post] = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id)).returning();
    return post || undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async incrementBlogViewCount(id: string): Promise<void> {
    await db.update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, id));
  }

  async getBlogCategories(): Promise<string[]> {
    try {
      const result = await db.selectDistinct({ category: blogPosts.category }).from(blogPosts);
      return result.map(r => r.category);
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
  }

  async getBlogsByCategory(category: string): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(and(eq(blogPosts.category, category), eq(blogPosts.status, 'published')))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db.select().from(blogPosts)
      .where(
        and(
          eq(blogPosts.status, 'published'),
          or(
            sql`LOWER(${blogPosts.title}) LIKE ${searchTerm}`,
            sql`LOWER(${blogPosts.content}) LIKE ${searchTerm}`,
            sql`LOWER(${blogPosts.excerpt}) LIKE ${searchTerm}`
          )
        )
      )
      .orderBy(desc(blogPosts.publishedAt));
  }

  // AI Memory Management Methods
  
  // Conversation Management
  async createConversation(conversation: InsertAIConversation): Promise<AIConversation> {
    const [result] = await db.insert(aiConversations).values(conversation).returning();
    return result;
  }

  async getConversation(id: string): Promise<AIConversation | undefined> {
    const [conversation] = await db.select().from(aiConversations).where(eq(aiConversations.id, id));
    return conversation;
  }

  async getConversationBySession(sessionId: string, userId?: string): Promise<AIConversation | undefined> {
    const conditions = [eq(aiConversations.sessionId, sessionId)];
    if (userId) {
      conditions.push(eq(aiConversations.userId, userId));
    }
    
    const [conversation] = await db.select().from(aiConversations)
      .where(and(...conditions));
    return conversation;
  }

  async getUserConversations(userId: string, limit: number = 10): Promise<AIConversation[]> {
    return await db.select().from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.lastInteractionAt))
      .limit(limit);
  }

  async updateConversation(id: string, updates: Partial<InsertAIConversation>): Promise<AIConversation | undefined> {
    const updateData = { ...updates, updatedAt: new Date() };
    const [conversation] = await db.update(aiConversations).set(updateData).where(eq(aiConversations.id, id)).returning();
    return conversation;
  }

  // Message Management
  async addMessage(message: InsertAIMessage): Promise<AIMessage> {
    const [result] = await db.insert(aiMessages).values(message).returning();
    
    // Update conversation metadata
    await db.update(aiConversations)
      .set({ 
        lastInteractionAt: new Date(),
        messageCount: sql`${aiConversations.messageCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(aiConversations.id, message.conversationId));
    
    return result;
  }

  async getConversationHistory(conversationId: string, limit: number = 50): Promise<AIMessage[]> {
    return await db.select().from(aiMessages)
      .where(eq(aiMessages.conversationId, conversationId))
      .orderBy(aiMessages.createdAt)
      .limit(limit);
  }

  async getRecentMessages(userId: string, limit: number = 20): Promise<AIMessage[]> {
    return await db.select().from(aiMessages)
      .where(eq(aiMessages.userId, userId))
      .orderBy(desc(aiMessages.createdAt))
      .limit(limit);
  }

  // User Profile Management
  async getAIUserProfile(userId: string): Promise<AIUserProfile | undefined> {
    const [profile] = await db.select().from(aiUserProfiles).where(eq(aiUserProfiles.userId, userId));
    return profile;
  }

  async createAIUserProfile(profile: InsertAIUserProfile): Promise<AIUserProfile> {
    const [result] = await db.insert(aiUserProfiles).values(profile).returning();
    return result;
  }

  async updateAIUserProfile(userId: string, updates: Partial<InsertAIUserProfile>): Promise<AIUserProfile | undefined> {
    const updateData = { ...updates, updatedAt: new Date() };
    const [profile] = await db.update(aiUserProfiles).set(updateData).where(eq(aiUserProfiles.userId, userId)).returning();
    return profile;
  }

  async getOrCreateAIUserProfile(userId: string): Promise<AIUserProfile> {
    let profile = await this.getAIUserProfile(userId);
    
    if (!profile) {
      profile = await this.createAIUserProfile({
        userId,
        preferences: JSON.stringify({}),
        interests: [],
        communicationStyle: 'casual',
        lastSeenProducts: [],
        frequentQuestions: [],
        purchasePatterns: JSON.stringify({}),
        satisfactionScore: '0.00',
        totalInteractions: 0,
        successfulRecommendations: 0,
        lastActiveAt: new Date()
      });
    }
    
    return profile;
  }

  // Context Memory Management
  async saveContext(context: InsertAIContextMemory): Promise<AIContextMemory> {
    // Check if context already exists and update or create new
    const existing = await db.select().from(aiContextMemory)
      .where(and(
        eq(aiContextMemory.userId, context.userId),
        eq(aiContextMemory.contextType, context.contextType),
        eq(aiContextMemory.contextKey, context.contextKey)
      ))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db.update(aiContextMemory)
        .set({ 
          contextValue: context.contextValue, 
          importance: context.importance || 1,
          updatedAt: new Date() 
        })
        .where(eq(aiContextMemory.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(aiContextMemory).values(context).returning();
      return created;
    }
  }

  async getContext(userId: string, contextType?: string): Promise<AIContextMemory[]> {
    const conditions = [eq(aiContextMemory.userId, userId), eq(aiContextMemory.isActive, true)];
    if (contextType) {
      conditions.push(eq(aiContextMemory.contextType, contextType as any));
    }

    return await db.select().from(aiContextMemory)
      .where(and(...conditions))
      .orderBy(desc(aiContextMemory.importance), desc(aiContextMemory.updatedAt));
  }

  async getContextByKey(userId: string, contextKey: string): Promise<AIContextMemory | undefined> {
    const [context] = await db.select().from(aiContextMemory)
      .where(and(
        eq(aiContextMemory.userId, userId),
        eq(aiContextMemory.contextKey, contextKey),
        eq(aiContextMemory.isActive, true)
      ));
    return context;
  }

  async clearExpiredContext(): Promise<void> {
    await db.update(aiContextMemory)
      .set({ isActive: false })
      .where(and(
        eq(aiContextMemory.isActive, true),
        sql`${aiContextMemory.expiresAt} < NOW()`
      ));
  }

  async updateInteractionStats(userId: string, successful: boolean = false): Promise<void> {
    const profile = await this.getOrCreateAIUserProfile(userId);
    
    await this.updateAIUserProfile(userId, {
      totalInteractions: profile.totalInteractions + 1,
      successfulRecommendations: successful ? 
        profile.successfulRecommendations + 1 : 
        profile.successfulRecommendations,
      lastActiveAt: new Date()
    });
  }

  // Daily Promotions Methods
  async createDailyPromotion(promotion: InsertDailyPromotion): Promise<DailyPromotion> {
    const [created] = await db.insert(dailyPromotions).values(promotion).returning();
    return created;
  }

  async getDailyPromotions(): Promise<DailyPromotion[]> {
    return await db.select().from(dailyPromotions)
      .where(eq(dailyPromotions.isActive, true))
      .orderBy(dailyPromotions.dayOfWeek);
  }

  async getDailyPromotionsByDay(dayOfWeek: number): Promise<DailyPromotion[]> {
    console.log(`Querying promotions for day: ${dayOfWeek}`);
    const results = await db.select().from(dailyPromotions)
      .where(and(
        eq(dailyPromotions.dayOfWeek, dayOfWeek),
        eq(dailyPromotions.isActive, true)
      ));
    console.log(`Found ${results.length} promotions for day ${dayOfWeek}:`, results);
    return results;
  }

  async getPromotionByDay(dayOfWeek: number): Promise<DailyPromotion[]> {
    return await this.getDailyPromotionsByDay(dayOfWeek);
  }

  async getDailyPromotion(id: string): Promise<DailyPromotion | undefined> {
    const [promotion] = await db.select().from(dailyPromotions)
      .where(eq(dailyPromotions.id, id))
      .limit(1);
    return promotion;
  }

  async getTodaysPromotions(): Promise<DailyPromotion[]> {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    return await this.getDailyPromotionsByDay(today);
  }

  async updateDailyPromotion(id: string, updates: Partial<InsertDailyPromotion>): Promise<DailyPromotion | undefined> {
    const [updated] = await db.update(dailyPromotions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(dailyPromotions.id, id))
      .returning();
    return updated;
  }

  async deleteDailyPromotion(id: string): Promise<boolean> {
    const result = await db.update(dailyPromotions)
      .set({ isActive: false })
      .where(eq(dailyPromotions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async recordPromotionUsage(usage: InsertPromotionUsage): Promise<PromotionUsage> {
    const [created] = await db.insert(promotionUsage).values(usage).returning();
    return created;
  }

  async getPromotionUsage(promotionId: string): Promise<PromotionUsage[]> {
    return await db.select().from(promotionUsage)
      .where(eq(promotionUsage.promotionId, promotionId))
      .orderBy(desc(promotionUsage.usedAt));
  }

  async calculatePromotionDiscount(
    promotion: DailyPromotion,
    cartTotal: number,
    cartItems: any[]
  ): Promise<number> {
    // Check minimum purchase requirement
    if (cartTotal < parseFloat(promotion.minPurchase || '0')) {
      return 0;
    }

    let discount = 0;
    
    switch (promotion.discountType) {
      case 'percentage':
        discount = cartTotal * (parseFloat(promotion.discountValue) / 100);
        break;
      case 'fixed':
        discount = parseFloat(promotion.discountValue);
        break;
      case 'bogo':
        // Buy one get one logic - simplified
        discount = cartTotal * 0.5;
        break;
      case 'bundle':
        // Bundle discount logic
        discount = cartTotal * (parseFloat(promotion.discountValue) / 100);
        break;
    }

    // Apply maximum discount limit if set
    if (promotion.maxDiscount) {
      discount = Math.min(discount, parseFloat(promotion.maxDiscount));
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  }

  async addPromotionUsage(usage: InsertPromotionUsage): Promise<PromotionUsage> {
    const [result] = await db.insert(promotionUsage).values(usage).returning();
    return result;
  }

  // Gamification System Methods

  // Initialize default achievements
  private async initializeAchievements(): Promise<void> {
    const existingAchievements = await db.select().from(achievements).limit(1);
    if (existingAchievements.length > 0) return;

    const defaultAchievements: InsertAchievement[] = [
      // Purchase Milestones
      {
        name: 'First Purchase',
        description: 'Complete your first order',
        category: 'purchase',
        icon: 'ShoppingBag',
        condition: { type: 'order_count', value: 1, comparison: 'gte' },
        rewardPoints: 100,
        badgeColor: '#22c55e',
        difficulty: 'easy'
      },
      {
        name: 'Big Spender',
        description: 'Spend $500 or more in a single order',
        category: 'purchase',
        icon: 'DollarSign',
        condition: { type: 'spend_amount', value: 500, comparison: 'gte' },
        rewardPoints: 500,
        badgeColor: '#f59e0b',
        difficulty: 'hard'
      },
      {
        name: 'Loyal Customer',
        description: 'Place 10 orders',
        category: 'milestone',
        icon: 'Heart',
        condition: { type: 'order_count', value: 10, comparison: 'gte' },
        rewardPoints: 750,
        badgeColor: '#ef4444',
        difficulty: 'normal'
      },
      {
        name: 'High Roller',
        description: 'Spend $2,000 total',
        category: 'milestone',
        icon: 'TrendingUp',
        condition: { type: 'spend_amount', value: 2000, comparison: 'gte' },
        rewardPoints: 1000,
        badgeColor: '#8b5cf6',
        difficulty: 'hard'
      },
      // Social Achievements
      {
        name: 'Social Butterfly',
        description: 'Refer 3 friends who make purchases',
        category: 'social',
        icon: 'Users',
        condition: { type: 'referral_count', value: 3, comparison: 'gte' },
        rewardPoints: 300,
        badgeColor: '#06b6d4',
        difficulty: 'normal'
      },
      // Streak Achievements
      {
        name: 'Week Warrior',
        description: 'Login for 7 consecutive days',
        category: 'streak',
        icon: 'Calendar',
        condition: { type: 'streak_days', value: 7, comparison: 'gte', metadata: { streakType: 'daily_login' } },
        rewardPoints: 200,
        badgeColor: '#10b981',
        difficulty: 'normal'
      },
      {
        name: 'Monthly Master',
        description: 'Make a purchase every week for a month',
        category: 'streak',
        icon: 'Award',
        condition: { type: 'streak_days', value: 30, comparison: 'gte', metadata: { streakType: 'weekly_purchase' } },
        rewardPoints: 800,
        badgeColor: '#f97316',
        difficulty: 'hard'
      },
      // Product Category Achievements
      {
        name: 'Flower Power',
        description: 'Purchase from all flower categories',
        category: 'milestone',
        icon: 'Flower',
        condition: { type: 'product_categories', value: 3, comparison: 'gte', metadata: { categories: ['flower'] } },
        rewardPoints: 400,
        badgeColor: '#84cc16',
        difficulty: 'normal'
      },
      // Legendary Achievements
      {
        name: 'THCA Legend',
        description: 'Reach Diamond tier and maintain for 6 months',
        category: 'milestone',
        icon: 'Crown',
        condition: { type: 'order_count', value: 50, comparison: 'gte' },
        rewardPoints: 2500,
        badgeColor: '#b9f2ff',
        difficulty: 'legendary',
        isHidden: true
      }
    ];

    await db.insert(achievements).values(defaultAchievements);
  }

  // Initialize daily challenges
  private async initializeDailyChallenges(): Promise<void> {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const existingChallenges = await db.select().from(dailyChallenges)
      .where(eq(dailyChallenges.validFrom, todayStr))
      .limit(1);
    
    if (existingChallenges.length > 0) return;

    const todayChallenges: InsertDailyChallenge[] = [
      {
        title: 'Daily Shopper',
        description: 'Make any purchase today',
        category: 'purchase',
        targetType: 'spend_amount',
        targetValue: 1,
        rewardPoints: 50,
        bonusMultiplier: '1.20',
        validFrom: todayStr,
        validUntil: todayStr,
        difficulty: 'easy'
      },
      {
        title: 'Big Purchase Day',
        description: 'Spend $100 or more today',
        category: 'purchase',
        targetType: 'spend_amount',
        targetValue: 100,
        rewardPoints: 150,
        bonusMultiplier: '1.50',
        validFrom: todayStr,
        validUntil: todayStr,
        difficulty: 'normal'
      },
      {
        title: 'Product Explorer',
        description: 'Add 3 different products to your cart',
        category: 'engagement',
        targetType: 'product_count',
        targetValue: 3,
        rewardPoints: 75,
        bonusMultiplier: '1.25',
        validFrom: todayStr,
        validUntil: todayStr,
        difficulty: 'easy'
      }
    ];

    await db.insert(dailyChallenges).values(todayChallenges);
  }

  // Achievement Methods
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(achievements.difficulty, achievements.rewardPoints);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db.select().from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.createdAt));
  }

  async createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const [result] = await db.insert(userAchievements).values(userAchievement).returning();
    return result;
  }

  async updateUserAchievementProgress(userId: string, achievementId: string, progress: number): Promise<UserAchievement | undefined> {
    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, achievementId));
    if (!achievement) return undefined;

    const isCompleted = progress >= (achievement.condition.value || 1);
    const updateData: Partial<InsertUserAchievement> = {
      progress,
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined
    };

    const [result] = await db.update(userAchievements)
      .set(updateData)
      .where(and(eq(userAchievements.userId, userId), eq(userAchievements.achievementId, achievementId)))
      .returning();

    // Award points if completed
    if (isCompleted && result && !result.notified) {
      await this.addPointTransaction({
        userId,
        points: achievement.rewardPoints,
        type: 'bonus',
        description: `Achievement unlocked: ${achievement.name}`,
        multiplier: '1.00'
      });

      // Mark as notified
      await db.update(userAchievements)
        .set({ notified: true })
        .where(eq(userAchievements.id, result.id));
    }

    return result;
  }

  // Daily Challenges
  async getDailyChallenges(date?: string): Promise<DailyChallenge[]> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return await db.select().from(dailyChallenges)
      .where(and(
        eq(dailyChallenges.isActive, true),
        eq(dailyChallenges.validFrom, targetDate)
      ))
      .orderBy(dailyChallenges.difficulty, dailyChallenges.rewardPoints);
  }

  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    return await db.select().from(userChallenges)
      .where(eq(userChallenges.userId, userId))
      .orderBy(desc(userChallenges.createdAt));
  }

  async createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge> {
    const [result] = await db.insert(userChallenges).values(userChallenge).returning();
    return result;
  }

  async updateUserChallengeProgress(userId: string, challengeId: string, progress: number): Promise<UserChallenge | undefined> {
    const [challenge] = await db.select().from(dailyChallenges).where(eq(dailyChallenges.id, challengeId));
    if (!challenge) return undefined;

    const isCompleted = progress >= challenge.targetValue;
    const updateData: Partial<InsertUserChallenge> = {
      progress,
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined
    };

    const [result] = await db.update(userChallenges)
      .set(updateData)
      .where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId)))
      .returning();

    return result;
  }

  async claimChallengeReward(userId: string, challengeId: string): Promise<boolean> {
    const [userChallenge] = await db.select().from(userChallenges)
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.challengeId, challengeId),
        eq(userChallenges.isCompleted, true),
        eq(userChallenges.rewardClaimed, false)
      ));

    if (!userChallenge) return false;

    const [challenge] = await db.select().from(dailyChallenges).where(eq(dailyChallenges.id, challengeId));
    if (!challenge) return false;

    // Award points
    await this.addPointTransaction({
      userId,
      points: challenge.rewardPoints,
      type: 'bonus',
      description: `Challenge completed: ${challenge.title}`,
      multiplier: challenge.bonusMultiplier
    });

    // Mark reward as claimed
    await db.update(userChallenges)
      .set({ rewardClaimed: true })
      .where(eq(userChallenges.id, userChallenge.id));

    return true;
  }

  // Streak Management
  async getUserStreaks(userId: string): Promise<LoyaltyStreak[]> {
    return await db.select().from(loyaltyStreaks)
      .where(eq(loyaltyStreaks.userId, userId));
  }

  async updateStreak(userId: string, streakType: string, activityDate: Date): Promise<LoyaltyStreak> {
    const [existingStreak] = await db.select().from(loyaltyStreaks)
      .where(and(eq(loyaltyStreaks.userId, userId), eq(loyaltyStreaks.streakType, streakType)));

    const today = activityDate.toISOString().split('T')[0];
    
    if (!existingStreak) {
      // Create new streak
      const [newStreak] = await db.insert(loyaltyStreaks).values({
        userId,
        streakType,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        streakMultiplier: '1.10'
      }).returning();
      return newStreak;
    }

    const lastActivity = new Date(existingStreak.lastActivityDate || '');
    const daysDiff = Math.floor((activityDate.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    let newCurrentStreak: number;
    if (daysDiff === 1) {
      // Consecutive day
      newCurrentStreak = existingStreak.currentStreak + 1;
    } else if (daysDiff === 0) {
      // Same day, no change
      return existingStreak;
    } else {
      // Streak broken, restart
      newCurrentStreak = 1;
    }

    const newLongestStreak = Math.max(existingStreak.longestStreak, newCurrentStreak);
    const newMultiplier = Math.min(1.0 + (newCurrentStreak * 0.05), 2.0).toFixed(2);

    const [updatedStreak] = await db.update(loyaltyStreaks)
      .set({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
        streakMultiplier: newMultiplier,
        updatedAt: new Date()
      })
      .where(eq(loyaltyStreaks.id, existingStreak.id))
      .returning();

    return updatedStreak;
  }

  // Leaderboard
  async getLeaderboard(period: 'weekly' | 'monthly' | 'all_time', limit: number = 10): Promise<LoyaltyLeaderboard[]> {
    return await db.select().from(loyaltyLeaderboard)
      .where(eq(loyaltyLeaderboard.period, period))
      .orderBy(loyaltyLeaderboard.rank)
      .limit(limit);
  }

  async updateLeaderboard(userId: string, period: 'weekly' | 'monthly' | 'all_time'): Promise<void> {
    const userReward = await this.getUserRewards(userId);
    if (!userReward) return;

    const userAchievements = await this.getUserAchievements(userId);
    const completedCount = userAchievements.filter(ua => ua.isCompleted).length;
    
    const userStreaks = await this.getUserStreaks(userId);
    const longestStreak = Math.max(...userStreaks.map(s => s.longestStreak), 0);

    // Calculate rank
    const allUsers = await db.select().from(userRewards);
    const sortedByPoints = allUsers.sort((a, b) => b.totalPoints - a.totalPoints);
    const rank = sortedByPoints.findIndex(u => u.userId === userId) + 1;

    // Upsert leaderboard entry
    const [existing] = await db.select().from(loyaltyLeaderboard)
      .where(and(eq(loyaltyLeaderboard.userId, userId), eq(loyaltyLeaderboard.period, period)));

    if (existing) {
      await db.update(loyaltyLeaderboard)
        .set({
          rank,
          points: userReward.totalPoints,
          achievementCount: completedCount,
          longestStreak,
          updatedAt: new Date()
        })
        .where(eq(loyaltyLeaderboard.id, existing.id));
    } else {
      await db.insert(loyaltyLeaderboard).values({
        userId,
        period,
        rank,
        points: userReward.totalPoints,
        achievementCount: completedCount,
        longestStreak
      });
    }
  }

  // Promo Code System Methods
  async getPromoCodes(): Promise<PromoCode[]> {
    return await db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
  }

  async getPromoCodeByCode(code: string): Promise<PromoCode | undefined> {
    const result = await db.select().from(promoCodes).where(eq(promoCodes.code, code.toUpperCase())).limit(1);
    return result[0];
  }

  async createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode> {
    const result = await db.insert(promoCodes).values(promoCode).returning();
    return result[0];
  }

  async updatePromoCodeUsage(code: string): Promise<PromoCode | undefined> {
    const result = await db.update(promoCodes)
      .set({ 
        currentUses: sql`${promoCodes.currentUses} + 1`,
        updatedAt: new Date()
      })
      .where(eq(promoCodes.code, code.toUpperCase()))
      .returning();
    return result[0];
  }

  async validatePromoCode(code: string, orderTotal: number): Promise<PromoCode | null> {
    const promoCode = await this.getPromoCodeByCode(code);
    
    if (!promoCode) {
      return null;
    }

    // Check if expired
    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return null;
    }

    // Check usage limit
    if (promoCode.maxUses && (promoCode.currentUses || 0) >= promoCode.maxUses) {
      return null;
    }

    // Check minimum purchase requirement
    const minPurchase = parseFloat(promoCode.minPurchase || '0');
    if (orderTotal < minPurchase) {
      return null;
    }

    return promoCode;
  }

  // Calculate discount amount with limits
  calculateDiscountAmount(promoCode: any, subtotal: number): number {
    let discountAmount = 0;
    
    if (promoCode.discountType === 'percentage') {
      discountAmount = (subtotal * parseFloat(promoCode.discountValue)) / 100;
      
      // Apply maximum discount cap if specified
      if (promoCode.maxDiscountAmount) {
        const maxCap = parseFloat(promoCode.maxDiscountAmount);
        discountAmount = Math.min(discountAmount, maxCap);
      }
    } else if (promoCode.discountType === 'fixed') {
      discountAmount = Math.min(parseFloat(promoCode.discountValue), subtotal);
    }
    
    // Ensure discount doesn't exceed subtotal
    return Math.min(discountAmount, subtotal);
  }

  // Store Credit System Methods
  async updateUserStoreCredit(userId: string, newBalance: string): Promise<void> {
    await db.update(users)
      .set({ storeCredit: newBalance })
      .where(eq(users.id, userId));
  }

  async updateUserPoints(userId: string, newPoints: number): Promise<void> {
    await db.update(userRewards)
      .set({ totalPoints: newPoints })
      .where(eq(userRewards.userId, userId));
  }

  async createStoreCreditTransaction(transaction: any): Promise<any> {
    const result = await db.insert(storeCreditTransactions).values(transaction).returning();
    return result[0];
  }

  async getStoreCreditTransactions(userId: string): Promise<any[]> {
    return db.select()
      .from(storeCreditTransactions)
      .where(eq(storeCreditTransactions.userId, userId))
      .orderBy(desc(storeCreditTransactions.createdAt));
  }

  async createPointTransaction(transaction: any): Promise<any> {
    const result = await db.insert(pointTransactions).values(transaction).returning();
    return result[0];
  }

  async getReferral(id: string): Promise<any> {
    const result = await db.select().from(referralProgram).where(eq(referralProgram.id, id));
    return result[0];
  }

  async updateReferralStatus(id: string, status: string): Promise<void> {
    await db.update(referralProgram)
      .set({ status: status as any })
      .where(eq(referralProgram.id, id));
  }



  async getUserOrderCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql`count(*)` })
      .from(orders)
      .where(eq(orders.userId, userId));
    return parseInt(result[0]?.count as string || '0');
  }

  async claimAchievementReward(userId: string, achievementId: string): Promise<any> {
    // Mark achievement as rewarded and return points
    await db.update(userAchievements)
      .set({ notified: true })
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ));

    // Get achievement details
    const achievement = await db.select().from(achievements).where(eq(achievements.id, achievementId));
    return achievement[0];
  }

  async recordAchievement(userId: string, achievementId: string, progress: number = 1): Promise<void> {
    // Check if user achievement already exists
    const existing = await db.select()
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ));

    if (existing.length === 0) {
      // Create new user achievement
      await db.insert(userAchievements).values({
        userId,
        achievementId,
        progress,
        maxProgress: progress,
        isCompleted: null,
        notified: false
      });
    } else {
      // Update existing progress
      await db.update(userAchievements)
        .set({ 
          progress: sql`${userAchievements.progress} + ${progress}`,
          maxProgress: sql`GREATEST(${userAchievements.maxProgress}, ${userAchievements.progress} + ${progress})`
        })
        .where(and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        ));
    }
  }


}

export const storage = new DatabaseStorage();