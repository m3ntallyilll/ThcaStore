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
  weight: decimal("weight", { precision: 8, scale: 2 }).default("0.10"), // Weight in pounds for shipping
  featured: boolean("featured").default(false),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  thcaContent: decimal("thca_content", { precision: 5, scale: 2 }),
  strainType: text("strain_type"),
  effects: jsonb("effects").$type<string[]>(),
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
  userId: varchar("user_id").references(() => users.id).notNull(),
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

// Prohibited States - Cannabis laws vary by state
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
