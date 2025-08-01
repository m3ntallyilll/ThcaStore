import { 
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  clearProducts(): Promise<void>;

  // Cart methods
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<void>;

  // Order methods
  getOrders(userId?: string): Promise<Order[]>;
  getAllOrders(): Promise<(Order & { user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'> })[]>;
  getAllOrdersWithDetails(): Promise<any[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<(OrderItem & { product: Product })[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Cart methods extensions
  removeCartItem(id: string): Promise<boolean>;

  // Initialization
  initialize(): Promise<void>;

  // Rewards and Loyalty System
  getUserRewards(userId: string): Promise<any>;
  getRewardTiers(): Promise<any[]>;
  getPointTransactions(userId: string): Promise<any[]>;
  addPointTransaction(transaction: any): Promise<any>;

  // Referral System
  getUserReferrals(userId: string): Promise<any[]>;
  createReferral(referral: any): Promise<any>;
  getReferralByCode(code: string): Promise<any>;

  // Special Offers
  getActiveOffers(): Promise<any[]>;
  getSpecialOffers(): Promise<any[]>;
  createSpecialOffer(offer: any): Promise<any>;

  // Blog System
  getBlogPosts(): Promise<any[]>;
  getPublishedBlogPosts(): Promise<any[]>;
  getBlogsByCategory(category: string): Promise<any[]>;
  getBlogPost(id: string): Promise<any>;
  getBlogPostBySlug(slug: string): Promise<any>;
  createBlogPost(post: any): Promise<any>;
  updateBlogPost(id: string, updates: any): Promise<any>;
  deleteBlogPost(id: string): Promise<boolean>;
  incrementBlogViewCount(id: string): Promise<void>;
  getBlogCategories(): Promise<string[]>;
  searchBlogPosts(query: string): Promise<any[]>;

  // Shipping
  getShippingRates(): Promise<any[]>;
  calculateShippingCost(weight: number, method: string): Promise<number>;

  // Daily Promotions
  getTodaysPromotions(): Promise<any[]>;
  getDailyPromotions(): Promise<any[]>;
  getPromotionByDay(dayOfWeek: number): Promise<any[]>;
  getDailyPromotionsByDay(dayOfWeek: number): Promise<any[]>;
  getDailyPromotion(id: string): Promise<any>;
  createDailyPromotion(promotion: any): Promise<any>;
  updateDailyPromotion(id: string, updates: any): Promise<any>;
  deleteDailyPromotion(id: string): Promise<boolean>;
  calculatePromotionDiscount(promotionId: string, amount: number): Promise<number>;
  recordPromotionUsage(promotionId: string, userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private userRewards: Map<string, any>;
  private rewardTiers: Map<string, any>;
  private pointTransactions: Map<string, any>;
  private referrals: Map<string, any>;
  private specialOffers: Map<string, any>;
  private blogPosts: Map<string, any>;
  private shippingRates: Map<string, any>;
  private dailyPromotions: Map<string, any>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.userRewards = new Map();
    this.rewardTiers = new Map();
    this.pointTransactions = new Map();
    this.referrals = new Map();
    this.specialOffers = new Map();
    this.blogPosts = new Map();
    this.shippingRates = new Map();
    this.dailyPromotions = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample products
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Purple Haze THCA",
        description: "Premium indoor-grown THCA flower with exceptional terpene profile and rich purple hues. Known for its euphoric and creative effects.",
        price: "89.99",
        category: "flower",
        imageUrl: "https://images.unsplash.com/photo-1560718547-8c2234c7d1c4?w=400",
        stock: 23,
        weight: "0.22",
        featured: true,
        rating: "4.8",
        thcaContent: "28.5",
        strainType: "Sativa Dominant",
        effects: ["euphoric", "creative", "uplifting"] as string[],
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Live Resin Diamond",
        description: "99% pure THCA diamonds with full-spectrum terpenes preserved through our proprietary extraction process.",
        price: "149.99",
        category: "concentrates",
        imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
        stock: 12,
        weight: "0.03",
        featured: true,
        rating: "4.9",
        thcaContent: "99.2",
        strainType: "Hybrid",
        effects: ["relaxing", "potent", "flavorful"] as string[],
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "THCA Gummies",
        description: "Precisely dosed THCA gummies with natural fruit flavors. Each gummy contains 10mg of THCA for consistent effects.",
        price: "49.99",
        category: "edibles",
        imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400",
        stock: 45,
        weight: "0.006",
        featured: false,
        rating: "4.7",
        thcaContent: "10.0",
        strainType: "N/A",
        effects: ["long-lasting", "precise", "tasty"] as string[],
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "Premium Grinder",
        description: "Precision-machined aluminum grinder with kief catcher and magnetic closure. Perfect for preparing your THCA flower.",
        price: "79.99",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400",
        stock: 18,
        weight: "0.25",
        featured: false,
        rating: "4.6",
        thcaContent: null,
        strainType: null,
        effects: [] as string[],
        createdAt: new Date(),
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: insertUser.isAdmin ?? false,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct,
      id,
      stock: insertProduct.stock ?? 0,
      weight: insertProduct.weight ?? null,
      featured: insertProduct.featured ?? false,
      rating: insertProduct.rating ?? "0",
      thcaContent: insertProduct.thcaContent ?? null,
      strainType: insertProduct.strainType ?? null,
      effects: insertProduct.effects && Array.isArray(insertProduct.effects) ? insertProduct.effects as string[] : null,
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { 
      ...product, 
      ...updates,
      effects: updates.effects !== undefined ? (updates.effects && Array.isArray(updates.effects) ? updates.effects as string[] : null) : product.effects
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async clearProducts(): Promise<void> {
    this.products.clear();
  }

  // Cart methods
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    const userCartItems = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    const cartItemsWithProducts = userCartItems.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return { ...item, product };
    });
    return cartItemsWithProducts;
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      existingItem.quantity += insertCartItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = { 
      ...insertCartItem,
      id,
      quantity: insertCartItem.quantity || 1,
      createdAt: new Date() 
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    const userCartItems = Array.from(this.cartItems.entries()).filter(
      ([_, item]) => item.userId === userId
    );
    userCartItems.forEach(([id]) => this.cartItems.delete(id));
  }

  // Order methods  
  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return Array.from(this.orders.values()).filter(order => order.userId === userId);
    }
    return Array.from(this.orders.values());
  }

  async getAllOrders(): Promise<(Order & { user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'> })[]> {
    const ordersWithUsers = Array.from(this.orders.values()).map(order => {
      const user = this.users.get(order.userId);
      if (!user) throw new Error(`User not found: ${order.userId}`);
      return { 
        ...order, 
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName 
        } 
      };
    });
    return ordersWithUsers;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder,
      id,
      status: insertOrder.status || "pending",
      shippingCost: insertOrder.shippingCost || "0.00",
      shippingMethod: insertOrder.shippingMethod || "standard",
      trackingNumber: insertOrder.trackingNumber || null,
      paymentStatus: insertOrder.paymentStatus || "pending",
      shippingAddress: insertOrder.shippingAddress || "",
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<(OrderItem & { product: Product })[]> {
    const orderOrderItems = Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
    const orderItemsWithProducts = orderOrderItems.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return { ...item, product };
    });
    return orderItemsWithProducts;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    order.status = status;
    this.orders.set(id, order);
    return order;
  }

  // Additional order methods
  async getAllOrdersWithDetails(): Promise<any[]> {
    return Array.from(this.orders.values()).map(order => {
      const user = this.users.get(order.userId);
      return { ...order, user };
    });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.getOrders(userId);
  }

  // Cart method extensions
  async removeCartItem(id: string): Promise<boolean> {
    return this.removeFromCart(id);
  }

  // Initialization
  async initialize(): Promise<void> {
    // Initialize default admin user
    await this.initializeAdminUser();

    // Initialize sample reward tiers
    const sampleTiers = [
      { id: '1', name: 'Bronze', minPoints: 0, multiplier: '1.00', benefits: ['Basic rewards'], color: '#CD7F32' },
      { id: '2', name: 'Silver', minPoints: 1000, multiplier: '1.25', benefits: ['Enhanced rewards'], color: '#C0C0C0' },
      { id: '3', name: 'Gold', minPoints: 5000, multiplier: '1.50', benefits: ['Premium rewards'], color: '#FFD700' }
    ];
    sampleTiers.forEach(tier => this.rewardTiers.set(tier.id, tier));

    // Initialize sample shipping rates
    const sampleRates = [
      { id: '1', method: 'standard', name: 'Standard Shipping', baseRate: '9.99', estimatedDays: '5-7 days' },
      { id: '2', method: 'express', name: 'Express Shipping', baseRate: '19.99', estimatedDays: '2-3 days' }
    ];
    sampleRates.forEach(rate => this.shippingRates.set(rate.id, rate));

    // Initialize AI sales strategy as activated by default
    await this.initializeAISalesStrategy();
  }

  private async initializeAdminUser(): Promise<void> {
    // Check if admin already exists
    const existingAdmin = await this.getUserByEmail('admin@thca-store.com');
    if (existingAdmin) return;

    // Hash password for admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser: User = {
      id: randomUUID(),
      username: 'admin',
      email: 'admin@thca-store.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true,
      createdAt: new Date()
    };

    this.users.set(adminUser.id, adminUser);
    console.log('✓ Default admin user created: admin@thca-store.com / admin123');
  }

  private async initializeAISalesStrategy(): Promise<void> {
    // Initialize AI sales strategy as activated by default
    // This ensures the AI features and inventory remain persistent across restarts
    try {
      // Set up global storage reference for seed functions
      (global as any).storage = this;
      
      const seedModule = await import('./seed-inventory-real-images');
      const seedInventoryProducts = seedModule.default || seedModule.seedInventoryProducts;
      await seedInventoryProducts();
      console.log('✓ AI Sales Strategy activated with real professional images');
    } catch (error) {
      console.log('AI Sales Strategy initialization skipped:', error);
    }
  }

  // Rewards and Loyalty System
  async getUserRewards(userId: string): Promise<any> {
    return this.userRewards.get(userId) || { userId, totalPoints: 0, currentTierId: '1' };
  }

  async getRewardTiers(): Promise<any[]> {
    return Array.from(this.rewardTiers.values());
  }

  async getPointTransactions(userId: string): Promise<any[]> {
    return Array.from(this.pointTransactions.values()).filter((t: any) => t.userId === userId);
  }

  async addPointTransaction(transaction: any): Promise<any> {
    const id = randomUUID();
    const newTransaction = { ...transaction, id, createdAt: new Date() };
    this.pointTransactions.set(id, newTransaction);
    return newTransaction;
  }

  // Referral System  
  async getUserReferrals(userId: string): Promise<any[]> {
    return Array.from(this.referrals.values()).filter((r: any) => r.referrerId === userId);
  }

  async createReferral(referral: any): Promise<any> {
    const id = randomUUID();
    const newReferral = { ...referral, id, createdAt: new Date() };
    this.referrals.set(id, newReferral);
    return newReferral;
  }

  async getReferralByCode(code: string): Promise<any> {
    return Array.from(this.referrals.values()).find((r: any) => r.referralCode === code);
  }

  // Special Offers
  async getActiveOffers(): Promise<any[]> {
    return Array.from(this.specialOffers.values()).filter((o: any) => o.isActive);
  }

  async getSpecialOffers(): Promise<any[]> {
    return Array.from(this.specialOffers.values());
  }

  async createSpecialOffer(offer: any): Promise<any> {
    const id = randomUUID();
    const newOffer = { ...offer, id, createdAt: new Date() };
    this.specialOffers.set(id, newOffer);
    return newOffer;
  }

  // Blog System
  async getBlogPosts(): Promise<any[]> {
    return Array.from(this.blogPosts.values());
  }

  async getPublishedBlogPosts(): Promise<any[]> {
    return Array.from(this.blogPosts.values()).filter((p: any) => p.status === 'published');
  }

  async getBlogsByCategory(category: string): Promise<any[]> {
    return Array.from(this.blogPosts.values()).filter((p: any) => p.category === category);
  }

  async getBlogPost(id: string): Promise<any> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<any> {
    return Array.from(this.blogPosts.values()).find((p: any) => p.slug === slug);
  }

  async createBlogPost(post: any): Promise<any> {
    const id = randomUUID();
    const newPost = { ...post, id, createdAt: new Date(), updatedAt: new Date() };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: string, updates: any): Promise<any> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    const updatedPost = { ...post, ...updates, updatedAt: new Date() };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async incrementBlogViewCount(id: string): Promise<void> {
    const post = this.blogPosts.get(id);
    if (post) {
      post.viewCount = (post.viewCount || 0) + 1;
      this.blogPosts.set(id, post);
    }
  }

  async getBlogCategories(): Promise<string[]> {
    const categories = new Set<string>();
    Array.from(this.blogPosts.values()).forEach((p: any) => {
      if (p.category) categories.add(p.category);
    });
    return Array.from(categories);
  }

  async searchBlogPosts(query: string): Promise<any[]> {
    return Array.from(this.blogPosts.values()).filter((p: any) => 
      p.title?.toLowerCase().includes(query.toLowerCase()) || 
      p.content?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Shipping
  async getShippingRates(): Promise<any[]> {
    return Array.from(this.shippingRates.values());
  }

  async calculateShippingCost(weight: number, method: string): Promise<number> {
    const rate = Array.from(this.shippingRates.values()).find((r: any) => r.method === method);
    return rate ? parseFloat(rate.baseRate) : 9.99;
  }

  // Daily Promotions
  async getTodaysPromotions(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.dailyPromotions.values()).filter((p: any) => p.date === today);
  }

  async getDailyPromotions(): Promise<any[]> {
    return Array.from(this.dailyPromotions.values());
  }

  async getPromotionByDay(day: string): Promise<any> {
    return Array.from(this.dailyPromotions.values()).find((p: any) => p.date === day);
  }

  async getDailyPromotionsByDay(dayOfWeek: number): Promise<any[]> {
    return Array.from(this.dailyPromotions.values()).filter((p: any) => p.dayOfWeek === dayOfWeek);
  }

  async getDailyPromotion(id: string): Promise<any> {
    return this.dailyPromotions.get(id);
  }

  async createDailyPromotion(promotion: any): Promise<any> {
    const id = randomUUID();
    const newPromotion = { ...promotion, id, createdAt: new Date() };
    this.dailyPromotions.set(id, newPromotion);
    return newPromotion;
  }

  async updateDailyPromotion(id: string, updates: any): Promise<any> {
    const promotion = this.dailyPromotions.get(id);
    if (!promotion) return undefined;
    const updatedPromotion = { ...promotion, ...updates };
    this.dailyPromotions.set(id, updatedPromotion);
    return updatedPromotion;
  }

  async deleteDailyPromotion(id: string): Promise<boolean> {
    return this.dailyPromotions.delete(id);
  }

  async calculatePromotionDiscount(promotionId: string, amount: number): Promise<number> {
    const promotion = this.dailyPromotions.get(promotionId);
    if (!promotion) return 0;
    return promotion.type === 'percentage' ? (amount * parseFloat(promotion.value)) / 100 : parseFloat(promotion.value);
  }

  async recordPromotionUsage(promotionId: string, userId: string): Promise<void> {
    const promotion = this.dailyPromotions.get(promotionId);
    if (promotion) {
      promotion.currentUses = (promotion.currentUses || 0) + 1;
      this.dailyPromotions.set(promotionId, promotion);
    }
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
