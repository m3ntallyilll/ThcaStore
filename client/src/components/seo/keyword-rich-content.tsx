import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Star, Shield } from 'lucide-react';
import { Link } from 'wouter';

export function KeywordRichContent() {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-900/30 to-teal-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Educational Content Section - Phase 1 Keywords */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Learn About THCA Benefits & Legal Status
            </h2>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
              Discover everything about THCA vs THC, dosage guidelines, and legal status. Educational resources for informed decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-emerald-400" />
                  THCA Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-100 text-sm space-y-3">
                <p>Anti-inflammatory, neuroprotective properties without psychoactive effects.</p>
                <Button asChild size="sm" variant="outline" className="w-full border-emerald-400 text-emerald-300 hover:bg-emerald-400/10">
                  <Link href="/thca-benefits">
                    Learn Benefits
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  THCA vs THC
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100 text-sm space-y-3">
                <p>Complete comparison of THCA vs THC effects, legality, and molecular differences.</p>
                <Button asChild size="sm" variant="outline" className="w-full border-blue-400 text-blue-300 hover:bg-blue-400/10">
                  <Link href="/what-is-thca-vs-thc">
                    Compare Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  Dosage Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="text-purple-100 text-sm space-y-3">
                <p>Safe THCA dosing with personalized calculator and expert recommendations.</p>
                <Button asChild size="sm" variant="outline" className="w-full border-purple-400 text-purple-300 hover:bg-purple-400/10">
                  <Link href="/thca-dosage-guide">
                    Get Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Is THCA Legal?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-100 text-sm space-y-3">
                <p>Complete legal guide covering federal law, state regulations, and compliance.</p>
                <Button asChild size="sm" variant="outline" className="w-full border-green-400 text-green-300 hover:bg-green-400/10">
                  <Link href="/is-thca-legal">
                    Check Legality
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Product Keywords Section - Phase 2 Keywords */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Premium THCA Products Available Now
            </h3>
            <p className="text-lg text-teal-200">
              Buy THCA online with confidence. Lab-tested, legal, fast shipping nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-400/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-emerald-300 text-xl">THCA Flower Near Me</CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-100 space-y-3">
                <p className="text-sm">Premium THCA flower strains with fast nationwide delivery. Lab-tested for purity and potency.</p>
                <ul className="text-xs space-y-1">
                  <li>✓ Multiple strain options</li>
                  <li>✓ Lab-tested quality</li>
                  <li>✓ Fast shipping nationwide</li>
                  <li>✓ COA included</li>
                </ul>
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/products?category=flower">
                    Shop THCA Flower
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-400/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-blue-300 text-xl">THCA Diamonds for Sale</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-3">
                <p className="text-sm">Premium THCA concentrates and diamonds. Pure, potent, and perfectly crafted for connoisseurs.</p>
                <ul className="text-xs space-y-1">
                  <li>✓ 99%+ THCA purity</li>
                  <li>✓ Multiple textures</li>
                  <li>✓ Full spectrum profiles</li>
                  <li>✓ Expert extraction</li>
                </ul>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/products?category=concentrates">
                    Shop Diamonds
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-purple-300 text-xl">THCA Pre Rolls</CardTitle>
              </CardHeader>
              <CardContent className="text-purple-100 space-y-3">
                <p className="text-sm">Convenient THCA pre-rolls for immediate enjoyment. Premium flower, expertly rolled, ready to use.</p>
                <ul className="text-xs space-y-1">
                  <li>✓ Multiple sizes available</li>
                  <li>✓ Premium flower only</li>
                  <li>✓ Perfect for beginners</li>
                  <li>✓ Consistent quality</li>
                </ul>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/products?category=pre-rolls">
                    Shop Pre-Rolls
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Trust Signals and Legal THCA Products */}
          <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-400/30 backdrop-blur-md p-8">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-white mb-4">Legal THCA Products - Federally Compliant</h4>
              <p className="text-green-100 mb-6 max-w-3xl mx-auto">
                All our THCA products are hemp-derived, contain less than 0.3% Delta-9 THC, and comply with the 2018 Farm Bill. 
                Third-party lab tested for purity, potency, and safety.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">100%</div>
                  <div className="text-sm text-green-200">Legal Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">Lab</div>
                  <div className="text-sm text-green-200">Tested Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">Fast</div>
                  <div className="text-sm text-green-200">Nationwide Ship</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">COA</div>
                  <div className="text-sm text-green-200">Included Always</div>
                </div>
              </div>
              <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Link href="/products">
                  Browse All Legal THCA Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}