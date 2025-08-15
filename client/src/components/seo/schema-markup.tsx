import { Helmet } from 'react-helmet-async';

interface SchemaMarkupProps {
  type: 'organization' | 'product' | 'article' | 'faq' | 'review';
  data: any;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const generateSchema = () => {
    const baseUrl = window.location.origin;
    
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Mentally-Chill",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "description": "Premium THCA products with lab-tested quality and fast nationwide shipping",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@mentally-chill.com"
          },
          "sameAs": [
            "https://twitter.com/mentallychill",
            "https://facebook.com/mentallychill",
            "https://instagram.com/mentallychill"
          ]
        };

      case 'product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name,
          "description": data.description,
          "image": data.imageUrl,
          "brand": {
            "@type": "Brand",
            "name": "Mentally-Chill"
          },
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "USD",
            "availability": data.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "Mentally-Chill"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": data.rating || "4.8",
            "reviewCount": data.reviewCount || "150"
          },
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "THCA Content",
              "value": "High potency"
            },
            {
              "@type": "PropertyValue",
              "name": "Lab Tested",
              "value": "Yes"
            },
            {
              "@type": "PropertyValue",
              "name": "Hemp Derived",
              "value": "Yes"
            }
          ]
        };

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "author": {
            "@type": "Person",
            "name": "THCA Expert Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Mentally-Chill",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          "datePublished": data.datePublished || new Date().toISOString(),
          "dateModified": data.dateModified || new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          }
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.questions.map((q: any) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          }))
        };

      case 'review':
        return {
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "Product",
            "name": data.productName
          },
          "author": {
            "@type": "Person",
            "name": data.authorName
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": data.rating,
            "bestRating": "5"
          },
          "reviewBody": data.reviewText,
          "datePublished": data.datePublished
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}