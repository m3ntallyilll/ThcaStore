import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { User, ShoppingCart, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { AuthModal } from '../auth/auth-modal';
import logoImage from '@/assets/BCO.a2a7308e-9352-45a2-b06b-e37fac50f394_1753959647149.png';

export function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { toggleCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-glow-green-500/20" style={{ position: 'fixed', transform: 'translateZ(0)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-display font-bold text-glow-green-400 glow-effect">
                <img src={logoImage} alt="THCA Store Logo" className="inline w-8 h-8 mr-2" />
                THCA Store
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/products" className="hover:text-glow-green-400 transition-colors duration-300">
                  Products
                </Link>
                <Link href="/blog" className="hover:text-glow-green-400 transition-colors duration-300">
                  Blog
                </Link>
                <Link href="/daily-deals" className="hover:text-glow-green-400 transition-colors duration-300 flex items-center gap-1">
                  <span className="text-xs bg-red-600 px-2 py-1 rounded animate-pulse">HOT</span>
                  Daily Deals
                </Link>
                {user?.isAdmin && (
                  <Link href="/ai-sales" className="hover:text-glow-green-400 transition-colors duration-300 flex items-center gap-1">
                    <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI</span>
                    Sales Strategy
                  </Link>
                )}
                <Link href="/rewards" className="hover:text-glow-green-400 transition-colors duration-300">
                  Rewards
                </Link>
                <a href="#about" className="hover:text-glow-green-400 transition-colors duration-300">
                  About
                </a>
                <Link href="/returns" className="hover:text-glow-green-400 transition-colors duration-300">
                  Returns
                </Link>
                <a href="#contact" className="hover:text-glow-green-400 transition-colors duration-300">
                  Contact
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <span className="text-sm text-gray-300">
                  Welcome, {user?.firstName || user?.username}
                </span>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => openAuthModal('login')}
                  className="hover:text-glow-green-400 transition-colors duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={toggleCart}
                className="relative hover:text-glow-green-400 transition-colors duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-glow-green-500 text-black rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold glow-effect">
                    {totalItems}
                  </span>
                )}
              </Button>

              {user?.isAdmin && (
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    className="text-hemp hover:text-hemp-300 transition-colors duration-300"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-700 py-4">
              <div className="flex flex-col space-y-2">
                <Link
                  href="/products"
                  className="block px-3 py-2 hover:text-glow-green-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/blog"
                  className="block px-3 py-2 hover:text-glow-green-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/daily-deals"
                  className="block px-3 py-2 hover:text-glow-green-400 transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xs bg-red-600 px-2 py-1 rounded animate-pulse">HOT</span>
                  Daily Deals
                </Link>
                {user?.isAdmin && (
                  <Link
                    href="/ai-sales"
                    className="block px-3 py-2 hover:text-glow-green-400 transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI</span>
                    Sales Strategy
                  </Link>
                )}
                <Link
                  href="/rewards"
                  className="block px-3 py-2 hover:text-glow-green-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rewards
                </Link>
                <a
                  href="#about"
                  className="block px-3 py-2 hover:text-glow-green-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <Link
                  href="/returns"
                  className="block px-3 py-2 hover:text-glow-green-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Returns
                </Link>
                <a
                  href="#contact"
                  className="block px-3 py-2 hover:text-glow-green-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </>
  );
}
