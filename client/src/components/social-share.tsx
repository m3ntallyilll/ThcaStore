import { useState } from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Link2, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  variant?: 'button' | 'icon' | 'floating';
}

export function SocialShare({ 
  url = window.location.href,
  title = "Check out these premium THCA products!",
  description = "Discover premium lab-tested THCA products with fast shipping nationwide. Quality you can trust.",
  hashtags = ['THCA', 'Hemp', 'Cannabis', 'Premium', 'LabTested'],
  className = "",
  variant = 'button'
}: SocialShareProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const shareData = {
    title,
    text: description,
    url,
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');

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
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Thanks for spreading the word about our premium THCA products.",
        });
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

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'reddit' | 'telegram' | 'whatsapp' | 'linkedin') => {
    window.open(platformUrls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
    setIsOpen(false);
    
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
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Copy failed",
        description: "Please copy the link manually from your browser.",
        variant: "destructive",
      });
    }
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              aria-label="Share this page"
            >
              <Leaf className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass border-white/20">
            <ShareMenuItems 
              onNativeShare={handleNativeShare}
              onSocialShare={handleSocialShare}
              onCopyLink={handleCopyLink}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={className}>
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass border-white/20">
          <ShareMenuItems 
            onNativeShare={handleNativeShare}
            onSocialShare={handleSocialShare}
            onCopyLink={handleCopyLink}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`border-white/20 hover:bg-white/10 ${className}`}>
          <Leaf className="h-4 w-4 mr-2 text-green-400" />
          Share
          <Share2 className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass border-white/20">
        <ShareMenuItems 
          onNativeShare={handleNativeShare}
          onSocialShare={handleSocialShare}
          onCopyLink={handleCopyLink}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ShareMenuItemsProps {
  onNativeShare: () => void;
  onSocialShare: (platform: 'facebook' | 'twitter' | 'reddit' | 'telegram' | 'whatsapp' | 'linkedin') => void;
  onCopyLink: () => void;
}

function ShareMenuItems({ onNativeShare, onSocialShare, onCopyLink }: ShareMenuItemsProps) {
  return (
    <>
      {typeof navigator !== 'undefined' && navigator.share && (
        <DropdownMenuItem onClick={onNativeShare} className="cursor-pointer">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </DropdownMenuItem>
      )}
      
      <DropdownMenuItem onClick={() => onSocialShare('facebook')} className="cursor-pointer">
        <Facebook className="h-4 w-4 mr-2 text-blue-500" />
        Facebook
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => onSocialShare('twitter')} className="cursor-pointer">
        <Twitter className="h-4 w-4 mr-2 text-blue-400" />
        Twitter
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => onSocialShare('reddit')} className="cursor-pointer">
        <div className="h-4 w-4 mr-2 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">r</span>
        </div>
        Reddit
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => onSocialShare('whatsapp')} className="cursor-pointer">
        <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
        WhatsApp
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => onSocialShare('telegram')} className="cursor-pointer">
        <div className="h-4 w-4 mr-2 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">t</span>
        </div>
        Telegram
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => onSocialShare('linkedin')} className="cursor-pointer">
        <div className="h-4 w-4 mr-2 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">in</span>
        </div>
        LinkedIn
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onCopyLink} className="cursor-pointer">
        <Link2 className="h-4 w-4 mr-2" />
        Copy Link
      </DropdownMenuItem>
    </>
  );
}

// Product-specific social share component
interface ProductSocialShareProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: string;
    strainType?: string;
    effects?: string[];
  };
  className?: string;
}

export function ProductSocialShare({ product, className = "" }: ProductSocialShareProps) {
  const productUrl = `${window.location.origin}/products?highlight=${product.id}`;
  const productTitle = `Check out ${product.name} - Premium THCA ${product.category}`;
  const productDescription = `${product.name} for just $${product.price}. ${product.strainType ? `${product.strainType} strain` : ''} ${product.effects ? `with ${product.effects.slice(0, 2).join(' & ')} effects` : ''}. Lab-tested quality with fast shipping.`;
  
  const productHashtags = [
    'THCA',
    product.category,
    product.strainType || '',
    'Hemp',
    'Cannabis',
    'Premium',
    'LabTested'
  ].filter(Boolean);

  return (
    <SocialShare
      url={productUrl}
      title={productTitle}
      description={productDescription}
      hashtags={productHashtags}
      className={className}
      variant="icon"
    />
  );
}

// Page-specific social share for strain pages
interface StrainSocialShareProps {
  strainType: 'indica' | 'sativa' | 'hybrid';
  className?: string;
}

export function StrainSocialShare({ strainType, className = "" }: StrainSocialShareProps) {
  const strainUrl = `${window.location.origin}/strains/${strainType}`;
  const strainTitle = `Premium ${strainType.charAt(0).toUpperCase() + strainType.slice(1)} THCA Strains`;
  const strainDescription = `Discover premium ${strainType} THCA strains perfect for ${
    strainType === 'indica' ? 'relaxation and sleep' :
    strainType === 'sativa' ? 'energy and creativity' :
    'balanced effects'
  }. Lab-tested quality with fast shipping nationwide.`;
  
  const strainHashtags = [
    'THCA',
    `${strainType}Strains`,
    strainType === 'indica' ? 'Relaxation' : strainType === 'sativa' ? 'Energy' : 'Balanced',
    'Hemp',
    'Cannabis',
    'Premium',
    'LabTested'
  ];

  return (
    <SocialShare
      url={strainUrl}
      title={strainTitle}
      description={strainDescription}
      hashtags={strainHashtags}
      className={className}
      variant="floating"
    />
  );
}

export default SocialShare;