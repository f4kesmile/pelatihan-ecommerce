# Project Structure Documentation

This document explains the complete project organization for educational purposes.

## 📁 Complete Directory Structure

```
ecommerce/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication pages (grouped route)
│   ├── (dashboard)/              # Admin dashboard pages (grouped route)
│   ├── (public)/                 # Public pages (grouped route)
│   └── (user)/                   # User-specific pages (grouped route)
│
├── components/                   # React components
│   ├── features/                 # Feature-specific components
│   │   ├── admin/               # Admin dashboard components
│   │   ├── auth/                # Authentication components
│   │   ├── cart/                # Shopping cart components
│   │   ├── checkout/            # Checkout process components
│   │   ├── home/                # Homepage components
│   │   ├── product/             # Product display components
│   │   └── user/                # User profile components
│   ├── layouts/                  # Layout components (navbar, footer)
│   ├── shared/                   # Reusable shared components
│   └── ui/                       # Base UI components (shadcn/ui)
│
├── lib/                          # Third-party library configurations
│   ├── prisma/                  # Database client initialization
│   ├── supabase/                # Authentication client setup
│   └── utils.ts                 # Utility helpers (cn, etc)
│
├── server/                       # Server-side code
│   └── actions/                 # Server actions (API endpoints)
│       ├── auth.actions.ts      # Authentication actions
│       ├── product.actions.ts   # Product CRUD actions
│       ├── order.actions.ts     # Order management actions
│       └── user.actions.ts      # User management actions
│
├── types/                        # TypeScript type definitions
│   ├── models/                  # Database model types
│   ├── components/              # Component prop types
│   ├── forms/                   # Form state types
│   └── index.ts                 # Central exports
│
├── utils/                        # Utility functions
│   ├── supabase/                # Supabase-specific utilities
│   └── (TODO: organize helpers)
│
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma            # Database schema definition
│   └── seed.ts                  # Database seeding script
│
├── public/                       # Static assets
│   └── assets/                  # Images, icons, etc
│
└── Configuration Files
    ├── .env                      # Environment variables
    ├── next.config.ts           # Next.js configuration
    ├── tailwind.config.ts       # Tailwind CSS configuration
    ├── tsconfig.json            # TypeScript configuration
    └── package.json             # Dependencies and scripts
```

## 🎯 Folder Purposes

### `/app` - Application Routes

Uses Next.js 14 App Router with route groups for organization:

- `(auth)` - Login, register pages (public)
- `(dashboard)` - Admin pages (protected, RBAC)
- `(public)` - Products, about, etc (accessible to all)
- `(user)` - Cart, checkout, profile (requires login)

### `/components` - React Components

Organized by feature domain for scalability:

- `features/` - Business logic components grouped by feature
- `layouts/` - Page structure components (navbar, footer)
- `shared/` - Reusable components across features
- `ui/` - Base design system components (buttons, inputs)

### `/types` - TypeScript Definitions

See [types/README.md](../types/README.md) for detailed structure.

- `models/` - Database entity types
- `components/` - React component props
- `forms/` - Form state and validation

### `/server/actions` - Server Functions

Next.js Server Actions for backend logic:

- One file per domain (auth, product, order, etc)
- Uses `"use server"` directive
- Returns typed results for client consumption

### `/lib` - Library Configurations

Third-party tool initialization:

- `prisma/` - Database client singleton
- `supabase/` - Auth client for server/client
- `utils.ts` - Helper utilities (cn function)

### `/utils` - Utility Functions

Pure functions and helpers:

- `supabase/` - Supabase-specific utilities
- (Planned) `formatting/` - Date, money formatting
- (Planned) `validation/` - Custom validators

## 📚 Educational Benefits

This structure teaches:

1. **Separation of Concerns**
   - Clear boundaries between UI, logic, and data

2. **Scalability**
   - Easy to add new features without conflicts
   - Domain-driven organization

3. **Maintainability**
   - Predictable file locations
   - Logical grouping reduces cognitive load

4. **Professional Standards**
   - Industry-standard folder structure
   - TypeScript-first approach
   - Clear naming conventions

## 🔧 Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Types**: PascalCase (e.g., `UserProfile`)
- **Folders**: lowercase with hyphens for features

## 📖 Next Steps for Organization

Consider adding:

- `/hooks` - Custom React hooks
- `/constants` - App-wide constants
- `/utils/formatting` - Formatting utilities
- `/utils/validation` - Custom validators
- `/middleware` - Request/response middleware
- `/config` - App configuration files
