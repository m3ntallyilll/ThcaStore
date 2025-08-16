import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { apiRequest } from '@/lib/queryClient';
import { ShippingInfo } from '@/components/shipping/shipping-info';
import { Loader2, Package, Truck, Shield, CreditCard, ArrowRight, Trophy, Coins, Tag, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Checkout() {
  const { items } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [usedStoreCredit, setUsedStoreCredit] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
  
  // Fetch store credit balance
  const { data: storeCreditBalance } = useQuery({
    queryKey: ['/api/store-credit/balance'],
  });
  
  const availableStoreCredit = (storeCreditBalance as any)?.balance || 0;
  const maxStoreCreditUsable = Math.min(availableStoreCredit, subtotal);
  const promoDiscount = appliedPromo?.discountAmount ? parseFloat(appliedPromo.discountAmount) : 0;
  const total = subtotal - usedStoreCredit - promoDiscount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Enter Promo Code",
        description: "Please enter a promo code to apply.",
        variant: "destructive",
      });
      return;
    }

    setIsValidatingPromo(true);
    try {
      const result = await apiRequest("/api/affiliate/validate-promo", {
        method: "POST",
        body: {
          code: promoCode.trim(),
          subtotal: subtotal
        }
      });

      if (result.valid) {
        setAppliedPromo(result);
        toast({
          title: "Promo Applied!",
          description: `${result.discountType === 'percentage' ? result.discountValue + '% off' : '$' + result.discountValue + ' off'} - You saved $${result.discountAmount}!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Invalid Promo Code",
        description: error.message || "The promo code entered is not valid.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast({
      title: "Promo Removed",
      description: "The promo code has been removed.",
    });
  };

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
      // Get affiliate code from cookie if exists
      const affiliateCode = document.cookie
        .split('; ')
        .find(row => row.startsWith('affiliate_ref='))
        ?.split('=')[1];

      const response = await apiRequest("/api/create-cash-app-order", {
        method: "POST",
        body: { 
          items,
          storeCreditUsed: usedStoreCredit,
          promoCode: appliedPromo?.promo?.code,
          promoDiscount: promoDiscount,
          affiliateCode: affiliateCode
        }
      });

      // Enhanced mobile detection for better payment experience
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      // Show device-specific instructions
      toast({
        title: isMobile ? "Opening Cash App..." : "Payment Instructions",
        description: isMobile 
          ? "You'll be redirected to Cash App to complete your payment. Include your order details in the payment note."
          : response.instructions,
        duration: isMobile ? 8000 : 12000,
      });
      
      // Small delay to let user see the toast before redirect
      setTimeout(() => {
        if (isMobile) {
          // Enhanced mobile Cash App forwarding with improved deep linking
          if (isIOS) {
            // iOS: Improved deep link approach
            const cashtag = response.cashAppLink.split('$')[1];
            const deepLink = `cashapp://qr?code=${cashtag}`;
            const webFallback = `https://cash.app/$${cashtag}`;
            
            // Try opening Cash App directly
            const startTime = Date.now();
            window.location.href = deepLink;
            
            // Fallback to web after short delay if app didn't open
            setTimeout(() => {
              // If still on same page after attempting deep link, use web fallback
              if (Date.now() - startTime > 1000) {
                window.open(webFallback, '_blank');
              }
            }, 1200);
            
          } else if (isAndroid) {
            // Android: Better intent handling with market fallback
            const cashtag = response.cashAppLink.split('$')[1];
            const cashAppPackage = 'com.squareup.cash';
            const webFallback = `https://cash.app/$${cashtag}`;
            const marketFallback = `market://details?id=${cashAppPackage}`;
            
            try {
              // Try Cash App intent first
              const intentUrl = `intent://qr?code=${cashtag}#Intent;package=${cashAppPackage};scheme=cashapp;S.browser_fallback_url=${encodeURIComponent(webFallback)};S.market_fallback_url=${encodeURIComponent(marketFallback)};end`;
              window.location.href = intentUrl;
            } catch (e) {
              // Fallback to web link if intent fails
              window.open(webFallback, '_blank');
            }
            
          } else {
            // Other mobile devices: enhanced web link handling
            const cashtag = response.cashAppLink.split('$')[1];
            const webUrl = `https://cash.app/$${cashtag}`;
            
            // Try to open in new window first, fallback to same window
            const newWindow = window.open(webUrl, '_blank', 'noopener,noreferrer');
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
              window.location.href = webUrl;
            }
          }
        } else {
          // Desktop: try to open in new tab, fallback to same window
          const newWindow = window.open(response.cashAppLink, '_blank', 'noopener,noreferrer,width=600,height=800');
          // If popup was blocked, redirect in same window after delay
          if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
            setTimeout(() => {
              window.location.href = response.cashAppLink;
            }, 500);
          }
        }
      }, 1000);
      
    } catch (error: any) {
      console.error('Cash App order error:', error);
      toast({
        title: "Order Failed",
        description: error.message || "Unable to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
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
      <Helmet>
        <title>Secure THCA Checkout - Complete Your Order | Mentally-Chill</title>
        <meta name="description" content="Complete your secure THCA checkout with Cash App Pay. Fast shipping, store credit accepted, promo codes available. Finish your premium hemp product order now." />
        <meta name="keywords" content="THCA checkout, secure cannabis payment, Cash App THCA, hemp products checkout, store credit checkout, promo code THCA" />
        <meta property="og:title" content="Secure THCA Checkout - Complete Your Order" />
        <meta property="og:description" content="Complete your secure checkout for premium THCA products with fast shipping and multiple payment options." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mentally-chill.online/checkout" />

      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Secure Checkout</h1>

        {/* Prominent Shipping Information */}
        <div className="max-w-6xl mx-auto mb-8">
          <ShippingInfo variant="detailed" />
        </div>

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
                
                {/* Promo Code Section */}
                <div className="bg-purple-500/20 rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-purple-300" />
                    <span className="text-white/80 text-sm">Have a promo code?</span>
                  </div>
                  {!appliedPromo ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        disabled={isValidatingPromo}
                      />
                      <Button
                        onClick={handleApplyPromo}
                        disabled={isValidatingPromo || !promoCode.trim()}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isValidatingPromo ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-500/20 rounded p-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">{appliedPromo.promo.code}</span>
                        <span className="text-white/70 text-sm">
                          ({appliedPromo.discountType === 'percentage' ? 
                            `${appliedPromo.discountValue}% off` : 
                            `$${appliedPromo.discountValue} off`})
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleRemovePromo}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                {/* Promo Discount Display */}
                {appliedPromo && (
                  <div className="flex justify-between items-center mb-2 text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Promo Discount:
                    </span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}

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
                      <p className="text-white font-medium">Cash App Pay</p>
                      <p className="text-white/70 text-sm">
                        Secure payment with Cash App - THCA-friendly processing
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
                style={{ backgroundColor: '#00d632' }}
                className="w-full hover:bg-[#00c02e] text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                data-testid="button-proceed-to-checkout"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Redirecting to Cash App...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay with Cash App - ${total.toFixed(2)}
                  </>
                )}
              </Button>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
                <div className="text-center">
                  <p className="text-green-400 font-medium text-sm mb-2">
                    📱 Mobile Payment Instructions
                  </p>
                  <div className="space-y-2 text-white/80 text-xs">
                    <p className="font-medium">Step 1: Click the green button above</p>
                    <p>Step 2: You'll be redirected to Cash App automatically</p>
                    <p>Step 3: Complete the ${total.toFixed(2)} payment</p>
                    <p>Step 4: Include your order items in the payment note</p>
                    <p className="text-green-400 mt-2">✅ Order confirmed within 24 hours via email</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}