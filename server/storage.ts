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

  // Promo Code System
  getPromoCodes(): Promise<any[]>;
  getPromoCodeByCode(code: string): Promise<any>;
  createPromoCode(promoCode: any): Promise<any>;
  updatePromoCodeUsage(code: string): Promise<any>;
  validatePromoCode(code: string, orderTotal: number): Promise<any>;
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
  private promoCodes: Map<string, any>;

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
    this.promoCodes = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Pre-rolls
    const preRolls = [
      {
        id: "pr-sour-diesel-infused",
        name: "Sour Diesel Infused Pre-Roll",
        description: "Premium Sour Diesel flower infused with THCA diamonds for maximum potency and flavor.",
        price: "15.99",
        category: "prerolls",
        imageUrl: `/api/placeholder/400/400`,
        stock: 25,
        weight: "1.25g",
        featured: true,
        rating: "4.8",
        thcaContent: "32.5",
        strainType: "Sativa",
        effects: ["energizing", "uplifting", "focused"] as string[],
        variants: null,
        subcategory: "infused",
        potency: "High",
        priceRange: { min: 15, max: 16 },
        createdAt: new Date(),
      },
      {
        id: "pr-purple-koolaid-infused",
        name: "Purple Koolaid Infused Pre-Roll",
        description: "Sweet Purple Koolaid strain infused with THCA diamonds for a flavorful and potent experience.",
        price: "17.99",
        category: "prerolls",
        imageUrl: `/api/placeholder/400/400`,
        stock: 20,
        weight: "1.45g",
        featured: true,
        rating: "4.9",
        thcaContent: "34.2",
        strainType: "Indica",
        effects: ["relaxing", "euphoric", "sweet"] as string[],
        variants: null,
        subcategory: "infused",
        potency: "High",
        priceRange: { min: 17, max: 18 },
        createdAt: new Date(),
      },
      {
        id: "pr-sour-lemon-diesel",
        name: "Sour Lemon Diesel Pre-Roll",
        description: "Zesty Sour Lemon Diesel strain with citrus terpenes and energizing effects.",
        price: "12.99",
        category: "prerolls",
        imageUrl: `/api/placeholder/400/400`,
        stock: 30,
        weight: "1.25g",
        featured: false,
        rating: "4.7",
        thcaContent: "28.8",
        strainType: "Sativa",
        effects: ["energizing", "citrusy", "creative"] as string[],
        variants: null,
        subcategory: "single",
        potency: "Medium",
        priceRange: { min: 12, max: 13 },
        createdAt: new Date(),
      },
      {
        id: "pr-too-tall",
        name: "Too Tall Pre-Roll",
        description: "Premium Too Tall strain known for its towering effects and smooth smoke.",
        price: "13.99",
        category: "prerolls",
        imageUrl: `/api/placeholder/400/400`,
        stock: 22,
        weight: "1.25g",
        featured: false,
        rating: "4.6",
        thcaContent: "29.3",
        strainType: "Hybrid",
        effects: ["balanced", "smooth", "mellow"] as string[],
        variants: null,
        subcategory: "single",
        potency: "Medium",
        priceRange: { min: 13, max: 14 },
        createdAt: new Date(),
      },
      {
        id: "pr-runtz",
        name: "Runtz Pre-Roll",
        description: "Sweet and fruity Runtz strain with candy-like flavors and balanced effects.",
        price: "16.99",
        category: "prerolls",
        imageUrl: `/api/placeholder/400/400`,
        stock: 18,
        weight: "1.45g",
        featured: true,
        rating: "4.8",
        thcaContent: "31.7",
        strainType: "Hybrid",
        effects: ["sweet", "fruity", "euphoric"] as string[],
        variants: null,
        subcategory: "single",
        potency: "High",
        priceRange: { min: 16, max: 17 },
        createdAt: new Date(),
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
        subcategory: "indica",
        potency: "Medium"
      },
      {
        name: "Purple Koolaid Infused with THCA Diamonds",
        description: "Premium Purple Koolaid flower infused with pure THCA diamonds for maximum potency.",
        strainType: "Indica",
        thcaContent: "38.5",
        effects: ["potent", "relaxing", "sweet"],
        subcategory: "infused",
        potency: "High"
      },
      {
        name: "Sour Diesel",
        description: "Classic energizing sativa with diesel fuel aroma and uplifting effects.",
        strainType: "Sativa",
        thcaContent: "27.3",
        effects: ["energizing", "diesel", "uplifting"],
        subcategory: "sativa",
        potency: "Medium"
      },
      {
        name: "Sour Lemon Diesel",
        description: "Citrusy sativa blend with sour lemon flavors and energizing properties.",
        strainType: "Sativa",
        thcaContent: "28.9",
        effects: ["citrusy", "energizing", "sour"],
        subcategory: "sativa",
        potency: "Medium"
      },
      {
        name: "Sour Diesel Popcorn Buds",
        description: "Premium Sour Diesel popcorn buds offering the same quality at a better value.",
        strainType: "Sativa",
        thcaContent: "26.1",
        effects: ["energizing", "diesel", "value"],
        subcategory: "popcorn",
        potency: "Medium"
      },
      {
        name: "Wedding Cake",
        description: "Sweet and earthy hybrid with vanilla and cake-like flavors.",
        strainType: "Hybrid",
        thcaContent: "29.7",
        effects: ["sweet", "relaxing", "vanilla"],
        subcategory: "hybrid",
        potency: "High"
      },
      {
        name: "Girl Scout Cookies",
        description: "Popular hybrid with sweet and earthy flavors and balanced effects.",
        strainType: "Hybrid",
        thcaContent: "28.4",
        effects: ["sweet", "balanced", "earthy"],
        subcategory: "hybrid",
        potency: "Medium"
      },
      {
        name: "Runtz x Peppermint",
        description: "Unique cross combining sweet Runtz with refreshing peppermint flavors.",
        strainType: "Hybrid",
        thcaContent: "30.2",
        effects: ["sweet", "minty", "refreshing"],
        subcategory: "hybrid",
        potency: "High"
      }
    ];

    const weights = [
      { weight: "1g", basePrice: 12, label: "Gram" },
      { weight: "3.5g", basePrice: 35, label: "Eighth" },
      { weight: "7g", basePrice: 65, label: "Quarter" },
      { weight: "14g", basePrice: 120, label: "Half" },
      { weight: "28g", basePrice: 220, label: "Ounce" },
      { weight: "112g", basePrice: 800, label: "Quarter Pound" },
      { weight: "448g", basePrice: 2800, label: "Pound" }
    ];

    const sampleProducts: Product[] = [...preRolls];

    // Generate flower products for each strain and weight combination
    flowerStrains.forEach((strain, strainIndex) => {
      weights.forEach((weightOption, weightIndex) => {
        const priceMultiplier = strain.subcategory === 'infused' ? 1.5 : strain.subcategory === 'popcorn' ? 0.8 : 1.0;
        const price = (weightOption.basePrice * priceMultiplier).toFixed(2);
        
        sampleProducts.push({
          id: `fl-${strainIndex}-${weightIndex}`,
          name: `${strain.name} - ${weightOption.label}`,
          description: strain.description,
          price: price,
          category: "flower",
          imageUrl: `/api/placeholder/400/400`,
          stock: Math.floor(Math.random() * 20) + 10,
          weight: weightOption.weight,
          featured: strain.subcategory === 'infused' || weightOption.weight === '3.5g',
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          thcaContent: strain.thcaContent,
          strainType: strain.strainType,
          effects: strain.effects as string[],
          variants: null,
          subcategory: strain.subcategory,
          potency: strain.potency,
          priceRange: { min: parseFloat(price) - 5, max: parseFloat(price) + 5 },
          createdAt: new Date(),
        });
      });
    });

    // Pre-roll packs (2s, 3s, 4s, 5s, 6s, 7s, 8s, 9s, 10s, 15s)
    const packSizes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 15];
    const preRollStrains = ['Sour Diesel Infused', 'Purple Koolaid Infused', 'Sour Lemon Diesel', 'Too Tall', 'Runtz'];
    
    preRollStrains.forEach((strain, strainIndex) => {
      packSizes.forEach((packSize, packIndex) => {
        const basePrice = strain.includes('Infused') ? 16 : 13;
        const discountRate = packSize >= 10 ? 0.15 : packSize >= 5 ? 0.10 : 0.05;
        const totalPrice = (basePrice * packSize * (1 - discountRate)).toFixed(2);
        
        sampleProducts.push({
          id: `pack-${strainIndex}-${packIndex}`,
          name: `${strain} Pre-Roll Pack (${packSize}x)`,
          description: `Pack of ${packSize} premium ${strain} pre-rolls with ${Math.round(discountRate * 100)}% bulk discount.`,
          price: totalPrice,
          category: "prerolls",
          imageUrl: `/api/placeholder/400/400`,
          stock: Math.floor(Math.random() * 15) + 5,
          weight: `${packSize}x1.25g`,
          featured: packSize === 5 || packSize === 10,
          rating: (4.6 + Math.random() * 0.4).toFixed(1),
          thcaContent: strain.includes('Infused') ? '32.0' : '28.0',
          strainType: strain.includes('Purple') ? 'Indica' : strain.includes('Runtz') ? 'Hybrid' : 'Sativa',
          effects: strain.includes('Infused') ? ['potent', 'premium', 'bulk'] : ['energizing', 'bulk', 'value'] as string[],
          variants: null,
          subcategory: 'pack',
          potency: strain.includes('Infused') ? 'High' : 'Medium',
          priceRange: { min: parseFloat(totalPrice) - 10, max: parseFloat(totalPrice) + 10 },
          createdAt: new Date(),
        });
      });
    });

    // Mixed variety packs (3 grams + 3 pre-rolls)
    const varietyPacks = [
      {
        name: "Indica Variety Pack",
        description: "3 different indica flower grams (Grape Popsicle, Purple Koolaid, Wedding Cake) + 3 mixed pre-rolls",
        strains: ["Grape Popsicle", "Purple Koolaid", "Wedding Cake"],
        price: "89.99"
      },
      {
        name: "Sativa Variety Pack", 
        description: "3 different sativa flower grams (Sour Diesel, Sour Lemon Diesel, Sour Diesel Popcorn) + 3 sativa pre-rolls",
        strains: ["Sour Diesel", "Sour Lemon Diesel", "Sour Diesel Popcorn"],
        price: "79.99"
      },
      {
        name: "Hybrid Variety Pack",
        description: "3 different hybrid flower grams (Girl Scout Cookies, Runtz x Peppermint, Wedding Cake) + 3 hybrid pre-rolls",
        strains: ["Girl Scout Cookies", "Runtz x Peppermint", "Wedding Cake"],
        price: "84.99"
      },
      {
        name: "Premium Variety Pack",
        description: "3 premium infused flower grams + 3 infused pre-rolls featuring our top-shelf selections",
        strains: ["Purple Koolaid Infused", "Mixed Premium", "Top Shelf"],
        price: "129.99"
      }
    ];

    varietyPacks.forEach((pack, packIndex) => {
      sampleProducts.push({
        id: `variety-${packIndex}`,
        name: pack.name,
        description: pack.description,
        price: pack.price,
        category: "variety-packs",
        imageUrl: `/api/placeholder/400/400`,
        stock: Math.floor(Math.random() * 10) + 3,
        weight: "3g + 3 pre-rolls",
        featured: pack.name.includes('Premium'),
        rating: (4.7 + Math.random() * 0.3).toFixed(1),
        thcaContent: pack.name.includes('Premium') ? '35.0' : '28.5',
        strainType: pack.name.includes('Indica') ? 'Indica' : pack.name.includes('Sativa') ? 'Sativa' : 'Hybrid',
        effects: ['variety', 'mixed', 'sampler'] as string[],
        variants: null,
        subcategory: 'variety',
        potency: pack.name.includes('Premium') ? 'High' : 'Medium',
        priceRange: { min: parseFloat(pack.price) - 15, max: parseFloat(pack.price) + 15 },
        createdAt: new Date(),
      });
    });

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
      variants: insertProduct.variants ?? null,
      subcategory: insertProduct.subcategory ?? null,
      potency: insertProduct.potency ?? null,
      priceRange: insertProduct.priceRange ?? null,
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
      estimatedDelivery: insertOrder.estimatedDelivery || null,
      totalWeight: insertOrder.totalWeight || null,
      shippingPhone: insertOrder.shippingPhone || null,
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

  async getPromotionByDay(dayOfWeek: number): Promise<any[]> {
    return Array.from(this.dailyPromotions.values()).filter((p: any) => p.dayOfWeek === dayOfWeek);
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

  // Promo Code methods
  async getPromoCodes(): Promise<any[]> {
    return Array.from(this.promoCodes.values());
  }

  async getPromoCodeByCode(code: string): Promise<any | undefined> {
    return Array.from(this.promoCodes.values()).find((p: any) => p.code === code);
  }

  async createPromoCode(promoCode: any): Promise<any> {
    const id = randomUUID();
    const newPromoCode = { ...promoCode, id, createdAt: new Date() };
    this.promoCodes.set(id, newPromoCode);
    return newPromoCode;
  }

  async updatePromoCodeUsage(id: string): Promise<any | undefined> {
    const promoCode = this.promoCodes.get(id);
    if (!promoCode) return undefined;
    promoCode.currentUses = (promoCode.currentUses || 0) + 1;
    this.promoCodes.set(id, promoCode);
    return promoCode;
  }

  async validatePromoCode(code: string): Promise<{ valid: boolean; promoCode?: any; error?: string }> {
    const promoCode = await this.getPromoCodeByCode(code);
    if (!promoCode) {
      return { valid: false, error: 'Promo code not found' };
    }
    if (!promoCode.isActive) {
      return { valid: false, error: 'Promo code is not active' };
    }
    if (promoCode.expiresAt && new Date() > new Date(promoCode.expiresAt)) {
      return { valid: false, error: 'Promo code has expired' };
    }
    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return { valid: false, error: 'Promo code usage limit reached' };
    }
    return { valid: true, promoCode };
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
