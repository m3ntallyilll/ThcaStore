import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, XCircle, AlertTriangle, Search, MapPin, 
  Shield, Scale, Calendar, FileText, ExternalLink
} from 'lucide-react';

// State data with legal status and details
const stateData = {
  legal: [
    { name: 'Alabama', status: 'Legal', notes: 'Hemp-derived THCA legal under federal Farm Bill compliance' },
    { name: 'Alaska', status: 'Legal', notes: 'Legal for hemp products under 0.3% Delta-9 THC' },
    { name: 'Arizona', status: 'Legal', notes: 'Hemp-derived cannabinoids legal with proper compliance' },
    { name: 'Arkansas', status: 'Legal', notes: 'Legal hemp products including THCA allowed' },
    { name: 'California', status: 'Legal', notes: 'Fully legal for hemp-derived THCA products' },
    { name: 'Colorado', status: 'Legal', notes: 'Legal under state hemp regulations' },
    { name: 'Connecticut', status: 'Legal', notes: 'Hemp-derived THCA products permitted' },
    { name: 'Delaware', status: 'Legal', notes: 'Legal for compliant hemp products' },
    { name: 'Florida', status: 'Legal', notes: 'Hemp-derived THCA legal statewide' },
    { name: 'Georgia', status: 'Legal', notes: 'Legal under Georgia Hemp Farming Act' },
    { name: 'Illinois', status: 'Legal', notes: 'Hemp products legal including THCA' },
    { name: 'Indiana', status: 'Legal', notes: 'Legal hemp-derived products allowed' },
    { name: 'Kansas', status: 'Legal', notes: 'Hemp products legal under federal guidelines' },
    { name: 'Kentucky', status: 'Legal', notes: 'Legal hemp production and products state' },
    { name: 'Louisiana', status: 'Legal', notes: 'Hemp-derived THCA products legal' },
    { name: 'Maine', status: 'Legal', notes: 'Legal for hemp-derived products' },
    { name: 'Maryland', status: 'Legal', notes: 'Hemp products including THCA legal' },
    { name: 'Massachusetts', status: 'Legal', notes: 'Legal hemp-derived products' },
    { name: 'Michigan', status: 'Legal', notes: 'Hemp products legal statewide' },
    { name: 'Mississippi', status: 'Legal', notes: 'Legal under hemp program' },
    { name: 'Missouri', status: 'Legal', notes: 'Hemp-derived products legal' },
    { name: 'Montana', status: 'Legal', notes: 'Legal hemp products allowed' },
    { name: 'Nebraska', status: 'Legal', notes: 'Hemp products legal under state law' },
    { name: 'Nevada', status: 'Legal', notes: 'Legal hemp-derived THCA products' },
    { name: 'New Hampshire', status: 'Legal', notes: 'Hemp products legal in state' },
    { name: 'New Jersey', status: 'Legal', notes: 'Legal hemp-derived products' },
    { name: 'New Mexico', status: 'Legal', notes: 'Hemp products including THCA legal' },
    { name: 'New York', status: 'Legal', notes: 'Legal hemp-derived products statewide' },
    { name: 'North Carolina', status: 'Legal', notes: 'Hemp products legal under state regulations' },
    { name: 'North Dakota', status: 'Legal', notes: 'Legal hemp products allowed' },
    { name: 'Ohio', status: 'Legal', notes: 'Hemp-derived products legal' },
    { name: 'Oklahoma', status: 'Legal', notes: 'Legal hemp products statewide' },
    { name: 'Oregon', status: 'Legal', notes: 'Legal hemp-derived THCA products' },
    { name: 'Pennsylvania', status: 'Legal', notes: 'Hemp products legal including THCA' },
    { name: 'Rhode Island', status: 'Legal', notes: 'Legal hemp-derived products' },
    { name: 'South Carolina', status: 'Legal', notes: 'Hemp products legal under state law' },
    { name: 'South Dakota', status: 'Legal', notes: 'Legal hemp products allowed' },
    { name: 'Tennessee', status: 'Legal', notes: 'Hemp-derived THCA products legal' },
    { name: 'Texas', status: 'Legal', notes: 'Legal under Texas Hemp Program' },
    { name: 'Utah', status: 'Legal', notes: 'Hemp products legal with compliance' },
    { name: 'Vermont', status: 'Legal', notes: 'Legal hemp-derived products' },
    { name: 'Virginia', status: 'Legal', notes: 'Hemp products including THCA legal' },
    { name: 'Washington', status: 'Legal', notes: 'Legal hemp-derived THCA products' },
    { name: 'West Virginia', status: 'Legal', notes: 'Hemp products legal statewide' },
    { name: 'Wisconsin', status: 'Legal', notes: 'Legal hemp-derived products' },
    { name: 'Wyoming', status: 'Legal', notes: 'Hemp products legal under state regulations' }
  ],
  restricted: [
    { name: 'Hawaii', status: 'Restricted', notes: 'Some restrictions on hemp products - verify local laws' },
    { name: 'Iowa', status: 'Restricted', notes: 'Limited hemp program - check current regulations' },
    { name: 'Minnesota', status: 'Restricted', notes: 'Specific regulations apply - verify compliance' }
  ],
  prohibited: []
};

export default function StateByStateTHCALegal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const allStates = [...stateData.legal, ...stateData.restricted, ...stateData.prohibited];
  
  const filteredStates = allStates.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Legal':
        return 'text-green-400 border-green-400';
      case 'Restricted':
        return 'text-yellow-400 border-yellow-400';
      case 'Prohibited':
        return 'text-red-400 border-red-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Legal':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'Restricted':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'Prohibited':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
      <Helmet>
        <title>THCA Legal States Map 2025 - State-by-State THCA Legality Guide | Mentally-Chill</title>
        <meta name="description" content="Complete state-by-state guide to THCA legality in 2025. Updated legal status, regulations, and shipping information for all 50 states." />
        <meta name="keywords" content="THCA legal states map, THCA legal by state, THCA state laws 2025, where is THCA legal, THCA shipping states, THCA legality guide" />
        <meta property="og:title" content="THCA Legal States Map 2025 - Complete State Guide | Mentally-Chill" />
        <meta property="og:description" content="Comprehensive guide to THCA legality across all 50 states. Updated regulations, shipping info, and legal status for 2025." />
        <link rel="canonical" href={`${window.location.origin}/state-by-state-thca-legal`} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-lg">
            <Calendar className="h-4 w-4 mr-2" />
            Updated January 2025
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            THCA Legal States Map 2025
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto mb-8">
            Complete state-by-state guide to THCA legality. Find out where hemp-derived THCA products 
            are legal, restricted, or prohibited with our comprehensive 2025 legal reference.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="border-green-400 text-green-300">
              <CheckCircle className="h-4 w-4 mr-2" />
              46 Legal States
            </Badge>
            <Badge variant="outline" className="border-yellow-400 text-yellow-300">
              <AlertTriangle className="h-4 w-4 mr-2" />
              3 Restricted States
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-300">
              <Shield className="h-4 w-4 mr-2" />
              Federally Legal Hemp
            </Badge>
          </div>
        </motion.div>

        {/* Search and Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-400/30">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-300 flex items-center gap-3">
                <MapPin className="h-6 w-6" />
                Find Your State's THCA Laws
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for your state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h3 className="text-green-300 font-semibold">Legal States</h3>
                  <p className="text-green-100 text-sm">Hemp-derived THCA products are legal</p>
                  <p className="text-2xl font-bold text-green-400 mt-2">46 States</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-900/30 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <h3 className="text-yellow-300 font-semibold">Restricted</h3>
                  <p className="text-yellow-100 text-sm">Some limitations or special requirements</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">3 States</p>
                </div>
                
                <div className="text-center p-4 bg-red-900/30 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <h3 className="text-red-300 font-semibold">Prohibited</h3>
                  <p className="text-red-100 text-sm">THCA products not permitted</p>
                  <p className="text-2xl font-bold text-red-400 mt-2">0 States</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* State List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">State-by-State THCA Legal Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredStates.map((state, index) => (
                <motion.div
                  key={state.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <Card 
                    className={`bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all cursor-pointer ${
                      selectedState === state.name ? 'ring-2 ring-blue-400' : ''
                    }`}
                    onClick={() => setSelectedState(selectedState === state.name ? null : state.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(state.status)}
                          <div>
                            <h3 className="text-white font-semibold">{state.name}</h3>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(state.status)}`}>
                              {state.status}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-300 hover:text-blue-400">
                          Details
                        </Button>
                      </div>
                      
                      <AnimatePresence>
                        {selectedState === state.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-white/20"
                          >
                            <p className="text-gray-300 text-sm">{state.notes}</p>
                            {state.status === 'Legal' && (
                              <div className="mt-3 flex gap-2">
                                <Badge className="bg-green-600/20 text-green-300 text-xs">
                                  ✓ Shipping Available
                                </Badge>
                                <Badge className="bg-blue-600/20 text-blue-300 text-xs">
                                  ✓ Hemp Compliant
                                </Badge>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Legal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-400/30">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-300 flex items-center gap-3">
                <Scale className="h-6 w-6" />
                Federal Legal Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-emerald-300 mb-4">2018 Farm Bill Compliance</h3>
                  <ul className="space-y-3 text-emerald-100">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Hemp-derived products with &lt;0.3% Delta-9 THC are federally legal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>THCA is not specifically regulated under the Controlled Substances Act</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Products must be produced by licensed hemp cultivators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Third-party lab testing required for compliance verification</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-blue-300 mb-4">State Considerations</h3>
                  <ul className="space-y-3 text-blue-100">
                    <li className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>States can implement additional regulations beyond federal law</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Some states require specific licensing or registration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Age restrictions may apply (typically 21+ or 18+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Regular legal updates as legislation evolves</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-900/20 border border-amber-500/30 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-amber-300 font-semibold mb-2">Legal Disclaimer</h3>
                    <p className="text-amber-100 text-sm">
                      This information is for educational purposes only and should not be considered legal advice. 
                      Laws regarding THCA and hemp products are subject to change. Always consult with local 
                      authorities or legal professionals for the most current regulations in your area.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-400/30 p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Shop Legal THCA Products
            </h2>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
              We only ship to states where hemp-derived THCA products are legal. 
              All our products are compliant with federal and state regulations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <a href="/buy-thca-flower">Shop THCA Flower</a>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <a href="/products?category=concentrates">Shop Concentrates</a>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <a href="/is-thca-legal">Learn More About THCA Laws</a>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}