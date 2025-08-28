import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Atom, Zap, Shield, Brain, CheckCircle, X, ArrowRight, Beaker, Scale, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

export default function WhatIsTHCAVsTHC() {
  useEffect(() => {
    // Analytics tracking
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: 'What is THCA vs THC - Complete Comparison',
        page_location: window.location.href,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Helmet>
        <title>What is THCA vs THC? Complete Comparison Guide | Mentally-Chill</title>
        <meta name="description" content="Learn the key differences between THCA vs THC. Comprehensive guide covering effects, legality, benefits, and molecular structure of both cannabinoids." />
        <meta name="keywords" content="THCA vs THC, what is THCA vs THC, THCA THC difference, tetrahydrocannabinolic acid vs tetrahydrocannabinol, THCA legal THC illegal" />
        <link rel="canonical" href="https://mentally-chill.online/what-is-thca-vs-thc" />
        <meta property="og:title" content="THCA vs THC: Complete Comparison Guide" />
        <meta property="og:description" content="Understand the complete differences between THCA and THC including effects, legality, benefits, and molecular structure." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://mentally-chill.online/what-is-thca-vs-thc" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="THCA vs THC: What's the Difference?" />
        <meta name="twitter:description" content="Complete guide to understanding THCA vs THC differences, effects, legality, and benefits." />
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
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  THCA vs THC
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-purple-200 mb-8">
                What's the Difference? Complete Comparison Guide
              </h2>
            </motion.div>
          </div>

          {/* Quick Comparison Table */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">THCA vs THC: Quick Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-lg font-semibold">Aspect</th>
                      <th className="text-center py-3 px-4 text-lg font-semibold text-purple-300">THCA</th>
                      <th className="text-center py-3 px-4 text-lg font-semibold text-blue-300">THC</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 font-medium">Psychoactive Effects</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <X className="h-4 w-4 text-red-400" />
                          <span>No</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span>Yes</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 font-medium">Legal Status (Federal)</td>
                      <td className="py-3 px-4 text-center text-green-300">Legal (Hemp-derived)</td>
                      <td className="py-3 px-4 text-center text-red-300">Controlled Substance</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 font-medium">Natural Form</td>
                      <td className="py-3 px-4 text-center">Raw cannabis/hemp</td>
                      <td className="py-3 px-4 text-center">Heated/decarbed cannabis</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 font-medium">Primary Benefits</td>
                      <td className="py-3 px-4 text-center">Anti-inflammatory, neuroprotective</td>
                      <td className="py-3 px-4 text-center">Pain relief, appetite, relaxation</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Drug Test Impact</td>
                      <td className="py-3 px-4 text-center">Minimal (pure THCA)</td>
                      <td className="py-3 px-4 text-center">Will show positive</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* What is THCA Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Atom className="h-6 w-6 text-purple-400" />
                  What is THCA?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-purple-100 space-y-4">
                <p>
                  <strong>THCA (Tetrahydrocannabinolic Acid)</strong> is the acidic precursor to THC found naturally in raw hemp and cannabis plants. It's non-psychoactive in its natural state and offers unique therapeutic benefits.
                </p>
                <h4 className="text-white font-semibold">Key THCA Characteristics:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>Non-psychoactive in raw form</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>Legal under federal hemp laws</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>Anti-inflammatory properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>Neuroprotective benefits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Zap className="h-6 w-6 text-blue-400" />
                  What is THC?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-4">
                <p>
                  <strong>THC (Tetrahydrocannabinol)</strong> is the psychoactive cannabinoid that produces the "high" associated with cannabis. It forms when THCA is heated through smoking, vaping, or cooking.
                </p>
                <h4 className="text-white font-semibold">Key THC Characteristics:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Psychoactive effects ("high")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Controlled substance federally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Pain relief properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Appetite stimulation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Molecular Structure */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Beaker className="h-6 w-6 text-green-400" />
                The Science: Molecular Structure Difference
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <p className="text-lg">
                The key difference between THCA vs THC lies in their molecular structure. THCA contains an additional carboxyl group (-COOH) that prevents it from binding effectively to CB1 receptors in the brain.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-900/30 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-3 text-lg">THCA Molecular Formula</h4>
                  <p className="text-purple-200 text-sm mb-3">C₂₂H₃₀O₄ (Includes carboxyl group)</p>
                  <p className="text-purple-100 text-sm">
                    The carboxyl group makes THCA too large to fit properly into CB1 receptors, preventing psychoactive effects.
                  </p>
                </div>
                
                <div className="bg-blue-900/30 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-3 text-lg">THC Molecular Formula</h4>
                  <p className="text-blue-200 text-sm mb-3">C₂₁H₃₀O₂ (Carboxyl group removed)</p>
                  <p className="text-blue-100 text-sm">
                    When heated, THCA loses its carboxyl group through decarboxylation, becoming THC and gaining psychoactivity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Status */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Scale className="h-6 w-6 text-yellow-400" />
                Legal Status: THCA vs THC
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-900/30 rounded-lg p-6 border border-green-400/30">
                  <h4 className="text-green-300 font-semibold mb-3 text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    THCA Legal Status
                  </h4>
                  <ul className="text-green-100 text-sm space-y-2">
                    <li>• Legal under 2018 Farm Bill when hemp-derived</li>
                    <li>• Must contain less than 0.3% Delta-9 THC</li>
                    <li>• Available for purchase in most US states</li>
                    <li>• No prescription required</li>
                    <li>• Can be shipped across state lines</li>
                  </ul>
                </div>
                
                <div className="bg-red-900/30 rounded-lg p-6 border border-red-400/30">
                  <h4 className="text-red-300 font-semibold mb-3 text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    THC Legal Status
                  </h4>
                  <ul className="text-red-100 text-sm space-y-2">
                    <li>• Controlled substance under federal law</li>
                    <li>• Legal only in certain states</li>
                    <li>• Requires medical/recreational licenses</li>
                    <li>• Cannot cross state lines legally</li>
                    <li>• May require medical prescription</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Effects Comparison */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Effects Comparison: THCA vs THC</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-purple-300 font-semibold mb-4 text-lg">THCA Effects</h4>
                  <ul className="space-y-3 text-purple-100">
                    <li className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Neuroprotective:</strong> May support brain health and cognitive function
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Anti-inflammatory:</strong> Reduces inflammation without intoxication
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Clarity:</strong> Mental clarity and focus without impairment
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-blue-300 font-semibold mb-4 text-lg">THC Effects</h4>
                  <ul className="space-y-3 text-blue-100">
                    <li className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Psychoactive:</strong> Euphoric "high" and altered consciousness
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Pain Relief:</strong> Effective for chronic pain management
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Appetite:</strong> Increases appetite and may help with nausea
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl">FAQ: THCA vs THC</CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Does THCA turn into THC?</h4>
                <p className="text-gray-200 text-sm">
                  Yes, THCA converts to THC through decarboxylation when exposed to heat (smoking, vaping, cooking). This process removes the carboxyl group and activates the psychoactive properties.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Can you get high from THCA?</h4>
                <p className="text-gray-200 text-sm">
                  No, pure THCA is non-psychoactive and won't produce a "high." However, if THCA is heated (like smoking THCA flower), it converts to THC and will produce psychoactive effects.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Which is better: THCA or THC?</h4>
                <p className="text-gray-200 text-sm">
                  Neither is "better" - they serve different purposes. THCA is ideal for those seeking therapeutic benefits without intoxication, while THC is preferred for those wanting psychoactive effects along with pain relief.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Will THCA show up on a drug test?</h4>
                <p className="text-gray-200 text-sm">
                  Pure THCA typically won't trigger a positive drug test, as tests look for THC metabolites. However, many THCA products contain trace amounts of THC, so proceed with caution if drug testing is a concern.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-400/30 backdrop-blur-md p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Experience THCA Benefits?
              </h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Explore our premium THCA products and discover the non-psychoactive benefits of this amazing cannabinoid.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  <Link href="/products">
                    Shop THCA Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-400/10">
                  <Link href="/thca-dosage-guide">
                    THCA Dosage Guide
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