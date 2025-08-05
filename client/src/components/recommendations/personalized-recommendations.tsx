import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Sparkles, 
  Heart, 
  TrendingUp, 
  Target, 
  X, 
  ShoppingCart, 
  Star,
  Zap,
  Gift
} from 'lucide-react';
import type { Product } from '@shared/schema';

interface RecommendationCategory {
  title: string;
  description: string;
  icon: string;
  reason: string;
  products: Product[];
}

interface PersonalizedRecommendationsProps {
  isOpen: boolean;
  onClose: () => void;
  currentProductId?: string;
  triggerReason?: 'browsing' | 'cart_add' | 'idle' | 'exit_intent';
}

export function PersonalizedRecommendations({ 
  isOpen, 
  onClose, 
  currentProductId,
  triggerReason = 'browsing'
}: PersonalizedRecommendationsProps) {
  const { user } = useAuth();
  const { addToCart, items: cartItems } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [viewedProducts, setViewedProducts] = useState<string[]>([]);

  // Get browsing history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('product_history');
    if (history) {
      setViewedProducts(JSON.parse(history));
    }
  }, []);

  // Fetch AI-powered recommendations
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['/api/ai/recommendations', user?.id, currentProductId, viewedProducts],
    queryFn: () => apiRequest('/api/ai/recommendations', {
      method: 'POST',
      body: {
        userId: user?.id || 'guest',
        currentProductId,
        viewedProductIds: viewedProducts,
        cartProductIds: cartItems.map(item => item.productId),
        preferences: {
          triggerReason,
          sessionTime: Date.now() - (parseInt(localStorage.getItem('session_start') || '0'))
        }
      }
    }),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id);
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart!`,
      });
      
      // Track conversion
      const event = new CustomEvent('recommendation_conversion', {
        detail: { productId: product.id, source: 'ai_recommendation' }
      });
      window.dispatchEvent(event);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive"
      });
    }
  };

  const handleProductClick = (product: Product) => {
    // Add to browsing history
    const history = JSON.parse(localStorage.getItem('product_history') || '[]');
    const updatedHistory = [product.id, ...history.filter((id: string) => id !== product.id)].slice(0, 10);
    localStorage.setItem('product_history', JSON.stringify(updatedHistory));
    
    // Close recommendations and navigate
    onClose();
    window.location.href = `/products?highlight=${product.id}`;
  };

  const getIconForCategory = (title: string) => {
    switch (title.toLowerCase()) {
      case 'perfect for you':
        return <Heart className="w-5 h-5" />;
      case 'trending now':
        return <TrendingUp className="w-5 h-5" />;
      case 'similar products':
        return <Target className="w-5 h-5" />;
      case 'complete your collection':
        return <Gift className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getTriggerMessage = () => {
    switch (triggerReason) {
      case 'cart_add':
        return "Based on what you just added to cart";
      case 'idle':
        return "Still browsing? Here are some suggestions";
      case 'exit_intent':
        return "Before you go, check these out";
      default:
        return "Personalized just for you";
    }
  };

  if (!recommendations?.categories || recommendations.categories.length === 0) {
    return null;
  }

  const currentCategory = recommendations.categories[selectedCategory];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[80vh] overflow-hidden p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 bg-gradient-to-b from-primary/10 to-secondary/5 border-r p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    AI Recommendations
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getTriggerMessage()}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Category Navigation */}
            <div className="space-y-2">
              {recommendations.categories.map((category: RecommendationCategory, index: number) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedCategory(index)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    selectedCategory === index
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-background/50 hover:bg-background/80'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedCategory === index ? 'bg-primary-foreground/20' : 'bg-primary/10'
                    }`}>
                      {getIconForCategory(category.title)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{category.title}</h3>
                      <p className="text-xs opacity-80 line-clamp-2">
                        {category.description}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className="mt-2 text-xs"
                      >
                        {category.products.length} products
                      </Badge>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Close Button */}
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full mt-6"
            >
              <X className="w-4 h-4 mr-2" />
              Close Recommendations
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {getIconForCategory(currentCategory.title)}
                <h2 className="text-2xl font-bold">{currentCategory.title}</h2>
              </div>
              <p className="text-muted-foreground">{currentCategory.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-600">
                  {currentCategory.reason}
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {currentCategory.products.map((product: Product, index: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                      <CardContent className="p-4">
                        <div 
                          onClick={() => handleProductClick(product)}
                          className="space-y-3"
                        >
                          {/* Product Image */}
                          <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1544954828-46582c70e086?w=300&h=300&fit=crop&crop=center';
                              }}
                            />
                            {/* Badge */}
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                            {/* Rating */}
                            <div className="absolute top-2 right-2 bg-background/90 rounded-full p-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{product.rating}</span>
                              </div>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div>
                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {product.description}
                            </p>
                            
                            {/* Price and Weight */}
                            <div className="flex items-center justify-between mt-2">
                              <div>
                                <span className="text-lg font-bold text-primary">
                                  ${product.price}
                                </span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  {product.weight}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {product.thcaContent}% THCA
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="w-full mt-3 bg-gradient-to-r from-primary to-primary/80"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {currentCategory.products.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground">
                  Browse more products to get personalized suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}