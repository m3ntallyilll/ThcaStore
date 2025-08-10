import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MessageCircle, Clock, MapPin, Headphones } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Contact Mentally Chill - Customer Support & THCA Product Help</title>
        <meta 
          name="description" 
          content="Contact Mentally Chill for THCA product questions, customer support, or wholesale inquiries. Call (702) 482-9794 or email support@mentally-chill.com." 
        />
        <meta property="og:title" content="Contact Mentally Chill - THCA Customer Support" />
        <meta property="og:description" content="Get in touch with our THCA experts for product questions, support, and wholesale opportunities. Fast, friendly customer service." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="contact mentally chill, THCA customer support, cannabis help, hemp product questions, wholesale THCA" />
      </Helmet>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Have questions about our THCA products? Need support with your order? We're here to help!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-400/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-green-400 text-green-400">
                    📞 (702) 482-9794
                  </Badge>
                </div>
                <p className="text-gray-300">Call us for immediate assistance with orders, products, or general questions.</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  Monday - Friday: 9 AM - 7 PM PST
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-400/20">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-blue-400 text-blue-400">
                    📧 support@mentally-chill.com
                  </Badge>
                </div>
                <p className="text-gray-300">Email us for detailed questions, order tracking, or product recommendations.</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  Response within 24 hours
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-400/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-300">Use our AI-powered chat assistant for instant help with products and orders.</p>
                <Button 
                  variant="outline" 
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
                  onClick={() => {
                    // This would trigger the AI chat modal
                    const aiChatTrigger = document.querySelector('[data-testid="ai-chat-trigger"]') as HTMLElement;
                    aiChatTrigger?.click();
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Contact Methods */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-gray-900/50 border-yellow-400/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-yellow-400 text-lg flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  Wholesale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-2">Interested in bulk orders?</p>
                <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs">
                  wholesale@mentally-chill.com
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-orange-400/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-400 text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-2">Nationwide shipping available</p>
                <Badge variant="outline" className="border-orange-400 text-orange-400 text-xs">
                  Fast & Discreet
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="bg-gray-900/50 border-green-400/20">
          <CardHeader>
            <CardTitle className="text-green-400">Send Us a Message</CardTitle>
            <p className="text-gray-400">Fill out the form below and we'll get back to you soon.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    data-testid="input-first-name"
                    className="bg-black/50 border-gray-600 focus:border-green-400" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    data-testid="input-last-name"
                    className="bg-black/50 border-gray-600 focus:border-green-400" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  data-testid="input-email"
                  className="bg-black/50 border-gray-600 focus:border-green-400" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  data-testid="input-phone"
                  className="bg-black/50 border-gray-600 focus:border-green-400" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  data-testid="input-subject"
                  className="bg-black/50 border-gray-600 focus:border-green-400" 
                  placeholder="How can we help you?"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  data-testid="textarea-message"
                  className="bg-black/50 border-gray-600 focus:border-green-400 min-h-[120px]" 
                  placeholder="Tell us about your question, order, or how we can assist you..."
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                data-testid="button-submit-contact"
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-12 bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-600/20">
        <CardHeader>
          <CardTitle className="text-center text-blue-400">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-400 mb-2">How long does shipping take?</h4>
              <p className="text-gray-300 text-sm">Standard shipping: 5-7 business days. Express shipping: 2-3 business days.</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-300 text-sm">We accept Cash App payments for fast, secure transactions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Do you ship to my state?</h4>
              <p className="text-gray-300 text-sm">We ship to states where THCA products are legal. Check our shipping policy for details.</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">How can I track my order?</h4>
              <p className="text-gray-300 text-sm">You'll receive tracking information via email once your order ships.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}