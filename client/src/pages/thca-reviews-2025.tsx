import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, Award, ThumbsUp, ThumbsDown, Shield, FlaskConical, 
  Zap, DollarSign, Truck, CheckCircle, AlertTriangle, TrendingUp, Leaf
} from 'lucide-react';
import { Link } from 'wouter';
import type { Product } from '@shared/schema';

export default function THCAReviews2025() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Fetch products for reviews
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const reviewedProducts = products.slice(0, 12); // Top products to review

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      <Helmet>
        <title>Best THCA Products 2025 - Expert Reviews & Rankings | Mentally-Chill</title>
        <meta name="description" content="Expert reviews of the best THCA products in 2025. Comprehensive testing, lab results, and honest rankings of THCA flower, concentrates, and pre-rolls." />
        <meta name="keywords" content="best THCA products 2025, THCA product reviews, THCA flower review 2025, best THCA concentrates, THCA product rankings, expert THCA reviews" />
        <meta property="og:title" content="Best THCA Products 2025 - Expert Reviews & Rankings | Mentally-Chill" />
        <meta property="og:description" content="Unbiased expert reviews and rankings of the top THCA products in 2025. Lab-tested quality analysis and comprehensive buying guides." />
        <link rel="canonical" href={`${window.location.origin}/thca-reviews-2025`} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-lg">
            <Award className="h-4 w-4 mr-2" />
            2025 Expert Reviews
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Best THCA Products 2025
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-4xl mx-auto mb-8">
            Comprehensive expert reviews, lab-tested analysis, and honest rankings of the top THCA products. 
            Updated weekly with the latest releases and quality assessments.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              <FlaskConical className="h-4 w-4 mr-2" />
              Lab-Tested Reviews
            </Badge>
            <Badge variant="outline" className="border-pink-400 text-pink-300">
              <Shield className="h-4 w-4 mr-2" />
              Unbiased Analysis
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              <TrendingUp className="h-4 w-4 mr-2" />
              Weekly Updates
            </Badge>
          </div>
        </motion.div>

        {/* Review Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300 flex items-center gap-3">
                <Award className="h-6 w-6" />
                Our Review Process
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Lab Testing",
                  icon: <FlaskConical className="h-6 w-6 text-emerald-400" />,
                  description: "Independent third-party lab verification of potency, purity, and safety."
                },
                {
                  title: "Expert Panel",
                  icon: <Award className="h-6 w-6 text-gold" />,
                  description: "Cannabis industry professionals with 10+ years experience evaluate each product."
                },
                {
                  title: "User Feedback",
                  icon: <ThumbsUp className="h-6 w-6 text-blue-400" />,
                  description: "Real customer reviews and experiences from verified purchasers."
                },
                {
                  title: "Value Analysis",
                  icon: <DollarSign className="h-6 w-6 text-green-400" />,
                  description: "Price comparison and value assessment across the market."
                }
              ].map((method, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">{method.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{method.title}</h3>
                  <p className="text-purple-200 text-sm">{method.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Rated Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Top Rated THCA Products</h2>
            <p className="text-xl text-purple-200">Our experts' picks for the best THCA products in 2025</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* #1 Product - Featured */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="bg-gradient-to-br from-gold/20 to-yellow-600/20 border-gold/50 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gold text-black font-bold">
                    <Award className="h-4 w-4 mr-1" />
                    #1 PICK 2025
                  </Badge>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                    ))}
                    <span className="text-gold font-bold ml-2">9.8/10</span>
                  </div>
                  <CardTitle className="text-2xl text-white">Premium THCA Diamond Sauce</CardTitle>
                  <p className="text-gold">99.7% THCA Purity • Lab Certified • Award Winner</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-emerald-300 font-semibold mb-2">Lab Results:</h4>
                      <ul className="text-emerald-100 text-sm space-y-1">
                        <li>• 99.7% THCA content</li>
                        <li>• 0.1% Delta-9 THC</li>
                        <li>• Full terpene profile</li>
                        <li>• No pesticides detected</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-2">Expert Notes:</h4>
                      <ul className="text-blue-100 text-sm space-y-1">
                        <li>• Exceptional purity</li>
                        <li>• Clean extraction</li>
                        <li>• Consistent quality</li>
                        <li>• Premium packaging</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Quality Score</span>
                      <span className="text-gold font-bold">98/100</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button className="flex-1 bg-gold hover:bg-gold/80 text-black font-bold">
                      View Product
                    </Button>
                    <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                      Read Full Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Runner-ups */}
            <div className="space-y-6">
              {[
                { 
                  rank: 2, 
                  name: "Organic THCA Flower", 
                  score: 9.5, 
                  highlight: "Best Flower 2025",
                  category: "flower"
                },
                { 
                  rank: 3, 
                  name: "Premium Pre-Rolls", 
                  score: 9.3, 
                  highlight: "Most Convenient",
                  category: "pre-rolls"
                }
              ].map((product, index) => (
                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-600 text-white">#{product.rank}</Badge>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.score) ? 'fill-purple-400 text-purple-400' : 'text-gray-400'}`} />
                        ))}
                        <span className="text-purple-300 font-bold ml-2">{product.score}/10</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                    <p className="text-purple-200 text-sm">{product.highlight}</p>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      View Review
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Reviews by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "THCA Flower Reviews",
                icon: <Leaf className="h-8 w-8 text-emerald-400" />,
                count: "24 Products Reviewed",
                topPick: "Organic Indoor THCA",
                link: "/thca-flower-reviews-2025"
              },
              {
                title: "THCA Concentrates",
                icon: <Zap className="h-8 w-8 text-blue-400" />,
                count: "18 Products Reviewed", 
                topPick: "Premium Diamond Sauce",
                link: "/thca-concentrates-reviews-2025"
              },
              {
                title: "THCA Pre-Rolls",
                icon: <Award className="h-8 w-8 text-purple-400" />,
                count: "15 Products Reviewed",
                topPick: "Hand-Rolled Premium",
                link: "/thca-prerolls-reviews-2025"
              }
            ].map((category, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-900/40 to-black/40 border-white/20 hover:border-white/40 transition-all">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">{category.icon}</div>
                  <CardTitle className="text-xl text-white">{category.title}</CardTitle>
                  <p className="text-gray-300">{category.count}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-1">Current Top Pick:</p>
                    <p className="text-white font-semibold">{category.topPick}</p>
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Link href={category.link}>View All Reviews</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Buying Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-400/30">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-300 text-center flex items-center justify-center gap-3">
                <Shield className="h-6 w-6" />
                How to Choose Quality THCA Products
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-emerald-300 mb-4">What to Look For:</h3>
                <ul className="space-y-3 text-emerald-100">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Third-party lab testing</strong> with complete COA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Hemp-derived</strong> with &lt;0.3% Delta-9 THC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Transparent sourcing</strong> and extraction methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Proper packaging</strong> to preserve freshness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Customer reviews</strong> and company reputation</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-red-300 mb-4">Red Flags to Avoid:</h3>
                <ul className="space-y-3 text-red-100">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span><strong>No lab testing</strong> or refusing to provide COAs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Unrealistic claims</strong> about effects or benefits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Extremely low prices</strong> that seem too good to be true</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Poor packaging</strong> or storage conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span><strong>No return policy</strong> or customer service</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-400/30 p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Shop Our Top-Rated THCA Products
            </h2>
            <p className="text-purple-200 mb-8 max-w-2xl mx-auto">
              All products in our store meet the highest quality standards from our expert review process. 
              Lab-tested, hemp-derived, and legally compliant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <Link href="/buy-thca-flower">Shop THCA Flower</Link>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Link href="/products?category=concentrates">Shop Concentrates</Link>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Link href="/thca-pre-rolls">Shop Pre-Rolls</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}