import { Helmet } from 'react-helmet-async';

interface AdvancedSchemaProps {
  pageType: 'homepage' | 'products' | 'article' | 'state' | 'faq';
  pageData?: any;
  stateInfo?: any;
}

export function AdvancedSchema({ pageType, pageData, stateInfo }: AdvancedSchemaProps) {
  const generateSchema = () => {
    const baseOrganization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Mentally Chill",
      "alternateName": "THCA Store",
      "description": "Premium lab-tested THCA hemp products with fast nationwide shipping. Legal hemp-derived flower, diamonds, and pre-rolls with 99.8% success rate.",
      "url": "https://mentally-chill.online",
      "logo": "https://mentally-chill.online/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-THCA-420",
        "contactType": "customer service",
        "areaServed": "US",
        "availableLanguage": ["English"],
        "serviceType": "Hemp Products Sales"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressRegion": "Nationwide Shipping"
      },
      "foundingDate": "2024",
      "legalName": "Mentally Chill LLC",
      "sameAs": [
        "https://www.instagram.com/mentallychill",
        "https://twitter.com/mentallychill",
        "https://www.facebook.com/mentallychill"
      ]
    };

    switch (pageType) {
      case 'homepage':
        return {
          "@context": "https://schema.org",
          "@graph": [
            baseOrganization,
            {
              "@type": "WebSite",
              "name": "Mentally Chill - Premium THCA Products",
              "url": "https://mentally-chill.online",
              "description": "Buy premium lab-tested THCA products online. Legal hemp-derived flower, diamonds, and pre-rolls with fast nationwide shipping.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://mentally-chill.online/products?search={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": baseOrganization
            },
            {
              "@type": "LocalBusiness",
              "name": "Mentally Chill THCA Store",
              "description": "Premium THCA hemp products with lab testing and fast shipping",
              "telephone": "+1-800-THCA-420",
              "url": "https://mentally-chill.online",
              "areaServed": "United States",
              "paymentAccepted": ["Credit Card", "Debit Card", "Cash App"],
              "priceRange": "$15-$200",
              "openingHours": "Mo-Su 24:00",
              "serviceType": "Hemp Product Retail"
            }
          ]
        };

      case 'products':
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Premium THCA Products Collection",
          "description": "Shop premium THCA flower, diamonds, and concentrates. Lab-tested, legal, fast shipping. Multiple strains available with COA included.",
          "url": "https://mentally-chill.online/products",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://mentally-chill.online"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": "https://mentally-chill.online/products"
              }
            ]
          }
        };

      case 'state':
        return stateInfo ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `Buy Legal THCA in ${stateInfo.name} - Premium Hemp Products`,
          "description": `Buy legal THCA in ${stateInfo.name} - premium hemp products with fast delivery. Lab-tested flower, diamonds, and concentrates available.`,
          "url": `https://mentally-chill.online/thca/${stateInfo.code.toLowerCase()}`,
          "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `Is THCA legal in ${stateInfo.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Yes, THCA hemp products are legal in ${stateInfo.name} under the 2018 Farm Bill. Our products contain less than 0.3% Delta-9 THC and are fully compliant with federal regulations.`
                }
              },
              {
                "@type": "Question", 
                "name": `How fast is THCA delivery in ${stateInfo.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `We offer ${stateInfo.shippingTime} shipping to ${stateInfo.name} with discreet packaging and tracking included.`
                }
              }
            ]
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://mentally-chill.online"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "State Info",
                "item": "https://mentally-chill.online/state-by-state-thca-legal"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": stateInfo.name,
                "item": `https://mentally-chill.online/thca/${stateInfo.code.toLowerCase()}`
              }
            ]
          }
        } : {};

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is THCA and how is it different from THC?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "THCA (Tetrahydrocannabinolic Acid) is the non-psychoactive precursor to THC found in raw cannabis. Unlike THC, THCA doesn't produce intoxicating effects until heated through decarboxylation."
              }
            },
            {
              "@type": "Question",
              "name": "Are THCA products legal nationwide?", 
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, THCA hemp products containing less than 0.3% Delta-9 THC are federally legal under the 2018 Farm Bill. Our products are lab-tested to ensure compliance."
              }
            },
            {
              "@type": "Question",
              "name": "How fast do you ship THCA products?",
              "acceptedAnswer": {
                "@type": "Answer", 
                "text": "We offer 1-3 day shipping nationwide with discreet packaging. Orders placed before 2 PM ship same day with tracking included."
              }
            }
          ]
        };

      case 'article':
        return pageData ? {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": pageData.title,
          "description": pageData.description,
          "image": pageData.image || "https://mentally-chill.online/social-thumbnail.png",
          "author": {
            "@type": "Person",
            "name": "THCA Expert Team"
          },
          "publisher": baseOrganization,
          "datePublished": pageData.datePublished || new Date().toISOString(),
          "dateModified": pageData.dateModified || new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": pageData.url
          }
        } : {};

      default:
        return baseOrganization;
    }
  };

  const schema = generateSchema();

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}