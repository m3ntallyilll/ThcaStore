import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Leaf, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@shared/schema';

interface StrainCollectionProps {
  strainType: 'indica' | 'sativa' | 'hybrid';
}

const strainInfo = {
  indica: {
    title: 'Premium Indica THCA Strains',
    description: 'Discover our carefully curated collection of premium Indica THCA strains. Perfect for relaxation, sleep, and unwinding after a long day.',
    icon: '🌙',
    effects: ['Relaxation', 'Sleep Aid', 'Pain Relief', 'Stress Relief', 'Sedating'],
    colors: {
      primary: 'from-purple-600 to-indigo-600',
      accent: 'text-purple-400',
      badge: 'bg-purple-500/20 text-purple-300'
    }
  },
  sativa: {
    title: 'Energizing Sativa THCA Strains', 
    description: 'Explore our premium Sativa THCA collection. Ideal for daytime use, creativity, and staying productive while elevated.',
    icon: '☀️',
    effects: ['Energy', 'Focus', 'Creativity', 'Euphoria', 'Social'],
    colors: {
      primary: 'from-yellow-500 to-orange-500',
      accent: 'text-yellow-400',
      badge: 'bg-yellow-500/20 text-yellow-300'
    }
  },
  hybrid: {
    title: 'Balanced Hybrid THCA Strains',
    description: 'Experience the best of both worlds with our premium Hybrid THCA strains. Perfect balance of relaxation and energy.',
    icon: '⚖️',
    effects: ['Balanced', 'Versatile', 'Mood Enhancement', 'Relaxed Focus', 'Social'],
    colors: {
      primary: 'from-green-500 to-teal-500',
      accent: 'text-green-400',
      badge: 'bg-green-500/20 text-green-300'
    }
  }
};

export default function StrainCollection({ strainType }: StrainCollectionProps) {
  const [sortBy, setSortBy] = useState('featured');
  
  const strain = strainInfo[strainType];
  
  // Fetch products filtered by strain type
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', strainType],
    queryFn: async () => {
      const response = await fetch(`/api/products?strainType=${strainType}`);
      return response.json();
    }
  });

  const sortedProducts = products.sort((a, b) => {
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

  const seoKeywords = [
    `${strainType} THCA strains`,
    `buy ${strainType} THCA`,
    `premium ${strainType} flower`,
    `${strainType} THCA delivery`,
    `best ${strainType} strains`,
    ...strain.effects.map(effect => `THCA for ${effect.toLowerCase()}`),
    'lab-tested THCA',
    'hemp-derived THCA',
    'legal THCA products'
  ].join(', ');

  return (
    <>
      <Helmet>
        <title>{strain.title} | Premium Lab-Tested Quality</title>
        <meta name="description" content={strain.description} />
        <meta name="keywords" content={seoKeywords} />
        <meta property="og:title" content={strain.title} />
        <meta property="og:description" content={strain.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://mentally-chill.online/strains/${strainType}`} />
        <link rel="canonical" href={`https://mentally-chill.online/strains/${strainType}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "CollectionPage",
            "name": strain.title,
            "description": strain.description,
            "url": `https://mentally-chill.online/strains/${strainType}`,
            "mainEntity": {
              "@type": "ItemList",
              "name": `${strainType.charAt(0).toUpperCase() + strainType.slice(1)} THCA Strains`,
              "numberOfItems": products.length
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">{strain.icon}</div>
              <h1 className={`text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r ${strain.colors.primary} bg-clip-text text-transparent`}>
                {strain.title}
              </h1>
              <p className="text-xl max-w-3xl mx-auto mb-12 text-gray-300">
                {strain.description}
              </p>
              
              {/* Effects Tags */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {strain.effects.map((effect) => (
                  <Badge key={effect} className={`${strain.colors.badge} border-0 px-4 py-2 text-sm`}>
                    {effect}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Strain Information */}
        <section className="py-16 bg-black/20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <Leaf className={`w-6 h-6 ${strain.colors.accent} mr-2`} />
                  <h3 className="text-xl font-semibold">Strain Type</h3>
                </div>
                <p className="text-gray-300 capitalize">{strainType} Dominant</p>
                <p className="text-sm text-gray-400 mt-2">
                  {strainType === 'indica' && 'Body-focused effects, perfect for evening use'}
                  {strainType === 'sativa' && 'Mind-focused effects, ideal for daytime activities'}
                  {strainType === 'hybrid' && 'Balanced effects combining the best of both'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <Clock className={`w-6 h-6 ${strain.colors.accent} mr-2`} />
                  <h3 className="text-xl font-semibold">Best Time</h3>
                </div>
                <p className="text-gray-300">
                  {strainType === 'indica' && 'Evening & Night'}
                  {strainType === 'sativa' && 'Morning & Afternoon'}
                  {strainType === 'hybrid' && 'Anytime'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Optimal timing for maximum benefits
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <Zap className={`w-6 h-6 ${strain.colors.accent} mr-2`} />
                  <h3 className="text-xl font-semibold">Potency</h3>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= 4 ? 'text-gold fill-current' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Premium quality, lab-tested potency
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">
                Available {strainType.charAt(0).toUpperCase() + strainType.slice(1)} Strains
              </h2>
              <div className="flex gap-2">
                {['featured', 'price-low', 'price-high', 'name', 'rating'].map((sort) => (
                  <Button
                    key={sort}
                    variant={sortBy === sort ? "default" : "outline"}
                    onClick={() => setSortBy(sort)}
                    className="capitalize"
                  >
                    {sort.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                    <div className="h-48 bg-gray-700 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-700 rounded mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-400">
                  No {strainType} strains available at the moment.
                </p>
                <p className="text-gray-500 mt-2">
                  Check back soon for new arrivals!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}