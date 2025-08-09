import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Package, Truck, Shield, CreditCard, ArrowRight, Trophy, Coins } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Checkout() {
  const { items } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [usedStoreCredit, setUsedStoreCredit] = useState(0);
  
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
  
  // Fetch store credit balance
  const { data: storeCreditBalance } = useQuery({
    queryKey: ['/api/store-credit/balance'],
  });
  
  const availableStoreCredit = storeCreditBalance?.balance || 0;
  const maxStoreCreditUsable = Math.min(availableStoreCredit, subtotal);
  const total = subtotal - usedStoreCredit;

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("/api/create-checkout-session", {
        method: "POST",
        body: { 
          items,
          storeCreditUsed: usedStoreCredit 
        }
      });

      // Redirect to Stripe's hosted checkout page
      window.location.href = response.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Unable to start checkout process. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Package className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-purple-200 mb-8">Add some products to your cart before checking out.</p>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Link href="/products">
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Secure Checkout</h1>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/10">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.product.name}</h3>
                    <p className="text-white/70 text-sm">
                      ${parseFloat(item.product.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-white font-semibold">
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80">Subtotal:</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Store Credit Section */}
                {availableStoreCredit > 0 && (
                  <div className="bg-indigo-500/20 rounded-lg p-3 mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        Store Credit Available:
                      </span>
                      <span className="text-green-400">${availableStoreCredit.toFixed(2)}</span>
                    </div>
                    
                    {maxStoreCreditUsable > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUsedStoreCredit(maxStoreCreditUsable)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          Apply All (${maxStoreCreditUsable.toFixed(2)})
                        </Button>
                        {usedStoreCredit > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUsedStoreCredit(0)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {usedStoreCredit > 0 && (
                      <div className="flex justify-between items-center mt-2 text-green-400">
                        <span>Store Credit Applied:</span>
                        <span>-${usedStoreCredit.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80">Shipping:</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Information */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment & Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">What's Included:</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Secure Payment Processing</p>
                      <p className="text-white/70 text-sm">
                        256-bit SSL encryption with Stripe
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Shipping Address Collection</p>
                      <p className="text-white/70 text-sm">
                        Secure address entry on checkout page
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Discreet Packaging</p>
                      <p className="text-white/70 text-sm">
                        Private, secure shipping with tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Free Shipping</span>
                </div>
                <p className="text-white/80 text-sm">
                  No shipping charges on all orders. Fast, reliable delivery included.
                </p>
              </div>

              {/* Points Earned Preview */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300 font-medium">Points You'll Earn:</span>
                  </div>
                  <span className="text-xl font-bold text-purple-400">
                    +{Math.floor(total * 10)} pts
                  </span>
                </div>
                <p className="text-white/60 text-xs mt-1">
                  Earn 10 points for every dollar spent
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                data-testid="button-proceed-to-checkout"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Redirecting to Checkout...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Secure Checkout - ${total.toFixed(2)}
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-white/60 text-xs">
                  You'll be redirected to Stripe's secure checkout page to complete your payment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}