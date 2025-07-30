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

  // Cart methods
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<void>;

  // Order methods
  getOrders(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<(Order & { user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'> })[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<(OrderItem & { product: Product })[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
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
      featured: insertProduct.featured ?? false,
      rating: insertProduct.rating ?? "0",
      thcaContent: insertProduct.thcaContent ?? null,
      strainType: insertProduct.strainType ?? null,
      effects: insertProduct.effects ?? null,
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
      effects: updates.effects !== undefined ? updates.effects : product.effects
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
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
  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
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
      shippingAddress: insertOrder.shippingAddress || null,
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
}

export const storage = new MemStorage();
