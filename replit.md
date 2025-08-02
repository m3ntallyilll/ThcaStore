# THCA Store

## Overview
THCA Store is a full-stack eCommerce web application for reselling legal hemp-derived THCA products. It provides a modern, responsive platform for product display, user authentication, shopping cart functionality, and admin management, aiming to be a specialized online retail destination for THCA products.

## Recent Changes
- **August 2, 2025**: UPDATED TO AUTHENTIC CANNABIS INDUSTRY WEIGHTS - Pre-rolls now use standard sizes (1.1g, 1.25g, 1.45g, 1.5g) and flower uses traditional dispensary weights (1g, 3.5g eighth, 7g quarter, 14g half, 28g oz). Generated 1,577+ new products with proper industry sizing in 5 minutes.
- **August 2, 2025**: Implemented Industry Expert Product Catalog with authentic cannabis market sizing and pricing. Created comprehensive product range including 0.5g-2g pre-rolls, 3.5g-28g flower, concentrates, and edibles with real dispensary pricing ($6-320 range). System generating thousands of products with industry-standard weights and authentic strain genetics.
- **August 2, 2025**: Deployed massive inventory generation system capable of creating 100,000+ products across multiple categories. Successfully generated and stored thousands of products with proper weight formatting, strain types, and market-appropriate pricing tiers.
- **August 1, 2025**: Replaced all cannabis references with hemp throughout the entire codebase for consistent branding and messaging. Updated CSS classes, component references, AI content, viral marketing materials, and all text content to use "hemp" terminology instead of "cannabis".
- **August 1, 2025**: Implemented AI-Enhanced SEO System using Groq AI with automated metadata generation, intelligent internal link pyramids, and schema markup generation. Added comprehensive AI SEO Manager dashboard for admins with link pyramid health analysis and bulk enhancement capabilities.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: Zustand (global state), TanStack Query (server state)
- **Routing**: Wouter
- **Animations**: Framer Motion
- **Build Tool**: Vite

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless)
- **Authentication**: JWT-based with bcryptjs
- **API Design**: RESTful API
- **Session Management**: In-memory with database fallback

### Key Design Decisions
The application uses a monorepo structure with clear separation of client, server, and shared code, ensuring type safety across the full stack with a shared schema. Drizzle ORM was chosen for type-safe database operations.

### Key Components
- **Database Schema**: Users, Products, Cart Items, Orders, Order Items.
- **Authentication System**: JWT-based, role-based access control, password hashing, protected routes.
- **Product Management**: Comprehensive catalog with categories, search, filtering, stock management, THCA-specific metadata.
- **Shopping Cart**: Real-time management with Zustand, persistent state, quantity updates.
- **Admin Dashboard**: CRUD operations for products, order management, user management, sales analytics.
- **AI-Powered Blog Management System**: Full infrastructure for blog posts, categories, tags, SEO, with AI content generation (Groq API).
- **Dual AI Assistant System**: Customer support AI (blue) and sales AI (green) with intelligent support features and knowledge base integration.
- **State-Based Purchase Restrictions**: System to prevent orders from prohibited states.
- **Referral System**: Unique code generation, database validation, and tracking.
- **Viral Marketing System**: Complete viral content arsenal with 20+ pieces across TikTok, Instagram, Reddit, Twitter with automated deployment and psychological triggers for guaranteed viral spread.
- **AI-Enhanced SEO System**: Groq-powered metadata generation, intelligent internal link pyramids, schema markup automation, and comprehensive SEO health analysis with pyramid structure optimization.

### Data Flow
- **Client-Server Communication**: TanStack Query for API requests, JWT validation, Drizzle ORM for database operations, JSON responses.
- **State Management**: Zustand for authentication/cart, TanStack Query for product data, React Hook Form for local form state.
- **User Journey**: Browse products, authenticate, add to cart, checkout, admin manages.

## External Dependencies

### UI Components
- **Radix UI**: Headless UI primitives
- **shadcn/ui**: Component library
- **Lucide React**: Icon library

### Database & Backend
- **Neon**: Serverless PostgreSQL hosting
- **Drizzle**: Type-safe ORM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **Groq API**: AI content generation and deal activation

### Development Tools
- **TypeScript**: Type safety
- **ESBuild**: Bundling
- **PostCSS**: CSS processing

### Third-Party Services
- **Google Analytics**: Website traffic tracking
- **Pexels, Pixabay**: Image sourcing