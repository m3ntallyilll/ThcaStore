import { Truck, Shield, Package, Clock, MapPin, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ShippingInfoProps {
  variant?: 'banner' | 'card' | 'compact' | 'detailed';
  className?: string;
}

export function ShippingInfo({ variant = 'card', className = '' }: ShippingInfoProps) {
  
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-4 mb-6 ${className}`}>
        <div className="flex flex-wrap items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2 text-green-300">
            <Truck className="h-5 w-5" />
            <span className="font-semibold">FREE Shipping Over $75</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300">
            <Clock className="h-5 w-5" />
            <span>Express 1-2 Days ($19.99)</span>
          </div>
          <div className="flex items-center gap-2 text-purple-300">
            <Package className="h-5 w-5" />
            <span>Overnight ($39.99)</span>
          </div>
          <div className="flex items-center gap-2 text-orange-300">
            <Shield className="h-5 w-5" />
            <span>Discreet Packaging</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white/5 border border-white/10 rounded-lg p-3 ${className}`}>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-green-400">
            <Truck className="h-4 w-4" />
            <span>FREE Shipping on orders $75+</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="h-4 w-4" />
            <span>Express delivery available</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Shield className="h-4 w-4" />
            <span>Adult signature required</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={`bg-white/10 border-white/20 backdrop-blur-md ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-400" />
            Smart Shipping Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {/* Free Shipping */}
            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Truck className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <div className="font-semibold text-green-300">Free Shipping</div>
                <div className="text-white/80 text-sm">Orders over $75</div>
              </div>
              <Badge className="bg-green-500 text-white ml-auto">FREE</Badge>
            </div>

            {/* Express Delivery */}
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Clock className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-300">Express Delivery</div>
                <div className="text-white/80 text-sm">1-2 business days</div>
              </div>
              <Badge className="bg-blue-500 text-white ml-auto">$19.99</Badge>
            </div>

            {/* Overnight */}
            <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Package className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <div className="font-semibold text-purple-300">Overnight</div>
                <div className="text-white/80 text-sm">Next day delivery</div>
              </div>
              <Badge className="bg-purple-500 text-white ml-auto">$39.99</Badge>
            </div>
          </div>

          {/* Shipping Policies */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="font-semibold text-white mb-3">Shipping Policies:</h4>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-400" />
                <span>No shipping to Idaho, Kansas, or Nebraska</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-yellow-400" />
                <span>Adult signature required for all deliveries</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-green-400" />
                <span>Discreet packaging for all orders</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-blue-400" />
                <span>Temperature-controlled shipping for concentrates</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default card variant
  return (
    <Card className={`bg-white/5 border-white/20 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Truck className="h-5 w-5 text-green-400" />
          Shipping Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-green-500/10 rounded">
          <span className="text-white">Free Shipping</span>
          <span className="text-green-400 font-semibold">Orders $75+</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white/5 rounded">
          <span className="text-white">Express (1-2 days)</span>
          <span className="text-blue-400 font-semibold">$19.99</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white/5 rounded">
          <span className="text-white">Overnight</span>
          <span className="text-purple-400 font-semibold">$39.99</span>
        </div>
        <div className="text-xs text-white/60 mt-3">
          <p>• Adult signature required</p>
          <p>• Discreet packaging included</p>
          <p>• No shipping to ID, KS, NE</p>
        </div>
      </CardContent>
    </Card>
  );
}