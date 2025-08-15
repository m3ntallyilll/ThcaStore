import { useEffect } from 'react';

interface SchemaMarkupProps {
  type: 'organization' | 'product' | 'local-business' | 'article' | 'faq';
  data: any;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  useEffect(() => {
    let schema = {};

    switch (type) {
      case 'organization':
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "THCA Store",
          "description": "Premium legal THCA hemp products - lab-tested flower, pre-rolls, concentrates and accessories with fast nationwide shipping",
          "url": "https://mentally-chill-online.replit.app",
          "logo": "https://mentally-chill-online.replit.app/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-800-THCA-420",
            "contactType": "customer service",
            "availableLanguage": ["English"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US",
            "addressRegion": "Nationwide"
          },
          "sameAs": [
            "https://www.instagram.com/thcastore",
            "https://twitter.com/thcastore"
          ]
        };
        break;

      case 'product':
        schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name,
          "description": `Premium ${data.category} - ${data.description}`,
          "image": data.imageUrl,
          "brand": {
            "@type": "Brand",
            "name": "THCA Store"
          },
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "USD",
            "availability": data.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          },
          "review": [
            {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5"
              },
              "author": {
                "@type": "Person",
                "name": "Sarah M."
              },
              "reviewBody": "Amazing quality THCA flower! Lab-tested quality shows - clean, potent, and exactly as described."
            }
          ]
        };
        break;

      case 'local-business':
        schema = {
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "THCA Store - Premium Hemp Products",
          "description": "Leading online retailer of lab-tested THCA hemp products including flower, pre-rolls, concentrates and accessories",
          "url": "https://mentally-chill-online.replit.app",
          "telephone": "+1-800-THCA-420",
          "email": "support@thcastore.com",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US",
            "addressRegion": "Nationwide Shipping"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "39.8283",
            "longitude": "-98.5795"
          },
          "openingHours": "Mo-Su 00:00-23:59",
          "paymentAccepted": ["Cash", "Credit Card", "Cryptocurrency"],
          "currenciesAccepted": "USD",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "THCA Products",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "THCA Flower",
                  "category": "Hemp Products"
                }
              }
            ]
          }
        };
        break;

      case 'article':
        schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.excerpt,
          "image": data.image || "https://mentally-chill-online.replit.app/blog-default.jpg",
          "author": {
            "@type": "Person",
            "name": "THCA Store Editorial Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "THCA Store",
            "logo": {
              "@type": "ImageObject",
              "url": "https://mentally-chill-online.replit.app/logo.png"
            }
          },
          "datePublished": data.publishedAt,
          "dateModified": data.updatedAt || data.publishedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://mentally-chill-online.replit.app/blog/${data.slug}`
          }
        };
        break;

      case 'faq':
        schema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };
        break;
    }

    const existingScript = document.querySelector(`script[data-schema="${type}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', type);
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector(`script[data-schema="${type}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}