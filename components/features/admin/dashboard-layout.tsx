"use client";

import { AppSidebar } from "@/components/features/admin/app-sidebar";
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
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={user} storeName={storeName} storeLogo={storeLogo} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="font-semibold text-sm">Dashboard</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
