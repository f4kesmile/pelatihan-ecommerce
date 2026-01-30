"use client";

import * as React from "react";
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
} from "lucide-react";
import { UserProfile } from "@/types";

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
}: {
  user?: Partial<UserProfile>;
  storeName?: string;
  storeLogo?: string | null;
}) {
  const pathname = usePathname();
  const { state, setOpenMobile, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const displayName = storeName || "Admin Panel";
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={displayName}>
              <Link href="/dashboard">
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
                    <span className="font-semibold">{displayName}</span>
                    <span className="text-xs text-muted-foreground">
                      v1.0.0
                    </span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
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

        {/* Back to Store */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Store">
                  <Link href="/">
                    <Store className="size-5 shrink-0" />
                    {!isCollapsed && <span>Back to Store</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User */}
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
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem
                    onClick={async () => {
                      const { logout } =
                        await import("@/server/actions/auth.actions");
                      await logout();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton size="lg" tooltip={user?.fullName || "Admin"}>
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
    </Sidebar>
  );
}
