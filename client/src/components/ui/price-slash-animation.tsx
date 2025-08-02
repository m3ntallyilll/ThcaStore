import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PriceSlashAnimationProps {
  originalPrice: number;
  discountPercent: number;
  className?: string;
}

export function PriceSlashAnimation({ 
  originalPrice, 
  discountPercent, 
  className = "" 
}: PriceSlashAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const newPrice = originalPrice * (1 - discountPercent / 100);
  const savings = originalPrice - newPrice;

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setShowAnimation(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Original Price */}
      <motion.div
        className="relative inline-block"
        initial={{ scale: 1 }}
        animate={{ 
          scale: showAnimation ? [1, 1.1, 0.9] : 1,
          color: showAnimation ? ['#ffffff', '#ef4444', '#6b7280'] : '#ffffff'
        }}
        transition={{ duration: 1.5, times: [0, 0.3, 1] }}
      >
        <span className="text-2xl font-bold">
          ${originalPrice.toFixed(2)}
        </span>
        
        {/* Slash Line Animation */}
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-red-500 origin-left"
          initial={{ scaleX: 0, rotate: -15 }}
          animate={{ 
            scaleX: showAnimation ? 1 : 0,
            opacity: showAnimation ? 1 : 0
          }}
          transition={{ 
            delay: 1,
            duration: 0.8,
            ease: "easeOut"
          }}
          style={{ width: '100%' }}
        />
      </motion.div>

      {/* Arrow and New Price */}
      <motion.div
        className="inline-flex items-center ml-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: showAnimation ? 1 : 0,
          x: showAnimation ? 0 : -20
        }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="text-emerald-400 text-3xl font-bold mr-2"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ 
            delay: 2,
            duration: 0.5,
            repeat: 2
          }}
        >
          →
        </motion.div>
        
        <motion.div
          className="text-emerald-400"
          initial={{ scale: 0 }}
          animate={{ scale: showAnimation ? [0, 1.2, 1] : 0 }}
          transition={{ 
            delay: 1.8,
            duration: 0.6,
            times: [0, 0.6, 1]
          }}
        >
          <span className="text-3xl font-bold">
            ${newPrice.toFixed(2)}
          </span>
        </motion.div>
      </motion.div>

      {/* Savings Badge */}
      <motion.div
        className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: showAnimation ? [0, 1.3, 1] : 0,
          rotate: showAnimation ? [180, -10, 0] : 180
        }}
        transition={{ 
          delay: 2.5,
          duration: 0.8,
          type: "spring",
          stiffness: 200
        }}
      >
        SAVE ${savings.toFixed(0)}!
      </motion.div>

      {/* Floating Sparkles */}
      {showAnimation && [1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400 text-lg pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [-20, -40],
            rotate: [0, 180]
          }}
          transition={{
            delay: 2 + i * 0.2,
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}