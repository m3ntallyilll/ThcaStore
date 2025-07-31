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

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import Checkout from './pages/checkout';
import Admin from "@/pages/admin";
import Rewards from "@/pages/rewards";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";

// Hooks
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

function AppContent() {
  const { checkAuth, isAuthenticated } = useAuth();
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
          <Route path="/blog" component={Blog} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <CartSidebar />
      <AIChat autoOpen={true} />
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