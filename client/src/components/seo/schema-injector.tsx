import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SchemaInjectorProps {
  postSlug: string;
  postId?: string;
}

export function SchemaInjector({ postSlug, postId }: SchemaInjectorProps) {
  // Fetch blog post data
  const { data: post } = useQuery({
    queryKey: ['/api/blog/post', postSlug],
    queryFn: () => apiRequest(`/api/blog/post/${postSlug}`),
    enabled: !!postSlug
  });

  useEffect(() => {
    if (!post) return;

    // Remove existing schema markup
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => {
      if (script.textContent?.includes('@context')) {
        script.remove();
      }
    });

    // Remove existing meta tags added by previous renders
    const existingMetas = document.querySelectorAll('meta[data-seo-enhanced="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Generate and inject Article schema
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.metaDescription || post.excerpt || generateExcerpt(post.content),
      "image": post.featuredImage || `${window.location.origin}/blog-images/${post.slug}.jpg`,
      "author": {
        "@type": "Person",
        "name": "THCA Store Expert",
        "url": `${window.location.origin}/about`
      },
      "publisher": {
        "@type": "Organization",
        "name": "THCA Store",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        },
        "sameAs": [
          "https://twitter.com/THCAStore",
          "https://facebook.com/THCAStore",
          "https://instagram.com/THCAStore"
        ]
      },
      "datePublished": post.publishedAt || post.createdAt,
      "dateModified": post.updatedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${window.location.origin}/blog/${post.slug}`
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

    // Generate Breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${window.location.origin}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.category,
          "item": `${window.location.origin}/blog/category/${post.category.toLowerCase()}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": post.title,
          "item": `${window.location.origin}/blog/${post.slug}`
        }
      ]
    };

    // Inject schemas
    injectSchema(articleSchema);
    injectSchema(breadcrumbSchema);

    // Update meta tags
    updateMetaTags(post);

    // Generate FAQ schema if content contains Q&A
    generateFAQSchema(post);

  }, [post]);

  return null; // This component doesn't render anything visible
}

function injectSchema(schema: any) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

function updateMetaTags(post: any) {
  const metaTitle = post.metaTitle || post.title;
  const metaDescription = post.metaDescription || generateExcerpt(post.content);
  const imageUrl = post.featuredImage || `${window.location.origin}/blog-images/${post.slug}.jpg`;

  // Update page title
  document.title = metaTitle;

  // Update or create meta description
  updateOrCreateMeta('name', 'description', metaDescription);
  updateOrCreateMeta('name', 'keywords', post.keywords?.join(', ') || 'THCA, hemp, premium cannabis');
  updateOrCreateMeta('name', 'author', 'THCA Store Expert');

  // Open Graph tags
  updateOrCreateMeta('property', 'og:title', metaTitle);
  updateOrCreateMeta('property', 'og:description', metaDescription);
  updateOrCreateMeta('property', 'og:image', imageUrl);
  updateOrCreateMeta('property', 'og:url', `${window.location.origin}/blog/${post.slug}`);
  updateOrCreateMeta('property', 'og:type', 'article');
  updateOrCreateMeta('property', 'og:site_name', 'THCA Store');

  // Twitter Card tags
  updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
  updateOrCreateMeta('name', 'twitter:title', metaTitle);
  updateOrCreateMeta('name', 'twitter:description', metaDescription);
  updateOrCreateMeta('name', 'twitter:image', imageUrl);
  updateOrCreateMeta('name', 'twitter:site', '@THCAStore');

  // Canonical URL
  updateOrCreateLink('canonical', `${window.location.origin}/blog/${post.slug}`);
}

function updateOrCreateMeta(attribute: string, name: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    meta.setAttribute('data-seo-enhanced', 'true');
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

function updateOrCreateLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('data-seo-enhanced', 'true');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
}

function generateExcerpt(content: string, maxLength: number = 160): string {
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

function generateFAQSchema(post: any) {
  const content = post.content.toLowerCase();
  const questionMatches = post.content.match(/<h[3-6][^>]*>([^<]*\?[^<]*)<\/h[3-6]>/gi);
  
  if (!questionMatches || questionMatches.length < 2) return;

  const faqItems = [];
  const contentSections = post.content.split(/<h[3-6][^>]*>/i);
  
  questionMatches.forEach((question, index) => {
    const cleanQuestion = question.replace(/<[^>]*>/g, '').trim();
    if (cleanQuestion.includes('?')) {
      // Find the corresponding answer in the next content section
      const answerSection = contentSections[index + 1];
      if (answerSection) {
        const answer = answerSection.split(/<h[3-6]/)[0]
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 300);
        
        if (answer.length > 20) {
          faqItems.push({
            "@type": "Question",
            "name": cleanQuestion,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer
            }
          });
        }
      }
    }
  });

  if (faqItems.length >= 2) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems
    };
    
    injectSchema(faqSchema);
  }
}