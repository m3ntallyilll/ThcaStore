import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast-provider';
import type { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast('Please login to add items to cart', 'warning');
      return;
    }

    try {
      await addToCart(product.id);
      toast('Product added to cart!', 'success');
    } catch (error) {
      toast('Failed to add product to cart', 'error');
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      'info'
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'flower':
        return 'bg-cannabis text-white';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, rotateX: 5 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="product-card glass rounded-2xl overflow-hidden group cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4">
          <Badge className={`${getCategoryColor(product.category)} text-sm font-semibold`}>
            {product.featured ? 'Premium' : product.category}
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
          onClick={handleWishlistToggle}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </Button>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gold">
            ${product.price}
          </span>
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span className="text-sm">{product.rating}</span>
          </div>
        </div>
        
        {product.thcaContent && (
          <div className="mb-3 text-sm text-gray-300">
            THCA: {product.thcaContent}%
          </div>
        )}
        
        <Button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-cannabis to-cannabis-600 hover:from-cannabis-600 hover:to-cannabis text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cannabis/30 transition-all duration-300"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
