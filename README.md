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
│   ├── (auth)/                 # Authentication routes (Login, Register)
│   ├── (dashboard)/            # Admin Dashboard (Protected)
│   │   ├── dashboard/          # Main dashboard views
│   │   │   ├── orders/         # Order management
│   │   │   ├── products/       # Product management
│   │   │   ├── settings/       # Store settings
│   │   │   ├── testimonials/   # Testimonial moderation
│   │   │   └── users/          # User & Role management
│   │   └── layout.tsx          # Dashboard layout with strict role checks
│   ├── (public)/              # Core storefront routes
│   │   ├── products/           # Product catalog & details
│   │   ├── privacy/            # Privacy policy
│   │   ├── terms/              # Terms of service
│   │   ├── layout.tsx          # Public theme layout
│   │   └── page.tsx            # Home page (Hero, Featured, etc.)
│   ├── (user)/                # User-specific routes (Cart, Order History)
│   ├── api/                    # API route handlers
│   ├── globals.css             # Global Tailwind styles
│   └── layout.tsx              # Root HTML layout
├── components/
│   ├── features/               # Domain-specific feature components
│   │   ├── admin/              # Dashboard-specific features (ProductsList, UsersList, etc.)
│   │   ├── auth/               # Identity & Access components
│   │   ├── cart/               # Shopping cart logic
│   │   ├── home/               # Landing page sections (Hero)
│   │   ├── product/            # Product display logic
│   │   └── testimonial/        # Review & Rating components
│   ├── layouts/                # Shared UI structures (Navbar, Footer, Sidebar)
│   ├── shared/                 # Generic reusable components (ThemeToggle)
│   └── ui/                     # Base UI components (Button, Input, Dialog, etc.)
├── server/
│   ├── actions/                # Next.js Server Actions (The "Backend")
│   │   ├── auth.actions.ts         # User authentication logic
│   │   ├── product.actions.ts      # Product CRUD & logic
│   │   ├── user.actions.ts         # Profile & Role management
│   │   ├── order.actions.ts        # Checkout & Order processing
│   │   └── store.actions.ts        # Store configuration logic
│   ├── schemas/                # Zod validation schemas
│   │   ├── product.schema.ts
│   │   ├── user.schema.ts
│   │   └── store.schema.ts
│   ├── repositories/           # Database abstraction layer
│   └── usecases/               # Complex business logic
├── prisma/                     # Database layer
│   ├── schema.prisma           # Prisma model definitions
│   └── seed.ts                 # Initial data seeding script
├── lib/                        # Shared library initializations
│   ├── prisma.ts               # Prisma client singleton
│   └── supabase/               # Supabase client config (Server/Client)
├── utils/                      # Formatting & helper utilities
├── public/                     # Static assets (Logos, Icons)
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies & scripts
├── tailwind.config.ts          # Tailwind CSS theme configuration
└── tsconfig.json               # TypeScript configuration
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
