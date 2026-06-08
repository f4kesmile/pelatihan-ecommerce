import Link from "next/link";
import { User, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { MainNav } from "./main-nav";
import { CartSheet } from "@/components/features/cart/cart-sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getStoreConfig } from "@/server/actions/store.actions";
import { getUserProfile } from "@/server/actions/user.actions";

import { createClient } from "@/lib/supabase/server";
import { UserNav } from "@/components/features/auth/user-nav";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="relative w-full flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileNav userProfile={userProfile} />
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">{storeName}</span>
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
          <MainNav />
        </div>

        <nav className="flex items-center gap-2">
          {(userProfile?.role === "ADMIN" ||
            userProfile?.role === "SUPERADMIN") && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex"
                    >
                      <LayoutGrid className="h-5 w-5" />
                      <span className="sr-only">Dashboard</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Admin Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <ThemeToggle />
          <CartSheet />

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
