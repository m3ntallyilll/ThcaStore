import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export function CoreWebVitals() {
  useEffect(() => {
    // Largest Contentful Paint (LCP) optimization
    const optimizeLCP = () => {
      // Preload hero images
      const heroImages = [
        '/hero-background.webp',
        '/product-hero.webp'
      ];
      
      heroImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });

      // Optimize font loading for LCP
      const fontPreload = document.createElement('link');
      fontPreload.rel = 'preload';
      fontPreload.href = '/fonts/inter-variable.woff2';
      fontPreload.as = 'font';
      fontPreload.type = 'font/woff2';
      fontPreload.crossOrigin = 'anonymous';
      document.head.appendChild(fontPreload);
    };

    // Interaction to Next Paint (INP) optimization
    const optimizeINP = () => {
      // Use passive event listeners
      const addPassiveListeners = () => {
        const events = ['touchstart', 'touchmove', 'wheel', 'scroll'];
        events.forEach(event => {
          document.addEventListener(event, () => {}, { passive: true });
        });
      };

      // Minimize main thread work
      const optimizeMainThread = () => {
        // Break up long tasks
        if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
          (window as any).scheduler.postTask(() => {
            // Non-critical initialization
          }, { priority: 'background' });
        } else {
          setTimeout(() => {
            // Fallback for non-critical work
          }, 0);
        }
      };

      addPassiveListeners();
      optimizeMainThread();
    };

    // Cumulative Layout Shift (CLS) optimization  
    const optimizeCLS = () => {
      // Set image dimensions to prevent layout shift
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach(img => {
        const imgElement = img as HTMLImageElement;
        if (!imgElement.width && !imgElement.height) {
          imgElement.style.aspectRatio = '16/9'; // Default aspect ratio
        }
      });

      // Reserve space for dynamic content
      const dynamicElements = document.querySelectorAll('[data-dynamic]');
      dynamicElements.forEach(el => {
        const element = el as HTMLElement;
        if (!element.style.minHeight) {
          element.style.minHeight = '200px'; // Prevent layout shift
        }
      });

      // Optimize web font loading
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'Inter';
          font-display: swap;
          src: url('/fonts/inter-variable.woff2') format('woff2-variations');
        }
        
        /* Prevent layout shift during font loading */
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Size container to prevent shifts */
        .product-grid {
          min-height: 400px;
        }
        
        .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `;
      document.head.appendChild(style);
    };

    // Initialize optimizations
    optimizeLCP();
    optimizeINP();
    optimizeCLS();

    // Observe and report Core Web Vitals
    const observeWebVitals = () => {
      // Log web vitals for monitoring and debugging
      const sendToAnalytics = (metric: any) => {
        console.log('Core Web Vital:', metric.name, metric.value, metric.rating);
        
        // In production, you might want to send this to Google Analytics
        // or another analytics service
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
          });
        }
      };

      // Monitor Core Web Vitals
      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    };

    // Initialize web vitals monitoring
    observeWebVitals();

  }, []);

  return null;
}