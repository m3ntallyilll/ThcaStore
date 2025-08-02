import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';
import { Link } from 'wouter';

interface AIRecommendationProps {
  currentProductId?: string;
  category?: string;
  userPreferences?: string[];
  className?: string;
}

interface RecommendationScore {
  product: Product;
  score: number;
  reason: string;
  category: 'similar' | 'complementary' | 'trending' | 'personalized';
}

export function AIProductRecommendations({ 
  currentProductId, 
  category, 
  userPreferences = [], 
  className = '' 
}: AIRecommendationProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all products for AI analysis
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('/api/products')
  });

  // AI-powered recommendation engine
  useEffect(() => {
    if (products.length === 0) {
      setIsLoading(false);
      return;
    }

    const generateRecommendations = async () => {
      setIsLoading(true);
      
      try {
        // Filter out current product if specified
        const availableProducts = currentProductId 
          ? products.filter(p => p.id !== currentProductId)
          : products;

        if (availableProducts.length === 0) {
          setRecommendations([]);
          setIsLoading(false);
          return;
        }

        const scoredProducts: RecommendationScore[] = [];

        // AI-powered scoring algorithm
        for (const product of availableProducts) {
          let score = 0;
          let reason = '';
          let category: RecommendationScore['category'] = 'similar';

          // Category similarity (30% weight)
          if (category && product.category === category) {
            score += 30;
            reason = `Similar ${category} product`;
            category = 'similar';
          }

          // User preference matching (25% weight)
          if (user && userPreferences.length > 0) {
            const matchingPrefs = userPreferences.filter(pref => 
              product.name.toLowerCase().includes(pref.toLowerCase()) ||
              product.description?.toLowerCase().includes(pref.toLowerCase()) ||
              product.effects?.some(effect => effect.toLowerCase().includes(pref.toLowerCase()))
            );
            
            if (matchingPrefs.length > 0) {
              score += 25 * (matchingPrefs.length / userPreferences.length);
              reason = `Matches your preferences: ${matchingPrefs.join(', ')}`;
              category = 'personalized';
            }
          }

          // Strain type compatibility (20% weight)
          const currentProduct = products.find(p => p.id === currentProductId);
          if (currentProduct?.strainType && product.strainType) {
            if (currentProduct.strainType === product.strainType) {
              score += 20;
              reason = `Same strain type: ${product.strainType}`;
            } else if (
              (currentProduct.strainType === 'Sativa' && product.strainType === 'Sativa Dominant') ||
              (currentProduct.strainType === 'Indica' && product.strainType === 'Indica Dominant') ||
              (currentProduct.strainType === 'Hybrid' && product.strainType.includes('Hybrid'))
            ) {
              score += 15;
              reason = `Compatible strain: ${product.strainType}`;
            }
          }

          // Popularity and rating (15% weight)
          const rating = parseFloat(product.rating || '0');
          if (rating >= 4.5) {
            score += 15;
            reason = reason || `Highly rated (${rating}⭐)`;
            category = rating >= 4.8 ? 'trending' : 'similar';
          } else if (rating >= 4.0) {
            score += 10;
          }

          // Price compatibility (10% weight)
          const currentPrice = parseFloat(currentProduct?.price || '0');
          const productPrice = parseFloat(product.price);
          if (currentPrice > 0) {
            const priceDiff = Math.abs(currentPrice - productPrice) / currentPrice;
            if (priceDiff <= 0.3) { // Within 30% price range
              score += 10;
            } else if (priceDiff <= 0.5) { // Within 50% price range
              score += 5;
            }
          }

          // Complementary product logic
          if (currentProduct) {
            const isComplementary = checkComplementaryProducts(currentProduct, product);
            if (isComplementary) {
              score += 25;
              reason = 'Perfect complement to your selection';
              category = 'complementary';
            }
          }

          // Stock availability bonus
          if (product.stock > 0) {
            score += 5;
          } else {
            score = Math.max(0, score - 20); // Heavily penalize out of stock
          }

          // Add randomness for diversity (5% weight)
          score += Math.random() * 5;

          if (score > 15) { // Minimum threshold
            scoredProducts.push({
              product,
              score,
              reason: reason || 'Recommended for you',
              category
            });
          }
        }

        // Sort by score and take top 8
        const topRecommendations = scoredProducts
          .sort((a, b) => b.score - a.score)
          .slice(0, 8);

        setRecommendations(topRecommendations);
      } catch (error) {
        console.error('Error generating recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    generateRecommendations();
  }, [products, currentProductId, category, userPreferences, user]);

  // Helper function to check complementary products
  const checkComplementaryProducts = (current: Product, candidate: Product): boolean => {
    const complementaryPairs = [
      { primary: 'flower', complements: ['accessories', 'papers'] },
      { primary: 'concentrates', complements: ['accessories', 'flower'] },
      { primary: 'edibles', complements: ['flower', 'beverages'] },
      { primary: 'prerolls', complements: ['accessories', 'flower'] }
    ];

    return complementaryPairs.some(pair => 
      (current.category === pair.primary && pair.complements.includes(candidate.category)) ||
      (candidate.category === pair.primary && pair.complements.includes(current.category))
    );
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart.',
        variant: 'destructive'
      });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(recommendations.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(recommendations.length / 4)) % Math.ceil(recommendations.length / 4));
  };

  const getCategoryIcon = (category: RecommendationScore['category']) => {
    switch (category) {
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'personalized': return <Sparkles className="w-4 h-4" />;
      case 'complementary': return <Star className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: RecommendationScore['category']) => {
    switch (category) {
      case 'trending': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'personalized': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'complementary': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const visibleRecommendations = recommendations.slice(
    currentSlide * 4,
    currentSlide * 4 + 4
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {recommendations.length} Products
          </Badge>
        </div>
        
        {recommendations.length > 4 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="w-8 h-8 border-gray-600 hover:bg-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="w-8 h-8 border-gray-600 hover:bg-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleRecommendations.map((rec, index) => (
          <motion.div
            key={rec.product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Product Image */}
                  <div className="relative">
                    <Link href={`/products/${rec.product.id}`}>
                      <img
                        src={rec.product.imageUrl}
                        alt={rec.product.name}
                        className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <Badge className={`absolute top-2 right-2 text-xs ${getCategoryColor(rec.category)}`}>
                      {getCategoryIcon(rec.category)}
                      <span className="ml-1 capitalize">{rec.category}</span>
                    </Badge>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <Link href={`/products/${rec.product.id}`}>
                      <h4 className="font-semibold text-white text-sm line-clamp-2 hover:text-emerald-400 transition-colors">
                        {rec.product.name}
                      </h4>
                    </Link>
                    
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {rec.reason}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-300">
                          {rec.product.rating || '4.5'}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {rec.product.category}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">
                        ${rec.product.priceRange ? 
                          `${rec.product.priceRange.min} - ${rec.product.priceRange.max}` : 
                          rec.product.price
                        }
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(rec.product)}
                        disabled={rec.product.stock === 0}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-xs"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination Indicators */}
      {recommendations.length > 4 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.ceil(recommendations.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-emerald-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}