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
  Sparkles, 
  Zap, 
  BookOpen, 
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkGenerationRequest {
  count: number;
  baseCategory: string;
  tone: 'professional' | 'casual' | 'educational' | 'promotional';
  length: 'short' | 'medium' | 'long';
  targetAudience: string;
  includeCallToAction: boolean;
}

interface BulkGenerationResult {
  success: boolean;
  message: string;
  generated: number;
  failed: number;
  totalRequested: number;
  results: Array<{
    title: string;
    success: boolean;
    error: string | null;
    id: string | null;
  }>;
}

export default function BulkBlogGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<BulkGenerationRequest>({
    count: 10,
    baseCategory: 'education',
    tone: 'educational',
    length: 'medium',
    targetAudience: 'hemp enthusiasts and new users',
    includeCallToAction: true
  });

  const [results, setResults] = useState<BulkGenerationResult | null>(null);

  const bulkGenerationMutation = useMutation({
    mutationFn: (data: BulkGenerationRequest) => 
      apiRequest('/api/admin/blog/ai/bulk-generate', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data: BulkGenerationResult) => {
      setResults(data);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      
      toast({
        title: "Bulk Generation Complete!",
        description: `Successfully generated ${data.generated} out of ${data.totalRequested} blogs`,
        variant: data.failed > 0 ? "destructive" : "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate blogs",
        variant: "destructive"
      });
    }
  });

  const handleGenerate = () => {
    setResults(null);
    bulkGenerationMutation.mutate(formData);
  };

  const resetForm = () => {
    setResults(null);
    setFormData({
      count: 10,
      baseCategory: 'education',
      tone: 'educational',
      length: 'medium',
      targetAudience: 'hemp enthusiasts and new users',
      includeCallToAction: true
    });
  };

  const categories = [
    { value: 'education', label: 'Education' },
    { value: 'products', label: 'Products' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'legal', label: 'Legal & Compliance' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'news', label: 'News & Updates' },
    { value: 'guides', label: 'How-to Guides' }
  ];

  const tones = [
    { value: 'educational', label: 'Educational' },
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'promotional', label: 'Promotional' }
  ];

  const lengths = [
    { value: 'short', label: 'Short (800-1200 words)' },
    { value: 'medium', label: 'Medium (1500-2000 words)' },
    { value: 'long', label: 'Long (2500-3500 words)' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Bulk Blog Generator
          </CardTitle>
          <CardDescription>
            Generate multiple high-quality hemp-focused blog posts at once using Groq AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Settings */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="count">Number of Blogs</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum 20 blogs at once</p>
              </div>

              <div>
                <Label htmlFor="category">Primary Category</Label>
                <Select value={formData.baseCategory} onValueChange={(value) => setFormData({ ...formData, baseCategory: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tone">Writing Tone</Label>
                <Select value={formData.tone} onValueChange={(value: any) => setFormData({ ...formData, tone: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map(tone => (
                      <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="length">Content Length</Label>
                <Select value={formData.length} onValueChange={(value: any) => setFormData({ ...formData, length: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map(length => (
                      <SelectItem key={length.value} value={length.value}>{length.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column - Advanced Settings */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Textarea
                  id="audience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="Describe your target audience..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="cta"
                  checked={formData.includeCallToAction}
                  onCheckedChange={(checked) => setFormData({ ...formData, includeCallToAction: checked })}
                />
                <Label htmlFor="cta">Include Call-to-Action</Label>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Features
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unique titles and content for each blog</li>
                  <li>• SEO-optimized keywords and meta descriptions</li>
                  <li>• Hemp-specific compliance and legal notes</li>
                  <li>• Professional formatting with info boxes</li>
                  <li>• Automatic categorization and tagging</li>
                </ul>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Estimated time: {Math.ceil(formData.count / 3)} minutes
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} disabled={bulkGenerationMutation.isPending}>
                Reset
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={bulkGenerationMutation.isPending}
                className="min-w-[120px]"
              >
                {bulkGenerationMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Generate {formData.count} Blogs
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          {bulkGenerationMutation.isPending && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating blogs with Groq AI...</span>
                <span>Processing in batches</span>
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
              <Target className="h-5 w-5" />
              Generation Results
            </CardTitle>
            <CardDescription>
              {results.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    <div className="font-medium truncate">{result.title}</div>
                    {result.error && (
                      <div className="text-xs text-red-600">{result.error}</div>
                    )}
                  </div>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "Success" : "Failed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}