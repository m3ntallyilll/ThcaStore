import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  Link, 
  Target, 
  BarChart3, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Network,
  Search,
  Tags,
  ExternalLink
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface PyramidHealth {
  overallScore: number;
  issues: string[];
  recommendations: string[];
  pyramidStats: {
    topTier: number;
    middleTier: number;
    baseTier: number;
    totalLinks: number;
    avgLinksPerPost: number;
  };
}

interface PyramidStrategy {
  topTierCount: number;
  middleTierCount: number;
  baseTierCount: number;
  totalLinks: number;
  topTierPosts: Array<{
    id: string;
    title: string;
    authorityScore: number;
  }>;
  linkingStrategy: Array<{
    fromPostId: string;
    toPostId: string;
    anchorText: string;
    contextPlacement: string;
    strategicReason: string;
    priority: string;
  }>;
}

export function AISEOManager() {
  const [selectedPostId, setSelectedPostId] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [bulkPostIds, setBulkPostIds] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch blog posts for selection
  const { data: blogPosts } = useQuery({
    queryKey: ['/api/admin/blog'],
    queryFn: () => apiRequest('/api/admin/blog'),
  });

  // Fetch pyramid health
  const { data: pyramidHealth, isLoading: healthLoading } = useQuery<{ healthReport: PyramidHealth }>({
    queryKey: ['/api/admin/seo/pyramid-health'],
    queryFn: () => apiRequest('/api/admin/seo/pyramid-health'),
  });

  // SEO Enhancement Mutation
  const enhanceSeoMutation = useMutation({
    mutationFn: (data: { postId: string; targetKeywords?: string[] }) =>
      apiRequest('/api/admin/seo/enhance/' + data.postId, {
        method: 'POST',
        body: { targetKeywords: data.targetKeywords }
      }),
    onSuccess: () => {
      toast({
        title: "SEO Enhanced Successfully",
        description: "AI-powered metadata and internal links have been added to the blog post.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
    },
    onError: (error: any) => {
      toast({
        title: "Enhancement Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Bulk SEO Enhancement Mutation
  const bulkEnhanceMutation = useMutation({
    mutationFn: (postIds: string[]) =>
      apiRequest('/api/admin/seo/bulk-enhance', {
        method: 'POST',
        body: { postIds }
      }),
    onSuccess: (data: any) => {
      toast({
        title: "Bulk Enhancement Started",
        description: `Processing ${data.processingCount} posts in the background.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Bulk Enhancement Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Build Pyramid Mutation
  const buildPyramidMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/seo/build-pyramid', { method: 'POST' }),
    onSuccess: (data: { strategy: PyramidStrategy }) => {
      toast({
        title: "Link Pyramid Generated",
        description: `Created ${data.strategy.totalLinks} strategic internal links across ${data.strategy.topTierCount + data.strategy.middleTierCount + data.strategy.baseTierCount} posts.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/seo/pyramid-health'] });
    },
    onError: (error: any) => {
      toast({
        title: "Pyramid Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Implement Pyramid Mutation
  const implementPyramidMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/seo/implement-pyramid', { method: 'POST' }),
    onSuccess: (data: any) => {
      toast({
        title: "Link Pyramid Implementation Started",
        description: `Updating ${data.strategy.postsToUpdate} posts with ${data.strategy.linksToCreate} internal links.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/seo/pyramid-health'] });
    },
    onError: (error: any) => {
      toast({
        title: "Implementation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleEnhanceSEO = () => {
    if (!selectedPostId) {
      toast({
        title: "No Post Selected",
        description: "Please select a blog post to enhance.",
        variant: "destructive",
      });
      return;
    }

    const keywords = targetKeywords.split(',').map(k => k.trim()).filter(k => k);
    enhanceSeoMutation.mutate({ 
      postId: selectedPostId, 
      targetKeywords: keywords.length > 0 ? keywords : undefined 
    });
  };

  const handleBulkEnhance = () => {
    const postIds = bulkPostIds.split(',').map(id => id.trim()).filter(id => id);
    if (postIds.length === 0) {
      toast({
        title: "No Post IDs Provided",
        description: "Please enter comma-separated post IDs.",
        variant: "destructive",
      });
      return;
    }

    bulkEnhanceMutation.mutate(postIds);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold">AI SEO Enhancement Center</h1>
        <Badge variant="outline" className="ml-2">Powered by Groq AI</Badge>
      </div>

      {/* Pyramid Health Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Link Pyramid Health Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span>Analyzing pyramid structure...</span>
            </div>
          ) : pyramidHealth?.healthReport ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Overall Health Score</span>
                    <Badge className={getHealthBadgeColor(pyramidHealth.healthReport.overallScore)}>
                      {pyramidHealth.healthReport.overallScore}/100
                    </Badge>
                  </div>
                  <Progress value={pyramidHealth.healthReport.overallScore} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {pyramidHealth.healthReport.pyramidStats.topTier}
                  </div>
                  <div className="text-sm text-blue-600">Pillar Posts</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {pyramidHealth.healthReport.pyramidStats.middleTier}
                  </div>
                  <div className="text-sm text-green-600">Supporting Posts</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {pyramidHealth.healthReport.pyramidStats.baseTier}
                  </div>
                  <div className="text-sm text-purple-600">Long-tail Posts</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {pyramidHealth.healthReport.pyramidStats.totalLinks}
                  </div>
                  <div className="text-sm text-orange-600">Internal Links</div>
                </div>
              </div>

              {pyramidHealth.healthReport.issues.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-800 flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Issues Found
                  </h3>
                  <ul className="space-y-1">
                    {pyramidHealth.healthReport.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-700">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {pyramidHealth.healthReport.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    Recommendations
                  </h3>
                  <ul className="space-y-1">
                    {pyramidHealth.healthReport.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-700">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No pyramid data available. Create some blog posts first.</p>
          )}
        </CardContent>
      </Card>

      {/* SEO Enhancement Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single Post Enhancement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Single Post SEO Enhancement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="post-select">Select Blog Post</Label>
              <select
                id="post-select"
                value={selectedPostId}
                onChange={(e) => setSelectedPostId(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose a post...</option>
                {blogPosts?.map((post: any) => (
                  <option key={post.id} value={post.id}>
                    {post.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="keywords">Target Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
                placeholder="THCA, hemp flower, premium cannabis"
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleEnhanceSEO}
              disabled={enhanceSeoMutation.isPending || !selectedPostId}
              className="w-full"
            >
              {enhanceSeoMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enhancing SEO...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Enhance with AI
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Bulk Enhancement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Bulk SEO Enhancement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bulk-ids">Post IDs (comma-separated)</Label>
              <Textarea
                id="bulk-ids"
                value={bulkPostIds}
                onChange={(e) => setBulkPostIds(e.target.value)}
                placeholder="post-id-1, post-id-2, post-id-3..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            <Button 
              onClick={handleBulkEnhance}
              disabled={bulkEnhanceMutation.isPending}
              className="w-full"
              variant="outline"
            >
              {bulkEnhanceMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Starting Bulk Process...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Tags className="w-4 h-4" />
                  Bulk Enhance SEO
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Link Pyramid Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Internal Link Pyramid Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => buildPyramidMutation.mutate()}
              disabled={buildPyramidMutation.isPending}
              className="flex items-center gap-2"
            >
              {buildPyramidMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Generate Link Strategy
                </>
              )}
            </Button>

            <Button 
              onClick={() => implementPyramidMutation.mutate()}
              disabled={implementPyramidMutation.isPending}
              variant="outline"
              className="flex items-center gap-2"
            >
              {implementPyramidMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Implementing Links...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4" />
                  Implement Pyramid
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">How Link Pyramids Work:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• <strong>Top Tier:</strong> 2-3 comprehensive pillar posts covering broad topics</li>
              <li>• <strong>Middle Tier:</strong> Supporting posts that dive deeper into subtopics</li>
              <li>• <strong>Base Tier:</strong> Specific, long-tail content that links up to higher tiers</li>
              <li>• <strong>AI Strategy:</strong> Each post gets exactly 3 strategic internal links for maximum SEO impact</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}