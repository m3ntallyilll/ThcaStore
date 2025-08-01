import Groq from 'groq-sdk';
import { storage } from './storage';
import type { BlogPost } from '@shared/schema';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

interface LinkPyramidNode {
  postId: string;
  title: string;
  slug: string;
  category: string;
  keywords: string[];
  inboundLinks: string[]; // Post IDs that link to this post
  outboundLinks: string[]; // Post IDs this post links to
  pyramidLevel: number; // 1 = top tier, 2 = middle, 3 = base
  authorityScore: number; // Calculated based on links and content quality
}

interface LinkPyramidStrategy {
  topTierPosts: LinkPyramidNode[]; // Pillar content (2-3 posts)
  middleTierPosts: LinkPyramidNode[]; // Supporting content (6-9 posts)
  baseTierPosts: LinkPyramidNode[]; // Long-tail content (20+ posts)
  linkingStrategy: LinkingRecommendation[];
}

interface LinkingRecommendation {
  fromPostId: string;
  toPostId: string;
  anchorText: string;
  contextPlacement: string;
  strategicReason: string;
  priority: 'high' | 'medium' | 'low';
}

class AILinkPyramidService {
  /**
   * Analyze all blog posts and create an intelligent link pyramid structure
   */
  async buildIntelligentLinkPyramid(): Promise<LinkPyramidStrategy> {
    const allPosts = await storage.getPublishedBlogPosts();
    
    if (allPosts.length < 3) {
      throw new Error('Need at least 3 published posts to build a link pyramid');
    }

    // Analyze and categorize posts using AI
    const analyzedPosts = await this.analyzePostsForPyramid(allPosts);
    
    // Generate strategic linking recommendations
    const linkingStrategy = await this.generateLinkingStrategy(analyzedPosts);
    
    return {
      topTierPosts: analyzedPosts.filter(post => post.pyramidLevel === 1),
      middleTierPosts: analyzedPosts.filter(post => post.pyramidLevel === 2),
      baseTierPosts: analyzedPosts.filter(post => post.pyramidLevel === 3),
      linkingStrategy
    };
  }

  /**
   * Use AI to analyze and categorize posts into pyramid levels
   */
  private async analyzePostsForPyramid(posts: BlogPost[]): Promise<LinkPyramidNode[]> {
    const systemPrompt = `You are a content strategy expert specializing in creating SEO link pyramids for hemp/THCA websites. Analyze these blog posts and assign them to pyramid levels based on content quality, topic breadth, and SEO potential.

PYRAMID STRUCTURE:
- Level 1 (Top Tier): 2-3 comprehensive pillar posts covering broad, high-volume topics
- Level 2 (Middle Tier): 6-9 supporting posts covering subtopics and related themes  
- Level 3 (Base Tier): Remaining posts covering specific, long-tail topics

ANALYSIS FACTORS:
- Content length and depth
- Topic breadth vs specificity
- Keywords and search volume potential
- Category importance
- Content quality indicators

POSTS TO ANALYZE:
${posts.map((post, index) => 
  `${index + 1}. ID: ${post.id} | Title: ${post.title} | Category: ${post.category} | Keywords: ${post.keywords?.join(', ') || 'none'} | Word Count: ~${Math.floor(post.content.length / 5)}`
).join('\n')}

Return JSON array with pyramid analysis:
[
  {
    "postId": "post-id",
    "pyramidLevel": 1,
    "authorityScore": 85,
    "strategicReason": "Comprehensive pillar content covering broad THCA topic"
  },
  ...
]

Ensure:
- Exactly 2-3 posts at Level 1
- 20-30% of posts at Level 2  
- Remaining posts at Level 3
- Authority scores 1-100 based on content quality and strategic value`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Analyze these posts and create pyramid structure." },
          { role: "assistant", content: "```json\n" }
        ],
        temperature: 0.3,
        max_tokens: 3000,
        stop: ["```"]
      });

      const analysis = JSON.parse(completion.choices[0]?.message?.content || '[]');
      
      // Convert analysis to LinkPyramidNode objects
      return posts.map(post => {
        const postAnalysis = analysis.find((a: any) => a.postId === post.id);
        return {
          postId: post.id,
          title: post.title,
          slug: post.slug,
          category: post.category,
          keywords: post.keywords || [],
          inboundLinks: [],
          outboundLinks: [],
          pyramidLevel: postAnalysis?.pyramidLevel || 3,
          authorityScore: postAnalysis?.authorityScore || 50
        };
      });
    } catch (error) {
      console.error('Error analyzing posts for pyramid:', error);
      throw new Error('Failed to analyze posts for link pyramid');
    }
  }

  /**
   * Generate strategic linking recommendations between posts
   */
  private async generateLinkingStrategy(posts: LinkPyramidNode[]): Promise<LinkingRecommendation[]> {
    const systemPrompt = `You are an internal linking strategist. Create a comprehensive linking strategy that follows SEO best practices for link pyramids.

PYRAMID POSTS:
${posts.map(post => 
  `Level ${post.pyramidLevel}: ${post.title} (ID: ${post.postId}) | Authority: ${post.authorityScore} | Category: ${post.category}`
).join('\n')}

LINKING RULES:
1. Base tier (Level 3) posts should link UP to middle tier (Level 2) posts
2. Middle tier posts should link UP to top tier (Level 1) posts  
3. Each post should have exactly 3 outbound internal links
4. Top tier posts can link to each other for topic clustering
5. Middle tier posts can cross-link when topically relevant
6. Avoid over-linking or creating link loops

Generate linking recommendations that create authority flow upward while maintaining natural user navigation.

Return JSON array:
[
  {
    "fromPostId": "source-post-id",
    "toPostId": "destination-post-id", 
    "anchorText": "natural anchor text",
    "contextPlacement": "where to place the link",
    "strategicReason": "why this link helps SEO and user experience",
    "priority": "high"
  },
  ...
]

Ensure every post has exactly 3 outbound links and the link structure follows pyramid principles.`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate comprehensive linking strategy for this pyramid." },
          { role: "assistant", content: "```json\n" }
        ],
        temperature: 0.4,
        max_tokens: 4000,
        stop: ["```"]
      });

      const recommendations = JSON.parse(completion.choices[0]?.message?.content || '[]');
      
      // Validate recommendations
      return recommendations.filter((rec: any) => 
        rec.fromPostId && 
        rec.toPostId && 
        rec.fromPostId !== rec.toPostId &&
        posts.some(p => p.postId === rec.fromPostId) &&
        posts.some(p => p.postId === rec.toPostId)
      );
    } catch (error) {
      console.error('Error generating linking strategy:', error);
      throw new Error('Failed to generate linking strategy');
    }
  }

  /**
   * Implement the link pyramid by updating blog post content
   */
  async implementLinkPyramid(strategy: LinkPyramidStrategy): Promise<void> {
    console.log('🔗 Implementing AI-generated link pyramid...');
    
    const allRecommendations = strategy.linkingStrategy;
    const postUpdates = new Map<string, string[]>(); // postId -> array of links to add

    // Group recommendations by source post
    for (const rec of allRecommendations) {
      if (!postUpdates.has(rec.fromPostId)) {
        postUpdates.set(rec.fromPostId, []);
      }
      
      const linkHtml = `<a href="/blog/${this.getPostSlug(rec.toPostId, strategy)}" class="internal-link text-hemp hover:text-hemp-400 underline font-medium transition-colors" title="${this.getPostTitle(rec.toPostId, strategy)}">${rec.anchorText}</a>`;
      postUpdates.get(rec.fromPostId)!.push(linkHtml);
    }

    // Update each post with its new internal links
    for (const postId of Array.from(postUpdates.keys())) {
      const links = postUpdates.get(postId)!;
      try {
        const post = await storage.getBlogPost(postId);
        if (!post) continue;

        const enhancedContent = await this.injectLinksIntoPyramidPost(post.content, links);
        await storage.updateBlogPost(postId, { content: enhancedContent });
        
        console.log(`✅ Updated post ${post.title} with ${links.length} internal links`);
      } catch (error) {
        console.error(`❌ Failed to update post ${postId}:`, error);
      }
    }

    console.log('🎯 Link pyramid implementation completed!');
  }

  /**
   * Intelligently inject links into post content
   */
  private async injectLinksIntoPyramidPost(content: string, links: string[]): Promise<string> {
    let enhancedContent = content;
    
    // Add internal links section at the end of the post
    const linksSection = `
    <div class="internal-links-pyramid bg-gradient-to-r from-hemp/5 to-gold/5 p-8 rounded-xl my-8 border border-hemp/20">
      <h3 class="text-2xl font-bold mb-6 text-hemp">Continue Your Hemp Education Journey</h3>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        ${links.map(link => `
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-hemp/10 hover:border-hemp/30 transition-colors">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Related Article:</p>
            <div class="font-medium">${link}</div>
          </div>
        `).join('')}
      </div>
      <p class="text-sm text-gray-500 mt-4 text-center">
        🔗 <em>These carefully curated links form part of our comprehensive hemp education network</em>
      </p>
    </div>`;

    // Insert links section before the closing div
    enhancedContent = enhancedContent.replace(
      /(<\/div>\s*$)/,
      `${linksSection}$1`
    );

    return enhancedContent;
  }

  /**
   * Helper methods for getting post data from strategy
   */
  private getPostSlug(postId: string, strategy: LinkPyramidStrategy): string {
    const allPosts = [
      ...strategy.topTierPosts,
      ...strategy.middleTierPosts, 
      ...strategy.baseTierPosts
    ];
    return allPosts.find(p => p.postId === postId)?.slug || 'unknown';
  }

  private getPostTitle(postId: string, strategy: LinkPyramidStrategy): string {
    const allPosts = [
      ...strategy.topTierPosts,
      ...strategy.middleTierPosts,
      ...strategy.baseTierPosts
    ];
    return allPosts.find(p => p.postId === postId)?.title || 'Related Article';
  }

  /**
   * Analyze current link pyramid health and suggest improvements
   */
  async analyzePyramidHealth(): Promise<{
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
  }> {
    const strategy = await this.buildIntelligentLinkPyramid();
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check pyramid structure
    if (strategy.topTierPosts.length < 2) {
      issues.push('Need at least 2 pillar posts for effective pyramid');
      score -= 20;
    }
    
    if (strategy.topTierPosts.length > 4) {
      issues.push('Too many pillar posts - dilutes authority flow');
      score -= 10;
    }

    // Check linking density
    const totalPosts = strategy.topTierPosts.length + strategy.middleTierPosts.length + strategy.baseTierPosts.length;
    const totalLinks = strategy.linkingStrategy.length;
    const avgLinksPerPost = totalLinks / totalPosts;

    if (avgLinksPerPost < 2) {
      issues.push('Low internal linking density - add more connections');
      score -= 15;
      recommendations.push('Increase internal linking to 3-4 links per post');
    }

    if (avgLinksPerPost > 5) {
      issues.push('Over-linking detected - may reduce link value');
      score -= 10;
      recommendations.push('Reduce internal links to 3-4 per post maximum');
    }

    // Add improvement recommendations
    if (score > 90) {
      recommendations.push('Excellent link pyramid structure! Continue monitoring and optimizing.');
    } else if (score > 70) {
      recommendations.push('Good foundation - focus on content quality and natural link placement.');
    } else {
      recommendations.push('Significant improvements needed - rebuild pyramid structure.');
    }

    return {
      overallScore: Math.max(0, score),
      issues,
      recommendations,
      pyramidStats: {
        topTier: strategy.topTierPosts.length,
        middleTier: strategy.middleTierPosts.length,
        baseTier: strategy.baseTierPosts.length,
        totalLinks: totalLinks,
        avgLinksPerPost: Math.round(avgLinksPerPost * 10) / 10
      }
    };
  }
}

export const aiLinkPyramidService = new AILinkPyramidService();