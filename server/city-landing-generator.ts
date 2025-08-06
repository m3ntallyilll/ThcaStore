import { CityTHCAGenerator, THCAKeywordSet } from './city-thca-generator';
import Groq from 'groq-sdk';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

class GroqService {
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_key_for_development'
    });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 4000,
      });

      return chatCompletion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API Error:', error);
      return '';
    }
  }
}

export interface CityLandingPage {
  city: string;
  state: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  htmlContent: string;
  keywords: string[];
  generatedAt: string;
  wordCount: number;
}

export class CityLandingGenerator {
  private groq: GroqService;
  private generator: CityTHCAGenerator;

  constructor() {
    this.groq = new GroqService();
    this.generator = new CityTHCAGenerator();
  }

  generateSlug(city: string, state: string): string {
    return `thca-${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase().replace(/\s+/g, '-')}`;
  }

  async generateLandingPage(keywords: THCAKeywordSet): Promise<CityLandingPage> {
    const slug = this.generateSlug(keywords.city, keywords.state);
    const canonicalUrl = `https://mentally-chill.com/${slug}`;

    const prompt = `Create a comprehensive, SEO-optimized THCA landing page for ${keywords.city}, ${keywords.state}.

REQUIREMENTS:
- 2000+ words of unique, engaging content
- Local focus and relevance to ${keywords.city}
- Professional, trustworthy tone
- Include local benefits, delivery info, legal compliance
- Natural keyword integration (avoid keyword stuffing)
- Semantic HTML structure with proper headings
- Call-to-action buttons throughout
- FAQ section addressing local concerns

TARGET KEYWORDS to naturally incorporate:
Primary: ${keywords.primaryKeywords.slice(0, 5).join(', ')}
Long-tail: ${keywords.longTailKeywords.slice(0, 8).join(', ')}
Local: ${keywords.localVariations.slice(0, 5).join(', ')}

CONTENT STRUCTURE:
1. Hero section with local appeal
2. Why choose THCA in ${keywords.city}
3. Product showcase with local benefits
4. Legal information for ${keywords.state} residents
5. Delivery and service areas around ${keywords.city}
6. Customer testimonials (generic but relevant)
7. FAQ section for ${keywords.city} customers
8. Strong call-to-action conclusion

Make it sound authentic and locally relevant while being informative and persuasive. Return only the HTML content without <html>, <head>, or <body> tags.`;

    try {
      const htmlContent = await this.groq.generateContent(prompt);
      const wordCount = this.countWords(htmlContent);

      return {
        city: keywords.city,
        state: keywords.state,
        slug,
        seoTitle: keywords.seoTitle,
        metaDescription: keywords.metaDescription,
        canonicalUrl,
        htmlContent,
        keywords: [...keywords.primaryKeywords, ...keywords.longTailKeywords, ...keywords.localVariations],
        generatedAt: new Date().toISOString(),
        wordCount
      };
    } catch (error) {
      console.error(`Error generating landing page for ${keywords.city}:`, error);
      return this.generateFallbackLandingPage(keywords);
    }
  }

  private generateFallbackLandingPage(keywords: THCAKeywordSet): CityLandingPage {
    const slug = this.generateSlug(keywords.city, keywords.state);
    const htmlContent = this.createFallbackHTML(keywords);
    
    return {
      city: keywords.city,
      state: keywords.state,
      slug,
      seoTitle: keywords.seoTitle,
      metaDescription: keywords.metaDescription,
      canonicalUrl: `https://mentally-chill.com/${slug}`,
      htmlContent,
      keywords: [...keywords.primaryKeywords, ...keywords.longTailKeywords],
      generatedAt: new Date().toISOString(),
      wordCount: this.countWords(htmlContent)
    };
  }

  private createFallbackHTML(keywords: THCAKeywordSet): string {
    return `
<article class="city-landing-page">
  <header class="hero-section">
    <h1>${keywords.h1Tag}</h1>
    <p class="hero-description">
      Discover premium, lab-tested THCA products in ${keywords.city}, ${keywords.state}. 
      Fast delivery, legal compliance, and exceptional quality guaranteed.
    </p>
    <div class="cta-buttons">
      <a href="/products" class="btn btn-primary">Shop THCA Products</a>
      <a href="/learn" class="btn btn-secondary">Learn About THCA</a>
    </div>
  </header>

  <section class="benefits-section">
    <h2>Why Choose THCA in ${keywords.city}, ${keywords.state}</h2>
    <div class="benefits-grid">
      <div class="benefit">
        <h3>Legal & Compliant</h3>
        <p>Our hemp-derived THCA products are federally legal under the 2018 Farm Bill and compliant with ${keywords.state} regulations.</p>
      </div>
      <div class="benefit">
        <h3>Lab-Tested Quality</h3>
        <p>Every product undergoes rigorous third-party testing for potency, purity, and safety before reaching ${keywords.city} customers.</p>
      </div>
      <div class="benefit">
        <h3>Fast ${keywords.city} Delivery</h3>
        <p>Quick, discrete delivery throughout ${keywords.city} and surrounding areas with tracking information provided.</p>
      </div>
      <div class="benefit">
        <h3>Local Support</h3>
        <p>Dedicated customer service team familiar with ${keywords.state} laws and ${keywords.city} delivery areas.</p>
      </div>
    </div>
  </section>

  <section class="products-showcase">
    <h2>Premium THCA Products for ${keywords.city} Residents</h2>
    <p>
      Browse our extensive selection of THCA flower, pre-rolls, gummies, and concentrates. 
      All products are carefully curated and tested to meet the highest standards for ${keywords.city} customers.
    </p>
    <div class="product-categories">
      <div class="category">
        <h3>THCA Flower</h3>
        <p>Premium indoor-grown THCA flower with diverse strain options available for delivery in ${keywords.city}.</p>
      </div>
      <div class="category">
        <h3>THCA Pre-Rolls</h3>
        <p>Convenient, ready-to-use THCA pre-rolls made with high-quality flower, perfect for ${keywords.city} residents.</p>
      </div>
      <div class="category">
        <h3>THCA Edibles</h3>
        <p>Delicious THCA gummies and edibles with precise dosing, ideal for new and experienced users in ${keywords.city}.</p>
      </div>
    </div>
  </section>

  <section class="legal-info">
    <h2>THCA Legal Information for ${keywords.state} Residents</h2>
    <p>
      THCA (Tetrahydrocannabinolic Acid) is the non-psychoactive precursor to THC found in raw cannabis plants. 
      When sourced from hemp containing less than 0.3% Delta-9 THC, THCA products are federally legal under 
      the 2018 Farm Bill and available to adults 21+ in ${keywords.city}, ${keywords.state}.
    </p>
    <div class="legal-points">
      <ul>
        <li>Hemp-derived THCA is federally legal</li>
        <li>Must be 21+ to purchase in ${keywords.state}</li>
        <li>Third-party lab testing ensures compliance</li>
        <li>Discrete packaging and delivery to ${keywords.city}</li>
      </ul>
    </div>
  </section>

  <section class="delivery-info">
    <h2>THCA Delivery in ${keywords.city} and Surrounding Areas</h2>
    <p>
      We provide fast, reliable delivery throughout ${keywords.city}, ${keywords.state} and surrounding communities. 
      Most orders are processed within 24 hours and arrive within 2-3 business days.
    </p>
    <div class="delivery-features">
      <ul>
        <li>Fast processing and shipping from our facilities</li>
        <li>Discrete packaging for privacy</li>
        <li>Tracking information provided for all ${keywords.city} orders</li>
        <li>Customer support available for delivery questions</li>
        <li>Free shipping on orders over $75 to ${keywords.city}</li>
      </ul>
    </div>
  </section>

  <section class="faq">
    <h2>Frequently Asked Questions - ${keywords.city}, ${keywords.state}</h2>
    <div class="faq-item">
      <h3>Is THCA legal in ${keywords.city}, ${keywords.state}?</h3>
      <p>Yes, hemp-derived THCA products containing less than 0.3% Delta-9 THC are federally legal and available to adults 21+ in ${keywords.city}, ${keywords.state}.</p>
    </div>
    <div class="faq-item">
      <h3>How long does delivery take to ${keywords.city}?</h3>
      <p>Most orders to ${keywords.city} are processed within 24 hours and arrive within 2-3 business days via standard shipping.</p>
    </div>
    <div class="faq-item">
      <h3>Do you offer same-day delivery in ${keywords.city}?</h3>
      <p>Currently, we offer fast 2-3 day shipping to ${keywords.city}. Same-day delivery may be available for select areas - contact us for details.</p>
    </div>
    <div class="faq-item">
      <h3>What makes your THCA products safe for ${keywords.city} customers?</h3>
      <p>All products undergo comprehensive third-party testing for potency, pesticides, heavy metals, and microbials before shipping to ${keywords.city}.</p>
    </div>
  </section>

  <section class="cta-conclusion">
    <h2>Ready to Try Premium THCA in ${keywords.city}?</h2>
    <p>
      Join thousands of satisfied customers throughout ${keywords.state} who trust us for premium, 
      lab-tested THCA products. Fast delivery to ${keywords.city} and exceptional customer service guaranteed.
    </p>
    <div class="final-cta">
      <a href="/products" class="btn btn-primary btn-large">Shop THCA Products Now</a>
      <p class="guarantee">30-day satisfaction guarantee | Lab-tested quality | Fast ${keywords.city} delivery</p>
    </div>
  </section>
</article>`;
  }

  private countWords(html: string): number {
    // Remove HTML tags and count words
    const text = html.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  async generateBulkLandingPages(keywordFile: string): Promise<CityLandingPage[]> {
    if (!existsSync(keywordFile)) {
      throw new Error(`Keyword file not found: ${keywordFile}`);
    }

    const data = JSON.parse(readFileSync(keywordFile, 'utf8'));
    const keywordSets: THCAKeywordSet[] = data.keywordSets || [];
    
    console.log(`📄 Generating ${keywordSets.length} city landing pages...`);
    
    const landingPages: CityLandingPage[] = [];
    let completed = 0;

    for (const keywords of keywordSets) {
      try {
        const landingPage = await this.generateLandingPage(keywords);
        landingPages.push(landingPage);
        completed++;
        
        console.log(`✓ Generated landing page for ${keywords.city}, ${keywords.state} (${completed}/${keywordSets.length})`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to generate landing page for ${keywords.city}, ${keywords.state}:`, error);
      }
    }

    // Save results
    const results = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalPages: landingPages.length,
        totalWords: landingPages.reduce((sum, page) => sum + page.wordCount, 0),
        averageWordsPerPage: Math.round(landingPages.reduce((sum, page) => sum + page.wordCount, 0) / landingPages.length)
      },
      pages: landingPages
    };

    writeFileSync('city_landing_pages.json', JSON.stringify(results, null, 2));
    
    console.log('\n🎉 BULK LANDING PAGE GENERATION COMPLETE!');
    console.log(`📊 Total Pages: ${landingPages.length}`);
    console.log(`📝 Total Words: ${results.metadata.totalWords.toLocaleString()}`);
    console.log(`📈 Average Words per Page: ${results.metadata.averageWordsPerPage}`);
    console.log('💾 Results saved to: city_landing_pages.json');

    return landingPages;
  }
}