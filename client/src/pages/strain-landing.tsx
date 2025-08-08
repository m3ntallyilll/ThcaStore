import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Leaf, Star, Shield, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StrainCollection from './strain-collection';
import { StrainSocialShare } from '@/components/social-share';

// Comprehensive strain keyword data from our keyword system
const strainKeywordData = {
  indica: {
    title: 'Premium Indica THCA Strains',
    metaTitle: 'Buy Premium Indica THCA Strains | Relaxing Effects | Lab-Tested',
    description: 'Discover premium Indica THCA strains perfect for relaxation, sleep, and pain relief. Lab-tested quality with fast, discrete shipping nationwide.',
    keywords: [
      'Buy THCA Indica strains',
      'Best THCA Indica flower',
      'Relaxing THCA Indica',
      'THCA Indica for sleep',
      'Premium Indica THCA buds',
      'THCA Indica delivery',
      'Heavy Indica THCA strains',
      'Sedating THCA Indica',
      'Couch lock THCA Indica',
      'THCA Indica effects',
      'Pure Indica THCA flower',
      'Strong THCA Indica strains',
      'THCA for anxiety relief',
      'THCA for pain management',
      'THCA muscle relaxation',
      'Premium THCA flower',
      'Top-shelf THCA buds',
      'Lab-tested THCA'
    ],
    icon: '🌙',
    primaryColor: 'from-purple-600 to-indigo-600',
    accentColor: 'text-purple-400',
    benefits: [
      'Deep Relaxation',
      'Sleep Enhancement', 
      'Pain Relief',
      'Stress Reduction',
      'Muscle Tension Relief',
      'Anxiety Management'
    ],
    bestFor: [
      'Evening use',
      'Pain management',
      'Insomnia relief',
      'Stress after work',
      'Muscle recovery',
      'Meditation'
    ],
    effects: 'Body-focused with deeply relaxing and sedating effects',
    timing: 'Best used in the evening or before bedtime'
  },
  sativa: {
    title: 'Energizing Sativa THCA Strains',
    metaTitle: 'Buy Premium Sativa THCA Strains | Energizing Effects | Lab-Tested',
    description: 'Explore premium Sativa THCA strains ideal for energy, creativity, and focus. Perfect for daytime use with lab-tested quality and fast shipping.',
    keywords: [
      'Buy THCA Sativa strains',
      'Energizing THCA Sativa',
      'Best THCA Sativa flower',
      'Uplifting THCA Sativa',
      'Creative THCA Sativa',
      'Focus THCA Sativa strains',
      'Daytime THCA Sativa',
      'Pure Sativa THCA flower',
      'Cerebral THCA Sativa',
      'THCA Sativa effects',
      'Motivating THCA Sativa',
      'Social THCA Sativa',
      'THCA mood enhancement',
      'Creative THCA experience',
      'Energizing THCA buds',
      'Focus THCA strains',
      'Premium THCA flower',
      'Top-shelf THCA buds'
    ],
    icon: '☀️',
    primaryColor: 'from-yellow-500 to-orange-500',
    accentColor: 'text-yellow-400',
    benefits: [
      'Energy Boost',
      'Enhanced Creativity',
      'Improved Focus',
      'Mood Enhancement',
      'Social Engagement',
      'Productivity'
    ],
    bestFor: [
      'Daytime activities',
      'Creative projects',
      'Social gatherings',
      'Work productivity',
      'Exercise motivation',
      'Learning'
    ],
    effects: 'Mind-focused with uplifting and energizing effects',
    timing: 'Perfect for morning and afternoon use'
  },
  hybrid: {
    title: 'Balanced Hybrid THCA Strains',
    metaTitle: 'Buy Premium Hybrid THCA Strains | Balanced Effects | Lab-Tested',
    description: 'Experience balanced Hybrid THCA strains combining the best of both worlds. Versatile effects perfect for any time of day with premium quality.',
    keywords: [
      'Buy THCA Hybrid strains',
      'Balanced THCA Hybrid',
      'Best THCA Hybrid flower',
      'Indica-dominant THCA Hybrid',
      'Sativa-dominant THCA Hybrid',
      'THCA Hybrid effects',
      'Versatile THCA Hybrid',
      'All-day THCA Hybrid',
      'Premium THCA Hybrid buds',
      'Popular THCA Hybrid strains',
      'Smooth THCA Hybrid',
      'Mellow THCA Hybrid',
      'THCA mood enhancement',
      'Balanced THCA effects',
      'Premium THCA flower',
      'Top-shelf THCA buds'
    ],
    icon: '⚖️',
    primaryColor: 'from-green-500 to-teal-500',
    accentColor: 'text-green-400',
    benefits: [
      'Balanced Effects',
      'Versatile Use',
      'Mood Balance',
      'Gentle Relaxation',
      'Mild Energy',
      'Stress Relief'
    ],
    bestFor: [
      'Any time of day',
      'Social situations',
      'Work-life balance',
      'Mild anxiety',
      'General wellness',
      'New users'
    ],
    effects: 'Perfectly balanced combining relaxation with gentle energy',
    timing: 'Suitable for morning, afternoon, or evening use'
  }
};

export default function StrainLanding() {
  const { strainType } = useParams<{ strainType: 'indica' | 'sativa' | 'hybrid' }>();
  const [showCollection, setShowCollection] = useState(false);

  const strain = strainType ? strainKeywordData[strainType] : null;

  useEffect(() => {
    if (strainType && !strain) {
      // Invalid strain type, redirect to products
      window.location.href = '/products';
    }
  }, [strainType, strain]);

  if (!strain || !strainType) {
    return null;
  }

  const keywordsString = strain.keywords.join(', ');

  return (
    <>
      <Helmet>
        <title>{strain.metaTitle}</title>
        <meta name="description" content={strain.description} />
        <meta name="keywords" content={keywordsString} />
        <meta property="og:title" content={strain.metaTitle} />
        <meta property="og:description" content={strain.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://mentally-chill.online/strains/${strainType}`} />
        <meta property="og:image" content="https://mentally-chill.online/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={strain.metaTitle} />
        <meta name="twitter:description" content={strain.description} />
        <link rel="canonical" href={`https://mentally-chill.online/strains/${strainType}`} />
        
        {/* Enhanced Schema.org markup */}
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
              "description": strain.effects
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://mentally-chill.online/"
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "Strains",
                  "item": "https://mentally-chill.online/strains"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": strain.title,
                  "item": `https://mentally-chill.online/strains/${strainType}`
                }
              ]
            }
          })}
        </script>
      </Helmet>

      {!showCollection ? (
        <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
          {/* Hero Section */}
          <section className="pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="text-8xl mb-6">{strain.icon}</div>
                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 bg-gradient-to-r ${strain.primaryColor} bg-clip-text text-transparent`}>
                  {strain.title}
                </h1>
                <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-300">
                  {strain.description}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button
                    onClick={() => setShowCollection(true)}
                    className={`bg-gradient-to-r ${strain.primaryColor} text-white px-8 py-4 text-lg rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105`}
                  >
                    Shop {strainType.charAt(0).toUpperCase() + strainType.slice(1)} Strains
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('strain-info')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Benefits Grid */}
          <section id="strain-info" className="py-16">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why Choose {strainType.charAt(0).toUpperCase() + strainType.slice(1)} THCA?
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {strain.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-2xl p-6 text-center"
                  >
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${strain.primaryColor} flex items-center justify-center`}>
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit}</h3>
                    <p className="text-gray-400 text-sm">
                      Experience the premium quality and effects of {strainType} strains
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Strain Information */}
          <section className="py-16 bg-black/20">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-6">
                    About {strainType.charAt(0).toUpperCase() + strainType.slice(1)} Effects
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    {strain.effects}
                  </p>
                  <p className="text-gray-400 mb-8">
                    {strain.timing}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Perfect For:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {strain.bestFor.map((use) => (
                        <div key={use} className="flex items-center">
                          <Leaf className={`w-4 h-4 mr-2 ${strain.accentColor}`} />
                          <span className="text-sm">{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass rounded-2xl p-8"
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">Quality Guarantee</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Shield className="w-6 h-6 text-green-400 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Lab-Tested Purity</h4>
                        <p className="text-sm text-gray-400">Every strain tested for potency and contaminants</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Truck className="w-6 h-6 text-blue-400 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Fast Shipping</h4>
                        <p className="text-sm text-gray-400">Discrete packaging with nationwide delivery</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-6 h-6 text-purple-400 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Fresh Product</h4>
                        <p className="text-sm text-gray-400">Carefully cured and stored for optimal freshness</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Experience Premium {strainType.charAt(0).toUpperCase() + strainType.slice(1)}?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Browse our curated collection of lab-tested {strainType} THCA strains
                </p>
                <Button
                  onClick={() => setShowCollection(true)}
                  className={`bg-gradient-to-r ${strain.primaryColor} text-white px-12 py-4 text-xl rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105`}
                >
                  Shop Now
                </Button>
              </motion.div>
            </div>
          </section>
        </div>
      ) : (
        <StrainCollection strainType={strainType} />
      )}
      
      {/* Floating Social Share */}
      <StrainSocialShare strainType={strainType} />
    </>
  );
}