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

SEO-DOMINATING Content Requirements:
- MINIMUM 2000 words for comprehensive coverage
- Use extensive HTML formatting with headings (h2, h3, h4, h5), paragraphs, lists, tables
- Include scientific information, statistics, and research data
- Create multiple detailed sections with subsections
- Add FAQ section with 5-8 comprehensive questions
- Include "Key Takeaways" boxes and summary sections
- Mention legal considerations and compliance appropriately
- Create content that's highly shareable and link-worthy
- Use cannabis terminology correctly and educationally
- Focus on benefits, education, safety, and responsible use
- Add internal linking opportunities and related topics
- Include calls-to-action throughout (if requested)
- For location-targeted content, include comprehensive local information

STRUCTURE REQUIREMENTS:
1. Compelling introduction (200+ words)
2. 6-8 major sections with detailed subsections
3. FAQ section with comprehensive answers
4. Key takeaways/summary sections
5. Conclusion with next steps
6. Call-to-action integration (if requested)

Topic: ${request.topic}
Category: ${request.category}
Keywords to include: ${request.keywords?.join(', ') || 'THCA, cannabis, hemp, premium quality, lab-tested'}

Return your response as JSON with this structure:
{
  "title": "SEO-optimized, compelling title (50-60 characters)",
  "content": "Complete, comprehensive HTML-formatted blog post content (minimum 2000 words)"
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Write a comprehensive, full-length SEO blog post about: ${request.topic}. This needs to be a complete, detailed article with multiple sections, FAQ, and comprehensive coverage.` },
        { role: "assistant", content: "```json\n" }
      ],
      temperature: 0.7,
      max_tokens: 8000,
      stop: ["```"]
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    try {
      const parsed = JSON.parse(responseText);
      
      // Ensure minimum content quality for SEO domination
      if (!parsed.content || parsed.content.length < 2000) {
        return this.generateFullSEOContent(request);
      }
      
      return {
        title: parsed.title,
        content: parsed.content
      };
    } catch (parseError) {
      return this.generateFullSEOContent(request);
    }
  }

  private generateFullSEOContent(request: BlogGenerationRequest): { title: string; content: string } {
    const title = `The Complete Guide to ${request.topic}: Everything You Need to Know in 2025`;
    
    const content = `
    <div class="blog-content">
      <div class="intro-section">
        <h2>Introduction: Understanding ${request.topic}</h2>
        <p>Welcome to the most comprehensive guide about ${request.topic} available online. Whether you're new to cannabis or an experienced user, this detailed article will provide you with expert insights, scientific backing, and practical information you can't find anywhere else.</p>
        
        <p>In this extensive guide, we'll explore every aspect of ${request.topic}, from the basic science and legal considerations to advanced applications and quality indicators. Our team has compiled the latest research, industry insights, and expert knowledge to create this authoritative resource.</p>
        
        <div class="key-takeaways" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-left: 5px solid #007cba; margin: 25px 0; border-radius: 8px;">
          <h3 style="color: #007cba; margin-bottom: 15px;">🔑 Key Takeaways</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Comprehensive overview</strong> of ${request.topic} with scientific backing</li>
            <li><strong>Legal framework</strong> and compliance considerations</li>
            <li><strong>Quality indicators</strong> for choosing the best products</li>
            <li><strong>Practical applications</strong> and usage guidelines</li>
            <li><strong>Safety considerations</strong> and best practices</li>
            <li><strong>Expert recommendations</strong> and industry insights</li>
          </ul>
        </div>
      </div>

      <h2>What Is ${request.topic}? A Complete Scientific Breakdown</h2>
      <p>To truly understand ${request.topic}, we need to dive deep into the science, regulations, and practical applications that make this topic so important in today's cannabis landscape. This comprehensive analysis will provide you with the foundation you need to make informed decisions.</p>
      
      <h3>The Science Behind ${request.topic}</h3>
      <p>Recent research has revealed fascinating insights about how ${request.topic} works at the molecular level. Scientific studies have shown that understanding these mechanisms is crucial for making informed decisions about cannabis products and their applications.</p>
      
      <p>The endocannabinoid system plays a central role in how our bodies interact with cannabis compounds. This complex network of receptors, enzymes, and signaling molecules helps regulate various physiological processes, making the science behind ${request.topic} both fascinating and practically important.</p>
      
      <h3>Legal Framework and Compliance</h3>
      <p>The legal landscape surrounding ${request.topic} continues to evolve rapidly. Understanding current regulations is essential for anyone interested in cannabis products, whether for personal use or business purposes.</p>
      
      <p>Federal and state laws often differ significantly, creating a complex regulatory environment that requires careful navigation. We'll break down the key legal considerations and compliance requirements you need to know.</p>

      <h2>Benefits and Applications of ${request.topic}</h2>
      
      <h3>Therapeutic Potential and Research</h3>
      <p>Emerging research suggests that ${request.topic} may offer various therapeutic benefits. While more studies are needed, current evidence points to several promising applications:</p>
      
      <ul>
        <li><strong>Anti-inflammatory properties:</strong> Research indicates potential for reducing inflammation</li>
        <li><strong>Neuroprotective effects:</strong> Studies suggest possible brain health benefits</li>
        <li><strong>Anxiety and stress relief:</strong> Preliminary evidence for anxiolytic properties</li>
        <li><strong>Sleep quality improvement:</strong> User reports of better sleep patterns</li>
        <li><strong>Pain management support:</strong> Potential for natural pain relief</li>
      </ul>

      <h3>Who Can Benefit from ${request.topic}?</h3>
      <p>Based on current research and user experiences, ${request.topic} may be particularly beneficial for individuals seeking:</p>
      
      <ol>
        <li><strong>Natural wellness alternatives</strong> to traditional medications</li>
        <li><strong>Holistic health approaches</strong> that complement existing treatments</li>
        <li><strong>Lifestyle enhancement</strong> for improved quality of life</li>
        <li><strong>Preventive wellness</strong> strategies for long-term health</li>
      </ol>

      <h2>How to Choose Quality Products Related to ${request.topic}</h2>
      
      <h3>Essential Quality Indicators</h3>
      <p>Not all products are created equal. Understanding quality indicators is crucial for making informed purchasing decisions:</p>
      
      <div class="quality-checklist" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #333; margin-bottom: 15px;">Quality Checklist:</h4>
        <ol>
          <li><strong>Third-Party Lab Testing:</strong> COAs (Certificates of Analysis) should be readily available</li>
          <li><strong>Transparent Sourcing:</strong> Clear information about cultivation and processing methods</li>
          <li><strong>Proper Labeling:</strong> Accurate potency and ingredient information</li>
          <li><strong>Company Reputation:</strong> Established track record and positive customer reviews</li>
          <li><strong>Compliance Standards:</strong> Following all relevant regulatory requirements</li>
          <li><strong>Storage and Handling:</strong> Proper packaging to maintain product integrity</li>
        </ol>
      </div>

      <h3>Red Flags to Avoid</h3>
      <p>Certain warning signs indicate you should look elsewhere for your ${request.topic} needs:</p>
      
      <ul>
        <li>Lack of third-party testing or unavailable COAs</li>
        <li>Unclear or missing ingredient lists</li>
        <li>Unrealistic health claims or guarantees</li>
        <li>Significantly below-market pricing</li>
        <li>Poor customer service or communication</li>
        <li>No clear return or refund policy</li>
      </ul>

      <h2>Usage Guidelines and Best Practices</h2>
      
      <h3>Getting Started Safely</h3>
      <p>For those new to ${request.topic}, following proper guidelines ensures a positive and safe experience:</p>
      
      <div class="safety-guidelines" style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #856404;">Safety First:</h4>
        <ul>
          <li>Start with low doses and gradually increase as needed</li>
          <li>Consult with healthcare providers, especially if taking medications</li>
          <li>Keep products away from children and pets</li>
          <li>Store products properly according to manufacturer instructions</li>
          <li>Be aware of local laws and regulations</li>
        </ul>
      </div>
      
      <h3>Advanced Optimization Strategies</h3>
      <p>Experienced users can enhance their experience with these evidence-based approaches:</p>
      
      <ol>
        <li><strong>Timing optimization:</strong> Understanding how timing affects effectiveness</li>
        <li><strong>Combination strategies:</strong> How different products work together</li>
        <li><strong>Environmental factors:</strong> Storage and usage conditions that matter</li>
        <li><strong>Individual customization:</strong> Tailoring approaches to personal needs</li>
      </ol>

      <h2>Frequently Asked Questions About ${request.topic}</h2>
      
      <h3>What makes ${request.topic} different from other cannabis products?</h3>
      <p>The key differences lie in the specific mechanisms of action, legal status, and therapeutic applications. Unlike many cannabis products, ${request.topic} offers unique benefits while maintaining compliance with current regulations.</p>
      
      <h3>Is ${request.topic} legal in my state?</h3>
      <p>Legal status varies by jurisdiction and can change frequently. We recommend checking current local and federal regulations before making any purchases. Our team monitors regulatory changes to provide updated information to customers.</p>
      
      <h3>How do I know if I'm getting a quality product?</h3>
      <p>Look for third-party lab testing, transparent sourcing, proper labeling, and companies with established reputations. Quality products will have clear COAs available and responsive customer service.</p>
      
      <h3>What should I expect when trying ${request.topic} for the first time?</h3>
      <p>Individual experiences vary significantly based on factors like body chemistry, dosage, and product quality. Starting with lower amounts and gradually adjusting helps establish optimal personal dosing.</p>
      
      <h3>Can ${request.topic} interact with other medications?</h3>
      <p>Like any wellness product, potential interactions exist. Always consult with healthcare providers before combining with other medications or treatments, especially if you have underlying health conditions.</p>
      
      <h3>How should I store products related to ${request.topic}?</h3>
      <p>Proper storage maintains product quality and safety. Most products should be kept in cool, dry places away from direct sunlight and out of reach of children and pets.</p>
      
      <h3>What's the difference between various product types?</h3>
      <p>Different product types offer varying onset times, duration, and effects. Understanding these differences helps choose the most appropriate option for your specific needs and preferences.</p>
      
      <h3>How do I choose the right dosage?</h3>
      <p>Dosage depends on individual factors including body weight, tolerance, desired effects, and product potency. Starting low and gradually increasing while monitoring effects is the safest approach.</p>

      <h2>The Science of Quality: Lab Testing and Certification</h2>
      <p>Understanding lab testing results empowers consumers to make informed decisions. Key testing parameters include:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Test Type</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Purpose</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">What to Look For</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Cannabinoid Profile</td>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Confirms potency and composition</td>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Accurate percentages matching label claims</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Pesticide Screening</td>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Ensures product safety</td>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Non-detect or below safety limits</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Heavy Metals</td>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Tests for contamination</td>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Pass/Fail status within guidelines</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Microbial Testing</td>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Checks for harmful bacteria/mold</td>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Pass status for all categories</td>
          </tr>
        </tbody>
      </table>

      <h2>Industry Trends and Future Outlook</h2>
      <p>The cannabis industry continues evolving rapidly, with ${request.topic} representing an important segment. Key trends include:</p>
      
      <h3>Research and Development</h3>
      <p>Ongoing scientific research continues expanding our understanding of cannabis compounds and their potential applications. This research drives product innovation and regulatory development.</p>
      
      <h3>Regulatory Evolution</h3>
      <p>Legislative changes at federal and state levels continue shaping the industry landscape. Staying informed about these changes helps consumers and businesses navigate the evolving environment.</p>
      
      <h3>Consumer Education</h3>
      <p>As the market matures, consumer education becomes increasingly important. Informed consumers drive demand for quality products and responsible industry practices.</p>

      <h2>Conclusion: Making Informed Decisions About ${request.topic}</h2>
      <p>Understanding ${request.topic} requires considering multiple factors: scientific evidence, legal compliance, product quality, safety considerations, and individual needs. This comprehensive approach ensures decisions that support wellness goals while maintaining safety and legal compliance.</p>
      
      <p>The cannabis industry offers tremendous potential for those seeking natural wellness alternatives. By staying informed, choosing quality products, and following best practices, consumers can safely explore the benefits that ${request.topic} may offer.</p>
      
      <p>Remember that individual experiences vary, and what works for one person may not work for another. Starting conservatively, consulting with healthcare providers when appropriate, and choosing reputable sources are key strategies for success.</p>
      
      ${request.includeCallToAction ? `
      <div class="cta-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; text-align: center; margin: 40px 0;">
        <h3 style="color: white; margin-bottom: 20px;">Ready to Experience Premium Quality?</h3>
        <p style="margin-bottom: 20px;">Discover our carefully curated selection of premium products, all third-party tested and compliance-verified for your peace of mind.</p>
        <p style="margin-bottom: 25px;"><strong>Browse our collection today and experience the difference quality makes.</strong></p>
        <div style="margin-top: 25px;">
          <p style="font-size: 14px; opacity: 0.9;">✓ Lab-tested for purity and potency</p>
          <p style="font-size: 14px; opacity: 0.9;">✓ Compliant with all regulations</p>
          <p style="font-size: 14px; opacity: 0.9;">✓ Premium quality guarantee</p>
        </div>
      </div>
      ` : ''}
      
      <div class="final-thoughts" style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #28a745; margin: 30px 0;">
        <h4 style="color: #155724; margin-bottom: 15px;">Final Thoughts</h4>
        <p style="margin-bottom: 0;">The world of ${request.topic} continues evolving as research advances and regulations develop. Staying educated, choosing quality products, and prioritizing safety will help you make the most of what this fascinating field has to offer.</p>
      </div>
    </div>`;
    
    return { title, content };
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