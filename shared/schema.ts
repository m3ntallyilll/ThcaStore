import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isAdmin: boolean("is_admin").default(false),
  storeCredit: decimal("store_credit", { precision: 10, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").notNull().default(0),
  weight: text("weight").default("1g"), // Weight as text (e.g., "1.1g", "1.25g")
  featured: boolean("featured").default(false),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  thcaContent: text("thca_content"), // THC percentage as text (e.g., "25%")
  strainType: text("strain_type"),
  effects: jsonb("effects").$type<string[]>(),
  // New fields for enhanced product variants
  variants: jsonb("variants").$type<ProductVariant[]>().default([]), // Size/weight variants with pricing
  subcategory: text("subcategory"), // Enhanced categorization (indica, sativa, hybrid for flower)
  potency: text("potency"), // Low, Medium, High
  priceRange: jsonb("price_range").$type<{ min: number; max: number }>(), // Price range for variants
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // Allow NULL for guest orders
  status: text("status").notNull().default("pending"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull().default("0.00"),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  // Shipping Details
  shippingMethod: text("shipping_method").notNull().default("standard"), // standard, express, tracked
  trackingNumber: text("tracking_number"),
  estimatedDelivery: text("estimated_delivery"),
  totalWeight: decimal("total_weight", { precision: 8, scale: 2 }).default("0.00"),
  
  // Shipping Address
  shippingName: text("shipping_name").notNull(),
  shippingEmail: text("shipping_email").notNull(),
  shippingPhone: text("shipping_phone"),
  shippingAddress: text("shipping_address").notNull(),
  shippingAddress2: text("shipping_address2"),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingZip: text("shipping_zip").notNull(),
  shippingCountry: text("shipping_country").notNull().default("US"),
  
  // Payment
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  storeCreditUsed: decimal("store_credit_used", { precision: 10, scale: 2 }).default("0.00"),
  
  // Promo Code & Affiliate
  promoCodeUsed: text("promo_code_used"),
  promoDiscount: decimal("promo_discount", { precision: 10, scale: 2 }).default("0.00"),
  affiliateCode: text("affiliate_code"), // Track which affiliate referred this order
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Product variant type for size/weight options
export type ProductVariant = {
  id: string;
  weight: string;
  price: number;
  stock: number;
  isDefault?: boolean;
};

// Enhanced category definitions
export const PRODUCT_CATEGORIES = {
  flower: {
    name: 'Flower',
    subcategories: ['indica', 'sativa', 'hybrid'],
    weights: ['1g', '3.5g', '7g', '14g', '28g'],
    priceRanges: { '1g': [8, 15], '3.5g': [25, 50], '7g': [45, 90], '14g': [80, 160], '28g': [150, 300] }
  },
  prerolls: {
    name: 'Pre-Rolls',
    subcategories: ['single', 'pack', 'infused'],
    weights: ['1.1g', '1.25g', '1.45g', '1.5g'],
    priceRanges: { '1.1g': [6, 12], '1.25g': [7, 14], '1.45g': [8, 16], '1.5g': [9, 18] }
  },
  concentrates: {
    name: 'Concentrates',
    subcategories: ['wax', 'shatter', 'live_resin', 'rosin'],
    weights: ['0.5g', '1g', '2g'],
    priceRanges: { '0.5g': [25, 50], '1g': [45, 90], '2g': [80, 160] }
  },
  edibles: {
    name: 'Edibles',
    subcategories: ['gummies', 'chocolates', 'beverages', 'baked_goods'],
    weights: ['100mg', '250mg', '500mg', '1000mg'],
    priceRanges: { '100mg': [15, 30], '250mg': [25, 50], '500mg': [40, 80], '1000mg': [70, 140] }
  }
} as const;

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;

// Rewards and Loyalty System
export const rewardTiers = pgTable('reward_tiers', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(), // Bronze, Silver, Gold, Platinum, Diamond
  minPoints: integer('min_points').notNull().default(0),
  multiplier: decimal('multiplier', { precision: 3, scale: 2 }).notNull().default('1.00'),
  benefits: text('benefits').array(), // Array of benefit descriptions
  color: text('color').notNull().default('#gray'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userRewards = pgTable('user_rewards', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull(),
  totalPoints: integer('total_points').notNull().default(0),
  currentTierId: varchar('current_tier_id').references(() => rewardTiers.id),
  lifetimeSpent: decimal('lifetime_spent', { precision: 10, scale: 2 }).notNull().default('0.00'),
  monthlyPurchases: integer('monthly_purchases').notNull().default(0),
  lastPurchaseDate: timestamp('last_purchase_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const pointTransactions = pgTable('point_transactions', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull(),
  orderId: varchar('order_id').references(() => orders.id),
  points: integer('points').notNull(), // Can be negative for redemptions
  type: text('type', { enum: ['earned', 'redeemed', 'bonus', 'referral'] }).notNull(),
  description: text('description').notNull(),
  multiplier: decimal('multiplier', { precision: 3, scale: 2 }).default('1.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const referralProgram = pgTable('referral_program', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar('referrer_id').references(() => users.id).notNull(),
  refereeId: varchar('referee_id').references(() => users.id),
  referralCode: text('referral_code').unique().notNull(),
  status: text('status', { enum: ['pending', 'completed', 'rewarded'] }).notNull().default('pending'),
  referrerReward: integer('referrer_reward').notNull().default(500), // Points
  refereeReward: integer('referee_reward').notNull().default(250), // Points
  firstOrderId: varchar('first_order_id').references(() => orders.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const specialOffers = pgTable('special_offers', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: text('type', { enum: ['double_points', 'discount', 'free_shipping', 'bogo', 'flash_sale'] }).notNull(),
  value: decimal('value', { precision: 5, scale: 2 }).notNull(), // Percentage or fixed amount
  isActive: boolean('is_active').default(true),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  daysOfWeek: text('days_of_week').array(), // ['monday', 'tuesday'] for recurring offers
  minPurchase: decimal('min_purchase', { precision: 10, scale: 2 }),
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').default(0),
  targetTiers: text('target_tiers').array(), // Tier names
  productCategories: text('product_categories').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiInteractions = pgTable('ai_interactions', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  sessionId: text('session_id').notNull(),
  message: text('message').notNull(),
  response: text('response').notNull(),
  intent: text('intent'), // product_recommendation, support, complaint, etc.
  sentiment: text('sentiment', { enum: ['positive', 'neutral', 'negative'] }),
  productsRecommended: text('products_recommended').array(),
  conversionResult: boolean('conversion_result').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI Conversational Memory System
export const aiConversations = pgTable('ai_conversations', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  sessionId: text('session_id').notNull(),
  title: text('title'), // Auto-generated conversation summary
  status: text('status', { enum: ['active', 'completed', 'archived'] }).notNull().default('active'),
  lastInteractionAt: timestamp('last_interaction_at').defaultNow().notNull(),
  messageCount: integer('message_count').notNull().default(0),
  topics: text('topics').array(), // Extracted conversation topics
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aiMessages = pgTable('ai_messages', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar('conversation_id').references(() => aiConversations.id).notNull(),
  userId: varchar('user_id').references(() => users.id),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  content: text('content').notNull(),
  metadata: text('metadata'), // JSON string for additional data
  intent: text('intent'),
  sentiment: text('sentiment', { enum: ['positive', 'neutral', 'negative'] }),
  productsReferenced: text('products_referenced').array(),
  ordersReferenced: text('orders_referenced').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiUserProfiles = pgTable('ai_user_profiles', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull().unique(),
  preferences: text('preferences'), // JSON string of user preferences
  interests: text('interests').array(), // Product categories, topics they ask about
  communicationStyle: text('communication_style', { 
    enum: ['formal', 'casual', 'technical', 'simple'] 
  }).default('casual'),
  lastSeenProducts: text('last_seen_products').array(),
  frequentQuestions: text('frequent_questions').array(),
  purchasePatterns: text('purchase_patterns'), // JSON string
  satisfactionScore: decimal('satisfaction_score', { precision: 3, scale: 2 }).default('0.00'),
  totalInteractions: integer('total_interactions').notNull().default(0),
  successfulRecommendations: integer('successful_recommendations').notNull().default(0),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aiContextMemory = pgTable('ai_context_memory', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull(),
  contextType: text('context_type', { 
    enum: ['product_preference', 'order_history', 'support_issue', 'general_info', 'user_goal'] 
  }).notNull(),
  contextKey: text('context_key').notNull(), // e.g., 'preferred_category', 'pain_points'
  contextValue: text('context_value').notNull(), // The actual data
  importance: integer('importance').notNull().default(1), // 1-10 scale
  expiresAt: timestamp('expires_at'), // For temporary context
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const salesMetrics = pgTable('sales_metrics', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  date: date('date').notNull(),
  totalSales: decimal('total_sales', { precision: 12, scale: 2 }).notNull().default('0.00'),
  totalOrders: integer('total_orders').notNull().default(0),
  aiInteractions: integer('ai_interactions').notNull().default(0),
  aiConversions: integer('ai_conversions').notNull().default(0),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 4 }).default('0.0000'),
  averageOrderValue: decimal('average_order_value', { precision: 10, scale: 2 }).default('0.00'),
  rewardsRedeemed: integer('rewards_redeemed').default(0),
  referralSignups: integer('referral_signups').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Shipping Configuration
export const shippingRates = pgTable('shipping_rates', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  method: text('method').notNull(), // standard, express, tracked
  name: text('name').notNull(),
  description: text('description'),
  baseRate: decimal('base_rate', { precision: 8, scale: 2 }).notNull(),
  perPoundRate: decimal('per_pound_rate', { precision: 8, scale: 2 }).default('0.00'),
  freeShippingThreshold: decimal('free_shipping_threshold', { precision: 10, scale: 2 }),
  estimatedDays: text('estimated_days').notNull(),
  trackingIncluded: boolean('tracking_included').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Prohibited States - Hemp laws vary by state
export const prohibitedStates = pgTable('prohibited_states', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  stateCode: text('state_code').notNull().unique(), // 'ID', 'SD', etc.
  stateName: text('state_name').notNull(),
  reason: text('reason').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Blog Posts - SEO optimized content management
export const blogPosts = pgTable('blog_posts', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  keywords: text('keywords').array(),
  featuredImage: text('featured_image'),
  authorId: varchar('author_id').notNull().references(() => users.id),
  category: text('category').notNull(),
  tags: text('tags').array(),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  isAiGenerated: boolean('is_ai_generated').default(false).notNull(),
  readTime: integer('read_time'), // estimated read time in minutes
  viewCount: integer('view_count').default(0).notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Affiliate Program Tables
export const affiliates = pgTable('affiliates', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull().unique(),
  affiliateCode: text('affiliate_code').notNull().unique(), // For URL tracking: ?ref=CODE
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).default('10.00'), // Percentage
  totalEarnings: decimal('total_earnings', { precision: 12, scale: 2 }).default('0.00'),
  availableBalance: decimal('available_balance', { precision: 12, scale: 2 }).default('0.00'),
  totalClicks: integer('total_clicks').default(0),
  totalConversions: integer('total_conversions').default(0),
  isActive: boolean('is_active').default(true),
  customUrl: text('custom_url'), // Optional custom landing page
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const affiliateClicks = pgTable('affiliate_clicks', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  affiliateId: varchar('affiliate_id').references(() => affiliates.id).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrerUrl: text('referrer_url'),
  landingPage: text('landing_page'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const affiliateConversions = pgTable('affiliate_conversions', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  affiliateId: varchar('affiliate_id').references(() => affiliates.id).notNull(),
  orderId: varchar('order_id').references(() => orders.id).notNull().unique(),
  orderTotal: decimal('order_total', { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status', { enum: ['pending', 'approved', 'paid', 'cancelled'] }).default('pending'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Promo Codes Table (synced with affiliates)
export const promoCodes = pgTable('promo_codes', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  code: text('code').notNull().unique(),
  discountType: text('discount_type', { enum: ['percentage', 'fixed', 'free_shipping'] }).notNull(),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  minPurchase: decimal('min_purchase', { precision: 10, scale: 2 }).default('0.00'),
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').default(0),
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at'),
  applicableCategories: text('applicable_categories').array(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const promoCodeUsage = pgTable('promo_code_usage', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  promoCodeId: varchar('promo_code_id').references(() => promoCodes.id).notNull(),
  orderId: varchar('order_id').references(() => orders.id).notNull(),
  userId: varchar('user_id').references(() => users.id),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const rewardTiersRelations = relations(rewardTiers, ({ many }) => ({
  userRewards: many(userRewards),
}));

export const userRewardsRelations = relations(userRewards, ({ one, many }) => ({
  user: one(users, { fields: [userRewards.userId], references: [users.id] }),
  currentTier: one(rewardTiers, { fields: [userRewards.currentTierId], references: [rewardTiers.id] }),
  pointTransactions: many(pointTransactions),
}));

export const pointTransactionsRelations = relations(pointTransactions, ({ one }) => ({
  user: one(users, { fields: [pointTransactions.userId], references: [users.id] }),
  order: one(orders, { fields: [pointTransactions.orderId], references: [orders.id] }),
  userReward: one(userRewards, { fields: [pointTransactions.userId], references: [userRewards.userId] }),
}));

export const referralProgramRelations = relations(referralProgram, ({ one }) => ({
  referrer: one(users, { fields: [referralProgram.referrerId], references: [users.id] }),
  referee: one(users, { fields: [referralProgram.refereeId], references: [users.id] }),
  firstOrder: one(orders, { fields: [referralProgram.firstOrderId], references: [orders.id] }),
}));

export const aiInteractionsRelations = relations(aiInteractions, ({ one }) => ({
  user: one(users, { fields: [aiInteractions.userId], references: [users.id] }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
}));

// Affiliate Relations
export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
  user: one(users, { fields: [affiliates.userId], references: [users.id] }),
  clicks: many(affiliateClicks),
  conversions: many(affiliateConversions),
}));

export const affiliateClicksRelations = relations(affiliateClicks, ({ one }) => ({
  affiliate: one(affiliates, { fields: [affiliateClicks.affiliateId], references: [affiliates.id] }),
}));

export const affiliateConversionsRelations = relations(affiliateConversions, ({ one }) => ({
  affiliate: one(affiliates, { fields: [affiliateConversions.affiliateId], references: [affiliates.id] }),
  order: one(orders, { fields: [affiliateConversions.orderId], references: [orders.id] }),
}));

export const promoCodesRelations = relations(promoCodes, ({ many }) => ({
  usage: many(promoCodeUsage),
}));

export const promoCodeUsageRelations = relations(promoCodeUsage, ({ one }) => ({
  promoCode: one(promoCodes, { fields: [promoCodeUsage.promoCodeId], references: [promoCodes.id] }),
  order: one(orders, { fields: [promoCodeUsage.orderId], references: [orders.id] }),
  user: one(users, { fields: [promoCodeUsage.userId], references: [users.id] }),
}));

// AI Memory Relations
export const aiConversationsRelations = relations(aiConversations, ({ one, many }) => ({
  user: one(users, { fields: [aiConversations.userId], references: [users.id] }),
  messages: many(aiMessages),
}));

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, { fields: [aiMessages.conversationId], references: [aiConversations.id] }),
  user: one(users, { fields: [aiMessages.userId], references: [users.id] }),
}));

export const aiUserProfilesRelations = relations(aiUserProfiles, ({ one }) => ({
  user: one(users, { fields: [aiUserProfiles.userId], references: [users.id] }),
}));

export const aiContextMemoryRelations = relations(aiContextMemory, ({ one }) => ({
  user: one(users, { fields: [aiContextMemory.userId], references: [users.id] }),
}));

// Store Credit Transactions
export const storeCreditTransactions = pgTable('store_credit_transactions', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull(),
  type: text('type', { enum: ['earned', 'spent', 'points_redeemed', 'referral_bonus'] }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  orderId: varchar('order_id').references(() => orders.id),
  referralId: varchar('referral_id').references(() => referralProgram.id),
  pointsUsed: integer('points_used'), // For points redemption
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Daily Sales Promotions
export const dailyPromotions = pgTable('daily_promotions', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, etc.
  title: text('title').notNull(),
  description: text('description').notNull(),
  discountType: text('discount_type').notNull(), // 'percentage', 'fixed', 'bogo', 'bundle'
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  minPurchase: decimal('min_purchase', { precision: 10, scale: 2 }).default('0'),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  applicableCategories: text('applicable_categories').array().default([]),
  applicableProducts: text('applicable_products').array().default([]),
  stackableWithOthers: boolean('stackable_with_others').default(false),
  isActive: boolean('is_active').default(true),
  startTime: text('start_time').default('00:00'), // 24-hour format
  endTime: text('end_time').default('23:59'),
  timeZone: text('time_zone').default('America/New_York'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const promotionUsage = pgTable('promotion_usage', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  promotionId: text('promotion_id').notNull().references(() => dailyPromotions.id),
  userId: text('user_id').references(() => users.id),
  orderId: text('order_id').references(() => orders.id),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp('used_at').defaultNow(),
});

export const dailyPromotionsRelations = relations(dailyPromotions, ({ many }) => ({
  usage: many(promotionUsage),
}));

export const promotionUsageRelations = relations(promotionUsage, ({ one }) => ({
  promotion: one(dailyPromotions, { fields: [promotionUsage.promotionId], references: [dailyPromotions.id] }),
  user: one(users, { fields: [promotionUsage.userId], references: [users.id] }),
  order: one(orders, { fields: [promotionUsage.orderId], references: [orders.id] }),
}));

// Gamified Loyalty System Enhancements
export const achievements = pgTable('achievements', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // purchase, social, milestone, streak, challenge
  icon: text('icon').notNull(),
  condition: jsonb('condition').$type<{
    type: 'order_count' | 'spend_amount' | 'referral_count' | 'streak_days' | 'product_categories' | 'review_count';
    value: number;
    comparison?: 'gte' | 'lte' | 'eq';
    metadata?: any;
  }>().notNull(),
  rewardPoints: integer('reward_points').notNull().default(0),
  badgeColor: text('badge_color').notNull().default('#gold'),
  isHidden: boolean('is_hidden').default(false),
  difficulty: text('difficulty').notNull().default('normal'), // easy, normal, hard, legendary
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userAchievements = pgTable('user_achievements', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull(),
  achievementId: varchar('achievement_id').references(() => achievements.id).notNull(),
  progress: integer('progress').notNull().default(0),
  maxProgress: integer('max_progress').notNull().default(1),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  notified: boolean('notified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dailyChallenges = pgTable('daily_challenges', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // purchase, engagement, social
  targetType: text('target_type').notNull(), // spend_amount, product_count, category_purchase, social_share
  targetValue: integer('target_value').notNull(),
  rewardPoints: integer('reward_points').notNull(),
  bonusMultiplier: decimal('bonus_multiplier', { precision: 3, scale: 2 }).default('1.00'),
  validFrom: date('valid_from').notNull(),
  validUntil: date('valid_until').notNull(),
  isActive: boolean('is_active').default(true),
  difficulty: text('difficulty').notNull().default('normal'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userChallenges = pgTable('user_challenges', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull(),
  challengeId: varchar('challenge_id').references(() => dailyChallenges.id).notNull(),
  progress: integer('progress').notNull().default(0),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  rewardClaimed: boolean('reward_claimed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const loyaltyStreaks = pgTable('loyalty_streaks', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull(),
  streakType: text('streak_type').notNull(), // daily_login, weekly_purchase, monthly_review
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActivityDate: date('last_activity_date'),
  streakMultiplier: decimal('streak_multiplier', { precision: 3, scale: 2 }).default('1.00'),
  bonusPointsEarned: integer('bonus_points_earned').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const loyaltyLeaderboard = pgTable('loyalty_leaderboard', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull(),
  period: text('period').notNull(), // weekly, monthly, all_time
  rank: integer('rank').notNull(),
  points: integer('points').notNull(),
  achievementCount: integer('achievement_count').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Gamification Relations
export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
}));

export const dailyChallengesRelations = relations(dailyChallenges, ({ many }) => ({
  userChallenges: many(userChallenges),
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, { fields: [userChallenges.userId], references: [users.id] }),
  challenge: one(dailyChallenges, { fields: [userChallenges.challengeId], references: [dailyChallenges.id] }),
}));

export const loyaltyStreaksRelations = relations(loyaltyStreaks, ({ one }) => ({
  user: one(users, { fields: [loyaltyStreaks.userId], references: [users.id] }),
}));

export const loyaltyLeaderboardRelations = relations(loyaltyLeaderboard, ({ one }) => ({
  user: one(users, { fields: [loyaltyLeaderboard.userId], references: [users.id] }),
}));

// Insert and Select Schemas
export const insertRewardTierSchema = createInsertSchema(rewardTiers);
export const insertUserRewardSchema = createInsertSchema(userRewards);
export const insertPointTransactionSchema = createInsertSchema(pointTransactions);
export const insertReferralProgramSchema = createInsertSchema(referralProgram);
export const insertSpecialOfferSchema = createInsertSchema(specialOffers);
export const insertAiInteractionSchema = createInsertSchema(aiInteractions);
export const insertSalesMetricSchema = createInsertSchema(salesMetrics);
export const insertShippingRateSchema = createInsertSchema(shippingRates);
export const insertProhibitedStateSchema = createInsertSchema(prohibitedStates);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertAiConversationSchema = createInsertSchema(aiConversations);
export const insertAiMessageSchema = createInsertSchema(aiMessages);
export const insertAiUserProfileSchema = createInsertSchema(aiUserProfiles);
export const insertAiContextMemorySchema = createInsertSchema(aiContextMemory);
export const insertDailyPromotionSchema = createInsertSchema(dailyPromotions);
export const insertPromotionUsageSchema = createInsertSchema(promotionUsage);

// Gamification Insert Schemas
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertUserAchievementSchema = createInsertSchema(userAchievements);
export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges);
export const insertUserChallengeSchema = createInsertSchema(userChallenges);
export const insertLoyaltyStreakSchema = createInsertSchema(loyaltyStreaks);
export const insertLoyaltyLeaderboardSchema = createInsertSchema(loyaltyLeaderboard);

// Types
export type InsertRewardTier = z.infer<typeof insertRewardTierSchema>;
export type RewardTier = typeof rewardTiers.$inferSelect;
export type InsertUserReward = z.infer<typeof insertUserRewardSchema>;
export type UserReward = typeof userRewards.$inferSelect;
export type InsertPointTransaction = z.infer<typeof insertPointTransactionSchema>;
export type PointTransaction = typeof pointTransactions.$inferSelect;
export type InsertReferralProgram = z.infer<typeof insertReferralProgramSchema>;
export type ReferralProgram = typeof referralProgram.$inferSelect;
export type InsertSpecialOffer = z.infer<typeof insertSpecialOfferSchema>;
export type SpecialOffer = typeof specialOffers.$inferSelect;
export type InsertAiInteraction = z.infer<typeof insertAiInteractionSchema>;
export type AiInteraction = typeof aiInteractions.$inferSelect;
export type InsertSalesMetric = z.infer<typeof insertSalesMetricSchema>;
export type SalesMetric = typeof salesMetrics.$inferSelect;
export type InsertShippingRate = z.infer<typeof insertShippingRateSchema>;
export type ShippingRate = typeof shippingRates.$inferSelect;
export type InsertProhibitedState = z.infer<typeof insertProhibitedStateSchema>;
export type ProhibitedState = typeof prohibitedStates.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// AI Memory Types
export type InsertAIConversation = z.infer<typeof insertAiConversationSchema>;
export type AIConversation = typeof aiConversations.$inferSelect;
export type InsertAIMessage = z.infer<typeof insertAiMessageSchema>;
export type AIMessage = typeof aiMessages.$inferSelect;
export type InsertAIUserProfile = z.infer<typeof insertAiUserProfileSchema>;
export type AIUserProfile = typeof aiUserProfiles.$inferSelect;
export type InsertAIContextMemory = z.infer<typeof insertAiContextMemorySchema>;
export type AIContextMemory = typeof aiContextMemory.$inferSelect;
export type InsertDailyPromotion = z.infer<typeof insertDailyPromotionSchema>;
export type DailyPromotion = typeof dailyPromotions.$inferSelect;
export type InsertPromotionUsage = z.infer<typeof insertPromotionUsageSchema>;
export type PromotionUsage = typeof promotionUsage.$inferSelect;

// Gamification Types
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type LoyaltyStreak = typeof loyaltyStreaks.$inferSelect;
export type InsertLoyaltyStreak = z.infer<typeof insertLoyaltyStreakSchema>;
export type LoyaltyLeaderboard = typeof loyaltyLeaderboard.$inferSelect;
export type InsertLoyaltyLeaderboard = z.infer<typeof insertLoyaltyLeaderboardSchema>;

// Auth user type for frontend
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  isAdmin: boolean;
  rewards?: {
    totalPoints: number;
    currentTier: RewardTier | null;
    lifetimeSpent: string;
    monthlyPurchases: number;
  };
  referralCode?: string;
}

export const insertStoreCreditTransactionSchema = createInsertSchema(storeCreditTransactions).omit({
  id: true,
  createdAt: true,
});
export type InsertStoreCreditTransaction = z.infer<typeof insertStoreCreditTransactionSchema>;
export type StoreCreditTransaction = typeof storeCreditTransactions.$inferSelect;


