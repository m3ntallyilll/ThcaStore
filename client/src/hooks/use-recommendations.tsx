import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useCart } from './use-cart';

interface RecommendationTrigger {
  type: 'browsing' | 'cart_add' | 'idle' | 'exit_intent' | 'time_based';
  productId?: string;
  delay?: number;
}

interface UseRecommendationsOptions {
  enableIdleDetection?: boolean;
  enableExitIntent?: boolean;
  enableTimeBased?: boolean;
  idleTimeThreshold?: number; // milliseconds
  timeBasedInterval?: number; // milliseconds
}

export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const {
    enableIdleDetection = true,
    enableExitIntent = true,
    enableTimeBased = true,
    idleTimeThreshold = 60000, // 1 minute
    timeBasedInterval = 300000, // 5 minutes
  } = options;

  const { user } = useAuth();
  const { items } = useCart();
  
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<RecommendationTrigger | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionStart] = useState(Date.now());
  const [hasShownTimeBased, setHasShownTimeBased] = useState(false);

  // Track user activity
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Initialize session tracking
  useEffect(() => {
    if (!localStorage.getItem('session_start')) {
      localStorage.setItem('session_start', sessionStart.toString());
    }

    // Track activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity, sessionStart]);

  // Idle detection
  useEffect(() => {
    if (!enableIdleDetection) return;

    const checkIdle = () => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity >= idleTimeThreshold && !isRecommendationsOpen) {
        triggerRecommendations({
          type: 'idle',
          delay: 1000
        });
      }
    };

    const interval = setInterval(checkIdle, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [enableIdleDetection, lastActivity, idleTimeThreshold, isRecommendationsOpen]);

  // Exit intent detection
  useEffect(() => {
    if (!enableExitIntent) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isRecommendationsOpen) {
        triggerRecommendations({
          type: 'exit_intent',
          delay: 500
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [enableExitIntent, isRecommendationsOpen]);

  // Time-based recommendations
  useEffect(() => {
    if (!enableTimeBased || hasShownTimeBased) return;

    const timeBasedTimer = setTimeout(() => {
      if (!isRecommendationsOpen) {
        triggerRecommendations({
          type: 'time_based',
          delay: 2000
        });
        setHasShownTimeBased(true);
      }
    }, timeBasedInterval);

    return () => clearTimeout(timeBasedTimer);
  }, [enableTimeBased, timeBasedInterval, hasShownTimeBased, isRecommendationsOpen]);

  // Trigger recommendations
  const triggerRecommendations = useCallback((trigger: RecommendationTrigger) => {
    if (isRecommendationsOpen) return;

    setCurrentTrigger(trigger);
    
    if (trigger.delay) {
      setTimeout(() => {
        setIsRecommendationsOpen(true);
      }, trigger.delay);
    } else {
      setIsRecommendationsOpen(true);
    }

    // Track trigger analytics
    const event = new CustomEvent('recommendation_triggered', {
      detail: { 
        trigger: trigger.type, 
        productId: trigger.productId,
        sessionTime: Date.now() - sessionStart,
        cartSize: items.length
      }
    });
    window.dispatchEvent(event);
  }, [isRecommendationsOpen, sessionStart, items.length]);

  // Manual triggers
  const showRecommendations = useCallback((productId?: string) => {
    triggerRecommendations({
      type: 'browsing',
      productId
    });
  }, [triggerRecommendations]);

  const showCartRecommendations = useCallback((productId: string) => {
    triggerRecommendations({
      type: 'cart_add',
      productId,
      delay: 2000 // Show after 2 seconds
    });
  }, [triggerRecommendations]);

  const closeRecommendations = useCallback(() => {
    setIsRecommendationsOpen(false);
    setCurrentTrigger(null);
    
    // Track close analytics
    const event = new CustomEvent('recommendation_closed', {
      detail: { 
        trigger: currentTrigger?.type,
        sessionTime: Date.now() - sessionStart
      }
    });
    window.dispatchEvent(event);
  }, [currentTrigger, sessionStart]);

  // Reset time-based flag when user is active
  useEffect(() => {
    if (Date.now() - lastActivity < 30000) { // Reset if active within 30 seconds
      setHasShownTimeBased(false);
    }
  }, [lastActivity]);

  return {
    isRecommendationsOpen,
    currentTrigger,
    showRecommendations,
    showCartRecommendations,
    closeRecommendations,
    sessionDuration: Date.now() - sessionStart,
    isIdle: Date.now() - lastActivity > idleTimeThreshold,
  };
}