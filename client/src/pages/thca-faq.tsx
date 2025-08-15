import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, ChevronUp, Search, HelpCircle, 
  Shield, Scale, FlaskConical, Leaf, Clock, AlertTriangle
} from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/schema-markup';

const faqData = [
  {
    category: "THCA Basics",
    icon: <Leaf className="h-5 w-5" />,
    questions: [
      {
        question: "What is THCA?",
        answer: "THCA (Tetrahydrocannabinolic acid) is the non-psychoactive precursor to THC found in raw cannabis plants. Unlike THC, THCA doesn't produce intoxicating effects until it's heated through decarboxylation."
      },
      {
        question: "How is THCA different from THC?",
        answer: "THCA is non-psychoactive and contains a carboxyl group that THC lacks. When heated, THCA loses this group and converts to THC, which is psychoactive. THCA products remain legal under federal hemp laws when derived from compliant hemp plants."
      },
      {
        question: "What are the potential benefits of THCA?",
        answer: "Preliminary research suggests THCA may have anti-inflammatory, neuroprotective, and anti-nausea properties. However, more clinical studies are needed to fully establish therapeutic benefits."
      }
    ]
  },
  {
    category: "Legal Status",
    icon: <Scale className="h-5 w-5" />,
    questions: [
      {
        question: "Is THCA legal?",
        answer: "Yes, hemp-derived THCA products containing less than 0.3% Delta-9 THC are federally legal under the 2018 Farm Bill. However, state laws may vary, so check your local regulations."
      },
      {
        question: "Can I travel with THCA products?",
        answer: "You can travel with legal hemp-derived THCA products within states where they're permitted. Always check destination laws and carry your product's Certificate of Analysis (COA)."
      },
      {
        question: "Will THCA show up on a drug test?",
        answer: "THCA itself typically won't trigger standard drug tests, but some products may contain trace amounts of THC. If you're subject to drug testing, consult with professionals before using any cannabis products."
      }
    ]
  },
  {
    category: "Products & Usage",
    icon: <FlaskConical className="h-5 w-5" />,
    questions: [
      {
        question: "What types of THCA products are available?",
        answer: "Common THCA products include flower, concentrates (diamonds, sauce), pre-rolls, tinctures, and capsules. Each offers different potency levels and consumption methods."
      },
      {
        question: "How do I use THCA products?",
        answer: "THCA can be consumed raw (non-psychoactive) or heated to convert to THC. Popular methods include smoking, vaping, dabbing concentrates, or adding raw THCA to smoothies and foods."
      },
      {
        question: "What's the recommended THCA dosage?",
        answer: "Start with small amounts (0.1-0.5g for flower, less for concentrates) and gradually increase. Effects and optimal dosage vary by individual, product type, and consumption method."
      },
      {
        question: "How should I store THCA products?",
        answer: "Store in cool, dark, dry places away from heat and light. Use airtight containers to preserve freshness and potency. Proper storage prevents degradation and maintains quality."
      }
    ]
  },
  {
    category: "Quality & Safety",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        question: "How do I know if THCA products are high quality?",
        answer: "Look for third-party lab testing (COA), proper packaging, clear labeling, hemp-derived sourcing, and reputable brands. Quality products will have consistent potency and no harmful contaminants."
      },
      {
        question: "What should I look for in lab reports?",
        answer: "Check for cannabinoid potency, pesticide screening, heavy metals testing, microbial analysis, and residual solvents. A complete COA ensures product safety and compliance."
      },
      {
        question: "Are there any side effects of THCA?",
        answer: "Raw THCA is generally well-tolerated with minimal reported side effects. However, when heated and converted to THC, typical cannabis effects may occur. Start with low doses and monitor your response."
      }
    ]
  },
  {
    category: "Purchasing & Shipping",
    icon: <Clock className="h-5 w-5" />,
    questions: [
      {
        question: "Where can I buy quality THCA products?",
        answer: "Purchase from licensed, reputable retailers that provide lab testing, clear product information, and comply with local laws. Online retailers often offer wider selection and competitive prices."
      },
      {
        question: "Do you ship THCA products nationwide?",
        answer: "We ship to all states where hemp-derived THCA products are legal. Orders are processed quickly with discreet packaging and tracking information provided."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards, debit cards, Cash App, and other secure payment methods. All transactions are processed through encrypted, secure systems."
      },
      {
        question: "What's your return policy?",
        answer: "We offer a satisfaction guarantee on all products. If you're not completely satisfied, contact us within 30 days for returns or exchanges (unopened products only)."
      }
    ]
  }
];

export default function THCAFAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => {
      const matchesSearch = searchQuery === '' || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        category.category.toLowerCase().replace(/[^a-z0-9]/g, '-') === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
  })).filter(category => category.questions.length > 0);

  // Prepare schema data
  const allQuestions = faqData.flatMap(category => 
    category.questions.map(q => ({
      question: q.question,
      answer: q.answer
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <Helmet>
        <title>THCA FAQ - Complete Guide to THCA Questions & Answers 2025 | Mentally-Chill</title>
        <meta name="description" content="Complete THCA FAQ covering legality, benefits, usage, dosage, and product quality. Expert answers to all your THCA questions in one comprehensive guide." />
        <meta name="keywords" content="THCA FAQ, THCA questions, THCA answers, THCA guide, THCA legal, THCA benefits, THCA dosage, THCA products" />
      </Helmet>

      <SchemaMarkup type="faq" data={{ questions: allQuestions }} />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 text-lg">
            <HelpCircle className="h-4 w-4 mr-2" />
            Expert Answers
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            THCA FAQ
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-4xl mx-auto mb-8">
            Complete answers to all your THCA questions. From legality and benefits to dosage and quality, 
            find expert insights on everything related to THCA products.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search FAQ questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setSelectedCategory('all')}
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCategory === 'all' ? 'bg-purple-600 text-white' : 'text-purple-300 border-purple-400'}
                  >
                    All Topics
                  </Button>
                  {faqData.map((category, index) => (
                    <Button
                      key={index}
                      onClick={() => setSelectedCategory(category.category.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                      variant={selectedCategory === category.category.toLowerCase().replace(/[^a-z0-9]/g, '-') ? 'default' : 'outline'}
                      size="sm"
                      className={`${
                        selectedCategory === category.category.toLowerCase().replace(/[^a-z0-9]/g, '-')
                          ? 'bg-purple-600 text-white' 
                          : 'text-purple-300 border-purple-400 hover:bg-purple-600/20'
                      } text-xs`}
                    >
                      {category.icon}
                      <span className="ml-1 hidden sm:inline">{category.category}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          <AnimatePresence>
            {filteredFAQs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {category.icon}
                    {category.category}
                  </h2>
                  <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 w-24"></div>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const questionId = `${category.category}-${index}`;
                    const isExpanded = expandedQuestions.has(questionId);

                    return (
                      <Card
                        key={index}
                        className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all"
                      >
                        <CardContent className="p-0">
                          <Button
                            onClick={() => toggleQuestion(questionId)}
                            variant="ghost"
                            className="w-full p-6 text-left justify-between hover:bg-transparent"
                          >
                            <span className="text-white font-medium text-lg pr-4">
                              {faq.question}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-purple-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-purple-400 flex-shrink-0" />
                            )}
                          </Button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                  <div className="h-px bg-white/20 mb-4"></div>
                                  <p className="text-gray-300 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-400/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-purple-200 mb-6">
              Can't find what you're looking for? Our expert team is here to help with any THCA questions.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Contact Support
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}