import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Package, Truck, CheckCircle, Clock, Phone, Mail, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface Order {
  id: string;
  orderNumber: string;
  status: 'processing' | 'shipped' | 'delivered' | 'pending';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  paymentMethod: string;
  createdAt: string;
}

const statusConfig = {
  pending: { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: Clock, 
    label: 'Payment Pending' 
  },
  processing: { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: Package, 
    label: 'Processing' 
  },
  shipped: { 
    color: 'bg-purple-100 text-purple-800 border-purple-200', 
    icon: Truck, 
    label: 'Shipped' 
  },
  delivered: { 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle, 
    label: 'Delivered' 
  }
};

export default function OrderManagement() {
  const [orderNumber, setOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOrderSearch = async () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Order Number Required",
        description: "Please enter your order number to track your order.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/orders/track/${orderNumber}`);
      
      if (response.ok) {
        const order = await response.json();
        setSearchedOrder(order);
        toast({
          title: "Order Found!",
          description: `Order ${order.orderNumber} retrieved successfully.`,
        });
      } else if (response.status === 404) {
        toast({
          title: "Order Not Found",
          description: "Please check your order number and try again. Contact support if you need help.",
          variant: "destructive",
        });
        setSearchedOrder(null);
      } else {
        throw new Error('Failed to fetch order');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to retrieve order information. Please try again or contact support.",
        variant: "destructive",
      });
      setSearchedOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StatusIcon = searchedOrder ? statusConfig[searchedOrder.status].icon : Clock;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Order Management - Track Your THCA Orders | Mentally Chill</title>
        <meta 
          name="description" 
          content="Track your THCA order status, shipping information, and delivery updates. Enter your MC order number to get real-time tracking information." 
        />
        <meta property="og:title" content="Order Management - Track THCA Orders" />
        <meta property="og:description" content="Track your THCA product orders with real-time shipping and delivery updates. Fast, secure order tracking." />
        <meta name="keywords" content="order tracking, THCA order status, track shipment, order management, delivery tracking" />
      </Helmet>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Track your THCA product orders and get real-time delivery updates
        </p>
      </div>

      {/* Order Search */}
      <Card className="bg-gray-900/50 border-green-400/20 mb-8">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Track Your Order
          </CardTitle>
          <p className="text-gray-400">Enter your order number (format: MC123456) to track your shipment</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="orderNumber" className="sr-only">Order Number</Label>
              <Input
                id="orderNumber"
                data-testid="input-order-number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="Enter order number (e.g., MC123456)"
                className="bg-black/50 border-gray-600 focus:border-green-400"
                onKeyPress={(e) => e.key === 'Enter' && handleOrderSearch()}
              />
            </div>
            <Button 
              onClick={handleOrderSearch}
              data-testid="button-track-order"
              className="bg-green-600 hover:bg-green-700 min-w-32"
              disabled={isLoading}
            >
              {isLoading ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Searching...' : 'Track Order'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      {searchedOrder && (
        <div className="space-y-6">
          {/* Order Status */}
          <Card className="bg-gray-900/50 border-green-400/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400">Order Status</CardTitle>
                <Badge className={`${statusConfig[searchedOrder.status].color} border`}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {statusConfig[searchedOrder.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order Number:</span>
                      <span className="text-white font-mono">{searchedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order Date:</span>
                      <span className="text-white">{formatDate(searchedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-green-400 font-semibold">${searchedOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="text-white flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {searchedOrder.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Delivery Information</h4>
                  <div className="space-y-2 text-sm">
                    {searchedOrder.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tracking Number:</span>
                        <span className="text-blue-400 font-mono">{searchedOrder.trackingNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Delivery:</span>
                      <span className="text-white">{formatDate(searchedOrder.estimatedDelivery)}</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-400 block mb-1">Shipping Address:</span>
                      <span className="text-white text-xs">{searchedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="bg-gray-900/50 border-green-400/20">
            <CardHeader>
              <CardTitle className="text-green-400">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <h5 className="text-white font-medium">{item.name}</h5>
                      <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-green-400">${searchedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Section */}
      <Card className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-400/20">
        <CardHeader>
          <CardTitle className="text-blue-400">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400" />
                Contact Support
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-400 text-green-400">
                    📞 (702) 482-9794
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-400 text-blue-400">
                    📧 support@mentally-chill.com
                  </Badge>
                </div>
                <p className="text-gray-400 mt-2">
                  Available Mon-Fri 9 AM - 7 PM PST for order assistance
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Order Issues</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Order number not found? Check your email confirmation</li>
                <li>• Delivery delays? Weather or holidays may affect shipping</li>
                <li>• Missing items? Contact us within 48 hours of delivery</li>
                <li>• Payment issues? Cash App orders may take 1-2 hours to process</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}