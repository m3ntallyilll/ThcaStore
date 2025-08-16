import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-gray-500" />
            {item.current ? (
              <span className="text-white font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {/* Schema.org Breadcrumb Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://mentally-chill.online"
            },
            ...items.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 2,
              "name": item.label,
              "item": `https://mentally-chill.online${item.href}`
            }))
          ]
        })}
      </script>
    </nav>
  );
}