import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Zap, TrendingUp, Users, Target, BarChart3, Sparkles, RefreshCw, DollarSign } from 'lucide-react';

export default function AIDealsGenerator() {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [generationData, setGenerationData] = useState({
    targetAudience: '',
    season: '',
    products: '',
    minDiscount: 10,
    maxDiscount: 50,
    urgency: 'medium',
    marketingGoal: 'acquisition'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch deals analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/admin/deals/analytics'],
    queryFn: () => apiRequest('/api/admin/deals/analytics')
  });

  // Generate AI deals mutation
  const generateDealsMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('/api/admin/deals/generate', { method: 'POST', body: data }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/offers'] });
      setIsGenerateDialogOpen(false);
      toast({ 
        title: 'AI deals generated successfully!', 
        description: `Created ${result.deals.length} strategic promotional offers.` 
      });
    },
    onError: (error: any) => {
      toast({ title: 'Error generating deals', description: error.message, variant: 'destructive' });
    }
  });

  // Activate deal strategy mutation
  const activateStrategyMutation = useMutation({
    mutationFn: () => 
      apiRequest('/api/admin/deals/activate-strategy', { method: 'POST', body: {} }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/offers'] });
      toast({ 
        title: 'Deal strategy activated!', 
        description: result.message 
      });
    },
    onError: (error: any) => {
      toast({ title: 'Error activating strategy', description: error.message, variant: 'destructive' });
    }
  });

  const handleGenerateDeals = async () => {
    if (!generationData.targetAudience || !generationData.marketingGoal) {
      toast({ title: 'Please provide target audience and marketing goal', variant: 'destructive' });
      return;
    }

    const products = generationData.products.split(',').map(p => p.trim()).filter(Boolean);
    await generateDealsMutation.mutateAsync({
      targetAudience: generationData.targetAudience,
      season: generationData.season,
      products,
      discountRange: {
        min: generationData.minDiscount,
        max: generationData.maxDiscount
      },
      urgency: generationData.urgency,
      marketingGoal: generationData.marketingGoal
    });
  };

  const handleActivateStrategy = async () => {
    setIsActivating(true);
    try {
      await activateStrategyMutation.mutateAsync();
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">AI Deals Generator</h2>
          <p className="text-gray-400">Generate intelligent promotional offers with Groq AI</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Deals
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-800 border-dark-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Generate AI-Powered Deals
                </DialogTitle>
                <DialogDescription>
                  Create strategic promotional offers tailored to your business goals using advanced AI.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetAudience" className="text-white">Target Audience *</Label>
                    <Input
                      id="targetAudience"
                      value={generationData.targetAudience}
                      onChange={(e) => setGenerationData(prev => ({ ...prev, targetAudience: e.target.value }))}
                      placeholder="e.g., new customers, high-value buyers"
                      className="bg-dark-700 border-dark-600 text-white"
                      aria-label="Target Audience"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="marketingGoal" className="text-white">Marketing Goal *</Label>
                    <Select value={generationData.marketingGoal} onValueChange={(value) => setGenerationData(prev => ({ ...prev, marketingGoal: value }))}>
                      <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-700 border-dark-600">
                        <SelectItem value="acquisition" className="text-white hover:bg-dark-600">Customer Acquisition</SelectItem>
                        <SelectItem value="retention" className="text-white hover:bg-dark-600">Customer Retention</SelectItem>
                        <SelectItem value="upsell" className="text-white hover:bg-dark-600">Upselling</SelectItem>
                        <SelectItem value="clearance" className="text-white hover:bg-dark-600">Inventory Clearance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="season" className="text-white">Season/Context</Label>
                    <Input
                      id="season"
                      value={generationData.season}
                      onChange={(e) => setGenerationData(prev => ({ ...prev, season: e.target.value }))}
                      placeholder="e.g., holiday season, summer sale"
                      className="bg-dark-700 border-dark-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="urgency" className="text-white">Urgency Level</Label>
                    <Select value={generationData.urgency} onValueChange={(value) => setGenerationData(prev => ({ ...prev, urgency: value }))}>
                      <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-700 border-dark-600">
                        <SelectItem value="low" className="text-white hover:bg-dark-600">Low - Long-term</SelectItem>
                        <SelectItem value="medium" className="text-white hover:bg-dark-600">Medium - Standard</SelectItem>
                        <SelectItem value="high" className="text-white hover:bg-dark-600">High - Flash Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="products" className="text-white">Target Products (comma-separated)</Label>
                  <Textarea
                    id="products"
                    value={generationData.products}
                    onChange={(e) => setGenerationData(prev => ({ ...prev, products: e.target.value }))}
                    placeholder="e.g., flower, pre-rolls, edibles (leave empty for all products)"
                    className="bg-dark-700 border-dark-600 text-white"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minDiscount" className="text-white">Min Discount %</Label>
                    <Input
                      id="minDiscount"
                      type="number"
                      value={generationData.minDiscount}
                      onChange={(e) => setGenerationData(prev => ({ ...prev, minDiscount: parseInt(e.target.value) || 10 }))}
                      min="5"
                      max="50"
                      className="bg-dark-700 border-dark-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxDiscount" className="text-white">Max Discount %</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      value={generationData.maxDiscount}
                      onChange={(e) => setGenerationData(prev => ({ ...prev, maxDiscount: parseInt(e.target.value) || 50 }))}
                      min="10"
                      max="70"
                      className="bg-dark-700 border-dark-600 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerateDeals}
                  disabled={generateDealsMutation.isPending || !generationData.targetAudience || !generationData.marketingGoal}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {generateDealsMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Deals...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Deals
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleActivateStrategy}
            disabled={isActivating}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isActivating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Activating...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Activate Deal Strategy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-dark-800 border-dark-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Deals</CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.totalActiveDeals}</div>
              <p className="text-xs text-gray-500">
                of {analytics.totalDeals} total deals
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-dark-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Discount</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.averageDiscount?.toFixed(1)}%</div>
              <p className="text-xs text-gray-500">
                across active deals
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-dark-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Expiring Today</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.expiringToday}</div>
              <p className="text-xs text-gray-500">
                deals ending today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-dark-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Deal Types</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(analytics.byDiscountType || {}).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 capitalize">{type}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              Customer Acquisition
            </CardTitle>
            <CardDescription>
              Attract new customers with compelling welcome offers and first-time buyer incentives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Welcome discounts (20-30%)</li>
              <li>• First-time buyer bonuses</li>
              <li>• Trial packages and samplers</li>
              <li>• Referral incentives</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-400" />
              Customer Retention
            </CardTitle>
            <CardDescription>
              Keep existing customers engaged with loyalty rewards and exclusive offers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Loyalty member exclusives</li>
              <li>• Volume purchase discounts</li>
              <li>• Birthday and anniversary deals</li>
              <li>• VIP early access offers</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Revenue Optimization
            </CardTitle>
            <CardDescription>
              Maximize order values and clear inventory with strategic bundle offers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Bundle deals and packages</li>
              <li>• Buy more, save more tiers</li>
              <li>• Clearance promotions</li>
              <li>• Cross-selling incentives</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Info */}
      <Card className="bg-dark-800 border-dark-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
            AI-Powered Deal Intelligence
          </CardTitle>
          <CardDescription>
            Advanced features powered by Groq AI for maximum promotional effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Smart Generation Features</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Psychological trigger optimization</li>
                <li>• Competitive analysis integration</li>
                <li>• Profit margin protection</li>
                <li>• Seasonal trend adaptation</li>
                <li>• Customer segment targeting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Performance Optimization</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Real-time effectiveness tracking</li>
                <li>• A/B testing recommendations</li>
                <li>• ROI prediction modeling</li>
                <li>• Conversion rate optimization</li>
                <li>• Personalized offer creation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}