import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductCard } from '@/components/product/product-card';
import { ProductModal } from '@/components/product/product-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { SkipLinks } from '@/components/accessibility/skip-links';
import type { Product } from '@shared/schema';

const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'pre-rolls', label: 'Pre-Rolls' },
  { value: 'flower', label: 'Flower' },
  { value: 'concentrates', label: 'Concentrates' },
  { value: 'edibles', label: 'Edibles' },
  { value: 'accessories', label: 'Accessories' },
];

const weightCategories = [
  { value: 'all', label: 'All Weights' },
  // Pre-roll weights
  { value: '1.1g', label: '1.1g Pre-Roll' },
  { value: '1.25g', label: '1.25g Pre-Roll' },
  { value: '1.45g', label: '1.45g Pre-Roll' },
  { value: '1.5g', label: '1.5g Pre-Roll' },
  // Flower weights
  { value: '1g', label: '1g Gram' },
  { value: '3.5g', label: '3.5g Eighth' },
  { value: '7g', label: '7g Quarter' },
  { value: '14g', label: '14g Half' },
  { value: '28g', label: '28g Ounce' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWeight, setSelectedWeight] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Weight filter
      if (selectedWeight !== 'all' && product.weight !== selectedWeight) {
        return false;
      }

      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Price range filter
      if (priceRange) {
        const price = parseFloat(product.price);
        if (price < priceRange.min || price > priceRange.max) {
          return false;
        }
      }

      // Effects filter
      if (selectedEffects.length > 0 && product.effects) {
        const hasSelectedEffect = selectedEffects.some(effect => 
          product.effects?.includes(effect)
        );
        if (!hasSelectedEffect) {
          return false;
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
        case 'rating':
          return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

  // Get unique effects for filter
  const allEffects = Array.from(
    new Set(products.flatMap(product => product.effects || []))
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const pageSpecificLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#product-filters', label: 'Skip to product filters' },
    { href: '#product-grid', label: 'Skip to product grid' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-16">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-gold via-white to-hemp bg-clip-text text-transparent">
              Premium Collection
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 text-[#4cff4c]">
              Expertly crafted THCA products designed to elevate your experience with uncompromising quality and purity
            </p>
          </motion.div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search and Filter Bar */}
        <motion.div
          id="product-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-6 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 focus:border-gold"
                aria-label="Search products"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`rounded-full transition-all duration-300 ${
                      selectedCategory === category.value 
                        ? 'bg-gold text-black hover:bg-gold-600' 
                        : 'glass border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Weight Filter */}
              <Select value={selectedWeight} onValueChange={setSelectedWeight}>
                <SelectTrigger className="w-[200px] glass border-white/20">
                  <SelectValue placeholder="Filter by weight" />
                </SelectTrigger>
                <SelectContent className="glass-dark border-white/20">
                  {weightCategories.map((weight) => (
                    <SelectItem key={weight.value} value={weight.value}>
                      {weight.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Effects Filter */}
              {allEffects.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="glass border-white/20 hover:bg-white/10">
                      <Filter className="w-4 h-4 mr-2" />
                      Effects
                      {selectedEffects.length > 0 && (
                        <Badge className="ml-2 bg-hemp text-white">
                          {selectedEffects.length}
                        </Badge>
                      )}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-dark border-white/20">
                    {allEffects.map((effect) => (
                      <DropdownMenuCheckboxItem
                        key={effect}
                        checked={selectedEffects.includes(effect)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEffects([...selectedEffects, effect]);
                          } else {
                            setSelectedEffects(selectedEffects.filter(e => e !== effect));
                          }
                        }}
                        className="capitalize"
                      >
                        {effect}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] glass border-white/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="glass-dark border-white/20">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex gap-1 glass rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-white/20' : ''}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-white/20' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'all' || selectedWeight !== 'all' || selectedEffects.length > 0 || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
              <span className="text-sm text-gray-400">Active filters:</span>
              {selectedCategory !== 'all' && (
                <Badge 
                  variant="secondary" 
                  className="bg-gold/20 text-gold hover:bg-gold/30 cursor-pointer"
                  onClick={() => setSelectedCategory('all')}
                >
                  {categories.find(c => c.value === selectedCategory)?.label} ×
                </Badge>
              )}
              {selectedWeight !== 'all' && (
                <Badge 
                  variant="secondary" 
                  className="bg-hemp/20 text-hemp hover:bg-hemp/30 cursor-pointer"
                  onClick={() => setSelectedWeight('all')}
                >
                  {weightCategories.find(w => w.value === selectedWeight)?.label} ×
                </Badge>
              )}
              {selectedEffects.map((effect) => (
                <Badge
                  key={effect}
                  variant="secondary"
                  className="bg-hemp/20 text-hemp hover:bg-hemp/30 cursor-pointer capitalize"
                  onClick={() => setSelectedEffects(selectedEffects.filter(e => e !== effect))}
                >
                  {effect} ×
                </Badge>
              ))}
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-pointer"
                  onClick={() => setSearchQuery('')}
                >
                  Search: "{searchQuery}" ×
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className={`grid ${viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'} gap-8`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <Skeleton className="h-64 w-full mb-4 bg-white/10" />
                <Skeleton className="h-6 w-3/4 mb-2 bg-white/10" />
                <Skeleton className="h-4 w-full mb-4 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl mb-4">Failed to load products</p>
            <p className="text-gray-400">Please try again later</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold mb-4">No products found</h3>
              <p className="text-gray-400 mb-8">
                Try adjusting your filters or search terms
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedEffects([]);
                }}
                className="bg-gradient-to-r from-gold to-gold-600 text-black"
              >
                Clear All Filters
              </Button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            id="product-grid"
            layout
            className={`grid gap-8 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 lg:grid-cols-2'
            }`}
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    onProductClick={handleProductClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={closeProductModal}
      />
    </div>
  );
}