import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'wouter';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-400 mb-8 ${className}`} aria-label="Breadcrumb">
      <Link href="/">
        <a className="flex items-center hover:text-emerald-400 transition-colors">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </a>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.href ? (
            <Link href={item.href}>
              <a className="hover:text-emerald-400 transition-colors">
                {item.label}
              </a>
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Pre-built breadcrumb configurations
export const BreadcrumbConfigs = {
  THCAGuide: [
    { label: "Education", href: "/ultimate-thca-guide-2025" },
    { label: "Ultimate THCA Guide 2025" }
  ],
  
  THCABenefits: [
    { label: "Education", href: "/ultimate-thca-guide-2025" },
    { label: "THCA Benefits" }
  ],
  
  THCALegal: [
    { label: "Education", href: "/ultimate-thca-guide-2025" },
    { label: "THCA Legal Status" }
  ],
  
  THCAVsTHC: [
    { label: "Education", href: "/ultimate-thca-guide-2025" },
    { label: "THCA vs THC" }
  ],
  
  THCADosage: [
    { label: "Education", href: "/ultimate-thca-guide-2025" },
    { label: "THCA Dosage Guide" }
  ],
  
  StateLegal: [
    { label: "Legal Information", href: "/is-thca-legal" },
    { label: "State-by-State Guide" }
  ],
  
  THCAFAQ: [
    { label: "Support", href: "/thca-faq" },
    { label: "THCA FAQ" }
  ],
  
  THCAReviews: [
    { label: "Reviews", href: "/thca-reviews-2025" },
    { label: "2025 Product Reviews" }
  ],
  
  BuyFlower: [
    { label: "Products", href: "/products" },
    { label: "THCA Flower" }
  ],
  
  PreRolls: [
    { label: "Products", href: "/products" },
    { label: "THCA Pre-Rolls" }
  ],
  
  CheapProducts: [
    { label: "Products", href: "/products" },
    { label: "Cheap THCA Products" }
  ]
};