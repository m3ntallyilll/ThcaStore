import { motion } from 'framer-motion';

interface SkipLinksProps {
  links?: Array<{
    href: string;
    label: string;
  }>;
}

const defaultLinks = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' },
  { href: '#search', label: 'Skip to search' },
];

export function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  return (
    <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 z-[9999] bg-white border-2 border-black p-2 m-2 rounded shadow-lg">
        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const target = document.querySelector(link.href);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      // Focus the target element if it's focusable
                      if (target instanceof HTMLElement) {
                        target.focus();
                      }
                    }
                  }
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}