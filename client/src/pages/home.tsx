import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Truck, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background with parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.4)), url('https://images.unsplash.com/photo-1560718547-8c2234c7d1c4?w=1920')`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-display font-bold mb-6 bg-gradient-to-r from-gold via-white to-cannabis bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Premium THCA
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover our curated collection of premium THCA products, crafted for the discerning connoisseur
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/products">
                <Button className="bg-gradient-to-r from-gold to-gold-600 text-black px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 animate-glow">
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="glass border-gold/50 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Join Our Community
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-cannabis/20 rounded-full animate-float" />
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-gold/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-6">Why Choose THCA Store</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the difference with our commitment to quality, purity, and customer satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="glass rounded-2xl p-8 text-center group hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-gold to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Lab Tested</h3>
                  <p className="text-gray-400">Every product is rigorously tested for purity, potency, and safety by third-party laboratories</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="glass rounded-2xl p-8 text-center group hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-cannabis to-cannabis-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
                  <p className="text-gray-400">Discreet and secure shipping with tracking, delivered right to your doorstep</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="glass rounded-2xl p-8 text-center group hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Expert Support</h3>
                  <p className="text-gray-400">Our knowledgeable team is here to help you find the perfect products for your needs</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-20 bg-dark-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">Ready to Explore?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of satisfied customers who trust THCA Store for their premium cannabis needs.
            </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-cannabis to-cannabis-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-cannabis/30 transition-all duration-300">
                Shop Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
