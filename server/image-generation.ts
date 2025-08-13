import { join } from 'path';
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
    
    // Create SVG content
    const svgContent = this.createBlogSVG(title, category, categoryColor);
    
    // Save as SVG file
    const fileName = `blog-${Date.now()}-${category}.svg`;
    const filePath = join(this.outputDir, fileName);
    
    await fs.writeFile(filePath, svgContent);
    
    return `/generated-images/${fileName}`;
  }

  private createBlogSVG(title: string, category: string, categoryColor: string): string {
    // Split title into lines for better display
    const words = title.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      if (currentLine.length + word.length + 1 <= 40) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    // Limit to 3 lines maximum
    const displayLines = lines.slice(0, 3);
    
    const titleElements = displayLines.map((line, index) => 
      `<text x="60" y="${200 + (index * 60)}" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">${this.escapeXml(line)}</text>`
    ).join('\n    ');

    return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  
  <!-- Cannabis leaf decorations -->
  <g opacity="0.1" fill="${categoryColor}">
    <path d="M1050 500 Q1030 480 1020 500 Q1030 520 1050 500 Q1070 480 1080 500 Q1070 520 1050 500 M1050 480 L1050 520" transform="scale(2)"/>
    <path d="M150 550 Q130 530 120 550 Q130 570 150 550 Q170 530 180 550 Q170 570 150 550 M150 530 L150 570" transform="scale(1.5)"/>
    <path d="M1000 150 Q980 130 970 150 Q980 170 1000 150 Q1020 130 1030 150 Q1020 170 1000 150 M1000 130 L1000 170"/>
  </g>
  
  <!-- Category badge -->
  <rect x="60" y="60" width="180" height="50" rx="25" fill="${categoryColor}"/>
  <text x="150" y="90" fill="white" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${category.toUpperCase()}</text>
  
  <!-- Title -->
  ${titleElements}
  
  <!-- THCA Store branding -->
  <text x="1140" y="570" fill="${categoryColor}" text-anchor="end" font-family="Arial, sans-serif" font-size="24" font-weight="bold" filter="url(#glow)">THCA Store</text>
  
  <!-- Cannabis leaf logo -->
  <g transform="translate(1080, 540)" fill="${categoryColor}" opacity="0.7">
    <path d="M0 -15 Q-8 -10 -10 0 Q-8 10 0 15 Q8 10 10 0 Q8 -10 0 -15 M0 -15 L0 15"/>
  </g>
</svg>`;
  }

  public async generateProductImage(productName: string, strain: string, category: string): Promise<string> {
    const categoryColors = {
      flower: '#10b981',
      edibles: '#f59e0b',
      concentrates: '#8b5cf6',
      vapes: '#06b6d4',
      accessories: '#6b7280'
    };

    const color = categoryColors[category as keyof typeof categoryColors] || '#10b981';
    
    const svgContent = this.createProductSVG(productName, strain, category, color);
    
    const fileName = `product-${Date.now()}-${category}.svg`;
    const filePath = join(this.outputDir, fileName);
    
    await fs.writeFile(filePath, svgContent);
    
    return `/generated-images/${fileName}`;
  }

  private createProductSVG(productName: string, strain: string, category: string, color: string): string {
    return `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="productBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="800" fill="url(#productBg)"/>
  
  <!-- Decorative circles -->
  <circle cx="200" cy="400" r="150" fill="${color}" opacity="0.1"/>
  <circle cx="600" cy="500" r="120" fill="${color}" opacity="0.15"/>
  <circle cx="400" cy="600" r="100" fill="${color}" opacity="0.2"/>
  
  <!-- Product name -->
  <text x="400" y="150" fill="${color}" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold">${this.escapeXml(productName)}</text>
  
  <!-- Strain name -->
  <text x="400" y="200" fill="white" text-anchor="middle" font-family="Arial, sans-serif" font-size="36">${this.escapeXml(strain)}</text>
  
  <!-- Category -->
  <text x="400" y="700" fill="${color}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" opacity="0.7">${category.toUpperCase()}</text>
</svg>`;
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&#39;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}