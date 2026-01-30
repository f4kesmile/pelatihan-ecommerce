"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserProfile } from "@/types";

interface MobileNavProps {
  userProfile: UserProfile | null;
}

export function MobileNav({ userProfile }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            Products
          </Link>
          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/support"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            Support
          </Link>
          {(userProfile?.role === "ADMIN" ||
            userProfile?.role === "SUPERADMIN") && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
