import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, AlertTriangle, Users, Clock, Zap, Brain, CheckCircle, ArrowRight, Scale, Info } from 'lucide-react';
import { Link } from 'wouter';

export default function THCADosageGuide() {
  const [selectedWeight, setSelectedWeight] = useState<string>('150');
  const [selectedExperience, setSelectedExperience] = useState<string>('beginner');
  const [calculatedDose, setCalculatedDose] = useState<{ min: number; max: number }>();

  useEffect(() => {
    // Analytics tracking
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: 'THCA Dosage Guide - Complete Dosing Chart',
        page_location: window.location.href,
      });
    }
  }, []);

  const calculateDose = () => {
    const weight = parseInt(selectedWeight);
    const baseAmount = selectedExperience === 'beginner' ? 0.1 : selectedExperience === 'intermediate' ? 0.2 : 0.3;
    const weightFactor = weight / 150; // 150lbs as baseline
    
    const min = Math.round((baseAmount * weightFactor) * 100) / 100;
    const max = Math.round((baseAmount * weightFactor * 1.5) * 100) / 100;
    
    setCalculatedDose({ min, max });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      <Helmet>
        <title>THCA Dosage Guide: How to Use THCA Safely & Effectively | Mentally-Chill</title>
        <meta name="description" content="Complete THCA dosage guide with dosing charts, safety tips, and personalized recommendations. Learn how to use THCA properly for optimal benefits." />
        <meta name="keywords" content="THCA dosage guide, how to use THCA, THCA dosing chart, THCA dosage calculator, safe THCA dosing, THCA dose recommendations" />
        <link rel="canonical" href="https://mentally-chill.online/thca-dosage-guide" />
        <meta property="og:title" content="THCA Dosage Guide: Complete Guide to Safe Dosing" />
        <meta property="og:description" content="Learn how to dose THCA safely with our comprehensive dosage guide including personalized recommendations and dosing charts." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://mentally-chill.online/thca-dosage-guide" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="THCA Dosage Guide: How to Use THCA Safely" />
        <meta name="twitter:description" content="Complete guide to THCA dosing with safety tips and personalized recommendations for optimal benefits." />
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
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  THCA Dosage Guide
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-teal-200 mb-8">
                How to Use THCA Safely & Effectively
              </h2>
            </motion.div>

            <div className="bg-yellow-500/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/30 mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">Important Safety Notice</h3>
              </div>
              <p className="text-yellow-100 text-sm max-w-4xl mx-auto">
                This information is for educational purposes only. Always consult with a healthcare professional before using THCA products, especially if you have medical conditions or take medications. Start with the lowest recommended dose and gradually increase as needed.
              </p>
            </div>
          </div>

          {/* Dosage Calculator */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center flex items-center justify-center gap-3">
                <Calculator className="h-6 w-6 text-teal-400" />
                THCA Dosage Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white font-medium mb-3 block">Body Weight (lbs)</label>
                  <select 
                    value={selectedWeight} 
                    onChange={(e) => setSelectedWeight(e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-md"
                  >
                    <option value="100">100 lbs</option>
                    <option value="125">125 lbs</option>
                    <option value="150">150 lbs</option>
                    <option value="175">175 lbs</option>
                    <option value="200">200 lbs</option>
                    <option value="225">225 lbs</option>
                    <option value="250">250+ lbs</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white font-medium mb-3 block">Experience Level</label>
                  <select 
                    value={selectedExperience} 
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-md"
                  >
                    <option value="beginner">Beginner (New to THCA)</option>
                    <option value="intermediate">Intermediate (Some experience)</option>
                    <option value="experienced">Experienced (Regular user)</option>
                  </select>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={calculateDose}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-3"
                >
                  Calculate My Dose
                </Button>
              </div>
              
              {calculatedDose && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-teal-900/30 rounded-lg p-6 border border-teal-400/30 text-center"
                >
                  <h4 className="text-white font-semibold mb-2 text-lg">Your Recommended THCA Dose</h4>
                  <p className="text-teal-200 text-2xl font-bold mb-2">
                    {calculatedDose.min}g - {calculatedDose.max}g
                  </p>
                  <p className="text-teal-100 text-sm">
                    Start with the lower amount and adjust as needed. Wait at least 2 hours before taking more.
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Dosage Chart */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Scale className="h-6 w-6 text-cyan-400" />
                THCA Dosage Chart by Experience Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-lg font-semibold">Experience Level</th>
                      <th className="text-center py-3 px-4 text-lg font-semibold">Raw THCA Dose</th>
                      <th className="text-center py-3 px-4 text-lg font-semibold">THCA Tincture</th>
                      <th className="text-center py-3 px-4 text-lg font-semibold">Effects Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-400" />
                          <strong>Beginner</strong>
                        </div>
                        <p className="text-xs text-gray-300 mt-1">New to THCA</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-green-300 font-semibold">0.1 - 0.2g</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-green-300 font-semibold">5-10 drops</span>
                      </td>
                      <td className="py-4 px-4 text-center">30-60 min</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-yellow-400" />
                          <strong>Intermediate</strong>
                        </div>
                        <p className="text-xs text-gray-300 mt-1">Some experience</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-yellow-300 font-semibold">0.2 - 0.4g</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-yellow-300 font-semibold">10-20 drops</span>
                      </td>
                      <td className="py-4 px-4 text-center">20-45 min</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-red-400" />
                          <strong>Experienced</strong>
                        </div>
                        <p className="text-xs text-gray-300 mt-1">Regular user</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-red-300 font-semibold">0.4 - 0.8g</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-red-300 font-semibold">20-40 drops</span>
                      </td>
                      <td className="py-4 px-4 text-center">15-30 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Methods of Consumption */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Info className="h-6 w-6 text-teal-400" />
                  Raw THCA Consumption
                </CardTitle>
              </CardHeader>
              <CardContent className="text-teal-100 space-y-4">
                <p>
                  Raw THCA consumption provides non-psychoactive benefits and is ideal for those seeking therapeutic effects without intoxication.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Methods:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Fresh THCA flower (juiced or eaten)</li>
                      <li>• THCA tinctures and oils</li>
                      <li>• Raw THCA crystals or powder</li>
                      <li>• THCA capsules</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• No psychoactive effects</li>
                      <li>• Anti-inflammatory properties</li>
                      <li>• Neuroprotective benefits</li>
                      <li>• Legal in most areas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                  Heated THCA (Converts to THC)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-100 space-y-4">
                <p>
                  When THCA is heated (smoking, vaping, cooking), it converts to THC and becomes psychoactive. Different dosing applies.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Methods:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Smoking THCA flower</li>
                      <li>• Vaporizing THCA products</li>
                      <li>• Cooking with THCA (edibles)</li>
                      <li>• Dabbing THCA concentrates</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Important Notes:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Will produce psychoactive effects</li>
                      <li>• Start with much smaller amounts</li>
                      <li>• Legal status may vary by location</li>
                      <li>• May show on drug tests</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safety Guidelines */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                THCA Dosage Safety Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-green-300 font-semibold mb-3 text-lg">Do's</h4>
                  <ul className="space-y-2 text-green-100 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Start with the lowest recommended dose</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Wait at least 2 hours before increasing dose</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Keep a dosage journal to track effects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Store THCA products properly (cool, dry, dark)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Consult healthcare provider if taking medications</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-red-300 font-semibold mb-3 text-lg">Don'ts</h4>
                  <ul className="space-y-2 text-red-100 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Don't exceed recommended dosage amounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Don't drive or operate machinery after use</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Don't mix with alcohol or other substances</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Don't use if pregnant or nursing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Don't assume all THCA products are the same</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline and Effects */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Clock className="h-6 w-6 text-blue-400" />
                THCA Effects Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-900/30 rounded-lg p-4 text-center">
                    <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">0-30 min</h4>
                    <p className="text-sm text-blue-200">Initial onset, subtle effects begin</p>
                  </div>
                  <div className="bg-teal-900/30 rounded-lg p-4 text-center">
                    <Zap className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">30-60 min</h4>
                    <p className="text-sm text-teal-200">Peak effects, full benefits realized</p>
                  </div>
                  <div className="bg-cyan-900/30 rounded-lg p-4 text-center">
                    <Brain className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">1-4 hours</h4>
                    <p className="text-sm text-cyan-200">Sustained benefits, continued effects</p>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">4+ hours</h4>
                    <p className="text-sm text-purple-200">Effects gradually diminish</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-3">What to Expect</h4>
                  <ul className="space-y-2 text-gray-200 text-sm">
                    <li>• Subtle sense of well-being and relaxation</li>
                    <li>• Potential reduction in inflammation and discomfort</li>
                    <li>• Mental clarity without impairment</li>
                    <li>• Enhanced focus and mood stability</li>
                    <li>• No "high" or intoxicating effects (raw THCA)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border-teal-400/30 backdrop-blur-md p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Start Your THCA Journey Safely
              </h3>
              <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
                Explore our lab-tested THCA products with detailed dosing information and start with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
                  <Link href="/products">
                    Shop THCA Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-teal-400 text-teal-300 hover:bg-teal-400/10">
                  <Link href="/is-thca-legal">
                    Is THCA Legal?
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