// AI-powered customer support system
export interface SupportRequest {
  message: string;
  category?: string;
  userId?: string;
  previousMessages?: any[];
}

export interface SupportResponse {
  response: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  needsEscalation?: boolean;
  ticketId?: string;
  suggestedActions?: string[];
}

// Support knowledge base
const supportKnowledgeBase = {
  order: {
    tracking: "You can track your order by logging into your account and checking the 'My Orders' section. If you need immediate assistance, please provide your order number.",
    cancellation: "Orders can be canceled within 1 hour of placement if they haven't been processed yet. Contact us immediately for cancellation requests.",
    modification: "Order modifications are possible within 30 minutes of placement. After that, please contact support for assistance.",
    delays: "We understand shipping delays can be frustrating. Most orders arrive within 3-5 business days. Weather and local regulations may cause delays."
  },
  product: {
    quality: "All our THCA products are lab-tested for purity and potency. If you have quality concerns, we offer a 30-day satisfaction guarantee.",
    effects: "THCA effects vary by person and product type. Start with small amounts and gradually increase. Consult our product guides for detailed information.",
    storage: "Store THCA products in a cool, dry place away from direct sunlight. Proper storage maintains potency and extends shelf life.",
    dosage: "Dosage recommendations depend on your experience level and the specific product. Always start low and go slow."
  },
  shipping: {
    states: "We ship to most states where THCA is legal. Check our shipping page for current state restrictions and regulations.",
    speed: "We offer standard (3-5 days), expedited (2-3 days), and express (1-2 days) shipping options.",
    packaging: "All packages are discreetly packaged with no external indication of contents for your privacy.",
    costs: "Free shipping on orders over $75. Shipping costs vary by location and speed selected."
  },
  payment: {
    methods: "We accept major credit cards, debit cards, and bank transfers. Cryptocurrency payments available for qualifying orders.",
    security: "All payments are processed through secure, encrypted channels. We never store your payment information.",
    declined: "Payment declines can happen for various reasons. Try a different payment method or contact your bank.",
    refunds: "Refunds are processed within 5-7 business days to your original payment method after we receive returned items."
  },
  account: {
    login: "If you can't log in, try resetting your password. Clear your browser cache if problems persist.",
    registration: "Account registration is quick and easy. You'll need a valid email address and must be 21+ years old.",
    rewards: "Earn points with every purchase! 1 point per $1 spent. 100 points = $5 reward credit.",
    privacy: "Your personal information is protected and never shared with third parties without your consent."
  }
};

// Common issue patterns and responses
const issuePatterns = [
  {
    keywords: ['track', 'tracking', 'where', 'order', 'shipped'],
    category: 'order',
    response: supportKnowledgeBase.order.tracking,
    priority: 'medium'
  },
  {
    keywords: ['cancel', 'cancellation', 'stop order'],
    category: 'order',
    response: supportKnowledgeBase.order.cancellation,
    priority: 'high'
  },
  {
    keywords: ['quality', 'bad', 'wrong', 'defective', 'contaminated'],
    category: 'product',
    response: supportKnowledgeBase.product.quality,
    priority: 'high'
  },
  {
    keywords: ['payment', 'card', 'declined', 'charged', 'billing'],
    category: 'payment',
    response: supportKnowledgeBase.payment.declined,
    priority: 'high'
  },
  {
    keywords: ['shipping', 'delivery', 'late', 'delayed'],
    category: 'shipping',
    response: supportKnowledgeBase.shipping.speed,
    priority: 'medium'
  },
  {
    keywords: ['login', 'password', 'account', 'access'],
    category: 'account',
    response: supportKnowledgeBase.account.login,
    priority: 'medium'
  },
  {
    keywords: ['refund', 'return', 'money back'],
    category: 'payment',
    response: supportKnowledgeBase.payment.refunds,
    priority: 'high'
  },
  {
    keywords: ['effects', 'dosage', 'how much', 'potency'],
    category: 'product',
    response: supportKnowledgeBase.product.effects,
    priority: 'low'
  }
];

// Escalation triggers
const escalationTriggers = [
  'legal', 'lawyer', 'sue', 'complaint', 'horrible', 'worst', 'never again',
  'scam', 'fraud', 'police', 'report', 'bbb', 'attorney general'
];

export function processSupportRequest(request: SupportRequest): SupportResponse {
  const { message, category, userId } = request;
  const lowerMessage = message.toLowerCase();

  // Check for escalation triggers
  const needsEscalation = escalationTriggers.some(trigger => 
    lowerMessage.includes(trigger)
  );

  if (needsEscalation) {
    return {
      response: "I understand you're having a serious concern. I'm escalating this to our senior support team who will contact you directly within 2 hours. In the meantime, you can also reach our support line at 702-482-9794 or email support@mentally-chill.online.",
      needsEscalation: true,
      priority: 'urgent',
      ticketId: generateTicketId()
    };
  }

  // Find matching issue pattern
  const matchedPattern = issuePatterns.find(pattern =>
    pattern.keywords.some(keyword => lowerMessage.includes(keyword))
  );

  if (matchedPattern) {
    let response = matchedPattern.response;
    
    // Add personalized touches based on category
    if (matchedPattern.category === 'order' && userId) {
      response += "\n\nI can help you check your specific order status. Please provide your order number for detailed tracking information.";
    }
    
    if (matchedPattern.category === 'product') {
      response += "\n\nFor product-specific questions, feel free to ask about any particular item in our catalog. I'm here to help you find the perfect THCA products for your needs.";
    }

    return {
      response,
      category: matchedPattern.category,
      priority: matchedPattern.priority as 'low' | 'medium' | 'high' | 'urgent',
      ticketId: matchedPattern.priority === 'high' ? generateTicketId() : undefined
    };
  }

  // Default response for unmatched queries
  const generalResponses = [
    "Thank you for contacting THCA Store support! I'm here to help you with any questions about your orders, products, shipping, or account. Could you please provide more details about what you need assistance with?",
    "I'm your AI support assistant and I'd be happy to help! Whether you have questions about our THCA products, need order assistance, or have account issues, I'm here for you. What specific issue can I help you resolve today?",
    "Hello! I understand you need assistance. I can help with order tracking, product information, shipping questions, payment issues, and general inquiries. Please tell me more about your specific concern so I can provide the best help possible."
  ];

  const randomResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];

  return {
    response: randomResponse,
    category: category || 'general',
    priority: 'low'
  };
}

function generateTicketId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `THCA-${timestamp}-${random}`.toUpperCase();
}

// Enhanced support with context awareness
export function processAdvancedSupportRequest(request: SupportRequest): SupportResponse {
  const { message, previousMessages = [], userId } = request;
  
  // Analyze conversation context
  const conversationContext = previousMessages
    .filter((msg: any) => !msg.isUser)
    .map((msg: any) => msg.response)
    .join(' ');

  // Check if user is expressing frustration
  const frustrationKeywords = ['frustrated', 'angry', 'disappointed', 'terrible', 'awful', 'hate'];
  const isFrustrated = frustrationKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );

  if (isFrustrated) {
    const empathyResponse = "I completely understand your frustration, and I sincerely apologize for any inconvenience you've experienced. Your satisfaction is our top priority, and I want to make this right for you. ";
    
    const basicResponse = processSupportRequest(request);
    
    return {
      ...basicResponse,
      response: empathyResponse + basicResponse.response + "\n\nI'm personally committed to resolving this issue for you. Is there anything specific I can do right now to improve your experience?",
      priority: 'high' as const
    };
  }

  // Check for repeat issues (if user asking similar questions)
  const isRepeatIssue = previousMessages.length > 2 && 
    previousMessages.some((msg: any) => 
      msg.isUser && msg.message.toLowerCase().includes(message.toLowerCase().split(' ')[0])
    );

  if (isRepeatIssue) {
    return {
      response: "I notice you've mentioned this issue before, and I want to ensure we get this resolved for you properly. Let me escalate this to our specialist team who can provide more detailed assistance. You'll receive a call within 1 hour.",
      needsEscalation: true,
      priority: 'high',
      ticketId: generateTicketId()
    };
  }

  return processSupportRequest(request);
}