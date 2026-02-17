"use client";

import { useEffect } from "react";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserProfile } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  user?: Partial<UserProfile>;
  storeName?: string;
  storeLogo?: string | null;
}

export function DashboardLayout({
  children,
  defaultOpen = true,
  user,
  storeName,
  storeLogo,
}: DashboardLayoutProps) {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={user} storeName={storeName} storeLogo={storeLogo} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger aria-label="Toggle Sidebar" />
          <Separator orientation="vertical" className="h-4" />
          <span className="font-semibold text-sm">Dashboard</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 min-h-0 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
