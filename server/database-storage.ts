import { db } from './db';
import { eq, and, desc, sql } from 'drizzle-orm';
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
  InsertSpecialOffer
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
  prohibitedStates
} from '@shared/schema';

export class DatabaseStorage {
  
  // Initialize default data
  async initialize(): Promise<void> {
    await this.initializeRewardTiers();
    await this.initializeShippingRates();
    await this.initializeProhibitedStates();
    await this.initializeSampleProducts();
    await this.initializeSpecialOffers();
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
        reason: 'Cannabis products including THCA are prohibited under state law',
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
        reason: 'Cannabis derivatives including THCA not permitted',
        isActive: true
      }
    ];

    await db.insert(prohibitedStates).values(prohibited);
  }

  private async initializeSampleProducts(): Promise<void> {
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length > 0) return;

    const sampleProducts: InsertProduct[] = [
      {
        name: "Purple Haze THCA",
        description: "Premium indoor-grown THCA flower with exceptional terpene profile and rich purple hues. Known for its euphoric and creative effects.",
        price: "89.99",
        category: "flower",
        imageUrl: "https://images.unsplash.com/photo-1560718547-8c2234c7d1c4?w=400",
        stock: 23,
        weight: "0.25",
        featured: true,
        rating: "4.8",
        thcaContent: "28.5",
        strainType: "Sativa Dominant",
        effects: ["euphoric", "creative", "uplifting"]
      },
      {
        name: "Live Resin Diamond",
        description: "99% pure THCA diamonds with full-spectrum terpenes preserved through our proprietary extraction process.",
        price: "149.99",
        category: "concentrates",
        imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
        stock: 12,
        weight: "0.05",
        featured: true,
        rating: "4.9",
        thcaContent: "99.2",
        strainType: "Hybrid",
        effects: ["relaxing", "potent", "flavorful"]
      },
      {
        name: "THCA Gummies",
        description: "Precisely dosed THCA gummies with natural fruit flavors. Each gummy contains 10mg of THCA for consistent effects.",
        price: "49.99",
        category: "edibles",
        imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400",
        stock: 45,
        weight: "0.15",
        featured: false,
        rating: "4.7",
        thcaContent: "10.0",
        strainType: "N/A",
        effects: ["long-lasting", "precise", "tasty"]
      },
      {
        name: "Premium Grinder",
        description: "Precision-machined aluminum grinder with kief catcher and magnetic closure. Perfect for preparing your THCA flower.",
        price: "79.99",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400",
        stock: 18,
        weight: "0.75",
        featured: false,
        rating: "4.6",
        thcaContent: null,
        strainType: null,
        effects: null
      }
    ];

    for (const product of sampleProducts) {
      await db.insert(products).values(product);
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
    const [product] = await db.insert(products).values(insertProduct).returning();
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
    
    // Award points for the order
    await this.awardPointsForOrder(order);
    
    return order;
  }

  async updateOrderStatus(id: string, status: string, trackingNumber?: string): Promise<Order | undefined> {
    const updateData: any = { status };
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }
    
    const [order] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
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
    const userReward = await this.getUserRewards(order.userId);
    if (!userReward || !userReward.currentTierId) return;

    const [tier] = await db.select().from(rewardTiers).where(eq(rewardTiers.id, userReward.currentTierId));
    if (!tier) return;

    // Calculate points: $1 = 1 point, multiplied by tier multiplier
    const basePoints = Math.floor(parseFloat(order.total));
    const multiplier = parseFloat(tier.multiplier);
    const pointsEarned = Math.floor(basePoints * multiplier);

    await this.addPointTransaction({
      userId: order.userId,
      orderId: order.id,
      points: pointsEarned,
      type: 'earned',
      description: `Points earned from order #${order.id.slice(-8)}`,
      multiplier: tier.multiplier
    });

    // Update monthly purchases and lifetime spent
    await this.updateUserRewards(order.userId, {
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
    const perPoundRate = parseFloat(rate.perPoundRate);
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
        .where(eq(blogPosts.status, status))
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
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
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
    const result = await db.selectDistinct({ category: blogPosts.category }).from(blogPosts);
    return result.map(r => r.category);
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

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogCategories(): Promise<string[]> {
    const categories = await db.selectDistinct({ category: blogPosts.category })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'));
    return categories.map(cat => cat.category);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const result = await db.select().from(blogPosts)
      .where(and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.status, 'published')
      ))
      .limit(1);
    return result[0] || null;
  }

  async incrementBlogPostViews(id: string): Promise<void> {
    await db.update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, id));
  }
}

export const storage = new DatabaseStorage();