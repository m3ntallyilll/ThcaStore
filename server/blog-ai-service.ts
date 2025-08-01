import Groq from 'groq-sdk';
import { storage } from './database-storage';
import type { InsertBlogPost } from '@shared/schema';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

interface BlogGenerationRequest {
  topic: string;
  category: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'educational' | 'promotional';
  length?: 'short' | 'medium' | 'long';
  targetAudience?: string;
  includeCallToAction?: boolean;
  targetLocation?: string; // Add location targeting for local SEO
  locationKeywords?: string[]; // State/city specific keywords
}

interface SEOMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
}

export class BlogAIService {
  
  async generateBlogPost(request: BlogGenerationRequest, authorId: string): Promise<InsertBlogPost> {
    if (!groq) {
      throw new Error('Groq AI service not configured. Please check GROQ_API_KEY environment variable.');
    }

    try {
      // Generate the main blog content
      const content = await this.generateContent(request);
      
      // Generate SEO metadata
      const seoData = await this.generateSEOMetadata(request, content.title);
      
      // Calculate estimated read time (average 200 words per minute)
      const wordCount = content.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      // Generate excerpt from content
      const excerpt = this.generateExcerpt(content.content);

      const blogPost: InsertBlogPost = {
        title: content.title,
        slug: seoData.slug,
        content: content.content,
        excerpt,
        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        keywords: seoData.keywords,
        authorId,
        category: request.category,
        tags: request.keywords || [],
        status: 'published',
        isAiGenerated: true,
        readTime,
        publishedAt: new Date(),
        featuredImage: await this.suggestFeaturedImage(content.title, request.category),
      };

      return blogPost;
    } catch (error) {
      console.error('Error generating blog post:', error);
      throw new Error('Failed to generate blog post. Please try again.');
    }
  }

  private async generateContent(request: BlogGenerationRequest): Promise<{ title: string; content: string }> {
    const lengthGuidance = {
      short: '500-800 words',
      medium: '1000-1500 words', 
      long: '2000-3000 words'
    };

    const locationContext = request.targetLocation ? 
      `\n\nLocation-Specific Focus:
- Target location: ${request.targetLocation}
- Include local THCA laws and regulations for ${request.targetLocation}
- Mention shipping and delivery options to ${request.targetLocation}
- Reference local hemp stores and dispensaries when relevant
- Use location-specific keywords: ${request.locationKeywords?.join(', ') || `THCA ${request.targetLocation}, buy THCA in ${request.targetLocation}`}
- Address ${request.targetLocation} residents specifically` : '';

    const systemPrompt = `You are an expert cannabis and THCA content writer specializing in SEO-optimized blog posts for a premium THCA store. 

Create engaging, informative, and SEO-friendly content that:
- Educates readers about THCA, cannabis, and related topics
- Maintains a ${request.tone || 'professional'} tone
- Targets ${request.targetAudience || 'cannabis enthusiasts and newcomers'}
- Is approximately ${lengthGuidance[request.length || 'medium']} long
- Includes relevant keywords naturally
- Provides valuable information that builds trust and authority
- ${request.includeCallToAction ? 'Includes a compelling call-to-action for the THCA store' : 'Focuses on education without being overly promotional'}${locationContext}

Content Guidelines:
- Use proper HTML formatting with headings (h2, h3), paragraphs, lists
- Include scientific information when relevant
- Mention legal considerations appropriately
- Create content that's shareable and link-worthy
- Use cannabis terminology correctly
- Focus on benefits, education, and responsible use
- For location-targeted content, include city names, local regulations, and shipping information

Topic: ${request.topic}
Category: ${request.category}
Keywords to include: ${request.keywords?.join(', ') || 'THCA, cannabis, hemp'}

Return your response as JSON with this structure:
{
  "title": "SEO-optimized title (60 characters or less)",
  "content": "Full HTML-formatted blog post content"
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Write a comprehensive blog post about: ${request.topic}` },
        { role: "assistant", content: "```json\n" }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      stop: ["```"]
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    try {
      const parsed = JSON.parse(responseText);
      return {
        title: parsed.title,
        content: parsed.content
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        title: `Ultimate Guide to ${request.topic}`,
        content: `<h2>Introduction</h2><p>Welcome to our comprehensive guide about ${request.topic}. This article will provide you with everything you need to know about this important topic in the cannabis industry.</p><p>Content generation encountered an issue, but our team will review and complete this post manually.</p>`
      };
    }
  }

  private async generateSEOMetadata(request: BlogGenerationRequest, title: string): Promise<SEOMetadata> {
    const systemPrompt = `You are an SEO expert specializing in cannabis and THCA content. Generate optimized metadata for the blog post.

Requirements:
- Meta title: 50-60 characters, includes primary keyword
- Meta description: 150-160 characters, compelling and informative
- Keywords: 5-10 relevant SEO keywords/phrases
- Slug: URL-friendly, includes primary keyword, lowercase with hyphens

Topic: ${request.topic}
Title: ${title}
Category: ${request.category}
Target keywords: ${request.keywords?.join(', ') || 'THCA, cannabis'}

Return JSON format:
{
  "metaTitle": "SEO title",
  "metaDescription": "Meta description", 
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "slug": "url-friendly-slug"
}`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate SEO metadata for this blog post" },
          { role: "assistant", content: "```json\n" }
        ],
        temperature: 0.3,
        max_tokens: 500,
        stop: ["```"]
      });

      const responseText = completion.choices[0]?.message?.content || "";
      const parsed = JSON.parse(responseText);
      
      return {
        metaTitle: parsed.metaTitle,
        metaDescription: parsed.metaDescription,
        keywords: parsed.keywords,
        slug: parsed.slug
      };
    } catch (error) {
      // Fallback SEO metadata
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      return {
        metaTitle: title.length > 60 ? title.substring(0, 57) + '...' : title,
        metaDescription: `Learn everything about ${request.topic} in our comprehensive guide. Expert insights on THCA, cannabis, and more.`,
        keywords: request.keywords || ['THCA', 'cannabis', 'hemp', request.topic],
        slug
      };
    }
  }

  private generateExcerpt(content: string): string {
    // Remove HTML tags and get first 160 characters
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (textContent.length <= 160) {
      return textContent;
    }
    
    // Find the last complete sentence within 160 characters
    const excerpt = textContent.substring(0, 160);
    const lastPeriod = excerpt.lastIndexOf('.');
    const lastExclamation = excerpt.lastIndexOf('!');
    const lastQuestion = excerpt.lastIndexOf('?');
    
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
    
    if (lastSentenceEnd > 100) {
      return excerpt.substring(0, lastSentenceEnd + 1);
    }
    
    return excerpt + '...';
  }

  private async suggestFeaturedImage(title: string, category: string): Promise<string> {
    // Return a relevant Unsplash image based on category and topic
    const imageCategories = {
      'education': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      'products': 'https://images.unsplash.com/photo-1605007493699-05d4a5c3eefc?w=800',
      'health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      'legal': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      'lifestyle': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'news': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      'guides': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'
    };

    return imageCategories[category as keyof typeof imageCategories] || imageCategories.education;
  }

  async improveBlogPost(postId: string, improvements: string[]): Promise<InsertBlogPost> {
    if (!groq) {
      throw new Error('Groq AI service not configured');
    }

    const currentPost = await storage.getBlogPost(postId);
    if (!currentPost) {
      throw new Error('Blog post not found');
    }

    const systemPrompt = `You are an expert content editor specializing in cannabis and THCA blog posts. 

Current blog post:
Title: ${currentPost.title}
Content: ${currentPost.content}

Requested improvements:
${improvements.join('\n- ')}

Please improve the blog post while maintaining its core message and SEO optimization. Return the response as JSON:
{
  "title": "improved title if needed",
  "content": "improved HTML content",
  "metaDescription": "improved meta description if needed"
}`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Improve this blog post based on the feedback provided" },
          { role: "assistant", content: "```json\n" }
        ],
        temperature: 0.5,
        max_tokens: 4000,
        stop: ["```"]
      });

      const responseText = completion.choices[0]?.message?.content || "";
      const parsed = JSON.parse(responseText);

      const updatedPost: InsertBlogPost = {
        ...currentPost,
        title: parsed.title || currentPost.title,
        content: parsed.content || currentPost.content,
        metaDescription: parsed.metaDescription || currentPost.metaDescription,
        updatedAt: new Date()
      };

      return updatedPost;
    } catch (error) {
      console.error('Error improving blog post:', error);
      throw new Error('Failed to improve blog post');
    }
  }

  async generateBlogIdeas(category: string, count: number = 10): Promise<string[]> {
    if (!groq) {
      return [
        'The Ultimate Guide to THCA vs THC',
        'Benefits of THCA for Wellness',
        'How to Choose Quality THCA Products',
        'THCA Legal Status: What You Need to Know',
        'Best Ways to Consume THCA Flower'
      ];
    }

    const systemPrompt = `Generate ${count} engaging blog post ideas for a THCA store in the ${category} category. 

Ideas should be:
- SEO-friendly and searchable
- Educational and valuable
- Relevant to THCA and cannabis
- Appeal to both beginners and experienced users
- Trend-aware and current

Return as a JSON array of strings: ["idea1", "idea2", ...]`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate ${count} blog ideas for ${category}` },
          { role: "assistant", content: "```json\n" }
        ],
        temperature: 0.8,
        max_tokens: 1000,
        stop: ["```"]
      });

      const responseText = completion.choices[0]?.message?.content || "";
      const parsed = JSON.parse(responseText);
      
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error generating blog ideas:', error);
      return [
        'The Ultimate Guide to THCA vs THC',
        'Benefits of THCA for Wellness',
        'How to Choose Quality THCA Products'
      ];
    }
  }
}

export const blogAIService = new BlogAIService();