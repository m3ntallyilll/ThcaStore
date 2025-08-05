import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
// Analytics tracking hook
const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  
  // Track page views using Google Analytics
  const trackPageView = (url: string) => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;
    
    const measurementId = "G-J8CL11FFW2";
    if (!measurementId) return;
    
    (window as any).gtag('config', measurementId, {
      page_path: url
    });
  };
  
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      trackPageView(location);
      prevLocationRef.current = location;
    }
  }, [location]);
};

// Layout Components
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { ToastProvider } from "@/components/ui/toast-provider";
import { AIChat } from "@/components/ai/ai-chat";
import { AISupport } from "@/components/support/ai-support";
import { SkipLinks } from "@/components/accessibility/skip-links";

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import Cart from "@/pages/cart";
import Checkout from './pages/checkout';
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

// Hooks
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useDiscountPopup } from "@/hooks/use-discount-popup";

// Discount Components  
import { DiscountPopup } from "@/components/ui/discount-popup";
import { FloatingDiscountBanner } from "@/components/ui/floating-discount-banner";
import { SmokeBackground } from "@/components/ui/smoke-background";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/blog" component={Blog} />
      <Route path="/ai-sales" component={AISalesPage} />
      <Route path="/daily-deals" component={DailyDealsPage} />
      <Route path="/returns" component={Returns} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { checkAuth, user } = useAuth();
  const isAuthenticated = !!user;
  const { fetchCart } = useCart();
  const { showPopup, currentDiscount, closePopup, applyDiscount, clearDiscount } = useDiscountPopup();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Handle AI product recommendations by linking to actual products
  const handleProductRecommendation = (productIdentifier: string) => {
    // Navigate to products page with the product highlighted
    setLocation('/products');
    
    // Scroll to product after navigation (wait for page to load) 
    setTimeout(() => {
      // Try by product ID first, then by product name
      let productElement = document.querySelector(`[data-product-id="${productIdentifier}"]`);
      
      // If not found by ID, try to find by product name
      if (!productElement) {
        productElement = document.querySelector(`[data-product-name="${productIdentifier}"]`);
      }
      
      // If still not found, try partial name match
      if (!productElement) {
        const allProductElements = document.querySelectorAll('[data-product-name]');
        for (const element of allProductElements) {
          const productName = element.getAttribute('data-product-name');
          if (productName && productName.toLowerCase().includes(productIdentifier.toLowerCase())) {
            productElement = element;
            break;
          }
        }
      }
      
      if (productElement) {
        productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        productElement.classList.add('ring-2', 'ring-gold', 'ring-opacity-75');
        setTimeout(() => {
          productElement.classList.remove('ring-2', 'ring-gold', 'ring-opacity-75');
        }, 3000);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <SmokeBackground />
      <div className="relative z-10 bg-black/20 backdrop-blur-[1px]">
        <SkipLinks />
        <Navigation />
        <main id="main-content" tabIndex={-1}>
          <Router />
        </main>
        <Footer />
      </div>
      <CartSidebar />
      <AIChat 
        autoOpen={true} 
        onProductRecommendation={handleProductRecommendation}
      />
      <AISupport />
      <ToastProvider />
      
      {/* Discount Features */}
      <DiscountPopup 
        isOpen={showPopup}
        onClose={closePopup}
        onApplyDiscount={applyDiscount}
      />
      {currentDiscount && (
        <FloatingDiscountBanner 
          discount={currentDiscount}
          onClear={clearDiscount}
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
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;