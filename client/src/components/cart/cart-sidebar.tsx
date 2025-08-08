import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export function CartSidebar() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeFromCart, 
    getSubtotal, 
    getTax, 
    getTotal,
    clearCart 
  } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast({
        title: "Item removed",
        description: "Item removed from cart"
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
        title: "Cart empty",
        description: "Your cart is empty",
        variant: "destructive"
      });
      return;
    }

    // Close cart and go to checkout (works for both logged in and guest users)
    toggleCart();
    setLocation('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleCart}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-96 bg-dark-800 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Shopping Cart</h3>
                  {items.length > 0 && (
                    <p className="text-sm text-emerald-400 mt-1 font-medium animate-pulse">✨ Ready to checkout? Scroll down! ✨</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={toggleCart}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p className="text-lg">Your cart is empty</p>
                  <p className="text-sm">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 glass rounded-lg"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm text-gray-400">${item.product.price}</p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-gray-700 rounded-full hover:bg-gray-600"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="mx-3 font-semibold">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-gray-700 rounded-full hover:bg-gray-600"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Discount Section */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-700">
                {(() => {
                  const discountCode = localStorage.getItem('activeDiscountCode');
                  const discountPercent = localStorage.getItem('activeDiscountPercent');
                  if (discountCode && discountPercent) {
                    const discount = parseInt(discountPercent);
                    const originalTotal = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
                    const discountAmount = originalTotal * (discount / 100);
                    const newTotal = originalTotal - discountAmount;
                    
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Subtotal:</span>
                          <span className="line-through text-gray-400">${originalTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-400 font-semibold">
                          <span>Discount ({discountCode}):</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-lg font-bold text-emerald-400">
                          <span>Total:</span>
                          <span>${newTotal.toFixed(2)}</span>
                        </div>
                        <div className="text-center text-xs text-emerald-300 bg-emerald-500/10 rounded px-2 py-1">
                          🎉 You're saving ${discountAmount.toFixed(2)}!
                        </div>
                      </div>
                    );
                  }
                  
                  const total = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
                  return (
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-700 p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>Subtotal:</span>
                      <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Tax:</span>
                      <span>${getTax().toFixed(2)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-gold">${getTotal().toFixed(2)}</span>
                  </div>
                  
                  {/* Prominent checkout button with extra visual emphasis */}
                  <div className="bg-gradient-to-r from-emerald-500/20 to-gold/20 p-4 rounded-xl border-2 border-gold/50">
                    <Button
                      onClick={handleCheckout}
                      data-cart-checkout
                      className="w-full bg-gradient-to-r from-gold to-gold-600 text-black py-6 rounded-xl font-bold text-xl hover:shadow-xl hover:shadow-gold/50 transition-all duration-300 flex items-center justify-center gap-3 animate-pulse hover:animate-none hover:scale-105"
                    >
                      <CreditCard className="w-6 h-6" />
                      🛒 CHECKOUT NOW - ${getTotal().toFixed(2)}
                    </Button>
                    <p className="text-center text-sm text-emerald-300 mt-3 font-medium">
                      🔒 Secure payment • 🚚 Free shipping • ⚡ 2-minute checkout
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
