import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Truck, Shield, Award } from 'lucide-react';
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

export default function BuyTHCAFlower() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceRange, setPriceRange] = useState<string>('all');

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter for flower products only
  const flowerProducts = products
    .filter(product => product.category === 'flower')
    .filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Price range filter
      if (priceRange !== 'all') {
        const price = parseFloat(product.price);
        switch (priceRange) {
          case 'under-50':
            if (price >= 50) return false;
            break;
          case '50-100':
            if (price < 50 || price >= 100) return false;
            break;
          case 'over-100':
            if (price < 100) return false;
            break;
        }
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
      <Helmet>
        <title>Buy THCA Flower Online - Premium Legal THCA Flower for Sale | Mentally-Chill</title>
        <meta name="description" content="Buy premium THCA flower online with fast shipping. Lab-tested legal THCA flower strains. Best prices on high-quality THCA flower for sale nationwide." />
        <meta name="keywords" content="buy THCA flower online, THCA flower for sale, premium THCA flower, legal THCA flower, THCA flower strains, lab-tested THCA flower, best THCA flower" />
        <meta property="og:title" content="Buy THCA Flower Online - Premium Legal THCA Flower | Mentally-Chill" />
        <meta property="og:description" content="Premium THCA flower strains with lab-tested quality. Buy legal THCA flower online with fast nationwide shipping and best prices." />
        <link rel="canonical" href={`${window.location.origin}/buy-thca-flower`} />
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
            Buy Premium THCA Flower Online
          </h1>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto mb-8">
            Shop the finest selection of legal THCA flower strains. Lab-tested for purity, potency, and quality. 
            Fast nationwide shipping on all THCA flower orders.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-emerald-300">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Lab-Tested Purity</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2 text-gold">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">Legal Compliance</span>
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
                placeholder="Search THCA flower strains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                data-testid="input-search-flower"
              />
            </div>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="over-100">Over $100</SelectItem>
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
          <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-400/30">
            <CardHeader>
              <CardTitle className="text-emerald-300">What is THCA Flower?</CardTitle>
            </CardHeader>
            <CardContent className="text-emerald-100">
              <p className="text-sm mb-3">
                THCA flower is hemp-derived cannabis flower high in tetrahydrocannabinolic acid (THCA), 
                the non-psychoactive precursor to THC.
              </p>
              <Button asChild size="sm" variant="outline" className="border-emerald-400 text-emerald-300">
                <Link href="/thca-benefits">Learn More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-400/30">
            <CardHeader>
              <CardTitle className="text-blue-300">Is THCA Legal?</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-100">
              <p className="text-sm mb-3">
                Yes, THCA flower derived from hemp with less than 0.3% Delta-9 THC is federally legal 
                under the 2018 Farm Bill.
              </p>
              <Button asChild size="sm" variant="outline" className="border-blue-400 text-blue-300">
                <Link href="/is-thca-legal">Legal Info</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Quality Guarantee</CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100">
              <p className="text-sm mb-3">
                All our THCA flower is third-party lab tested for purity, potency, and safety. 
                COA included with every order.
              </p>
              <Button asChild size="sm" variant="outline" className="border-purple-400 text-purple-300">
                <Link href="/lab-results">View Lab Results</Link>
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
              Premium THCA Flower Strains ({flowerProducts.length})
            </h2>
            <Badge variant="outline" className="border-emerald-400 text-emerald-300">
              All Lab-Tested
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
              <p className="text-red-400 text-lg">Failed to load THCA flower products</p>
            </div>
          ) : flowerProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No THCA flower products found matching your criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange('all');
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
                {flowerProducts.map((product, index) => (
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
          className="mt-16 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl p-8"
        >
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Why Buy THCA Flower from Mentally-Chill?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-emerald-300 mb-4">Premium Quality THCA Flower</h4>
              <ul className="space-y-2 text-emerald-100">
                <li>• Lab-tested for purity and potency</li>
                <li>• Carefully cultivated hemp flower</li>
                <li>• High THCA content, low THC</li>
                <li>• Multiple strain options available</li>
                <li>• Fresh, properly cured flower</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold text-teal-300 mb-4">Legal & Compliant</h4>
              <ul className="space-y-2 text-teal-100">
                <li>• Federally legal hemp-derived THCA</li>
                <li>• &lt;0.3% Delta-9 THC compliance</li>
                <li>• 2018 Farm Bill compliant</li>
                <li>• Certificate of Analysis included</li>
                <li>• Discreet nationwide shipping</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-300 mb-6">
              Ready to experience premium THCA flower? Browse our selection and find your perfect strain today.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              <Link href="/products?category=flower">
                Shop All THCA Flower
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