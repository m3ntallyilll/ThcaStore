import { Link } from 'wouter';

export function Navigation() {
  return (
    <nav id="navigation" className="fixed top-0 w-full z-50 glass-dark border-b border-glow-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-display font-bold text-glow-green-400 glow-effect">
              THCA Store
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/products" className="hover:text-glow-green-400 transition-colors duration-300">
                Products
              </Link>
              <Link href="/blog" className="hover:text-glow-green-400 transition-colors duration-300">
                Blog
              </Link>
              <Link href="/daily-deals" className="hover:text-glow-green-400 transition-colors duration-300">
                Daily Deals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}