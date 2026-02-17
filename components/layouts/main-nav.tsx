"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/products",
      label: "Products",
      active: pathname === "/products" || pathname.startsWith("/products/"),
    },
    {
      href: "/orders",
      label: "Orders",
      active: pathname === "/orders" || pathname.startsWith("/orders/"),
    },
    {
      href: "/support",
      label: "Support",
      active: pathname === "/support" || pathname.startsWith("/support/"),
    },
  ];

  return (
    <nav
      className={cn(
        "hidden md:flex items-center gap-6 text-sm font-medium",
        className,
      )}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "transition-colors hover:text-foreground/80 py-1",
            route.active
              ? "text-foreground border-b-2 border-primary"
              : "text-foreground/60 border-b-2 border-transparent",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
