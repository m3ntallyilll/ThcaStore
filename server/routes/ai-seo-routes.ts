import { Router } from 'express';
import { aiSEOService } from '../ai-seo-service';
import { aiLinkPyramidService } from '../ai-link-pyramid-service';
import { storage } from '../storage';

const router = Router();

// Middleware placeholders - will be implemented when integrating with main routes
const authenticateToken = (req: any, res: any, next: any) => next();
const requireAdmin = (req: any, res: any, next: any) => next();

// AI SEO Enhancement Routes
router.post('/api/admin/seo/enhance/:postId', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
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

// Bulk SEO Enhancement
router.post('/api/admin/seo/bulk-enhance', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
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

// Generate Internal Link Suggestions
router.get('/api/admin/seo/link-suggestions/:postId', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { postId } = req.params;
    const post = await storage.getBlogPost(postId);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }

    const suggestions = await aiSEOService.generateInternalLinkPyramid(post);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Link Pyramid Management Routes
router.post('/api/admin/seo/build-pyramid', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
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

// Implement Link Pyramid
router.post('/api/admin/seo/implement-pyramid', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
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

// Analyze Pyramid Health
router.get('/api/admin/seo/pyramid-health', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
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

// Generate Enhanced Metadata for Single Post
router.post('/api/admin/seo/metadata/:postId', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { postId } = req.params;
    const { targetKeywords } = req.body;
    
    const post = await storage.getBlogPost(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }

    const metadata = await aiSEOService.generateEnhancedMetadata(post, targetKeywords);
    
    res.json({
      success: true,
      metadata
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;