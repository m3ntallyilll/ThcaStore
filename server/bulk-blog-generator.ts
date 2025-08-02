import Groq from 'groq-sdk';
import { storage } from './database-storage';
import type { InsertBlogPost } from '@shared/schema';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

interface BulkBlogRequest {
  count: number;
  baseCategory: string;
  topics?: string[];
  tone?: 'professional' | 'casual' | 'educational' | 'promotional';
  length?: 'short' | 'medium' | 'long';
  targetAudience?: string;
  includeCallToAction?: boolean;
}

interface BlogTemplate {
  title: string;
  category: string;
  keywords: string[];
  topic: string;
}

export class BulkBlogGenerator {
  
  async generateBulkBlogs(request: BulkBlogRequest, authorId: string): Promise<InsertBlogPost[]> {
    if (!groq) {
      throw new Error('Groq AI service not configured. Please check GROQ_API_KEY environment variable.');
    }

    console.log(`🚀 Starting bulk generation of ${request.count} blogs...`);
    
    try {
      // Step 1: Generate blog ideas and templates
      const templates = await this.generateBlogTemplates(request);
      
      // Step 2: Generate content for each template in parallel batches
      const batchSize = 3; // Process 3 blogs at a time to avoid rate limits
      const results: InsertBlogPost[] = [];
      
      for (let i = 0; i < templates.length; i += batchSize) {
        const batch = templates.slice(i, i + batchSize);
        console.log(`📝 Generating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(templates.length/batchSize)}...`);
        
        const batchPromises = batch.map(template => 
          this.generateSingleBlog(template, request, authorId)
        );
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Small delay between batches to respect rate limits
        if (i + batchSize < templates.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log(`✅ Successfully generated ${results.length} blogs`);
      return results;
      
    } catch (error: any) {
      console.error('Bulk blog generation error:', error);
      throw new Error('Failed to generate bulk blogs. Please try again with fewer blogs or check your API limits.');
    }
  }

  private async generateBlogTemplates(request: BulkBlogRequest): Promise<BlogTemplate[]> {
    if (!groq) {
      throw new Error('Groq AI service not configured.');
    }
    const categories = [
      'education', 'products', 'health', 'legal', 'lifestyle', 'news', 'guides'
    ];
    
    const hempTopics = [
      'THCA vs Delta-9 THC: Complete Comparison',
      'Best THCA Flower Strains for Beginners',
      'How to Store Hemp Products Properly',
      'Understanding Lab Test Results for THCA',
      'Hemp Derived THCA: Legal Status by State',
      'THCA Benefits and Effects: Scientific Review',
      'Choosing Quality Hemp Products: Buyer\'s Guide',
      'Hemp Flower vs THCA Concentrates: Which is Better',
      'THCA Dosage Guidelines for New Users',
      'Organic Hemp Cultivation: Farm to Product',
      'Hemp Industry Trends and Market Analysis',
      'THCA Product Safety and Testing Standards',
      'Hemp Wellness: Incorporating THCA into Daily Life',
      'Understanding Terpenes in Hemp Products',
      'Hemp Legal Framework: Federal vs State Laws'
    ];

    const prompt = `Generate ${request.count} unique blog post ideas for a hemp THCA store.

Requirements:
- Mix different categories: ${categories.join(', ')}
- Focus on hemp-derived THCA products
- Include educational, product-focused, and lifestyle content
- Target tone: ${request.tone || 'educational'}
- Target audience: ${request.targetAudience || 'hemp enthusiasts and new users'}

Return ONLY a JSON array with this exact structure:
[
  {
    "title": "Complete title here",
    "category": "category name",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "topic": "main topic focus"
  }
]

Make each title compelling, SEO-friendly, and unique. Include relevant keywords for hemp, THCA, and related terms.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // the newest model is "llama-3.3-70b-versatile" which was released December 2024
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 4000
    });

    try {
      const content = response.choices[0].message.content || '[]';
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed.slice(0, request.count) : parsed.templates?.slice(0, request.count) || [];
    } catch (parseError) {
      // Fallback to predefined topics if parsing fails
      return hempTopics.slice(0, request.count).map((topic, index) => ({
        title: topic,
        category: categories[index % categories.length],
        keywords: ['THCA', 'hemp', 'cannabis', 'legal', 'quality'],
        topic: topic
      }));
    }
  }

  private async generateSingleBlog(template: BlogTemplate, request: BulkBlogRequest, authorId: string): Promise<InsertBlogPost> {
    if (!groq) {
      throw new Error('Groq AI service not configured.');
    }
    const lengthGuidance = {
      short: '800-1200 words',
      medium: '1500-2000 words',
      long: '2500-3500 words'
    };

    const prompt = `Write a comprehensive blog post about "${template.topic}" for a hemp THCA store.

Requirements:
- Title: ${template.title}
- Category: ${template.category}
- Target length: ${lengthGuidance[request.length || 'medium']}
- Tone: ${request.tone || 'educational'}
- Keywords to include: ${template.keywords.join(', ')}
- Include call-to-action: ${request.includeCallToAction ? 'Yes' : 'No'}

Structure the content with:
1. Engaging introduction with key takeaways box
2. Main content sections with H2/H3 headings
3. Practical information and tips
4. Safety considerations
5. Quality indicators and buying guidance
6. FAQ section (3-5 questions)
7. Professional conclusion
${request.includeCallToAction ? '8. Call-to-action for product exploration' : ''}

Return ONLY a JSON object with this structure:
{
  "title": "Final optimized title",
  "content": "Complete HTML formatted blog content",
  "metaDescription": "SEO meta description (150-160 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Important guidelines:
- Use proper HTML formatting with semantic tags
- Include styled info boxes and highlighted sections
- Focus on hemp-derived THCA products (Farm Bill 2018 compliant)
- Mention 21+ age requirements and state compliance
- Provide educational value while promoting products naturally
- Include scientific backing where appropriate`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // the newest model is "llama-3.3-70b-versatile" which was released December 2024
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000
    });

    const content = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    // Calculate read time and generate excerpt
    const wordCount = parsed.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    const excerpt = this.generateExcerpt(parsed.content);

    const blogPost: InsertBlogPost = {
      title: parsed.title,
      slug: this.generateSlug(parsed.title),
      content: parsed.content,
      excerpt,
      metaTitle: parsed.title,
      metaDescription: parsed.metaDescription,
      keywords: parsed.keywords || template.keywords,
      authorId,
      category: template.category,
      tags: template.keywords,
      status: 'published',
      isAiGenerated: true,
      readTime,
      publishedAt: new Date(),
      featuredImage: await this.suggestFeaturedImage(parsed.title, template.category)
    };

    return blogPost;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private generateExcerpt(content: string): string {
    const cleanText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return cleanText.length > 200 ? cleanText.substring(0, 197) + '...' : cleanText;
  }

  private async suggestFeaturedImage(title: string, category: string): Promise<string> {
    const imageMap = {
      education: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg',
      products: 'https://images.pexels.com/photos/5418318/pexels-photo-5418318.jpeg',
      health: 'https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg',
      legal: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg',
      lifestyle: 'https://images.pexels.com/photos/6664042/pexels-photo-6664042.jpeg',
      news: 'https://images.pexels.com/photos/7231831/pexels-photo-7231831.jpeg',
      guides: 'https://images.pexels.com/photos/8634736/pexels-photo-8634736.jpeg'
    };

    return imageMap[category as keyof typeof imageMap] || imageMap.education;
  }

  async saveBulkBlogs(blogs: InsertBlogPost[]): Promise<any[]> {
    const results = [];
    
    for (const blog of blogs) {
      try {
        const savedPost = await storage.createBlogPost(blog);
        results.push(savedPost);
        console.log(`✅ Saved: ${blog.title}`);
      } catch (error) {
        console.error(`❌ Failed to save: ${blog.title}`, error);
        results.push({ error: (error as any)?.message || 'Unknown error', title: blog.title });
      }
    }
    
    return results;
  }
}

export const bulkBlogGenerator = new BulkBlogGenerator();