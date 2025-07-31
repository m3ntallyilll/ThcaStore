import { Router } from "express";
import { getStorage } from "../storage";

declare global {
  interface Storage {
    getBlogPosts(): Promise<any[]>;
  }
}

const sitemapRouter = Router();

// Generate XML sitemap for search engines
sitemapRouter.get('/sitemap.xml', async (_req, res) => {
  try {
    const storage = getStorage();
    
    // Get all products for sitemap
    const products = await storage.getProducts();
    // Get blog posts if available (fallback to empty array)
    let blogPosts: any[] = [];
    try {
      if ('getBlogPosts' in storage && typeof storage.getBlogPosts === 'function') {
        blogPosts = await storage.getBlogPosts();
      }
    } catch (error) {
      console.log('Blog posts not available for sitemap');
    }
    
    // Base URLs for the site
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://thcastore.replit.app' 
      : 'http://localhost:5000';
    
    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/rewards</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/daily-deals</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms-of-service</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/returns</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${products.map(product => `
  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
    <lastmod>${product.createdAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  ${blogPosts.map((post: any) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt?.toISOString() || post.createdAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

// Generate robots.txt for search engine crawlers
sitemapRouter.get('/robots.txt', (_req, res) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://thcastore.replit.app' 
    : 'http://localhost:5000';
    
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /checkout

Sitemap: ${baseUrl}/sitemap.xml`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

export default sitemapRouter;