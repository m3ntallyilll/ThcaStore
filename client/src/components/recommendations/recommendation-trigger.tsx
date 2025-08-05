import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { PersonalizedRecommendations } from './personalized-recommendations';
import { useRecommendations } from '@/hooks/use-recommendations';

interface RecommendationTriggerProps {
  currentProductId?: string;
  children?: React.ReactNode;
}

export function RecommendationTrigger({ currentProductId, children }: RecommendationTriggerProps) {
  const [location] = useLocation();
  const {
    isRecommendationsOpen,
    currentTrigger,
    showRecommendations,
    showCartRecommendations,
    closeRecommendations,
  } = useRecommendations({
    enableIdleDetection: true,
    enableExitIntent: true,
    enableTimeBased: true,
    idleTimeThreshold: 90000, // 1.5 minutes
    timeBasedInterval: 240000, // 4 minutes
  });

  // Listen for custom events to trigger recommendations
  useEffect(() => {
    const handleCartAdd = (event: CustomEvent) => {
      if (event.detail?.productId) {
        showCartRecommendations(event.detail.productId);
      }
    };

    const handleShowRecommendations = (event: CustomEvent) => {
      showRecommendations(event.detail?.productId);
    };

    // Add event listeners
    window.addEventListener('cart_item_added', handleCartAdd as EventListener);
    window.addEventListener('show_recommendations', handleShowRecommendations as EventListener);

    return () => {
      window.removeEventListener('cart_item_added', handleCartAdd as EventListener);
      window.removeEventListener('show_recommendations', handleShowRecommendations as EventListener);
    };
  }, [showCartRecommendations, showRecommendations]);

  // Auto-trigger recommendations on product pages after viewing for a while
  useEffect(() => {
    if (currentProductId && location.includes('/products')) {
      const timer = setTimeout(() => {
        showRecommendations(currentProductId);
      }, 45000); // Show after 45 seconds on product page

      return () => clearTimeout(timer);
    }
  }, [currentProductId, location, showRecommendations]);

  return (
    <>
      {children}
      <PersonalizedRecommendations
        isOpen={isRecommendationsOpen}
        onClose={closeRecommendations}
        currentProductId={currentTrigger?.productId || currentProductId}
        triggerReason={currentTrigger?.type === 'product_view' ? 'browsing' : (currentTrigger?.type || 'browsing')}
      />
    </>
  );
}