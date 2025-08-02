import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, CheckCircle, Truck, Headphones, Mail, Phone, MapPin, Send, Star, Zap, Shield, Award, Users, TrendingUp, Sparkles, Eye, Brain, Atom, Rocket, Diamond, Crown, Flame, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { SkipLinks } from '@/components/accessibility/skip-links';

// Particle system for 3D effects
const ParticleSystem = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, size: number, opacity: number}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2
    }));
    setParticles(newParticles);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      newParticles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(0.5, '#047857');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(particle.x - particle.size * 3, particle.y - particle.size * 3, particle.size * 6, particle.size * 6);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      width={1920}
      height={1080}
    />
  );
};

// 3D morphing background component
const MorphingBackground = () => {
  const [morphState, setMorphState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMorphState(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const shapes = [
    "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
    "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
    "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
  ];

  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-green-500/30 to-teal-400/20"
      style={{
        clipPath: shapes[morphState]
      }}
      animate={{
        clipPath: shapes[morphState]
      }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const { toast } = useToast();

  // Advanced parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const featuresY = useTransform(scrollYProgress, [0.2, 0.8], ['100px', '-100px']);
  const statsScale = useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1.2]);

  // Real-time data fetching - remove admin stats call from public page
  // Only show generic public stats, not admin-specific data
  const { data: liveStats } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('/api/products'),
    select: (data) => ({
      totalProducts: data?.length || 0,
      // Create public-facing stats from product data
      featuredProducts: data?.filter((p: any) => p.featured)?.length || 0,
      categories: Array.from(new Set(data?.map((p: any) => p.category) || [])).length,
      totalUsers: 150 // Static display number for public view
    }),
    refetchInterval: false, // Disable auto-refresh
    staleTime: 300000, // 5 minutes
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ['/api/products', 'featured'],
    queryFn: () => apiRequest('/api/products?featured=true')
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Auto-cycle features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 4000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, [mouseX, mouseY]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!contactForm.firstName || !contactForm.email || !contactForm.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    // Simulate form submission
    toast({
      title: 'Message Sent!',
      description: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
    });

    // Reset form
    setContactForm({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-hidden">
      {/* Revolutionary Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Multi-layered Background System */}
        <div className="absolute inset-0">
          {/* Animated gradient base */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950/50 to-black"
            animate={{
              background: [
                "linear-gradient(45deg, #000000, #064e3b, #000000)",
                "linear-gradient(135deg, #000000, #065f46, #0f172a)",
                "linear-gradient(225deg, #0f172a, #047857, #000000)",
                "linear-gradient(315deg, #000000, #10b981, #0f172a)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Morphing background shapes */}
          <MorphingBackground />
          
          {/* Particle system overlay */}
          <ParticleSystem />
          
          {/* Neural network grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
              {Array.from({ length: 400 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="border border-emerald-500/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ 
                    duration: 3, 
                    delay: i * 0.01, 
                    repeat: Infinity,
                    repeatDelay: 2 
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Content Layer */}
        <motion.div 
          className="relative z-20 h-full flex items-center justify-center text-center px-4"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateX: -30 }}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                className="max-w-6xl mx-auto"
              >
                {/* Revolutionary Title */}
                <motion.div
                  className="relative mb-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.h1 
                    className="text-7xl md:text-9xl font-black mb-4 relative"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent animate-pulse">
                      Premium THCA Hemp Products - Lab-Tested & Legal
                    </span>
                    <span className="relative bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent">
                      Premium THCA Hemp Products - Lab-Tested & Legal
                    </span>
                  </motion.h1>
                  
                  <motion.h2
                    className="text-2xl md:text-4xl font-light tracking-wider"
                    initial={{ opacity: 0, letterSpacing: "10px" }}
                    animate={{ opacity: 1, letterSpacing: "0.2em" }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                  >
                    <span className="bg-gradient-to-r from-gold via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                      Shop THCA Flower, Pre-Rolls & Concentrates with Fast Shipping
                    </span>
                  </motion.h2>
                </motion.div>

                {/* Live Statistics Display */}
                <motion.div
                  className="flex justify-center space-x-8 mb-8"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  style={{ scale: statsScale }}
                >
                  {[
                    { icon: Users, label: "Happy Customers", value: liveStats?.totalUsers || "2,500+" },
                    { icon: Award, label: "Products", value: liveStats?.totalProducts || "50+" },
                    { icon: TrendingUp, label: "Success Rate", value: "99.8%" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center glass rounded-2xl p-4 backdrop-blur-md border border-emerald-500/20"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ type: "spring" }}
                    >
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Revolutionary Description */}
                <motion.p 
                  className="text-xl md:text-2xl mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  Experience premium hemp-derived THCA products from trusted growers. 
                  <span className="text-emerald-400 font-semibold"> Lab-tested purity.</span>
                  <span className="text-gold font-semibold"> Legal hemp quality.</span>
                  <span className="text-teal-400 font-semibold"> Extraordinary experiences.</span>
                </motion.p>

                {/* Enhanced Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  <Link href="/products">
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-6 rounded-full text-xl font-bold shadow-2xl group">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10 flex items-center">
                          <Rocket className="mr-3 w-6 h-6" />
                          Launch Experience
                          <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      className="glass border-2 border-gold/50 px-12 py-6 rounded-full text-xl font-bold text-gold hover:bg-gold/10 backdrop-blur-md transition-all duration-300"
                    >
                      <Crown className="mr-3 w-6 h-6" />
                      Join Elite Community
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Advanced Floating Elements */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </section>

      {/* Revolutionary Features Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Dynamic background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,69,19,0.1),transparent_50%)]" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2 
              className="text-6xl md:text-7xl font-black mb-8"
              style={{ y: featuresY }}
            >
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                Next-Level
              </span>
              <br />
              <span className="bg-gradient-to-r from-gold via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Excellence
              </span>
            </motion.h2>
            <motion.h3 
              className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Premium hemp sourcing meets modern technology. Every THCA product carefully selected for quality.
            </motion.h3>
          </motion.div>

          {/* Interactive Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              { 
                icon: Shield, 
                title: "Quantum Purity", 
                subtitle: "Hemp-Derived",
                description: "Hemp-derived THCA products with full lab verification and transparency",
                color: "from-emerald-500 to-green-400",
                delay: 0
              },
              { 
                icon: Zap, 
                title: "Lightning Delivery", 
                subtitle: "Same-Day Available",
                description: "AI-optimized logistics network with real-time tracking",
                color: "from-yellow-500 to-amber-400",
                delay: 0.1
              },
              { 
                icon: Brain, 
                title: "AI Personalization", 
                subtitle: "Tailored Experience",
                description: "Machine learning algorithms craft your perfect product match",
                color: "from-purple-500 to-indigo-400",
                delay: 0.2
              },
              { 
                icon: Diamond, 
                title: "Premium Craftsmanship", 
                subtitle: "Artisan Quality",
                description: "Hand-selected by master cultivators with decades of expertise",
                color: "from-blue-500 to-cyan-400",
                delay: 0.3
              },
              { 
                icon: Atom, 
                title: "Molecular Precision", 
                subtitle: "Nano Technology",
                description: "Advanced extraction methods preserving terpene profiles",
                color: "from-pink-500 to-rose-400",
                delay: 0.4
              },
              { 
                icon: Crown, 
                title: "VIP Treatment", 
                subtitle: "Concierge Service",
                description: "Personal hemp sommelier and 24/7 premium support",
                color: "from-gold to-yellow-400",
                delay: 0.5
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100, rotateX: 30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: feature.delay,
                  ease: [0.19, 1, 0.22, 1]
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
                }}
                className={`relative group cursor-pointer ${
                  activeFeature === index ? 'z-20' : 'z-10'
                }`}
                onHoverStart={() => setActiveFeature(index)}
              >
                <Card className="relative overflow-hidden glass rounded-3xl p-8 h-full backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-500">
                  {/* Animated background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    animate={{
                      scale: activeFeature === index ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <CardContent className="relative z-10 p-0 text-center">
                    {/* Floating Icon */}
                    <motion.div
                      className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.1
                      }}
                      transition={{ 
                        rotate: { duration: 0.5 },
                        scale: { duration: 0.3 }
                      }}
                    >
                      <feature.icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </motion.div>
                    
                    <motion.div
                      animate={{
                        y: activeFeature === index ? -5 : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-2xl font-bold mb-2 text-white">{feature.title}</h3>
                      <div className={`text-sm font-semibold mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                        {feature.subtitle}
                      </div>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </motion.div>

                    {/* Interactive pulse effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0`}
                      animate={{
                        opacity: activeFeature === index ? [0, 0.05, 0] : 0,
                        scale: activeFeature === index ? [1, 1.02, 1] : 1,
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Live Product Showcase */}
          {featuredProducts && featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-4xl font-bold mb-12 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Featured Excellence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProducts.slice(0, 3).map((product: any, index: number) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="group"
                  >
                    <Card className="glass rounded-2xl overflow-hidden backdrop-blur-xl border border-emerald-500/20 group-hover:border-emerald-400/40 transition-all duration-500">
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="text-xl font-bold text-white mb-2">{product.name}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-emerald-400">${product.price}</span>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current text-gold" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Revolutionary About Section */}
      <section id="about" className="relative py-32 overflow-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-950/30 to-black" />
          
          {/* Animated mesh gradient */}
          <motion.div
            className="absolute inset-0 opacity-40"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(245,158,11,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(245,158,11,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(245,158,11,0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating geometric shapes */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 border border-emerald-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-6xl md:text-7xl font-black mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                The
              </span>
              <br />
              <span className="bg-gradient-to-r from-gold via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Revolution
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent">
                Begins
              </span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Revolutionary Story */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.p 
                  className="text-2xl text-gray-200 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  We're not just another hemp company. We're 
                  <span className="text-emerald-400 font-bold" role="heading" aria-level="4"> pioneers of a new era</span> – 
                  where cutting-edge science meets artisanal craftsmanship.
                </motion.p>
                
                <motion.p 
                  className="text-xl text-gray-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  Our team of <span className="text-gold font-semibold" role="heading" aria-level="5">molecular scientists</span>, 
                  <span className="text-teal-400 font-semibold" role="heading" aria-level="5"> master cultivators</span>, and 
                  <span className="text-purple-400 font-semibold" role="heading" aria-level="5"> AI specialists</span> work in 
                  perfect harmony to create products that transcend traditional boundaries.
                </motion.p>

                <motion.p 
                  className="text-lg text-gray-400 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  Every batch is a masterpiece – lab-verified at the molecular level, 
                  blockchain-tracked for transparency, and crafted with the precision 
                  of Swiss watchmaking. This is hemp evolution.
                </motion.p>
              </div>

              {/* Revolutionary Stats */}
              <motion.div
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                {[
                  { value: "99.9%", label: "Purity Standard", icon: Atom },
                  { value: "24/7", label: "AI Monitoring", icon: Brain },
                  { value: "0.01%", label: "Error Rate", icon: Shield },
                  { value: "∞", label: "Innovation", icon: Sparkles }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center glass rounded-2xl p-6 backdrop-blur-xl border border-emerald-500/20 group hover:border-emerald-400/40 transition-all duration-500"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring" }}
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Call to Action */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Link href="/products">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-full text-lg font-bold shadow-2xl group">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10 flex items-center">
                        <Flame className="mr-3 w-5 h-5" />
                        Experience Now
                        <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="glass border-2 border-gold/50 px-10 py-4 rounded-full text-lg font-bold text-gold hover:bg-gold/10 backdrop-blur-md transition-all duration-300"
                  >
                    <Eye className="mr-3 w-5 h-5" />
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* 3D Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 100, rotateY: -30 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                {/* Central orb */}
                <motion.div
                  className="w-80 h-80 mx-auto relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-xl" />
                  <div className="absolute inset-4 bg-gradient-to-br from-emerald-500/50 to-teal-500/50 rounded-full blur-lg" />
                  <div className="absolute inset-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full" />
                  
                  {/* Orbiting elements */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 bg-gold rounded-full"
                      style={{
                        top: "50%",
                        left: "50%",
                        transformOrigin: `${100 + i * 20}px 0px`,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.5
                      }}
                    />
                  ))}
                </motion.div>

                {/* Floating hemp leaves */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${20 + i * 20}%`,
                      top: `${20 + i * 15}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <Leaf className="w-8 h-8 text-emerald-400/60" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Revolutionary Contact Section */}
      <section id="contact" className="relative py-32 overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-6 text-glow-green-400 glow-effect">Get In Touch</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Have questions about our products or need assistance? We're here to help you find the perfect THCA experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-glow-green-400">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-glow-green-500/20 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-glow-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-400">1-800-THCA-STORE</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-glow-green-500/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-glow-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-400">support@thcastore.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-glow-green-500/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-glow-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-400">420 Hemp Ave<br />Green Valley, CA 90210</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-glow-green-400">Business Hours</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>12:00 PM - 5:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="glass rounded-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-glow-green-400">Send us a Message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name *</label>
                        <Input 
                          id="firstName"
                          value={contactForm.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Your first name"
                          className="glass border-glow-green-500/30 focus:border-glow-green-400"
                          required
                          aria-label="First Name"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name</label>
                        <Input 
                          id="lastName"
                          value={contactForm.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Your last name"
                          className="glass border-glow-green-500/30 focus:border-glow-green-400"
                          aria-label="Last Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                      <Input 
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        className="glass border-glow-green-500/30 focus:border-glow-green-400"
                        required
                        aria-label="Email Address"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                      <Input 
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="How can we help?"
                        className="glass border-glow-green-500/30 focus:border-glow-green-400"
                        aria-label="Subject"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                      <Textarea 
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us about your inquiry..."
                        rows={5}
                        aria-label="Message"
                        className="glass border-glow-green-500/30 focus:border-glow-green-400 resize-none"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full button-glow text-black py-3 font-semibold">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
