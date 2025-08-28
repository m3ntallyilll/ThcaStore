import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Shield, Zap, Heart, CheckCircle, Star, Award, Leaf, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export default function THCABenefits() {
  useEffect(() => {
    // Analytics tracking
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: 'THCA Benefits - Complete Guide',
        page_location: window.location.href,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      <Helmet>
        <title>THCA Benefits: Complete Guide to Tetrahydrocannabinolic Acid | Mentally-Chill</title>
        <meta name="description" content="Discover the amazing benefits of THCA (tetrahydrocannabinolic acid). Learn about anti-inflammatory, neuroprotective, and wellness properties from legal hemp-derived THCA." />
        <meta name="keywords" content="THCA benefits, tetrahydrocannabinolic acid benefits, THCA health effects, THCA wellness, THCA anti-inflammatory, THCA neuroprotective" />
        <link rel="canonical" href="https://mentally-chill.online/thca-benefits" />
        <meta property="og:title" content="THCA Benefits: Complete Scientific Guide" />
        <meta property="og:description" content="Comprehensive guide to THCA benefits including anti-inflammatory, neuroprotective, and wellness properties from legal hemp-derived products." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://mentally-chill.online/thca-benefits" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="THCA Benefits: Complete Scientific Guide" />
        <meta name="twitter:description" content="Discover the amazing benefits of THCA from legal hemp-derived products. Anti-inflammatory, neuroprotective, and wellness properties explained." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  THCA Benefits
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-emerald-200 mb-8">
                Complete Guide to Tetrahydrocannabinolic Acid
              </h2>
            </motion.div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-emerald-400" />
                Key THCA Benefits at a Glance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center">
                  <Brain className="h-8 w-8 text-emerald-400 mb-2" />
                  <span className="text-white text-sm font-medium">Neuroprotective</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-8 w-8 text-cyan-400 mb-2" />
                  <span className="text-white text-sm font-medium">Anti-Inflammatory</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Heart className="h-8 w-8 text-teal-400 mb-2" />
                  <span className="text-white text-sm font-medium">Wellness Support</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Leaf className="h-8 w-8 text-emerald-300 mb-2" />
                  <span className="text-white text-sm font-medium">Natural Compound</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Benefits Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Brain className="h-6 w-6 text-emerald-400" />
                  Neuroprotective Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-100 space-y-4">
                <p>
                  THCA demonstrates significant neuroprotective benefits, potentially supporting brain health and cognitive function. Research suggests THCA may help protect neurons from oxidative stress and inflammation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>May support cognitive function and memory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Potential antioxidant properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Supports overall brain health</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Shield className="h-6 w-6 text-cyan-400" />
                  Anti-Inflammatory Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-100 space-y-4">
                <p>
                  THCA exhibits powerful anti-inflammatory properties that may help reduce inflammation throughout the body, supporting overall wellness and comfort.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>May reduce systemic inflammation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Supports joint and muscle comfort</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Natural inflammatory response support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Additional Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Energy & Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-100 text-sm">
                <p>THCA may help support natural energy levels and mental clarity without the psychoactive effects of THC.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-400" />
                  Wellness Support
                </CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-100 text-sm">
                <p>Supports overall wellness and homeostasis through interaction with the body's endocannabinoid system.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  Pure & Natural
                </CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-100 text-sm">
                <p>THCA is naturally found in raw hemp and cannabis plants, offering pure, unheated cannabinoid benefits.</p>
              </CardContent>
            </Card>
          </div>

          {/* How THCA Works */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl">How THCA Works in Your Body</CardTitle>
            </CardHeader>
            <CardContent className="text-emerald-100 space-y-6">
              <p className="text-lg">
                THCA (tetrahydrocannabinolic acid) works differently from THC because it doesn't produce psychoactive effects in its raw form. Here's how it interacts with your body:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-emerald-400" />
                    Endocannabinoid System
                  </h4>
                  <p className="text-sm">
                    THCA interacts with your body's endocannabinoid system, which regulates various physiological processes including inflammation, pain, mood, and immune function.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-cyan-400" />
                    Non-Psychoactive Nature
                  </h4>
                  <p className="text-sm">
                    Unlike THC, THCA doesn't cross the blood-brain barrier effectively in its acidic form, providing therapeutic benefits without intoxication.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Frequently Asked Questions About THCA Benefits</CardTitle>
            </CardHeader>
            <CardContent className="text-emerald-100 space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">What are the main benefits of THCA?</h4>
                <p className="text-sm">
                  The main benefits of THCA include anti-inflammatory properties, neuroprotective effects, antioxidant activity, and potential support for overall wellness without psychoactive effects.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">How is THCA different from THC benefits?</h4>
                <p className="text-sm">
                  THCA provides therapeutic benefits without the psychoactive effects of THC. While THC is known for its intoxicating effects, THCA offers anti-inflammatory and neuroprotective benefits in a non-intoxicating form.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Are THCA benefits scientifically proven?</h4>
                <p className="text-sm">
                  Research on THCA benefits is ongoing, with preliminary studies showing promising results for anti-inflammatory and neuroprotective properties. More research is needed to fully understand all potential benefits.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">How can I experience THCA benefits?</h4>
                <p className="text-sm">
                  THCA benefits can be experienced through raw hemp products, THCA tinctures, capsules, and other non-heated preparations that preserve the acidic form of the cannabinoid.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border-emerald-400/30 backdrop-blur-md p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Experience Premium THCA Benefits
              </h3>
              <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                Discover our collection of high-quality THCA products designed to help you experience the natural benefits of tetrahydrocannabinolic acid.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  <Link href="/products">
                    Shop THCA Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-emerald-400 text-emerald-300 hover:bg-emerald-400/10">
                  <Link href="/what-is-thca-vs-thc">
                    Learn More: THCA vs THC
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}