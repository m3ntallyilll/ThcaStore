import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, Gift, Star, TrendingUp, Settings, Package, Edit3, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';

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
  onProductUpdate?: (productData: any) => void;
  onBlogCreation?: (blogData: any) => void;
  autoOpen?: boolean;
}

export function AIChat({ onProductRecommendation, onOfferSuggestion, onProductUpdate, onBlogCreation, autoOpen = false }: AIChatProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Text-to-Speech functions
  const speakText = (text: string) => {
    if (!speechSynthesisRef.current || !isTTSEnabled) return;

    // Stop any current speech
    speechSynthesisRef.current.cancel();

    // Clean the text for better speech (remove markdown, emojis, etc.)
    const cleanText = text
      .replace(/[🌟🔍💰🏆❓🛠️📊🚛💼✅❌💎🎁]/g, '') // Remove emojis
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`(.*?)`/g, '$1') // Remove code markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/•/g, '') // Remove bullet points
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to use a female voice for the AI assistant
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('alex') ||
      voice.gender === 'female'
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleTTS = () => {
    if (isTTSEnabled && isSpeaking) {
      stopSpeaking();
    }
    setIsTTSEnabled(!isTTSEnabled);
  };

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

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message
      const adminFeatures = user?.isAdmin ? `
• 🛠️ Manage products (add, edit, update inventory)
• 📊 Get sales insights and analytics
• 🚛 Track orders and shipping
• 💼 Handle administrative tasks` : '';

      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        message: '',
        response: `🌟 Welcome to THCA Store! I'm your ${user?.isAdmin ? 'AI admin assistant' : 'personal hemp expert assistant'}. ${user?.isAdmin ? "I'm here to help you manage the store and optimize operations!" : "I'm here to help you find the perfect THCA products, discover amazing deals, and maximize your rewards!"}

${user ? `Great to see you again, ${user.username}! ${user.isAdmin ? 'I have access to all admin functions and can help manage your store.' : 'I can see your rewards status and purchase history to give you personalized recommendations.'}` : 'Sign in to unlock personalized recommendations and track your rewards!'}

How can I help you today? I can:
• 🔍 Recommend products based on your preferences
• 💰 Find the best deals and special offers  
• 🏆 Help you maximize your reward points
• ❓ Answer questions about THCA and our products${adminFeatures}`,
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
      const data = await apiRequest('/api/ai/chat', {
        method: 'POST',
        body: {
          message: messageToSend,
          sessionId,
          userId: user?.id,
          userContext: user ? {
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
          } : null
        }
      });

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

      // Speak the AI response if TTS is enabled
      if (isTTSEnabled && data.response) {
        // Add a small delay to let the message render first
        setTimeout(() => speakText(data.response), 300);
      }

      // Handle action items
      if (data.actionItems) {
        data.actionItems.forEach(async (action: any) => {
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
            case 'product_update':
              if (user?.isAdmin) {
                try {
                  if (action.operation === 'create') {
                    await apiRequest('/api/products', { method: 'POST', body: action.productData });
                  } else if (action.operation === 'update') {
                    await apiRequest(`/api/products/${action.productId}`, { method: 'PUT', body: action.productData });
                  }
                  
                  // Refresh products data
                  queryClient.invalidateQueries({ queryKey: ['/api/products'] });
                  
                  // Show success message
                  const successMessage: ChatMessage = {
                    id: `success_${Date.now()}`,
                    message: '',
                    response: `✅ Product ${action.operation === 'create' ? 'created' : 'updated'} successfully! The changes are now live in your store.`,
                    timestamp: new Date(),
                    isUser: false
                  };
                  setMessages(prev => [...prev, successMessage]);
                  
                  if (onProductUpdate) {
                    onProductUpdate(action.productData);
                  }
                } catch (error) {
                  const errorMessage: ChatMessage = {
                    id: `error_${Date.now()}`,
                    message: '',
                    response: `❌ Failed to ${action.operation} product. Please check the details and try again.`,
                    timestamp: new Date(),
                    isUser: false
                  };
                  setMessages(prev => [...prev, errorMessage]);
                }
              }
              break;

            case 'blog_creation':
              if (action.operation === 'create_draft' && action.blogData) {
                try {
                  // Auto-fill the blog form with AI-generated content
                  onBlogCreation?.(action.blogData);
                  
                  const successMessage: ChatMessage = {
                    id: `blog_success_${Date.now()}`,
                    message: '',
                    response: `✅ I've created a blog draft with the title "${action.blogData.title}" and filled out the form for you! You can review and publish it from the blog management section.`,
                    timestamp: new Date(),
                    isUser: false
                  };
                  setMessages(prev => [...prev, successMessage]);
                } catch (error) {
                  const errorMessage: ChatMessage = {
                    id: `blog_error_${Date.now()}`,
                    message: '',
                    response: `❌ Failed to create blog draft. Please try again or create it manually in the blog management section.`,
                    timestamp: new Date(),
                    isUser: false
                  };
                  setMessages(prev => [...prev, errorMessage]);
                }
              }
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
        return <Gift className="w-4 h-4 text-hemp" />;
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
          className="w-16 h-16 rounded-full bg-gradient-to-r from-gold via-gold-600 to-hemp shadow-2xl hover:shadow-gold/25 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold to-hemp animate-pulse opacity-75" />
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
            <Card className="h-full glass-dark border-gold/20 shadow-2xl overflow-hidden backdrop-blur-lg bg-black/40">
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-green-500 via-green-400 to-gold p-4 text-black relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center border-2 border-black/20 shadow-lg">
                      <Sparkles className="w-6 h-6 text-gold animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">🌿 THCA Expert AI</h3>
                      <p className="text-sm opacity-90 font-medium">Your Personal Hemp Guide & Daily Deals Assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTTS}
                      className={`text-black hover:bg-black/10 transition-all ${
                        isTTSEnabled ? 'bg-black/20' : ''
                      } ${isSpeaking ? 'animate-pulse' : ''}`}
                      title={isTTSEnabled ? (isSpeaking ? 'Speaking... Click to mute' : 'TTS enabled - Click to mute') : 'Click to enable text-to-speech'}
                    >
                      {isTTSEnabled ? (
                        isSpeaking ? (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <Volume2 className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )
                      ) : (
                        <VolumeX className="w-5 h-5 opacity-60" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-black hover:bg-black/20 hover:scale-110 transition-all duration-200"
                      title="Close chat"
                    >
                      <X className="w-5 h-5 font-bold" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <CardContent className="flex flex-col h-[450px] p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
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
                          <div className="mt-3 p-2 bg-hemp/10 rounded-lg border border-hemp/20">
                            <p className="text-xs text-hemp font-semibold mb-2">
                              💎 Recommended Products:
                            </p>
                            <div className="space-y-1">
                              {msg.recommendedProducts.map((productId, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onProductRecommendation?.(productId)}
                                  className="text-xs border-hemp/30 hover:bg-hemp/10 bg-[#000000]"
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
                                  className="text-xs border-gold/30 hover:bg-gold/10 bg-[#000000]"
                                >
                                  {offer.name} - {offer.value}%
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="text-xs opacity-60">
                              {msg.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {!msg.isUser && isSpeaking && (
                              <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="flex items-center gap-1"
                              >
                                <Volume2 className="w-3 h-3 text-gold" />
                                <span className="text-xs text-gold">Speaking...</span>
                              </motion.div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!msg.isUser && msg.response && isTTSEnabled && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakText(msg.response!)}
                                className="h-6 px-2 text-xs hover:bg-white/10 text-gold hover:text-gold-400"
                                disabled={isSpeaking}
                              >
                                <Volume2 className="w-3 h-3" />
                              </Button>
                            )}
                            {!msg.isUser && msg.intent && (
                              <Star className="w-3 h-3 text-gold" />
                            )}
                          </div>
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
                            <div className="w-2 h-2 bg-hemp rounded-full animate-pulse delay-100" />
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

                  <div className="flex items-center justify-between mt-2 mb-1">
                    <div className="flex flex-wrap gap-2">
                      {['Today\'s deals', 'Best flower strains', 'My reward points'].slice(0, 3).map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setInputMessage(suggestion);
                            setTimeout(sendMessage, 100);
                          }}
                          className="text-xs border-white/20 hover:bg-white/5 text-gray-300 bg-[#000000]"
                          disabled={isLoading}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                    {isSpeaking && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={stopSpeaking}
                        className="text-xs border-red-400/30 hover:bg-red-400/10 text-red-400 bg-[#000000]"
                      >
                        <VolumeX className="w-3 h-3 mr-1" />
                        Stop
                      </Button>
                    )}
                  </div>
                  
                  {isTTSEnabled && (
                    <div className="text-xs text-center text-gold/70 mb-2">
                      🔊 Voice enabled - AI responses will be spoken aloud
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}