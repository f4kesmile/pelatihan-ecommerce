# my-ecommerce

A premium, modern, and high-performance e-commerce platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Supabase**, and **Prisma**. This project provides a complete solution for both public-facing storefronts and comprehensive administrative management.

## 🚀 Technology Stack

### Core Frameworks

- **Next.js 16 (App Router)**: Utilizing Server Components, Server Actions, and Turbopack.
- **TypeScript**: Full type safety across the entire application.
- **Tailwind CSS**: Modern utility-first styling with custom responsive scales.

### Backend & Database

- **Supabase**: Handles Authentication, Middleware, and Session Management.
- **Prisma ORM**: Type-safe database interactions with PostgreSQL.
- **PostgreSQL**: Robust relational database for storing project data.

### UI & UX

- **Shadcn UI (Radix UI)**: Accessible and highly customizable UI components.
- **Framer Motion**: Smooth animations and micro-interactions.
- **Lucide React**: Clean and consistent iconography.
- **Sonner**: Elegant toast notifications.

## ✨ Key Features

### Storefront (Public)

- **High-Impact Hero Section**: Dynamically configurable headline, subheadline, and CTA buttons.
- **Responsive Product Catalog**: Filterable by categories with support for product variants (sizes, colors, etc.).
- **Dynamic Cart System**: Seamless cart management with persistent data.
- **Order Tracking**: Users can view their order history and status.
- **Responsive Design**: Optimized for everything from small smartphones to large 4K displays.

### Admin Dashboard (Restricted)

- **Comprehensive Analytics**: Dashboard overview for store performance.
- **Product Management**:
  - Tabbed interface for Basic Info, Variants, and Image uploads.
  - In-page Category creation.
- **Order Management**: Manage order statuses with expandable details and logs.
- **User Management**:
  - Full control over user roles (SUPERADMIN, ADMIN, USER).
  - Secure permissions system preventing unauthorized modifications.
- **Testimonial Moderation**: Approve or hide customer reviews.
- **Store Configuration**: Centralized settings for store identity, SEO, contact info, and legal pages (Terms/Privacy).

### Security & Privacy

- **Strict Role-Based Access Control (RBAC)**: Only Admins and SuperAdmins can access the dashboard.
- **Database-Level Protection**: Security checks implemented at the Layout level to prevent URL tampering.
- **Middleware Integration**: Managed auth sessions and protected routes.

## 📁 Project Structure

```text
.
├── app/
│   ├── (auth)/                 # Authentication (Login, Register, Forgot Password)
│   ├── (dashboard)/            # Admin Dashboard Layout & Routes
│   │   └── dashboard/
│   │       ├── orders/         # Order List & Details Management
│   │       ├── products/       # Product CRUD & Inventory
│   │       ├── reviews/        # Review Moderation & Settings
│   │       ├── settings/       # Store Configuration (Hero, Support, SEO)
│   │       ├── testimonials/   # Testimonial Approval System
│   │       └── users/          # User Role & Permission Management
│   ├── (public)/              # Main Storefront Layout & Routes
│   │   ├── products/           # Product Catalog, Search & Details
│   │   ├── review/             # Magic Link Review Page
│   │   ├── privacy/            # Privacy Policy Page
│   │   └── terms/              # Terms of Service Page
│   ├── (user)/                # Customer Personal Area
│   │   ├── cart/               # Cart Management & Summary
│   │   ├── checkout/           # Checkout Form & WhatsApp Integration
│   │   ├── orders/             # Order History & Status Tracking
│   │   └── support/            # Customer Support Info
│   ├── api/                    # Helper API Routes (if any)
│   ├── not-found.tsx           # Custom 404 Error UI
│   ├── globals.css             # Global Styles & Tailwind Directives
│   └── layout.tsx              # Root Layout (Fonts, Providers, Toaster)
├── components/
│   ├── features/               # Feature-Specific Components
│   │   ├── admin/              # Admin Dashboard Modules
│   │   │   ├── dashboard/      # Statistics & Charts
│   │   │   ├── orders/         # Order Tables & Status Badges
│   │   │   ├── products/       # Product Forms & Image Upload
│   │   │   ├── store-settings/ # Store Config Forms
│   │   │   └── users/          # User Tables & Access Control
│   │   ├── auth/               # Access Control (LoginForm, RegisterForm)
│   │   ├── cart/               # Cart Logic (Context, Items, Summary)
│   │   ├── checkout/           # Checkout Logic (Form, WA Generator)
│   │   ├── home/               # Homepage Sections (Hero, Featured)
│   │   ├── product/            # Product UI (Cards, Gallery, Filters)
│   │   └── testimonial/        # Review UI (Carousel, Popups, Modals)
│   ├── layouts/                # Structural Components (Navbar, Footer, Sidebar)
│   ├── shared/                 # Reusable Utilities (Pagination, Price Format)
│   └── ui/                     # Primitives (Button, Dialog, Input...)
├── server/
│   ├── actions/                # Server Actions (Backend Logic)
│   │   ├── auth.actions.ts         # Authentication & Session
│   │   ├── dashboard.actions.ts    # Statistics & Reporting
│   │   ├── order.actions.ts        # Order CRUD & Persistence
│   │   ├── product.actions.ts      # Product Catalog Management
│   │   ├── store.actions.ts        # Store Configuration
│   │   └── user.actions.ts         # User Profile & Roles
│   ├── repositories/           # Database Query Layer
│   ├── schemas/                # Zod Validation Schemas
│   └── usecases/               # Business Logic Aggregation
├── prisma/                     # Database Schema & Migrations
│   ├── schema.prisma           # Database Models Definition
│   └── seed.ts                 # Initial Data Population Script
├── lib/                        # Core Configuration & Clients
│   ├── prisma.ts               # Prisma Client Singleton
│   ├── supabase/               # Supabase Auth Clients
│   ├── utils.ts                # Helper Functions
│   └── whatsapp.ts             # WhatsApp Link Generator
├── public/                     # Static Assets
├── next.config.ts              # Next.js Build Config
├── tailwind.config.ts          # Tailwind Theme Config
└── tsconfig.json               # TypeScript Config
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ installed.
- Supabase account and project.
- PostgreSQL database (Supabase DB or local).

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd my-ecommerce
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Database
   DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
   DIRECT_URL="postgresql://user:password@host:port/dbname?schema=public"
   ```

4. **Initialize Database**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **(Optional) Seed Data**:
   ```bash
   npm run prisma:seed
   ```

### Running Locally

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the store.

## 📦 Building for Production

```bash
npm run build
npm run start
```

## 🔐 Admin Access

To access the dashboard, a user must have the `ADMIN` or `SUPERADMIN` role in the `UserProfile` table. Default password and email should be set during the initial seeding or via manual database entry.
