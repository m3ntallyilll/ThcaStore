import { X, Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';
import { AIProductRecommendations } from '@/components/recommendations/ai-product-recommendations';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      await addToCart(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `Added ${quantity} ${product.name} to cart!`
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive"
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'flower':
        return 'bg-hemp text-white';
      case 'concentrates':
        return 'bg-gold text-black';
      case 'edibles':
        return 'bg-purple-500 text-white';
      case 'accessories':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-dark rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Section */}
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 lg:h-full object-cover rounded-xl"
                />
                <Badge className={`absolute top-4 left-4 ${getCategoryColor(product.category)}`}>
                  {product.featured ? 'Premium' : product.category}
                </Badge>
              </div>

              {/* Content Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">{product.name}</h2>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-3xl font-bold text-gold">${product.price}</span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-5 h-5 fill-current mr-1" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed">{product.description}</p>

                {/* Product Details */}
                <div className="space-y-3">
                  {product.thcaContent && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">THCA Content:</span>
                      <span className="font-semibold">{product.thcaContent}%</span>
                    </div>
                  )}
                  {product.strainType && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Strain Type:</span>
                      <span className="font-semibold">{product.strainType}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="font-semibold capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stock:</span>
                    <span className="font-semibold">{product.stock} available</span>
                  </div>
                </div>

                {/* Effects */}
                {product.effects && product.effects.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Effects:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.effects.map((effect, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/10">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="h-10 w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-gradient-to-r from-hemp to-hemp-600 hover:from-hemp-600 hover:to-hemp text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-hemp/30 transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
                </Button>
              </div>
            </div>

            {/* AI Recommendations Section */}
            <div className="px-8 pb-8">
              <AIProductRecommendations 
                currentProductId={product.id}
                category={product.category}
                userPreferences={product.effects || []}
                className="mt-6"
              />
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
