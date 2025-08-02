import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface FloatingDiscountBannerProps {
  discount: DiscountOffer;
  onClear: () => void;
}

export function FloatingDiscountBanner({ discount, onClear }: FloatingDiscountBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClear(), 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-4 right-4 z-40 max-w-sm"
      >
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg shadow-2xl border border-emerald-500/30 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-emerald-700/50">
            <div className="flex items-center">
              <Tag className="w-4 h-4 text-emerald-200 mr-2" />
              <span className="text-emerald-100 font-semibold text-sm">
                Active Discount
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-emerald-200 hover:text-white hover:bg-emerald-600/50 p-1 h-auto"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold text-lg">
                {discount.discountPercent}% OFF
              </span>
              <div className="bg-emerald-500/30 rounded-full px-2 py-1">
                <span className="text-emerald-100 text-xs font-medium">
                  {discount.code}
                </span>
              </div>
            </div>
            
            <p className="text-emerald-100 text-sm mb-3">
              Applied at checkout
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="sm"
                className="w-full bg-white hover:bg-emerald-50 text-emerald-700 font-semibold"
                onClick={() => {
                  // Navigate to products or cart
                  window.location.href = '/products';
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}