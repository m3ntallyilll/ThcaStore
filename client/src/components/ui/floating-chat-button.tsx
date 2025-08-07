import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Headphones } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
  hasUnreadMessages?: boolean;
  className?: string;
}

export function FloatingChatButton({ 
  onClick, 
  isOpen, 
  hasUnreadMessages = false,
  className = ""
}: FloatingChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        delay: 1.5 // Delay appearance to let page load
      }}
    >
      <div className="relative">
        {/* Floating Action Button */}
        <Button
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative w-16 h-16 rounded-full shadow-2xl
            bg-gradient-to-r from-green-500 to-emerald-600 
            hover:from-green-400 hover:to-emerald-500
            border-2 border-green-400/50
            transition-all duration-300 ease-in-out
            transform hover:scale-110 hover:shadow-green-500/50
            ${isOpen ? 'bg-red-500 hover:bg-red-400' : ''}
          `}
          data-testid="floating-chat-button"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle className="w-6 h-6 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Notification Badge */}
        <AnimatePresence>
          {hasUnreadMessages && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2"
            >
              <Badge className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                !
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Animation Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-green-400/30"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 whitespace-nowrap"
            >
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-xl border border-gray-600">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-green-400" />
                  <span className="font-medium">Need Help? Chat with AI</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Get instant assistance & product recommendations
                </p>
                {/* Arrow pointing to button */}
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-8 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}