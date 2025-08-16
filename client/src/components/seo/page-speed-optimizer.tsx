import { useEffect } from 'react';

export function PageSpeedOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      '/fonts/inter.woff2',
      '/critical.css'
    ];

    preloadLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = href.includes('.woff2') ? 'font' : 'style';
      if (href.includes('.woff2')) {
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });

    // Optimize images with lazy loading
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });

    // Add resource hints
    const resourceHints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      { rel: 'preconnect', href: 'https://mentally-chill.online' }
    ];

    resourceHints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      document.head.appendChild(link);
    });

    // Optimize third-party scripts
    const optimizeScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[src]:not([defer]):not([async])') as NodeListOf<HTMLScriptElement>;
      scripts.forEach(script => {
        if (!script.src.includes('critical') && !script.src.includes('analytics')) {
          script.setAttribute('defer', '');
        }
      });
    };

    optimizeScripts();

    // Critical rendering path optimization
    const style = document.createElement('style');
    style.textContent = `
      /* Critical CSS for above-the-fold content */
      .hero-section { display: block; }
      .nav-header { display: flex; }
      
      /* Prevent layout shift */
      img { 
        height: auto; 
        max-width: 100%;
      }
      
      /* Optimize font loading */
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: url('/fonts/inter.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);

  }, []);

  return null;
}