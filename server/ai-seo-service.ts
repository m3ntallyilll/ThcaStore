import Groq from 'groq-sdk';
import { storage } from './storage';
import type { BlogPost } from '@shared/schema';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

interface SEOMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  altText: string;
  schemaMarkup: any;
  openGraphTags: any;
  twitterCardTags: any;
}

interface InternalLinkSuggestion {
  postId: string;
  title: string;
  slug: string;
  relevanceScore: number;
  anchorText: string;
  contextualPlacement: string;
}

class AISEOService {
  /**
   * Generate comprehensive AI-enhanced metadata for a blog post
   */
  async generateEnhancedMetadata(post: BlogPost, targetKeywords?: string[]): Promise<SEOMetadata> {
    const systemPrompt = `You are an advanced SEO specialist with expertise in hemp and THCA content optimization. Generate comprehensive, AI-enhanced metadata that maximizes search visibility and user engagement.

CONTENT ANALYSIS:
Title: ${post.title}
Content Preview: ${post.content.slice(0, 1000)}...
Category: ${post.category}
Existing Keywords: ${post.keywords?.join(', ') || 'none'}
Target Keywords: ${targetKeywords?.join(', ') || 'THCA, hemp, premium'}

REQUIREMENTS:
1. Meta Title: 50-60 characters, includes primary keyword, compelling
2. Meta Description: 150-160 characters, includes target keywords, call-to-action
3. Keywords: 8-12 relevant SEO keywords/phrases (mix of short-tail and long-tail)
4. Alt Text: Descriptive alt text for featured image (assuming hemp/THCA product image)
5. Schema Markup: Complete JSON-LD Article schema
6. Open Graph Tags: Complete OG meta tags for social sharing
7. Twitter Card Tags: Twitter-specific meta tags

Focus on hemp industry terminology, legal compliance, and conversion-focused language.

Return JSON format:
{
  "metaTitle": "SEO-optimized title",
  "metaDescription": "Compelling meta description with keywords",
  "keywords": ["keyword1", "keyword2", "keyword3", ...],
  "altText": "Descriptive alt text for featured image",
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Article headline",
    "description": "Article description",
    "author": {
      "@type": "Person",
      "name": "THCA Store Expert"
    },
    "publisher": {
      "@type": "Organization",
      "name": "THCA Store",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thcastore.com/logo.png"
      }
    },
    "datePublished": "${post.publishedAt?.toISOString() || new Date().toISOString()}",
    "dateModified": "${post.updatedAt.toISOString()}",
    "mainEntityOfPage": "https://thcastore.com/blog/${post.slug}",
    "image": "https://thcastore.com/blog-images/${post.slug}.jpg",
    "articleSection": "${post.category}",
    "keywords": "generated keywords here"
  },
  "openGraphTags": {
    "og:title": "Title for social sharing",
    "og:description": "Description for social sharing",
    "og:image": "https://thcastore.com/blog-images/${post.slug}.jpg",
    "og:url": "https://thcastore.com/blog/${post.slug}",
    "og:type": "article",
    "og:site_name": "THCA Store",
    "article:author": "THCA Store Expert",
    "article:section": "${post.category}",
    "article:published_time": "${post.publishedAt?.toISOString() || new Date().toISOString()}"
  },
  "twitterCardTags": {
    "twitter:card": "summary_large_image",
    "twitter:title": "Twitter-optimized title",
    "twitter:description": "Twitter-optimized description",
    "twitter:image": "https://thcastore.com/blog-images/${post.slug}.jpg",
    "twitter:site": "@THCAStore"
  }
}`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate comprehensive SEO metadata for this blog post." },
          { role: "assistant", content: "```json\n" }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        stop: ["```"]
      });

      const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
      return result;
    } catch (error) {
      console.error('Error generating SEO metadata:', error);
      throw new Error('Failed to generate SEO metadata');
    }
  }

  /**
   * Generate internal link pyramid suggestions for a blog post
   */
  async generateInternalLinkPyramid(targetPost: BlogPost): Promise<InternalLinkSuggestion[]> {
    // Get all published blog posts
    const allPosts = await storage.getPublishedBlogPosts();
    const otherPosts = allPosts.filter(post => post.id !== targetPost.id);

    if (otherPosts.length === 0) {
      return [];
    }

    const systemPrompt = `You are an internal linking strategist specializing in creating SEO-optimized link pyramids. Analyze the target post and suggest the 3 most relevant internal links that will create maximum SEO value and user engagement.

TARGET POST:
Title: ${targetPost.title}
Category: ${targetPost.category}
Keywords: ${targetPost.keywords?.join(', ') || 'none'}
Content Preview: ${targetPost.content.slice(0, 500)}...

AVAILABLE POSTS FOR LINKING:
${otherPosts.slice(0, 20).map((post, index) => 
  `${index + 1}. ID: ${post.id} | Title: ${post.title} | Category: ${post.category} | Keywords: ${post.keywords?.join(', ') || 'none'}`
).join('\n')}

REQUIREMENTS:
1. Select exactly 3 posts that are most relevant to the target post
2. Calculate relevance score (0-100) based on topic overlap, keyword similarity, and category relevance
3. Generate natural anchor text (4-8 words) that flows contextually
4. Suggest WHERE in the target post content to place each link (beginning, middle, end)
5. Prioritize posts that create a logical user journey and topic clustering

Return JSON array format:
[
  {
    "postId": "post-id-here",
    "title": "Post title",
    "slug": "post-slug",
    "relevanceScore": 85,
    "anchorText": "natural anchor text here",
    "contextualPlacement": "middle - in section about related topic"
  },
  ...
]`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate internal link pyramid suggestions for the target post." },
          { role: "assistant", content: "```json\n" }
        ],
        temperature: 0.4,
        max_tokens: 1500,
        stop: ["```"]
      });

      const suggestions = JSON.parse(completion.choices[0]?.message?.content || '[]');
      
      // Validate and filter suggestions
      return suggestions
        .filter((suggestion: any) => 
          suggestion.postId && 
          suggestion.relevanceScore > 50 &&
          otherPosts.some(post => post.id === suggestion.postId)
        )
        .slice(0, 3); // Ensure exactly 3 links max
    } catch (error) {
      console.error('Error generating internal link suggestions:', error);
      throw new Error('Failed to generate internal link suggestions');
    }
  }

  /**
   * Automatically inject internal links into blog post content
   */
  async injectInternalLinks(postContent: string, linkSuggestions: InternalLinkSuggestion[]): Promise<string> {
    let enhancedContent = postContent;

    for (const suggestion of linkSuggestions) {
      const linkHtml = `<a href="/blog/${suggestion.slug}" class="internal-link text-hemp hover:text-hemp-400 underline font-medium" title="${suggestion.title}">${suggestion.anchorText}</a>`;
      
      // Smart placement based on contextual placement suggestion
      if (suggestion.contextualPlacement.includes('beginning')) {
        // Insert in first paragraph
        enhancedContent = enhancedContent.replace(
          /(<p[^>]*>.*?<\/p>)/,
          `$1\n\n<p>For more insights on this topic, check out our guide on ${linkHtml}.</p>`
        );
      } else if (suggestion.contextualPlacement.includes('middle')) {
        // Insert in middle section
        const paragraphs = enhancedContent.split('</p>');
        const middleIndex = Math.floor(paragraphs.length / 2);
        if (paragraphs[middleIndex]) {
          paragraphs[middleIndex] += `\n\n<p>Related reading: ${linkHtml} provides additional context on this subject.</p>`;
          enhancedContent = paragraphs.join('</p>');
        }
      } else {
        // Insert near end
        enhancedContent = enhancedContent.replace(
          /(<\/div>\s*$)/,
          `\n\n<div class="related-content bg-hemp/5 p-6 rounded-lg my-8">
            <h3 class="text-lg font-semibold mb-3 text-hemp">Continue Learning</h3>
            <p>Dive deeper into this topic: ${linkHtml}</p>
          </div>$1`
        );
      }
    }

    return enhancedContent;
  }

  /**
   * Generate AI-optimized alt text for images in blog content
   */
  async generateImageAltText(imageContext: string, postTitle: string, postCategory: string): Promise<string> {
    const systemPrompt = `Generate SEO-optimized alt text for an image in a hemp/THCA blog post.

Context: ${imageContext}
Post Title: ${postTitle}
Category: ${postCategory}

Requirements:
- 8-12 words maximum
- Include relevant keywords naturally
- Be descriptive and accessible
- Focus on hemp/THCA industry terminology
- Avoid keyword stuffing

Return only the alt text, no quotes or extra formatting.`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate alt text for this image." }
        ],
        temperature: 0.3,
        max_tokens: 50
      });

      return completion.choices[0]?.message?.content?.trim() || 'Hemp THCA product image';
    } catch (error) {
      console.error('Error generating alt text:', error);
      return 'Hemp THCA product image';
    }
  }

  /**
   * Process and enhance a blog post with full AI metadata and internal linking
   */
  async enhanceBlogPostSEO(postId: string, targetKeywords?: string[]): Promise<BlogPost> {
    const post = await storage.getBlogPost(postId);
    if (!post) {
      throw new Error('Blog post not found');
    }

    // Generate AI-enhanced metadata
    const metadata = await this.generateEnhancedMetadata(post, targetKeywords);
    
    // Generate internal link suggestions
    const linkSuggestions = await this.generateInternalLinkPyramid(post);
    
    // Inject internal links into content
    const enhancedContent = await this.injectInternalLinks(post.content, linkSuggestions);

    // Update post with enhanced metadata and links
    const updatedPost = await storage.updateBlogPost(postId, {
      content: enhancedContent,
      metaTitle: metadata.metaTitle,
      metaDescription: metadata.metaDescription,
      keywords: metadata.keywords,
    });

    if (!updatedPost) {
      throw new Error('Failed to update blog post');
    }

    // Store metadata for frontend use
    await this.storeEnhancedMetadata(postId, metadata);

    return updatedPost;
  }

  /**
   * Store enhanced metadata in a way that can be accessed by frontend
   */
  private async storeEnhancedMetadata(postId: string, metadata: SEOMetadata): Promise<void> {
    // In a real implementation, you might store this in a separate metadata table
    // For now, we'll log it and it could be stored in a JSON field or cache
    console.log(`Enhanced metadata for post ${postId}:`, {
      schemaMarkup: metadata.schemaMarkup,
      openGraphTags: metadata.openGraphTags,
      twitterCardTags: metadata.twitterCardTags,
      altText: metadata.altText
    });
  }

  /**
   * Bulk enhance multiple blog posts
   */
  async bulkEnhanceBlogSEO(postIds: string[]): Promise<void> {
    console.log(`🚀 Starting bulk SEO enhancement for ${postIds.length} posts...`);
    
    for (const postId of postIds) {
      try {
        await this.enhanceBlogPostSEO(postId);
        console.log(`✅ Enhanced SEO for post ${postId}`);
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to enhance post ${postId}:`, error);
      }
    }
    
    console.log(`🎯 Bulk SEO enhancement completed for ${postIds.length} posts`);
  }
}

export const aiSEOService = new AISEOService();