import Link from "next/link";
import { User, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { CartSheet } from "@/components/features/cart/cart-sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getStoreConfig } from "@/server/actions/store.actions";
import { getUserProfile } from "@/server/actions/user.actions";

import { createClient } from "@/lib/supabase/server";
import { UserNav } from "@/components/features/auth/user-nav";

export async function Navbar() {
  const config = await getStoreConfig();
  const storeName = config?.storeName || "E-COMMERCE";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProfile = user ? await getUserProfile() : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Mobile Menu */}
        <MobileNav userProfile={userProfile} />

        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-6 lg:gap-8 flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">{storeName}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Products
            </Link>
            <Link
              href="/orders"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Orders
            </Link>
            <Link
              href="/support"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Support
            </Link>
          </nav>
        </div>

        {/* Actions - Always at the far right */}
        <nav className="flex items-center gap-2">
          {(userProfile?.role === "ADMIN" ||
            userProfile?.role === "SUPERADMIN") && (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          )}
          <ThemeToggle />
          <CartSheet />

          {/* User Profile or Login Link */}
          {user ? (
            <UserNav
              user={{
                email: user.email,
                full_name: user.user_metadata?.full_name,
              }}
              userProfile={userProfile}
            />
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
