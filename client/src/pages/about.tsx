import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Shield, Award, Users, Zap, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>About Mentally Chill - Premium THCA Products & Cannabis Culture</title>
        <meta 
          name="description" 
          content="Learn about Mentally Chill, your trusted source for premium THCA products. Discover our mission, quality commitment, and dedication to cannabis culture and wellness." 
        />
        <meta property="og:title" content="About Mentally Chill - Premium THCA Products" />
        <meta property="og:description" content="Premium THCA products with exceptional quality and customer service. Learn about our mission and commitment to cannabis wellness." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="about mentally chill, THCA company, cannabis mission, hemp products, quality cannabis, THCA brand story" />
      </Helmet>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Leaf className="w-8 h-8 text-green-400" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            About Mentally Chill
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Your trusted destination for premium THCA products, exceptional quality, and authentic cannabis culture.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-400/20 mb-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-400">Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-gray-300 leading-relaxed">
            At Mentally Chill, we're dedicated to providing the highest quality THCA products while fostering a community 
            centered around wellness, education, and responsible cannabis use. We believe in the power of natural healing 
            and strive to make premium hemp-derived products accessible to everyone.
          </p>
        </CardContent>
      </Card>

      {/* Core Values */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gray-900/50 border-green-400/20 hover:border-green-400/40 transition-colors">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <CardTitle className="text-green-400">Quality Assurance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center">
              Every product undergoes rigorous testing to ensure purity, potency, and safety. We partner only with trusted growers and labs.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-400/20 hover:border-green-400/40 transition-colors">
          <CardHeader className="text-center">
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <CardTitle className="text-green-400">Premium Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center">
              From flower to concentrates, our curated selection features only the finest THCA products with exceptional terpene profiles.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-400/20 hover:border-green-400/40 transition-colors">
          <CardHeader className="text-center">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <CardTitle className="text-green-400">Community Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center">
              We're building a community of cannabis enthusiasts who value quality, education, and responsible consumption.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-400/20 hover:border-green-400/40 transition-colors">
          <CardHeader className="text-center">
            <Zap className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <CardTitle className="text-green-400">Fast Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center">
              Quick, discreet shipping to get your premium THCA products to you safely and efficiently.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-400/20 hover:border-green-400/40 transition-colors">
          <CardHeader className="text-center">
            <Heart className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <CardTitle className="text-green-400">Customer Care</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center">
              Our dedicated support team is here to help you find the perfect products for your wellness journey.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-400/20 hover:border-green-400/40 transition-colors">
          <CardHeader className="text-center">
            <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <CardTitle className="text-green-400">Natural Wellness</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center">
              We believe in the healing power of nature and are committed to promoting holistic wellness through cannabis.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Categories */}
      <Card className="bg-gray-900/50 border-green-400/20 mb-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-400">What We Offer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant="outline" className="border-green-400 text-green-400 mb-2">Premium Flower</Badge>
              <p className="text-sm text-gray-400">Hand-selected THCA flower strains</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="border-blue-400 text-blue-400 mb-2">Pre-Rolls</Badge>
              <p className="text-sm text-gray-400">Convenient, ready-to-smoke options</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="border-purple-400 text-purple-400 mb-2">Concentrates</Badge>
              <p className="text-sm text-gray-400">High-potency extracts and dabs</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="border-yellow-400 text-yellow-400 mb-2">Edibles</Badge>
              <p className="text-sm text-gray-400">Delicious THCA-infused treats</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-400/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-blue-400">Get In Touch</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-300 mb-4">
            Have questions about our products or need personalized recommendations? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Badge variant="outline" className="border-blue-400 text-blue-400">
              📞 (702) 482-9794
            </Badge>
            <Badge variant="outline" className="border-green-400 text-green-400">
              📧 support@mentally-chill.com
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}