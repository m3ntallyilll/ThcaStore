import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function Cart() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    getSubtotal, 
    getTax, 
    getTotal,
    clearCart,
    isLoading 
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
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to checkout",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart empty",
        description: "Your cart is empty",
        variant: "destructive"
      });
      return;
    }

    setLocation('/checkout');
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast({
        title: "Cart cleared",
        description: "All items removed from cart"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/products">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex items-center">
          <ShoppingCart className="w-8 h-8 mr-3 text-primary" />
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some products to get started</p>
            <Link href="/products">
              <Button size="lg">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Cart Items</h2>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleClearCart}
                data-testid="button-clear-cart"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg p-6 shadow-sm"
                data-testid={`cart-item-${item.id}`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg" data-testid={`text-product-name-${item.id}`}>
                      {item.product.name}
                    </h3>
                    {item.product.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span 
                          className="w-12 text-center font-semibold"
                          data-testid={`text-quantity-${item.id}`}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price} each
                        </p>
                        <p className="font-semibold text-lg" data-testid={`text-item-total-${item.id}`}>
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive"
                    data-testid={`button-remove-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span data-testid="text-subtotal">${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax:</span>
                    <span data-testid="text-tax">${getTax().toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary" data-testid="text-total">${getTotal().toFixed(2)}</span>
                </div>
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  data-testid="button-checkout"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout powered by Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}