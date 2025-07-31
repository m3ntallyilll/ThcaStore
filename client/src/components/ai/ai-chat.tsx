import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, Gift, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  intent?: string;
  sentiment?: string;
  recommendedProducts?: string[];
  suggestedOffers?: any[];
  actionItems?: any[];
  timestamp: Date;
  isUser: boolean;
}

interface AIChatProps {
  onProductRecommendation?: (productId: string) => void;
  onOfferSuggestion?: (offer: any) => void;
  autoOpen?: boolean;
}

export function AIChat({ onProductRecommendation, onOfferSuggestion, autoOpen = false }: AIChatProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-open on first visit
  useEffect(() => {
    if (autoOpen && !hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
      }, 2000); // Open after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [autoOpen, hasAutoOpened]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        message: '',
        response: `🌟 Welcome to THCA Store! I'm your personal cannabis expert assistant. I'm here to help you find the perfect THCA products, discover amazing deals, and maximize your rewards!

${user ? `Great to see you again, ${user.username}! I can see your rewards status and purchase history to give you personalized recommendations.` : 'Sign in to unlock personalized recommendations and track your rewards!'}

How can I help you today? I can:
• 🔍 Recommend products based on your preferences
• 💰 Find the best deals and special offers  
• 🏆 Help you maximize your reward points
• ❓ Answer questions about THCA and our products`,
        intent: 'welcome',
        sentiment: 'positive',
        timestamp: new Date(),
        isUser: false
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      message: inputMessage,
      timestamp: new Date(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          sessionId,
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        message: inputMessage,
        response: data.response,
        intent: data.intent,
        sentiment: data.sentiment,
        recommendedProducts: data.recommendedProducts || [],
        suggestedOffers: data.suggestedOffers || [],
        actionItems: data.actionItems || [],
        timestamp: new Date(),
        isUser: false
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle action items
      if (data.actionItems) {
        data.actionItems.forEach((action: any) => {
          switch (action.type) {
            case 'show_rewards':
              // Could trigger a rewards modal or navigation
              break;
            case 'generate_referral':
              // Could trigger referral code generation
              break;
            case 'apply_discount':
              // Could apply discount codes
              break;
          }
        });
      }

      // Handle product recommendations
      if (data.recommendedProducts && data.recommendedProducts.length > 0) {
        data.recommendedProducts.forEach((productId: string) => {
          onProductRecommendation?.(productId);
        });
      }

      // Handle offer suggestions
      if (data.suggestedOffers && data.suggestedOffers.length > 0) {
        data.suggestedOffers.forEach((offer: any) => {
          onOfferSuggestion?.(offer);
        });
      }

    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        message: inputMessage,
        response: "I apologize, but I'm having technical difficulties right now. Please try again in a moment, or feel free to browse our amazing THCA products while I get back online! 🌿",
        intent: 'error',
        sentiment: 'neutral',
        timestamp: new Date(),
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case 'product_recommendation':
        return <Sparkles className="w-4 h-4 text-gold" />;
      case 'rewards_inquiry':
        return <Gift className="w-4 h-4 text-cannabis" />;
      case 'price_inquiry':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      default:
        return <MessageCircle className="w-4 h-4 text-purple-400" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-gold via-gold-600 to-cannabis shadow-2xl hover:shadow-gold/25 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold to-cannabis animate-pulse opacity-75" />
          <div className="relative z-10">
            {isOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <MessageCircle className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
            )}
          </div>
          {!isOpen && (
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              AI
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[600px] z-40"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="h-full glass-dark border-gold/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-gold via-gold-600 to-cannabis p-4 text-black">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">THCA Expert AI</h3>
                      <p className="text-xs opacity-80">Your Personal Cannabis Guide</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-black hover:bg-black/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <CardContent className="flex flex-col h-[450px] p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl relative ${
                          msg.isUser
                            ? 'bg-gradient-to-r from-gold to-gold-600 text-black'
                            : 'glass border border-white/10 text-white'
                        }`}
                      >
                        {!msg.isUser && (
                          <div className="flex items-center gap-2 mb-2">
                            {getIntentIcon(msg.intent)}
                            <span className="text-xs text-gray-400">
                              {msg.intent?.replace('_', ' ').toUpperCase()}
                            </span>
                            {msg.sentiment && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${getSentimentColor(msg.sentiment)} border-current`}
                              >
                                {msg.sentiment}
                              </Badge>
                            )}
                          </div>
                        )}

                        <p className="text-sm whitespace-pre-wrap">
                          {msg.isUser ? msg.message : msg.response}
                        </p>

                        {/* Recommended Products */}
                        {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                          <div className="mt-3 p-2 bg-cannabis/10 rounded-lg border border-cannabis/20">
                            <p className="text-xs text-cannabis font-semibold mb-2">
                              💎 Recommended Products:
                            </p>
                            <div className="space-y-1">
                              {msg.recommendedProducts.map((productId, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onProductRecommendation?.(productId)}
                                  className="text-xs border-cannabis/30 hover:bg-cannabis/10"
                                >
                                  View Product #{productId.slice(-4)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggested Offers */}
                        {msg.suggestedOffers && msg.suggestedOffers.length > 0 && (
                          <div className="mt-3 p-2 bg-gold/10 rounded-lg border border-gold/20">
                            <p className="text-xs text-gold font-semibold mb-2">
                              🎁 Special Offers:
                            </p>
                            <div className="space-y-1">
                              {msg.suggestedOffers.map((offer, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onOfferSuggestion?.(offer)}
                                  className="text-xs border-gold/30 hover:bg-gold/10"
                                >
                                  {offer.name} - {offer.value}%
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                          <span className="text-xs opacity-60">
                            {msg.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {!msg.isUser && msg.intent && (
                            <Star className="w-3 h-3 text-gold" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="glass border border-white/10 p-3 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-cannabis rounded-full animate-pulse delay-100" />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                          </div>
                          <span className="text-xs text-gray-400">AI is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about THCA products, deals, or rewards..."
                      className="flex-1 bg-white/5 border-white/20 focus:border-gold text-white placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-gold to-gold-600 text-black hover:from-gold-600 hover:to-gold disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Show me deals', 'Best flower strains', 'My reward points', 'Product recommendations'].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInputMessage(suggestion);
                          setTimeout(sendMessage, 100);
                        }}
                        className="text-xs border-white/20 hover:bg-white/5 text-gray-300"
                        disabled={isLoading}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}