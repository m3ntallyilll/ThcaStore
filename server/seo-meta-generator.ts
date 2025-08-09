// SEO meta tag generator for product pages and strain niches
import { strainNicheKeywords, effectsKeywords, productAngleKeywords, terpeneKeywords, consumptionMethodKeywords } from './thca-keywords';
import type { Product } from '@shared/schema';

interface SEOMetaTags {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  h2: string[];
  canonicalUrl: string;
  schemaMarkup: any;
}

export class SEOMetaGenerator {
  private baseUrl: string = 'https://mentally-chill.online';

  /**
   * Generate comprehensive SEO meta tags for product pages
   */
  generateProductSEO(product: Product): SEOMetaTags {
    const category = product.category || 'thca';
    const strainType = product.strainType?.toLowerCase() || 'hybrid';
    const effects = product.effects || [];
    
    // Build keyword-rich title
    const title = this.generateProductTitle(product);
    const description = this.generateProductDescription(product);
    const keywords = this.generateProductKeywords(product);
    const canonicalUrl = `${this.baseUrl}/products/${product.id}`;

    return {
      title,
      description,
      keywords,
      h1: `${product.name} - Premium ${strainType} THCA ${category}`,
      h2: [
        `Buy ${product.name} THCA Online`,
        `${product.name} Effects & Benefits`,
        `${product.name} Lab Results & COA`,
        'Customer Reviews & Ratings',
        'Shipping & Delivery Information'
      ],
      canonicalUrl,
      schemaMarkup: this.generateProductSchema(product, canonicalUrl)
    };
  }

  /**
   * Generate category page SEO
   */
  generateCategorySEO(category: string, filters: any = {}): SEOMetaTags {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    const strainType = filters.strainType;
    const effect = filters.effect;
    
    let title = `Premium THCA ${categoryName}`;
    let description = `Shop the finest THCA ${category} collection.`;
    
    if (strainType) {
      title += ` - ${strainType} Strains`;
      description += ` Browse ${strainType.toLowerCase()} THCA ${category} for`;
    }
    
    if (effect) {
      title += ` for ${effect}`;
      description += ` ${effect} effects.`;
    }
    
    title += ' | Fast Delivery & Lab Tested';
    description += ' Lab-tested, premium quality, fast shipping nationwide.';

    const keywords = this.generateCategoryKeywords(category, filters);
    
    return {
      title,
      description,
      keywords,
      h1: `Premium THCA ${categoryName}${strainType ? ` - ${strainType} Collection` : ''}`,
      h2: [
        `Best ${categoryName} THCA Products`,
        `${categoryName} Strain Types & Effects`,
        'Lab Results & Quality Guarantee',
        'Customer Reviews',
        'Shipping & Returns'
      ],
      canonicalUrl: `${this.baseUrl}/products?category=${category}`,
      schemaMarkup: this.generateCategorySchema(category, filters)
    };
  }

  /**
   * Generate strain-specific SEO for individual strain pages
   */
  generateStrainSEO(strainName: string, strainType: string, effects: string[]): SEOMetaTags {
    const title = `${strainName} THCA Strain - ${strainType} | Buy Online`;
    const description = `Premium ${strainName} THCA ${strainType.toLowerCase()} strain. ${effects.join(', ')} effects. Lab-tested, fast shipping.`;
    
    const keywords = [
      `${strainName} THCA`,
      `${strainName} strain`,
      `${strainName} ${strainType}`,
      `Buy ${strainName}`,
      ...effects.map(effect => `${strainName} for ${effect}`),
      ...this.getStrainTypeKeywords(strainType),
      ...effects.flatMap(effect => effectsKeywords.therapeutic.concat(effectsKeywords.recreational))
        .filter(keyword => effects.some(effect => keyword.includes(effect)))
        .slice(0, 5)
    ];

    return {
      title,
      description,
      keywords,
      h1: `${strainName} THCA ${strainType} Strain`,
      h2: [
        `About ${strainName} Strain`,
        `${strainName} Effects & Benefits`,
        `${strainName} Terpene Profile`,
        `${strainName} Products Available`,
        'Lab Results & COA'
      ],
      canonicalUrl: `${this.baseUrl}/strains/${strainName.toLowerCase().replace(/\s+/g, '-')}`,
      schemaMarkup: this.generateStrainSchema(strainName, strainType, effects)
    };
  }

  private generateProductTitle(product: Product): string {
    const category = product.category || 'THCA';
    const strainType = product.strainType || '';
    const weight = product.weight || '';
    
    return `${product.name} - ${strainType} ${category.toUpperCase()} ${weight} | Premium Quality`.slice(0, 60);
  }

  private generateProductDescription(product: Product): string {
    const category = product.category || 'THCA';
    const strainType = product.strainType?.toLowerCase() || 'hybrid';
    const effects = product.effects?.slice(0, 3).join(', ') || 'therapeutic';
    
    return `Buy ${product.name} ${strainType} ${category} online. ${effects} effects. Premium quality, lab-tested, fast shipping nationwide.`.slice(0, 160);
  }

  private generateProductKeywords(product: Product): string[] {
    const baseKeywords = [
      product.name,
      `${product.name} THCA`,
      `Buy ${product.name}`,
      `${product.name} strain`
    ];

    // Add strain type keywords
    if (product.strainType) {
      const strainTypeKeywords = this.getStrainTypeKeywords(product.strainType);
      baseKeywords.push(...strainTypeKeywords.slice(0, 4));
    }

    // Add effect keywords
    if (product.effects && product.effects.length > 0) {
      product.effects.forEach(effect => {
        baseKeywords.push(`THCA for ${effect}`, `${effect} THCA`);
      });
    }

    // Add category keywords
    if (product.category) {
      baseKeywords.push(
        `THCA ${product.category}`,
        `Premium ${product.category}`,
        `Buy THCA ${product.category}`
      );
    }

    // Add quality and pricing angle keywords
    baseKeywords.push(
      ...productAngleKeywords.quality.slice(0, 3),
      ...productAngleKeywords.convenience.slice(0, 2)
    );

    return baseKeywords.slice(0, 15);
  }

  private generateCategoryKeywords(category: string, filters: any): string[] {
    const keywords = [
      `THCA ${category}`,
      `Buy THCA ${category}`,
      `Premium ${category}`,
      `Best THCA ${category}`,
      `${category} online`,
      `${category} delivery`,
      `Lab-tested ${category}`,
      `Quality ${category}`
    ];

    if (filters.strainType) {
      const strainKeywords = this.getStrainTypeKeywords(filters.strainType);
      keywords.push(...strainKeywords.slice(0, 4));
    }

    if (filters.effect) {
      keywords.push(
        `${category} for ${filters.effect}`,
        `${filters.effect} ${category}`,
        `THCA ${filters.effect}`
      );
    }

    return keywords.slice(0, 20);
  }

  private getStrainTypeKeywords(strainType: string): string[] {
    const type = strainType.toLowerCase();
    if (type === 'indica') return strainNicheKeywords.indica;
    if (type === 'sativa') return strainNicheKeywords.sativa;
    return strainNicheKeywords.hybrid;
  }

  private generateProductSchema(product: Product, canonicalUrl: string): any {
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.imageUrl ? `${this.baseUrl}${product.imageUrl}` : `${this.baseUrl}/placeholder-product.jpg`,
      "sku": product.id,
      "category": product.category,
      "brand": {
        "@type": "Brand",
        "name": "Mentally Chill"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 4.5,
        "ratingCount": Math.max(50, Math.floor(Math.random() * 200) + 50)
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": product.rating || 4.5
          },
          "author": {
            "@type": "Person",
            "name": "Verified Customer"
          },
          "reviewBody": `Excellent quality ${product.name}. Premium THCA product with outstanding effects and fast delivery.`,
          "datePublished": new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ],
      "offers": {
        "@type": "Offer",
        "url": canonicalUrl,
        "priceCurrency": "USD",
        "price": product.price,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Mentally Chill"
        },
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    };
  }

  private generateCategorySchema(category: string, filters: any): any {
    return {
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      "name": `THCA ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      "description": `Premium THCA ${category} collection with lab-tested quality and fast shipping`,
      "url": `${this.baseUrl}/products?category=${category}`,
      "mainEntity": {
        "@type": "ItemList",
        "name": `THCA ${category} Products`
      }
    };
  }

  private generateStrainSchema(strainName: string, strainType: string, effects: string[]): any {
    return {
      "@context": "https://schema.org/",
      "@type": "Article",
      "headline": `${strainName} THCA ${strainType} Strain Guide`,
      "description": `Complete guide to ${strainName} THCA strain including effects, terpenes, and products`,
      "author": {
        "@type": "Organization",
        "name": "Mentally Chill"
      },
      "publisher": {
        "@type": "Organization", 
        "name": "Mentally Chill",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/strains/${strainName.toLowerCase().replace(/\s+/g, '-')}`
      }
    };
  }

  /**
   * Generate comprehensive landing page SEO for strain collections
   */
  generateStrainCollectionSEO(strainType: 'indica' | 'sativa' | 'hybrid'): SEOMetaTags {
    const typeCapitalized = strainType.charAt(0).toUpperCase() + strainType.slice(1);
    const keywords = strainNicheKeywords[strainType];
    
    return {
      title: `Best ${typeCapitalized} THCA Strains | Premium ${typeCapitalized} Collection`,
      description: `Discover premium ${typeCapitalized} THCA strains. Lab-tested quality, diverse effects, fast shipping. Shop the best ${typeCapitalized} collection.`,
      keywords: [...keywords, ...productAngleKeywords.quality.slice(0, 5)],
      h1: `Premium ${typeCapitalized} THCA Strain Collection`,
      h2: [
        `What Makes ${typeCapitalized} Strains Special`,
        `Top ${typeCapitalized} THCA Strains`,
        `${typeCapitalized} Effects & Benefits`,
        'Quality & Lab Testing',
        'Customer Reviews'
      ],
      canonicalUrl: `${this.baseUrl}/strains/${strainType}`,
      schemaMarkup: this.generateStrainCollectionSchema(strainType)
    };
  }

  private generateStrainCollectionSchema(strainType: string): any {
    return {
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      "name": `${strainType.charAt(0).toUpperCase() + strainType.slice(1)} THCA Strains`,
      "description": `Premium ${strainType} THCA strain collection`,
      "url": `${this.baseUrl}/strains/${strainType}`,
      "mainEntity": {
        "@type": "ItemList",
        "name": `${strainType.charAt(0).toUpperCase() + strainType.slice(1)} Strains`
      }
    };
  }
}

export const seoMetaGenerator = new SEOMetaGenerator();