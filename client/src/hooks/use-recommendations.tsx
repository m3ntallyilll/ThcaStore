import { useState, useEffect, useCallback } from 'react';

interface RecommendationTrigger {
  type: 'idle' | 'exit_intent' | 'time_based' | 'cart_add' | 'product_view';
  productId?: string;
  timestamp: number;
}

interface UseRecommendationsOptions {
  enableIdleDetection?: boolean;
  enableExitIntent?: boolean;
  enableTimeBased?: boolean;
  idleTimeThreshold?: number;
  timeBasedInterval?: number;
}

export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const {
    enableIdleDetection = true,
    enableExitIntent = true,
    enableTimeBased = true,
    idleTimeThreshold = 90000, // 1.5 minutes
    timeBasedInterval = 120000, // 2 minutes for faster popup
  } = options;

  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<RecommendationTrigger | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionStart] = useState(Date.now());

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Show recommendations with trigger
  const showRecommendations = useCallback((productId?: string, triggerType: RecommendationTrigger['type'] = 'product_view') => {
    const trigger: RecommendationTrigger = {
      type: triggerType,
      productId,
      timestamp: Date.now()
    };
    setCurrentTrigger(trigger);
    setIsRecommendationsOpen(true);
  }, []);

  // Show cart-specific recommendations
  const showCartRecommendations = useCallback((productId: string) => {
    showRecommendations(productId, 'cart_add');
  }, [showRecommendations]);

  // Close recommendations
  const closeRecommendations = useCallback(() => {
    setIsRecommendationsOpen(false);
    setCurrentTrigger(null);
    updateActivity(); // Reset activity when manually closed
  }, [updateActivity]);

  // Idle detection
  useEffect(() => {
    if (!enableIdleDetection) return;

    const checkIdleTime = () => {
      const idleTime = Date.now() - lastActivity;
      if (idleTime >= idleTimeThreshold && !isRecommendationsOpen) {
        showRecommendations(undefined, 'idle');
      }
    };

    const interval = setInterval(checkIdleTime, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [enableIdleDetection, idleTimeThreshold, lastActivity, isRecommendationsOpen, showRecommendations]);

  // Time-based recommendations
  useEffect(() => {
    if (!enableTimeBased) return;

    const timer = setTimeout(() => {
      if (!isRecommendationsOpen) {
        showRecommendations(undefined, 'time_based');
      }
    }, timeBasedInterval);

    return () => clearTimeout(timer);
  }, [enableTimeBased, timeBasedInterval, isRecommendationsOpen, showRecommendations]);

  // Exit intent detection
  useEffect(() => {
    if (!enableExitIntent) return;

    let hasTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered && !isRecommendationsOpen) {
        hasTriggered = true;
        showRecommendations(undefined, 'exit_intent');
        
        // Reset trigger after 10 seconds
        setTimeout(() => {
          hasTriggered = false;
        }, 10000);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [enableExitIntent, isRecommendationsOpen, showRecommendations]);

  // Track user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity]);

  // Store session start time in localStorage
  useEffect(() => {
    localStorage.setItem('session_start', sessionStart.toString());
  }, [sessionStart]);

  return {
    isRecommendationsOpen,
    currentTrigger,
    showRecommendations,
    showCartRecommendations,
    closeRecommendations,
    updateActivity
  };
}