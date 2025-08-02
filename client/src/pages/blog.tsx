import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import type { BlogPost } from '@shared/schema';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch published blog posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['/api/blog/posts'],
    queryFn: () => apiRequest('/api/blog/posts').catch((err) => {
      console.warn('Failed to load blog posts:', err.message);
      return [];
    }),
    retry: 1
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/blog/categories'],
    queryFn: () => apiRequest('/api/blog/categories').catch((err) => {
      console.warn('Failed to load blog categories:', err.message);
      return [];
    }),
    retry: 1
  });

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post: BlogPost) => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      education: 'bg-blue-500',
      products: 'bg-green-500', 
      health: 'bg-purple-500',
      legal: 'bg-red-500',
      lifestyle: 'bg-yellow-500',
      news: 'bg-pink-500',
      guides: 'bg-indigo-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              THCA Knowledge Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Expert insights, education, and the latest news about THCA, hemp, and wellness. 
              Stay informed with our comprehensive guides and research-backed content.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="pl-10 bg-dark-800 border-dark-600 text-white"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className={selectedCategory === '' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white'}
            >
              All Categories
            </Button>
            {categories.map((category: string) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white'
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading blog posts...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No articles found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No blog posts have been published yet.'}
            </p>
          </div>
        )}

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="text-2xl font-bold text-white">Featured Article</h2>
            </div>
            
            <Link href={`/blog/${featuredPost.id}`}>
              <Card className="bg-dark-800 border-dark-700 overflow-hidden hover:bg-dark-750 transition-colors cursor-pointer">
              {featuredPost.featuredImage && (
                <div className="aspect-video bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                  <img 
                    src={featuredPost.featuredImage} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={`${getCategoryColor(featuredPost.category)} text-white`}>
                    {featuredPost.category.charAt(0).toUpperCase() + featuredPost.category.slice(1)}
                  </Badge>
                  {featuredPost.isAiGenerated && (
                    <Badge variant="outline" className="border-purple-500 text-purple-400">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Enhanced
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">{featuredPost.title}</h3>
                
                {featuredPost.excerpt && (
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredPost.publishedAt!)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime || 5} min read
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {featuredPost.viewCount || 0} views
                  </div>
                </div>
              </CardContent>
            </Card>
            </Link>
          </div>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Latest Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post: BlogPost) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <Card className="bg-dark-800 border-dark-700 hover:bg-dark-750 transition-colors cursor-pointer">
                  {post.featuredImage && (
                    <div className="aspect-video bg-gradient-to-r from-purple-900/10 to-pink-900/10">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${getCategoryColor(post.category)} text-white text-xs`}>
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                      </Badge>
                      {post.isAiGenerated && (
                        <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                    
                    {post.excerpt && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt!)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime || 5}m
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.viewCount || 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}