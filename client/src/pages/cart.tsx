import { useState, useEffect, memo } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  ArrowLeft, 
  Gift,
  CreditCard,
  Shield,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import type { CartItemWithProduct } from '@/lib/types';
import { ShippingInfo } from '@/components/shipping/shipping-info';

// AI Assistant Integration Helper
const AIAssistantHelper = ({ 
  itemCount, 
  total, 
  onAskAssistant 
}: { 
  itemCount: number; 
  total: number; 
  onAskAssistant: () => void; 
}) => {
  if (itemCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Need help with your order?</h4>
            <p className="text-sm text-muted-foreground">
              Ask our AI assistant about recommendations, effects, or checkout help
            </p>
          </div>
        </div>
        <Button
          onClick={onAskAssistant}
          variant="outline"
          size="sm"
          className="bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-950"
          data-testid="button-ask-assistant"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Ask Assistant
        </Button>
      </div>
    </motion.div>
  );
};

// Cart Item Card Component
const CartItemCard = memo(({ 
  item, 
  onQuantityUpdate, 
  onRemove 
}: { 
  item: CartItemWithProduct; 
  onQuantityUpdate: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock || isUpdating) return;
    
    setLocalQuantity(newQuantity);
    setIsUpdating(true);
    try {
      await onQuantityUpdate(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } finally {
      setIsRemoving(false);
    }
  };

  const itemTotal = parseFloat(item.product.price) * localQuantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      data-testid={`cart-item-${item.id}`}
      className="group relative"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/30">
        <div className="flex items-center p-4 space-x-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={item.product.imageUrl} 
              alt={`${item.product.name} - Premium THCA product in shopping cart - Lab-tested hemp product`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground truncate" title={item.product.name}>
                {item.product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Premium THCA product - Lab-tested quality guaranteed
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 bg-muted/50 rounded-lg px-3 py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                  onClick={() => handleQuantityChange(localQuantity - 1)}
                  disabled={isUpdating || isRemoving || localQuantity <= 1}
                  data-testid={`button-decrease-${item.id}`}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span 
                  className="w-12 text-center font-bold text-lg select-none"
                  data-testid={`text-quantity-${item.id}`}
                >
                  {localQuantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                  onClick={() => handleQuantityChange(localQuantity + 1)}
                  disabled={isUpdating || isRemoving || localQuantity >= item.product.stock}
                  data-testid={`button-increase-${item.id}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Price Display */}
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">
                  ${item.product.price} each
                </p>
                <p className="font-bold text-xl text-primary" data-testid={`text-item-total-${item.id}`}>
                  ${itemTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            data-testid={`button-remove-${item.id}`}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
});

CartItemCard.displayName = 'CartItemCard';

export default function Cart() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    getSubtotal, 
    getTax, 
    getTotal,
    clearCart,
    isLoading,
    fetchCart 
  } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    setIsUpdating(true);
    try {
      await updateQuantity(itemId, newQuantity);
      toast({
        title: "Updated",
        description: "Quantity updated successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast({
        title: "Removed",
        description: "Item removed from cart",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to remove item",
        variant: "destructive"
      });
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add some products before checking out",
        variant: "destructive"
      });
      return;
    }

    console.log('Navigating to checkout page, items count:', items.length);
    setLocation('/checkout');
  };

  const handleClearCart = async () => {
    try {
      clearCart();
      toast({
        title: "Cart Cleared",
        description: "All items removed from cart",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    }
  };

  const handleAskAssistant = () => {
    // Trigger AI chat with cart context
    window.dispatchEvent(new CustomEvent('openAIChat', { 
      detail: { 
        message: `I have ${items.length} items in my cart totaling $${getTotal().toFixed(2)}. Can you help me with my order?`,
        context: 'cart'
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
            <p className="text-muted-foreground">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Shopping Cart - THCA Products | Mentally-Chill</title>
        <meta name="description" content="Review your THCA products in cart. Secure checkout, fast shipping, lab-tested hemp products. Store credit accepted. Complete your premium THCA order now." />
        <meta name="keywords" content="THCA cart, checkout THCA, buy THCA products, hemp products cart, secure cannabis checkout, THCA store credit" />
        <meta property="og:title" content="Shopping Cart - THCA Products" />
        <meta property="og:description" content="Review your premium THCA products and complete secure checkout with fast shipping." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mentally-chill.online/cart" />
        <link rel="canonical" href="https://mentally-chill.online/cart" />
      </Helmet>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Shopping Cart
              </h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            data-testid="button-clear-cart"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* AI Assistant Helper */}
      <AIAssistantHelper 
        itemCount={items.length}
        total={getTotal()}
        onAskAssistant={handleAskAssistant}
      />

      {/* Prominent Shipping Information */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <ShippingInfo variant="card" />
        </motion.div>
      )}

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Card className="max-w-md mx-auto border-2 border-dashed border-muted">
            <CardContent className="pt-12 pb-12">
              <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-6">
                <ShoppingCart className="w-16 h-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Discover our premium THCA products and start building your perfect order
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                  <Gift className="w-5 h-5 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary" />
                Your Items ({items.length})
              </h2>
            </div>
            
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onQuantityUpdate={handleQuantityUpdate}
                  onRemove={handleRemoveItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <Card className="sticky top-4 border-2 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium" data-testid="text-subtotal">
                      ${getSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="font-medium" data-testid="text-tax">
                      ${getTax().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-primary" data-testid="text-total">
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Ready to Checkout
                  </h3>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-4 text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                    data-testid="button-checkout"
                    size="lg"
                  >
                    <CreditCard className="w-6 h-6" />
                    Proceed to Secure Checkout
                  </Button>

                  <div className="space-y-2 text-center">
                    <p className="text-xs text-muted-foreground">
                      🔒 Secure checkout powered by Stripe
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <span>✓ SSL Encrypted</span>
                      <span>✓ Age Verified</span>
                      <span>✓ Discreet Shipping</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}