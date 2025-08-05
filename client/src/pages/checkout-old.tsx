import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Package, Truck, Shield, AlertTriangle, CreditCard } from 'lucide-react';

// Stripe hosted checkout approach - no need to load Stripe.js on client

interface ShippingRate {
  id: string;
  method: string;
  name: string;
  description: string;
  baseRate: string;
  perPoundRate: string;
  freeShippingThreshold: string | null;
  estimatedDays: string;
  trackingIncluded: boolean;
}

interface ShippingCost {
  cost: number;
  isFree: boolean;
  method: string;
}

const CheckoutButton = () => {
  const { toast } = useToast();
  const { items } = useCart();
  const total = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
  const [isLoading, setIsLoading] = useState(false);

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
        body: { items }
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

  // Load available states on component mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await apiRequest('/api/shipping/states');
        setAvailableStates(data);
      } catch (error) {
        console.error('Failed to load available states:', error);
        setAvailableStates([]);
      }
    };
    loadStates();
  }, []);

  // Validate state when changed
  const handleStateChange = async (stateCode: string) => {
    setShippingAddress(prev => ({ ...prev, state: stateCode }));
    setStateError('');
    
    try {
      const response = await apiRequest('/api/shipping/validate-state', {
        method: 'POST',
        body: { state: stateCode }
      });
      
      if (response.prohibited) {
        setStateError(response.message);
        toast({
          title: "Shipping Restricted",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      if (error.prohibited) {
        setStateError(error.message);
        toast({
          title: "Shipping Restricted",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.error('State validation error:', error);
      }
    }
  };

  // Calculate shipping cost
  const calculateShipping = async (method: string) => {
    try {
      const totalWeight = items.reduce((sum, item) => sum + (parseFloat((item.product as any).weight || '0.1') * item.quantity), 0);
      const shippingCost = await apiRequest('/api/shipping/calculate', {
        method: 'POST',
        body: {
          method,
          weight: totalWeight,
          subtotal: total
        }
      });
      
      onShippingChange(shippingCost);
    } catch (error) {
      console.error('Error calculating shipping:', error);
      // Default to free shipping if calculation fails
      onShippingChange({ cost: 0, isFree: true, method: 'standard' });
    }
  };

  useEffect(() => {
    calculateShipping(selectedShipping);
  }, [selectedShipping, items, total]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    // Validate shipping address state
    try {
      const stateResponse = await apiRequest('/api/shipping/validate-state', {
        method: 'POST',
        body: { state: shippingAddress.state }
      });

      if (!stateResponse.ok) {
        const error = await stateResponse.json();
        toast({
          title: "Shipping Restricted",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('State validation error:', error);
    }

    // Validate required shipping information
    if (!shippingAddress.name || !shippingAddress.email || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping information.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
        payment_method_data: {
          billing_details: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: {
              line1: shippingAddress.address,
              line2: shippingAddress.address2 || undefined,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.zip,
              country: shippingAddress.country,
            }
          }
        },
        shipping: {
          name: shippingAddress.name,
          address: {
            line1: shippingAddress.address,
            line2: shippingAddress.address2 || undefined,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.zip,
            country: shippingAddress.country,
          },
        },
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase! You'll receive a confirmation email shortly.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Shipping Information */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="address2">Address Line 2 (Optional)</Label>
              <Input
                id="address2"
                value={shippingAddress.address2}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, address2: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select 
                  value={shippingAddress.state} 
                  onValueChange={handleStateChange}
                >
                  <SelectTrigger className={stateError ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStates.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {stateError && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Hemp THCA products cannot be shipped to this state</span>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={shippingAddress.zip}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zip: e.target.value }))}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedShipping} onValueChange={setSelectedShipping}>
              <SelectTrigger>
                <SelectValue placeholder="Select shipping method" />
              </SelectTrigger>
              <SelectContent>
                {shippingRates.map((rate) => (
                  <SelectItem key={rate.method} value={rate.method}>
                    <div className="flex flex-col">
                      <span className="font-medium">{rate.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {rate.estimatedDays} • ${rate.baseRate} base + ${rate.perPoundRate}/lb
                        {rate.trackingIncluded && ' • Tracking included'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Payment - Integrated with Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Complete Your Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Total */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Order Total</span>
                <span className="text-2xl font-bold text-green-600">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
              </div>
            </div>

            {/* Card Information Section */}
            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Enter Card Information
                </h3>
                <p className="text-gray-600 mb-4">Your payment information is encrypted and secure. We accept all major credit and debit cards.</p>
              </div>
              
              <div className="border-2 border-green-200 rounded-lg p-6 bg-white shadow-sm">
                <PaymentElement 
                  options={{
                    layout: {
                      type: 'tabs',
                      defaultCollapsed: false,
                      radios: false,
                      spacedAccordionItems: true
                    },
                    fields: {
                      billingDetails: {
                        name: 'auto',
                        email: 'auto',
                        phone: 'auto',
                        address: {
                          line1: 'auto',
                          line2: 'auto',
                          city: 'auto',
                          state: 'auto',
                          postalCode: 'auto',
                          country: 'auto'
                        }
                      }
                    },
                    wallets: {
                      applePay: 'auto',
                      googlePay: 'auto'
                    }
                  }}
                />
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Shield className="w-4 h-4" />
                <span>🔒 256-bit SSL encryption • PCI DSS compliant • Powered by Stripe</span>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={!stripe || isLoading || !!stateError || !shippingAddress.state}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              data-testid="button-complete-order"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : stateError ? (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Cannot ship to selected state
                </>
              ) : !shippingAddress.state ? (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Select a state to continue
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Complete Order - ${total.toFixed(2)}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [shippingCost, setShippingCost] = useState<ShippingCost>({ cost: 0, isFree: false, method: 'standard' });
  const { items } = useCart();
  const total = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);

  useEffect(() => {
    // Fetch shipping rates
    const loadShippingRates = async () => {
      try {
        const data = await apiRequest('/api/shipping/rates');
        setShippingRates(data);
      } catch (error) {
        console.error('Error loading shipping rates:', error);
        setShippingRates([]);
      }
    };

    loadShippingRates();
  }, []);

  useEffect(() => {
    // Create PaymentIntent when items or shipping cost changes
    const createPaymentIntent = async () => {
      try {
        const data = await apiRequest("/api/create-payment-intent", { 
          method: "POST",
          body: {
            items,
            subtotal: total,
            shippingCost: shippingCost.cost
          }
        });

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };

    if (items.length > 0) {
      createPaymentIntent();
    }
  }, [items, total, shippingCost]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-purple-200">Add some products to your cart before checking out.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Checkout Not Available</h1>
            <p className="text-purple-200">Stripe is not configured. Add VITE_STRIPE_PUBLIC_KEY to enable payments.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full" aria-label="Loading"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Secure Checkout</h1>

        {/* Order Summary */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.quantity}`} className="flex justify-between">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingCost.isFree ? 'FREE' : `$${shippingCost.cost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(total + shippingCost.cost).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm shippingRates={shippingRates} onShippingChange={setShippingCost} />
        </Elements>
      </div>
    </div>
  );
}