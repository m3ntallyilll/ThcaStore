import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, TrendingDown, Search, Star, Shield, 
  Award, CheckCircle, AlertTriangle, Calculator,
  Tag, Percent, ShoppingCart
} from 'lucide-react';
import { Link } from 'wouter';
import { ProductCard } from '@/components/product/product-card';
import { ProductModal } from '@/components/product/product-modal';
import type { Product } from '@shared/schema';

export default function CheapTHCAProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter and sort for best value products
  const cheapTHCAProducts = products
    .filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Price filter
      const price = parseFloat(product.price);
      switch (priceFilter) {
        case 'under-25':
          return price < 25;
        case '25-50':
          return price >= 25 && price < 50;
        case '50-75':
          return price >= 50 && price < 75;
        case 'under-100':
          return price < 100;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      
      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'value': // Price per gram
          const weightA = parseFloat(a.weight?.replace('g', '') || '1');
          const weightB = parseFloat(b.weight?.replace('g', '') || '1');
          return (priceA / weightA) - (priceB / weightB);
        default:
          return 0;
      }
    });

  // Calculate savings compared to average market price
  const calculateSavings = (price: string) => {
    const numPrice = parseFloat(price);
    const marketAverage = 75; // Average market price
    const savings = ((marketAverage - numPrice) / marketAverage) * 100;
    return Math.max(0, savings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/20 to-emerald-900/20">
      <Helmet>
        <title>Cheap THCA Products - Best Prices & Value THCA Deals 2025 | Mentally-Chill</title>
        <meta name="description" content="Find the cheapest THCA products without compromising quality. Best value THCA flower, concentrates, and pre-rolls with lab testing and fast shipping." />
        <meta name="keywords" content="cheap THCA products, affordable THCA, discount THCA, best value THCA, cheap THCA flower, budget THCA, low cost THCA, THCA deals" />
        <meta property="og:title" content="Cheap THCA Products - Best Value & Deals 2025 | Mentally-Chill" />
        <meta property="og:description" content="Quality THCA products at unbeatable prices. Lab-tested, legal, and affordable THCA flower, concentrates, and pre-rolls." />
        <link rel="canonical" href="https://mentally-chill.online/cheap-thca-products" />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-lg">
            <DollarSign className="h-4 w-4 mr-2" />
            Best Value Guaranteed
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Cheap THCA Products
          </h1>
          <p className="text-xl md:text-2xl text-green-200 max-w-4xl mx-auto mb-8">
            Quality THCA products at unbeatable prices. Lab-tested, legal, and affordable without compromising 
            on purity or potency. Save up to 60% compared to premium competitors.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="border-green-400 text-green-300">
              <TrendingDown className="h-4 w-4 mr-2" />
              Up to 60% Savings
            </Badge>
            <Badge variant="outline" className="border-emerald-400 text-emerald-300">
              <Shield className="h-4 w-4 mr-2" />
              Lab-Tested Quality
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              <CheckCircle className="h-4 w-4 mr-2" />
              Same Day Shipping
            </Badge>
            <Badge variant="outline" className="border-gold text-gold">
              <Award className="h-4 w-4 mr-2" />
              Price Match Guarantee
            </Badge>
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-400/30">
            <CardHeader>
              <CardTitle className="text-2xl text-green-300 text-center flex items-center justify-center gap-3">
                <Calculator className="h-6 w-6" />
                Why Our THCA Products Cost Less
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Direct from Source",
                  icon: <TrendingDown className="h-8 w-8 text-green-400" />,
                  description: "We work directly with hemp farmers, cutting out middlemen markup.",
                  savings: "30-40% Savings"
                },
                {
                  title: "Bulk Purchasing",
                  icon: <ShoppingCart className="h-8 w-8 text-blue-400" />,
                  description: "Large volume orders allow us to negotiate better wholesale prices.",
                  savings: "20-30% Savings"
                },
                {
                  title: "Efficient Operations",
                  icon: <Award className="h-8 w-8 text-purple-400" />,
                  description: "Streamlined processes and lower overhead costs passed to customers.",
                  savings: "15-25% Savings"
                }
              ].map((reason, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">{reason.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{reason.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{reason.description}</p>
                  <Badge className="bg-green-600/20 text-green-300">
                    {reason.savings}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search cheap THCA products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                >
                  <option value="all">All Prices</option>
                  <option value="under-25">Under $25</option>
                  <option value="25-50">$25 - $50</option>
                  <option value="50-75">$50 - $75</option>
                  <option value="under-100">Under $100</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                >
                  <option value="price-low">Lowest Price First</option>
                  <option value="value">Best Value (Price/Gram)</option>
                  <option value="price-high">Highest Price First</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Deals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Today's Best THCA Deals</h2>
            <p className="text-green-200">Limited time offers on premium quality THCA products</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cheapTHCAProducts.slice(0, 6).map((product, index) => {
              const savings = calculateSavings(product.price);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all relative overflow-hidden">
                    {savings > 20 && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-red-600 text-white font-bold">
                          <Percent className="h-3 w-3 mr-1" />
                          {Math.round(savings)}% OFF
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-yellow-300 text-sm ml-1">4.8</span>
                      </div>
                      <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-400">${product.price}</span>
                        {savings > 10 && (
                          <span className="text-sm text-gray-400 line-through">
                            ${Math.round(parseFloat(product.price) * 1.4)}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-gray-300 text-sm">{product.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-green-400 text-green-300 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Lab-Tested
                        </Badge>
                        <Badge variant="outline" className="border-blue-400 text-blue-300 text-xs">
                          {product.weight}
                        </Badge>
                      </div>
                      
                      {savings > 10 && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">You Save:</span>
                            <span className="text-green-400 font-semibold">
                              ${Math.round((parseFloat(product.price) * (savings/100)) * 10) / 10}
                            </span>
                          </div>
                          <Progress value={savings} className="h-2" />
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => setSelectedProduct(product)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Get This Deal
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* All Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              All Cheap THCA Products ({cheapTHCAProducts.length})
            </h2>
            <Badge variant="outline" className="border-green-400 text-green-300">
              Price Match Guaranteed
            </Badge>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : cheapTHCAProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found matching your criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setPriceFilter('all');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {cheapTHCAProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <ProductCard
                      product={product}
                      onProductClick={() => setSelectedProduct(product)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Price Match Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-400/30 p-8">
            <div className="mb-6">
              <Award className="h-16 w-16 text-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Price Match Guarantee
              </h2>
              <p className="text-green-200 mb-8 max-w-2xl mx-auto">
                Found a lower price on the same THCA product elsewhere? We'll match it and beat it by 5%. 
                That's our commitment to offering the best value on quality THCA products.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Same Product</h3>
                <p className="text-green-200 text-sm">Identical brand, strain, and size</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Lower Price</h3>
                <p className="text-green-200 text-sm">Must be currently available</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">We Beat It</h3>
                <p className="text-green-200 text-sm">Match + 5% additional discount</p>
              </div>
            </div>
            
            <Button size="lg" className="bg-gold hover:bg-gold/80 text-black font-bold mr-4">
              Request Price Match
            </Button>
            <Button asChild size="lg" variant="outline" className="border-green-400 text-green-300 hover:bg-green-400/10">
              <Link href="/products">Shop All Products</Link>
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}