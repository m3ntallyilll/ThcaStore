import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart, Package, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProductVariantSelector } from './product-variant-selector';
import type { Product, ProductVariant } from '@shared/schema';
import { ShippingInfo } from '@/components/shipping/shipping-info';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  isHighlighted?: boolean;
}

export function ProductCard({ product, onProductClick, isHighlighted = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [showVariants, setShowVariants] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  // Get product variants or create default variant
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
  const priceRange = product.priceRange || { min: parseFloat(product.price), max: parseFloat(product.price) };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Remove login requirement - cart works for guests too
    // if (!user) {
    //   toast({
    //     title: "Login required",
    //     description: "Please login to add items to cart",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    if (currentVariant.stock === 0) {
      toast({
        title: "Out of stock",
        description: "This variant is out of stock",
        variant: "destructive"
      });
      return;
    }

    try {
      // For now, use the product ID. In a full implementation, you'd pass variant info
      await addToCart(product.id);
      toast({
        title: "Added to cart",
        description: `${currentVariant.weight} ${product.name} added to cart!`
      });
      
      // Trigger recommendation popup after adding to cart
      const event = new CustomEvent('cart_item_added', {
        detail: { productId: product.id, variant: currentVariant }
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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Product removed from your wishlist" : "Product added to your wishlist"
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'flower':
        return 'bg-emerald-500 text-white';
      case 'prerolls':
        return 'bg-blue-500 text-white';
      case 'concentrates':
        return 'bg-amber-500 text-black';
      case 'edibles':
        return 'bg-purple-500 text-white';
      case 'accessories':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getSubcategoryIcon = (category: string, subcategory?: string) => {
    switch (category) {
      case 'flower':
        return <Package className="w-4 h-4" />;
      case 'prerolls':
        return <Zap className="w-4 h-4" />;
      case 'concentrates':
        return <Star className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, rotateX: 5 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`product-card glass rounded-2xl overflow-hidden group cursor-pointer ${
        isHighlighted ? 'ring-4 ring-gold animate-pulse' : ''
      }`}
      data-product-id={product.id}
      data-product-name={product.name}
      onClick={() => onProductClick(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = '/src/assets/generated_images/Hemp_pre-rolls_in_tubes_eff785cb.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className={`${getCategoryColor(product.category)} text-sm font-semibold flex items-center gap-1`}>
            {getSubcategoryIcon(product.category, product.subcategory || undefined)}
            {product.featured ? 'Premium' : product.category}
          </Badge>
          {product.subcategory && (
            <Badge className="bg-black/60 text-white text-xs">
              {product.subcategory}
            </Badge>
          )}
          <Badge className="bg-white/90 text-black font-bold text-sm">
            {currentVariant.weight}
          </Badge>
          {product.potency && (
            <Badge className={`text-xs ${
              product.potency === 'High' ? 'bg-red-500 text-white' :
              product.potency === 'Medium' ? 'bg-yellow-500 text-black' :
              'bg-green-500 text-white'
            }`}>
              {product.potency}
            </Badge>
          )}
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
        <h3 className="text-xl font-semibold mb-2 group-hover:text-glow-green-400 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-2">
          <div>
            {priceRange.min === priceRange.max ? (
              <span className="text-2xl font-bold text-emerald-400">
                ${currentVariant.price}
              </span>
            ) : (
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-400">
                  ${currentVariant.price}
                </span>
                <span className="text-xs text-gray-400">
                  ${priceRange.min} - ${priceRange.max}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center text-emerald-400">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span className="text-sm">{product.rating}</span>
          </div>
        </div>
        
        {/* Variant Selector for products with multiple sizes */}
        {variants.length > 1 && (
          <div className="mb-4">
            <ProductVariantSelector
              variants={variants}
              onVariantChange={setSelectedVariant}
              selectedVariant={currentVariant}
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Weight</p>
            <p className="text-lg font-bold text-emerald-400">{currentVariant.weight}</p>
          </div>
          {product.thcaContent && (
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide">THCA</p>
              <p className="text-lg font-bold text-emerald-400">{product.thcaContent}</p>
            </div>
          )}
          {product.strainType && (
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Type</p>
              <p className="text-sm font-semibold text-white capitalize">{product.strainType}</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Stock</p>
            <p className={`text-sm font-semibold ${
              currentVariant.stock === 0 ? 'text-red-400' :
              currentVariant.stock <= 5 ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              {currentVariant.stock === 0 ? 'Out' : currentVariant.stock}
            </p>
          </div>
        </div>
        
        {product.thcaContent && (
          <div className="mb-3 text-sm text-gray-300">
            THCA: {product.thcaContent}%
          </div>
        )}
        
        {/* Compact Shipping Information */}
        <div className="mb-4">
          <ShippingInfo variant="compact" />
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={currentVariant.stock === 0}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            currentVariant.stock === 0 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {currentVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  );
}
