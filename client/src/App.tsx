import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

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
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
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