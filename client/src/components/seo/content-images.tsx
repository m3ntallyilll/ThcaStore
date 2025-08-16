import { motion } from 'framer-motion';
import { Shield, Award, Truck, CheckCircle } from 'lucide-react';

interface ContentImageProps {
  type: 'hero' | 'feature' | 'trust' | 'process';
  className?: string;
}

export function ContentImages({ type, className = '' }: ContentImageProps) {
  const generateSVG = (type: string, width = 400, height = 300) => {
    const svgContent = {
      hero: `
        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#059669;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrad)" opacity="0.1"/>
          <circle cx="100" cy="75" r="40" fill="#10b981" opacity="0.6"/>
          <circle cx="300" cy="150" r="60" fill="#059669" opacity="0.4"/>
          <circle cx="200" cy="225" r="30" fill="#047857" opacity="0.7"/>
          <path d="M50 250 Q200 100 350 250" stroke="#10b981" stroke-width="3" fill="none" opacity="0.8"/>
          <text x="50%" y="50%" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#10b981">Premium THCA</text>
          <text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#047857">Lab-Tested Quality</text>
        </svg>
      `,
      feature: `
        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="featureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#featureGrad)" opacity="0.1"/>
          <polygon points="200,50 250,100 200,150 150,100" fill="#fbbf24" opacity="0.8"/>
          <circle cx="100" cy="200" r="25" fill="#f59e0b"/>
          <circle cx="300" cy="200" r="25" fill="#f59e0b"/>
          <rect x="175" y="175" width="50" height="50" fill="#fbbf24" opacity="0.6"/>
          <text x="50%" y="85%" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">Premium Features</text>
        </svg>
      `,
      trust: `
        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#trustGrad)" opacity="0.1"/>
          <path d="M200 50 L250 100 L200 200 L150 100 Z" fill="#3b82f6" opacity="0.8"/>
          <circle cx="200" cy="125" r="15" fill="#ffffff"/>
          <path d="M190 125 L197 132 L210 115" stroke="#3b82f6" stroke-width="3" fill="none"/>
          <text x="50%" y="85%" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1d4ed8">Trusted & Secure</text>
        </svg>
      `,
      process: `
        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#processGrad)" opacity="0.1"/>
          <circle cx="80" cy="150" r="20" fill="#8b5cf6"/>
          <circle cx="200" cy="150" r="20" fill="#8b5cf6"/>
          <circle cx="320" cy="150" r="20" fill="#8b5cf6"/>
          <line x1="100" y1="150" x2="180" y2="150" stroke="#8b5cf6" stroke-width="3"/>
          <line x1="220" y1="150" x2="300" y2="150" stroke="#8b5cf6" stroke-width="3"/>
          <text x="80" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#7c3aed">Order</text>
          <text x="200" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#7c3aed">Process</text>
          <text x="320" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#7c3aed">Ship</text>
        </svg>
      `
    };

    return `data:image/svg+xml;base64,${btoa(svgContent[type as keyof typeof svgContent] || svgContent.hero)}`;
  };

  const imageData: Record<string, { src: string; alt: string; title: string }> = {
    hero: {
      src: generateSVG('hero', 600, 400),
      alt: 'Premium THCA Hemp Products - Lab-Tested Quality Assurance - Cannabis Leaf Design',
      title: 'Premium THCA Products'
    },
    feature: {
      src: generateSVG('feature', 400, 300),
      alt: 'THCA Product Features - Premium Quality Diamond Pattern Design',
      title: 'Premium Features'
    },
    trust: {
      src: generateSVG('trust', 400, 300),
      alt: 'Trusted THCA Store - Security Shield with Checkmark - Verified Quality',
      title: 'Trusted & Secure'
    },
    process: {
      src: generateSVG('process', 400, 300),
      alt: 'THCA Order Process - Three Step Shopping Process - Order, Process, Ship',
      title: 'Simple Process'
    }
  };

  const currentImage = imageData[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative ${className}`}
    >
      <img
        src={currentImage.src}
        alt={currentImage.alt}
        title={currentImage.title}
        className="w-full h-auto rounded-lg shadow-lg"
        loading="lazy"
        width="400"
        height="300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
    </motion.div>
  );
}

// Trust indicators with images
export function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: 'Lab-Tested',
      description: 'COA Included',
      color: 'text-blue-400'
    },
    {
      icon: Award,
      title: '99.8% Success',
      description: '150+ Reviews',
      color: 'text-green-400'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free Over $50',
      color: 'text-orange-400'
    },
    {
      icon: CheckCircle,
      title: 'Legal Hemp',
      description: '2018 Farm Bill',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12">
      {indicators.map((indicator, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center glass rounded-xl p-4"
        >
          <ContentImages type="trust" className="w-16 h-16 mx-auto mb-3" />
          <indicator.icon className={`w-8 h-8 mx-auto mb-2 ${indicator.color}`} />
          <h3 className="font-semibold text-white mb-1">{indicator.title}</h3>
          <p className="text-sm text-gray-300">{indicator.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Process steps with images
export function ProcessSteps() {
  const steps = [
    {
      step: 1,
      title: 'Browse & Select',
      description: 'Choose from 117+ premium THCA products',
      image: 'feature'
    },
    {
      step: 2,
      title: 'Secure Checkout',
      description: 'Safe payment with Cash App Pay or card',
      image: 'trust'
    },
    {
      step: 3,
      title: 'Fast Delivery',
      description: 'Discreet shipping to your door',
      image: 'process'
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 my-16">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <ContentImages 
              type={step.image as any} 
              className="w-24 h-24 mx-auto" 
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold">
              {step.step}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
          <p className="text-gray-300">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}