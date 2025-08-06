import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, Scale, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface LegalDisclaimerProps {
  onAccept: () => void;
  onDecline?: () => void;
}

export function LegalDisclaimer({ onAccept, onDecline }: LegalDisclaimerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [acceptedSections, setAcceptedSections] = useState<boolean[]>([false, false, false, false]);
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);

  useEffect(() => {
    // Check if user has already accepted disclaimer
    try {
      const hasAccepted = localStorage.getItem('thca-disclaimer-accepted');
      if (!hasAccepted) {
        setIsVisible(true);
      }
    } catch (error) {
      // If localStorage isn't available, show disclaimer
      setIsVisible(true);
    }
  }, []);

  const disclaimerSections = [
    {
      title: "Age Verification",
      icon: Shield,
      color: "text-blue-400",
      content: "You must be 21 years or older to purchase THCA products. By proceeding, you confirm you meet the minimum age requirement in your jurisdiction.",
      key: "age-verification"
    },
    {
      title: "Legal Compliance",
      icon: Scale,
      color: "text-green-400", 
      content: "THCA products are hemp-derived and federally legal under the 2018 Farm Bill. However, state laws may vary. You are responsible for knowing your local laws.",
      key: "legal-compliance"
    },
    {
      title: "Product Information",
      icon: FileText,
      color: "text-yellow-400",
      content: "These statements have not been evaluated by the FDA. THCA products are not intended to diagnose, treat, cure, or prevent any disease.",
      key: "product-info"
    },
    {
      title: "Usage Responsibility",
      icon: AlertTriangle,
      color: "text-orange-400",
      content: "Use responsibly. Do not drive or operate machinery. Keep out of reach of children and pets. Consult a physician before use if pregnant or nursing.",
      key: "usage-responsibility"
    }
  ];

  const handleSectionAccept = (index: number) => {
    const newAccepted = [...acceptedSections];
    newAccepted[index] = true;
    setAcceptedSections(newAccepted);
    
    // Auto-advance to next section
    if (index < disclaimerSections.length - 1) {
      setTimeout(() => setCurrentSection(index + 1), 800);
    }
  };

  const handleFinalAccept = () => {
    try {
      localStorage.setItem('thca-disclaimer-accepted', 'true');
      localStorage.setItem('thca-disclaimer-date', new Date().toISOString());
    } catch (error) {
      console.log('LocalStorage not available, disclaimer accepted for session');
    }
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    } else {
      window.location.href = 'https://google.com';
    }
  };

  const allSectionsAccepted = acceptedSections.every(accepted => accepted);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <Card className="bg-black/90 border-emerald-500/20 backdrop-blur-md">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
                <CardTitle className="text-2xl font-bold text-white">
                  Legal Disclaimer & Terms
                </CardTitle>
              </div>
              <p className="text-gray-400">
                Please review and accept these important legal terms to continue
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {disclaimerSections.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full ${acceptedSections[index] 
                      ? 'bg-emerald-500' 
                      : index === currentSection 
                        ? 'border-2 border-emerald-400' 
                        : 'border-2 border-gray-600'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {!showFullDisclaimer ? (
                <>
                  {/* Interactive Section Review */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-black/40 rounded-lg p-6 border border-emerald-500/20"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full bg-black/50 ${disclaimerSections[currentSection].color}`}>
                          {currentSection === 0 && <Shield className="w-6 h-6" />}
                          {currentSection === 1 && <Scale className="w-6 h-6" />}
                          {currentSection === 2 && <FileText className="w-6 h-6" />}
                          {currentSection === 3 && <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-3">
                            {disclaimerSections[currentSection].title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed mb-4">
                            {disclaimerSections[currentSection].content}
                          </p>
                          
                          {!acceptedSections[currentSection] && (
                            <motion.div 
                              className="flex items-center gap-3"
                              whileHover={{ scale: 1.02 }}
                            >
                              <Checkbox
                                id={disclaimerSections[currentSection].key}
                                onCheckedChange={(checked) => {
                                  if (checked) handleSectionAccept(currentSection);
                                }}
                                className="border-emerald-500 data-[state=checked]:bg-emerald-600"
                              />
                              <label 
                                htmlFor={disclaimerSections[currentSection].key}
                                className="text-sm text-gray-400 cursor-pointer"
                              >
                                I understand and accept these terms
                              </label>
                            </motion.div>
                          )}
                          
                          {acceptedSections[currentSection] && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-2 text-emerald-400"
                            >
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Accepted</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowFullDisclaimer(true)}
                      className="text-gray-400 hover:text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Full Terms
                    </Button>
                    
                    <div className="flex gap-3">
                      {currentSection > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setCurrentSection(currentSection - 1)}
                          className="border-emerald-500/50 text-emerald-400"
                        >
                          Previous
                        </Button>
                      )}
                      
                      {currentSection < disclaimerSections.length - 1 && acceptedSections[currentSection] && (
                        <Button
                          onClick={() => setCurrentSection(currentSection + 1)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Next Section
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Full Disclaimer View */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Complete Legal Terms</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullDisclaimer(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-6 border border-emerald-500/20 max-h-96 overflow-y-auto">
                    <div className="space-y-6 text-gray-300 text-sm">
                      <div>
                        <h4 className="font-semibold text-white mb-2">1. Age Verification & Legal Compliance</h4>
                        <p>By accessing this website and purchasing products, you represent and warrant that you are at least 21 years of age or the legal age of majority in your jurisdiction, whichever is greater. THCA products are derived from hemp and contain less than 0.3% Delta-9 THC on a dry weight basis, making them federally legal under the 2018 Farm Bill. However, state and local laws may vary, and you are solely responsible for ensuring compliance with all applicable laws in your jurisdiction.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">2. Product Information & FDA Disclaimer</h4>
                        <p>The products sold on this website have not been evaluated by the Food and Drug Administration (FDA). These products are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Always consult with a healthcare professional before using any hemp-derived products, especially if you have medical conditions or are taking medications.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">3. Usage & Safety Guidelines</h4>
                        <p>Use products responsibly and in accordance with recommended dosages. Do not drive, operate machinery, or engage in potentially hazardous activities while using these products. Keep all products out of reach of children and pets. Do not use if pregnant, nursing, or have any medical conditions without consulting a physician first.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">4. Lab Testing & Quality Assurance</h4>
                        <p>All products are third-party lab tested for potency, pesticides, heavy metals, and microbials. Certificates of Analysis (COAs) are available upon request. We maintain strict quality control standards but cannot guarantee product effects will be the same for every individual.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">5. Limitation of Liability</h4>
                        <p>By purchasing and using our products, you agree to assume all risks associated with their use. We are not liable for any adverse effects, legal issues, or consequences resulting from the use of our products. This disclaimer constitutes your agreement to these terms.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Acceptance */}
              {allSectionsAccepted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-900/20 rounded-lg p-6 border border-emerald-500/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Ready to Continue
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    You have reviewed and accepted all legal terms. Click below to enter the store.
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={handleDecline}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      Decline & Exit
                    </Button>
                    <Button
                      onClick={handleFinalAccept}
                      className="bg-emerald-600 hover:bg-emerald-700 px-8"
                    >
                      Accept & Enter Store
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}