import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, UserCheck, FileText, Calendar } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "January 31, 2025";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <FileText className="w-5 h-5" />,
      content: [
        {
          subtitle: "Personal Information",
          items: [
            "Name, email address, and contact information when you create an account",
            "Shipping and billing addresses for order fulfillment",
            "Payment information (processed securely through Stripe)",
            "Age verification data (required for cannabis products)"
          ]
        },
        {
          subtitle: "Usage Information", 
          items: [
            "Browser type, device information, and IP address",
            "Pages visited, time spent on site, and user interactions",
            "Shopping cart contents and purchase history",
            "AI chat interactions for customer support and sales assistance"
          ]
        },
        {
          subtitle: "Cookies and Tracking",
          items: [
            "Essential cookies for site functionality and security",
            "Analytics cookies to improve user experience",
            "Preference cookies to remember your settings"
          ]
        }
      ]
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: <UserCheck className="w-5 h-5" />,
      content: [
        {
          subtitle: "Order Processing",
          items: [
            "Process and fulfill your THCA product orders",
            "Send order confirmations, shipping updates, and tracking information",
            "Handle returns, refunds, and customer service inquiries"
          ]
        },
        {
          subtitle: "Account Management",
          items: [
            "Create and maintain your customer account",
            "Provide personalized product recommendations",
            "Manage loyalty rewards and promotional offers"
          ]
        },
        {
          subtitle: "Legal Compliance",
          items: [
            "Verify age and legal eligibility for cannabis purchases",
            "Comply with state and federal cannabis regulations",
            "Maintain required records for regulatory reporting"
          ]
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          subtitle: "We Never Sell Your Data",
          items: [
            "Your personal information is never sold to third parties",
            "We do not share customer lists with marketing companies",
            "Your purchase history remains confidential"
          ]
        },
        {
          subtitle: "Limited Sharing",
          items: [
            "Shipping companies (only name and address for delivery)",
            "Payment processors (Stripe) for secure payment processing",
            "Legal authorities when required by law or regulation"
          ]
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="w-5 h-5" />,
      content: [
        {
          subtitle: "Security Measures",
          items: [
            "SSL encryption for all data transmission",
            "Secure payment processing through PCI-compliant systems",
            "Regular security audits and vulnerability testing",
            "Limited employee access on a need-to-know basis"
          ]
        },
        {
          subtitle: "Data Storage",
          items: [
            "Customer data stored on secure, encrypted servers",
            "Regular backups with secure, offsite storage",
            "Automatic data purging of inactive accounts after 7 years"
          ]
        }
      ]
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: <Eye className="w-5 h-5" />,
      content: [
        {
          subtitle: "Access and Control",
          items: [
            "View and download your personal data through your account",
            "Update or correct your information at any time",
            "Request deletion of your account and associated data"
          ]
        },
        {
          subtitle: "Communication Preferences",
          items: [
            "Opt out of marketing emails (order emails will continue)",
            "Adjust notification preferences in your account settings",
            "Control cookie preferences through browser settings"
          ]
        }
      ]
    },
    {
      id: "cannabis-specific",
      title: "Cannabis-Specific Privacy",
      icon: <Calendar className="w-5 h-5" />,
      content: [
        {
          subtitle: "Discretion and Confidentiality",
          items: [
            "All packages shipped in discreet, unmarked packaging",
            "No external indication of cannabis-related contents",
            "Customer information kept confidential from unauthorized parties"
          ]
        },
        {
          subtitle: "Regulatory Compliance",
          items: [
            "Purchase records maintained as required by state law",
            "Age verification data securely stored for compliance",
            "Cooperation with authorized regulatory inspections only"
          ]
        }
      ]
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how THCA Store collects, uses, and protects your personal information.
          </p>
          <Badge variant="outline" className="mt-4 text-green-400 border-green-400">
            Last Updated: {lastUpdated}
          </Badge>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="glass-dark border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Table of Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section, index) => (
                  <motion.a
                    key={section.id}
                    href={`#${section.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="text-green-400 group-hover:text-green-300 transition-colors">
                      {section.icon}
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {section.title}
                    </span>
                  </motion.a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + sectionIndex * 0.1 }}
            >
              <Card className="glass-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-3 text-2xl">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.content.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h4 className="text-xl font-semibold text-white mb-3">
                        {subsection.subtitle}
                      </h4>
                      <ul className="space-y-2">
                        {subsection.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3 text-gray-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {subIndex < section.content.length - 1 && (
                        <Separator className="mt-4 bg-gray-700" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card className="glass-dark border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-3">
                <UserCheck className="w-5 h-5" />
                Contact Us About Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                If you have questions about this privacy policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>Email:</strong> privacy@thcastore.com</p>
                <p><strong>Phone:</strong> (555) 123-THCA ext. 2</p>
                <p><strong>Mail:</strong> THCA Store Privacy Officer, 123 Cannabis Ave, Suite 420, Denver, CO 80202</p>
              </div>
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 font-semibold mb-2">Your Privacy Matters</p>
                <p className="text-gray-300 text-sm">
                  We are committed to protecting your privacy and maintaining the confidentiality of your cannabis purchases. 
                  This policy will be updated as needed to reflect changes in our practices or legal requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}