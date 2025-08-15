import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scale, CheckCircle, AlertTriangle, MapPin, FileText, Shield, ArrowRight, Building, Users, Clock } from 'lucide-react';
import { Link } from 'wouter';

export default function IsTHCALegal() {
  useEffect(() => {
    // Analytics tracking
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: 'Is THCA Legal? Complete Legal Guide',
        page_location: window.location.href,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <Helmet>
        <title>Is THCA Legal? Complete Legal Guide 2025 | Mentally-Chill</title>
        <meta name="description" content="Is THCA legal in your state? Complete guide to THCA legality, 2018 Farm Bill compliance, state laws, and hemp-derived THCA regulations." />
        <meta name="keywords" content="is THCA legal, THCA legal status, THCA law, hemp THCA legal, 2018 Farm Bill THCA, THCA state laws, legal THCA products" />
        <link rel="canonical" href="https://mentally-chill.com/is-thca-legal" />
        <meta property="og:title" content="Is THCA Legal? Complete Legal Status Guide" />
        <meta property="og:description" content="Comprehensive guide to THCA legality including federal law, state regulations, and 2018 Farm Bill compliance." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://mentally-chill.com/is-thca-legal" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Is THCA Legal? 2025 Legal Status Guide" />
        <meta name="twitter:description" content="Find out if THCA is legal in your area with our complete guide to federal and state THCA laws." />
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
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Is THCA Legal?
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-green-200 mb-8">
                Complete Legal Guide & State-by-State Analysis
              </h2>
            </motion.div>

            <div className="bg-green-500/20 backdrop-blur-md rounded-2xl p-8 border border-green-400/30 mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <h3 className="text-2xl font-semibold text-white">Yes, THCA is Federally Legal!</h3>
              </div>
              <p className="text-green-100 text-lg max-w-4xl mx-auto">
                Hemp-derived THCA products containing less than 0.3% Delta-9 THC are legal under the 2018 Farm Bill in the United States.
              </p>
            </div>
          </div>

          {/* Federal Legal Status */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Building className="h-6 w-6 text-green-400" />
                Federal Legal Status of THCA
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-green-300 font-semibold mb-3 text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    2018 Farm Bill Protection
                  </h4>
                  <p className="text-green-100 mb-4">
                    The 2018 Farm Bill legalized hemp and hemp-derived compounds, including THCA, as long as they contain less than 0.3% Delta-9 THC on a dry weight basis.
                  </p>
                  <ul className="space-y-2 text-sm text-green-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Hemp-derived THCA is federally legal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Must contain less than 0.3% Delta-9 THC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Can be shipped across state lines</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-blue-300 font-semibold mb-3 text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    DEA Position on THCA
                  </h4>
                  <p className="text-blue-100 mb-4">
                    The DEA has not specifically scheduled THCA as a controlled substance, and it falls under the hemp exemption when derived from compliant hemp plants.
                  </p>
                  <ul className="space-y-2 text-sm text-blue-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>THCA not specifically scheduled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Protected under hemp exemption</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>No federal prosecution for compliant products</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Requirements */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Legal Requirements for THCA Products</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-900/30 rounded-lg p-6">
                  <Shield className="h-8 w-8 text-green-400 mb-4" />
                  <h4 className="font-semibold mb-3 text-lg">THC Compliance</h4>
                  <p className="text-green-200 text-sm mb-3">
                    Must contain less than 0.3% Delta-9 THC by dry weight to remain federally legal.
                  </p>
                  <ul className="text-xs text-green-100 space-y-1">
                    <li>• Third-party lab testing required</li>
                    <li>• COAs must show compliance</li>
                    <li>• Regular batch testing needed</li>
                  </ul>
                </div>
                
                <div className="bg-blue-900/30 rounded-lg p-6">
                  <FileText className="h-8 w-8 text-blue-400 mb-4" />
                  <h4 className="font-semibold mb-3 text-lg">Hemp Source</h4>
                  <p className="text-blue-200 text-sm mb-3">
                    THCA must be derived from legally cultivated hemp plants under state hemp programs.
                  </p>
                  <ul className="text-xs text-blue-100 space-y-1">
                    <li>• Licensed hemp cultivation</li>
                    <li>• State program compliance</li>
                    <li>• Proper documentation trail</li>
                  </ul>
                </div>
                
                <div className="bg-purple-900/30 rounded-lg p-6">
                  <Building className="h-8 w-8 text-purple-400 mb-4" />
                  <h4 className="font-semibold mb-3 text-lg">Manufacturing</h4>
                  <p className="text-purple-200 text-sm mb-3">
                    Products must be manufactured in compliance with applicable regulations and safety standards.
                  </p>
                  <ul className="text-xs text-purple-100 space-y-1">
                    <li>• GMP facility requirements</li>
                    <li>• Proper labeling and packaging</li>
                    <li>• Quality control measures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* State Variations */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <MapPin className="h-6 w-6 text-yellow-400" />
                State-Specific THCA Laws
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div className="bg-yellow-500/20 rounded-lg p-6 border border-yellow-400/30 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <h4 className="text-white font-semibold text-lg">Important State Law Notice</h4>
                </div>
                <p className="text-yellow-100 text-sm">
                  While THCA is federally legal, individual states may have additional restrictions or regulations. 
                  Always check your local and state laws before purchasing or using THCA products.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-green-300 font-semibold mb-4 text-lg">Generally THCA-Friendly States</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-200">
                    <div>• California</div>
                    <div>• Colorado</div>
                    <div>• Oregon</div>
                    <div>• Washington</div>
                    <div>• Nevada</div>
                    <div>• Michigan</div>
                    <div>• Vermont</div>
                    <div>• Maine</div>
                    <div>• Massachusetts</div>
                    <div>• Connecticut</div>
                    <div>• New York</div>
                    <div>• New Jersey</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-red-300 font-semibold mb-4 text-lg">States with Restrictions</h4>
                  <div className="space-y-3">
                    <div className="bg-red-900/30 rounded p-3">
                      <h5 className="font-medium text-red-200 mb-1">Idaho, Nebraska, South Dakota</h5>
                      <p className="text-xs text-red-100">Restrictive hemp laws may limit THCA</p>
                    </div>
                    <div className="bg-orange-900/30 rounded p-3">
                      <h5 className="font-medium text-orange-200 mb-1">Texas, Florida, North Carolina</h5>
                      <p className="text-xs text-orange-100">Some local restrictions may apply</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal vs Illegal THCA */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Legal vs. Illegal THCA: What's the Difference?</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-green-900/30 rounded-lg p-6 border border-green-400/30">
                  <h4 className="text-green-300 font-semibold mb-4 text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Legal THCA Products
                  </h4>
                  <ul className="space-y-3 text-green-100 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Derived from licensed hemp cultivation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Contains &lt;0.3% Delta-9 THC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Third-party lab tested and certified</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Properly labeled with compliance information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Traceable supply chain documentation</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-red-900/30 rounded-lg p-6 border border-red-400/30">
                  <h4 className="text-red-300 font-semibold mb-4 text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Illegal THCA Products
                  </h4>
                  <ul className="space-y-3 text-red-100 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Derived from non-compliant cannabis plants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Contains &gt;0.3% Delta-9 THC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>No lab testing or fraudulent COAs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Mislabeled or missing compliance info</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Black market or unlicensed sources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future Legal Outlook */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Clock className="h-6 w-6 text-purple-400" />
                Future of THCA Legality
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-4">
              <p className="text-lg">
                The legal landscape for THCA continues to evolve as legislators and regulators better understand cannabinoids and their applications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-blue-300 font-semibold mb-3">Positive Trends</h4>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Growing acceptance of hemp cannabinoids</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Clearer regulatory frameworks developing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Increased research and understanding</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-yellow-300 font-semibold mb-3">Watch Areas</h4>
                  <ul className="space-y-2 text-yellow-100 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Potential federal regulation changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>State-level legislative developments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>FDA guidance on hemp products</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Frequently Asked Questions: THCA Legality</CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Can I travel with THCA products?</h4>
                <p className="text-gray-200 text-sm">
                  Yes, federally compliant THCA products can typically be transported across state lines. However, always check destination state laws and airline policies before traveling.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Will THCA show up on a drug test?</h4>
                <p className="text-gray-200 text-sm">
                  Pure THCA typically won't trigger standard drug tests, but many products contain trace THC that could accumulate. If drug testing is a concern, consult with the testing facility about their specific protocols.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Can I grow hemp for THCA at home?</h4>
                <p className="text-gray-200 text-sm">
                  Home cultivation laws vary by state. Some states allow personal hemp cultivation, while others require licensing. Always check your local and state regulations before growing hemp.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Are there age restrictions for THCA?</h4>
                <p className="text-gray-200 text-sm">
                  Most retailers require customers to be 21+ to purchase THCA products, though federal hemp law doesn't specify age restrictions. Individual states and retailers set their own age requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400/30 backdrop-blur-md p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Shop Legal THCA Products with Confidence
              </h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                All our THCA products are fully compliant with federal hemp laws, third-party lab tested, and come with certificates of analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  <Link href="/products">
                    Browse Legal THCA Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-green-400 text-green-300 hover:bg-green-400/10">
                  <Link href="/thca-benefits">
                    Learn THCA Benefits
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