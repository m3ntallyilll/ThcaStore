import Groq from 'groq-sdk';
import { groqToolsService } from './groq-tools-service';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

interface BlogGenerationRequest {
  topic: string;
  category?: string;
  tone?: string;
  targetAudience?: string;
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
  includeCallToAction?: boolean;
  targetLocation?: string;
  locationKeywords?: string[];
}

interface BlogSection {
  title: string;
  content: string;
  wordCount: number;
}

export class BlogAIStreamingService {
  
  async generateCompleteBlogPost(request: BlogGenerationRequest): Promise<{ title: string; content: string }> {
    if (!groq) {
      throw new Error('Groq AI service not configured. Please check GROQ_API_KEY environment variable.');
    }

    try {
      console.log(`🚀 Starting tool-enhanced multi-agent blog generation for: ${request.topic}`);
      
      // First, enhance content strategy with tools
      const toolResult = await groqToolsService.enhanceBlogContentGeneration(request);
      console.log(`📊 Tool-enhanced research completed for: ${request.topic}`);
      
      // Multi-agent parallel generation for maximum coverage with tool insights
      const [
        introSection,
        mainSections,
        faqSection,
        conclusionSection
      ] = await Promise.all([
        this.generateIntroductionAgent(request, toolResult),
        this.generateMainContentAgent(request, toolResult),
        this.generateFAQAgent(request, toolResult),
        this.generateConclusionAgent(request, toolResult)
      ]);

      // Combine all sections into comprehensive blog post
      const fullContent = this.assembleBlogPost(introSection, mainSections, faqSection, conclusionSection, request);
      
      console.log(`✅ Tool-enhanced blog generated: ${fullContent.content.length} characters`);
      
      return {
        title: introSection.title,
        content: fullContent.content
      };
    } catch (error) {
      console.error('Error in tool-enhanced multi-agent blog generation:', error);
      throw new Error('Failed to generate complete blog post. Please try again.');
    }
  }

  private async generateIntroductionAgent(request: BlogGenerationRequest, toolResult?: any): Promise<BlogSection> {
    const locationContext = request.targetLocation ? 
      `Focus on ${request.targetLocation} with local THCA laws, shipping options, and location-specific keywords.` : '';

    const systemPrompt = `You are Agent 1: Blog Introduction Specialist for THCA content.

Your mission: Create the PERFECT blog introduction that:
- Hooks readers in the first sentence with compelling facts or questions
- Clearly defines what ${request.topic} is and why it matters
- Presents a comprehensive overview of what readers will learn
- Includes a "Key Takeaways" box with 6-8 bullet points
- Uses strong SEO optimization with target keywords
- Sets authoritative, trustworthy tone
- 400-600 words of engaging introduction content

Target: ${request.targetAudience || 'hemp enthusiasts and newcomers'}
Tone: ${request.tone || 'professional but approachable'}
Keywords: ${request.keywords?.join(', ') || 'THCA, premium hemp, lab-tested'}
${locationContext}

Return ONLY a JSON object:
{
  "title": "SEO-optimized title (50-60 chars)",
  "content": "Complete HTML introduction with key takeaways box",
  "wordCount": estimated_word_count
}`;

    const completion = await groq!.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create a compelling introduction for: ${request.topic}. Make it comprehensive and engaging.` }
      ],
      temperature: 0.8,
      max_tokens: 2500
    });

    try {
      const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
      return {
        title: result.title || `The Complete Guide to ${request.topic} in 2025`,
        content: result.content || `<h2>Introduction to ${request.topic}</h2><p>Comprehensive guide coming...</p>`,
        wordCount: result.wordCount || 500
      };
    } catch (error) {
      return {
        title: `The Complete Guide to ${request.topic} in 2025`,
        content: `<h2>Understanding ${request.topic}: Your Complete Resource</h2><p>Welcome to the most comprehensive guide about ${request.topic} available online.</p>`,
        wordCount: 500
      };
    }
  }

  private async generateMainContentAgent(request: BlogGenerationRequest, toolResult?: any): Promise<BlogSection[]> {
    const locationContext = request.targetLocation ? 
      `Include ${request.targetLocation}-specific information, local regulations, and shipping details.` : '';

    const sections = [
      'Science and Research Behind the Topic',
      'Benefits, Effects, and Applications', 
      'Quality Standards and What to Look For',
      'Usage Guidelines and Best Practices',
      'Legal Landscape and Compliance',
      'Industry Trends and Future Outlook'
    ];

    const sectionPromises = sections.map(async (sectionTopic) => {
      const systemPrompt = `You are Agent 2: Main Content Specialist for "${sectionTopic}"

Your mission: Create ONE comprehensive section about ${sectionTopic} for ${request.topic}.

Requirements:
- 500-800 words of detailed, informative content
- Use h2 for main heading, h3 for subheadings
- Include bullet points, numbered lists, and data
- Scientific accuracy with practical applications
- SEO optimization with natural keyword integration
- Professional tone with educational value
${locationContext}

Keywords to include: ${request.keywords?.join(', ') || 'THCA, hemp, hemp, premium, lab-tested'}

Return ONLY the HTML content for this section, no JSON wrapper needed.`;

      const completion = await groq!.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Write the "${sectionTopic}" section for ${request.topic}. Make it comprehensive and detailed.` }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return {
        title: sectionTopic,
        content: completion.choices[0]?.message?.content || `<h2>${sectionTopic}</h2><p>Detailed information about ${sectionTopic} for ${request.topic}.</p>`,
        wordCount: 600
      };
    });

    return Promise.all(sectionPromises);
  }

  private async generateFAQAgent(request: BlogGenerationRequest, toolResult?: any): Promise<BlogSection> {
    const locationContext = request.targetLocation ? 
      `Include questions about ${request.targetLocation} laws, shipping, and local availability.` : '';

    const systemPrompt = `You are Agent 3: FAQ Specialist for THCA content.

Your mission: Create a comprehensive FAQ section for ${request.topic}.

Requirements:
- 10-15 frequently asked questions with detailed answers
- Mix of beginner, intermediate, and advanced questions
- Each answer 100-150 words with practical value
- Cover legal, safety, quality, usage, and purchasing topics
- Use h2 for main heading "Frequently Asked Questions About ${request.topic}"
- Use h3 for each question
- Professional, helpful tone
${locationContext}

Keywords: ${request.keywords?.join(', ') || 'THCA, hemp, hemp'}

Return ONLY the HTML content for the complete FAQ section.`;

    const completion = await groq!.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create comprehensive FAQ for ${request.topic}. Cover all important questions readers would have.` }
      ],
      temperature: 0.6,
      max_tokens: 4000
    });

    return {
      title: `FAQ About ${request.topic}`,
      content: completion.choices[0]?.message?.content || `<h2>Frequently Asked Questions</h2><h3>What is ${request.topic}?</h3><p>Comprehensive answer...</p>`,
      wordCount: 1200
    };
  }

  private async generateConclusionAgent(request: BlogGenerationRequest, toolResult?: any): Promise<BlogSection> {
    const ctaContext = request.includeCallToAction ? 
      'Include a compelling call-to-action for premium THCA products.' : 
      'Focus on educational wrap-up and next steps.';

    const systemPrompt = `You are Agent 4: Conclusion and CTA Specialist.

Your mission: Create the PERFECT conclusion for ${request.topic}.

Requirements:
- Summarize key points and main takeaways
- Provide clear next steps for readers
- ${ctaContext}
- 300-500 words of compelling closing content
- Use h2 for "Conclusion" and any subsections
- Professional, authoritative tone that builds trust
- Strong finish that encourages action

Target audience: ${request.targetAudience || 'hemp enthusiasts'}

Return ONLY the HTML content for the conclusion section.`;

    const completion = await groq!.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Write a compelling conclusion for ${request.topic}. Make it actionable and memorable.` }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return {
      title: `Conclusion`,
      content: completion.choices[0]?.message?.content || `<h2>Conclusion</h2><p>Thank you for reading this comprehensive guide to ${request.topic}.</p>`,
      wordCount: 400
    };
  }

  private assembleBlogPost(
    intro: BlogSection, 
    mainSections: BlogSection[], 
    faq: BlogSection, 
    conclusion: BlogSection,
    request: BlogGenerationRequest
  ): { content: string; totalWords: number } {
    
    const totalWords = intro.wordCount + 
                      mainSections.reduce((sum, section) => sum + section.wordCount, 0) + 
                      faq.wordCount + 
                      conclusion.wordCount;

    console.log(`📊 Blog assembly: ${totalWords} total words across ${mainSections.length + 3} sections`);

    const content = `
    <div class="blog-content">
      ${intro.content}
      
      ${mainSections.map(section => section.content).join('\n\n')}
      
      ${faq.content}
      
      ${conclusion.content}
      
      <div class="blog-meta" style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          <strong>Word Count:</strong> ~${totalWords} words | 
          <strong>Reading Time:</strong> ~${Math.ceil(totalWords / 200)} minutes |
          <strong>Generated:</strong> ${new Date().toLocaleDateString()}
        </p>
      </div>
    </div>`;

    return { content, totalWords };
  }

  async generateLocationSpecificBlog(location: string, topic: string): Promise<{ title: string; content: string }> {
    const locationRequest: BlogGenerationRequest = {
      topic: `${topic} in ${location}`,
      category: 'location-specific',
      tone: 'professional',
      targetAudience: `${location} residents interested in THCA`,
      length: 'long',
      keywords: [`THCA ${location}`, `buy THCA in ${location}`, `${location} THCA laws`, `hemp ${location}`],
      includeCallToAction: true,
      targetLocation: location,
      locationKeywords: [`THCA near me ${location}`, `${location} hemp dispensary`, `THCA delivery ${location}`]
    };

    return this.generateCompleteBlogPost(locationRequest);
  }

  async generateProductCategoryBlog(category: string, focus: string): Promise<{ title: string; content: string }> {
    const categoryRequest: BlogGenerationRequest = {
      topic: `${focus} ${category}`,
      category: category,
      tone: 'educational',
      targetAudience: 'hemp enthusiasts and newcomers',
      length: 'long',
      keywords: [category, 'THCA', 'premium', 'lab-tested', focus],
      includeCallToAction: true
    };

    return this.generateCompleteBlogPost(categoryRequest);
  }
}

export const blogAIStreamingService = new BlogAIStreamingService();