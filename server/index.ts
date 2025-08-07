import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json({ 
  limit: '10mb'
}));

// Add JSON error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    console.error('JSON Parse Error:', err.message);
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  next(err);
});
app.use(express.urlencoded({ extended: false }));

// Bot-friendly middleware - no restrictions for crawlers
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Set bot-friendly headers
  res.setHeader('X-Robots-Tag', 'index, follow, all');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for bots
  
  // Allow all crawlers access
  const userAgent = req.get('User-Agent') || '';
  const isBot = /bot|crawler|spider|scraper|crawling|facebookexternalhit|twitterbot|linkedinbot|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|whatsapp/i.test(userAgent);
  
  if (isBot) {
    // Extra welcoming headers for bots
    res.setHeader('X-Bot-Welcome', 'true');
    res.setHeader('X-Crawl-Friendly', 'maximum-access');
  }

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Add static file serving for assets
  app.use('/src/assets', express.static('client/src/assets'));
  
  // Serve robots.txt
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /

# Allow all search engines to crawl the entire site
Sitemap: https://mentally-chill.online/sitemap.xml

# Allow crawling of CSS, JS and asset files for better rendering
Allow: /src/
Allow: /assets/
Allow: *.css
Allow: *.js
Allow: *.png
Allow: *.jpg
Allow: *.jpeg
Allow: *.webp

# Allow important pages
Allow: /products
Allow: /blog
Allow: /about
Allow: /contact
Allow: /admin

# Crawl delay for respectful crawling
Crawl-delay: 1`);
  });

  // Serve sitemap.xml with state pages
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    
    const stateKeywords = {
      california: true, oregon: true, washington: true, nevada: true, arizona: true, newmexico: true,
      texas: true, oklahoma: true, arkansas: true, illinois: true, michigan: true, ohio: true,
      minnesota: true, wisconsin: true, colorado: true, utah: true, montana: true, newyork: true,
      newjersey: true, massachusetts: true, connecticut: true, vermont: true, florida: true,
      georgia: true, northcarolina: true, southcarolina: true, tennessee: true
    };
    
    const stateUrls = Object.keys(stateKeywords).map(state => `
  <url>
    <loc>https://mentally-chill.online/thca/${state}</loc>
    <lastmod>2025-08-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
    
    // City-specific THCA landing pages
    const cityUrls = [
      'thca-los-angeles-california',
      'thca-denver-colorado', 
      'thca-portland-oregon',
      'thca-seattle-washington',
      'thca-las-vegas-nevada'
    ].map(city => `
  <url>
    <loc>https://mentally-chill.online/${city}</loc>
    <lastmod>2025-08-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');
    
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mentally-chill.online/</loc>
    <lastmod>2025-08-06</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mentally-chill.online/products</loc>
    <lastmod>2025-08-06</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://mentally-chill.online/blog</loc>
    <lastmod>2025-08-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mentally-chill.online/thca</loc>
    <lastmod>2025-08-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>${stateUrls}${cityUrls}
  <url>
    <loc>https://mentally-chill.online/about</loc>
    <lastmod>2025-08-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://mentally-chill.online/contact</loc>
    <lastmod>2025-08-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`);
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
