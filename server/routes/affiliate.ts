import { Router } from 'express';
import { db } from '../db';
import { affiliates, affiliateClicks, affiliateConversions, promoCodes, promoCodeUsage } from '@shared/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

// Generate unique affiliate code
function generateAffiliateCode(username: string): string {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${username.slice(0, 3).toUpperCase()}${random}`;
}

// Track affiliate clicks via referral links
router.get('/track/:affiliateCode', async (req, res) => {
  try {
    const { affiliateCode } = req.params;
    const { redirect = '/' } = req.query;
    
    // Find affiliate
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

// Get or create affiliate account for logged-in user
router.get('/my-affiliate', async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Check if user already has an affiliate account
    let [affiliate] = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.userId, userId))
      .limit(1);
    
    // Create affiliate account if doesn't exist
    if (!affiliate) {
      const username = req.user?.claims?.email?.split('@')[0] || 'user';
      const affiliateCode = generateAffiliateCode(username);
      
      [affiliate] = await db
        .insert(affiliates)
        .values({
          userId,
          affiliateCode,
          commissionRate: '10.00', // 10% default commission
        })
        .returning();
    }
    
    // Get conversion stats
    const conversions = await db
      .select({
        total: sql<number>`COUNT(*)`,
        pending: sql<number>`COUNT(*) FILTER (WHERE status = 'pending')`,
        approved: sql<number>`COUNT(*) FILTER (WHERE status = 'approved')`,
        totalEarnings: sql<number>`COALESCE(SUM(commission_amount), 0)`,
      })
      .from(affiliateConversions)
      .where(eq(affiliateConversions.affiliateId, affiliate.id));
    
    // Get promo codes associated with this affiliate
    const affiliatePromoCodes = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.affiliateId, affiliate.id));
    
    res.json({
      ...affiliate,
      stats: conversions[0],
      promoCodes: affiliatePromoCodes,
      referralLink: `${process.env.APP_URL || 'https://mentally-chill.online'}/ref/${affiliate.affiliateCode}`,
    });
  } catch (error) {
    console.error('Error fetching affiliate data:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate data' });
  }
});

// Create promo code linked to affiliate
router.post('/create-promo', async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { code, discountType, discountValue, minPurchase, maxUses, expiresAt, description } = req.body;
    
    // Get user's affiliate account
    const [affiliate] = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.userId, userId))
      .limit(1);
    
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate account not found' });
    }
    
    // Generate code if not provided
    const promoCode = code || `${affiliate.affiliateCode}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Create promo code
    const [newPromo] = await db
      .insert(promoCodes)
      .values({
        code: promoCode,
        affiliateId: affiliate.id,
        discountType: discountType || 'percentage',
        discountValue: discountValue || '10.00',
        minPurchase: minPurchase || '0.00',
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        description,
        createdBy: userId,
      })
      .returning();
    
    res.json(newPromo);
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
      
      res.json({ success: true, commissionAmount });
    } else {
      res.json({ success: false, message: 'No affiliate found' });
    }
  } catch (error) {
    console.error('Error tracking conversion:', error);
    res.status(500).json({ error: 'Failed to track conversion' });
  }
});

export default router;