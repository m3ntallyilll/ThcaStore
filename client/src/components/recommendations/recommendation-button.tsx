import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';

interface RecommendationButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'floating' | 'inline' | 'navbar';
}

export function RecommendationButton({ 
  onClick, 
  className = '', 
  variant = 'floating' 
}: RecommendationButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === 'floating') {
    return (
      <motion.div
        className={`fixed bottom-24 left-4 z-40 ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: "spring" }}
      >
        <Button
          onClick={onClick}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-testid="button-recommendations-floating"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <span className="hidden sm:inline font-semibold">
              Get Recommendations
            </span>
          </div>
        </Button>
        
        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-400 opacity-30 -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    );
  }

  if (variant === 'navbar') {
    return (
      <Button
        onClick={onClick}
        variant="ghost"
        className={`text-white/90 hover:text-white hover:bg-white/10 transition-colors ${className}`}
        data-testid="button-recommendations-navbar"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        <span className="hidden md:inline">Recommendations</span>
      </Button>
    );
  }

  // Inline variant
  return (
    <Button
      onClick={onClick}
      className={`bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white ${className}`}
      data-testid="button-recommendations-inline"
    >
      <Zap className="w-4 h-4 mr-2" />
      Get AI Recommendations
    </Button>
  );
}