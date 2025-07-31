import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  HeadphonesIcon, 
  MessageSquare, 
  Send, 
  X, 
  User, 
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  PhoneCall,
  Mail,
  MessageCircle,
  Zap,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SupportMessage {
  id: string;
  message: string;
  response?: string;
  isUser: boolean;
  timestamp: Date;
  category?: 'order' | 'product' | 'shipping' | 'payment' | 'account' | 'general';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'resolved' | 'escalated';
  satisfaction?: 'positive' | 'negative';
}

interface AISupportProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const supportCategories = [
  { id: 'order', label: 'Order Issues', icon: '📦', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'product', label: 'Product Questions', icon: '🌿', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'shipping', label: 'Shipping Problems', icon: '🚚', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'payment', label: 'Payment Issues', icon: '💳', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'account', label: 'Account Help', icon: '👤', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'general', label: 'General Questions', icon: '❓', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
];

const quickIssues = [
  'Where is my order?',
  'How to return an item?',
  'Payment not processing',
  'Product quality concern',
  'Account login issues',
  'Shipping delays',
  'Refund request',
  'Product recommendations'
];

export function AISupport({ isOpen: controlledIsOpen, onClose }: AISupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const actualIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

  useEffect(() => {
    if (actualIsOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: SupportMessage = {
        id: `welcome_${Date.now()}`,
        message: '',
        response: `Hello ${user?.firstName || 'there'}! 👋 I'm your AI customer support assistant. I'm here to help you with any questions or issues you might have with your THCA orders, products, or account.\n\nPlease select a category below or describe your issue, and I'll do my best to assist you quickly!`,
        isUser: false,
        timestamp: new Date(),
        category: 'general',
        status: 'pending'
      };
      setMessages([welcomeMessage]);
    }
  }, [actualIsOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: SupportMessage = {
      id: `user_${Date.now()}`,
      message: inputMessage,
      isUser: true,
      timestamp: new Date(),
      category: selectedCategory as any,
      status: 'pending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/support/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          category: selectedCategory,
          userId: user?.id,
          previousMessages: messages.slice(-5) // Last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Support request failed');
      }

      const data = await response.json();

      const aiMessage: SupportMessage = {
        id: `ai_${Date.now()}`,
        message: inputMessage,
        response: data.response,
        isUser: false,
        timestamp: new Date(),
        category: data.category || selectedCategory as any,
        priority: data.priority,
        status: data.needsEscalation ? 'escalated' : 'resolved'
      };

      setMessages(prev => [...prev, aiMessage]);

      if (data.ticketId) {
        setTicketId(data.ticketId);
      }

      if (data.needsEscalation) {
        toast({
          title: "Issue Escalated",
          description: "Your issue has been forwarded to our human support team. You'll receive an email update within 2 hours.",
          variant: "default"
        });
      }

    } catch (error) {
      console.error('Support AI Error:', error);
      const errorMessage: SupportMessage = {
        id: `error_${Date.now()}`,
        message: inputMessage,
        response: "I apologize, but I'm experiencing technical difficulties right now. Please try contacting our human support team directly at support@thcastore.com or call us at (555) 123-THCA for immediate assistance.",
        isUser: false,
        timestamp: new Date(),
        category: 'general',
        status: 'escalated'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectQuickIssue = (issue: string) => {
    setInputMessage(issue);
    setTimeout(() => sendMessage(), 100);
  };

  const provideFeedback = async (messageId: string, satisfaction: 'positive' | 'negative') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, satisfaction }
          : msg
      )
    );

    try {
      await fetch('/api/support/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          satisfaction,
          ticketId
        }),
      });

      toast({
        title: satisfaction === 'positive' ? "Thank you!" : "Feedback Received",
        description: satisfaction === 'positive' 
          ? "We're glad we could help!" 
          : "We'll use your feedback to improve our support.",
      });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Support Toggle Button */}
      {!actualIsOpen && !controlledIsOpen && (
        <motion.div
          className="fixed bottom-4 left-4 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.6)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-purple-500 shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 border-2 border-blue-400/50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <HeadphonesIcon className="w-6 h-6 text-white relative z-10" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Support Window */}
      <AnimatePresence>
        {actualIsOpen && (
          <motion.div
            className="fixed bottom-4 left-4 w-96 h-[600px] z-40"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="h-full glass-dark border-blue-500/20 shadow-2xl overflow-hidden backdrop-blur-lg bg-black/40">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 p-4 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                      <HeadphonesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">🎧 AI Customer Support</h3>
                      <p className="text-sm opacity-90 font-medium">Available 24/7 • Average response: 30 sec</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {ticketId && (
                  <div className="mt-3 p-2 bg-white/10 rounded-lg">
                    <p className="text-xs">Support Ticket: #{ticketId}</p>
                  </div>
                )}
              </div>

              {/* Category Selection */}
              {!selectedCategory && (
                <div className="p-4 border-b border-white/10">
                  <p className="text-sm text-gray-300 mb-3">Select your issue category:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {supportCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`text-xs h-12 flex flex-col items-center justify-center gap-1 ${category.color} bg-[#000000]`}
                      >
                        <span className="text-base">{category.icon}</span>
                        <span className="text-xs">{category.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <CardContent className="flex flex-col h-[350px] p-0">
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
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'glass border border-white/10 text-white'
                        }`}
                      >
                        {!msg.isUser && (
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-blue-400">AI Support</span>
                            {msg.status && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  msg.status === 'resolved' 
                                    ? 'text-green-400 border-green-500/30' 
                                    : msg.status === 'escalated'
                                    ? 'text-orange-400 border-orange-500/30'
                                    : 'text-gray-400 border-gray-500/30'
                                }`}
                              >
                                {msg.status}
                              </Badge>
                            )}
                          </div>
                        )}

                        <p className="text-sm whitespace-pre-wrap">
                          {msg.isUser ? msg.message : msg.response}
                        </p>

                        {/* Feedback buttons for AI responses */}
                        {!msg.isUser && msg.status === 'resolved' && !msg.satisfaction && (
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                            <span className="text-xs text-gray-400">Was this helpful?</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => provideFeedback(msg.id, 'positive')}
                              className="h-6 w-6 p-0 hover:text-green-400"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => provideFeedback(msg.id, 'negative')}
                              className="h-6 w-6 p-0 hover:text-red-400"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        )}

                        {msg.satisfaction && (
                          <div className="mt-2 text-xs opacity-60">
                            {msg.satisfaction === 'positive' ? '✅ Marked as helpful' : '❌ Marked as not helpful'}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                          <span className="text-xs opacity-60">
                            {msg.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {msg.priority && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                msg.priority === 'urgent'
                                  ? 'text-red-400 border-red-500/30'
                                  : msg.priority === 'high'
                                  ? 'text-orange-400 border-orange-500/30'
                                  : 'text-blue-400 border-blue-500/30'
                              }`}
                            >
                              {msg.priority}
                            </Badge>
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
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100" />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200" />
                          </div>
                          <span className="text-xs text-gray-400">AI Support is typing...</span>
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
                      placeholder="Describe your issue or ask a question..."
                      className="flex-1 bg-white/5 border-white/20 focus:border-blue-400 text-white placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Issues */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quickIssues.slice(0, 4).map((issue) => (
                      <Button
                        key={issue}
                        variant="outline"
                        size="sm"
                        onClick={() => selectQuickIssue(issue)}
                        className="text-xs border-white/20 hover:bg-white/5 text-gray-300 bg-[#000000]"
                        disabled={isLoading}
                      >
                        {issue}
                      </Button>
                    ))}
                  </div>

                  {/* Contact options */}
                  <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      <PhoneCall className="w-3 h-3 mr-1" />
                      Call Us
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
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