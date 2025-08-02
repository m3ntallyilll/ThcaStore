import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Zap, 
  Leaf, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Rocket,
  ShoppingCart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkProductRequest {
  productType: 'pre-roll' | 'flower';
  strainType: 'indica' | 'sativa' | 'hybrid';
  count: number;
  priceRange: { min: number; max: number };
  thcRange: { min: number; max: number };
  includeDeals: boolean;
  includePackages: boolean;
}

interface BulkProductResult {
  success: boolean;
  message: string;
  generated: number;
  failed: number;
  totalRequested: number;
  deals: number;
  results: Array<{
    name: string;
    success: boolean;
    error: string | null;
    id: string | null;
    strainName: string | null;
    price: string | null;
  }>;
}

export default function BulkProductGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<BulkProductRequest>({
    productType: 'pre-roll',
    strainType: 'indica',
    count: 100,
    priceRange: { min: 8, max: 25 },
    thcRange: { min: 18, max: 32 },
    includeDeals: false,
    includePackages: false
  });

  const [results, setResults] = useState<BulkProductResult | null>(null);

  const bulkGenerationMutation = useMutation({
    mutationFn: (data: BulkProductRequest) => 
      apiRequest('/api/admin/products/ai/bulk-generate', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data: BulkProductResult) => {
      setResults(data);
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      toast({
        title: "Bulk Product Generation Complete!",
        description: `Successfully generated ${data.generated} out of ${data.totalRequested} products`,
        variant: data.failed > 0 ? "destructive" : "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate products",
        variant: "destructive"
      });
    }
  });

  const massiveInventoryMutation = useMutation({
    mutationFn: () => 
      apiRequest('/api/admin/products/ai/quick-setup', {
        method: 'POST',
        body: JSON.stringify({})
      }),
    onSuccess: (data: any) => {
      setResults(data);
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      toast({
        title: "MASSIVE Inventory Setup Complete!",
        description: `Created ${data.totalGenerated} products worth ${data.summary.estimatedValue}`,
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Massive Setup Failed",
        description: error.message || "Failed to create massive inventory",
        variant: "destructive"
      });
    }
  });

  const handleGenerate = () => {
    setResults(null);
    bulkGenerationMutation.mutate(formData);
  };

  const handleMassiveSetup = () => {
    setResults(null);
    massiveInventoryMutation.mutate();
  };

  const resetForm = () => {
    setResults(null);
    setFormData({
      productType: 'pre-roll',
      strainType: 'indica',
      count: 100,
      priceRange: { min: 8, max: 25 },
      thcRange: { min: 18, max: 32 },
      includeDeals: false,
      includePackages: false
    });
  };

  const productTypes = [
    { value: 'pre-roll', label: 'Pre-rolls' },
    { value: 'flower', label: 'Flower/Buds' }
  ];

  const strainTypes = [
    { value: 'indica', label: 'Indica' },
    { value: 'sativa', label: 'Sativa' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const isLoading = bulkGenerationMutation.isPending || massiveInventoryMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Massive Setup Card */}
      <Card className="border-green-500/50 bg-gradient-to-r from-green-900/20 to-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Rocket className="h-6 w-6" />
            MASSIVE Inventory Setup
          </CardTitle>
          <CardDescription className="text-green-300">
            Create 100,000 pre-rolls + 25 pounds of premium flower strains instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-green-800/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">100K</div>
              <div className="text-sm text-green-300">Pre-rolls (50K Indica + 50K Sativa)</div>
            </div>
            <div className="bg-blue-800/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">25 lbs</div>
              <div className="text-sm text-blue-300">Premium Flower (10 Sativa + 10 Indica + 5 Hybrid)</div>
            </div>
            <div className="bg-purple-800/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">10,500+</div>
              <div className="text-sm text-purple-300">Total Products Generated</div>
            </div>
          </div>
          
          <Button 
            onClick={handleMassiveSetup} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-6"
            size="lg"
          >
            {massiveInventoryMutation.isPending ? (
              <>
                <Clock className="h-5 w-5 mr-2 animate-spin" />
                Creating Massive Inventory...
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5 mr-2" />
                Launch MASSIVE Setup (Est. $367,500 Value)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Regular Bulk Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            Bulk Product Generator
          </CardTitle>
          <CardDescription>
            Generate custom batches of premium THCA products using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Settings */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="productType">Product Type</Label>
                <Select value={formData.productType} onValueChange={(value: any) => setFormData({ ...formData, productType: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="strainType">Strain Type</Label>
                <Select value={formData.strainType} onValueChange={(value: any) => setFormData({ ...formData, strainType: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {strainTypes.map(strain => (
                      <SelectItem key={strain.value} value={strain.value}>{strain.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="count">Product Count</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max={formData.productType === 'pre-roll' ? "10000" : "1000"}
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max: {formData.productType === 'pre-roll' ? '10,000' : '1,000'} products
                </p>
              </div>
            </div>

            {/* Right Column - Advanced Settings */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice">Min Price ($)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    min="1"
                    value={formData.priceRange.min}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      priceRange: { ...formData.priceRange, min: parseInt(e.target.value) }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice">Max Price ($)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    min="1"
                    value={formData.priceRange.max}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      priceRange: { ...formData.priceRange, max: parseInt(e.target.value) }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minThc">Min THC (%)</Label>
                  <Input
                    id="minThc"
                    type="number"
                    min="1"
                    max="35"
                    value={formData.thcRange.min}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      thcRange: { ...formData.thcRange, min: parseInt(e.target.value) }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxThc">Max THC (%)</Label>
                  <Input
                    id="maxThc"
                    type="number"
                    min="1"
                    max="35"
                    value={formData.thcRange.max}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      thcRange: { ...formData.thcRange, max: parseInt(e.target.value) }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="deals"
                    checked={formData.includeDeals}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeDeals: checked })}
                  />
                  <Label htmlFor="deals">Generate Special Deals</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="packages"
                    checked={formData.includePackages}
                    onCheckedChange={(checked) => setFormData({ ...formData, includePackages: checked })}
                  />
                  <Label htmlFor="packages">Create Product Packages</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Estimated time: {Math.ceil(formData.count / 10)} minutes
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} disabled={isLoading}>
                Reset
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading}
                className="min-w-[140px]"
              >
                {bulkGenerationMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Leaf className="h-4 w-4 mr-2" />
                    Generate {formData.count} Products
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating products with Groq AI...</span>
                <span>Processing premium strains</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Generation Results
            </CardTitle>
            <CardDescription>
              {results.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {'summary' in results ? (
              // Massive inventory results
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{results.totalGenerated}</div>
                    <div className="text-sm text-muted-foreground">Total Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{(results as any).summary.preRollsCreated}</div>
                    <div className="text-sm text-muted-foreground">Pre-rolls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{(results as any).summary.flowerProductsCreated}</div>
                    <div className="text-sm text-muted-foreground">Flower Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{(results as any).summary.estimatedValue}</div>
                    <div className="text-sm text-muted-foreground">Estimated Value</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {(results as any).inventoryBreakdown.map((breakdown: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded border">
                      <div className="font-medium">{breakdown.type}</div>
                      <div className="flex items-center gap-4">
                        <span className="text-green-600">{breakdown.generated} created</span>
                        {breakdown.failed > 0 && (
                          <span className="text-red-600">{breakdown.failed} failed</span>
                        )}
                        <Badge variant={breakdown.generated > 0 ? "default" : "destructive"}>
                          {breakdown.generated > 0 ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Regular bulk results
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{results.generated}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{results.totalRequested}</div>
                    <div className="text-sm text-muted-foreground">Total Requested</div>
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {results.results.map((result, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded border">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.strainName} • ${result.price}
                        </div>
                        {result.error && (
                          <div className="text-xs text-red-600">{result.error}</div>
                        )}
                      </div>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "Created" : "Failed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}