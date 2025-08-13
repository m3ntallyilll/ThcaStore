import { Router } from 'express';
import { db } from '../db';
import { referralProgram, promoCodes } from '@shared/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

// Import the same authentication from main routes
import { storage } from '../storage.js';
import jwt from 'jsonwebtoken';

// Authentication middleware - simplified version
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "thca-store-secret-key-2025";
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from storage
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.user = { 
      ...user, 
      isAdmin: user.isAdmin || false,
      id: user.id || decoded.userId 
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Generate unique referral code for user referral program
function generateReferralCode(username: string): string {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${username.slice(0, 3).toUpperCase()}${random}`;
}

// Track referral clicks via user referral links
router.get('/track/:affiliateCode', async (req, res) => {
  try {
    const { affiliateCode } = req.params;
    const { redirect = '/' } = req.query;
    
    // Find user's referral code
    const [affiliate] = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.affiliateCode, affiliateCode))
      .limit(1);
    
    if (affiliate && affiliate.isActive) {
      // Track click
      await db.insert(affiliateClicks).values({
        affiliateId: affiliate.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        referrerUrl: req.get('referer'),
        landingPage: redirect as string,
      });
      
      // Update click count
      await db
        .update(affiliates)
        .set({ 
          totalClicks: sql`${affiliates.totalClicks} + 1` 
        })
        .where(eq(affiliates.id, affiliate.id));
      
      // Set cookie to track the referral
      res.cookie('affiliate_ref', affiliateCode, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      });
    }
    
    // Redirect to requested page
    res.redirect(redirect as string);
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
    res.redirect('/');
  }
});

// Get or create referral account for logged-in user (user referral program)
router.get('/my-affiliate', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Check if user already has a referral record
    let [referral] = await db
      .select()
      .from(referralProgram)
      .where(eq(referralProgram.referrerId, userId))
      .limit(1);
    
    // Create referral account if doesn't exist
    if (!referral) {
      const username = req.user?.username || req.user?.email?.split('@')[0] || 'user';
      const referralCode = generateReferralCode(username);
      
      [referral] = await db
        .insert(referralProgram)
        .values({
          referrerId: userId,
          referralCode,
          referrerReward: 1000, // 10% store credit (1000 points = $10)
          refereeReward: 2000, // 20% discount (2000 points = $20)
        })
        .returning();
    }
    
    // Get referral stats
    const stats = await db
      .select({
        totalReferrals: sql<number>`COUNT(*)`,
        completedReferrals: sql<number>`COUNT(*) FILTER (WHERE status = 'completed')`,
        pendingReferrals: sql<number>`COUNT(*) FILTER (WHERE status = 'pending')`,
        totalRewards: sql<number>`COALESCE(SUM(referrer_reward), 0)`,
      })
      .from(referralProgram)
      .where(eq(referralProgram.referrerId, userId));
    
    res.json({
      ...referral,
      stats: stats[0] || { totalReferrals: 0, completedReferrals: 0, pendingReferrals: 0, totalRewards: 0 },
      referralLink: `${process.env.APP_URL || 'https://mentally-chill.online'}/ref/${referral.referralCode}`,
    });
  } catch (error) {
    console.error('Error fetching affiliate data:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate data' });
  }
});

// Create promo code linked to affiliate
router.post('/create-promo', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { code, discountType, discountValue, minPurchase, maxUses, expiresAt, description } = req.body;
    
    // Get user's referral record
    let [referral] = await db
      .select()
      .from(referralProgram)
      .where(eq(referralProgram.referrerId, userId))
      .limit(1);
    
    if (!referral) {
      const username = req.user?.username || req.user?.email?.split('@')[0] || 'user';
      const referralCode = generateReferralCode(username);
      
      [referral] = await db
        .insert(referralProgram)
        .values({
          referrerId: userId,
          referralCode,
          referrerReward: 1000, // 10% store credit
          refereeReward: 2000, // 20% discount
        })
        .returning();
    }
    
    res.json({
      success: true,
      referralCode: referral.referralCode,
      referralLink: `${process.env.APP_URL || 'https://mentally-chill.online'}/ref/${referral.referralCode}`,
      rewards: {
        referrerReward: `$${(referral.referrerReward / 100).toFixed(2)} store credit`,
        refereeDiscount: `$${(referral.refereeReward / 100).toFixed(2)} off first order`
      }
    });

  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({ error: 'Failed to create promo code' });
  }
});

// Validate promo code
router.post('/validate-promo', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }
    
    // Find promo code
    const [promo] = await db
      .select()
      .from(promoCodes)
      .where(
        and(
          eq(promoCodes.code, code.toUpperCase()),
          eq(promoCodes.isActive, true)
        )
      )
      .limit(1);
    
    if (!promo) {
      return res.status(404).json({ error: 'Invalid promo code' });
    }
    
    // Check expiration
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Promo code has expired' });
    }
    
    // Check usage limit
    if (promo.maxUses && promo.currentUses !== null && promo.currentUses >= promo.maxUses) {
      return res.status(400).json({ error: 'Promo code usage limit reached' });
    }
    
    // Check minimum purchase
    if (promo.minPurchase && parseFloat(promo.minPurchase) > subtotal) {
      return res.status(400).json({ 
        error: `Minimum purchase of $${promo.minPurchase} required` 
      });
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = (subtotal * parseFloat(promo.discountValue)) / 100;
    } else if (promo.discountType === 'fixed') {
      discountAmount = Math.min(parseFloat(promo.discountValue), subtotal);
    }
    
    res.json({
      valid: true,
      promo,
      discountAmount: discountAmount.toFixed(2),
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({ error: 'Failed to validate promo code' });
  }
});

// Track conversion when order is placed
router.post('/track-conversion', async (req, res) => {
  try {
    const { orderId, orderTotal, promoCode, affiliateCode } = req.body;
    
    let affiliate = null;
    
    // Check if promo code was used
    if (promoCode) {
      const [promo] = await db
        .select()
        .from(promoCodes)
        .where(eq(promoCodes.code, promoCode))
        .limit(1);
      
      if (promo?.affiliateId) {
        [affiliate] = await db
          .select()
          .from(affiliates)
          .where(eq(affiliates.id, promo.affiliateId))
          .limit(1);
      }
    }
    
    // Check affiliate code if no promo code affiliate found
    if (!affiliate && affiliateCode) {
      [affiliate] = await db
        .select()
        .from(affiliates)
        .where(eq(affiliates.affiliateCode, affiliateCode))
        .limit(1);
    }
    
    // Record conversion if affiliate found
    if (affiliate) {
      const commissionAmount = (orderTotal * parseFloat(affiliate.commissionRate)) / 100;
      
      await db.insert(affiliateConversions).values({
        affiliateId: affiliate.id,
        orderId,
        orderTotal: orderTotal.toString(),
        commissionAmount: commissionAmount.toFixed(2),
        status: 'pending',
      });
      
      // Update affiliate stats
      await db
        .update(affiliates)
        .set({
          totalConversions: sql`${affiliates.totalConversions} + 1`,
          totalEarnings: sql`${affiliates.totalEarnings} + ${commissionAmount.toFixed(2)}`,
        })
        .where(eq(affiliates.id, affiliate.id));
      
      res.json({ success: true, commissionAmount: commissionAmount.toFixed(2) });
    } else {
      res.json({ success: false, message: 'No affiliate found' });
    }
  } catch (error) {
    console.error('Error tracking conversion:', error);
    res.status(500).json({ error: 'Failed to track conversion' });
  }
});

export default router;