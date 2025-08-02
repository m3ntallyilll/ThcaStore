import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Timer, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceSlashAnimation } from '@/components/ui/price-slash-animation';

interface DiscountPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (discount: DiscountOffer) => void;
}

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

const DISCOUNT_OFFERS: DiscountOffer[] = [
  {
    id: 'flash-25',
    title: 'FLASH SALE!',
    description: 'Limited time offer on premium strains',
    discountPercent: 25,
    originalPrice: 120,
    newPrice: 90,
    timeLeft: 15 * 60, // 15 minutes
    code: 'FLASH25',
    minPurchase: 50
  },
  {
    id: 'first-time-30',
    title: 'First Time Buyer Special',
    description: 'Welcome bonus for new customers',
    discountPercent: 30,
    originalPrice: 100,
    newPrice: 70,
    timeLeft: 30 * 60, // 30 minutes
    code: 'WELCOME30',
    minPurchase: 75
  },
  {
    id: 'bulk-save-20',
    title: 'Bulk Order Savings',
    description: 'Save big on larger quantities',
    discountPercent: 20,
    originalPrice: 200,
    newPrice: 160,
    timeLeft: 45 * 60, // 45 minutes
    code: 'BULK20',
    minPurchase: 150
  },
  {
    id: 'weekend-35',
    title: 'Weekend Warrior Deal',
    description: 'Exclusive weekend pricing',
    discountPercent: 35,
    originalPrice: 80,
    newPrice: 52,
    timeLeft: 20 * 60, // 20 minutes
    code: 'WEEKEND35',
    minPurchase: 40
  }
];

export function DiscountPopup({ isOpen, onClose, onApplyDiscount }: DiscountPopupProps) {
  const [selectedOffer, setSelectedOffer] = useState<DiscountOffer>(
    DISCOUNT_OFFERS[Math.floor(Math.random() * DISCOUNT_OFFERS.length)]
  );
  const [timeLeft, setTimeLeft] = useState(selectedOffer.timeLeft);
  const [showUrgency, setShowUrgency] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch to a new offer when time runs out
          const newOffer = DISCOUNT_OFFERS[Math.floor(Math.random() * DISCOUNT_OFFERS.length)];
          setSelectedOffer(newOffer);
          return newOffer.timeLeft;
        }
        
        // Show urgency when less than 5 minutes left
        if (prev <= 5 * 60) {
          setShowUrgency(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, selectedOffer.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClaimDeal = () => {
    onApplyDiscount(selectedOffer);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-emerald-500/20 shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10" />
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-500/20 rounded-full blur-xl" />

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Content */}
          <div className="relative z-10">
            {/* Header with Flash Effect */}
            <motion.div
              animate={{ rotate: showUrgency ? [0, -2, 2, 0] : 0 }}
              transition={{ repeat: showUrgency ? Infinity : 0, duration: 0.5 }}
              className="text-center mb-6"
            >
              <div className="flex items-center justify-center mb-2">
                <Zap className={`w-6 h-6 mr-2 ${showUrgency ? 'text-red-400' : 'text-emerald-400'}`} />
                <h2 className={`text-2xl font-bold ${showUrgency ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedOffer.title}
                </h2>
                <Zap className={`w-6 h-6 ml-2 ${showUrgency ? 'text-red-400' : 'text-emerald-400'}`} />
              </div>
              <p className="text-gray-300 text-sm">{selectedOffer.description}</p>
            </motion.div>

            {/* Discount Display */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <Badge 
                  className={`text-2xl font-bold px-6 py-2 ${
                    showUrgency 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {selectedOffer.discountPercent}% OFF
                </Badge>
              </div>

              {/* Animated Price Slash */}
              <div className="flex justify-center mb-4">
                <PriceSlashAnimation 
                  originalPrice={selectedOffer.originalPrice}
                  discountPercent={selectedOffer.discountPercent}
                />
              </div>

              {/* Savings Amount */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex items-center bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-full px-4 py-2 border border-emerald-500/30"
              >
                <DollarSign className="w-4 h-4 text-emerald-400 mr-1" />
                <span className="text-emerald-400 font-bold">
                  You Save ${selectedOffer.originalPrice - selectedOffer.newPrice}!
                </span>
              </motion.div>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Timer className={`w-4 h-4 mr-2 ${showUrgency ? 'text-red-400' : 'text-amber-400'}`} />
                <span className="text-gray-300 text-sm">Time Remaining</span>
              </div>
              <motion.div
                animate={{ 
                  color: showUrgency ? ['#ef4444', '#fbbf24', '#ef4444'] : '#fbbf24'
                }}
                transition={{ repeat: showUrgency ? Infinity : 0, duration: 1 }}
                className={`text-3xl font-mono font-bold ${
                  showUrgency ? 'text-red-400' : 'text-amber-400'
                }`}
              >
                {formatTime(timeLeft)}
              </motion.div>
            </div>

            {/* Minimum Purchase Notice */}
            {selectedOffer.minPurchase && (
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm">
                  *Minimum purchase of ${selectedOffer.minPurchase} required
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleClaimDeal}
                  className={`w-full py-4 text-lg font-bold ${
                    showUrgency
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                  } text-white border-0 shadow-lg`}
                >
                  🎯 CLAIM THIS DEAL - {selectedOffer.code}
                </Button>
              </motion.div>
              
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full py-2 text-gray-400 border-gray-600 hover:bg-gray-800/50"
              >
                Maybe Later
              </Button>
            </div>

            {/* Urgency Messages */}
            {showUrgency && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4"
              >
                <p className="text-red-400 text-sm font-semibold animate-pulse">
                  ⚡ Hurry! This deal expires soon!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}