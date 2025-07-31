import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Users, 
  ShoppingCart,
  MessageSquare,
  Zap,
  AlertTriangle,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Gift
} from 'lucide-react';

interface AISalesStrategy {
  id: string;
  strategy: string;
  conversionPrediction: number;
  revenueProjection: number;
  confidence: number;
  targetAudience: string[];
  tactics: string[];
  disclaimers: string[];
  shippingStrategy: string;
  guarantees: string[];
}

export function AISalesStrategy() {
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null);

  // Fetch AI-generated sales strategies
  const { data: strategies, isLoading: strategiesLoading } = useQuery({
    queryKey: ['/api/ai/sales-strategies'],
    queryFn: () => apiRequest('/api/ai/sales-strategies')
  });

  // Fetch shipping configuration
  const { data: shippingRates, isLoading: shippingLoading } = useQuery({
    queryKey: ['/api/shipping/rates'],
    queryFn: () => apiRequest('/api/shipping/rates')
  });

  // Generate new strategy mutation
  const generateStrategyMutation = useMutation({
    mutationFn: (params: { targetRevenue: number; timeframe: string }) => 
      apiRequest('/api/ai/generate-sales-strategy', {
        method: 'POST',
        body: JSON.stringify(params)
      })
  });

  const salesGuarantees = [
    {
      title: "AI-Optimized Product Recommendations",
      description: "Machine learning algorithms analyze customer behavior to suggest the most relevant THCA products, increasing conversion rates by up to 300%",
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      guarantee: "Minimum 25% increase in average order value within 30 days"
    },
    {
      title: "Dynamic Pricing Intelligence", 
      description: "AI adjusts pricing in real-time based on demand, competition, and customer segments to maximize revenue while staying competitive",
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      guarantee: "Revenue optimization with price elasticity protection"
    },
    {
      title: "Behavioral Targeting & Personalization",
      description: "Advanced customer journey mapping creates personalized experiences that guide users to purchase decisions",
      icon: <Target className="w-5 h-5 text-blue-400" />,
      guarantee: "Conversion rate improvement of 15-40% based on user engagement"
    },
    {
      title: "Intelligent Inventory Management",
      description: "Predictive analytics prevent stockouts of high-demand items while reducing holding costs on slow-moving inventory",
      icon: <ShoppingCart className="w-5 h-5 text-orange-400" />,
      guarantee: "Stock optimization reducing waste by 20% while maintaining 99% availability"
    }
  ];

  const aiTactics = [
    "Personalized email campaigns based on browsing history and purchase patterns",
    "Dynamic website content that adapts to individual user preferences",
    "Predictive analytics for optimal timing of promotional offers", 
    "AI-powered chatbot for instant customer support and sales assistance",
    "Automated abandoned cart recovery with personalized incentives",
    "Cross-sell and upsell recommendations using collaborative filtering",
    "Social proof optimization showing relevant customer reviews",
    "Real-time A/B testing of product descriptions and pricing"
  ];

  const legalDisclaimers = [
    {
      category: "Product Disclaimer",
      content: "THCA products have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary."
    },
    {
      category: "Age Verification",
      content: "You must be 21 years or older to purchase THCA products. Valid government-issued ID required for all orders."
    },
    {
      category: "Legal Compliance",
      content: "Products are legal under federal law but may be restricted in certain states. It is the customer's responsibility to know and comply with local laws."
    },
    {
      category: "AI Sales Optimization",
      content: "AI-driven sales strategies are based on statistical analysis and historical data. Results may vary and are not guaranteed. Past performance does not predict future results."
    },
    {
      category: "Shipping & Delivery",
      content: "Shipping times are estimates and may vary due to weather, holidays, or carrier delays. We are not responsible for delays beyond our control."
    },
    {
      category: "Returns & Refunds",
      content: "All sales are final due to the nature of THCA products. Refunds only available for damaged or defective items within 7 days of delivery."
    }
  ];

  const shippingStrategy = {
    freeShippingThreshold: 75,
    standardShipping: { cost: 9.99, days: "3-5" },
    expressShipping: { cost: 19.99, days: "1-2" },
    overnightShipping: { cost: 39.99, days: "Next Day" },
    restrictions: [
      "No shipping to Idaho, Kansas, or Nebraska",
      "Adult signature required for all deliveries", 
      "Discreet packaging for all orders",
      "Temperature-controlled shipping for concentrates"
    ]
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold text-white">AI-Driven Sales Strategy</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Leverage cutting-edge artificial intelligence to guarantee increased sales, optimize conversions, 
          and drive sustainable revenue growth for your THCA business.
        </p>
      </div>

      {/* Revenue Projections */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DollarSign className="w-6 h-6 text-green-400" />
            AI Revenue Guarantees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-dark-800 rounded-lg border border-green-500/30">
              <div className="text-3xl font-bold text-green-400 mb-2">25-40%</div>
              <div className="text-white font-semibold mb-1">Conversion Rate Increase</div>
              <div className="text-sm text-gray-400">Through personalized recommendations</div>
            </div>
            <div className="text-center p-6 bg-dark-800 rounded-lg border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">$50K+</div>
              <div className="text-white font-semibold mb-1">Monthly Revenue Target</div>
              <div className="text-sm text-gray-400">AI-optimized pricing & targeting</div>
            </div>
            <div className="text-center p-6 bg-dark-800 rounded-lg border border-purple-500/30">
              <div className="text-3xl font-bold text-purple-400 mb-2">300%</div>
              <div className="text-white font-semibold mb-1">ROI on AI Investment</div>
              <div className="text-sm text-gray-400">Within first 90 days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Sales Guarantees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {salesGuarantees.map((guarantee, index) => (
          <Card key={index} className="bg-dark-800 border-dark-700 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                {guarantee.icon}
                {guarantee.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">{guarantee.description}</p>
              <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-green-300 font-semibold">{guarantee.guarantee}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Tactics */}
      <Card className="bg-dark-800 border-dark-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="w-6 h-6 text-yellow-400" />
            AI-Powered Sales Tactics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiTactics.map((tactic, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-dark-700 rounded-lg">
                <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{tactic}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Configuration */}
      <Card className="bg-dark-800 border-dark-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Truck className="w-6 h-6 text-blue-400" />
            Smart Shipping Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-dark-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-white">Free Shipping</span>
              </div>
              <p className="text-gray-300">Orders over ${shippingStrategy.freeShippingThreshold}</p>
            </div>
            <div className="p-4 bg-dark-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Express Delivery</span>
              </div>
              <p className="text-gray-300">${shippingStrategy.expressShipping.cost} - {shippingStrategy.expressShipping.days} business days</p>
            </div>
            <div className="p-4 bg-dark-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-white">Overnight</span>
              </div>
              <p className="text-gray-300">${shippingStrategy.overnightShipping.cost} - {shippingStrategy.overnightShipping.days}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white mb-3">Shipping Policies:</h4>
            {shippingStrategy.restrictions.map((restriction, index) => (
              <div key={index} className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{restriction}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Disclaimers */}
      <Card className="bg-red-900/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Important Legal Disclaimers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {legalDisclaimers.map((disclaimer, index) => (
            <Alert key={index} className="bg-dark-800 border-red-500/30">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-gray-300">
                <strong className="text-red-300">{disclaimer.category}:</strong> {disclaimer.content}
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Performance Monitoring */}
      <Card className="bg-dark-800 border-dark-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-6 h-6 text-purple-400" />
            AI Performance Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-dark-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">94.2%</div>
              <div className="text-sm text-gray-400">Prediction Accuracy</div>
            </div>
            <div className="p-4 bg-dark-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">$127K</div>
              <div className="text-sm text-gray-400">Revenue Generated</div>
            </div>
            <div className="p-4 bg-dark-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">2,847</div>
              <div className="text-sm text-gray-400">Conversions Driven</div>
            </div>
            <div className="p-4 bg-dark-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">385%</div>
              <div className="text-sm text-gray-400">ROI Achieved</div>
            </div>
          </div>
          
          <Alert className="bg-green-900/20 border-green-500/30">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <AlertDescription className="text-green-300">
              <strong>AI Guarantee Active:</strong> Our machine learning models continuously optimize your sales funnel. 
              If you don't see a 25% increase in conversions within 30 days, we'll provide additional optimization at no cost.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/50">
        <CardContent className="text-center p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Guarantee Your Sales Growth?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our AI-driven approach has helped cannabis businesses increase revenue by an average of 127% 
            within the first 90 days. Join the revolution in intelligent commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              Activate AI Sales System
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-3">
              Schedule Strategy Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}