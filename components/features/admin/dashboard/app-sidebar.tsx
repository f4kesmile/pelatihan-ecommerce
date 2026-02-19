"use client";

import * as React from "react";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  MessageSquare,
  Users,
  Store,
  User2,
  ChevronUp,
  LogOut,
  BadgeCheck,
  Bell,
} from "lucide-react";
import { UserProfile } from "@/types";
import { SettingsDialog } from "@/components/features/user/settings-dialog";
import { toast } from "sonner";
import { NotificationToast } from "./notification-toast";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const menuItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
  {
    title: "Testimonials",
    url: "/dashboard/testimonials",
    icon: MessageSquare,
  },
  { title: "Users", url: "/dashboard/users", icon: Users },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar({
  user,
  storeName,
  storeLogo,
  notifications,
}: {
  user?: Partial<UserProfile>;
  storeName?: string;
  storeLogo?: string | null;
  notifications?: {
    pendingOrders: number;
    lowStockVariants: number;
  };
}) {
  const pathname = usePathname();
  const { state, setOpenMobile, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const displayName = storeName || "Admin Panel";
  const [mounted, setMounted] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalNotifications =
    (notifications?.pendingOrders || 0) +
    (notifications?.lowStockVariants || 0);

  const handleNotificationClick = () => {
    toast.custom(
      (t) => (
        <NotificationToast
          notifications={notifications ?? null}
          totalNotifications={totalNotifications}
          t={t}
        />
      ),
      { duration: 8000 },
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={displayName}>
              <Link href="/dashboard" aria-label={displayName}>
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0 overflow-hidden relative">
                  {storeLogo ? (
                    <Image
                      src={storeLogo}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <LayoutDashboard className="size-5" />
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-bold text-lg tracking-tight">
                      {displayName}
                    </span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.url ||
                      pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.url}
                        aria-label={item.title}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <item.icon className="size-5 shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Store">
                  <Link href="/" aria-label="Back to Store">
                    <Store className="size-5 shrink-0" />
                    {!isCollapsed && <span>Back to Store</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {mounted ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    tooltip={user?.fullName || "Admin"}
                    aria-label={user?.fullName || "Admin"}
                  >
                    <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                      <User2 className="size-5" />
                    </div>
                    {!isCollapsed && (
                      <>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user?.fullName || "Admin"}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {user?.email || "admin@example.com"}
                          </span>
                        </div>
                        <ChevronUp className="ml-auto size-4" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <User2 className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.fullName || "Admin"}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user?.email || "admin@example.com"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsSettingsOpen(true)}
                    className="cursor-pointer"
                  >
                    <BadgeCheck className="mr-2 size-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 size-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleNotificationClick}
                    className="cursor-pointer"
                  >
                    <div className="relative">
                      <Bell className="mr-2 size-4" />
                      {totalNotifications > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
                      )}
                    </div>
                    Notifications
                    {totalNotifications > 0 && (
                      <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                        {totalNotifications}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      const { logout } =
                        await import("@/server/actions/auth.actions");
                      await logout();
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton
                size="lg"
                tooltip={user?.fullName || "Admin"}
                aria-label={user?.fullName || "Admin"}
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                  <User2 className="size-5" />
                </div>
                {!isCollapsed && (
                  <>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.fullName || "Admin"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email || "admin@example.com"}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto size-4" />
                  </>
                )}
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {user && (
        <SettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          user={{
            fullName: user.fullName || "",
            phone: user.phone,
            city: user.city,
            address: user.address,
            avatarBase64: user.avatarBase64,
          }}
        />
      )}
    </Sidebar>
  );
}
