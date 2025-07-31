# THCA Store

## Overview

THCA Store is a full-stack eCommerce web application designed specifically for reselling THCA (hemp) products. We are a THCA reseller, not growers, specializing exclusively in legal hemp-derived THCA products. It's a modern, responsive platform built with React and Express.js, featuring user authentication, product management, shopping cart functionality, and an admin dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand for global state (authentication, cart)
- **Data Fetching**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for UI animations
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: JWT-based authentication with bcryptjs for password hashing
- **API Design**: RESTful API with JSON responses
- **Session Management**: In-memory storage with fallback to database sessions

### Key Design Decisions
The application uses a monorepo structure with clear separation between client, server, and shared code. The shared schema ensures type safety across the full stack. The choice of Drizzle ORM provides type-safe database operations while maintaining flexibility for complex queries.

## Key Components

### Database Schema
- **Users**: Authentication and profile management with admin role support
- **Products**: Full product catalog with categories, pricing, stock, and THCA-specific fields
- **Cart Items**: Shopping cart functionality with user association
- **Orders**: Order management with status tracking and detailed order items
- **Order Items**: Individual items within orders with product references

### Authentication System
- JWT-based authentication with secure token management
- Role-based access control (admin/user)
- Password hashing with bcryptjs
- Protected routes and middleware

### Product Management
- Comprehensive product catalog with categories (flower, concentrates, edibles, accessories)
- Product search and filtering capabilities
- Featured products system
- Stock management
- THCA-specific metadata (content percentage, strain types, effects)

### Shopping Cart
- Real-time cart management with Zustand
- Persistent cart state for authenticated users
- Quantity updates and item removal
- Cart sidebar with immediate access

### Admin Dashboard
- Product management (CRUD operations)
- Order management and status updates
- User management
- Sales analytics and reporting

## Data Flow

### Client-Server Communication
1. Client makes API requests using TanStack Query
2. Server validates JWT tokens for protected routes
3. Database operations through Drizzle ORM
4. Responses formatted as JSON with consistent error handling

### State Management Flow
1. Authentication state managed globally with Zustand
2. Cart state synced between client and server
3. Product data cached with TanStack Query
4. Form state managed locally with React Hook Form

### User Journey
1. User browses products (public)
2. User registers/logs in for cart functionality
3. User adds items to cart (persisted)
4. User proceeds to checkout
5. Admin manages orders and products

## External Dependencies

### UI Components
- **Radix UI**: Headless UI primitives for accessibility
- **shadcn/ui**: Pre-built component library built on Radix
- **Lucide React**: Icon library for consistent iconography

### Database & Backend
- **Neon**: Serverless PostgreSQL hosting
- **Drizzle**: Type-safe ORM with PostgreSQL dialect
- **bcryptjs**: Password hashing for security
- **jsonwebtoken**: JWT implementation for authentication

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS

## Deployment Strategy

### Production Build Process
1. Frontend built with Vite to static assets
2. Backend bundled with ESBuild for Node.js runtime
3. Database migrations handled by Drizzle Kit
4. Environment variables for database connection and JWT secrets

### Environment Configuration
- Development: Local development server with hot reloading
- Production: Optimized builds with static asset serving
- Database: Connection string via DATABASE_URL environment variable

### Scaling Considerations
- Stateless server design for horizontal scaling
- Database connection pooling through Neon
- Static asset serving optimized for CDN deployment
- JWT tokens eliminate server-side session storage

The application is designed to be easily deployable on platforms like Replit, Vercel, or traditional hosting providers, with minimal configuration required for production deployment.

## Recent Changes

### AI-Powered Blog Management System Complete (January 2025)
✓ **Comprehensive Blog Infrastructure**: Full database schema with blog posts, categories, tags, and SEO metadata
✓ **AI Content Generation**: Integrated Groq API for automated, SEO-optimized blog post creation
✓ **Admin Blog Interface**: Complete CRUD operations with advanced editing capabilities
✓ **AI-Enhanced Features**: Blog idea generation, content improvement, and intelligent SEO optimization
✓ **User Blog Experience**: Public blog viewing page with search, filtering, and category organization
✓ **Database Integration**: Successfully migrated blog schema and storage methods

### AI Assistant Admin Integration Complete (January 2025)
✓ **Admin Context Recognition**: AI assistant automatically identifies admin users and provides enhanced capabilities
✓ **Product Management**: AI can create, update, and manage products through natural conversation
✓ **Admin-Specific Features**: Specialized greeting messages and management-focused responses
✓ **Real-time Integration**: AI changes automatically refresh admin dashboard data

### Contact Page & Referral System Complete (January 2025)
✓ **Complete Contact Section**: Added comprehensive contact page with contact information, business hours, and functional contact form
✓ **Interactive Contact Form**: Form includes validation, toast notifications, and proper form handling with required fields
✓ **Contact Information Display**: Phone, email, address, and business hours prominently displayed with glowing green theme
✓ **Referral System Verification**: Confirmed referral program only pays rewards after successful purchase completion
✓ **Purchase-Based Rewards**: Referral rewards are triggered by `completeReferral()` function with `firstOrderId` parameter

### Dual AI Assistant System Complete (January 2025)
✓ **Comprehensive Customer Support AI**: Blue-themed AI assistant (bottom left) for customer service and issue resolution
✓ **Enhanced Sales AI**: Green-themed AI assistant (bottom right) with improved styling and cannabis branding
✓ **Intelligent Support Features**: Category selection, priority handling, automatic escalation, and feedback system
✓ **Knowledge Base Integration**: Support AI handles orders, products, shipping, payments, and account issues
✓ **Empathy and Context**: Advanced conversation awareness with frustrated customer detection and escalation

### Application Polish & Legal Pages Complete (January 2025)
✓ **Privacy Policy**: Comprehensive privacy policy with cannabis-specific sections and table of contents
✓ **Terms of Service**: Complete terms of service with legal disclaimers and age verification requirements
✓ **Enhanced Navigation**: Updated footer with proper links to legal pages and policies
✓ **Performance Optimizations**: Added CSS enhancements, GPU acceleration, and accessibility improvements
✓ **SEO Improvements**: Enhanced meta descriptions, structured content, and cannabis-compliant information

### Returns & Refunds System Complete (January 2025)
✓ **Comprehensive Returns Interface**: Multi-step return process with order selection, item selection, and detailed return forms
✓ **Return Request Management**: Complete system for tracking return status, refund processing, and customer communication
✓ **Insurance-Required Policy**: Returns only available for orders with shipping insurance protection
✓ **Hemp THCA-Specific Policy**: 30-day return window with unopened packaging requirements and insurance verification
✓ **Order Integration**: Seamless integration with existing order system for return eligibility and insurance tracking
✓ **Enhanced Navigation**: Added returns links to main navigation and footer for easy customer access

### Business Model Update (January 2025)
✓ **THCA Reseller Clarification**: Updated all content to reflect business as THCA reseller, not grower
✓ **Hemp-Only Focus**: Clarified that store sells only hemp-derived THCA products, not cannabis
✓ **Legal Compliance**: Updated SEO tags, descriptions, and documentation for hemp product compliance
✓ **Brand Consistency**: Ensured all messaging reflects hemp THCA reseller business model

### State-Based Purchase Restrictions Complete (January 2025)
✓ **Prohibited States System**: Implemented comprehensive state restriction system for hemp THCA products
✓ **State Validation API**: Created backend endpoints for state restrictions and available states
✓ **Checkout State Blocking**: Updated checkout process to prevent orders from prohibited states (ID, KS, SD, WY)
✓ **Real-time Validation**: Added live state validation with error messages and visual feedback
✓ **Legal Compliance**: Ensures business compliance with state-specific hemp THCA regulations
✓ **User Experience**: Clear error messages explain why certain states cannot receive shipments

### Admin-Only Features Security Complete (January 2025)
✓ **AI Sales Strategy Access**: Restricted AI Sales Strategy page to admin users only with proper authentication
✓ **Admin Route Protection**: Created AdminRoute component to protect sensitive admin-only pages
✓ **Navigation Security**: AI Sales Strategy navigation link only visible to admin users
✓ **Access Denied UI**: Clear access denied messaging for non-admin users attempting to access restricted content
✓ **Mobile Navigation**: Admin-only links properly hidden in mobile navigation menu

### Google Search Engine Integration Complete (January 2025)
✓ **Google Analytics Setup**: Integrated Google Analytics (G-J8CL11FFW2) directly in HTML head for accurate visitor tracking
✓ **SEO Meta Tags**: Comprehensive meta tags including title, description, keywords, and Open Graph tags for social sharing
✓ **Hemp THCA Optimization**: Keywords optimized for hemp-derived THCA products and legal compliance
✓ **Page View Tracking**: Automatic tracking of page views across all routes for analytics insights
✓ **Search Engine Visibility**: Robots meta tag allows search engine indexing with proper hemp product categorization
✓ **Professional Images**: All product images sourced from Pexels and Pixabay for authentic hemp flower photography