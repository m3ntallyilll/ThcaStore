import { useState } from 'react';
import { Link } from 'wouter';
import { User, ShoppingCart, Settings, Menu, X, LogOut, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { AuthModal } from '../auth/auth-modal';
import { Badge } from '@/components/ui/badge';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { toggleCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav id="navigation" className="fixed top-0 w-full z-50 glass-dark border-b border-glow-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 text-2xl font-display font-bold text-glow-green-400 glow-effect">
                <Leaf className="w-8 h-8 text-green-400" />
                <span>THCA Store</span>
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
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">
                    Welcome, {user?.firstName || user?.username}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-white hover:text-red-400 hover:bg-gray-800"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  className="text-white hover:text-glow-green-400 hover:bg-gray-800"
                  data-testid="button-login"
                >
                  <User className="w-4 h-4 mr-2" />
                  Log In
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={toggleCart}
                className="relative border-glow-green-500 text-glow-green-400 hover:bg-glow-green-500 hover:text-white"
                data-testid="button-cart"
                title={totalItems > 0 ? `Cart (${totalItems} items) - Click to review and checkout` : "Cart (empty)"}
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-0 p-0">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {user?.isAdmin && (
                <Link href="/admin" className="text-glow-green-400 hover:text-glow-green-300">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-glow-green-400 hover:text-glow-green-300 hover:bg-gray-800"
                    data-testid="button-admin"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden text-white hover:text-glow-green-400"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-gray-700">
              <Link href="/products" className="block px-4 py-2 hover:text-glow-green-400 transition-colors">
                Products
              </Link>
              <Link href="/blog" className="block px-4 py-2 hover:text-glow-green-400 transition-colors">
                Blog
              </Link>
              <Link href="/daily-deals" className="block px-4 py-2 hover:text-glow-green-400 transition-colors">
                Daily Deals
              </Link>
              <Link href="/rewards" className="block px-4 py-2 hover:text-glow-green-400 transition-colors">
                Rewards
              </Link>
              {user?.isAdmin && (
                <Link href="/ai-sales" className="block px-4 py-2 hover:text-glow-green-400 transition-colors">
                  Sales Strategy
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 hover:text-red-400 transition-colors"
                  data-testid="button-mobile-logout"
                >
                  <LogOut className="w-4 h-4 mr-2 inline" />
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="block w-full text-left px-4 py-2 hover:text-glow-green-400 transition-colors"
                    data-testid="button-mobile-login"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="block w-full text-left px-4 py-2 hover:text-glow-green-400 transition-colors"
                    data-testid="button-mobile-register"
                  >
                    Sign Up
                  </button>
                </>
              )}
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