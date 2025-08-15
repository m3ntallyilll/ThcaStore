import { Link } from 'wouter';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function InternalLink({ href, children, className = "", title }: InternalLinkProps) {
  return (
    <Link href={href}>
      <a className={`text-emerald-400 hover:text-emerald-300 underline transition-colors ${className}`} title={title}>
        {children}
      </a>
    </Link>
  );
}

// Pre-built internal link components for common pages
export const THCAEducationLinks = {
  UltimateGuide: ({ children = "Ultimate THCA Guide 2025", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/ultimate-thca-guide-2025" className={className} title="Complete THCA guide with expert insights">
      {children}
    </InternalLink>
  ),
  
  Benefits: ({ children = "THCA benefits", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/thca-benefits" className={className} title="Detailed information about THCA benefits">
      {children}
    </InternalLink>
  ),
  
  Legal: ({ children = "THCA legal status", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/is-thca-legal" className={className} title="Current THCA legality information">
      {children}
    </InternalLink>
  ),
  
  VSThc: ({ children = "THCA vs THC comparison", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/what-is-thca-vs-thc" className={className} title="Complete comparison between THCA and THC">
      {children}
    </InternalLink>
  ),
  
  Dosage: ({ children = "THCA dosage guide", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/thca-dosage-guide" className={className} title="Expert THCA dosage recommendations">
      {children}
    </InternalLink>
  ),
  
  StateGuide: ({ children = "state-by-state THCA legal guide", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/state-by-state-thca-legal" className={className} title="THCA legality in all 50 states">
      {children}
    </InternalLink>
  ),
  
  FAQ: ({ children = "THCA FAQ", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/thca-faq" className={className} title="Frequently asked questions about THCA">
      {children}
    </InternalLink>
  ),
  
  Reviews: ({ children = "THCA product reviews", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/thca-reviews-2025" className={className} title="Expert reviews of top THCA products">
      {children}
    </InternalLink>
  )
};

export const THCAProductLinks = {
  Flower: ({ children = "THCA flower", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/buy-thca-flower" className={className} title="Premium THCA flower products">
      {children}
    </InternalLink>
  ),
  
  PreRolls: ({ children = "THCA pre-rolls", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/thca-pre-rolls" className={className} title="Convenient THCA pre-rolled joints">
      {children}
    </InternalLink>
  ),
  
  Cheap: ({ children = "cheap THCA products", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/cheap-thca-products" className={className} title="Affordable THCA products with quality guarantee">
      {children}
    </InternalLink>
  ),
  
  AllProducts: ({ children = "all THCA products", className }: { children?: React.ReactNode; className?: string }) => (
    <InternalLink href="/products" className={className} title="Browse our complete THCA product catalog">
      {children}
    </InternalLink>
  )
};