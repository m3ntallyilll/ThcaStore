import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

// Layout Components
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { ToastProvider } from "@/components/ui/toast-provider";
import { AIChat } from "@/components/ai/ai-chat";
import { AISupport } from "@/components/support/ai-support";

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import Checkout from './pages/checkout';
import Admin from "@/pages/admin";
import Rewards from "@/pages/rewards";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import AISalesPage from "@/pages/ai-sales";
import { DailyDealsPage } from "@/pages/daily-deals";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import NotFound from "@/pages/not-found";

// Hooks
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

function AppContent() {
  const { checkAuth, user } = useAuth();
  const isAuthenticated = !!user;
  const { fetchCart } = useCart();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navigation />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/rewards" component={Rewards} />
          <Route path="/blog/:id" component={BlogPost} />
          <Route path="/blog" component={Blog} />
          <Route path="/ai-sales" component={AISalesPage} />
          <Route path="/daily-deals" component={DailyDealsPage} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <CartSidebar />
      <AIChat autoOpen={true} />
      <AISupport />
      <ToastProvider />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;