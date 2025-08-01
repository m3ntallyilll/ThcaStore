import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DailyDeals } from '@/components/promotions/daily-deals';
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
  Gift,
  Settings,
  Loader2
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
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Generate daily deals with Groq AI
  const generateDealsMutation = useMutation({
    mutationFn: (params: { targetRevenue: number; customerSegment: string; inventoryFocus: string }) => 
      apiRequest('/api/ai/generate-daily-deals', {
        method: 'POST',
        body: JSON.stringify(params)
      }),
    onSuccess: (data) => {
      toast({
        title: "AI Daily Deals Generated!",
        description: `${data.dealCount} Groq AI-powered deals created successfully.`,
      });
      // Refresh deals data
      queryClient.invalidateQueries({ queryKey: ['/api/promotions/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/promotions/week'] });
    }
  });

  // AI Sales Activation mutation
  const activateSalesMutation = useMutation({
    mutationFn: (strategyId: string) => 
      apiRequest('/api/ai/activate-sales', {
        method: 'POST',
        body: JSON.stringify({ strategyId })
      }),
    onSuccess: (data) => {
      setActivationResult(data);
      toast({
        title: "AI Sales System Activated!",
        description: "Your AI-powered sales optimization is now live and working to increase conversions.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('AI activation failed:', error);
      toast({
        title: "Activation Failed",
        description: "There was an error activating the AI sales system. Please try again.",
        variant: "destructive",
      });
    }
  });

  // State for activation results
  const [activationResult, setActivationResult] = useState<any>(null);

  const salesGuarantees = [
    {
      title: "Inventory-Focused AI Strategy",
      description: "Target your 30 lbs of premium flower (15 sativa, 10 indica, 5 hybrid) with strain-specific marketing and optimal pricing",
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      guarantee: "Move 2-3 lbs flower per week with 25% higher margins"
    },
    {
      title: "Pre-Roll Volume Optimization", 
      description: "Smart promotion of 15,000 pre-rolls with special focus on 5,000 premium infused units for maximum revenue",
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      guarantee: "800-1200 pre-roll sales weekly with 35% conversion on infused"
    },
    {
      title: "Premium Strain Positioning",
      description: "Leverage top strain names like Blue Dream, OG Kush, and Girl Scout Cookies to command premium pricing",
      icon: <Target className="w-5 h-5 text-blue-400" />,
      guarantee: "High-mids quality positioned at premium prices with 40% profit margins"
    },
    {
      title: "Smart Bundle Creation",
      description: "AI-powered bundling of flower with pre-rolls to increase average order value and move inventory efficiently",
      icon: <ShoppingCart className="w-5 h-5 text-orange-400" />,
      guarantee: "35% increase in average order value through intelligent product pairing"
    }
  ];

  const aiTactics = [
    "Sativa morning promotions targeting energy-seeking customers (Blue Dream, Green Crack)",
    "Evening indica campaigns for relaxation seekers (OG Kush, Purple Punch)",
    "Infused pre-roll premium positioning with limited stock urgency messaging",
    "High-mids flower value positioning against premium competitors", 
    "Strain-specific education content driving informed purchasing decisions",
    "Bundle deals pairing flower with matching pre-rolls for convenience",
    "Bulk discount tiers encouraging larger purchases to move inventory faster",
    "Seasonal promotions matching strain effects with customer lifestyle needs"
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

  const activateStrategy = async (strategyId: string) => {
    try {
      setIsActivating(true);
      const response = await apiRequest('/api/ai/activate-sales', {
        method: 'POST',
        body: JSON.stringify({ strategyId })
      });

      if (response.success) {
        toast({
          title: "AI Sales Strategy Activated!",
          description: "Your sales optimization is now live and driving conversions.",
        });
        // Refresh deals and strategy data
        queryClient.invalidateQueries({ queryKey: ['/api/promotions/today'] });
        queryClient.invalidateQueries({ queryKey: ['/api/ai/sales-strategies'] });
      } else {
        throw new Error('Failed to activate strategy');
      }
    } catch (error: any) {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate sales strategy",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold text-white">AI-Powered Sales Strategy & Daily Deals</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Leverage Groq AI technology to optimize sales strategies and generate dynamic daily hemp deals 
          that drive conversions and maximize revenue for your THCA business.
        </p>
      </div>

      {/* Integrated Daily Deals Section */}
      <Card className="bg-gradient-to-r from-green-900/20 to-purple-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Gift className="w-6 h-6 text-green-400" />
            AI-Generated Daily Hemp Deals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => generateDealsMutation.mutate({
                targetRevenue: 2500,
                customerSegment: 'Hemp enthusiasts',
                inventoryFocus: 'High-margin products'
              })}
              disabled={generateDealsMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {generateDealsMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Generate AI Deals with Groq
            </Button>
            <Button
              onClick={() => activateStrategy('groq-deals-integration')}
              disabled={isActivating}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
            >
              {isActivating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Activate Deal Strategy
            </Button>
          </div>
          <DailyDeals />
        </CardContent>
      </Card>

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
            Our AI-driven approach has helped hemp businesses increase revenue by an average of 127% 
            within the first 90 days. Join the revolution in intelligent commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => activateSalesMutation.mutate("conversion-optimization")}
              disabled={activateSalesMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              {activateSalesMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Activate AI Sales System
                </>
              )}
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-3">
              <Settings className="mr-2 h-4 w-4" />
              Schedule Strategy Consultation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Activation Results */}
      {activationResult && (
        <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="w-6 h-6 text-green-400" />
              AI Sales System Activated Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-green-900/20 border-green-500/30">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <AlertDescription className="text-green-300">
                <strong>Activation Complete:</strong> Your AI-powered sales system is now live and optimizing your store performance.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-white mb-3">Activated Features:</h4>
                <div className="space-y-2">
                  {activationResult.features?.map((feature: any, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-dark-700 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">{feature.name}</span>
                        <p className="text-sm text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Expected Performance Improvements:</h4>
                <div className="space-y-3">
                  {activationResult.metrics && Object.entries(activationResult.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
                      <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Badge className="bg-green-600 text-white">{value as string}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Inventory Display */}
            {activationResult.inventoryFocus && (
              <div>
                <h4 className="font-semibold text-white mb-3">Current Inventory Focus:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-700 rounded-lg">
                    <h5 className="font-medium text-green-400 mb-2">Flower Inventory (30 lbs)</h5>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-300">• Sativa: {activationResult.inventoryFocus.flower.sativa}</div>
                      <div className="text-gray-300">• Indica: {activationResult.inventoryFocus.flower.indica}</div>
                      <div className="text-gray-300">• Hybrid: {activationResult.inventoryFocus.flower.hybrid}</div>
                    </div>
                  </div>
                  <div className="p-4 bg-dark-700 rounded-lg">
                    <h5 className="font-medium text-blue-400 mb-2">Pre-Roll Inventory</h5>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-300">• Total: {activationResult.inventoryFocus.preRolls.total}</div>
                      <div className="text-gray-300">• Infused: {activationResult.inventoryFocus.preRolls.infused}</div>
                      <div className="text-gray-300">• Regular: {activationResult.inventoryFocus.preRolls.regular}</div>
                      <div className="text-gray-300">• Strains: {activationResult.inventoryFocus.preRolls.strains}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Targets */}
            {activationResult.salesTargets && (
              <div>
                <h4 className="font-semibold text-white mb-3">AI Sales Targets:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(activationResult.salesTargets).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg text-center">
                      <div className="text-yellow-400 font-bold">{value as string}</div>
                      <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activationResult.nextSteps && (
              <div>
                <h4 className="font-semibold text-white mb-3">AI Strategy Actions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activationResult.nextSteps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center p-4 bg-purple-900/20 rounded-lg">
              <p className="text-purple-300 font-medium">
                AI System Activated at: {new Date(activationResult.activatedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}