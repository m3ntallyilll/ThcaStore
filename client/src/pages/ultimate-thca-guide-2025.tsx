import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Clock, Shield, Award, CheckCircle, AlertTriangle, 
  Zap, Leaf, FlaskConical, Scale, MapPin, Calendar, Star
} from 'lucide-react';
import { Link } from 'wouter';

export default function UltimateTHCAGuide2025() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
      <Helmet>
        <title>Ultimate THCA Guide 2025 - Complete Expert Guide to THCA Products | Mentally-Chill</title>
        <meta name="description" content="The most comprehensive THCA guide for 2025. Expert insights on THCA benefits, legal status, dosage, products, and everything you need to know about tetrahydrocannabinolic acid." />
        <meta name="keywords" content="ultimate THCA guide 2025, complete THCA guide, THCA expert guide, THCA comprehensive guide, THCA education 2025, THCA flower guide, THCA concentrates guide" />
        <meta property="og:title" content="Ultimate THCA Guide 2025 - Complete Expert Guide | Mentally-Chill" />
        <meta property="og:description" content="The definitive 2025 guide to THCA. Expert insights, product reviews, legal updates, and everything you need to know about THCA products." />
        <link rel="canonical" href="https://mentally-chill.online/ultimate-thca-guide-2025" />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 text-lg">
            <Calendar className="h-4 w-4 mr-2" />
            Updated for 2025
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Ultimate THCA Guide 2025
          </h1>
          <p className="text-xl md:text-2xl text-emerald-200 max-w-4xl mx-auto mb-8">
            The most comprehensive, expert-reviewed guide to THCA products, benefits, legality, and everything you need to know about tetrahydrocannabinolic acid in 2025.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="border-emerald-400 text-emerald-300">
              <Star className="h-4 w-4 mr-2" />
              Expert Reviewed
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              <FlaskConical className="h-4 w-4 mr-2" />
              Lab-Backed Info
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              <Scale className="h-4 w-4 mr-2" />
              Legal Updates
            </Badge>
            <Badge variant="outline" className="border-gold text-gold">
              <Award className="h-4 w-4 mr-2" />
              Industry Leading
            </Badge>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-400/30">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-300 flex items-center gap-3">
                <BookOpen className="h-6 w-6" />
                Complete Guide Contents
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "What is THCA?", time: "5 min read", link: "#what-is-thca" },
                { title: "THCA vs THC Explained", time: "7 min read", link: "#thca-vs-thc" },
                { title: "THCA Benefits & Effects", time: "10 min read", link: "#thca-benefits" },
                { title: "Is THCA Legal in 2025?", time: "8 min read", link: "#thca-legal-2025" },
                { title: "THCA Dosage Guide", time: "6 min read", link: "#thca-dosage" },
                { title: "Types of THCA Products", time: "12 min read", link: "#thca-products" },
                { title: "How to Choose Quality THCA", time: "9 min read", link: "#choose-quality-thca" },
                { title: "THCA Lab Testing", time: "5 min read", link: "#thca-lab-testing" },
                { title: "State-by-State Legal Guide", time: "15 min read", link: "#state-legal-guide" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-md">
                  <a href={item.link} className="text-white hover:text-emerald-300 font-medium">
                    {item.title}
                  </a>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.time}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Chapter 1: What is THCA? */}
        <motion.div
          id="what-is-thca"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-3xl text-white flex items-center gap-3">
                <Leaf className="h-8 w-8 text-emerald-400" />
                Chapter 1: What is THCA?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div className="text-lg leading-relaxed">
                <p className="mb-6">
                  <strong className="text-emerald-300">Tetrahydrocannabinolic acid (THCA)</strong> is the non-psychoactive precursor to THC found in raw cannabis plants. Unlike THC, THCA doesn't produce intoxicating effects in its natural state, making it legal under federal hemp laws when derived from compliant hemp plants.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-emerald-300 mb-4">Key THCA Facts:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>Non-psychoactive in raw form</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>Converts to THC when heated (decarboxylation)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>Abundant in fresh, uncured cannabis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>Potential therapeutic properties</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-blue-300 mb-4">Molecular Structure:</h3>
                    <p className="text-blue-100 mb-4">
                      THCA has an additional carboxyl group (-COOH) that THC lacks. This extra molecular component prevents THCA from binding to CB1 receptors in the brain, eliminating psychoactive effects.
                    </p>
                    <div className="bg-blue-900/30 p-4 rounded-lg">
                      <p className="text-sm text-blue-200">
                        <strong>Chemical Formula:</strong> C₂₂H₃₀O₄<br />
                        <strong>Molecular Weight:</strong> 358.47 g/mol
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chapter 2: THCA vs THC */}
        <motion.div
          id="thca-vs-thc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-3xl text-white flex items-center gap-3">
                <Scale className="h-8 w-8 text-blue-400" />
                Chapter 2: THCA vs THC - Complete Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-4 font-semibold text-emerald-300">Aspect</th>
                      <th className="text-left p-4 font-semibold text-blue-300">THCA</th>
                      <th className="text-left p-4 font-semibold text-purple-300">THC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium">Psychoactive Effects</td>
                      <td className="p-4 text-green-300">None (non-psychoactive)</td>
                      <td className="p-4 text-red-300">Yes (intoxicating)</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium">Legal Status</td>
                      <td className="p-4 text-green-300">Legal (hemp-derived)</td>
                      <td className="p-4 text-red-300">Federally illegal</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium">Found In</td>
                      <td className="p-4">Raw cannabis plants</td>
                      <td className="p-4">Heated/cured cannabis</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-medium">Potential Benefits</td>
                      <td className="p-4">Anti-inflammatory, neuroprotective</td>
                      <td className="p-4">Pain relief, appetite stimulation</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Consumption Methods</td>
                      <td className="p-4">Raw, tinctures, capsules</td>
                      <td className="p-4">Smoking, vaping, edibles</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">The Decarboxylation Process</h3>
                <p className="text-blue-100 mb-4">
                  When THCA is exposed to heat (around 220°F/104°C), it loses its carboxyl group and converts to THC. This process, called decarboxylation, is what makes cannabis psychoactive when smoked, vaped, or cooked.
                </p>
                <div className="flex items-center justify-center">
                  <span className="text-emerald-300 font-mono">THCA</span>
                  <span className="mx-4 text-white">→ Heat →</span>
                  <span className="text-purple-300 font-mono">THC + CO₂</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chapter 3: THCA Benefits */}
        <motion.div
          id="thca-benefits"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-3xl text-white flex items-center gap-3">
                <FlaskConical className="h-8 w-8 text-purple-400" />
                Chapter 3: THCA Benefits & Scientific Research
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Anti-Inflammatory",
                    icon: <Shield className="h-6 w-6 text-red-400" />,
                    description: "Studies suggest THCA may reduce inflammation markers and provide relief from inflammatory conditions.",
                    research: "Preliminary research shows promise for arthritis and inflammatory bowel conditions."
                  },
                  {
                    title: "Neuroprotective",
                    icon: <Zap className="h-6 w-6 text-blue-400" />,
                    description: "May protect brain cells and support neurological health through various mechanisms.",
                    research: "Early studies investigate potential for neurodegenerative disease support."
                  },
                  {
                    title: "Anti-Nausea",
                    icon: <CheckCircle className="h-6 w-6 text-green-400" />,
                    description: "Could help reduce nausea and vomiting, particularly in medical applications.",
                    research: "Similar mechanisms to other cannabinoids that show anti-emetic properties."
                  },
                  {
                    title: "Appetite Support",
                    icon: <Award className="h-6 w-6 text-yellow-400" />,
                    description: "May help regulate appetite without the intense hunger associated with THC.",
                    research: "More subtle appetite effects compared to THC-based products."
                  },
                  {
                    title: "Sleep Support",
                    icon: <Clock className="h-6 w-6 text-purple-400" />,
                    description: "Some users report improved sleep quality and relaxation benefits.",
                    research: "Anecdotal reports suggest calming effects without sedation."
                  },
                  {
                    title: "Antioxidant Properties",
                    icon: <Leaf className="h-6 w-6 text-emerald-400" />,
                    description: "May provide cellular protection through antioxidant mechanisms.",
                    research: "Similar to other cannabinoids showing antioxidant activity."
                  }
                ].map((benefit, index) => (
                  <Card key={index} className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-400/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        {benefit.icon}
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-3">{benefit.description}</p>
                      <div className="bg-purple-900/30 p-3 rounded-lg">
                        <p className="text-xs text-purple-200">
                          <strong>Research Status:</strong> {benefit.research}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="bg-amber-900/20 border border-amber-500/30 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-amber-300 font-semibold mb-2">Important Research Note</h3>
                    <p className="text-amber-100 text-sm">
                      Most THCA research is in early stages. While preliminary studies and anecdotal reports are promising, more clinical trials are needed to fully establish therapeutic benefits. Always consult healthcare professionals before using THCA for medical purposes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Navigation to Other Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Continue Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              <Link href="/is-thca-legal">Legal Status 2025</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Link href="/thca-dosage-guide">Dosage Guide</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Link href="/buy-thca-flower">Shop THCA Products</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-yellow-700">
              <Link href="/thca-reviews-2025">Product Reviews</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}