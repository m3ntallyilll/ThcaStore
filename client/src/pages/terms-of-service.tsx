import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Scale, AlertTriangle, Shield, Users, FileCheck, Clock } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = "January 31, 2025";

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <FileCheck className="w-5 h-5" />,
      content: "By accessing and using THCA Store, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services."
    },
    {
      id: "age-verification",
      title: "Age Verification & Legal Requirements",
      icon: <Users className="w-5 h-5" />,
      content: "You must be at least 21 years old to purchase THCA products. By using our services, you confirm that you are legally authorized to purchase cannabis products in your jurisdiction."
    },
    {
      id: "product-information",
      title: "Product Information & Disclaimers",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: "All product information is for educational purposes. THCA products have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease."
    },
    {
      id: "ordering-payment",
      title: "Ordering & Payment",
      icon: <Scale className="w-5 h-5" />,
      content: "All orders are subject to acceptance and availability. Payment is processed securely through Stripe. Prices are subject to change without notice."
    },
    {
      id: "shipping-delivery",
      title: "Shipping & Delivery",
      icon: <Clock className="w-5 h-5" />,
      content: "We ship only to states where THCA is legal. Delivery times are estimates. Risk of loss transfers to you upon delivery to the shipping address."
    },
    {
      id: "privacy-security",
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      content: "Your privacy is protected according to our Privacy Policy. We maintain strict confidentiality of all customer information and purchase records."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            These terms govern your use of THCA Store and the purchase of our cannabis products.
          </p>
          <Badge variant="outline" className="mt-4 text-purple-400 border-purple-400">
            Last Updated: {lastUpdated}
          </Badge>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="glass-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-3 text-2xl">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card className="glass-dark border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                Important Legal Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>Legal Compliance:</strong> Cannabis laws vary by state and locality. 
                  It is your responsibility to ensure that your purchase and possession of THCA products 
                  complies with applicable laws in your jurisdiction.
                </p>
                <p>
                  <strong>Medical Disclaimer:</strong> THCA products have not been evaluated by the FDA. 
                  These statements have not been evaluated by the Food and Drug Administration. 
                  These products are not intended to diagnose, treat, cure, or prevent any disease.
                </p>
                <p>
                  <strong>Use Responsibly:</strong> Cannabis products may cause drowsiness, dizziness, 
                  or impairment. Do not operate machinery or drive after use. Keep out of reach of children and pets.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <Card className="glass-dark border-gray-700">
            <CardContent className="text-center py-8">
              <p className="text-gray-300 mb-4">
                Questions about these terms? Contact us at{' '}
                <span className="text-purple-400 font-semibold">legal@thcastore.com</span>
              </p>
              <p className="text-sm text-gray-400">
                These terms are effective as of {lastUpdated} and supersede all previous versions.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}