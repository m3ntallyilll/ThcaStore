import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

export default function OrderConfirmation() {
  const [location] = useLocation();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Extract session_id from URL parameters
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get('session_id');
    
    if (session_id) {
      setSessionId(session_id);
      // Clear the cart on successful payment
      clearCart();
    } else {
      // Check for stored order information from Cash App return
      const storedOrderId = localStorage.getItem('pendingOrderId');
      const storedOrderRef = localStorage.getItem('pendingOrderRef');
      
      if (storedOrderRef) {
        setSessionId(storedOrderRef);
        // Clear stored order info and cart
        localStorage.removeItem('pendingOrderId');
        localStorage.removeItem('pendingOrderRef');
        clearCart();
      }
    }
  }, [location, clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Order Confirmed!
              </CardTitle>
              <p className="text-white/80">
                Thank you for your purchase. Your order has been successfully processed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {sessionId && (
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-white/60">Order Reference:</p>
                  <p className="text-white font-mono text-sm break-all">
                    {sessionId}
                  </p>
                </div>
              )}

              {/* Invoice Download Section */}
              {sessionId && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Download Invoice</p>
                      <p className="text-white/60 text-sm">Get a professional invoice for your records</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <a 
                          href={`/api/orders/${sessionId}/invoice?format=html`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View HTML
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <a 
                          href={`/api/orders/${sessionId}/invoice?format=pdf`} 
                          download
                        >
                          Download PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">What's Next?</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Order Processing</p>
                      <p className="text-white/70 text-sm">
                        We'll prepare your order within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Packaging</p>
                      <p className="text-white/70 text-sm">
                        Discreet packaging with secure sealing
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Shipping</p>
                      <p className="text-white/70 text-sm">
                        Tracking information will be sent to your email
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3">
                <h4 className="text-blue-200 font-semibold">📞 Contact Information</h4>
                <div className="space-y-2 text-blue-100">
                  <p><strong>Phone:</strong> (702) 482-9794</p>
                  <p><strong>Email:</strong> support@mentally-chill.com</p>
                  <p><strong>Business Hours:</strong> 9 AM - 8 PM PST</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-200 text-sm">
                  <strong>Payment Verification:</strong> After sending payment via Cash App, 
                  text your order number to (702) 482-9794 for fastest processing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  asChild 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link href="/products">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild 
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}