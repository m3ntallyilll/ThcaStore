import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, ArrowLeft, MessageCircle, Sparkles, Gift, Package, Shield, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { CartItemWithProduct } from '@/lib/types';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from '@/lib/queryClient';

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Cart Payment Form Component
const CartPaymentForm = ({ 
  total, 
  onPaymentReady 
}: { 
  total: number; 
  onPaymentReady: (clientSecret: string) => void; 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      console.error('Stripe not loaded yet');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting payment confirmation...');
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "Payment Failed",
          description: error.message || "There was an issue processing your payment. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Payment successful, redirecting...');
        toast({
          title: "Payment Successful", 
          description: "Thank you for your purchase! Redirecting to confirmation...",
        });
        // Clear cart on successful payment
        setTimeout(() => {
          setLocation('/order-confirmation');
        }, 1000);
      }
    } catch (err) {
      console.error('Payment submission error:', err);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow-sm min-h-[350px] w-full">
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: true
            },
            fields: {
              billingDetails: 'auto'
            },
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#16a34a',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorDanger: '#dc2626',
                fontFamily: 'system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px'
              },
              rules: {
                '.Input': {
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  color: '#1f2937'
                },
                '.Input:focus': {
                  borderColor: '#16a34a',
                  boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.1)'
                },
                '.Label': {
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                },
                '.Tab': {
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  color: '#374151'
                },
                '.Tab--selected': {
                  backgroundColor: '#16a34a',
                  color: '#ffffff'
                }
              }
            }
          }}
          className="stripe-payment-element"
        />
      </div>
      
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <Shield className="w-4 h-4" />
        <span>🔒 256-bit SSL encryption • PCI DSS compliant • Powered by Stripe</span>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || !elements || isLoading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        data-testid="button-complete-order-cart"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : !stripe || !elements ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading Payment Form...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-5 w-5" />
            Complete Order - ${total.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};

// Enhanced Cart Item Component for AI Assistant Integration
const CartItemCard = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isUpdating 
}: {
  item: CartItemWithProduct;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  isUpdating: boolean;
}) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove();
      return;
    }

    setLocalQuantity(newQuantity);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      setLocalQuantity(item.quantity);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } catch (error) {
      setIsRemoving(false);
    }
  };

  const itemTotal = parseFloat(item.product.price) * localQuantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-card rounded-xl p-6 shadow-lg border-2 hover:border-primary/30 transition-all duration-300 ${
        isRemoving ? 'opacity-50' : ''
      }`}
      data-testid={`cart-item-${item.id}`}
    >
      <div className="flex items-start space-x-6">
        {/* Product Image */}
        <div className="relative">
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="w-24 h-24 object-cover rounded-xl shadow-md"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1544954828-46582c70e086?w=200&h=200&fit=crop&crop=center';
            }}
          />
          {item.product.stock <= 10 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 text-xs"
            >
              Low Stock
            </Badge>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-bold text-lg text-foreground mb-1" data-testid={`text-product-name-${item.id}`}>
              {item.product.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>In Stock: {item.product.stock}</span>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
              <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleQuantityChange(localQuantity - 1)}
                  disabled={isUpdating || isRemoving}
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
    </motion.div>
  );
};

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
  const [clientSecret, setClientSecret] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Create payment intent when user wants to show payment form
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (showPaymentForm && items.length > 0) {
        try {
          console.log('Creating payment intent for cart items:', items.length);
          const data = await apiRequest("/api/create-payment-intent", { 
            method: "POST",
            body: {
              items,
              subtotal: getSubtotal(),
              shippingCost: 0
            }
          });
          console.log('Payment intent created:', data.clientSecret ? 'Success' : 'Failed');
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Error creating payment intent:', error);
          setClientSecret(''); // Reset on error
        }
      } else if (!showPaymentForm) {
        setClientSecret(''); // Reset when hiding form
      }
    };

    createPaymentIntent();
  }, [showPaymentForm, items, getSubtotal]);

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

    console.log('Showing payment form, items count:', items.length);
    setShowPaymentForm(true);
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
              <Badge variant="secondary" className="text-sm">
                ${getSubtotal().toFixed(2)} subtotal
              </Badge>
            </div>

            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleQuantityUpdate}
                  onRemove={handleRemoveItem}
                  isUpdating={isUpdating}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <Card className="sticky top-6 shadow-xl border-2 max-h-[85vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center text-foreground">
                  <CreditCard className="w-5 h-5 mr-2 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 pb-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold" data-testid="text-subtotal">
                      ${getSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (9%):</span>
                    <span data-testid="text-tax">${getTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary" data-testid="text-total">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>

                {!showPaymentForm ? (
                  <>
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-4 text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                      data-testid="button-checkout"
                      size="lg"
                    >
                      <CreditCard className="w-6 h-6" />
                      Proceed to Checkout
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
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Enter Card Information
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">Complete your purchase securely</p>
                    </div>

                    <div className="min-h-[450px] w-full">
                      {clientSecret ? (
                        <div className="w-full bg-white">
                          <Elements 
                            stripe={stripePromise} 
                            options={{ 
                              clientSecret,
                              appearance: {
                                theme: 'stripe',
                                variables: {
                                  colorPrimary: '#16a34a',
                                  colorBackground: '#ffffff',
                                  colorText: '#1f2937',
                                  fontFamily: 'system-ui, sans-serif'
                                }
                              }
                            }}
                          >
                            <CartPaymentForm 
                              total={getTotal()} 
                              onPaymentReady={setClientSecret}
                            />
                          </Elements>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                          <span className="ml-2 text-sm text-muted-foreground">Preparing secure payment...</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={() => setShowPaymentForm(false)}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      Back to Cart Summary
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}