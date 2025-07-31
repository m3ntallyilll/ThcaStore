import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Sparkles, 
  Lightbulb,
  RefreshCw,
  BookOpen,
  Send,
  Save,
  Wand2
} from 'lucide-react';
import type { BlogPost } from '@shared/schema';

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  featuredImage: string;
  status: 'draft' | 'published' | 'archived';
}

const initialFormData: BlogFormData = {
  title: '',
  content: '',
  excerpt: '',
  category: '',
  tags: [],
  metaTitle: '',
  metaDescription: '',
  keywords: [],
  featuredImage: '',
  status: 'draft'
};

const blogCategories = [
  'education',
  'products', 
  'health',
  'legal',
  'lifestyle',
  'news',
  'guides'
];

export function BlogManagement() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [aiGenerationData, setAiGenerationData] = useState({
    topic: '',
    category: 'education',
    keywords: '',
    tone: 'professional',
    length: 'medium',
    targetAudience: '',
    includeCallToAction: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch blog posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/admin/blog/posts'],
    queryFn: () => apiRequest('/api/admin/blog/posts')
  });

  // Fetch blog ideas
  const { data: blogIdeas = [], refetch: refetchIdeas } = useQuery({
    queryKey: ['/api/admin/blog/ai/ideas'],
    queryFn: () => apiRequest('/api/admin/blog/ai/ideas?category=education&count=5')
      .then(data => data.ideas || []),
    enabled: false
  });

  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: Partial<BlogFormData>) => 
      apiRequest('/api/admin/blog/posts', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      setIsCreateDialogOpen(false);
      setFormData(initialFormData);
      toast({ title: 'Blog post created successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error creating blog post', description: error.message, variant: 'destructive' });
    }
  });

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogFormData> }) =>
      apiRequest(`/api/admin/blog/posts/${id}`, { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      setIsEditDialogOpen(false);
      setSelectedPost(null);
      setFormData(initialFormData);
      toast({ title: 'Blog post updated successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error updating blog post', description: error.message, variant: 'destructive' });
    }
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest(`/api/admin/blog/posts/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      toast({ title: 'Blog post deleted successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error deleting blog post', description: error.message, variant: 'destructive' });
    }
  });

  // AI blog generation mutation
  const generateBlogMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('/api/admin/blog/ai/generate', { method: 'POST', body: data }),
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      setIsAIDialogOpen(false);
      setAiGenerationData({
        topic: '',
        category: 'education',
        keywords: '',
        tone: 'professional',
        length: 'medium',
        targetAudience: '',
        includeCallToAction: true
      });
      toast({ 
        title: 'AI blog post generated successfully!', 
        description: `"${newPost.title}" is ready for review in drafts.` 
      });
    },
    onError: (error: any) => {
      toast({ title: 'Error generating blog post', description: error.message, variant: 'destructive' });
    }
  });

  const handleGenerateAIBlog = async () => {
    if (!aiGenerationData.topic || !aiGenerationData.category) {
      toast({ title: 'Please provide a topic and category', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      const keywords = aiGenerationData.keywords.split(',').map(k => k.trim()).filter(Boolean);
      await generateBlogMutation.mutateAsync({
        ...aiGenerationData,
        keywords
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category,
      tags: post.tags || [],
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      keywords: post.keywords || [],
      featuredImage: post.featuredImage || '',
      status: post.status as 'draft' | 'published' | 'archived'
    });
    setIsEditDialogOpen(true);
  };

  const handleCreatePost = () => {
    setFormData(initialFormData);
    setIsCreateDialogOpen(true);
  };

  const handleSubmitForm = () => {
    if (selectedPost) {
      updatePostMutation.mutate({ id: selectedPost.id, data: formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deletePostMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const publishedPosts = posts.filter((post: BlogPost) => post.status === 'published');
  const draftPosts = posts.filter((post: BlogPost) => post.status === 'draft');
  const totalViews = publishedPosts.reduce((sum: number, post: BlogPost) => sum + (post.viewCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Blog Management</h2>
          <p className="text-gray-400">Create and manage SEO-optimized content with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetchIdeas()} 
            variant="outline" 
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Get Ideas
          </Button>
          <Button 
            onClick={() => setIsAIDialogOpen(true)} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            AI Generate
          </Button>
          <Button onClick={handleCreatePost} className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-dark-800 border-dark-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Posts</p>
                <p className="text-2xl font-bold text-white">{posts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-800 border-dark-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Published</p>
                <p className="text-2xl font-bold text-white">{publishedPosts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-800 border-dark-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Drafts</p>
                <p className="text-2xl font-bold text-white">{draftPosts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-800 border-dark-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Ideas Section */}
      {blogIdeas.length > 0 && (
        <Card className="bg-dark-800 border-dark-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
              AI-Generated Blog Ideas
            </CardTitle>
            <CardDescription>Fresh content ideas to inspire your next blog post</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {blogIdeas.map((idea: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <span className="text-gray-300">{idea}</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      setAiGenerationData(prev => ({ ...prev, topic: idea }));
                      setIsAIDialogOpen(true);
                    }}
                    className="text-purple-400 hover:text-white hover:bg-purple-600"
                  >
                    <Wand2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blog Posts Table */}
      <Card className="bg-dark-800 border-dark-700">
        <CardHeader>
          <CardTitle className="text-white">Blog Posts</CardTitle>
          <CardDescription>Manage all your blog content in one place</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
              <span className="ml-2 text-gray-400">Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 mb-4">No blog posts yet</p>
              <Button onClick={handleCreatePost} className="bg-green-600 hover:bg-green-700">
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: BlogPost) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-white">{post.title}</h3>
                      <Badge className={`${getStatusColor(post.status)} text-white`}>
                        {post.status}
                      </Badge>
                      {post.isAiGenerated && (
                        <Badge variant="outline" className="border-purple-500 text-purple-400">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Category: {post.category}</span>
                      <span>Views: {post.viewCount || 0}</span>
                      <span>Read time: {post.readTime || 0} min</span>
                      {post.publishedAt && (
                        <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditPost(post)}
                      className="text-blue-400 hover:text-white hover:bg-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-400 hover:text-white hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Blog Generation Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="bg-dark-800 border-dark-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <Wand2 className="w-5 h-5 mr-2 text-purple-400" />
              Generate Blog Post with AI
            </DialogTitle>
            <DialogDescription>
              Let AI create SEO-optimized content for your blog using advanced THCA and cannabis expertise.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic" className="text-white">Topic *</Label>
              <Input
                id="topic"
                value={aiGenerationData.topic}
                onChange={(e) => setAiGenerationData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Benefits of THCA for inflammation"
                className="bg-dark-700 border-dark-600 text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-white">Category *</Label>
                <Select value={aiGenerationData.category} onValueChange={(value) => setAiGenerationData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-700 border-dark-600">
                    {blogCategories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-dark-600">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tone" className="text-white">Tone</Label>
                <Select value={aiGenerationData.tone} onValueChange={(value) => setAiGenerationData(prev => ({ ...prev, tone: value }))}>
                  <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-700 border-dark-600">
                    <SelectItem value="professional" className="text-white hover:bg-dark-600">Professional</SelectItem>
                    <SelectItem value="casual" className="text-white hover:bg-dark-600">Casual</SelectItem>
                    <SelectItem value="educational" className="text-white hover:bg-dark-600">Educational</SelectItem>
                    <SelectItem value="promotional" className="text-white hover:bg-dark-600">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length" className="text-white">Length</Label>
                <Select value={aiGenerationData.length} onValueChange={(value) => setAiGenerationData(prev => ({ ...prev, length: value }))}>
                  <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-700 border-dark-600">
                    <SelectItem value="short" className="text-white hover:bg-dark-600">Short (500-800 words)</SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-dark-600">Medium (1000-1500 words)</SelectItem>
                    <SelectItem value="long" className="text-white hover:bg-dark-600">Long (2000-3000 words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="targetAudience" className="text-white">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={aiGenerationData.targetAudience}
                  onChange={(e) => setAiGenerationData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., New cannabis users"
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="keywords" className="text-white">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={aiGenerationData.keywords}
                onChange={(e) => setAiGenerationData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="e.g., THCA, cannabinoids, hemp flower"
                className="bg-dark-700 border-dark-600 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleGenerateAIBlog}
              disabled={isGenerating || !aiGenerationData.topic || !aiGenerationData.category}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Blog Post
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Blog Post Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        if (!open) {
          setSelectedPost(null);
          setFormData(initialFormData);
        }
      }}>
        <DialogContent className="bg-dark-800 border-dark-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {selectedPost ? 'Update your blog post content and settings' : 'Create a new blog post for your website'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-dark-700">
              <TabsTrigger value="content" className="data-[state=active]:bg-dark-600">Content</TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-dark-600">SEO</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-dark-600">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter blog post title"
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="content" className="text-white">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog content here (HTML supported)"
                  className="bg-dark-700 border-dark-600 text-white min-h-[300px]"
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt" className="text-white">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the blog post"
                  className="bg-dark-700 border-dark-600 text-white"
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <div>
                <Label htmlFor="metaTitle" className="text-white">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO title (50-60 characters)"
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="metaDescription" className="text-white">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO description (150-160 characters)"
                  className="bg-dark-700 border-dark-600 text-white"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="keywords" className="text-white">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.keywords.join(', ')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                  }))}
                  placeholder="SEO keywords (comma-separated)"
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="featuredImage" className="text-white">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600">
                      {blogCategories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-white hover:bg-dark-600">
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status" className="text-white">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600">
                      <SelectItem value="draft" className="text-white hover:bg-dark-600">Draft</SelectItem>
                      <SelectItem value="published" className="text-white hover:bg-dark-600">Published</SelectItem>
                      <SelectItem value="archived" className="text-white hover:bg-dark-600">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="tags" className="text-white">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  }))}
                  placeholder="Tags (comma-separated)"
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button
              onClick={handleSubmitForm}
              disabled={!formData.title || !formData.content || !formData.category}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {selectedPost ? 'Update Post' : 'Create Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}