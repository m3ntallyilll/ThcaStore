import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate WebP source if possible
  const getOptimizedSrc = () => {
    // If it's already a WebP or SVG, use as is
    if (src.endsWith('.webp') || src.endsWith('.svg')) {
      return src;
    }
    
    // For product images, use WebP format
    if (src.includes('product') || src.includes('thca') || src.includes('hemp')) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    return src;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, loading]);

  // Preload priority images
  useEffect(() => {
    if (priority && !isLoaded) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedSrc();
      document.head.appendChild(link);
    }
  }, [priority, isLoaded, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
    
    // Fallback to original source if WebP fails
    if (imgRef.current && src !== getOptimizedSrc()) {
      imgRef.current.src = src;
    }
  };

  // Calculate aspect ratio for CLS prevention
  const aspectRatio = width && height ? width / height : undefined;
  const paddingBottom = aspectRatio ? `${(1 / aspectRatio) * 100}%` : '56.25%'; // Default to 16:9

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={{
        paddingBottom: width && height ? undefined : paddingBottom,
        width: width || '100%',
        height: height || undefined
      }}
    >
      {/* Placeholder/Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
      
      {/* Main Image */}
      {isInView && (
        <motion.img
          ref={imgRef}
          src={getOptimizedSrc()}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`${width && height ? '' : 'absolute inset-0'} w-full h-full object-cover`}
          style={{
            aspectRatio: aspectRatio ? `${width}/${height}` : undefined
          }}
        />
      )}
      
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}

// Batch image optimization component
export function OptimizedProductImage({ 
  product,
  className = ''
}: { 
  product: any;
  className?: string;
}) {
  const imageSrc = product.imageUrl || '/placeholder-product.webp';
  const imageAlt = `${product.name} - Premium THCA ${product.category} - Lab Tested COA Included`;
  
  return (
    <OptimizedImage
      src={imageSrc}
      alt={imageAlt}
      width={400}
      height={400}
      className={className}
      loading="lazy"
    />
  );
}