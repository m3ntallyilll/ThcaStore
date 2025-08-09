import Groq from 'groq-sdk';
import type { BlogPost } from '@shared/schema';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

interface SchemaMarkup {
  article: any;
  breadcrumb: any;
  faq?: any;
  howTo?: any;
  organization: any;
  website: any;
}

class AISchemaService {
  /**
   * Generate comprehensive Schema.org markup for a blog post
   */
  async generateBlogSchema(post: BlogPost, baseUrl: string = 'https://thcastore.com'): Promise<SchemaMarkup> {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt || post.metaDescription || this.generateExcerpt(post.content),
      "image": post.featuredImage || `${baseUrl}/blog-images/${post.slug}.jpg`,
      "author": {
        "@type": "Person",
        "name": "THCA Store Expert",
        "url": `${baseUrl}/about`
      },
      "publisher": {
        "@type": "Organization",
        "name": "THCA Store",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        },
        "sameAs": [
          "https://twitter.com/THCAStore",
          "https://facebook.com/THCAStore",
          "https://instagram.com/THCAStore"
        ]
      },
      "datePublished": post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      "dateModified": post.updatedAt.toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}/blog/${post.slug}`
      },
      "articleSection": post.category,
      "keywords": post.keywords?.join(', ') || 'THCA, hemp, premium cannabis',
      "wordCount": Math.floor(post.content.length / 5),
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "copyrightHolder": {
        "@type": "Organization",
        "name": "THCA Store"
      },
      "genre": "Hemp Education",
      "about": {
        "@type": "Thing",
        "name": "Hemp and THCA Products",
        "description": "Premium hemp-derived THCA products and education"
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${baseUrl}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.category,
          "item": `${baseUrl}/blog/category/${post.category.toLowerCase()}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": post.title,
          "item": `${baseUrl}/blog/${post.slug}`
        }
      ]
    };

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "THCA Store",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "description": "Premium hemp-derived THCA products with lab-tested quality and fast shipping",
      "sameAs": [
        "https://twitter.com/THCAStore",
        "https://facebook.com/THCAStore",
        "https://instagram.com/THCAStore"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-THCA-STORE",
        "contactType": "Customer Service",
        "availableLanguage": "English"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "THCA Store",
      "url": baseUrl,
      "description": "Premium hemp-derived THCA products with lab-tested quality",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    // Generate FAQ schema if content contains questions
    const faqSchema = await this.generateFAQSchema(post, baseUrl);

    // Generate HowTo schema if content is instructional
    const howToSchema = await this.generateHowToSchema(post, baseUrl);

    return {
      article: articleSchema,
      breadcrumb: breadcrumbSchema,
      organization: organizationSchema,
      website: websiteSchema,
      ...(faqSchema && { faq: faqSchema }),
      ...(howToSchema && { howTo: howToSchema })
    };
  }

  /**
   * Generate FAQ schema if the content contains Q&A patterns
   */
  private async generateFAQSchema(post: BlogPost, baseUrl: string): Promise<any | null> {
    // Check if content contains FAQ patterns
    const content = post.content.toLowerCase();
    const hasFAQ = content.includes('frequently asked') || 
                   content.includes('faq') || 
                   (content.match(/\?/g) || []).length >= 3;

    if (!hasFAQ) return null;

    const systemPrompt = `Extract FAQ items from this blog post content. Look for questions and their answers.

Content: ${post.content.slice(0, 2000)}...

If you find Q&A patterns, return JSON in this format:
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text here"
      }
    }
  ]
}

If no clear Q&A patterns exist, return null.`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Extract FAQ schema from this content." }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content?.trim();
      if (response === 'null' || !response) return null;

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating FAQ schema:', error);
      return null;
    }
  }

  /**
   * Generate HowTo schema for instructional content
   */
  private async generateHowToSchema(post: BlogPost, baseUrl: string): Promise<any | null> {
    // Check if content is instructional
    const content = post.content.toLowerCase();
    const isHowTo = content.includes('how to') || 
                    content.includes('step ') || 
                    content.includes('guide') ||
                    content.includes('tutorial');

    if (!isHowTo) return null;

    const systemPrompt = `Extract step-by-step instructions from this blog post if it contains a how-to guide.

Title: ${post.title}
Content: ${post.content.slice(0, 2000)}...

If this is instructional content with clear steps, return JSON in this format:
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to [title]",
  "description": "Guide description",
  "image": "${baseUrl}/blog-images/${post.slug}.jpg",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1 title",
      "text": "Step 1 description",
      "url": "${baseUrl}/blog/${post.slug}#step1"
    }
  ]
}

If not instructional content, return null.`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate HowTo schema if applicable." }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content?.trim();
      if (response === 'null' || !response) return null;

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating HowTo schema:', error);
      return null;
    }
  }

  /**
   * Generate product schema for hemp/THCA products mentioned in content
   */
  async generateProductSchema(post: BlogPost, baseUrl: string): Promise<any[]> {
    const systemPrompt = `Identify hemp/THCA products mentioned in this blog post and create Product schema markup.

Title: ${post.title}
Content: ${post.content.slice(0, 1500)}...

Look for specific product mentions and create schema for each. Return JSON array:
[
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Product name",
    "description": "Product description from content",
    "image": "https://mentally-chill.online/placeholder-product.jpg",
    "sku": "product-id",
    "category": "Hemp Products",
    "brand": {
      "@type": "Brand",
      "name": "Mentally Chill"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.5,
      "ratingCount": 75
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": 4.5
        },
        "author": {
          "@type": "Person",
          "name": "Verified Customer"
        },
        "reviewBody": "Great quality product with excellent effects.",
        "datePublished": "2024-01-15"
      }
    ],
    "offers": {
      "@type": "Offer",
      "url": "https://mentally-chill.online/products",
      "availability": "https://schema.org/InStock",
      "price": "29.99",
      "priceCurrency": "USD",
      "seller": {
        "@type": "Organization",
        "name": "Mentally Chill"
      },
      "priceValidUntil": "2024-12-31"
    }
  }
]

If no specific products are mentioned, return empty array.`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Extract product schema from this content." }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content?.trim();
      if (!response || response === '[]') return [];

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating product schema:', error);
      return [];
    }
  }

  /**
   * Generate complete schema markup HTML for embedding in page head
   */
  async generateSchemaHTML(post: BlogPost, baseUrl: string = 'https://thcastore.com'): Promise<string> {
    const schemas = await this.generateBlogSchema(post, baseUrl);
    const productSchemas = await this.generateProductSchema(post, baseUrl);

    let schemaHTML = '';

    // Add all schema types
    Object.values(schemas).forEach(schema => {
      if (schema) {
        schemaHTML += `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>\n`;
      }
    });

    // Add product schemas
    productSchemas.forEach(schema => {
      schemaHTML += `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>\n`;
    });

    return schemaHTML;
  }

  /**
   * Generate meta tags HTML for the blog post
   */
  generateMetaTagsHTML(post: BlogPost, baseUrl: string = 'https://thcastore.com'): string {
    const metaTitle = post.metaTitle || post.title;
    const metaDescription = post.metaDescription || this.generateExcerpt(post.content);
    const imageUrl = post.featuredImage || `${baseUrl}/blog-images/${post.slug}.jpg`;
    
    return `
<!-- Meta Tags -->
<title>${metaTitle}</title>
<meta name="description" content="${metaDescription}" />
<meta name="keywords" content="${post.keywords?.join(', ') || 'THCA, hemp, premium cannabis'}" />
<meta name="author" content="THCA Store Expert" />
<meta name="robots" content="index, follow" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Open Graph Tags -->
<meta property="og:title" content="${metaTitle}" />
<meta property="og:description" content="${metaDescription}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:url" content="${baseUrl}/blog/${post.slug}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="THCA Store" />
<meta property="article:author" content="THCA Store Expert" />
<meta property="article:section" content="${post.category}" />
<meta property="article:published_time" content="${post.publishedAt?.toISOString() || post.createdAt.toISOString()}" />
<meta property="article:modified_time" content="${post.updatedAt.toISOString()}" />

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${metaTitle}" />
<meta name="twitter:description" content="${metaDescription}" />
<meta name="twitter:image" content="${imageUrl}" />
<meta name="twitter:site" content="@THCAStore" />

<!-- Additional SEO -->
<link rel="canonical" href="${baseUrl}/blog/${post.slug}" />
<meta name="theme-color" content="#10b981" />
<meta name="msapplication-TileColor" content="#10b981" />`;
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string, maxLength: number = 160): string {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (plainText.length <= maxLength) return plainText;
    
    // Find the last complete sentence within limit
    const truncated = plainText.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    
    if (lastPeriod > maxLength * 0.7) {
      return truncated.substring(0, lastPeriod + 1);
    }
    
    // Find last complete word
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }
}

export const aiSchemaService = new AISchemaService();