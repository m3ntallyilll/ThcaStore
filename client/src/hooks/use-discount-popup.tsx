import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

interface DiscountOffer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  originalPrice: number;
  newPrice: number;
  timeLeft: number;
  code: string;
  minPurchase?: number;
}

export function useDiscountPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<DiscountOffer | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Show popups for both guest and logged-in users, but check cooldown
    const lastPopupTime = localStorage.getItem('lastDiscountPopup');
    const now = Date.now();
    const cooldownPeriod = 30 * 60 * 1000; // 30 minutes

    if (lastPopupTime && (now - parseInt(lastPopupTime)) < cooldownPeriod) {
      return;
    }

    // Show popup after user has been browsing for a bit
    const timer = setTimeout(() => {
      console.log('🎁 Showing discount popup for user');
      setShowPopup(true);
      localStorage.setItem('lastDiscountPopup', now.toString());
    }, 8000); // Show after 8 seconds for faster visibility

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const applyDiscount = (discount: DiscountOffer) => {
    setCurrentDiscount(discount);
    // Store discount code in localStorage for checkout
    localStorage.setItem('activeDiscountCode', discount.code);
    localStorage.setItem('activeDiscountPercent', discount.discountPercent.toString());
    setShowPopup(false);
  };

  const clearDiscount = () => {
    setCurrentDiscount(null);
    localStorage.removeItem('activeDiscountCode');
    localStorage.removeItem('activeDiscountPercent');
  };

  // Check for existing discount on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('activeDiscountCode');
    const savedPercent = localStorage.getItem('activeDiscountPercent');
    
    if (savedCode && savedPercent) {
      // Reconstruct discount object (simplified version)
      setCurrentDiscount({
        id: 'saved',
        title: 'Active Discount',
        description: 'Applied discount code',
        discountPercent: parseInt(savedPercent),
        originalPrice: 100,
        newPrice: 100 - parseInt(savedPercent),
        timeLeft: 0,
        code: savedCode
      });
    }
  }, []);

  return {
    showPopup,
    currentDiscount,
    closePopup,
    applyDiscount,
    clearDiscount
  };
}