import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Package,
  Truck,
  Shield,
  ChevronRight,
  Zap,
  Leaf,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { ShippingInfo } from '@/components/shipping/shipping-info';
import { SocialShare } from '@/components/social-share';
import { CustomerReviews } from '@/components/reviews/customer-reviews';
import { SEOOptimizer } from '@/components/seo/seo-optimizer';
import { AdvancedSchema } from '@/components/seo/advanced-schema';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { CoreWebVitals } from '@/components/seo/core-web-vitals';
import type { Product, ProductVariant } from '@shared/schema';

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products'],
    select: (products: Product[]) => products.find(p => p.id === productId),
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['/api/products'],
    select: (products: Product[]) => 
      products
        .filter(p => p.id !== productId && p.category === product?.category)
        .slice(0, 4),
  });

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
      setSelectedVariant(defaultVariant);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const variants = product.variants && product.variants.length > 0 
    ? product.variants 
    : [{
        id: `${product.id}-default`,
        weight: product.weight || '1g',
        price: parseFloat(product.price),
        stock: product.stock,
        isDefault: true
      }];

  const currentVariant = selectedVariant || variants.find(v => v.isDefault) || variants[0];
  const images = [product.imageUrl]; // In a real app, you'd have multiple images

  const handleAddToCart = async () => {
    if (currentVariant.stock === 0) {
      toast({
        title: "Out of stock",
        description: "This variant is out of stock",
        variant: "destructive"
      });
      return;
    }

    try {
      await addToCart(product.id);
      toast({
        title: "Added to cart",
        description: `${currentVariant.weight} ${product.name} added to cart!`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive"
      });
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Product removed from your wishlist" : "Product added to your wishlist"
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'flower': return 'bg-emerald-500 text-white';
      case 'prerolls': return 'bg-blue-500 text-white';
      case 'concentrates': return 'bg-amber-500 text-black';
      case 'edibles': return 'bg-purple-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.name, href: `/product/${product.id}` }
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} - Premium THCA {product.category} | Mentally Chill</title>
        <meta name="description" content={`${product.description} Premium lab-tested THCA ${product.category} with ${product.thcaContent}% THCA content. Fast shipping, discreet packaging.`} />
        <meta name="keywords" content={`THCA ${product.category}, ${product.name}, hemp products, legal cannabis, ${product.strainType}, lab tested`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${product.name} - Premium THCA ${product.category}`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.imageUrl} />
        <meta property="og:type" content="product" />
        
        {/* Product Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.imageUrl,
            "category": product.category,
            "brand": {
              "@type": "Brand",
              "name": "Mentally Chill"
            },
            "offers": {
              "@type": "Offer",
              "price": currentVariant.price,
              "priceCurrency": "USD",
              "availability": currentVariant.stock > 0 ? "InStock" : "OutOfStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "ratingCount": 50
            }
          })}
        </script>
      </Helmet>

      <SEOOptimizer
        title={`${product.name} - Premium THCA ${product.category}`}
        description={`${product.description} Premium lab-tested THCA ${product.category} with fast shipping.`}
        keywords={[product.category, 'THCA', product.strainType || '', 'hemp', 'legal cannabis'].filter(Boolean)}
        image={product.imageUrl}
      />

      <CoreWebVitals />
      <AdvancedSchema type="product" data={product} />

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Back Button */}
          <div className="mb-6">
            <Link href="/products">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img
                  src={images[activeImageIndex]}
                  alt={`${product.name} THCA ${product.category}`}
                  className="w-full h-96 lg:h-[600px] object-cover rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/generated_images/Hemp_pre-rolls_in_tubes_eff785cb.png';
                  }}
                />
                {product.featured && (
                  <Badge className="absolute top-4 left-4 bg-gold text-black">
                    Premium
                  </Badge>
                )}
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(product.category)}>
                    {product.category}
                  </Badge>
                  {product.strainType && (
                    <Badge variant="outline" className="text-white border-white/20">
                      {product.strainType}
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-emerald-400">
                    <Star className="w-5 h-5 fill-current mr-1" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <span className="text-white/60">•</span>
                  <span className="text-white/80">50+ reviews</span>
                </div>
                <p className="text-white/80 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Variants */}
              {variants.length > 1 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Select Size:</h3>
                  <ProductVariantSelector
                    variants={variants}
                    onVariantChange={setSelectedVariant}
                    selectedVariant={currentVariant}
                  />
                </div>
              )}

              {/* Price */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-emerald-400">
                      ${currentVariant.price}
                    </span>
                    <span className="text-white/60 ml-2">/ {currentVariant.weight}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">Stock</p>
                    <p className={`font-semibold ${
                      currentVariant.stock === 0 ? 'text-red-400' :
                      currentVariant.stock <= 5 ? 'text-yellow-400' : 'text-emerald-400'
                    }`}>
                      {currentVariant.stock === 0 ? 'Out of Stock' : `${currentVariant.stock} available`}
                    </p>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  {product.thcaContent && (
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-white/60 text-xs uppercase">THCA</p>
                      <p className="text-emerald-400 font-bold">{product.thcaContent}%</p>
                    </div>
                  )}
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-white/60 text-xs uppercase">Weight</p>
                    <p className="text-white font-bold">{currentVariant.weight}</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-white/60 text-xs uppercase">Type</p>
                    <p className="text-white font-bold capitalize">{product.strainType || 'N/A'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={currentVariant.stock === 0}
                    className={`flex-1 py-3 font-semibold ${
                      currentVariant.stock === 0 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {currentVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className="border-white/20 hover:bg-white/10"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </Button>
                  <SocialShare
                    title={`Check out ${product.name}`}
                    description={product.description}
                    trigger={
                      <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
                        <Share2 className="w-5 h-5 text-white" />
                      </Button>
                    }
                  />
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <Package className="w-6 h-6 text-emerald-400" />
                  <div>
                    <p className="text-white font-medium">Lab Tested</p>
                    <p className="text-white/60 text-sm">COA Included</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <Truck className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Free Shipping</p>
                    <p className="text-white/60 text-sm">2-3 Day Delivery</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Discreet</p>
                    <p className="text-white/60 text-sm">Private Packaging</p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <ShippingInfo />
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="mt-16">
            <CustomerReviews productId={product.id} />
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden group cursor-pointer">
                    <Link href={`/product/${relatedProduct.id}`}>
                      <div className="relative">
                        <img
                          src={relatedProduct.imageUrl}
                          alt={relatedProduct.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <Badge className={`${getCategoryColor(relatedProduct.category)} absolute top-2 left-2`}>
                          {relatedProduct.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-white font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-bold">${relatedProduct.price}</span>
                          <div className="flex items-center text-emerald-400">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            <span className="text-sm">{relatedProduct.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}