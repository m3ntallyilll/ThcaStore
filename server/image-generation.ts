import { createWriteStream } from 'fs';
import { join } from 'path';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs/promises';

export class ImageGenerator {
  private static instance: ImageGenerator;
  private readonly outputDir = join(process.cwd(), 'client', 'public', 'generated-images');

  private constructor() {
    this.ensureOutputDirectory();
  }

  public static getInstance(): ImageGenerator {
    if (!ImageGenerator.instance) {
      ImageGenerator.instance = new ImageGenerator();
    }
    return ImageGenerator.instance;
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }

  public async generateBlogImage(title: string, category: string): Promise<string> {
    const canvas = createCanvas(1200, 630); // Standard social media image size
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#0f172a'); // dark-900
    gradient.addColorStop(0.5, '#1e293b'); // dark-800
    gradient.addColorStop(1, '#334155'); // dark-700

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Add cannabis leaf pattern (simplified)
    this.addCanvasLeafPattern(ctx, 1200, 630);

    // Add category badge
    const categoryColors = {
      education: '#3b82f6',
      products: '#10b981',
      health: '#8b5cf6',
      legal: '#ef4444',
      lifestyle: '#f59e0b',
      news: '#ec4899',
      guides: '#6366f1'
    };

    const categoryColor = categoryColors[category as keyof typeof categoryColors] || '#6b7280';
    
    // Category badge
    ctx.fillStyle = categoryColor;
    ctx.roundRect(60, 60, 180, 50, 25);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(category.toUpperCase(), 150, 90);

    // Title text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'left';
    
    // Word wrap title
    const words = title.split(' ');
    let line = '';
    let y = 200;
    const maxWidth = 1000;
    const lineHeight = 60;

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && line !== '') {
        ctx.fillText(line, 60, y);
        line = word + ' ';
        y += lineHeight;
        if (y > 450) break; // Prevent overflow
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 60, y);

    // Add THCA branding
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('THCA Store', 1140, 570);

    // Save image
    const fileName = `blog-${Date.now()}-${category}.png`;
    const filePath = join(this.outputDir, fileName);
    
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(filePath, buffer);

    return `/generated-images/${fileName}`;
  }

  private addCanvasLeafPattern(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add subtle cannabis leaf silhouettes
    ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
    
    // Simple leaf shape using paths
    const leafPositions = [
      { x: width - 200, y: height - 150 },
      { x: 100, y: height - 100 },
      { x: width - 150, y: 100 }
    ];

    leafPositions.forEach(pos => {
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.scale(2, 2);
      
      // Simple leaf shape
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.quadraticCurveTo(-15, -20, -20, 0);
      ctx.quadraticCurveTo(-15, 20, 0, 30);
      ctx.quadraticCurveTo(15, 20, 20, 0);
      ctx.quadraticCurveTo(15, -20, 0, -30);
      ctx.fill();
      
      ctx.restore();
    });
  }

  public async generateProductImage(productName: string, strain: string, category: string): Promise<string> {
    const canvas = createCanvas(800, 800);
    const ctx = canvas.getContext('2d');

    // Background
    const gradient = ctx.createRadialGradient(400, 400, 0, 400, 400, 400);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);

    // Add product styling based on category
    const categoryColors = {
      flower: '#10b981',
      edibles: '#f59e0b',
      concentrates: '#8b5cf6',
      vapes: '#06b6d4',
      accessories: '#6b7280'
    };

    const color = categoryColors[category as keyof typeof categoryColors] || '#10b981';

    // Product name
    ctx.fillStyle = color;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(productName, 400, 150);

    // Strain name
    ctx.fillStyle = '#f8fafc';
    ctx.font = '36px Arial';
    ctx.fillText(strain, 400, 200);

    // Add decorative elements
    this.addProductDecorations(ctx, color);

    const fileName = `product-${Date.now()}-${category}.png`;
    const filePath = join(this.outputDir, fileName);
    
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(filePath, buffer);

    return `/generated-images/${fileName}`;
  }

  private addProductDecorations(ctx: CanvasRenderingContext2D, color: string): void {
    // Add circular decorations
    ctx.fillStyle = `${color}33`; // 20% opacity
    
    const circles = [
      { x: 200, y: 400, r: 150 },
      { x: 600, y: 500, r: 120 },
      { x: 400, y: 600, r: 100 }
    ];

    circles.forEach(circle => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}