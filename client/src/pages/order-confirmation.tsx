import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Mail, ArrowLeft } from 'lucide-react';

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  useEffect(() => {
    // Get payment intent from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const pi = urlParams.get('payment_intent');
    if (pi) {
      setPaymentIntent(pi);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Order Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-gray-600">
            <p className="text-lg mb-2">Thank you for your purchase!</p>
            <p>Your order has been successfully processed and you'll receive a confirmation email shortly.</p>
          </div>

          {paymentIntent && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Payment Intent ID:</p>
              <p className="font-mono text-sm break-all">{paymentIntent}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold">Processing</p>
                <p className="text-sm text-gray-600">Your order is being prepared</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Mail className="w-8 h-8 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold">Email Sent</p>
                <p className="text-sm text-gray-600">Confirmation details sent</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setLocation('/')}
              className="w-full bg-green-600 hover:bg-green-700"
              data-testid="button-continue-shopping"
            >
              Continue Shopping
            </Button>
            
            <Button 
              onClick={() => setLocation('/products')}
              variant="outline"
              className="w-full"
              data-testid="button-view-products"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>

          <div className="text-xs text-gray-500 mt-8">
            <p>Questions about your order? Contact our support team.</p>
            <p>We're here to help with any questions or concerns.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}