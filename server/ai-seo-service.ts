import { storage } from './database-storage';
import { groqAI } from './ai-assistant';

interface PyramidHealth {
  overallScore: number;
  issues: string[];
  recommendations: string[];
  pyramidStats: {
    topTier: number;
    middleTier: number;
    baseTier: number;
    totalLinks: number;
    avgLinksPerPost: number;
  };
}

class AISEOService {
  async analyzePyramidHealth(): Promise<PyramidHealth> {
    try {
      // Get all blog posts
      const posts = await storage.getAllBlogPosts();
      
      if (!posts || posts.length === 0) {
        return {
          overallScore: 0,
          issues: ['No blog posts found'],
          recommendations: ['Create blog posts to build a link pyramid structure'],
          pyramidStats: {
            topTier: 0,
            middleTier: 0,
            baseTier: 0,
            totalLinks: 0,
            avgLinksPerPost: 0
          }
        };
      }

      // Analyze the current link structure
      const totalPosts = posts.length;
      let totalInternalLinks = 0;
      
      // Count internal links in post content
      posts.forEach(post => {
        if (post.content) {
          const linkMatches = post.content.match(/href="[^"]*"/g) || [];
          const internalLinks = linkMatches.filter(link => 
            link.includes('/blog/') || 
            link.includes('/products/') || 
            link.includes(process.env.DOMAIN || 'mentally-chill.online')
          );
          totalInternalLinks += internalLinks.length;
        }
      });

      // Calculate pyramid tiers based on content length and topic depth
      const topTier = posts.filter(post => 
        (post.content?.length || 0) > 2000 && 
        (post.keywords?.length || 0) >= 3
      ).length;
      
      const middleTier = posts.filter(post => 
        (post.content?.length || 0) > 1000 && 
        (post.content?.length || 0) <= 2000
      ).length;
      
      const baseTier = totalPosts - topTier - middleTier;

      const avgLinksPerPost = totalPosts > 0 ? totalInternalLinks / totalPosts : 0;

      // Calculate overall score
      let score = 0;
      if (totalPosts >= 10) score += 20;
      if (topTier >= 3) score += 25;
      if (middleTier >= 6) score += 25;
      if (avgLinksPerPost >= 3) score += 30;

      // Generate issues and recommendations
      const issues: string[] = [];
      const recommendations: string[] = [];

      if (totalPosts < 10) {
        issues.push('Not enough blog posts for effective SEO pyramid');
        recommendations.push('Create at least 10 comprehensive blog posts');
      }

      if (topTier < 3) {
        issues.push('Insufficient pillar content for strong SEO foundation');
        recommendations.push('Create 3-5 comprehensive pillar posts (2000+ words each)');
      }

      if (avgLinksPerPost < 3) {
        issues.push('Low internal linking density');
        recommendations.push('Add 3-5 strategic internal links per blog post');
      }

      if (totalInternalLinks < totalPosts * 2) {
        issues.push('Weak internal link structure');
        recommendations.push('Implement systematic internal linking strategy');
      }

      return {
        overallScore: Math.min(100, score),
        issues,
        recommendations,
        pyramidStats: {
          topTier,
          middleTier,
          baseTier,
          totalLinks: totalInternalLinks,
          avgLinksPerPost: Math.round(avgLinksPerPost * 10) / 10
        }
      };
    } catch (error) {
      console.error('Pyramid health analysis error:', error);
      throw new Error('Failed to analyze pyramid health');
    }
  }

  async enhanceBlogPostSEO(postId: string, targetKeywords?: string[]): Promise<any> {
    try {
      const post = await storage.getBlogPostById(postId);
      if (!post) {
        throw new Error('Blog post not found');
      }

      // Use AI to enhance SEO elements
      const prompt = `Enhance the SEO for this THCA/hemp blog post:
Title: ${post.title}
Content: ${post.content?.substring(0, 1000)}...

${targetKeywords ? `Target Keywords: ${targetKeywords.join(', ')}` : ''}

Please provide:
1. Optimized meta title (60 chars max)
2. Meta description (155 chars max)
3. 3-5 relevant keywords
4. Suggest 3 internal links to add (product or blog URLs)

Format as JSON with metaTitle, metaDescription, keywords, internalLinks fields.`;

      const aiResponse = await groqAI.generateText(prompt);
      
      let enhancedSEO;
      try {
        enhancedSEO = JSON.parse(aiResponse);
      } catch {
        // Fallback if AI doesn't return valid JSON
        enhancedSEO = {
          metaTitle: post.title.substring(0, 60),
          metaDescription: post.excerpt || post.content?.substring(0, 155) || '',
          keywords: targetKeywords || ['THCA', 'hemp', 'cannabis'],
          internalLinks: []
        };
      }

      // Update the blog post with enhanced SEO
      const updatedPost = await storage.updateBlogPost(postId, {
        metaTitle: enhancedSEO.metaTitle,
        metaDescription: enhancedSEO.metaDescription,
        keywords: enhancedSEO.keywords
      });

      return updatedPost;
    } catch (error) {
      console.error('SEO enhancement error:', error);
      throw new Error('Failed to enhance blog post SEO');
    }
  }

  async bulkEnhanceBlogSEO(postIds: string[]): Promise<void> {
    try {
      for (const postId of postIds) {
        try {
          await this.enhanceBlogPostSEO(postId);
          // Add small delay to avoid overwhelming the AI service
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to enhance SEO for post ${postId}:`, error);
        }
      }
    } catch (error) {
      console.error('Bulk SEO enhancement error:', error);
      throw new Error('Failed to complete bulk SEO enhancement');
    }
  }
}

export const aiSEOService = new AISEOService();