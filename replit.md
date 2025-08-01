# THCA Store

## Overview
THCA Store is a full-stack eCommerce web application for reselling legal hemp-derived THCA products. It provides a modern, responsive platform for product display, user authentication, shopping cart functionality, and admin management, aiming to be a specialized online retail destination for THCA products.

## Recent Changes
- **August 1, 2025**: Replaced all cannabis references with hemp throughout the entire codebase for consistent branding and messaging. Updated CSS classes, component references, AI content, viral marketing materials, and all text content to use "hemp" terminology instead of "cannabis".

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