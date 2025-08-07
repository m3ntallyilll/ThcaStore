import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AIChat } from "@/components/ai/ai-chat";
import { ReferralBanner } from "@/components/referral/referral-banner";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";


// Layout Components
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import Cart from "@/pages/cart";
import Checkout from './pages/checkout';
import OrderConfirmation from './pages/order-confirmation';
import Admin from "@/pages/admin";
import Rewards from "@/pages/rewards";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import AISalesPage from "@/pages/ai-sales";
import { DailyDealsPage } from "@/pages/daily-deals";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Returns from "@/pages/returns";
import NotFound from "@/pages/not-found";
import StateTHCA from "@/pages/state-thca";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/blog" component={Blog} />
      <Route path="/ai-sales" component={AISalesPage} />
      <Route path="/daily-deals" component={DailyDealsPage} />
      <Route path="/returns" component={Returns} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/thca/:state" component={StateTHCA} />
      <Route path="/thca" component={StateTHCA} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const { fetchCart } = useCart();
  
  useEffect(() => {
    const hasAccepted = localStorage.getItem('thca-disclaimer-accepted');
    setDisclaimerAccepted(!!hasAccepted);
    
    // Initialize cart on app load to ensure persistence
    fetchCart();
  }, [fetchCart]);
  
  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="relative z-10 bg-black/20 backdrop-blur-[1px]">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
      
      {/* Global AI Customer Service Assistant */}
      <AIChat 
        autoOpen={false}
        onProductRecommendation={(productId) => {
          console.log('AI Product recommendation:', productId);
        }}
        onOfferSuggestion={(offer) => {
          console.log('AI Offer suggestion:', offer);
        }}
      />
      
      {/* Global Referral Detection Banner */}
      <ReferralBanner className="fixed top-20 left-4 right-4 z-40" compact />
      
      {/* Legal Disclaimer Modal */}
      {!disclaimerAccepted && (
        <LegalDisclaimer 
          onAccept={() => setDisclaimerAccepted(true)}
          onDecline={() => window.location.href = 'https://google.com'}
        />
      )}
    </div>
  );
}

function App() {
  // Google Analytics is now loaded directly in index.html
  useEffect(() => {
    console.log('✓ Google Analytics loaded with ID: G-J8CL11FFW2');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;