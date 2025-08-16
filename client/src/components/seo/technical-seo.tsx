import { Helmet } from 'react-helmet-async';

interface TechnicalSEOProps {
  pageType: 'homepage' | 'products' | 'article' | 'state' | 'faq';
  customMeta?: Record<string, any>;
}

export function TechnicalSEO({ pageType, customMeta = {} }: TechnicalSEOProps) {
  const generateTechnicalMeta = () => {
    const baseMeta = {
      // Core Web Vitals optimization
      'viewport': 'width=device-width,initial-scale=1,viewport-fit=cover',
      'theme-color': '#10b981',
      'color-scheme': 'dark light',
      
      // Performance hints
      'dns-prefetch': ['//fonts.googleapis.com', '//www.google-analytics.com'],
      'preconnect': ['https://mentally-chill.online'],
      
      // Security headers
      'referrer': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:",
      
      // Mobile optimization
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      
      // SEO technical
      'robots': 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
      'googlebot': 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
      
      // Rich snippets
      'application-name': 'Mentally Chill THCA Store',
      'apple-mobile-web-app-title': 'THCA Store',
      'msapplication-TileColor': '#10b981',
      'msapplication-config': '/browserconfig.xml',
      
      // Language and locale
      'language': 'en-US',
      'geo.region': 'US',
      'geo.placename': 'United States',
      
      // Business info
      'business:contact_data:street_address': 'Nationwide Shipping',
      'business:contact_data:locality': 'United States',
      'business:contact_data:country_name': 'USA',
      'business:hours:day': 'sunday,monday,tuesday,wednesday,thursday,friday,saturday',
      'business:hours:start': '00:00',
      'business:hours:end': '23:59',
      
      ...customMeta
    };

    switch (pageType) {
      case 'homepage':
        return {
          ...baseMeta,
          'og:type': 'website',
          'og:locale': 'en_US',
          'twitter:card': 'summary_large_image',
          'article:publisher': 'https://www.facebook.com/mentallychill',
          'format-detection': 'telephone=yes',
        };

      case 'products':
        return {
          ...baseMeta,
          'og:type': 'product.group',
          'product:price:currency': 'USD',
          'product:availability': 'in stock',
          'product:category': 'Hemp Products',
          'product:brand': 'Mentally Chill',
        };

      case 'article':
        return {
          ...baseMeta,
          'og:type': 'article',
          'article:author': 'THCA Expert Team',
          'article:publisher': 'Mentally Chill',
          'article:section': 'Hemp Education',
        };

      case 'state':
        return {
          ...baseMeta,
          'og:type': 'place',
          'place:location:latitude': customMeta.latitude || '',
          'place:location:longitude': customMeta.longitude || '',
        };

      case 'faq':
        return {
          ...baseMeta,
          'og:type': 'website',
          'article:section': 'FAQ',
        };

      default:
        return baseMeta;
    }
  };

  const technicalMeta = generateTechnicalMeta();

  return (
    <Helmet>
      {/* Viewport and mobile optimization */}
      <meta name="viewport" content={technicalMeta.viewport} />
      <meta name="theme-color" content={technicalMeta['theme-color']} />
      <meta name="color-scheme" content={technicalMeta['color-scheme']} />
      
      {/* Performance optimization */}
      {technicalMeta['dns-prefetch'].map((url: string, index: number) => (
        <link key={`dns-${index}`} rel="dns-prefetch" href={url} />
      ))}
      {technicalMeta['preconnect'].map((url: string, index: number) => (
        <link key={`preconnect-${index}`} rel="preconnect" href={url} />
      ))}
      
      {/* Security and robots */}
      <meta name="referrer" content={technicalMeta.referrer} />
      <meta name="robots" content={technicalMeta.robots} />
      <meta name="googlebot" content={technicalMeta.googlebot} />
      
      {/* Mobile app integration */}
      <meta name="mobile-web-app-capable" content={technicalMeta['mobile-web-app-capable']} />
      <meta name="apple-mobile-web-app-capable" content={technicalMeta['apple-mobile-web-app-capable']} />
      <meta name="apple-mobile-web-app-status-bar-style" content={technicalMeta['apple-mobile-web-app-status-bar-style']} />
      <meta name="application-name" content={technicalMeta['application-name']} />
      <meta name="apple-mobile-web-app-title" content={technicalMeta['apple-mobile-web-app-title']} />
      
      {/* Business and location info */}
      <meta name="language" content={technicalMeta.language} />
      <meta name="geo.region" content={technicalMeta['geo.region']} />
      <meta name="geo.placename" content={technicalMeta['geo.placename']} />
      
      {/* Microsoft tiles */}
      <meta name="msapplication-TileColor" content={technicalMeta['msapplication-TileColor']} />
      <meta name="msapplication-config" content={technicalMeta['msapplication-config']} />
      
      {/* Additional page-specific meta tags */}
      {Object.entries(technicalMeta).map(([key, value]) => {
        if (typeof value === 'string' && !['viewport', 'theme-color', 'color-scheme', 'referrer', 'robots', 'googlebot', 'mobile-web-app-capable', 'apple-mobile-web-app-capable', 'apple-mobile-web-app-status-bar-style', 'application-name', 'apple-mobile-web-app-title', 'language', 'geo.region', 'geo.placename', 'msapplication-TileColor', 'msapplication-config', 'dns-prefetch', 'preconnect'].includes(key)) {
          if (key.startsWith('og:') || key.startsWith('twitter:') || key.startsWith('article:') || key.startsWith('product:') || key.startsWith('business:') || key.startsWith('place:')) {
            return <meta key={key} property={key} content={value} />;
          }
          return <meta key={key} name={key} content={value} />;
        }
        return null;
      })}
      
      {/* Structured Data for Technical SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Mentally Chill",
          "url": "https://mentally-chill.online",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://mentally-chill.online/products?search={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "mainEntity": {
            "@type": "Organization",
            "name": "Mentally Chill",
            "url": "https://mentally-chill.online",
            "logo": "https://mentally-chill.online/logo.png",
            "sameAs": [
              "https://www.instagram.com/mentallychill",
              "https://twitter.com/mentallychill"
            ]
          }
        })}
      </script>
    </Helmet>
  );
}