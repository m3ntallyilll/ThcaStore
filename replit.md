# THCA Store

## Overview
THCA Store is a full-stack eCommerce web application designed for reselling legal hemp-derived THCA products. Its core purpose is to provide a modern, responsive platform for product display, secure user authentication, efficient shopping cart functionality, and comprehensive administrative management. The project aims to establish itself as a specialized and leading online retail destination for THCA products, offering a seamless shopping experience.

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
The application utilizes a monorepo structure, ensuring clear separation of client, server, and shared code. This design facilitates type safety across the entire stack via a shared schema. Drizzle ORM was specifically chosen for its capabilities in providing type-safe database operations.

### Key Components
- **Database Schema**: Includes entities for Users, Products, Cart Items, Orders, and Order Items.
- **Authentication System**: Features JWT-based authentication, role-based access control, secure password hashing, and protected routes.
- **Product Management**: Offers a comprehensive product catalog with categorization, search, filtering, real-time stock management, and THCA-specific metadata.
- **Shopping Cart**: Provides real-time cart management with persistent state and dynamic quantity updates.
- **Admin Dashboard**: Enables CRUD operations for products, order management, user administration, and sales analytics.
- **AI-Powered Blog Management System**: Full infrastructure supporting blog posts, categories, tags, and SEO, with AI content generation capabilities. Features professional typography, proper formatting for links/bold text/paragraphs, and automated SVG image generation with THCA Store branding.
- **Dual AI Assistant System**: Features distinct customer support and sales AI assistants, offering intelligent support and integrating with a knowledge base. Updated cart functionality to automatically redirect to checkout when items are added.
- **State-Based Purchase Restrictions**: Implements a system to prevent orders from states where THCA products are prohibited.
- **Automated Referral System**: Complete referral system with automatic code generation for all users (new and existing), 10% store credit commission for referrers, 20% discount for referees, and active shareable referral links. Features bulk admin generation and seamless URL parameter processing.
- **Viral Marketing System**: A complete arsenal of viral content tailored for platforms like TikTok, Instagram, Reddit, and Twitter, designed for automated deployment and viral spread.
- **AI-Enhanced SEO System**: Leverages AI for automated metadata generation, intelligent internal link pyramids, schema markup automation, and comprehensive SEO health analysis.
- **Dynamic Discount System**: Incorporates attention-grabbing popups with animated price slashes, countdown timers, rotating offers, and cart integration to display savings.
- **Legal Disclaimer System**: Features an interactive multi-section modal for age verification, legal compliance, product safety warnings, and FDA disclaimers, with one-click acceptance and persistent storage.
- **Social Sharing System**: Comprehensive social media integration with pot leaf logo branding across Facebook, Twitter, Reddit, WhatsApp, Telegram, and LinkedIn. Features floating share buttons with pulse animations and branded messaging.
- **Complete Store Credit System**: Full-featured store credit implementation with points-to-credit conversion (100 points = $1), checkout integration, transaction history, referral bonus redemption, and automated webhook processing for seamless credit management.
- **Comprehensive Blog Content Backup System**: Automated backup system preserving all AI-generated blog content including SEO blogs, location-based content, viral content strategy, and state-specific materials with daily backup manifests.

### Data Flow
- **Client-Server Communication**: Utilizes TanStack Query for API requests, JWT validation for secure communication, Drizzle ORM for database interactions, and JSON for responses.
- **State Management**: Zustand is used for managing authentication and cart state, TanStack Query for product data, and React Hook Form for local form state.
- **User Journey**: Encompasses browsing products, user authentication, adding items to the cart, proceeding to checkout, and administrative management functions.

## External Dependencies

### UI Components
- **Radix UI**: Provides headless UI primitives.
- **shadcn/ui**: A comprehensive component library.
- **Lucide React**: Supplies an icon library.

### Database & Backend
- **Neon**: Serves as the serverless PostgreSQL hosting solution.
- **Drizzle**: The chosen type-safe ORM.
- **bcryptjs**: Used for password hashing.
- **jsonwebtoken**: Implements JWT functionality.
- **Groq API**: Utilized for AI content generation and enabling deal activations.

### Third-Party Services
- **Google Analytics**: Integrated for website traffic tracking.
- **Pexels, Pixabay**: Sources for imagery used within the application.