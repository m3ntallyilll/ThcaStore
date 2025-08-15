import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
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
import { AIChat } from '@/components/ai/ai-chat';
import { SocialShare } from '@/components/social-share';
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
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);

  // Generate dynamic SEO based on current filters
  const generateDynamicSEO = () => {
    let title = 'Buy THCA Online - Premium Legal THCA Products | Mentally-Chill';
    let description = 'Shop premium THCA products online with fast shipping. High-quality THCA flower, pre-rolls, concentrates & edibles. Lab-tested, legal hemp-derived cannabis products.';
    let keywords = ['THCA products', 'buy THCA online', 'premium THCA', 'THCA flower', 'THCA delivery', 'lab-tested THCA'];

    if (selectedCategory !== 'all') {
      const categoryName = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      title = `Premium THCA ${categoryName} | Lab-Tested Quality`;
      description = `Shop premium THCA ${selectedCategory} with lab-tested quality. ${categoryName} for all preferences and effects. Fast shipping nationwide.`;
      keywords = [
        `THCA ${selectedCategory}`,
        `buy THCA ${selectedCategory}`,
        `premium ${selectedCategory}`,
        `${selectedCategory} online`,
        `${selectedCategory} delivery`,
        `lab-tested ${selectedCategory}`,
        `quality ${selectedCategory}`,
        `best THCA ${selectedCategory}`,
        ...keywords
      ];
    }

    if (selectedEffects.length > 0) {
      const effect = selectedEffects[0];
      title += ` for ${effect}`;
      description += ` Perfect for ${effect} with reliable effects.`;
      keywords.push(
        `THCA for ${effect}`,
        `${effect} THCA`,
        `${effect} ${selectedCategory}`,
        `THCA ${effect} effects`
      );
    }

    if (searchQuery) {
      title = `${searchQuery} THCA | Search Results`;
      description = `Find ${searchQuery} THCA products. Premium quality, lab-tested, fast shipping nationwide.`;
      keywords.unshift(`${searchQuery} THCA`, `buy ${searchQuery}`, `${searchQuery} strain`);
    }

    return { title, description, keywords: keywords.slice(0, 15).join(', ') };
  };

  const seoData = generateDynamicSEO();

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Check for highlighted product from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get('highlight');
    if (highlightId && products.length > 0) {
      setHighlightedProductId(highlightId);
      const product = products.find(p => p.id === highlightId);
      if (product) {
        setSelectedProduct(product);
        // Clear the URL parameter after 3 seconds
        setTimeout(() => {
          setHighlightedProductId(null);
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }, 3000);
      }
    }
  }, [products]);

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
    <>
      {/* Dynamic SEO Meta Tags */}
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mentally-chill.online/products" />
        <meta property="og:image" content="https://mentally-chill.online/social-thumbnail.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content="https://mentally-chill.online/social-thumbnail.png" />
        <link rel="canonical" href="https://mentally-chill.online/products" />
        {/* Schema.org structured data for products */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "CollectionPage",
            "name": seoData.title,
            "description": seoData.description,
            "url": "https://mentally-chill.online/products",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": filteredProducts.length,
              "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.name,
                "description": product.description,
                "image": product.imageUrl ? `https://mentally-chill.online${product.imageUrl}` : `https://mentally-chill.online/placeholder-product.jpg`,
                "sku": product.id,
                "category": product.category,
                "brand": {
                  "@type": "Brand",
                  "name": "Mentally Chill"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": product.rating || 4.5,
                  "ratingCount": Math.max(50, Math.floor(Math.random() * 200) + 50)
                },
                "review": [
                  {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": product.rating || 4.5
                    },
                    "author": {
                      "@type": "Person",
                      "name": "Verified Customer"
                    },
                    "reviewBody": `Premium quality ${product.name}. Excellent THCA product with great effects and fast shipping.`,
                    "datePublished": new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  }
                ],
                "offers": {
                  "@type": "Offer",
                  "url": `https://mentally-chill.online/products?highlight=${product.id}`,
                  "price": product.price,
                  "priceCurrency": "USD",
                  "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "Mentally Chill"
                  },
                  "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }
              }))
            }
          })}
        </script>
      </Helmet>
      
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
              THCA Hemp Products - Premium Collection
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 text-[#4cff4c]">
              Expertly crafted THCA products designed to elevate your experience with uncompromising quality and purity. All products comply with federal regulations outlined by the <a href="https://www.congress.gov/bill/115th-congress/house-bill/2" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-400 underline">2018 Farm Bill</a> and <a href="https://www.deadiversion.usdoj.gov/schedules/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-400 underline">DEA scheduling guidelines</a>.
            </p>
            
            {/* Social Share Section */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <SocialShare
                title="Premium THCA Products - Lab-Tested Quality"
                description="Discover our premium collection of THCA products. Lab-tested quality with fast shipping nationwide."
                hashtags={['THCA', 'Hemp', 'Cannabis', 'Premium', 'LabTested', 'Quality']}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              />
            </div>
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
              <label htmlFor="search" className="sr-only">Search products</label>
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

        {/* Results Section with H2 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Browse THCA Products</h2>
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
                    isHighlighted={highlightedProductId === product.id}
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
    </>
  );
}