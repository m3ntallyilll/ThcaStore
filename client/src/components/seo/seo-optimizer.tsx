import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  product?: {
    name: string;
    price: string;
    availability?: string;
    brand?: string;
    category?: string;
    description?: string;
    image?: string;
    rating?: number;
    reviewCount?: number;
  };
}

export function SEOOptimizer({
  title = 'Premium THCA Hemp Products | Lab-Tested & Legal | 150+ Happy Customers',
  description = 'Buy premium lab-tested THCA products online. 150+ happy customers, 117 products available. Legal hemp-derived flower, diamonds, and pre-rolls with 99.8% success rate.',
  keywords = [],
  image = '/viral-social-image.svg',
  url,
  type = 'website',
  product,
}: SEOOptimizerProps) {
  useEffect(() => {
    // Performance optimizations
    const optimizeImages = () => {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        
        // Add explicit dimensions if missing
        const imgElement = img as HTMLImageElement;
        if (!imgElement.width && !imgElement.height && imgElement.naturalWidth) {
          imgElement.width = imgElement.naturalWidth;
          imgElement.height = imgElement.naturalHeight;
        }
        
        // Add aspect ratio for CLS optimization
        if (!imgElement.style.aspectRatio && imgElement.naturalWidth && imgElement.naturalHeight) {
          imgElement.style.aspectRatio = `${imgElement.naturalWidth}/${imgElement.naturalHeight}`;
        }
      });
    };

    // Optimize fonts
    const optimizeFonts = () => {
      const fontPreload = document.createElement('link');
      fontPreload.rel = 'preload';
      fontPreload.href = '/fonts/inter-variable.woff2';
      fontPreload.as = 'font';
      fontPreload.type = 'font/woff2';
      fontPreload.crossOrigin = 'anonymous';
      
      if (!document.querySelector('link[href*="inter-variable"]')) {
        document.head.appendChild(fontPreload);
      }
    };

    // Preconnect to external domains
    const addPreconnects = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com'
      ];
      
      domains.forEach(domain => {
        if (!document.querySelector(`link[href="${domain}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          document.head.appendChild(link);
        }
      });
    };

    // Search bot detection and optimization
    const optimizeForBots = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(userAgent);
      
      if (isBot) {
        // Remove age verification for bots
        const ageModal = document.querySelector('.age-verification-modal');
        if (ageModal) {
          (ageModal as HTMLElement).style.display = 'none';
        }
        
        // Ensure all content is visible
        document.body.classList.add('bot-visitor');
      }
    };

    // Initialize optimizations
    optimizeImages();
    optimizeFonts();
    addPreconnects();
    optimizeForBots();

    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
          let cls = 0;
          entryList.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          });
          console.log('CLS:', cls);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.error('Performance monitoring error:', e);
      }
    }
  }, []);

  // Build structured data
  const structuredData = [];

  // Organization schema
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mentally-Chill THCA Store",
    "url": "https://mentally-chill.online",
    "logo": "https://mentally-chill.online/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "702-482-9794",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://mentally-chill.online/blog",
      "https://mentally-chill.online/products"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": "150"
    }
  });

  // Product schema if product data provided
  if (product) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || description,
      "image": product.image || image,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Mentally-Chill"
      },
      "category": product.category || "THCA Products",
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "USD",
        "availability": product.availability || "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Mentally-Chill THCA Store"
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating.toString(),
        "reviewCount": product.reviewCount?.toString() || "150"
      } : undefined
    });
  }

  // FAQ Schema
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is THCA legal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, THCA is federally legal under the 2018 Farm Bill when derived from hemp containing less than 0.3% Delta-9 THC. However, some states have restrictions."
        }
      },
      {
        "@type": "Question",
        "name": "What are the benefits of THCA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "THCA offers potential anti-inflammatory, neuroprotective, and anti-emetic properties without psychoactive effects when consumed raw."
        }
      },
      {
        "@type": "Question",
        "name": "How is THCA different from THC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "THCA is the non-psychoactive precursor to THC. It converts to THC when heated through decarboxylation."
        }
      }
    ]
  });

  // Breadcrumb schema
  const pathname = window.location.pathname;
  if (pathname !== '/') {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbItems = pathSegments.map((segment, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      "item": `https://mentally-chill.online/${pathSegments.slice(0, index + 1).join('/')}`
    }));

    structuredData.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mentally-chill.online"
        },
        ...breadcrumbItems
      ]
    });
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}
        
        {/* Enhanced Meta Tags for SEO */}
        <meta name="author" content="Mentally-Chill THCA Store" />
        <meta name="copyright" content="2025 Mentally-Chill" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="language" content="EN" />
        <meta name="revisit-after" content="1 days" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`https://mentally-chill.online${image}`} />
        <meta property="og:image:secure_url" content={`https://mentally-chill.online${image}`} />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Premium THCA Hemp Products - Lab-Tested Quality - Mentally Chill Store" />
        <meta property="og:url" content={url || window.location.href} />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content="Mentally-Chill THCA Store" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`https://mentally-chill.online${image}`} />
        <meta name="twitter:image:alt" content="Premium THCA Hemp Products - Lab-Tested Quality - Mentally Chill Store" />
        <meta name="twitter:site" content="@MentallyChill" />
        <meta name="twitter:creator" content="@MentallyChill" />
        
        {/* Single Canonical URL - conditional to prevent duplicates */}
        {url && <link rel="canonical" href={url} />}
        {!url && typeof window !== 'undefined' && <link rel="canonical" href={window.location.href} />}
        
        {/* Structured Data */}
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        
        {/* Alternate hreflang tags */}
        <link rel="alternate" hrefLang="en-us" href="https://mentally-chill.online/" />
        <link rel="alternate" hrefLang="en" href="https://mentally-chill.online/" />
      </Helmet>
      
      {/* Accessibility Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-white text-black p-2 z-50">
        Skip to main content
      </a>
    </>
  );
}