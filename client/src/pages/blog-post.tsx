import { useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Sparkles,
  Share,
  BookOpen
} from 'lucide-react';
import type { BlogPost } from '@shared/schema';

export default function BlogPost() {
  const [match, params] = useRoute('/blog/:id');
  const queryClient = useQueryClient();
  const postId = params?.id;

  // Fetch the blog post
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['/api/blog/posts', postId],
    queryFn: () => apiRequest(`/api/blog/posts/${postId}`),
    enabled: !!postId
  });

  // Increment view count - only once per session
  const viewMutation = useMutation({
    mutationFn: async () => {
      try {
        return await apiRequest(`/api/blog/posts/${postId}/view`, {
          method: 'POST'
        });
      } catch (err: any) {
        // Silently handle view count errors
        return null;
      }
    },
    retry: false
  });

  useEffect(() => {
    if (post && postId) {
      const sessionKey = `blog_view_${postId}`;
      const hasViewed = sessionStorage.getItem(sessionKey);
      
      if (!hasViewed && !viewMutation.isSuccess && !viewMutation.isPending) {
        viewMutation.mutate();
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [post, postId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBlogContent = (content: string) => {
    if (!content) return '';
    
    // Convert markdown-style content to HTML with proper paragraph breaks
    let formatted = content
      // Convert **bold** to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Split into paragraphs and wrap each
      .split(/\n\s*\n/)
      .filter(p => p.trim().length > 0)
      .map(paragraph => {
        const trimmed = paragraph.trim();
        // Skip if already wrapped in HTML
        if (trimmed.startsWith('<') && trimmed.includes('>')) {
          return trimmed;
        }
        return `<p>${trimmed}</p>`;
      })
      .join('\n\n');
    
    return formatted;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-32 mb-8 bg-dark-800" />
          <Skeleton className="h-12 w-full mb-4 bg-dark-800" />
          <Skeleton className="h-6 w-3/4 mb-8 bg-dark-800" />
          <Skeleton className="h-64 w-full mb-8 bg-dark-800" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-dark-800" />
            <Skeleton className="h-4 w-full bg-dark-800" />
            <Skeleton className="h-4 w-3/4 bg-dark-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-dark-900 text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-400 mb-4">Blog post not found</h1>
          <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Category and AI Badge */}
          <div className="flex items-center gap-4 mb-6">
            <Badge className={`${getCategoryColor(post.category)} text-white`}>
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
            {post.isAiGenerated && (
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt!)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime || 5} min read
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {post.viewCount || 0} views
            </div>
          </div>

          {/* Share Button */}
          <Button 
            variant="outline" 
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.excerpt || '',
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            <Share className="w-4 h-4 mr-2" />
            Share Article
          </Button>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-12">
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <article className="prose prose-lg prose-invert max-w-none blog-content">
          <div 
            className="leading-relaxed text-gray-200 blog-post-content"
            dangerouslySetInnerHTML={{ __html: formatBlogContent(post.content) }}
          />
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-gray-400 border-gray-600">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Meta Description for SEO */}
        {post.metaDescription && (
          <div className="mt-8 p-4 bg-dark-800 rounded-lg border border-dark-700">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">About this article</h4>
            <p className="text-sm text-gray-500">{post.metaDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}