import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Truck, Shield, Award, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCard } from '@/components/product/product-card';
import { ProductModal } from '@/components/product/product-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import type { Product } from '@shared/schema';

export default function THCAPreRolls() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sizeFilter, setSizeFilter] = useState<string>('all');

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter for pre-roll products only
  const preRollProducts = products
    .filter(product => product.category === 'pre-rolls')
    .filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Size filter
      if (sizeFilter !== 'all') {
        if (!product.weight?.includes(sizeFilter)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      <Helmet>
        <title>THCA Pre Rolls - Premium Ready-to-Smoke THCA Joints | Mentally-Chill</title>
        <meta name="description" content="Premium THCA pre rolls ready to enjoy. Lab-tested THCA joints in multiple sizes. Buy legal THCA pre-rolls online with fast shipping nationwide." />
        <meta name="keywords" content="THCA pre rolls, THCA joints, ready to smoke THCA, premium pre-rolls, legal THCA pre rolls, lab-tested joints, THCA pre roll delivery" />
        <meta property="og:title" content="Premium THCA Pre Rolls - Ready-to-Smoke THCA Joints | Mentally-Chill" />
        <meta property="og:description" content="Shop premium THCA pre rolls and joints. Lab-tested quality, multiple sizes, fast nationwide shipping. Legal THCA pre-rolls ready to enjoy." />
        <link rel="canonical" href="https://mentally-chill.online/thca-pre-rolls" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Premium THCA Pre Rolls
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
            Ready-to-enjoy THCA pre rolls and joints made with premium flower. Expertly rolled, 
            lab-tested quality, and perfect for both beginners and connoisseurs.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-purple-300">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Ready to Enjoy</span>
            </div>
            <div className="flex items-center gap-2 text-pink-300">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Lab-Tested Quality</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-gold">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">Expert Rolled</span>
            </div>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search THCA pre rolls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                data-testid="input-search-prerolls"
              />
            </div>

            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Pre Roll Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="1.1g">1.1g Pre-Rolls</SelectItem>
                <SelectItem value="1.25g">1.25g Pre-Rolls</SelectItem>
                <SelectItem value="1.45g">1.45g Pre-Rolls</SelectItem>
                <SelectItem value="1.5g">1.5g Pre-Rolls</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Perfect for Beginners</CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <p className="text-sm mb-3">
                THCA pre rolls offer a convenient, mess-free way to enjoy premium hemp flower. 
                No rolling experience required!
              </p>
              <Button asChild size="sm" variant="outline" className="border-purple-400 text-purple-300">
                <Link href="/thca-dosage-guide">Dosage Guide</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border-pink-400/30">
            <CardHeader>
              <CardTitle className="text-pink-300">Quality Craftsmanship</CardTitle>
            </CardHeader>
            <CardContent className="text-pink-100">
              <p className="text-sm mb-3">
                Each pre roll is expertly crafted using premium THCA flower, ensuring consistent 
                burn and optimal experience every time.
              </p>
              <Button asChild size="sm" variant="outline" className="border-pink-400 text-pink-300">
                <Link href="/quality-standards">Quality Process</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-400/30">
            <CardHeader>
              <CardTitle className="text-blue-300">Multiple Sizes</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-100">
              <p className="text-sm mb-3">
                Choose from various pre roll sizes to match your preferences, from 1.1g personal 
                joints to 1.5g sharing size.
              </p>
              <Button asChild size="sm" variant="outline" className="border-blue-400 text-blue-300">
                <Link href="/size-guide">Size Guide</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Product Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              THCA Pre Rolls & Joints ({preRollProducts.length})
            </h2>
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              Ready to Enjoy
            </Badge>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">Failed to load THCA pre roll products</p>
            </div>
          ) : preRollProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No THCA pre rolls found matching your criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSizeFilter('all');
                }}
                className="mt-4"
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {preRollProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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

        {/* SEO Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8"
        >
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Why Choose Our THCA Pre Rolls?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-purple-300 mb-4">Premium Quality</h4>
              <ul className="space-y-2 text-purple-100">
                <li>• Made with top-shelf THCA flower</li>
                <li>• Expertly rolled for even burn</li>
                <li>• Multiple strain options</li>
                <li>• Lab-tested for purity</li>
                <li>• Fresh, potent, and effective</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold text-pink-300 mb-4">Convenience</h4>
              <ul className="space-y-2 text-pink-100">
                <li>• Ready to smoke immediately</li>
                <li>• No rolling skills required</li>
                <li>• Perfect portion control</li>
                <li>• Discreet packaging</li>
                <li>• Travel-friendly options</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-300 mb-6">
              Experience the convenience of premium THCA pre rolls. Browse our selection and find your perfect joint today.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Link href="/products?category=pre-rolls">
                Shop All THCA Pre Rolls
              </Link>
            </Button>
          </div>
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