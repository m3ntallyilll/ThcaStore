import { useState } from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Link2, Leaf, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface FloatingSocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
}

export function FloatingSocialShare({ 
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = "Premium THCA Products | Mentally Chill",
  description = "Discover premium lab-tested THCA products with fast shipping nationwide. Quality you can trust.",
  hashtags = ['THCA', 'Hemp', 'Cannabis', 'Premium', 'LabTested']
}: FloatingSocialShareProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const platformUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags.join(',')}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        toast({
          title: "Shared successfully!",
          description: "Thanks for spreading the word about our premium THCA products.",
        });
        setIsExpanded(false);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSocialShare = (platform: keyof typeof platformUrls) => {
    window.open(platformUrls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
    setIsExpanded(false);
    
    toast({
      title: "Opening share window...",
      description: `Sharing on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard.",
      });
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Copy failed",
        description: "Please copy the link manually from your browser.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 p-4 min-w-[200px]"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <Leaf className="w-4 h-4 mr-2 text-green-400" />
                Share THCA Store
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <Button
                  onClick={handleNativeShare}
                  variant="ghost"
                  size="sm"
                  className="text-xs p-2 h-auto flex flex-col items-center gap-1 hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              )}
              
              <Button
                onClick={() => handleSocialShare('facebook')}
                variant="ghost"
                size="sm"
                className="text-xs p-2 h-auto flex flex-col items-center gap-1 hover:bg-blue-500/20"
              >
                <Facebook className="h-4 w-4 text-blue-500" />
                Facebook
              </Button>
              
              <Button
                onClick={() => handleSocialShare('twitter')}
                variant="ghost"
                size="sm"
                className="text-xs p-2 h-auto flex flex-col items-center gap-1 hover:bg-blue-400/20"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              
              <Button
                onClick={() => handleSocialShare('reddit')}
                variant="ghost"
                size="sm"
                className="text-xs p-2 h-auto flex flex-col items-center gap-1 hover:bg-orange-500/20"
              >
                <div className="h-4 w-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">r</span>
                </div>
                Reddit
              </Button>
              
              <Button
                onClick={() => handleSocialShare('whatsapp')}
                variant="ghost"
                size="sm"
                className="text-xs p-2 h-auto flex flex-col items-center gap-1 hover:bg-green-500/20"
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                WhatsApp
              </Button>
              
              <Button
                onClick={() => handleSocialShare('telegram')}
                variant="ghost"
                size="sm"
                className="text-xs p-2 h-auto flex flex-col items-center gap-1 hover:bg-blue-500/20"
              >
                <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">t</span>
                </div>
                Telegram
              </Button>
              
              <Button
                onClick={() => handleSocialShare('linkedin')}
                variant="ghost"
                size="sm"
                className="text-xs p-2 h-auto flex flex-col items-center gap-1 hover:bg-blue-600/20"
              >
                <div className="h-4 w-4 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                LinkedIn
              </Button>
              
              <Button
                onClick={handleCopyLink}
                variant="ghost"
                size="sm"
                className="text-xs p-2 h-auto flex flex-col items-center gap-1 hover:bg-white/10 col-span-2"
              >
                <Link2 className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Share Button with Pot Leaf Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-400/30"
          aria-label="Share this page"
        >
          <motion.div
            animate={isExpanded ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Leaf className="h-6 w-6 text-white" />
          </motion.div>
        </Button>
      </motion.div>
      
      {/* Pulse Effect */}
      <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" style={{ animationDuration: '3s' }} />
    </div>
  );
}

export default FloatingSocialShare;