import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, Award, CheckCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { SEOMeta } from '@/components/seo-meta';

interface StateInfo {
  name: string;
  code: string;
  region: string;
  isLegal: boolean;
  shippingTime: string;
  population: string;
  emoji: string;
  legalStatus: string;
  deliveryOptions: string[];
}

const stateData: Record<string, StateInfo> = {
  california: {
    name: 'California',
    code: 'CA',
    region: 'West Coast',
    isLegal: true,
    shippingTime: '1-2 days',
    population: '39M+',
    emoji: '🏖️',
    legalStatus: 'Fully Legal - Hemp THCA Compliant',
    deliveryOptions: ['Same Day', 'Next Day', 'Standard']
  },
  oregon: {
    name: 'Oregon',
    code: 'OR',
    region: 'West Coast',
    isLegal: true,
    shippingTime: '1-2 days',
    population: '4.2M+',
    emoji: '🌲',
    legalStatus: 'Fully Legal - Hemp THCA Compliant',
    deliveryOptions: ['Next Day', 'Standard']
  },
  washington: {
    name: 'Washington',
    code: 'WA',
    region: 'West Coast',
    isLegal: true,
    shippingTime: '1-2 days',
    population: '7.7M+',
    emoji: '🏔️',
    legalStatus: 'Fully Legal - Hemp THCA Compliant',
    deliveryOptions: ['Next Day', 'Standard']
  },
  colorado: {
    name: 'Colorado',
    code: 'CO',
    region: 'Mountain States',
    isLegal: true,
    shippingTime: '2-3 days',
    population: '5.8M+',
    emoji: '🏔️',
    legalStatus: 'Fully Legal - Hemp THCA Compliant',
    deliveryOptions: ['Next Day', 'Standard']
  },
  texas: {
    name: 'Texas',
    code: 'TX',
    region: 'South Central',
    isLegal: true,
    shippingTime: '2-3 days',
    population: '30M+',
    emoji: '🤠',
    legalStatus: 'Hemp THCA Legal - Farm Bill Compliant',
    deliveryOptions: ['Standard', 'Express']
  },
  florida: {
    name: 'Florida',
    code: 'FL',
    region: 'Southeast',
    isLegal: true,
    shippingTime: '2-3 days',
    population: '22M+',
    emoji: '🌴',
    legalStatus: 'Hemp THCA Legal - Farm Bill Compliant',
    deliveryOptions: ['Standard', 'Express']
  },
  newyork: {
    name: 'New York',
    code: 'NY',
    region: 'Northeast',
    isLegal: true,
    shippingTime: '1-2 days',
    population: '19M+',
    emoji: '🗽',
    legalStatus: 'Hemp THCA Legal - Farm Bill Compliant',
    deliveryOptions: ['Same Day', 'Next Day', 'Standard']
  },
  illinois: {
    name: 'Illinois',
    code: 'IL',
    region: 'Midwest',
    isLegal: true,
    shippingTime: '2-3 days',
    population: '12M+',
    emoji: '🌽',
    legalStatus: 'Hemp THCA Legal - Farm Bill Compliant',
    deliveryOptions: ['Next Day', 'Standard']
  }
};

export default function StateTHCA() {
  const params = useParams();
  const [selectedState, setSelectedState] = useState<string>('california');
  
  // Get state from URL parameter or default to California
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlState = params.state || urlParams.get('state');
    if (urlState && stateData[urlState.toLowerCase()]) {
      setSelectedState(urlState.toLowerCase());
    }
  }, [params]);

  const currentState = stateData[selectedState];
  
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });

  const featuredProducts = Array.isArray(products) ? products.slice(0, 6) : [];

  // Generate SEO data for current state
  const seoTitle = `Buy THCA in ${currentState?.name} | Premium THCA Flower & Pre-Rolls | Mentally Chill`;
  const seoDescription = `Buy premium THCA flower in ${currentState?.name}. Fast ${currentState?.shippingTime} delivery, lab-tested quality, legal hemp THCA products. ${currentState?.legalStatus}. Shop now!`;
  const seoKeywords = `THCA ${currentState?.name}, buy THCA in ${currentState?.name}, THCA flower ${currentState?.name}, THCA delivery ${currentState?.name}, legal THCA ${currentState?.name}, THCA store ${currentState?.name}, THCA dispensary ${currentState?.name}, premium THCA ${currentState?.name}`;
  const canonicalUrl = `https://mentally-chill.replit.app/thca/${selectedState}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950/20 to-black">
      <SEOMeta 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={canonicalUrl}
      />
      {/* SEO-Optimized Header */}
      <div className="bg-emerald-900/20 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Buy THCA in {currentState?.name} {currentState?.emoji}
            </h1>
            <h2 className="text-xl md:text-2xl text-emerald-400 mb-6">
              Premium THCA Flower, Pre-Rolls & Concentrates - Legal {currentState?.name} THCA Delivery
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                {currentState?.legalStatus}
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                Fast {currentState?.shippingTime} Delivery
              </span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Lab-Tested Premium Quality
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* State Selector */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Select Your State for THCA Delivery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(stateData).map(([key, state]) => (
              <Button
                key={key}
                onClick={() => setSelectedState(key)}
                variant={selectedState === key ? "default" : "outline"}
                className={`p-4 ${selectedState === key 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-black/50 text-gray-300 border-emerald-500/20 hover:border-emerald-400/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg">{state.emoji}</div>
                  <div className="text-xs font-semibold">{state.code}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* State-Specific Content */}
        <motion.div
          key={selectedState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {/* State Info Card */}
          <Card className="bg-black/40 border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{currentState?.emoji}</span>
                <div>
                  <h4 className="text-xl font-bold text-white">{currentState?.name}</h4>
                  <p className="text-emerald-400 text-sm">{currentState?.region}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Legal Status:</span>
                  <span className="text-emerald-400">{currentState?.legalStatus.split(' - ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping Time:</span>
                  <span className="text-white">{currentState?.shippingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Population:</span>
                  <span className="text-white">{currentState?.population}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card className="bg-black/40 border-emerald-500/20">
            <CardContent className="p-6">
              <h4 className="text-xl font-bold text-white mb-4">
                <Truck className="inline w-5 h-5 mr-2 text-emerald-400" />
                THCA Delivery Options
              </h4>
              <div className="space-y-3">
                {currentState?.deliveryOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-white">{option} Delivery</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-emerald-900/20 rounded-lg">
                <p className="text-emerald-400 text-sm font-medium">Free Shipping on Orders $75+</p>
                <p className="text-gray-300 text-xs">Discreet packaging guaranteed</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-black/40 border-emerald-500/20">
            <CardContent className="p-6">
              <h4 className="text-xl font-bold text-white mb-4">
                <Phone className="inline w-5 h-5 mr-2 text-emerald-400" />
                {currentState?.name} Support
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Local Support Hours:</p>
                  <p className="text-white">Mon-Sun: 8AM-10PM {currentState?.code} Time</p>
                </div>
                <div>
                  <p className="text-gray-400">Same-Day Support:</p>
                  <p className="text-emerald-400">Live Chat Available</p>
                </div>
              </div>
              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                Contact {currentState?.name} Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Products for State */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Best THCA Flower for {currentState?.name} Customers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product: any) => (
              <Card key={product.id} className="bg-black/40 border-emerald-500/20 group hover:border-emerald-400/50 transition-all">
                <CardContent className="p-6">
                  <div className="aspect-square bg-gradient-to-br from-emerald-600/20 to-green-500/20 rounded-lg mb-4 flex items-center justify-center">
                    <img 
                      src={product.imageUrl || '/api/placeholder/300/300'} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h4 className="font-bold text-white mb-2">{product.name}</h4>
                  <p className="text-emerald-400 font-semibold mb-2">${product.price}</p>
                  <p className="text-gray-400 text-sm mb-4">Ships to {currentState?.name} in {currentState?.shippingTime}</p>
                  <Link href="/products">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Buy THCA in {currentState?.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* State-Specific SEO Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 rounded-2xl p-8 border border-emerald-500/10"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Why Buy THCA in {currentState?.name}?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">Legal THCA {currentState?.name}</h4>
              <p className="mb-4">
                THCA is completely legal in {currentState?.name} under the 2018 Farm Bill. Our hemp-derived THCA products 
                contain less than 0.3% Delta-9 THC, making them federally compliant and safe to purchase, possess, and use 
                throughout {currentState?.name}.
              </p>
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">Fast {currentState?.name} THCA Delivery</h4>
              <p>
                We offer {currentState?.shippingTime} shipping to all areas of {currentState?.name}, including major cities 
                and rural locations. Our discreet packaging ensures your privacy while our tracking system keeps you updated 
                on your THCA flower delivery status.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">Premium THCA Dispensary Quality</h4>
              <p className="mb-4">
                Our {currentState?.name} customers deserve the best THCA products available. Every batch is lab-tested for 
                potency, pesticides, heavy metals, and microbials. We source our THCA flower from top-tier cultivators who 
                specialize in high-quality hemp genetics.
              </p>
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">{currentState?.name} THCA Store Benefits</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Free shipping on orders over $75</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>30-day satisfaction guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>24/7 customer support for {currentState?.name}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Loyalty rewards program</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Buy THCA in {currentState?.name}?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied {currentState?.name} customers who trust us for their premium THCA needs. 
            Fast delivery, lab-tested quality, and unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 text-lg">
                Shop THCA {currentState?.name}
              </Button>
            </Link>
            <Link href="/products?category=flower">
              <Button size="lg" variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg">
                View THCA Flower
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}